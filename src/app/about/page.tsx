import { BrochureLink } from '@/components/BrochureLink';
import Image from 'next/image';
import { PageHeader } from '@/components/PageHeader';
import { CtaBand } from '@/components/CtaBand';
import { Credentials } from '@/components/TrustBlocks';
import { CompanyDetails } from '@/components/CompanyDetails';
import { company, team } from '@/content/site';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'About Us',
  description: 'Who we are, how we work and the people behind GenmindEdtech, an Indian company bringing hands-on AI and robotics learning to schools and colleges.',
  path: '/about',
});

export default function AboutPage() {
  const leaders = team.filter((p) => p.leadership);
  const others = team.filter((p) => !p.leadership);
  return (
    <>
      <PageHeader title={`About ${company.brandName}`} intro="We believe students learn technology best by building with it." crumbs={[{ name: 'About', href: '/about' }]} backdrop={{ kind: 'photo', slot: 'header-about' }} />

      <section className="section" aria-labelledby="approach-h">
        <div className="container prose">
          <h2 id="approach-h">Our approach</h2>
          <p>
            {company.registeredName} works with schools, colleges and students to make AI, robotics and STEM learning
            practical. We plan and set up labs, support teachers with curriculum and training, and run events such as
            exhibitions and hackathons where students show what they have built.
          </p>
          <p>We keep our recommendations honest: the right setup is the one your teachers can run and your students will use, not the biggest one.</p>
          <p>Our brochure covers our solutions, technology domains and how we work, in a form you can share.</p>
          <p><BrochureLink location="about" /></p>
        </div>
      </section>

      {leaders.length > 0 && <TeamGrid id="leadership" title="Leadership" people={leaders} />}
      {others.length > 0 && <TeamGrid id="team" title="Meet the team" people={others} />}

      <Credentials />

      <section className="section" aria-labelledby="company-h">
        <div className="container">
          <h2 id="company-h" className="visually-hidden">Company details</h2>
          <CompanyDetails />
        </div>
      </section>

      <CtaBand location="about" />
    </>
  );
}

function TeamGrid({ id, title, people }: { id: string; title: string; people: typeof team }) {
  return (
    <section className="section section--alt" aria-labelledby={`${id}-h`}>
      <div className="container">
        <h2 id={`${id}-h`}>{title}</h2>
        <ul className="grid grid--3" style={{ listStyle: 'none', padding: 0 }}>
          {people.map((p) => (
            <li key={p.name} className="card" style={{ marginTop: 0 }}>
              {p.photo && (
                <div className="media" style={{ aspectRatio: '1 / 1' }}>
                  <Image src={p.photo.src} alt={p.photo.alt} width={480} height={480} sizes="(max-width: 640px) 100vw, 360px" />
                </div>
              )}
              <h3>{p.name}</h3>
              <p className="muted" style={{ margin: 0 }}>{p.role}</p>
              {p.bio && <p>{p.bio}</p>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
