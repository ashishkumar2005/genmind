import { solutions } from '@/content/solutions';

/** Every public, indexable route. Used by sitemap.xml, the HTML site map and the e2e tests. */
export const publicRoutes: { path: string; name: string; group: string; priority: number }[] = [
  { path: '/', name: 'Home', group: 'Main', priority: 1 },
  ...Object.values(solutions).map((s) => ({ path: `/solutions/${s.slug}`, name: s.title, group: 'Solutions', priority: 0.9 })),
  { path: '/labs', name: 'Compare labs', group: 'Solutions', priority: 0.8 },
  { path: '/case-studies', name: 'Case studies', group: 'Solutions', priority: 0.7 },
  { path: '/resources', name: 'Free resources', group: 'Main', priority: 0.7 },
  { path: '/about', name: 'About us', group: 'Main', priority: 0.7 },
  { path: '/contact', name: 'Contact', group: 'Get in touch', priority: 0.8 },
  { path: '/book-consultation', name: 'Book a consultation', group: 'Get in touch', priority: 0.9 },
  { path: '/enquiry', name: 'Institutional enquiry', group: 'Get in touch', priority: 0.8 },
  { path: '/quote', name: 'Request a quote', group: 'Get in touch', priority: 0.8 },
  { path: '/privacy', name: 'Privacy policy', group: 'Trust & legal', priority: 0.3 },
  { path: '/cookies', name: 'Cookie policy', group: 'Trust & legal', priority: 0.3 },
  { path: '/security', name: 'Security & data', group: 'Trust & legal', priority: 0.4 },
  { path: '/accessibility', name: 'Accessibility statement', group: 'Trust & legal', priority: 0.3 },
  { path: '/site-map', name: 'Site map', group: 'Trust & legal', priority: 0.2 },
];
