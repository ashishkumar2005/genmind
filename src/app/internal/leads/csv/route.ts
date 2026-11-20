import { readLeads } from '@/lib/leadStore';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const COLUMNS = ['submittedAt', 'type', 'name', 'email', 'phone', 'organisation', 'role', 'audience', 'interest', 'product', 'students', 'city', 'preferredTime', 'message', 'resource', 'page', 'delivery'];

/** Quote a CSV cell, and stop spreadsheet formula injection (a cell starting with = + - @ runs as a formula in Excel). */
function cell(v: unknown) {
  let s = v == null ? '' : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

/** Internal (basic-auth protected by middleware): all stored submissions as a CSV file. */
export async function GET() {
  const leads = await readLeads();
  const rows = leads.map((l) => COLUMNS.map((c) => {
    if (c in l.data) return cell(l.data[c]);
    if (c === 'submittedAt' || c === 'type' || c === 'page' || c === 'delivery') return cell(l[c as 'submittedAt']);
    return cell('');
  }).join(','));
  // The BOM makes Excel read the file as UTF-8 (names in Hindi or Punjabi stay readable).
  const body = '﻿' + [COLUMNS.join(','), ...rows].join('\r\n');
  const date = new Date().toISOString().slice(0, 10);
  return new Response(body, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="genmindedtech-leads-${date}.csv"`,
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex',
    },
  });
}
