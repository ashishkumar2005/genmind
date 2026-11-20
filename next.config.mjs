/** @type {import('next').NextConfig} */

// Security headers applied to every route. Third-party origins are only
// contacted after cookie consent (see src/components/ThirdPartyScripts.tsx),
// but they still need to be allowed by the CSP.
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants.js';

// Development mode (npm run dev) needs eval for Fast Refresh and a websocket for hot reload,
// and runs on plain http://localhost, so the policy is relaxed there only. Production stays strict.
// We go by Next's own phase rather than NODE_ENV, which a machine-wide setting can override.
const buildHeaders = (isDev) => {
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''} https://www.googletagmanager.com https://plausible.io https://www.clarity.ms`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "media-src 'self' https:",
  `connect-src 'self'${isDev ? ' ws: wss:' : ''} https://www.google-analytics.com https://*.google-analytics.com https://plausible.io https://*.clarity.ms`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  ...(isDev ? [] : ['upgrade-insecure-requests']),
].join('; ');

return [

  { key: 'Content-Security-Policy', value: csp },
  ...(isDev ? [] : [{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' }]),
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
];
};

const nextConfig = (phase) => {
  const securityHeaders = buildHeaders(phase === PHASE_DEVELOPMENT_SERVER);
  return {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 480, 640, 768, 1024, 1280, 1600, 1920],
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
  // Add old-site URLs here before launch (see docs/launch-plan.md → Redirect map).
  async redirects() {
    return [];
  },
  };
};

export default nextConfig;
