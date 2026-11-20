'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { company } from '@/content/site';
import { track } from '@/lib/analytics';

const HIDE_ON = ['/book-consultation', '/enquiry', '/quote', '/thank-you', '/contact'];

/** Mobile-only bottom bar. Hides while the visitor scrolls down and on form pages, so it never gets in the way. */
export function StickyCta() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > last && y > 300);
      last = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (HIDE_ON.some((p) => pathname.startsWith(p))) return null;

  return (
    <div className="sticky-cta" data-hidden={hidden} role="complementary" aria-label="Quick actions">
      {company.phone && (
        <a className="btn btn--secondary" href={`tel:${company.phone.replace(/[^+\d]/g, '')}`} onClick={() => track('cta_click', { cta: 'call', location: 'sticky' })}>
          Call us
        </a>
      )}
      <Link className="btn btn--primary" href="/book-consultation" onClick={() => track('cta_click', { cta: 'book_consultation', location: 'sticky' })}>
        Book a consultation
      </Link>
    </div>
  );
}
