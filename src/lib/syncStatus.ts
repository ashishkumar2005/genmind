/**
 * Last CRM/email sync status, shown on /internal/placeholders.
 * In-memory (per instance) — replace with a database row when one is added (ADR-0004).
 */
type SyncStatus = { lastSuccess: string | null; lastFailure: string | null; lastError: string | null };

const g = globalThis as unknown as { __genmindedSync?: SyncStatus };
g.__genmindedSync ??= { lastSuccess: null, lastFailure: null, lastError: null };

export function recordSync(ok: boolean, note?: string) {
  const s = g.__genmindedSync!;
  if (ok) s.lastSuccess = new Date().toISOString();
  else { s.lastFailure = new Date().toISOString(); s.lastError = note ?? null; }
}

export function getSyncStatus(): SyncStatus {
  return { ...g.__genmindedSync! };
}
