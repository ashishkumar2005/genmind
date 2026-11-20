'use client';

import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';
import { OPEN_SETTINGS_EVENT, readConsent, writeConsent } from '@/lib/consent';

/**
 * Non-blocking consent banner (does not cover content or trap focus).
 * "Accept all" and "Reject non-essential" are equally prominent, as DPDP/GDPR guidance expects.
 */
export function ConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [widgets, setWidgets] = useState(false);
  const headingId = useId();
  const regionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const existing = readConsent();
    if (!existing) setVisible(true);
    else { setAnalytics(existing.analytics); setWidgets(existing.widgets); }

    const open = () => {
      const c = readConsent();
      setAnalytics(c?.analytics ?? false);
      setWidgets(c?.widgets ?? false);
      setShowDetails(true);
      setVisible(true);
      setTimeout(() => regionRef.current?.focus(), 0);
    };
    window.addEventListener(OPEN_SETTINGS_EVENT, open);
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, open);
  }, []);

  if (!visible) return null;

  const save = (a: boolean, w: boolean) => { writeConsent(a, w); setVisible(false); };

  return (
    <section ref={regionRef} className="consent" role="region" aria-labelledby={headingId} tabIndex={-1}>
      <h2 id={headingId}>Your privacy choices</h2>
      <p>
        We use essential storage to run this site. With your permission we would also like to use analytics to
        understand which pages help visitors, and to load the WhatsApp chat button. You can change this at any time
        from “Cookie settings” in the footer. <Link href="/cookies">Read the cookie policy</Link>.
      </p>

      {showDetails && (
        <fieldset style={{ border: 0, padding: 0, margin: '0 0 1rem' }}>
          <legend className="visually-hidden">Choose which optional cookies to allow</legend>
          <label className="check">
            <input type="checkbox" checked disabled />
            <span><strong>Essential</strong> — always on. Remembers your choices and keeps forms secure.</span>
          </label>
          <label className="check">
            <input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} />
            <span><strong>Analytics</strong> — Google Analytics / Plausible and Microsoft Clarity (form fields are masked).</span>
          </label>
          <label className="check">
            <input type="checkbox" checked={widgets} onChange={(e) => setWidgets(e.target.checked)} />
            <span><strong>Third-party widgets</strong> — WhatsApp chat button.</span>
          </label>
        </fieldset>
      )}

      <div className="btn-row">
        <button type="button" className="btn btn--primary" onClick={() => save(true, true)}>Accept all</button>
        <button type="button" className="btn btn--primary" onClick={() => save(false, false)}>Reject non-essential</button>
        {showDetails ? (
          <button type="button" className="btn btn--secondary" onClick={() => save(analytics, widgets)}>Save my choices</button>
        ) : (
          <button type="button" className="btn btn--secondary" onClick={() => setShowDetails(true)}>Choose</button>
        )}
      </div>
    </section>
  );
}
