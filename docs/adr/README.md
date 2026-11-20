# Architecture Decision Records

Short records of significant decisions: context, decision, consequences. Add a new numbered file for each new decision; do not edit accepted ones — supersede them.

---

## ADR-0001 — Stack: Next.js (App Router) + TypeScript + plain CSS tokens

**Status:** Accepted · 2026-11-15

**Context.** A marketing and lead-generation site that must be fast on mid-range Android phones over 4G, rank well, and be maintainable by a small team.

**Decision.** Next.js 14 App Router with React Server Components, TypeScript strict mode, and plain CSS driven by custom-property design tokens (no CSS framework, no UI kit).

**Consequences.** Most pages are static HTML with very little client JS. Only interactive pieces (menu, forms, consent, solution finder) ship JavaScript. No dependency on a CSS framework's release cycle. Developers must use tokens rather than ad-hoc values (enforced by review).

## ADR-0002 — Content in typed files, no database yet

**Status:** Accepted · 2026-11-15

**Context.** Company facts and trust content change rarely and must never be invented. A CMS or database adds hosting, backups and security surface.

**Decision.** Store content in `src/content/*.ts`. Components render a block only when its data is present and approved. A computed placeholder register lists what is missing.

**Consequences.** Content changes go through Git (reviewable, reversible). Non-developers need a developer or a simple Git-based editor. Revisit when weekly content edits become common (candidates: Sanity, Payload, or a Postgres-backed admin).

## ADR-0003 — Internal pages protected by HTTP Basic Auth

**Status:** Accepted (interim) · 2026-11-15

**Decision.** `/brand` and `/internal/*` are protected by middleware Basic Auth using `INTERNAL_USER` / `INTERNAL_PASSWORD`; it fails closed in production when credentials are missing.

**Consequences.** One shared credential, no roles. Replace with proper per-user auth (e.g. Auth.js with email magic links and roles: Editor, Sales, Registration Manager, Judge) when an admin area with write access is added. Rotate the password when anyone leaves.

## ADR-0004 — Lead delivery via webhook; in-memory rate limits and counters

**Status:** Accepted · 2026-11-15

**Decision.** Forms are validated on the server and forwarded to `LEAD_WEBHOOK_URL` (CRM, Zapier/Make, or an email service). Rate limits, funnel counters and last-sync status are kept in memory.

**Consequences.** Simple and cheap. Limits and counters are per server instance and reset on deploy. The rate limiter trusts `x-forwarded-for`, which is safe only behind a proxy that overwrites it (Vercel, Cloudflare, Nginx with `real_ip`). When moving to multi-instance hosting or needing durable reporting, switch to Redis/Upstash and a database table.

## ADR-0005 — Internationalisation (English now; Hindi and Punjabi next)

**Status:** Proposed · 2026-11-15

**Decision.** Launch in `en-IN`. Add Hindi (`hi-IN`) and Punjabi (`pa-IN`) as locale-prefixed routes (`/hi/…`, `/pa/…`) with professionally reviewed translations, `hreflang` alternates and `lang` attributes. The font stack already includes Noto Sans Devanagari and Gurmukhi; add those font files for share images.

**Consequences.** No machine-translated pages will be published. Until translations are supplied, there are no language switcher or `hreflang` tags (avoiding hreflang errors).

## ADR-0006 — Payments and registration

**Status:** Deferred · 2026-11-15

**Context.** Event registration, payments and certificate verification belong to a later phase and are not part of this codebase.

**Decision.** When added: Razorpay (INR, UPI, netbanking), webhook signature verification, idempotent order handling, test mode in CI, and a database (see ADR-0002 revisit).

## ADR-0007 — Hero 3D with plain Three.js and quality tiers

**Status:** Accepted · 2026-11-15

**Context.** The site should feel like a technology company's, without hurting load speed on mid-range Android phones.

**Decision.** One 3D scene (robot arm on a circuit board) written in plain Three.js, loaded with `import()` only after the browser is idle, so it never delays the headline (LCP). Quality tiers High / Medium / Low / Off are chosen from WebGL support, GPU, memory, cores, Data Saver and motion settings, then stepped down automatically if the frame rate stays under 40 fps. The scene pauses when off-screen or in a background tab and disposes every geometry, material, texture and the WebGL context on unmount. A server-rendered SVG illustration of the same scene is always present as the fallback. "Turn off 3D" and "Reduce effects" are remembered.

**Consequences.** About 160 kB (gzipped) of extra JavaScript, fetched only on capable devices after the page is interactive. Lighthouse in CI runs with software rendering, which selects the Off tier; measure the 3D tiers on real devices using the plan in `docs/qa-and-performance.md`.
