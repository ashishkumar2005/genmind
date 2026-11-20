import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="section">
      <div className="container prose">
        <p className="eyebrow">Error 404</p>
        <h1 style={{ fontSize: 'var(--text-3xl)' }}>We could not find that page</h1>
        <p className="lead">It may have moved, or the link may be out of date.</p>
        <ul>
          <li><Link href="/">Go to the home page</Link></li>
          <li><Link href="/site-map">See every page on the site</Link></li>
          <li><Link href="/contact">Tell us about the broken link</Link></li>
        </ul>
      </div>
    </section>
  );
}
