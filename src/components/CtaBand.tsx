import { TrackedLink } from './TrackedLink';

/** Below-the-fold next step. Every public page ends with one. */
export function CtaBand({
  title = 'Not sure where to start?',
  body = 'A free 30-minute consultation is the quickest way to find out what would work for your institution.',
  location,
}: { title?: string; body?: string; location: string }) {
  return (
    <section className="section section--brand" aria-labelledby={`cta-${location}`}>
      <div className="container cta-band">
        <div>
          <h2 id={`cta-${location}`}>{title}</h2>
          <p>{body}</p>
        </div>
        <div className="btn-row">
          <TrackedLink href="/book-consultation" cta="book_consultation" location={`band_${location}`} className="btn btn--copper">Book a consultation</TrackedLink>
          <TrackedLink href="/quote" cta="request_quote" location={`band_${location}`} className="btn btn--ghost-dark">Request a quote</TrackedLink>
        </div>
      </div>
    </section>
  );
}
