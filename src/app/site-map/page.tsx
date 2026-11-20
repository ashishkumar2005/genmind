import Link from 'next/link';
import { PageHeader } from '@/components/PageHeader';
import { publicRoutes } from '@/lib/routes';
import { pageMetadata } from '@/lib/seo';
import { photoCredits } from '@/components/Photo';

export const metadata = pageMetadata({
  title: 'Site Map',
  description: 'Every page on the GenmindEdtech website, grouped by section.',
  path: '/site-map',
});

export default function SiteMapPage() {
  const groups = Array.from(new Set(publicRoutes.map((r) => r.group)));
  const credits = Array.from(new Set(photoCredits().map((c) => c.credit)));
  return (
    <>
      <PageHeader title="Site map" crumbs={[{ name: 'Site map', href: '/site-map' }]} />
      <section className="section">
        <div className="container grid grid--3">
          {groups.map((g) => (
            <nav key={g} aria-labelledby={`sm-${g}`}>
              <h2 id={`sm-${g}`} style={{ fontSize: 'var(--text-xl)' }}>{g}</h2>
              <ul>
                {publicRoutes.filter((r) => r.group === g).map((r) => (
                  <li key={r.path}><Link href={r.path}>{r.name}</Link></li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        {credits.length > 0 && (
          <div className="container" style={{ marginTop: 'var(--space-7)' }}>
            <h2 style={{ fontSize: 'var(--text-xl)' }}>Photo credits</h2>
            <p className="muted">Some equipment photos are used under the Unsplash licence. Thanks to: {credits.join(', ')}.</p>
          </div>
        )}
      </section>
    </>
  );
}
