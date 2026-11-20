import type { MetadataRoute } from 'next';
import { SITE_URL, indexingAllowed } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  // Block everything on preview deployments, and on production until SITE_LIVE=true (see indexingAllowed).
  if (!indexingAllowed()) return { rules: [{ userAgent: '*', disallow: '/' }] };
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/', '/internal/', '/brand', '/thank-you'] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
