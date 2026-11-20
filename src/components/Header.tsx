'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Wordmark } from './Wordmark';
import { track } from '@/lib/analytics';

const NAV = [
  { href: '/solutions/schools', label: 'Schools' },
  { href: '/solutions/colleges', label: 'Colleges' },
  { href: '/solutions/students', label: 'Students' },
  { href: '/labs', label: 'Labs' },
  { href: '/resources', label: 'Resources' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); toggleRef.current?.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Wordmark />
        <button
          ref={toggleRef}
          type="button"
          className="btn btn--secondary nav-toggle"
          aria-expanded={open}
          aria-controls="site-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((o) => !o)}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            {open ? <path d="M5 5l10 10M15 5 5 15" /> : <path d="M3 6h14M3 10h14M3 14h14" />}
          </svg>
        </button>
        <nav id="site-nav" className="site-nav" aria-label="Main" data-open={open}>
          <ul className="nav-list">
            {NAV.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link href={item.href} aria-current={active ? 'page' : undefined} onClick={() => setOpen(false)}>{item.label}</Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <Link
          href="/book-consultation"
          className="btn btn--primary header-cta"
          onClick={() => track('cta_click', { cta: 'book_consultation', location: 'header' })}
        >
          Book a consultation
        </Link>
      </div>
    </header>
  );
}
