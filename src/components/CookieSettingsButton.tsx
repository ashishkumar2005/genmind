'use client';

import { openConsentSettings } from '@/lib/consent';

export function CookieSettingsButton({ className = 'link-button', label = 'Cookie settings' }: { className?: string; label?: string }) {
  return (
    <button type="button" className={className} onClick={openConsentSettings}>
      {label}
    </button>
  );
}
