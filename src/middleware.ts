import { NextResponse, type NextRequest } from 'next/server';

/**
 * 1. Protects internal pages (/brand, /internal/*) with HTTP Basic Auth.
 * 2. Assigns A/B test variants (hero CTA wording, consultation form length)
 *    in first-party cookies. These are functional, contain no personal data,
 *    and are documented in the cookie policy.
 */

const AB_COOKIES = {
  ab_hero: ['A', 'B'],
  ab_form: ['short', 'full'],
} as const;

/** Constant-time string comparison, so response timing does not reveal how much of a password matched. */
function safeEqual(a: string, b: string) {
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  return diff === 0;
}

function unauthorized() {
  return new NextResponse('Authentication required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="GenmindEdtech internal", charset="UTF-8"', 'X-Robots-Tag': 'noindex' },
  });
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/brand') || pathname.startsWith('/internal')) {
    const user = process.env.INTERNAL_USER;
    const pass = process.env.INTERNAL_PASSWORD;
    if (!user || !pass) {
      // Fail closed in production if credentials are not configured.
      if (process.env.NODE_ENV === 'production') return unauthorized();
    } else {
      const header = req.headers.get('authorization') || '';
      const [scheme, encoded] = header.split(' ');
      if (scheme !== 'Basic' || !encoded) return unauthorized();
      let decoded = '';
      try { decoded = atob(encoded); } catch { return unauthorized(); }
      const idx = decoded.indexOf(':');
      if (idx < 0 || !safeEqual(decoded.slice(0, idx), user) || !safeEqual(decoded.slice(idx + 1), pass)) return unauthorized();
    }
    const res = NextResponse.next();
    res.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return res;
  }

  const res = NextResponse.next();
  for (const [name, variants] of Object.entries(AB_COOKIES)) {
    if (!req.cookies.get(name)) {
      const v = variants[Math.random() < 0.5 ? 0 : 1];
      res.cookies.set(name, v, { path: '/', maxAge: 60 * 60 * 24 * 90, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
    }
  }
  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon|apple-icon|og|api|robots.txt|sitemap.xml|llms.txt|media|brand-assets|images|videos|logo|illustrations|downloads).*)'],
};
