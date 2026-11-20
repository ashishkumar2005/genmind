import { NextResponse } from 'next/server';
import { forms, validate, type FormType } from '@/lib/forms';
import { clientIp, rateLimit } from '@/lib/rateLimit';
import { recordSync } from '@/lib/syncStatus';
import { saveLead } from '@/lib/leadStore';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs'; // needs the file system for built-in lead storage

const TYPES = Object.keys(forms) as FormType[];
const MAX_BODY = 16_000;

/**
 * Receives every website form.
 * Security: same-origin check, body size limit, honeypot, minimum fill time,
 * rate limiting (5 per 10 min per IP), server-side validation, field allow-list.
 * Delivery: forwarded to LEAD_WEBHOOK_URL (CRM / email automation) when it is set. Without a webhook,
 * or if the webhook fails, the lead is saved by the built-in store (src/lib/leadStore.ts) and listed at
 * /internal/leads. Only if that also fails is the visitor asked to email or call, so a lead is never
 * silently lost.
 */
export async function POST(req: Request) {
  const origin = req.headers.get('origin');
  const host = req.headers.get('host');
  if (origin && host) {
    // A browser sends "null" from sandboxed frames and file:// pages; any unparsable origin is refused, never a crash.
    let originHost = '';
    try { originHost = new URL(origin).host; } catch { /* refused below */ }
    if (originHost !== host) {
      return NextResponse.json({ ok: false, message: 'Invalid request origin.' }, { status: 403 });
    }
  }

  const rl = rateLimit(`lead:${clientIp(req.headers)}`, 5, 10 * 60 * 1000);
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, message: `Too many submissions. Please wait ${Math.ceil(rl.retryAfter / 60)} minute(s) and try again, or call us.` },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } },
    );
  }

  const raw = await req.text();
  if (raw.length > MAX_BODY) return NextResponse.json({ ok: false, message: 'Your message is too long.' }, { status: 413 });

  let body: { type?: string; variant?: string; data?: Record<string, unknown>; elapsedMs?: number; page?: string };
  try { body = JSON.parse(raw); } catch { return NextResponse.json({ ok: false, message: 'Invalid request.' }, { status: 400 }); }

  const type = body.type as FormType;
  if (!TYPES.includes(type) || !body.data || typeof body.data !== 'object') {
    return NextResponse.json({ ok: false, message: 'Invalid request.' }, { status: 400 });
  }

  // Bots: honeypot filled or form submitted in under 2 seconds. Pretend success so bots don't adapt.
  if (body.data.website || (typeof body.elapsedMs === 'number' && body.elapsedMs < 2000)) {
    return NextResponse.json({ ok: true });
  }

  // Allow-list: keep only defined fields (+ lead-magnet context), as trimmed strings.
  const allowed = new Set([...forms[type].fields.map((f) => f.name), 'resource']);
  const data: Record<string, string> = {};
  for (const [k, v] of Object.entries(body.data)) {
    if (allowed.has(k) && typeof v === 'string') data[k] = v.trim().slice(0, 2000);
  }

  const variant = body.variant === 'short' ? 'short' : 'full';
  const errors = validate(type, data, variant);
  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, errors, message: 'Please check the highlighted fields.' }, { status: 422 });
  }

  const lead = {
    type,
    variant,
    data,
    page: typeof body.page === 'string' ? body.page.slice(0, 200) : undefined,
    submittedAt: new Date().toISOString(),
  };

  const webhook = process.env.LEAD_WEBHOOK_URL;
  // LEAD_DRY_RUN=true is for CI/staging only: accepts and logs without forwarding.
  if (process.env.LEAD_DRY_RUN === 'true') {
    console.info(JSON.stringify({ evt: 'crm_sync', ok: true, dryRun: true, type }));
    recordSync(true, 'dry run');
    return NextResponse.json({ ok: true });
  }
  if (!webhook) {
    try {
      await saveLead({ ...lead, delivery: 'stored' });
      recordSync(true, 'stored on server (no webhook)');
      console.info(JSON.stringify({ evt: 'crm_sync', ok: true, stored: true, type }));
      return NextResponse.json({ ok: true });
    } catch (err) {
      recordSync(false, `store failed: ${String(err)}`);
      console.error(JSON.stringify({ evt: 'crm_sync', ok: false, stored: false, type, error: String(err) }));
      return NextResponse.json({ ok: false, message: 'Our form is temporarily unavailable. Please email or call us instead.' }, { status: 503 });
    }
  }

  try {
    const res = await fetch(webhook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.LEAD_WEBHOOK_SECRET ? { Authorization: `Bearer ${process.env.LEAD_WEBHOOK_SECRET}` } : {}),
      },
      body: JSON.stringify(lead),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
    recordSync(true);
    console.info(JSON.stringify({ evt: 'crm_sync', ok: true, type }));
    return NextResponse.json({ ok: true });
  } catch (err) {
    // The webhook failed: keep the lead on the server so it is not lost, and flag it for follow-up.
    console.error(JSON.stringify({ evt: 'crm_sync', ok: false, type, error: String(err) }));
    try {
      await saveLead({ ...lead, delivery: 'stored-webhook-failed' });
      recordSync(false, `webhook failed, stored on server: ${String(err)}`);
      return NextResponse.json({ ok: true });
    } catch {
      recordSync(false, String(err));
      return NextResponse.json({ ok: false, message: 'We could not send your details just now. Please try again in a minute, or email or call us.' }, { status: 502 });
    }
  }
}
