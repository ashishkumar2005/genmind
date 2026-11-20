import Image from 'next/image';
import { PageHeader } from '@/components/PageHeader';
import { CtaBand } from '@/components/CtaBand';
import { caseStudies } from '@/content/site';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Case Studies',
  description: 'How schools and colleges have worked with GenmindEdtech: the challenge, what we did and the measured outcome, approved by each institution.',
  path: '/case-studies',
});

/**
 * Case study template: Challenge → Solution → Implementation → Outcome (+ quote, gallery).
 * Only client-approved case studies are shown.
 */
export default function CaseStudiesPage() {
  const approved = caseStudies.filter((c) => c.clientApproved);
  return (
    <>
      <PageHeader title="Case studies" intro="Real projects, described with each institution's approval." crumbs={[{ name: 'Case studies', href: '/case-studies' }]} backdrop={{ kind: 'photo', slot: 'header-case-studies' }} />
      <section className="section">
        <div className="container stack">
          {approved.length === 0 && (
            <div className="card" style={{ maxWidth: 720 }}>
              <h2 style={{ fontSize: 'var(--text-xl)' }}>Case studies are being prepared</h2>
              <p>We publish case studies only after the institution has reviewed and approved them. In the meantime, we are happy to talk you through our work on a call.</p>
            </div>
          )}
          {approved.map((c) => (
            <article key={c.slug} id={c.slug} className="card" aria-labelledby={`${c.slug}-h`}>
              <p className="eyebrow">{c.client}</p>
              <h2 id={`${c.slug}-h`} style={{ fontSize: 'var(--text-2xl)' }}>{c.title}</h2>
              <div className="grid grid--2">
                <div><h3>Challenge</h3><p>{c.challenge}</p></div>
                <div><h3>Solution</h3><p>{c.solution}</p></div>
                <div><h3>Implementation</h3><p>{c.implementation}</p></div>
                <div>
                  <h3>Outcome</h3>
                  <ul>{c.outcomes.map((o) => <li key={o.metric}><strong>{o.metric}</strong> — {o.detail}</li>)}</ul>
                </div>
              </div>
              {c.quote?.permission && (
                <figure className="quote">
                  <blockquote><p>“{c.quote.quote}”</p></blockquote>
                  <figcaption><strong>{c.quote.name}</strong>, {c.quote.role}, {c.quote.organisation}</figcaption>
                </figure>
              )}
              {c.gallery && c.gallery.length > 0 && (
                <div className="grid grid--3">
                  {c.gallery.map((g) => (
                    <div key={g.src} className="media"><Image src={g.src} alt={g.alt} width={800} height={600} sizes="(max-width: 640px) 100vw, 380px" /></div>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </section>
      <CtaBand location="case_studies" />
    </>
  );
}
