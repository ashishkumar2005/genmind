import { ImageResponse } from 'next/og';

export const runtime = 'edge';

/**
 * Template-driven Open Graph / Twitter image: /og?title=...&type=page|solution|resource|event
 * Hindi/Punjabi: pass &lang=hi or &lang=pa once Noto Sans Devanagari / Gurmukhi font files are
 * added to /public/fonts (Satori needs the font data to render those scripts).
 */
const LABELS: Record<string, string> = {
  page: 'GenmindEdtech',
  solution: 'Solutions',
  resource: 'Free resource',
  event: 'Event',
  case: 'Case study',
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get('title') || 'GenmindEdtech').slice(0, 110);
  const label = LABELS[searchParams.get('type') || 'page'] ?? LABELS.page;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          padding: '72px', background: 'radial-gradient(circle at 80% 30%, #1d4ed8 0%, #0b1a4a 35%, #05070d 75%)', color: '#eef3fb',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', fontSize: 26, color: '#22d3ee', letterSpacing: 6, textTransform: 'uppercase' }}>{label}</div>
        <div style={{ display: 'flex', fontSize: title.length > 60 ? 60 : 74, fontWeight: 800, lineHeight: 1.0, maxWidth: 1000, textTransform: 'uppercase', letterSpacing: -1 }}>{title}</div>
        <div style={{ display: 'flex', alignItems: 'center', fontSize: 36, fontWeight: 800 }}>
          <svg width="56" height="56" viewBox="0 0 48 48" style={{ marginRight: 16 }}>
            <defs>
              <linearGradient id="g" x1="6" y1="6" x2="42" y2="42" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#3b82f6" />
                <stop offset="1" stopColor="#22d3ee" />
              </linearGradient>
            </defs>
            <path d="M36.9 13.6 A17 17 0 1 0 41 24 H27" fill="none" stroke="url(#g)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="24" cy="24" r="4" fill="#22d3ee" />
            <circle cx="36.9" cy="13.6" r="3.2" fill="#05070d" stroke="#3b82f6" strokeWidth="2.2" />
          </svg>
          Genmind<span style={{ color: '#22d3ee' }}>Edtech</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630, headers: { 'Cache-Control': 'public, max-age=86400, immutable' } },
  );
}
