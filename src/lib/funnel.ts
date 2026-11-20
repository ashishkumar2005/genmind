/**
 * In-memory funnel counters for the internal dashboard.
 * Resets on deploy/restart and is per-instance. For durable reporting,
 * use GA4/Plausible funnels or ship the JSON log lines to a database (ADR-0004).
 */
type Counts = { stages: Record<string, number>; ab: Record<string, { exposure: number; submit: number }>; since: string };

const g = globalThis as unknown as { __genmindedFunnel?: Counts };
g.__genmindedFunnel ??= { stages: {}, ab: {}, since: new Date().toISOString() };

export const FUNNEL_STAGES = ['page_view', 'cta_click', 'form_start', 'form_submit'] as const;

export function recordEvent(e: Record<string, string | number | boolean>) {
  const c = g.__genmindedFunnel!;
  const name = String(e.event);
  c.stages[name] = (c.stages[name] ?? 0) + 1;
  if (name === 'ab_exposure' && e.test && e.variant) {
    const key = `${e.test}:${e.variant}`;
    c.ab[key] ??= { exposure: 0, submit: 0 };
    c.ab[key].exposure++;
  }
  if (name === 'form_submit' && e.variant && e.form === 'consultation') {
    const key = `consultation_form_length:${e.variant}`;
    c.ab[key] ??= { exposure: 0, submit: 0 };
    c.ab[key].submit++;
  }
}

export function getFunnel(): Counts {
  return JSON.parse(JSON.stringify(g.__genmindedFunnel));
}
