import { NextResponse } from 'next/server';
import { clientIp, rateLimit } from '@/lib/rateLimit';
import { recordEvent } from '@/lib/funnel';

export const dynamic = 'force-dynamic';

const ALLOWED = new Set(['page_view', 'cta_click', 'form_start', 'form_submit', 'form_error', 'lead_magnet_request', 'finder_complete', 'ab_exposure']);

/**
 * First-party, cookieless funnel events. Stores no IP, name or email.
 * Each event is logged as one JSON line (picked up by your host's log drain)
 * and counted in memory for the internal funnel view.
 */
export async function POST(req: Request) {
  if (!rateLimit(`evt:${clientIp(req.headers)}`, 120, 60_000).ok) return new NextResponse(null, { status: 429 });
  const raw = await req.text();
  if (raw.length > 2000) return new NextResponse(null, { status: 413 });
  try {
    const e = JSON.parse(raw) as Record<string, unknown>;
    if (typeof e.event !== 'string' || !ALLOWED.has(e.event)) return new NextResponse(null, { status: 400 });
    const clean: Record<string, string | number | boolean> = {};
    for (const [k, v] of Object.entries(e)) {
      if (['string', 'number', 'boolean'].includes(typeof v) && k.length < 40) clean[k] = typeof v === 'string' ? v.slice(0, 120) : (v as number | boolean);
    }
    recordEvent(clean);
    console.info(JSON.stringify({ evt: 'funnel', ts: new Date().toISOString(), ...clean }));
  } catch {
    return new NextResponse(null, { status: 400 });
  }
  return new NextResponse(null, { status: 204 });
}
