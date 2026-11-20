/**
 * GenmindEdtech logo mark: a "G" drawn as an orbit, with a satellite node on its
 * open end and a glowing core at its centre (the "mind").
 * Source files for print, email and PDFs: /public/logo/.
 */
export function LogoMark({ size = 32, className = '' }: { size?: number; className?: string }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="gm-mark-g" x1="6" y1="6" x2="42" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#3b82f6" />
          <stop offset="1" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
      <path d="M36.9 13.6 A17 17 0 1 0 41 24 H27" fill="none" stroke="url(#gm-mark-g)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="24" cy="24" r="4" fill="#22d3ee" />
      <circle cx="36.9" cy="13.6" r="3.2" fill="#05070d" stroke="#3b82f6" strokeWidth="2.2" />
    </svg>
  );
}
