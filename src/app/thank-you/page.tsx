import { BrochureLink } from '@/components/BrochureLink';
import Link from 'next/link';
import { company, leadMagnets } from '@/content/site';
import { pageMetadata } from '@/lib/seo';

// Dedicated URL for conversion tracking (GA4 / Ads goal: page_view on /thank-you).
export const metadata = pageMetadata({
  title: 'Thank You',
  description: 'Thank you for getting in touch with GenmindEdtech.',
  path: '/thank-you',
  noindex: true,
});

const COPY: Record<string, { h: string; p: string }> = {
  consultation: { h: 'Your consultation request is in', p: 'We will contact you to arrange a time for your call.' },
  enquiry: { h: 'Thank you for your enquiry', p: 'The right person in our team will review it and get back to you.' },
  quote: { h: 'Your quote request is in', p: 'We will review your requirements and may call to confirm details before sending options.' },
  contact: { h: 'Message sent', p: 'Thank you for writing to us.' },
  'lead-magnet': { h: 'Your guide is ready', p: 'You can download it below.' },
};

export default function ThankYouPage({ searchParams }: { searchParams: { type?: string; resource?: string } }) {
  const type = searchParams.type && COPY[searchParams.type] ? searchParams.type : 'contact';
  const c = COPY[type];
  const resource = type === 'lead-magnet' ? leadMagnets.find((m) => m.id === searchParams.resource && m.available && m.fileUrl) : undefined;

  return (
    <section className="section">
      <div className="container prose">
        <div className="alert alert--success" role="status" style={{ marginBottom: 'var(--space-5)' }}>
          <strong>Received.</strong> We reply {company.responseTime}.
        </div>
        <h1 style={{ fontSize: 'var(--text-3xl)' }}>{c.h}</h1>
        <p className="lead">{c.p}</p>

        {resource?.fileUrl && (
          <p><a className="btn btn--primary" href={resource.fileUrl} download>Download: {resource.title}</a></p>
        )}

        <h2 style={{ fontSize: 'var(--text-xl)' }}>While you wait</h2>
        <ul>
          <li><Link href="/labs">Compare our lab options</Link></li>
          <li><BrochureLink location="thank_you" className="text-link" label="Download our brochure" /></li>
          <li><Link href="/case-studies">See examples of our work</Link></li>
        </ul>
        <p><Link href="/">Back to the home page</Link></p>
      </div>
    </section>
  );
}
