import { PageHeader } from '@/components/PageHeader';
import { CtaBand } from '@/components/CtaBand';
import { TrackedLink } from '@/components/TrackedLink';
import { labs } from '@/content/solutions';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Compare AI & Robotics Lab Options',
  description: 'Compare our AI and robotics lab options side by side: who each is for, space needed, capacity and what is included. Request a tailored quote.',
  path: '/labs',
});

export default function LabsPage() {
  return (
    <>
      <PageHeader
        title="Compare lab options"
        intro="Every institution is different. Use this comparison as a starting point, then we will tailor a proposal to your space, students and budget."
        crumbs={[{ name: 'Labs', href: '/labs' }]}
        backdrop={{ kind: 'video', src: '/videos/header-labs.mp4', poster: '/videos/header-labs.jpg', label: '3D printers making prototypes in a workshop' }}
      />
      <section className="section" aria-labelledby="compare-h">
        <div className="container">
          <h2 id="compare-h" className="visually-hidden">Lab comparison</h2>
          {labs.length > 0 ? (
            <div className="table-wrap" role="region" aria-labelledby="compare-caption" tabIndex={0}>
              <table>
                <caption id="compare-caption" className="visually-hidden">Comparison of lab options</caption>
                <thead>
                  <tr>
                    <th scope="col">Lab</th>
                    <th scope="col">Best for</th>
                    <th scope="col">Age range</th>
                    <th scope="col">Space needed</th>
                    <th scope="col">Capacity</th>
                    <th scope="col">Includes</th>
                    {labs.some((l) => l.indicativePrice) && <th scope="col">Indicative price</th>}
                  </tr>
                </thead>
                <tbody>
                  {labs.map((l) => (
                    <tr key={l.name}>
                      <th scope="row">{l.name}</th>
                      <td>{l.bestFor}</td>
                      <td>{l.ageRange}</td>
                      <td>{l.spaceNeeded}</td>
                      <td>{l.capacity}</td>
                      <td>{l.includes}</td>
                      {labs.some((x) => x.indicativePrice) && <td>{l.indicativePrice ?? 'On request'}</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="card" style={{ maxWidth: 720 }}>
              <h3>Tailored to your institution</h3>
              <p>
                Our lab setups are planned around your space, number of students and curriculum, so we share options
                and costs after a short conversation rather than as a fixed price list.
              </p>
              <div className="btn-row">
                <TrackedLink href="/quote" cta="request_quote" location="labs_empty">Request a quote</TrackedLink>
                <TrackedLink href="/resources" cta="resources" location="labs_empty" className="btn btn--secondary">Free lab planning guide</TrackedLink>
              </div>
            </div>
          )}
        </div>
      </section>
      <CtaBand location="labs" />
    </>
  );
}
