import { company } from '@/content/site';
import { solutions } from '@/content/solutions';
import { publicRoutes } from '@/lib/routes';
import { SITE_URL } from '@/lib/seo';

/** Plain-text summary of the organisation and its services for AI search assistants (llms.txt convention). */
export function GET() {
  const lines = [
    `# ${company.registeredName}`,
    '',
    `> ${company.tagline}.`,
    '',
    `${company.brandName} helps schools and colleges in India plan and set up AI and robotics labs, supports teachers with curriculum and training, and runs student exhibitions and hackathons.`,
    '',
    '## Services',
    ...Object.values(solutions).flatMap((s) => [`### ${s.title}`, s.summary, ...s.offerings.map((o) => `- ${o.title}: ${o.body}`), `More: ${SITE_URL}/solutions/${s.slug}`, '']),
    '## Get in touch',
    `- Book a consultation: ${SITE_URL}/book-consultation`,
    `- Institutional enquiry: ${SITE_URL}/enquiry`,
    `- Request a quote: ${SITE_URL}/quote`,
    ...(company.email && !company.demoContactDetails ? [`- Email: ${company.email}`] : []),
    ...(company.phone && !company.demoContactDetails ? [`- Phone: ${company.phone}`] : []),
    '',
    '## Pages',
    ...publicRoutes.map((r) => `- [${r.name}](${SITE_URL}${r.path})`),
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
}
