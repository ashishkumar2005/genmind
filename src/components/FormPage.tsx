import { Suspense } from 'react';
import Link from 'next/link';
import { PageHeader } from './PageHeader';
import { LeadForm } from './LeadForm';
import { AbExposure } from './AbExposure';
import { company } from '@/content/site';
import type { FormType } from '@/lib/forms';
import { Photo } from './Photo';
import type { SlotId } from '@/content/media';

// A real photo above "What happens next", matched to what each form is for.
const ASIDE_PHOTO: Partial<Record<FormType, SlotId>> = {
  consultation: 'offer-schools-2', // planning binder: a consultation is a planning conversation
  quote: 'offer-schools-1',        // a fitted-out lab: what a quote is usually for
  enquiry: 'offer-colleges-1',     // an advanced lab: institutional partnerships
};

/** Shared layout for the three conversion pages: form on the left, reassurance on the right. */
export function FormPage({ type, title, intro, path, crumb, variant = 'full', abTest }: {
  type: FormType; title: string; intro: string; path: string; crumb: string; variant?: 'short' | 'full'; abTest?: string;
}) {
  return (
    <>
      <PageHeader title={title} intro={intro} crumbs={[{ name: crumb, href: path }]} />
      <section className="section">
        <div className="container grid grid--2" style={{ alignItems: 'start' }}>
          <div>
            <Suspense fallback={<p>Loading form…</p>}>
              <LeadForm type={type} variant={variant} />
            </Suspense>
            {abTest && <AbExposure test={abTest} variant={variant} />}
          </div>
          <aside className="card" aria-labelledby="next-h" style={{ background: 'var(--color-surface-alt)', overflow: 'hidden' }}>
            {ASIDE_PHOTO[type] && (
              <div style={{ margin: 'calc(-1 * var(--space-5)) calc(-1 * var(--space-5)) var(--space-4)' }}>
                <Photo slot={ASIDE_PHOTO[type]!} fallback={null} sizes="(max-width: 700px) 100vw, 45vw" ratio="16 / 9" />
              </div>
            )}
            <h2 id="next-h" style={{ fontSize: 'var(--text-xl)' }}>What happens next</h2>
            <ol>
              <li>We reply {company.responseTime}.</li>
              <li>We arrange a short call at a time that suits you.</li>
              <li>If it is a good fit, we send a clear written proposal. There is no obligation.</li>
            </ol>
            {(company.phone || company.email) && (
              <p>
                Prefer to talk now?{' '}
                {company.phone && <>Call <a href={`tel:${company.phone.replace(/[^+\d]/g, '')}`}>{company.phone}</a></>}
                {company.phone && company.email && ' or email '}
                {company.email && <a href={`mailto:${company.email}`}>{company.email}</a>}.
              </p>
            )}
            <p className="muted">Your details are handled as described in our <Link href="/privacy">privacy policy</Link> and <Link href="/security">security page</Link>.</p>
          </aside>
        </div>
      </section>
    </>
  );
}
