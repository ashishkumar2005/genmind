# QA, performance and security plan

## Automated (runs on every pull request)

| Check | Tool | Fails the build when |
|---|---|---|
| Types, lint (incl. jsx-a11y) | tsc, ESLint | any error |
| Dependency vulnerabilities | `npm audit --audit-level=high` | high/critical in production deps |
| Secrets in code | gitleaks | any secret found |
| Accessibility | axe-core in Playwright (WCAG 2.2 AA tags) | any violation on any page |
| Keyboard flows, target size | Playwright | skip link, menu Escape, < 44px targets |
| Smoke | Playwright | non-200, ≠ 1 H1, missing title/description/canonical, image without alt, **any console error** |
| Duplicate titles/descriptions | Playwright | any duplicate |
| Broken internal links | Playwright link checker | any internal link ≥ 400 |
| Security headers | Playwright | CSP, nosniff, referrer policy missing |
| Forms | Playwright | validation, error focus, success URL, server validation, size limit, rate limit |
| Consent | Playwright | any analytics request before consent |
| Visual regression | Playwright screenshots at desktop/tablet/mobile | > 1% pixel difference |
| Performance & quality | Lighthouse CI (mobile, 3 runs) | Perf < 85, A11y/SEO/BP < 95, LCP > 2.5 s, CLS > 0.1, TBT > 200 ms, JS > 180 kB |

## Manual cross-browser / device matrix (before launch and every major release)

| | Chrome | Safari iOS | Safari macOS | Firefox | Edge | Samsung Internet |
|---|---|---|---|---|---|---|
| 320 px portrait | ☐ | ☐ | — | ☐ | — | ☐ |
| 768 px portrait/landscape | ☐ | ☐ (iPad) | — | ☐ | ☐ | ☐ |
| 1280 px | ☐ | — | ☐ | ☐ | ☐ | — |
| 1920 px | ☐ | — | ☐ | ☐ | ☐ | — |
| 200% zoom | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Dark OS setting | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Slow 3G / Data Saver | ☐ | ☐ | — | — | — | ☐ |

For each cell: navigation, hero, one solution page, consultation form submit, consent banner, footer.

## Screen-reader test script (NVDA + Firefox, VoiceOver + Safari iOS)

1. Land on home → "Skip to main content" announced first.
2. Navigate by headings (H) — one H1, logical order.
3. Open mobile menu → expanded state announced; Escape closes.
4. Consent banner → announced as a region; checkboxes labelled.
5. Consultation form → submit empty → error summary announced; follow an error link to the field; fix and submit → thank-you announced.
6. Solution finder → each question announced as a group; result announced politely.

## Real-device performance plan

| Device | Network | Record |
|---|---|---|
| Mid-range Android (e.g. Redmi Note / Galaxy A series) | Throttled 4G | LCP, INP, CLS, FPS while scrolling, memory |
| Older iPhone (iPhone 11 or SE 2) | 4G | same |
| Mid-range Windows laptop | Wi-Fi + throttled 4G | same |

Use Chrome DevTools remote debugging (Android) and Safari Web Inspector (iOS). Targets: LCP < 2.5 s, INP < 200 ms, CLS < 0.1, steady 60 fps scrolling. Re-test with the hero video turned on.

## Load test

`k6 run -e BASE=<staging url> tests/load/lead-endpoint.k6.js` against staging with `LEAD_DRY_RUN=true`. Expect 429s for the abusive client and p95 < 800 ms for normal visitors.

## Security review checklist (OWASP Top 10 for the public site and APIs)

- [ ] A01 Access control: `/brand`, `/internal/*` return 401 without credentials (automated)
- [ ] A02 Crypto: HTTPS only, HSTS preload header present
- [ ] A03 Injection: all form input validated server-side, allow-listed fields, JSON-LD escaped
- [ ] A04 Insecure design: honeypot + minimum fill time + rate limit on forms
- [ ] A05 Misconfiguration: CSP, X-Frame-Options, nosniff, no `X-Powered-By` (automated)
- [ ] A06 Vulnerable components: `npm audit` clean; Dependabot enabled on GitHub
- [ ] A07 Auth failures: strong internal password in password manager; rotated per runbook
- [ ] A08 Integrity: webhook calls send a bearer secret; lockfile committed
- [ ] A09 Logging: `crm_sync` failures logged; host log retention ≥ 30 days
- [ ] A10 SSRF: the only outbound request is to a fixed env-configured webhook
- [ ] securityheaders.com grade A on production
- [ ] File uploads: none on this site (re-review when added)
