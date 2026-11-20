/**
 * Launch gate: exits non-zero while any Critical placeholder is open.
 * Run with production env vars loaded:  npm run check:placeholders
 */
import { getPlaceholderRegister } from '../src/content/placeholders';

const items = getPlaceholderRegister();
const open = items.filter((i) => !i.done);
const critical = open.filter((i) => i.severity === 'Critical');

for (const sev of ['Critical', 'High', 'Medium', 'Low'] as const) {
  const list = open.filter((i) => i.severity === sev);
  if (!list.length) continue;
  console.log(`\n${sev} (${list.length})`);
  for (const i of list) console.log(`  - ${i.item}  [${i.owner}]`);
}

if (critical.length) {
  console.error(`\n✗ Launch BLOCKED: ${critical.length} critical placeholder(s) open.`);
  process.exit(1);
}
console.log(`\n✓ No critical placeholders. ${open.length} lower-priority item(s) remain.`);
