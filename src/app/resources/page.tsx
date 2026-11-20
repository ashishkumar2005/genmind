import { BrochureLink } from '@/components/BrochureLink';
import Image from 'next/image';
import { brochure } from '@/content/site';
import { Suspense } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { CtaBand } from '@/components/CtaBand';
import { LeadForm } from '@/components/LeadForm';
import { Icon } from '@/components/Icon';
import { leadMagnets } from '@/content/site';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Free Guides for Schools and Colleges',
  description: 'Free, practical guides: an AI & robotics lab planning guide, a school hackathon checklist and our institution brochure.',
  path: '/resources',
});

export default function ResourcesPage() {
  const available = leadMagnets.filter((m) => m.available && m.fileUrl);
  return (
    <>
      <PageHeader
        title="Free resources"
        intro="Our company brochure, and practical guides to help you plan."
        crumbs={[{ name: 'Resources', href: '/resources' }]}
        backdrop={{ kind: 'photo', slot: 'header-resources' }}
      />
      <section className="section">
        <div className="container stack">
          <article className="card brochure-card" aria-labelledby="brochure-h">
            <a href={brochure.href} download={brochure.fileName} className="brochure-card__cover" tabIndex={-1} aria-hidden="true">
              <Image src="/images/brochure-cover.jpg" alt="" width={935} height={1313} sizes="(max-width: 700px) 60vw, 260px" />
            </a>
            <div className="brochure-card__body">
              <p className="eyebrow">Company brochure</p>
              <h2 id="brochure-h" style={{ fontSize: 'var(--text-2xl)' }}>GenmindEdtech corporate profile</h2>
              <p>Our solutions for schools and colleges, the ten technology domains we work in, our seven-step implementation approach and the equipment we supply. Easy to share with your principal, management or purchase committee.</p>
              <p><BrochureLink location="resources" className="btn btn--primary" label="Download the brochure" /></p>
            </div>
          </article>
          {available.length === 0 && (
            <div className="card" style={{ maxWidth: 720 }}>
              <h2 style={{ fontSize: 'var(--text-xl)' }}>Planning guides coming soon</h2>
              <p>We are finishing our lab planning guide and hackathon checklist. Book a consultation and we will talk you through the same questions in person.</p>
            </div>
          )}
          {available.map((m) => (
            <article key={m.id} className="card" aria-labelledby={`${m.id}-h`} style={{ maxWidth: 760 }}>
              <Icon name="download" />
              <h2 id={`${m.id}-h`} style={{ fontSize: 'var(--text-xl)' }}>{m.title}</h2>
              <p>{m.description}</p>
              <Suspense fallback={null}>
                <LeadForm type="lead-magnet" context={{ resource: m.id }} successHref={`/thank-you?type=lead-magnet&resource=${m.id}`} />
              </Suspense>
            </article>
          ))}
        </div>
      </section>
      <CtaBand location="resources" />
    </>
  );
}
