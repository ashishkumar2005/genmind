'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const SELECTOR = [
  'main .section h2', 'main .section-title', 'main .card', 'main .audience', 'main .domx',
  'main .table-wrap', 'main .prose > *', 'main .btn-row', 'main .cta-band',
].join(',');

/**
 * Fades sections and cards up as they scroll into view, with a small stagger between siblings.
 * Content is only hidden after this script runs (html.js-reveal), so nothing disappears without JS,
 * and the CSS skips the effect for reduced motion or "Reduce effects".
 */
export function RevealOnScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const els = Array.from(document.querySelectorAll<HTMLElement>(SELECTOR))
      .filter((el) => !el.closest('.page-header, .hero'));
    // (Elements already marked by an earlier run are processed again: React may run this effect twice.)
    els.forEach((el) => {
      el.classList.add('reveal');
      const sibs = el.parentElement ? Array.from(el.parentElement.children).filter((c) => c.matches(SELECTOR)) : [];
      const i = sibs.indexOf(el);
      if (i > 0) el.style.setProperty('--reveal-delay', `${Math.min(i, 4) * 90}ms`);
    });
    root.classList.add('js-reveal');

    // Show each element once its top edge is within the bottom 8% of the screen. A plain scroll check
    // (throttled to one per frame) is used rather than IntersectionObserver, which can miss elements
    // in some embedded and zoomed views and would leave them hidden.
    let pending = els.filter((el) => !el.classList.contains('is-in'));
    let raf = 0;
    const check = () => {
      raf = 0;
      const limit = window.innerHeight * 0.92;
      pending = pending.filter((el) => {
        if (el.getBoundingClientRect().top < limit) { el.classList.add('is-in'); return false; }
        return true;
      });
      if (pending.length === 0) remove();
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(check); };
    const remove = () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    check();
    return () => { remove(); if (raf) cancelAnimationFrame(raf); };
  }, [pathname]);

  return null;
}
