'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import { CONSENT_EVENT, readConsent, type Consent } from '@/lib/consent';

const GA4 = process.env.NEXT_PUBLIC_GA4_ID;
const PLAUSIBLE = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
const CLARITY = process.env.NEXT_PUBLIC_CLARITY_ID;
const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

/**
 * Loads every third-party script ONLY after consent, and always with
 * `afterInteractive`/`lazyOnload` so none of them block rendering.
 * If consent is withdrawn, scripts already loaded stay until the next page load
 * (the reload is triggered so they are actually removed).
 */
export function ThirdPartyScripts() {
  const [consent, setConsent] = useState<Consent | null>(null);

  useEffect(() => {
    setConsent(readConsent());
    const onChange = (e: Event) => {
      const next = (e as CustomEvent<Consent>).detail;
      setConsent((prev) => {
        const withdrawn = (prev?.analytics && !next.analytics) || (prev?.widgets && !next.widgets);
        if (withdrawn) window.location.reload();
        return next;
      });
    };
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_EVENT, onChange);
  }, []);

  return (
    <>
      {consent?.analytics && GA4 && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA4}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA4}',{anonymize_ip:true});`}
          </Script>
        </>
      )}
      {consent?.analytics && PLAUSIBLE && (
        <Script src="https://plausible.io/js/script.js" data-domain={PLAUSIBLE} strategy="afterInteractive" />
      )}
      {consent?.analytics && CLARITY && (
        // Clarity masks inputs by default; we also add data-clarity-mask on every form.
        <Script id="clarity-init" strategy="lazyOnload">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CLARITY}");`}
        </Script>
      )}
      {consent?.widgets && WHATSAPP && (
        <a
          href={`https://wa.me/${WHATSAPP}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn--primary"
          style={{ position: 'fixed', right: 16, bottom: 88, zIndex: 55, borderRadius: 999, background: '#047857' }}
        >
          WhatsApp us<span className="visually-hidden"> (opens in a new tab)</span>
        </a>
      )}
    </>
  );
}
