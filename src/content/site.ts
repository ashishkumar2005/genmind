/**
 * SINGLE SOURCE OF TRUTH for company facts and trust/proof content.
 *
 * RULES
 * - Only enter information that is real and approved. Never invent numbers,
 *   clients, quotes, credentials or people.
 * - Leave a field as `null` / empty array until the real value is supplied.
 *   Components hide automatically when data is missing, and the item
 *   appears in the Placeholder Register (/internal/placeholders).
 * - Logos and testimonials need `permission: true` (written permission on file)
 *   or they will not render.
 */

export type Logo = { name: string; src: string; width: number; height: number; permission: boolean; permissionRef: string };
export type Testimonial = { quote: string; name: string; role: string; organisation: string; permission: boolean; approvedOn: string };
export type Stat = { value: string; label: string; source: string; asOf: string };
export type Credential = { title: string; issuer: string; documentRef: string; validUntil?: string };
export type Person = { name: string; role: string; bio?: string; photo?: { src: string; alt: string }; leadership?: boolean };
export type CaseStudy = {
  slug: string; title: string; client: string; clientApproved: boolean;
  challenge: string; solution: string; implementation: string;
  outcomes: { metric: string; detail: string }[];
  quote?: Testimonial; gallery?: { src: string; alt: string }[];
};

export const company = {
  brandName: 'GenmindEdtech',
  registeredName: 'GenmindEdtech Pvt. Ltd.',
  tagline: 'AI, robotics and STEM learning for schools, colleges and students',
  /**
   * DEMO CONTACT DETAILS — placeholders so the site can be tested end to end.
   * The email uses the reserved ".example" domain (mail to it goes nowhere) and the phone number is all
   * zeros, so no real person is contacted. While this is true: the launch checklist stays red, and the
   * details are left out of the search-engine data (schema). Replace the values below and set this to false.
   */
  demoContactDetails: true,
  // ---- Replace with real, verified values ----
  email: 'hello@genmindedtech.example' as string | null,
  phone: '+91 00000 00000' as string | null,         // display format, e.g. "+91 98xxx xxxxx"
  address: { street: 'Demo address, Sector 17', city: 'Chandigarh', state: 'Chandigarh', postalCode: '160017', country: 'India' } as null | { street: string; city: string; state: string; postalCode: string; country: string },
  geo: null as null | { lat: number; lng: number },
  openingHours: null as string | null,              // e.g. "Mo-Sa 09:30-18:30"
  gstin: null as string | null,
  cin: null as string | null,
  foundedYear: null as number | null,
  responseTime: 'within 1 working day',
  /** Person who answers privacy questions and handles data requests (DPDP Rules, Rule 9). Shown on /privacy. */
  privacyContact: { name: 'Data Protection Contact (demo)' as string | null, email: 'privacy@genmindedtech.example' as string | null },             // promise shown after form submit — confirm with Sales
  social: {
    linkedin: null as string | null,
    instagram: null as string | null,
    youtube: null as string | null,
  },
  // Logo files live in /public/logo/ (SVG + PNG, for dark and light backgrounds). Used in schema, emails and PDFs.
  logo: { src: '/logo/genmindedtech-logo-on-dark.svg', width: 300, height: 64, markPng: '/logo/genmindedtech-mark-512.png' } as null | { src: string; width: number; height: number; markPng?: string },
};

export const trust = {
  logos: [] as Logo[],
  testimonials: [] as Testimonial[],
  stats: [] as Stat[],
  credentials: [] as Credential[],
};

export const team: Person[] = [];

export const caseStudies: CaseStudy[] = [];

/** Optional looping hero video. Admin switch: set enabled true once a real video (≤ 6 MB) is uploaded. */
export const heroVideo = {
  enabled: false,
  src: '/media/hero-loop.mp4',
  poster: '/media/hero-poster.jpg',
  captionsSrc: null as string | null, // not needed while the video has no speech
};

/**
 * Company brochure: direct PDF download (no form). File: /public/downloads/genmindedtech-brochure.pdf
 * `final` stays false while the PDF still contains "[ADD …]" / "[CONFIRM …]" placeholders; the launch
 * checklist stays red until a finished brochure is uploaded and this is set to true.
 */
export const brochure = {
  href: '/downloads/genmindedtech-brochure.pdf',
  fileName: 'GenmindEdtech-Brochure.pdf',
  pages: 12,
  size: '5.4 MB',
  final: false,
};

/** Lead magnets. `fileUrl` must point to a real, reviewed PDF before `available` is set true. */
export const leadMagnets = [
  { id: 'brochure', title: 'Institution Brochure', description: 'An overview of our programmes and lab setups for schools and colleges.', fileUrl: null as string | null, available: false },
  { id: 'lab-guide', title: 'AI & Robotics Lab Planning Guide', description: 'Space, safety, equipment categories, timetabling and staffing questions to work through before setting up a lab.', fileUrl: null as string | null, available: false },
  { id: 'hackathon', title: 'How to Run a School Hackathon — Checklist', description: 'A step-by-step checklist from planning and judging criteria to safeguarding and the day itself.', fileUrl: null as string | null, available: false },
];
