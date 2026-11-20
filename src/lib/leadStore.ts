import { randomUUID } from 'node:crypto';
import { appendFile, mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';

/**
 * Built-in lead storage, so form submissions are kept even when no CRM webhook is connected.
 *
 * Two backends, chosen automatically:
 * 1. Redis (Upstash) — used when its REST URL and token are set. This is the one for Vercel:
 *    add "Upstash for Redis" from the Vercel Marketplace (free tier) and Vercel sets
 *    KV_REST_API_URL / KV_REST_API_TOKEN (or UPSTASH_REDIS_REST_URL / _TOKEN) for you.
 * 2. A file on disk (LEADS_FILE, default .data/leads.jsonl) — for your own computer or a server with a
 *    persistent disk. On Vercel the disk is read-only, so without Redis saving fails and the visitor is
 *    asked to email or call instead of the lead being lost silently.
 *
 * Either way the data is personal data: keep access behind INTERNAL_USER / INTERNAL_PASSWORD and delete
 * leads after 24 months (see /privacy).
 */
export type StoredLead = {
  id: string;
  type: string;
  variant: string;
  data: Record<string, string>;
  page?: string;
  submittedAt: string;
  delivery: 'stored' | 'stored-webhook-failed';
};

const REDIS_KEY = 'genminded:leads';
const MAX_LEADS = 5000; // the list is trimmed to the newest 5,000 so it can never grow without limit

function redisConfig() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url: url.replace(/\/$/, ''), token } : null;
}

/** Runs one Redis command through Upstash's REST API (no extra package needed). */
async function redis(cmd: (string | number)[]) {
  const cfg = redisConfig()!;
  const res = await fetch(cfg.url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${cfg.token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmd),
    cache: 'no-store',
    signal: AbortSignal.timeout(8000),
  });
  const json = (await res.json().catch(() => ({}))) as { result?: unknown; error?: string };
  if (!res.ok || json.error) throw new Error(`Redis ${res.status}: ${json.error ?? 'request failed'}`);
  return json.result;
}

export function leadsFile() {
  return process.env.LEADS_FILE || path.join(process.cwd(), '.data', 'leads.jsonl');
}

/** Where leads are kept, for the internal page. */
export function leadStoreKind(): 'redis' | 'file' {
  return redisConfig() ? 'redis' : 'file';
}

export async function saveLead(lead: Omit<StoredLead, 'id'>): Promise<StoredLead> {
  const full: StoredLead = { id: randomUUID(), ...lead };
  if (redisConfig()) {
    await redis(['LPUSH', REDIS_KEY, JSON.stringify(full)]);
    await redis(['LTRIM', REDIS_KEY, 0, MAX_LEADS - 1]).catch(() => { /* trimming is housekeeping only */ });
    return full;
  }
  const file = leadsFile();
  await mkdir(path.dirname(file), { recursive: true });
  await appendFile(file, `${JSON.stringify(full)}\n`, { encoding: 'utf8', mode: 0o600 });
  return full;
}

/** Newest first. A damaged entry is skipped rather than hiding every other lead. */
export async function readLeads(): Promise<StoredLead[]> {
  const parse = (lines: string[]) => {
    const out: StoredLead[] = [];
    for (const line of lines) {
      if (!line || !line.trim()) continue;
      try { out.push(JSON.parse(line) as StoredLead); } catch { /* skip damaged entry */ }
    }
    return out;
  };
  if (redisConfig()) {
    const items = (await redis(['LRANGE', REDIS_KEY, 0, -1])) as string[] | null;
    return parse(items ?? []); // LPUSH keeps the newest first already
  }
  let raw = '';
  try { raw = await readFile(leadsFile(), 'utf8'); } catch { return []; }
  return parse(raw.split('\n')).reverse();
}
