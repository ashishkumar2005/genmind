import Link from 'next/link';
import { PageHeader } from '@/components/PageHeader';
import { company } from '@/content/site';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Security and Data Handling',
  description: 'How GenmindEdtech protects the information you share: encryption, who can access it, how long we keep it and how to ask for deletion.',
  path: '/security',
});

export default function SecurityPage() {
  return (
    <>
      <PageHeader title="Security and data handling" intro="Plain-language answers to the questions institutions ask us most." crumbs={[{ name: 'Security & data', href: '/security' }]} />
      <section className="section">
        <div className="container prose">
          <h2>How your information travels</h2>
          <p>Every page and form on this site is served over HTTPS, so data is encrypted between your browser and our servers. We send strict security headers that stop the site being framed by other websites or loading unexpected scripts.</p>

          <h2>Who can see what you send</h2>
          <p>Form submissions go to our customer records system. Access is limited to named team members who need it to respond to you, using individual accounts. We remove access when someone leaves the team.</p>

          <h2>Protection against abuse</h2>
          <p>Forms check every field on our server, reject automated spam and limit how many submissions can come from one place in a short time.</p>

          <h2>Third parties</h2>
          <p>Analytics, session recording and the WhatsApp button load only if you agree to them. Session recordings mask everything typed into forms. See the <Link href="/cookies">cookie policy</Link>.</p>

          <h2>Student data</h2>
          <p>We collect the minimum needed to run a programme or event, with verifiable parent or guardian consent for anyone under 18. Photos of students are only used with written consent and are never published with full names and school together.</p>

          <h2>Deletion and your rights</h2>
          <p>
            To see, correct or delete your data, write to {company.email ? <a href={`mailto:${company.email}`}>{company.email}</a> : 'the email address on our Contact page'}.
            We confirm within 7 days and complete the request within 30 days. Full details are in our <Link href="/privacy">privacy policy</Link>.
          </p>

          <h2>Reporting a security issue</h2>
          <p>If you believe you have found a security problem on this website, please email us with the details and we will respond promptly. Please do not access other people’s data while testing.</p>
        </div>
      </section>
    </>
  );
}
