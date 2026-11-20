import Link from 'next/link';
import { PageHeader } from '@/components/PageHeader';
import { company } from '@/content/site';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Accessibility Statement',
  description: 'Our commitment to WCAG 2.2 AA, what we test, known limitations and how to tell us about an accessibility problem.',
  path: '/accessibility',
});

const LAST_REVIEWED = '15 November 2026';

export default function AccessibilityPage() {
  return (
    <>
      <PageHeader title="Accessibility statement" intro={`Last reviewed ${LAST_REVIEWED}.`} crumbs={[{ name: 'Accessibility', href: '/accessibility' }]} />
      <section className="section">
        <div className="container prose">
          <p>We want everyone to be able to use this website, including people who use a keyboard, a screen reader, magnification or voice control. We aim to meet the Web Content Accessibility Guidelines (WCAG) 2.2 at level AA.</p>

          <h2>What we do</h2>
          <ul>
            <li>Every page can be used with a keyboard, with a visible focus outline and a “Skip to main content” link.</li>
            <li>Text and controls meet AA colour-contrast ratios; buttons and links are at least 44 by 44 pixels.</li>
            <li>Forms have visible labels, explain errors in words and announce them to screen readers.</li>
            <li>Most animation respects your device’s “reduce motion” setting and the “Reduce effects” switch in the footer. The decorative 3D scenes always run: they move slowly, never flash, and contain no information you would miss without them.</li>
            <li>Background video, when used, has a pause button and never plays on Data Saver.</li>
            <li>Automated accessibility checks (axe) run on every change, and we test manually with NVDA and VoiceOver.</li>
          </ul>

          <h2>Known limitations</h2>
          <p>Some downloadable PDF guides may not yet be fully tagged for screen readers. If you need a guide in another format, ask us and we will send one.</p>

          <h2>Tell us about a problem</h2>
          <p>
            If something on this site does not work for you, please{' '}
            {company.email ? <a href={`mailto:${company.email}?subject=Accessibility%20feedback`}>email us</a> : <Link href="/contact">contact us</Link>}
            {' '}with the page address and what happened. We aim to reply within 5 working days.
          </p>
        </div>
      </section>
    </>
  );
}
