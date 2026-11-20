import { BrochureLink } from '@/components/BrochureLink';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PageHeader } from '@/components/PageHeader';
import { CtaBand } from '@/components/CtaBand';
import { TrackedLink } from '@/components/TrackedLink';
import { Testimonials } from '@/components/TrustBlocks';
import { Icon } from '@/components/Icon';
import { Photo } from '@/components/Photo';
import type { SlotId } from '@/content/media';
import { solutions, type Audience } from '@/content/solutions';
import { pageMetadata } from '@/lib/seo';

export function generateStaticParams() {
  return Object.keys(solutions).map((audience) => ({ audience }));
}

export const dynamicParams = false;

export function generateMetadata({ params }: { params: { audience: string } }) {
  const s = solutions[params.audience as Audience];
  if (!s) return {};
  return pageMetadata({ title: s.title, description: s.metaDescription, path: `/solutions/${s.slug}`, ogType: 'solution' });
}

const ICONS = ['lab', 'book', 'users', 'trophy'];
// Background video behind each page title: real footage of the kind of work on that page (hands and kit only).
const HEADER_VIDEO = {
  schools: { src: '/videos/header-schools.mp4', poster: '/videos/header-schools.jpg', label: 'hands wiring a robot car kit' },
  colleges: { src: '/videos/header-colleges.mp4', poster: '/videos/header-colleges.jpg', label: 'soldering a circuit board' },
  students: { src: '/videos/header-students.mp4', poster: '/videos/header-students.jpg', label: 'building a robot car' },
} as const;

export default function SolutionPage({ params }: { params: { audience: string } }) {
  const s = solutions[params.audience as Audience];
  if (!s) notFound();

  return (
    <>
      <PageHeader title={s.title} intro={s.summary} crumbs={[{ name: s.navLabel, href: `/solutions/${s.slug}` }]} backdrop={{ kind: 'video', ...HEADER_VIDEO[s.slug] }}>
        <div className="btn-row" style={{ marginTop: 'var(--space-5)' }}>
          <TrackedLink href={s.primaryCta.href} cta="primary" location={`solution_${s.slug}_top`}>{s.primaryCta.label}</TrackedLink>
          <TrackedLink href="/quote" cta="request_quote" location={`solution_${s.slug}_top`} className="btn btn--secondary">Request a quote</TrackedLink>
        </div>
        {s.slug !== 'students' && (
          <p className="hero__brochure"><BrochureLink location={`solution_${s.slug}_top`} className="text-link" label="Download our brochure" /></p>
        )}
      </PageHeader>

      <section className="section" aria-labelledby="offer-h">
        <div className="container">
          <h2 id="offer-h">What we offer</h2>
          <div className="grid grid--2">
            {s.offerings.map((o, i) => (
              <article key={o.title} className="card card--media">
                <Photo
                  slot={`offer-${s.slug}-${i + 1}` as SlotId}
                  fallback={<div className="card__body" style={{ paddingBottom: 0 }}><Icon name={ICONS[i % ICONS.length]} /></div>}
                  sizes="(max-width: 700px) 100vw, 50vw"
                  ratio="16 / 9"
                />
                <div className="card__body">
                  <h3>{o.title}</h3>
                  <p>{o.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--alt" aria-labelledby="steps-h">
        <div className="container">
          <h2 id="steps-h">How we work together</h2>
          <ol className="grid grid--3" style={{ listStyle: 'none', padding: 0, counterReset: 'step' }}>
            {s.steps.map((step, i) => (
              <li key={step} className="card" style={{ marginTop: 0 }}>
                <span className="eyebrow">Step {i + 1}</span>
                <p style={{ fontWeight: 600, color: 'var(--color-ink-900)' }}>{step}</p>
              </li>
            ))}
          </ol>
          {s.slug !== 'students' && (
            <p style={{ marginTop: 'var(--space-5)' }}>
              Planning a lab? <Link href="/labs">Compare lab options</Link> or <Link href="/resources">download the free planning guide</Link>.
            </p>
          )}
        </div>
      </section>

      <Testimonials />
      <CtaBand location={`solution_${s.slug}`} />
    </>
  );
}
