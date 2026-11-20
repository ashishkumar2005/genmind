'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { track } from '@/lib/analytics';

export function TrackedLink({ href, cta, location, className = 'btn btn--primary', children }: {
  href: string; cta: string; location: string; className?: string; children: ReactNode;
}) {
  return (
    <Link href={href} className={className} onClick={() => track('cta_click', { cta, location })}>
      {children}
    </Link>
  );
}
