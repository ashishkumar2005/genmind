'use client';

import { readConsent } from './consent';

/**
 * Funnel instrumentation:
 *   page_view → cta_click → form_start → form_submit → crm_sync (server-side)
 *
 * Every event is sent to the first-party endpoint /api/events (no cookies, no
 * personal data) so the funnel can be measured even when analytics cookies are
 * declined. If the visitor accepted analytics, the same event is also pushed
 * to GA4 / Plausible.
 */

export type FunnelEvent = 'page_view' | 'cta_click' | 'form_start' | 'form_submit' | 'form_error' | 'lead_magnet_request' | 'finder_complete' | 'ab_exposure';

type Props = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    plausible?: (event: string, opts?: { props?: Props }) => void;
  }
}

export function track(event: FunnelEvent, props: Props = {}) {
  if (typeof window === 'undefined') return;
  const payload = { event, path: window.location.pathname, ...props };

  try {
    const body = JSON.stringify(payload);
    if (navigator.sendBeacon) navigator.sendBeacon('/api/events', new Blob([body], { type: 'application/json' }));
    else void fetch('/api/events', { method: 'POST', body, headers: { 'Content-Type': 'application/json' }, keepalive: true });
  } catch { /* never break the page for analytics */ }

  const consent = readConsent();
  if (!consent?.analytics) return;
  window.gtag?.('event', event, props);
  window.plausible?.(event, { props });
}
