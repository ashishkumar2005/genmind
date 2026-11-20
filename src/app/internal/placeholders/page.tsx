import type { Metadata } from 'next';
import { getPlaceholderRegister } from '@/content/placeholders';
import { FUNNEL_STAGES, getFunnel } from '@/lib/funnel';
import { getSyncStatus } from '@/lib/syncStatus';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Launch readiness (internal)', robots: { index: false, follow: false } };

/** Internal dashboard (basic-auth protected): placeholder register, funnel, A/B results, form sync status. */
export default function InternalPage() {
  const items = getPlaceholderRegister();
  const open = items.filter((i) => !i.done);
  const criticalOpen = open.filter((i) => i.severity === 'Critical');
  const funnel = getFunnel();
  const sync = getSyncStatus();
  const order = { Critical: 0, High: 1, Medium: 2, Low: 3 } as const;

  return (
    <section className="section">
      <div className="container stack">
        <h1 style={{ fontSize: 'var(--text-3xl)' }}>Launch readiness</h1>
        <p><a className="btn btn--secondary" href="/internal/leads">See form submissions</a></p>

        <div className={`alert ${criticalOpen.length ? 'alert--error' : 'alert--success'}`} role="status">
          {criticalOpen.length
            ? <><strong>Launch BLOCKED.</strong> {criticalOpen.length} critical placeholder(s) still open.</>
            : <><strong>No critical placeholders open.</strong> {open.length} lower-priority item(s) remain.</>}
        </div>

        <h2>Placeholder register</h2>
        <div className="table-wrap" role="region" aria-label="Placeholder register" tabIndex={0}>
          <table>
            <thead><tr><th scope="col">Severity</th><th scope="col">Item</th><th scope="col">Where it appears</th><th scope="col">Who supplies it</th><th scope="col">Status</th></tr></thead>
            <tbody>
              {[...items].sort((a, b) => Number(a.done) - Number(b.done) || order[a.severity] - order[b.severity]).map((i) => (
                <tr key={i.id}>
                  <td>{i.severity}</td>
                  <th scope="row">{i.item}</th>
                  <td>{i.whereUsed}</td>
                  <td>{i.owner}</td>
                  <td>{i.done ? '✓ Done' : 'Open'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>Form delivery (CRM / email sync)</h2>
        <ul>
          <li>Last successful delivery: {sync.lastSuccess ?? 'none since last restart'}</li>
          <li>Last failure: {sync.lastFailure ?? 'none'}{sync.lastError ? ` — ${sync.lastError}` : ''}</li>
        </ul>

        <h2>Conversion funnel <span className="muted">(since {funnel.since}, this server instance)</span></h2>
        <div className="table-wrap" role="region" aria-label="Funnel" tabIndex={0}>
          <table>
            <thead><tr><th scope="col">Stage</th><th scope="col">Events</th><th scope="col">Drop-off from previous</th></tr></thead>
            <tbody>
              {FUNNEL_STAGES.map((s, idx) => {
                const n = funnel.stages[s] ?? 0;
                const prev = idx > 0 ? funnel.stages[FUNNEL_STAGES[idx - 1]] ?? 0 : 0;
                const drop = idx > 0 && prev > 0 ? `${Math.round((1 - n / prev) * 100)}%` : '—';
                return <tr key={s}><th scope="row">{s}</th><td>{n}</td><td>{drop}</td></tr>;
              })}
              <tr><th scope="row">crm_sync</th><td colSpan={2}>See form delivery above and server logs (evt: crm_sync)</td></tr>
            </tbody>
          </table>
        </div>

        <h2>A/B tests</h2>
        {Object.keys(funnel.ab).length === 0 ? <p>No data yet.</p> : (
          <div className="table-wrap" role="region" aria-label="A/B results" tabIndex={0}>
            <table>
              <thead><tr><th scope="col">Test : variant</th><th scope="col">Exposures</th><th scope="col">Submissions</th><th scope="col">Rate</th></tr></thead>
              <tbody>
                {Object.entries(funnel.ab).map(([k, v]) => (
                  <tr key={k}><th scope="row">{k}</th><td>{v.exposure}</td><td>{v.submit}</td><td>{v.exposure ? `${((v.submit / v.exposure) * 100).toFixed(1)}%` : '—'}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="muted">Wait for at least a few hundred exposures per variant before drawing conclusions.</p>
      </div>
    </section>
  );
}
