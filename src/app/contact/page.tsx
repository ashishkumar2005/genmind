import { Suspense } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/PageHeader';
import { LeadForm } from '@/components/LeadForm';
import { CompanyDetails } from '@/components/CompanyDetails';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Contact Us',
  description: 'Contact GenmindEdtech by form, phone or email. For lab setups, training and events, book a free consultation.',
  path: '/contact',
});

export default function ContactPage() {
  return (
    <>
      <PageHeader title="Contact us" intro="Questions, partnerships or media enquiries — we are happy to help." crumbs={[{ name: 'Contact', href: '/contact' }]} backdrop={{ kind: 'photo', slot: 'header-contact' }} />
      <section className="section">
        <div className="container grid grid--2" style={{ alignItems: 'start' }}>
          <div>
            <h2 style={{ fontSize: 'var(--text-2xl)' }}>Send us a message</h2>
            <Suspense fallback={<p>Loading form…</p>}>
              <LeadForm type="contact" />
            </Suspense>
          </div>
          <aside className="stack">
            <div className="card">
              <h2 style={{ fontSize: 'var(--text-xl)' }}>Planning something?</h2>
              <p>For labs, training or events, these are quicker routes:</p>
              <ul>
                <li><Link href="/book-consultation">Book a free consultation</Link></li>
                <li><Link href="/enquiry">Send an institutional enquiry</Link></li>
                <li><Link href="/quote">Request a quote</Link></li>
              </ul>
            </div>
            <div className="card">
              <CompanyDetails />
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
