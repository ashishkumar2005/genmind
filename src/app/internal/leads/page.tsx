import type { Metadata } from 'next';
import { forms, type FormType } from '@/lib/forms';
import { readLeads, leadStoreKind, type StoredLead } from '@/lib/leadStore';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const metadata: Metadata = { title: 'Form submissions (internal)', robots: { index: false, follow: false } };

const FORM_NAMES: Record<string, string> = {
  consultation: 'Consultation', enquiry: 'Enquiry', quote: 'Quote', contact: 'Contact', 'lead-magnet': 'Guide request',
};

/** Label for a stored value: the option's label for selects, otherwise the value itself. */
function show(type: string, field: string, value: string) {
  const def = forms[type as FormType]?.fields.find((f) => f.name === field);
  return def?.options?.find((o) => o.value === value)?.label ?? value;
}

/** Internal (basic-auth protected): every form submission saved on this server, newest first. */
export default async function LeadsPage() {
  let leads: StoredLead[] = [];
  let loadError = '';
  try { leads = await readLeads(); } catch (err) { loadError = String(err); }
  const where = leadStoreKind() === 'redis' ? 'Saved in Redis (Upstash).' : 'Saved in a file on this server.';
  const failed = leads.filter((l) => l.delivery === 'stored-webhook-failed').length;

  return (
    <section className="section">
      <div className="container stack">
        <h1 style={{ fontSize: 'var(--text-3xl)' }}>Form submissions</h1>
        {loadError && <div className="alert alert--error" role="alert">Could not load submissions: {loadError}</div>}
        <p className="lead">
          {loadError ? '' : leads.length === 0
            ? 'No submissions yet. They appear here as soon as someone sends a form.'
            : `${leads.length} submission${leads.length === 1 ? '' : 's'}, newest first.`}{' '}
          <span className="muted">{where}</span>
        </p>
        {failed > 0 && (
          <div className="alert alert--error" role="status">
            {failed} submission{failed === 1 ? '' : 's'} could not be sent to your CRM webhook and {failed === 1 ? 'is' : 'are'} only stored here. Follow up manually.
          </div>
        )}
        {leads.length > 0 && (
          <p><a className="btn btn--secondary" href="/internal/leads/csv" download>Download all as CSV (opens in Excel)</a></p>
        )}
        {leads.map((l) => (
          <article key={l.id} className="card" aria-labelledby={`lead-${l.id}`}>
            <h2 id={`lead-${l.id}`} style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-2)' }}>
              {FORM_NAMES[l.type] ?? l.type}: {l.data.name || 'No name'}
            </h2>
            <p className="muted" style={{ marginBottom: 'var(--space-3)' }}>
              {new Date(l.submittedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' })}
              {l.page ? ` · from ${l.page}` : ''}
              {l.delivery === 'stored-webhook-failed' ? ' · not sent to CRM' : ''}
            </p>
            <dl style={{ display: 'grid', gridTemplateColumns: 'minmax(8rem, max-content) 1fr', gap: '0.35rem 1rem', margin: 0 }}>
              {Object.entries(l.data).map(([k, v]) => (
                <div key={k} style={{ display: 'contents' }}>
                  <dt className="muted">{forms[l.type as FormType]?.fields.find((f) => f.name === k)?.label ?? k}</dt>
                  <dd style={{ margin: 0, color: 'var(--color-ink-900)', overflowWrap: 'anywhere', whiteSpace: 'pre-wrap' }}>{show(l.type, k, v)}</dd>
                </div>
              ))}
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}
