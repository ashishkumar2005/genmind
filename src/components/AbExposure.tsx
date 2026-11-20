'use client';

import { useEffect } from 'react';
import { track } from '@/lib/analytics';

/** Logs that a visitor saw a test variant, so conversion rate per variant can be calculated. */
export function AbExposure({ test, variant }: { test: string; variant: string }) {
  useEffect(() => { track('ab_exposure', { test, variant }); }, [test, variant]);
  return null;
}
