'use client';

/**
 * Cookie/consent state (DPDP Act 2023 and GDPR-aware).
 * - Strictly necessary storage is always on (it only remembers this choice).
 * - Analytics (GA4 / Plausible / Microsoft Clarity) and third-party widgets
 *   (WhatsApp) load ONLY after the visitor opts in.
 * - The choice is remembered for 12 months, then the visitor is asked again.
 */

export type Consent = { v: 1; analytics: boolean; widgets: boolean; ts: number };

const KEY = 'genminded-consent';
const MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;
export const CONSENT_EVENT = 'genminded:consent-change';
export const OPEN_SETTINGS_EVENT = 'genminded:open-consent';

export function readConsent(): Consent | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const c = JSON.parse(raw) as Consent;
    if (c.v !== 1 || Date.now() - c.ts > MAX_AGE_MS) return null;
    return c;
  } catch {
    return null;
  }
}

export function writeConsent(analytics: boolean, widgets: boolean) {
  const c: Consent = { v: 1, analytics, widgets, ts: Date.now() };
  try { window.localStorage.setItem(KEY, JSON.stringify(c)); } catch { /* storage unavailable: keep for this page only */ }
  window.dispatchEvent(new CustomEvent<Consent>(CONSENT_EVENT, { detail: c }));
}

export function openConsentSettings() {
  window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT));
}
