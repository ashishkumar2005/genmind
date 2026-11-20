/**
 * PHOTO SLOTS — every place on the site that can show a real photo.
 *
 * How it works
 * 1. Save a photo into /public/images/ with the file name given below.
 * 2. Run `npm run media` (also runs automatically before `dev` and `build`).
 *    It checks the photo, reads its size and makes a blur placeholder.
 * 3. The slot shows the photo. Slots with no photo keep their illustration.
 *
 * Rules (enforced by scripts/build-media.ts)
 * - `alt` describes what matters in the photo, in one sentence. No "image of".
 * - Photos that show people need `consentRef` (signed release on file) — see
 *   docs/photography-and-consent.md. Without it the photo is NOT published.
 * - Stock photos only of equipment and objects, never of people presented as
 *   our students or staff.
 * - Long edge at least 1600 px. Originals are fine; next/image serves
 *   AVIF/WebP at the right size automatically.
 *
 * Suggested free photos (Unsplash licence) for each slot: docs/photo-sources.md
 */

export type SlotId =
  | 'audience-schools' | 'audience-colleges' | 'audience-students'
  | 'domain-ai' | 'domain-robotics' | 'domain-iot' | 'domain-drones' | 'domain-coding' | 'domain-fabrication'
  | 'header-labs' | 'header-resources' | 'header-about' | 'header-case-studies' | 'header-contact'
  | 'offer-schools-1' | 'offer-schools-2' | 'offer-schools-3' | 'offer-schools-4'
  | 'offer-colleges-1' | 'offer-colleges-2' | 'offer-colleges-3' | 'offer-colleges-4'
  | 'offer-students-1' | 'offer-students-2' | 'offer-students-3';

export type PhotoEntry = {
  file: string;
  alt: string;
  licence: 'own' | 'unsplash' | 'pexels' | 'purchased';
  credit?: string;
  showsPeople: boolean;
  consentRef?: string;
  /** CSS object-position to keep the subject in frame when cropped, e.g. '50% 35%'. */
  position?: string;
};

export const photos: Partial<Record<SlotId, PhotoEntry>> = {
  // ---- Home: "Who we work with" ----
  'audience-schools': {
    file: 'audience-schools.jpg',
    alt: 'Lab tables set out for a class, with a tray of kit, tools and worksheets at each place',
    licence: 'unsplash', credit: 'Unsplash', showsPeople: false,
  },
  'audience-colleges': {
    file: 'audience-colleges.jpg',
    alt: 'An industrial robot arm in a glass-walled lab cell',
    licence: 'unsplash', credit: 'Unsplash', showsPeople: false,
  },
  'audience-students': {
    file: 'audience-students.jpg',
    alt: 'Hands wiring a microcontroller board on a breadboard',
    licence: 'unsplash', credit: 'Unsplash', showsPeople: false,
  },

  // ---- Page headers ----
  // Equipment-only photos: they show the subject of each page, never a team, office or event
  // that could be mistaken for ours. Replace with your own photos (with consent) when you have them.
  'header-about': { file: 'header-about.jpg', alt: 'An Arduino board wired to a breadboard with colourful jumper wires', licence: 'unsplash', credit: 'Unsplash', showsPeople: false, position: '50% 45%' },
  'header-resources': { file: 'header-resources.jpg', alt: 'Close-up of a Raspberry Pi circuit board', licence: 'unsplash', credit: 'Unsplash', showsPeople: false },
  'header-case-studies': { file: 'header-case-studies.jpg', alt: 'A tracked robot with an ultrasonic sensor on a display table', licence: 'unsplash', credit: 'Unsplash', showsPeople: false, position: '50% 60%' },
  'header-contact': { file: 'header-contact.jpg', alt: 'Program code in a dark editor on a laptop screen', licence: 'unsplash', credit: 'Unsplash', showsPeople: false },

  // ---- Solutions pages: one photo per offering, in the order listed in solutions.ts ----
  'offer-schools-1': { file: 'offer-schools-1.jpg', alt: 'A fitted-out lab classroom with workbenches, stools and storage cabinets', licence: 'unsplash', credit: 'Unsplash', showsPeople: false },
  'offer-schools-2': { file: 'offer-schools-2.jpg', alt: 'An open lesson-plan binder with pens and highlighters on a desk', licence: 'unsplash', credit: 'Unsplash', showsPeople: false },
  'offer-schools-3': { file: 'offer-schools-3.jpg', alt: 'A trainer\'s hand sketching a diagram on a whiteboard', licence: 'unsplash', credit: 'Unsplash', showsPeople: false },
  'offer-schools-4': { file: 'offer-schools-4.jpg', alt: 'A student-built robot on a printed competition field', licence: 'unsplash', credit: 'Unsplash', showsPeople: false, position: '50% 60%' },
  'offer-colleges-1': { file: 'offer-colleges-1.jpg', alt: 'An advanced fabrication lab with CNC machines, tool chests and workbenches', licence: 'unsplash', credit: 'Unsplash', showsPeople: false },
  'offer-colleges-2': { file: 'offer-colleges-2.jpg', alt: 'A workshop table seen from above: laptops, notebooks and hands at work', licence: 'unsplash', credit: 'Unsplash', showsPeople: false },
  'offer-colleges-3': { file: 'offer-colleges-3.jpg', alt: 'A prototype circuit on breadboards being tested with a multimeter', licence: 'unsplash', credit: 'Unsplash', showsPeople: false },
  'offer-colleges-4': { file: 'offer-colleges-4.jpg', alt: 'A row of silver competition trophies', licence: 'unsplash', credit: 'Unsplash', showsPeople: false },
  'offer-students-1': { file: 'offer-students-1.jpg', alt: 'Program code on a laptop screen in a dark room', licence: 'unsplash', credit: 'Unsplash', showsPeople: false },
  'offer-students-2': { file: 'offer-students-2.jpg', alt: 'A small robot car with red wheels and an ultrasonic sensor', licence: 'unsplash', credit: 'Unsplash', showsPeople: false, position: '80% 50%' },
  'offer-students-3': { file: 'offer-students-3.jpg', alt: 'A team working on laptops at a long table, seen from above (no faces visible)', licence: 'unsplash', credit: 'Unsplash', showsPeople: false },
};
