import { BrochureLink } from '@/components/BrochureLink';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { HeroMedia } from '@/components/HeroMedia';
import { Hero3D } from '@/components/three/Hero3D';
import { TrackedLink } from '@/components/TrackedLink';
import { SolutionFinder } from '@/components/SolutionFinder';
import { DomainExplorer } from '@/components/DomainExplorer';
import { LogoStrip, Numbers, Testimonials } from '@/components/TrustBlocks';
import { CtaBand } from '@/components/CtaBand';
import { AbExposure } from '@/components/AbExposure';
import { ClassroomLabIllustration, RobotCarIllustration, WorkstationIllustration } from '@/components/illustrations/Illustrations';
import { heroVideo } from '@/content/site';
import { Photo } from '@/components/Photo';
import { solutions } from '@/content/solutions';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'AI & Robotics Labs and Training for Schools',
  description: 'GenmindEdtech helps schools and colleges set up AI and robotics labs, train teachers and run student hackathons. Book a free consultation.',
  path: '/',
});

// A/B test: hero CTA wording. Variant is set by middleware; results come from cta_click events grouped by variant.
const HERO_CTA = { A: 'Book a free consultation', B: 'Plan your lab with us' } as const;

const AUDIENCE_ART = {
  schools: ClassroomLabIllustration,
  colleges: WorkstationIllustration,
  students: RobotCarIllustration,
} as const;

export default function HomePage() {
  const variant = cookies().get('ab_hero')?.value === 'B' ? 'B' : 'A';

  return (
    <>
      <section className="hero" aria-labelledby="hero-h">
        {heroVideo.enabled ? <HeroMedia /> : <Hero3D />}
        <div className="container hero__inner">
          <div className="hero__copy">
            <h1 id="hero-h" className="hero__title">
              The future is <span className="grad-text">built</span>, not imagined.
            </h1>
            <p className="hero__lead">
              Hands-on AI, robotics and future-ready technology for schools, colleges and students.
              We set up labs, train teachers and run hackathons, so learners build real things.
            </p>
            <div className="btn-row">
              <TrackedLink href="/book-consultation" cta={`hero_${variant}`} location="hero" className="btn btn--primary">
                {HERO_CTA[variant]} <span className="arrow" aria-hidden="true">↘</span>
              </TrackedLink>
              <TrackedLink href="/enquiry" cta="institutional_enquiry" location="hero" className="btn btn--secondary">
                Partner with us
              </TrackedLink>
            </div>
            <p className="hero__brochure"><BrochureLink location="hero" className="text-link" label="Or download our brochure" /></p>
            <AbExposure test="hero_cta" variant={variant} />
            <p className="hero__tagline">Learn. Innovate. Build. Compete.</p>
          </div>
        </div>
      </section>

      <LogoStrip />

      <section className="section" aria-labelledby="who-h">
        <div className="container">
          <p className="eyebrow">Who we work with</p>
          <h2 id="who-h" className="section-title">One partner from <span className="grad-text">classroom</span> to campus.</h2>
          <div className="audiences">
            {Object.values(solutions).map((s) => {
              const Art = AUDIENCE_ART[s.slug];
              return (
                <article key={s.slug} className="audience">
                  <Photo
                    slot={`audience-${s.slug}`}
                    fallback={<div className="audience__art"><Art /></div>}
                    sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 380px"
                    className="audience__photo"
                  />
                  <h3><Link href={`/solutions/${s.slug}`} className="audience__link">{s.title}</Link></h3>
                  <p>{s.summary}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section section--board" aria-labelledby="domains-h">
        <div className="container">
          <p className="eyebrow">Technology domains</p>
          <h2 id="domains-h" className="section-title">Six pillars of <span className="grad-text">applied</span> engineering.</h2>
          <p className="lead">Each one taught through projects students build, test and put on display.</p>
          <DomainExplorer />
        </div>
      </section>

      <section className="section" aria-labelledby="how-h">
        <div className="container grid grid--2" style={{ alignItems: 'start' }}>
          <div>
            <p className="eyebrow">How it works</p>
            <h2 id="how-h" className="section-title">From first call to a <span className="grad-text">working lab</span>.</h2>
            <ol className="steps">
              <li><strong>Consultation.</strong> We learn about your students, space, timetable and budget.</li>
              <li><strong>Proposal.</strong> Clear options, what is included and what each costs.</li>
              <li><strong>Setup and training.</strong> We install, document and train your teachers.</li>
              <li><strong>Support.</strong> Help through the year, plus events that keep students engaged.</li>
            </ol>
            <div className="btn-row" style={{ marginTop: 'var(--space-5)' }}>
              <TrackedLink href="/labs" cta="compare_labs" location="how" className="btn btn--secondary">Compare labs</TrackedLink>
              <BrochureLink location="how" label="Download brochure" showMeta={false} />
            </div>
          </div>
          <SolutionFinder />
        </div>
      </section>

      <Numbers />
      <Testimonials />

      <CtaBand location="home" />
    </>
  );
}
