import Link from 'next/link';
import { PageHeader } from '@/components/PageHeader';
import { CookieSettingsButton } from '@/components/CookieSettingsButton';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Cookie Policy',
  description: 'Which cookies and similar technologies this website uses, why, and how to change your choices at any time.',
  path: '/cookies',
});

const LAST_UPDATED = '15 November 2026';

const ROWS = [
  { name: 'genminded-consent', type: 'Essential (stored in your browser)', purpose: 'Remembers your cookie choices, so we do not ask on every page', duration: '12 months, then we ask again' },
  { name: 'genminded-reduce-effects', type: 'Essential (stored in your browser)', purpose: 'Remembers whether you turned “Reduce effects” on or off', duration: 'Until you clear it' },
  { name: 'ab_hero, ab_form', type: 'Functional (first-party)', purpose: 'Show you the same version of a page while we test wording. A random letter only, with no personal data', duration: '90 days' },
  { name: '_ga, _ga_*', type: 'Analytics — only if you accept', purpose: 'Google Analytics 4: counts visits and which pages people use, with IP addresses anonymised', duration: 'Up to 2 years (Google’s default)' },
  { name: 'Plausible', type: 'Analytics — only if you accept', purpose: 'Privacy-friendly visit counts. Sets no cookies', duration: '—' },
  { name: '_clck, _clsk, CLID', type: 'Analytics — only if you accept', purpose: 'Microsoft Clarity: heatmaps and session replays to find confusing pages. Everything typed in forms is masked', duration: '_clsk 1 day; _clck and CLID up to 1 year' },
  { name: 'WhatsApp button', type: 'Third-party — only if you accept', purpose: 'Lets you start a WhatsApp chat with us. Meta may set its own cookies when you click it', duration: 'Set by WhatsApp/Meta' },
];

export default function CookiesPage() {
  return (
    <>
      <PageHeader title="Cookie policy" intro={`Last updated ${LAST_UPDATED}. We only use non-essential cookies if you say yes.`} crumbs={[{ name: 'Cookie policy', href: '/cookies' }]} />
      <section className="section">
        <div className="container stack">
          <div className="prose">
            <h2>How we use cookies</h2>
            <p>
              Cookies and similar technologies are small pieces of information stored in your browser. India’s DPDP Act treats
              information that can identify you as personal data, so we ask for your clear permission before using any cookie that
              is not essential.
            </p>
            <ul>
              <li><strong>Essential storage is always on.</strong> It only remembers your choices and keeps forms secure. It does not identify you.</li>
              <li><strong>Analytics and the WhatsApp button are off until you switch them on.</strong> Choosing “Reject non-essential” is as easy as accepting, and the site works fully either way.</li>
              <li><strong>We do not use advertising or tracking cookies,</strong> and we do not follow you across other websites.</li>
              <li><strong>We never track or profile children.</strong></li>
            </ul>
            <p>You can change or withdraw your choice at any time. It takes effect immediately:</p>
            <p><CookieSettingsButton className="btn btn--secondary" label="Change cookie settings" /></p>
          </div>
          <div className="table-wrap" role="region" aria-labelledby="cookie-caption" tabIndex={0}>
            <table>
              <caption id="cookie-caption" className="visually-hidden">Cookies and similar technologies used on this website</caption>
              <thead><tr><th scope="col">Name</th><th scope="col">Type</th><th scope="col">Purpose</th><th scope="col">How long</th></tr></thead>
              <tbody>
                {ROWS.map((r) => (
                  <tr key={r.name}><th scope="row">{r.name}</th><td>{r.type}</td><td>{r.purpose}</td><td>{r.duration}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="prose">
            <p>
              How we handle any personal data collected this way, and your rights over it, is explained in our{' '}
              <Link href="/privacy">privacy policy</Link>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
