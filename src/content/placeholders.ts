import { company, trust, team, caseStudies, heroVideo, leadMagnets, brochure } from './site';
import { labs } from './solutions';
import generatedMedia from './media.generated.json';

export type Severity = 'Critical' | 'High' | 'Medium' | 'Low';
export type PlaceholderItem = { id: string; item: string; whereUsed: string; owner: string; severity: Severity; done: boolean };

/**
 * Live placeholder register. Computed from content, so it updates itself as
 * real data is filled in. Launch is BLOCKED while any Critical item is open
 * (enforced by `npm run check:placeholders` in CI).
 */
export function getPlaceholderRegister(): PlaceholderItem[] {
  const env = (k: string) => Boolean(process.env[k]);
  return [
    { id: 'email', item: 'Company contact email', whereUsed: 'Footer, Contact page, schema', owner: 'Founder / Admin', severity: 'Critical', done: !!company.email && !company.demoContactDetails },
    { id: 'phone', item: 'Company phone number', whereUsed: 'Footer, Contact page, sticky CTA, schema', owner: 'Founder / Admin', severity: 'Critical', done: !!company.phone && !company.demoContactDetails },
    { id: 'address', item: 'Registered office address', whereUsed: 'Footer, Contact page, LocalBusiness schema', owner: 'Founder / Admin', severity: 'Critical', done: !!company.address && !company.demoContactDetails },
    { id: 'site-url', item: 'Production domain (NEXT_PUBLIC_SITE_URL)', whereUsed: 'Canonicals, sitemap, OG images', owner: 'Developer', severity: 'Critical', done: env('NEXT_PUBLIC_SITE_URL') },
    { id: 'brochure-final', item: 'Company brochure: the PDF still has [ADD …] and [CONFIRM …] placeholders (company facts, contact details, case studies, QR code). Upload the finished PDF to /public/downloads/genmindedtech-brochure.pdf and set brochure.final = true', whereUsed: 'Home, Schools, Colleges, About, Resources, Thank-you, footer', owner: 'Founder / Marketing', severity: 'Critical', done: brochure.final },
    { id: 'lead-webhook', item: 'Lead alerts: connect LEAD_WEBHOOK_URL (CRM / email automation) so the team is notified of new leads. Until then leads are saved and listed at /internal/leads (on Vercel: add Upstash for Redis).', whereUsed: 'All forms', owner: 'Developer + Sales', severity: 'High', done: env('LEAD_WEBHOOK_URL') && process.env.LEAD_DRY_RUN !== 'true' },
    { id: 'privacy-contact', item: 'Name and email of the person who handles privacy questions and data requests (DPDP Rules, Rule 9)', whereUsed: '/privacy, /security', owner: 'Founder', severity: 'Critical', done: !!(company.privacyContact.name && company.privacyContact.email) && !company.demoContactDetails },
    { id: 'privacy-review', item: 'Final sign-off of privacy & cookie policies by a legal adviser (drafted against the DPDP Act 2023 and DPDP Rules 2025)', whereUsed: '/privacy, /cookies', owner: 'Founder', severity: 'Critical', done: false },
    { id: 'policy-promises', item: 'Confirm every promise on /security, /privacy and /accessibility is true in practice (response times, retention period, access controls)', whereUsed: '/security, /privacy, /accessibility, form pages', owner: 'Founder', severity: 'Critical', done: false },
    { id: 'gstin', item: 'GSTIN (if registered)', whereUsed: 'Footer, Contact page', owner: 'Accounts', severity: 'High', done: !!company.gstin },
    { id: 'cin', item: 'CIN', whereUsed: 'Footer, Contact page', owner: 'Accounts', severity: 'High', done: !!company.cin },
    { id: 'logo', item: 'Approve the new GenmindEdtech logo and run a trademark search on the name and mark', whereUsed: 'Header, footer, favicon, share images, PDFs', owner: 'Founder', severity: 'High', done: false },
    { id: 'team', item: 'Leadership & team: names, roles, photos (with consent)', whereUsed: '/about', owner: 'Founder', severity: 'High', done: team.length > 0 },
    { id: 'photos', item: 'Photos in at least 9 of the 14 photo slots (see src/content/media.ts and docs/photo-sources.md)', whereUsed: 'Home, domain explorer, page headers', owner: 'Marketing', severity: 'High', done: Object.keys(generatedMedia).length >= 9 },
    { id: 'own-photos', item: 'Own photos of team, office and real sessions (with consent) for About, Contact and Case studies', whereUsed: '/about, /contact, /case-studies headers', owner: 'Marketing', severity: 'Medium', done: ['header-about', 'header-contact', 'header-case-studies'].every((k) => k in generatedMedia) },
    { id: 'domains', item: 'Confirm the six learning domains, age ranges and example projects match what we teach', whereUsed: 'Home → What students learn', owner: 'Academic lead', severity: 'High', done: false },
    { id: 'case-studies', item: 'At least one client-approved case study', whereUsed: '/case-studies', owner: 'Sales', severity: 'Medium', done: caseStudies.some((c) => c.clientApproved) },
    { id: 'testimonials', item: 'Approved testimonials with written permission', whereUsed: 'Home, solution pages', owner: 'Sales', severity: 'Medium', done: trust.testimonials.some((t) => t.permission) },
    { id: 'logos', item: 'Client/partner logos with written permission', whereUsed: 'Home logo strip', owner: 'Sales', severity: 'Medium', done: trust.logos.some((l) => l.permission) },
    { id: 'stats', item: 'Verified numbers with source and "as of" date', whereUsed: 'Home numbers block', owner: 'Founder', severity: 'Low', done: trust.stats.length > 0 },
    { id: 'credentials', item: 'Certifications / registrations with document reference', whereUsed: '/about', owner: 'Founder', severity: 'Low', done: trust.credentials.length > 0 },
    { id: 'labs', item: 'Lab comparison data (specs, capacity, indicative price)', whereUsed: '/labs', owner: 'Sales', severity: 'Medium', done: labs.length > 0 },
    { id: 'lead-magnets', item: 'Lead-magnet PDFs written and reviewed', whereUsed: '/resources', owner: 'Marketing', severity: 'Medium', done: leadMagnets.every((m) => m.available && m.fileUrl) },
    { id: 'hero-video', item: 'Optional hero video (≤ 6 MB, muted loop) + poster', whereUsed: 'Home hero', owner: 'Marketing', severity: 'Low', done: heroVideo.enabled },
    { id: 'analytics', item: 'Analytics ID (GA4 or Plausible)', whereUsed: 'Consent-gated scripts', owner: 'Marketing', severity: 'Medium', done: env('NEXT_PUBLIC_GA4_ID') || env('NEXT_PUBLIC_PLAUSIBLE_DOMAIN') },
    { id: 'keywords', item: 'Target keywords and cities for meta titles', whereUsed: 'Top 20 page titles/descriptions', owner: 'Marketing', severity: 'Medium', done: false },
    { id: 'translations', item: 'Hindi and Punjabi translations (professionally reviewed)', whereUsed: 'All pages', owner: 'Content', severity: 'Medium', done: false },
    { id: 'social', item: 'Official social profile URLs', whereUsed: 'Footer, Organization schema', owner: 'Marketing', severity: 'Low', done: Object.values(company.social).some(Boolean) },
  ];
}
