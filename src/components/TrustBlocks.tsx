import Image from 'next/image';
import { trust } from '@/content/site';

/**
 * Trust & proof components. Each one renders NOTHING unless real, approved
 * data exists — no empty shells, no "coming soon", no sample content.
 */

export function LogoStrip() {
  const logos = trust.logos.filter((l) => l.permission);
  if (!logos.length) return null;
  return (
    <section className="section" aria-labelledby="logos-h">
      <div className="container">
        <h2 id="logos-h" className="muted" style={{ textAlign: 'center', fontSize: 'var(--text-base)', fontWeight: 600 }}>Institutions we work with</h2>
        <ul className="logo-strip">
          {logos.map((l) => (
            <li key={l.name}><Image src={l.src} alt={l.name} width={l.width} height={l.height} /></li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Testimonials() {
  const items = trust.testimonials.filter((t) => t.permission);
  if (!items.length) return null;
  return (
    <section className="section section--alt" aria-labelledby="testimonials-h">
      <div className="container">
        <h2 id="testimonials-h">What our partners say</h2>
        <div className="grid grid--2">
          {items.map((t) => (
            <figure key={t.name + t.organisation} className="card quote">
              <blockquote><p>“{t.quote}”</p></blockquote>
              <figcaption><strong>{t.name}</strong>, {t.role}, {t.organisation}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Numbers() {
  const stats = trust.stats.filter((s) => s.source && s.asOf);
  if (!stats.length) return null;
  return (
    <section className="section" aria-labelledby="numbers-h">
      <div className="container">
        <h2 id="numbers-h">In numbers</h2>
        <dl className="grid grid--3">
          {stats.map((s) => (
            <div key={s.label} className="card">
              <dt className="visually-hidden">{s.label}</dt>
              <dd style={{ margin: 0 }}>
                <span className="stat">{s.value}</span>
                <p>{s.label}</p>
                <p className="muted">Source: {s.source}. As of {s.asOf}.</p>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export function Credentials() {
  if (!trust.credentials.length) return null;
  return (
    <section className="section section--alt" aria-labelledby="credentials-h">
      <div className="container">
        <h2 id="credentials-h">Registrations & certifications</h2>
        <ul className="grid grid--3" style={{ listStyle: 'none', padding: 0 }}>
          {trust.credentials.map((c) => (
            <li key={c.documentRef} className="card" style={{ marginTop: 0 }}>
              <h3>{c.title}</h3>
              <p>Issued by {c.issuer}</p>
              <p className="muted">Reference: {c.documentRef}{c.validUntil ? ` · Valid until ${c.validUntil}` : ''}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
