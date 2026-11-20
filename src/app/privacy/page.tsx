import Link from 'next/link';
import { PageHeader } from '@/components/PageHeader';
import { company } from '@/content/site';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Privacy Policy',
  description: 'How GenmindEdtech collects, uses, stores and deletes personal data, how we protect children’s data, and how to use your rights under India’s DPDP Act 2023.',
  path: '/privacy',
});

/*
 * Drafted against the Digital Personal Data Protection Act, 2023 and the DPDP Rules, 2025
 * (notified 13–14 Nov 2025; notice, consent, children's-data, rights and grievance rules
 * apply from 13 May 2027 — we meet them now). Covers the Rule 3 notice elements:
 * itemised data, specific purposes, how to withdraw consent, how to exercise rights,
 * and how to complain to the Data Protection Board.
 * FINAL LEGAL SIGN-OFF REQUIRED before launch (Placeholder Register: privacy-review).
 */
const LAST_UPDATED = '15 November 2026';

const DATA_TABLE = [
  { what: 'Name', why: 'To address you and record who made the request', when: 'Any form' },
  { what: 'Email address', why: 'To reply to you and send what you asked for (for example a guide)', when: 'Any form' },
  { what: 'Phone number', why: 'To call you to arrange a consultation or clarify a quote', when: 'Consultation, enquiry, quote; optional on contact' },
  { what: 'Organisation, your role, city', why: 'To understand the institution and prepare a relevant proposal', when: 'Enquiry, quote; optional on consultation' },
  { what: 'Your message and choices (interest, number of students, preferred time)', why: 'To answer your specific request', when: 'Forms, where you fill them in' },
  { what: 'Pages viewed and buttons clicked, without name, email or IP address', why: 'To count how many visitors reach each step, so we can improve the site', when: 'Every visit (no cookies used)' },
  { what: 'Analytics and session-recording data (device type, approximate location, pages, clicks; typing in forms is masked)', why: 'To understand which pages help visitors', when: 'Only if you accept analytics cookies' },
];

export default function PrivacyPage() {
  const pc = company.privacyContact;
  const contactEmail = pc.email ?? company.email;
  const email = contactEmail ? <a href={`mailto:${contactEmail}`}>{contactEmail}</a> : <Link href="/contact">our contact page</Link>;

  return (
    <>
      <PageHeader title="Privacy policy" intro={`Last updated ${LAST_UPDATED}. Written in plain language: what we collect, why, and what you can do about it.`} crumbs={[{ name: 'Privacy policy', href: '/privacy' }]} />
      <section className="section">
        <div className="container prose">
          <h2>Who we are</h2>
          <p>
            {company.registeredName} (“we”, “us”) decides how the personal data collected on this website is used, so under
            India’s Digital Personal Data Protection Act, 2023 (DPDP Act) we are the <em>Data Fiduciary</em>. We follow the DPDP Act
            and the DPDP Rules, 2025 and, for visitors from the EU or UK, the GDPR.
          </p>
          <p>
            <strong>Questions about your data:</strong> {pc.name ? <>{pc.name}, </> : null}{email}. This person answers questions
            about how we process personal data and handles the requests described below.
          </p>

          <h2>What we collect and why</h2>
          <p>We only collect what we need for the purpose shown. We do not sell personal data, and we do not use it for advertising.</p>
        </div>
        <div className="container">
          <div className="table-wrap" role="region" aria-labelledby="data-caption" tabIndex={0} style={{ maxWidth: 'var(--measure)' }}>
            <table>
              <caption id="data-caption" className="visually-hidden">Personal data we collect, why, and when</caption>
              <thead><tr><th scope="col">Data</th><th scope="col">Why we need it</th><th scope="col">When</th></tr></thead>
              <tbody>
                {DATA_TABLE.map((r) => (
                  <tr key={r.what}><th scope="row">{r.what}</th><td>{r.why}</td><td>{r.when}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="container prose">
          <h2>Your consent</h2>
          <p>
            When you submit a form, you give us your details for the purpose stated on that form, and we use them only for that.
            We will not send you newsletters or marketing unless you separately ask for them. Analytics cookies are used only if
            you switch them on. You can withdraw consent at any time, as easily as you gave it: use <em>Cookie settings</em> in the
            footer for cookies, or write to {email} for anything else. Withdrawing consent does not affect anything we did before
            you withdrew it.
          </p>

          <h2>Children and students under 18</h2>
          <p>
            Under the DPDP Act, anyone under 18 is a child, and their data needs the verifiable consent of a parent or lawful guardian.
          </p>
          <ul>
            <li>Our website forms are for adults. If you are under 18, please ask a parent or guardian to contact us for you.</li>
            <li>When we run programmes, events or competitions with students under 18, we get verifiable consent from a parent or guardian before we collect or use the student’s data. That includes photos and videos.</li>
            <li>When we deliver a programme for a school, the school may give us student details to run it. We then use them only on the school’s instructions and for that programme.</li>
            <li>We never track children’s behaviour, build profiles of them, or show them targeted advertising.</li>
            <li>If we learn that we hold a child’s data without the required consent, we delete it promptly.</li>
          </ul>

          <h2>Who can see your data</h2>
          <p>
            Only the members of our team who need it to answer you. We use a small number of service providers (website hosting,
            our customer-records and email tools and, if you allow it, analytics). They process data only on our instructions, under
            contracts that require them to keep it secure. Some of these providers may store data on servers outside India, which
            the DPDP Act permits except to countries the Government restricts. We will tell you on request which providers we use.
          </p>

          <h2>How we protect it</h2>
          <p>
            Data is encrypted in transit (HTTPS), access is limited to named team members, and forms are protected against abuse.
            See <Link href="/security">Security and data handling</Link>. If a breach ever affects your data, we will tell you without
            delay what happened and what you can do. We will also report it to the Data Protection Board of India, as the law requires.
          </p>

          <h2>How long we keep it</h2>
          <ul>
            <li>Enquiries that do not lead to work: deleted within 24 months of our last contact with you.</li>
            <li>Records linked to a contract or invoice: kept for as long as tax and company law require, then deleted.</li>
            <li>Security logs: kept for at least one year, as the DPDP Rules require, then deleted.</li>
          </ul>

          <h2>Your rights</h2>
          <p>You can ask us to:</p>
          <ul>
            <li><strong>Tell you</strong> what personal data we hold about you and how we use it, and who we have shared it with.</li>
            <li><strong>Correct, complete or update</strong> it.</li>
            <li><strong>Erase</strong> it when it is no longer needed for the purpose you gave it for, unless the law requires us to keep it.</li>
            <li><strong>Withdraw consent</strong> at any time.</li>
            <li><strong>Nominate</strong> someone to exercise these rights for you if you die or become unable to act.</li>
          </ul>
          <p>
            Write to {email} with your request. We may ask you to confirm your identity. We acknowledge every request within 7 days
            and resolve it within 30 days. The law allows up to 90 days, and we aim to be faster.
          </p>

          <h2>Complaints</h2>
          <p>
            If you are unhappy with how we handled your data or your request, please tell us first at {email} so we can put it
            right. If you are still not satisfied, you can complain to the Data Protection Board of India.
          </p>

          <h2>Changes to this policy</h2>
          <p>If we change how we use personal data, we will update this page and the date at the top. For significant changes affecting data we already hold, we will contact you.</p>
        </div>
      </section>
    </>
  );
}
