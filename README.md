# GenMindedTech — website

Public website for **GenMindedTech Pvt. Ltd.**: AI, robotics and STEM programmes for schools, colleges and students.

Built to the Phase 5 standard: one design-token system, content that only appears when it is real and approved, consent-first analytics, WCAG 2.2 AA, Lighthouse budgets in CI, and a live placeholder register that blocks launch while critical information is missing.

---

## 1. Quick start

```bash
# Node 18.18+ (20 recommended)
npm install
cp .env.example .env.local      # fill in what you have; everything is optional in development
npm run dev                     # http://localhost:3000
```

| Script | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build / serve |
| `npm run typecheck` | TypeScript, no emit |
| `npm run lint` | ESLint incl. jsx-a11y rules |
| `npm run test:e2e` | Playwright: smoke, forms, consent, axe a11y, link check, headers, visual regression |
| `npm run test:a11y` | Accessibility tests only |
| `npm run lhci` | Lighthouse CI with budgets (run after `build`) |
| `npm run check:placeholders` | **Launch gate** — fails while any Critical placeholder is open |
| `npm run prelaunch` | Everything above that must pass before go-live |

First time running visual tests: `npx playwright test visual --update-snapshots`, review the images, then commit them.

## 2. Architecture

```
Browser ──► Next.js (App Router, mostly static pages)
              │
              ├─ /api/lead    ── validate · honeypot · rate-limit ──► LEAD_WEBHOOK_URL (CRM / email automation)
              ├─ /api/events  ── cookieless funnel events ──► server logs + in-memory counters
              ├─ /og          ── share images (next/og)
              ├─ /llms.txt, /sitemap.xml, /robots.txt
              └─ middleware   ── basic auth for /brand & /internal/* · A/B variant cookies

Third-party (GA4 / Plausible / Clarity / WhatsApp) ── loaded ONLY after consent
```

There is no database yet. Company facts and trust content live in typed files under `src/content/` (see ADR-0002).

## 3. Folder map

```
src/
  app/                 pages (one folder per route), API routes, sitemap/robots/og/icon
    internal/placeholders   launch readiness: placeholder register, funnel, A/B, sync status (auth)
    brand/                  brand guidelines (auth, noindex)
  components/          shared UI (Header, Footer, LeadForm, ConsentBanner, TrustBlocks, DomainExplorer, …)
    three/             3D hero: scene (Three.js), quality tiers, React wrapper (ADR-0007)
    illustrations/     original line illustrations used until real photos are supplied
  content/
    site.ts            ★ company details, logos, testimonials, numbers, team, case studies, lead magnets
    solutions.ts       ★ service copy per audience, lab comparison data
    domains.ts         ★ learning domains and example projects (home page)
    placeholders.ts    placeholder register (computed from the two files above)
  lib/                 seo, forms (shared validation), consent, analytics, rate limit, routes
  styles/tokens.css    ★ design tokens — the only place colours/sizes/motion are defined
tests/e2e/             Playwright + axe
tests/load/            k6 load test for the form endpoint
docs/                  ADRs, runbooks, style guide, photography & consent, launch plan, maintenance
.github/workflows/     CI (typecheck, lint, audit, secrets, build, budgets, e2e, Lighthouse) + uptime checks
```

## 4. Environment variables

See `.env.example`. Summary:

| Variable | Required for launch | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Yes | Canonical URLs, sitemap, share images |
| `LEAD_WEBHOOK_URL` | Yes | Where form submissions go. In production, forms refuse to submit without it. |
| `LEAD_WEBHOOK_SECRET` | Recommended | Sent as `Authorization: Bearer …` to the webhook |
| `LEAD_DRY_RUN` | **Never in production** | CI/staging only: accept forms without forwarding |
| `INTERNAL_USER` / `INTERNAL_PASSWORD` | Yes | Basic auth for `/brand` and `/internal/*` (fails closed in production) |
| `NEXT_PUBLIC_GA4_ID` / `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Optional | Analytics (after consent) |
| `NEXT_PUBLIC_CLARITY_ID` | Optional | Heatmaps/session replay (after consent, inputs masked) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Optional | WhatsApp button (after consent) |

## 5. Editing content

1. Open `src/content/site.ts`. Fill a field **only with real, approved information**.
2. Logos and testimonials need `permission: true` and a reference to the written permission.
3. Numbers need a `source` and an `asOf` date, or they are not shown.
4. Check `/internal/placeholders` to see what is still missing.

## 6. Deploy

Recommended host: Vercel (zero-config for Next.js; headers, edge OG images and preview deployments work out of the box). Any Node 18+ host works with `npm run build && npm start`.

1. Set the environment variables in the host for **Production** and **Preview** separately (`LEAD_DRY_RUN=true` on Preview only).
2. Merge to `main` → CI must be green → production deploy.
3. Follow `docs/launch-plan.md` for go-live day.

**Roll back:** in Vercel, *Deployments → previous deployment → Promote to Production* (instant). On other hosts, redeploy the previous Git tag: `git checkout vX.Y.Z && npm ci && npm run build && npm start`. Tag every release: `git tag vX.Y.Z && git push --tags`.

## 7. Documentation

- `docs/adr/` — architecture decisions
- `docs/runbooks.md` — what to do when things break
- `docs/style-guide.md` — voice, words to use/avoid, spelling
- `docs/photography-and-consent.md` — shot list, specs, naming, under-18 consent
- `docs/qa-and-performance.md` — device/browser matrix, real-device plan, security checklist
- `docs/launch-plan.md` — go/no-go checklist, DNS/email, go-live, 48-hour monitoring, rollback
- `docs/maintenance.md` — monthly checklist and content calendar
- `docs/training.md` — 10-minute walkthroughs and cheat sheet
- `/brand` (internal) — visual brand guidelines
