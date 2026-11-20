import type { MetadataRoute } from 'next';
import { publicRoutes } from '@/lib/routes';
import { SITE_URL } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return publicRoutes.map((r) => ({ url: `${SITE_URL}${r.path}`, lastModified: now, priority: r.priority }));
}
