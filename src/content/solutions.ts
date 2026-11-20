/**
 * Service descriptions. Wording is deliberately factual and free of claims
 * that need proof (no "best", "leading", "No. 1", no numbers).
 * Edit to match exactly what GenmindEdtech delivers; remove anything you do not offer.
 */

export type Audience = 'schools' | 'colleges' | 'students';

export const solutions: Record<Audience, {
  slug: Audience; navLabel: string; title: string; summary: string; metaDescription: string;
  offerings: { title: string; body: string }[];
  steps: string[];
  primaryCta: { label: string; href: string };
}> = {
  schools: {
    slug: 'schools',
    navLabel: 'For Schools',
    title: 'AI & robotics programmes for schools',
    summary: 'Lab setup, curriculum support, teacher training and student events that fit your timetable and budget.',
    metaDescription: 'AI, robotics and STEM labs, curriculum support, teacher training and hackathons for schools. Book a free consultation with GenmindEdtech.',
    offerings: [
      { title: 'AI & Robotics Lab setup', body: 'We help you plan the space, choose equipment, install it and hand it over with documentation and safety guidance.' },
      { title: 'Curriculum & lesson support', body: 'Age-appropriate lesson plans and projects mapped to your classes, with assessment materials teachers can use straight away.' },
      { title: 'Teacher training', body: 'Hands-on sessions so your staff can run the lab confidently without depending on us.' },
      { title: 'Exhibitions & hackathons', body: 'Planning and running student showcases, from team formation and mentoring to judging on the day.' },
    ],
    steps: ['Free consultation to understand your goals', 'Proposal with options and costs', 'Setup and teacher training', 'Ongoing support through the academic year'],
    primaryCta: { label: 'Book a consultation', href: '/book-consultation?audience=school' },
  },
  colleges: {
    slug: 'colleges',
    navLabel: 'For Colleges',
    title: 'Industry-aligned labs and programmes for colleges',
    summary: 'Advanced labs, workshops and project-based programmes that give students practical AI, data and robotics experience.',
    metaDescription: 'AI, data science and robotics labs, workshops and project programmes for colleges and universities. Send an institutional enquiry.',
    offerings: [
      { title: 'Advanced lab setup', body: 'Equipment and software planning for AI, IoT and robotics labs, including installation and handover.' },
      { title: 'Workshops & bootcamps', body: 'Short, intensive programmes on applied AI, data science and embedded systems, delivered on your campus.' },
      { title: 'Project mentoring', body: 'Guidance for final-year and capstone projects, from scoping to demonstration.' },
      { title: 'Hackathons & competitions', body: 'End-to-end support for running inter-college events.' },
    ],
    steps: ['Enquiry and requirements call', 'Tailored proposal', 'Delivery on campus', 'Review and next steps'],
    primaryCta: { label: 'Send an institutional enquiry', href: '/enquiry?audience=college' },
  },
  students: {
    slug: 'students',
    navLabel: 'For Students',
    title: 'Learn AI, coding and robotics by building',
    summary: 'Courses, workshops and events where you learn by making real projects.',
    metaDescription: 'Hands-on AI, coding and robotics courses, workshops and hackathons for students. Talk to GenmindEdtech about the right programme.',
    offerings: [
      { title: 'Courses', body: 'Structured, project-based courses in AI, Python and robotics.' },
      { title: 'Workshops', body: 'Short sessions to try something new, such as building a robot car or training a simple AI model.' },
      { title: 'Hackathons & events', body: 'Team up, build something in a day and present it.' },
    ],
    steps: ['Tell us your interests and level', 'We suggest a programme', 'Join and start building'],
    primaryCta: { label: 'Talk to us', href: '/book-consultation?audience=student' },
  },
};

/** Labs comparison. Leave empty until real specifications are supplied. */
export type LabRow = { name: string; bestFor: string; ageRange: string; spaceNeeded: string; capacity: string; includes: string; indicativePrice?: string };
export const labs: LabRow[] = [];
