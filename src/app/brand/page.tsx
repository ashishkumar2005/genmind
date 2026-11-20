import type { Metadata } from 'next';
import { Icon } from '@/components/Icon';
import { LogoMark } from '@/components/LogoMark';

export const metadata: Metadata = { title: 'Brand guidelines (internal)', robots: { index: false, follow: false } };

const COLOURS = [
  { token: '--color-bg', hex: '#05070d', use: 'Page background (deep space)' },
  { token: '--color-surface', hex: '#0a0f1a', use: 'Cards and panels, with a 1px hairline border' },
  { token: '--color-blue', hex: '#3b82f6', use: 'Electric blue: gradients, 3D glow, highlights' },
  { token: '--color-cyan', hex: '#22d3ee', use: 'Cyan: section labels, focus ring, active states' },
  { token: '--color-blue-600', hex: '#2563eb', use: 'Button gradient start (white text ≥ 4.5:1)' },
  { token: '--color-cyan-700', hex: '#0e7490', use: 'Button gradient end (white text ≥ 4.5:1)' },
  { token: '--color-ink-900', hex: '#eef3fb', use: 'Headings and strong text' },
  { token: '--color-ink-700', hex: '#a7b4c8', use: 'Body text (9.4:1 on background)' },
];

const TYPE = [
  { token: '--text-4xl', use: 'H1 (hero)' }, { token: '--text-3xl', use: 'H1 (pages), H2' }, { token: '--text-2xl', use: 'Section H2 in cards' },
  { token: '--text-xl', use: 'H3' }, { token: '--text-lg', use: 'Lead paragraphs' }, { token: '--text-base', use: 'Body (17px)' }, { token: '--text-sm', use: 'Meta, captions' },
];

export default function BrandPage() {
  return (
    <section className="section">
      <div className="container stack">
        <p className="eyebrow">Internal · not indexed</p>
        <h1 style={{ fontSize: 'var(--text-3xl)' }}>GenmindEdtech brand guidelines</h1>
        <p className="lead">Tokens live in <code>src/styles/tokens.css</code>. Change a value there and it changes everywhere.</p>

        <h2>Logo</h2>
        <div className="grid grid--2" style={{ alignItems: 'center' }}>
          <div className="card" style={{ alignItems: 'center', padding: 'var(--space-7)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 14, fontWeight: 800, fontSize: '2rem', letterSpacing: '-0.02em', color: 'var(--color-ink-900)' }}>
              <LogoMark size={64} /> Genmind<span className="grad-text">Edtech</span>
            </span>
          </div>
          <div>
            <p>
              The mark is a <strong>G drawn as an orbit</strong>: an open ring with a satellite node on its end and a glowing
              core at its centre, the &ldquo;mind&rdquo;. It echoes the planet and orbit rings of the hero scene.
            </p>
            <ul>
              <li>Clear space: at least the width of the core dot on every side.</li>
              <li>Minimum size: 20px for the mark alone, 120px wide for the full lockup.</li>
              <li>Use the full-colour logo on dark backgrounds, the light-background version on white, and the white mark on photos.</li>
              <li>Never stretch, rotate, recolour outside the blue → cyan gradient, add shadows, or place on busy backgrounds.</li>
            </ul>
            <p className="muted">
              Files in <code>/public/logo/</code>: <code>genmindedtech-mark.svg</code>, <code>genmindedtech-mark-512.png</code>,
              <code> genmindedtech-mark-white.svg</code>, <code>genmindedtech-logo-on-dark.svg/.png</code>, <code>genmindedtech-logo-on-light.svg/.png</code>.
            </p>
          </div>
        </div>

        <h2>Colour</h2>
        <div className="grid grid--3">
          {COLOURS.map((c) => (
            <div key={c.token} className="card">
              <div style={{ background: c.hex, height: 64, borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-line)' }} />
              <strong>{c.hex}</strong>
              <code>{c.token}</code>
              <p>{c.use}</p>
            </div>
          ))}
        </div>

        <h2>Typography</h2>
        <p>One family, Archivo. Display headings: 800 weight, uppercase, slightly condensed (92% width), tight tracking, with one or two words in the blue → cyan gradient. Section labels: small uppercase cyan with wide tracking. Body: 400/600 at normal width. Noto Sans Devanagari and Gurmukhi for Hindi and Punjabi.</p>
        {TYPE.map((t) => (
          <p key={t.token} style={{ fontSize: `var(${t.token})`, margin: 0, lineHeight: 1.3 }}>
            {t.use} <span className="muted">({t.token})</span>
          </p>
        ))}

        <h2>Spacing, radius, shadow, motion</h2>
        <ul>
          <li>Spacing on a 4/8px rhythm: <code>--space-1</code> … <code>--space-9</code>; sections use <code>--section-y</code>.</li>
          <li>One radius for cards, images and buttons (<code>--radius-md</code>, 12px); <code>--radius-sm</code> (6px) for inputs.</li>
          <li>Three shadows only: sm (resting card), md (hover / floating), lg (banners).</li>
          <li>Motion: 120ms hover, 200ms reveals, 360ms panels; ease-out. Animate only to explain a change of state. All durations become 0 under reduced motion.</li>
        </ul>

        <h2>Icons</h2>
        <p>One family: 24px outline, 1.75 stroke, round caps. Never mix filled icons or emoji in UI.</p>
        <div className="btn-row">{['lab', 'book', 'users', 'trophy', 'chip', 'school', 'shield', 'download'].map((n) => <Icon key={n} name={n} label={n} />)}</div>

        <h2>Photography</h2>
        <p>Real people doing real work: students building, teachers guiding, labs in use. 4:3 crops, 12px radius, no filters, one overlay style (deep-space gradient from the left) on hero images only. See <code>docs/photography-and-consent.md</code>.</p>
        <h2>Illustration</h2>
        <p>Line drawings (<code>src/components/illustrations</code>): 2px round-capped light-blue lines on dark, faint blue fills, cyan for the one thing that matters in each drawing. Used where a real photo is not yet available, never alongside one in the same slot.</p>

        <h2>Tone of voice</h2>
        <div className="grid grid--2">
          <div className="card">
            <h3>Do</h3>
            <ul>
              <li>“We help you plan and set up an AI lab.”</li>
              <li>“We reply within one working day.”</li>
              <li>Short sentences. Indian English spelling (organisation, programme, colour).</li>
              <li>Name the benefit to students and teachers.</li>
            </ul>
          </div>
          <div className="card">
            <h3>Don’t</h3>
            <ul>
              <li>“India’s No. 1 / leading / best” — unless independently verified.</li>
              <li>Unsourced numbers (“10,000+ students”).</li>
              <li>Jargon: “synergy”, “cutting-edge”, “revolutionary”, “world-class”.</li>
              <li>Stock photos of people who are not our students or staff.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
