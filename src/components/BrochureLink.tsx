'use client';

import { brochure } from '@/content/site';
import { track } from '@/lib/analytics';

/**
 * Direct download of the company brochure (PDF). No form in the way: institutions comparing
 * suppliers want the brochure to share with their committee straight away.
 * Set showMeta to add "(PDF, pages, size)" after the label.
 */
export function BrochureLink({
  location, className = 'btn btn--secondary', label = 'Download our brochure', showMeta = false,
}: { location: string; className?: string; label?: string; showMeta?: boolean }) {
  return (
    <a
      href={brochure.href}
      download={brochure.fileName}
      className={className}
      onClick={() => track('cta_click', { cta: 'brochure_download', location })}
    >
      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: 'none' }}>
        <path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" />
      </svg>
      <span>
        {label}
        {showMeta && <span className="brochure-meta"> (PDF, {brochure.pages} pages, {brochure.size})</span>}
      </span>
    </a>
  );
}
