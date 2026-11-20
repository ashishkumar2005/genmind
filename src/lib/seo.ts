import type { Metadata } from 'next';
import { company } from '@/content/site';

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');

/**
 * Search engines may index the site only on the real production deployment AND once SITE_LIVE=true is set.
 * Until then every page says "noindex" and robots.txt blocks crawlers, so demo contact details and the
 * draft brochure never end up in Google. Set SITE_LIVE=true in Vercel when you launch.
 */
export function indexingAllowed() {
  const isProd = process.env.VERCEL_ENV ? process.env.VERCEL_ENV === 'production' : process.env.NODE_ENV === 'production';
  return isProd && process.env.SITE_LIVE === 'true';
}

type PageMeta = { title: string; description: string; path: string; noindex?: boolean; ogType?: string };

/** Builds consistent, unique metadata for a page. Keep titles ≤ 60 chars and descriptions 120–160 chars. */
export function pageMetadata({ title, description, path, noindex, ogType = 'page' }: PageMeta): Metadata {
  const url = `${SITE_URL}${path}`;
  const og = `${SITE_URL}/og?title=${encodeURIComponent(title)}&type=${encodeURIComponent(ogType)}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noindex || !indexingAllowed() ? { index: false, follow: false } : undefined,
    openGraph: {
      title, description, url, siteName: company.brandName, locale: 'en_IN', type: 'website',
      images: [{ url: og, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [og] },
  };
}

/** Organization / LocalBusiness schema built ONLY from supplied company data. */
export function organizationSchema() {
  const sameAs = Object.values(company.social).filter(Boolean);
  const base: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': company.address && !company.demoContactDetails ? 'EducationalOrganization' : 'Organization',
    name: company.registeredName,
    alternateName: company.brandName,
    url: SITE_URL,
  };
  if (company.logo) base.logo = `${SITE_URL}${company.logo.markPng ?? company.logo.src}`; // Google prefers a square raster logo
  const real = !company.demoContactDetails;
  if (real && company.email) base.email = company.email;
  if (real && company.phone) base.telephone = company.phone;
  if (company.foundedYear) base.foundingDate = String(company.foundedYear);
  if (sameAs.length) base.sameAs = sameAs;
  if (real && company.address) {
    base.address = {
      '@type': 'PostalAddress',
      streetAddress: company.address.street,
      addressLocality: company.address.city,
      addressRegion: company.address.state,
      postalCode: company.address.postalCode,
      addressCountry: company.address.country,
    };
  }
  return base;
}

/** LocalBusiness schema — only returned when address AND phone are real. */
export function localBusinessSchema() {
  if (company.demoContactDetails || !company.address || !company.phone) return null;
  const s: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: company.registeredName,
    url: SITE_URL,
    telephone: company.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: company.address.street,
      addressLocality: company.address.city,
      addressRegion: company.address.state,
      postalCode: company.address.postalCode,
      addressCountry: company.address.country,
    },
  };
  if (company.email) s.email = company.email;
  if (company.geo) s.geo = { '@type': 'GeoCoordinates', latitude: company.geo.lat, longitude: company.geo.lng };
  if (company.openingHours) s.openingHours = company.openingHours;
  return s;
}

export function breadcrumbSchema(items: { name: string; href: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: `${SITE_URL}${it.href}` })),
  };
}
