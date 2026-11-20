# Launch plan and go/no-go checklist

Launch is **blocked** while `npm run check:placeholders` fails (any Critical placeholder open).

## Go / no-go checklist

Status as delivered on 15 Nov 2026. Update as items are completed.

### Content and truth
| Item | Status |
|---|---|
| Company email, phone, registered address supplied | TODO |
| GSTIN / CIN supplied (as applicable) | TODO |
| Real logo integrated (header, footer, favicon, share images) | TODO |
| Every promise on /security, /privacy, /accessibility confirmed true | TODO |
| Privacy and cookie policies reviewed by a legal adviser | TODO |
| Service descriptions in `solutions.ts` checked against what we actually deliver | TODO |
| No unverified claims anywhere (style guide checklist) | PASS — site ships with none; trust blocks hidden until data supplied |
| Team, testimonials, logos, numbers: real and permissioned, or hidden | PASS (hidden) |

### Technical
| Item | Status |
|---|---|
| `NEXT_PUBLIC_SITE_URL` set to the production domain | TODO |
| `LEAD_WEBHOOK_URL` connected; a test lead reaches the CRM | TODO |
| `LEAD_DRY_RUN` **not** set in production | TODO (verify) |
| `INTERNAL_USER` / `INTERNAL_PASSWORD` set | TODO |
| `npm install` + `npm run prelaunch` green locally | TODO (code not yet built on a machine with network) |
| CI green: types, lint, audit, secrets, e2e, axe, Lighthouse budgets | TODO |
| Visual regression baselines reviewed and committed | TODO |
| Security headers grade A (securityheaders.com) | TODO |
| Uptime workflow enabled (`PRODUCTION_URL` repository variable) | TODO |
| Analytics ID set; consent banner verified to block it until accepted | TODO |
| Manual device/browser matrix completed (docs/qa-and-performance.md) | TODO |
| Screen-reader test script completed | TODO |

### SEO
| Item | Status |
|---|---|
| Unique titles/descriptions on every page (automated test) | PASS (by design; verify in CI) |
| Target keywords and cities supplied, top-20 titles rewritten | TODO |
| sitemap.xml, robots.txt, llms.txt, HTML site map | PASS |
| Every page reachable in ≤ 3 clicks (header/footer/site map) | PASS |
| Google Search Console verified, sitemap submitted | TODO |
| Bing Webmaster Tools verified | TODO |
| Redirect map from old site added to `next.config.mjs` | TODO (if an old site exists) |

## DNS and email (SPF, DKIM, DMARC)

1. Point the domain at the host (A/ALIAS for apex, CNAME for `www`); choose one canonical (`www` recommended) and redirect the other.
2. **SPF** — one TXT record on the root, listing every service that sends mail as you, e.g.
   `v=spf1 include:_spf.google.com include:<crm-or-email-provider> ~all`
3. **DKIM** — add the CNAME/TXT records given by Google Workspace / Zoho and by your CRM/email provider; turn signing on.
4. **DMARC** — start with monitoring: `_dmarc` TXT `v=DMARC1; p=none; rua=mailto:dmarc@<domain>`. After 2–4 clean weeks move to `p=quarantine`, then `p=reject`.
5. Verify with MXToolbox and by sending to a Gmail address (Show original → SPF/DKIM/DMARC = PASS).

## Redirect map

If an old site exists: export all its URLs (crawl with Screaming Frog, or from Search Console → Pages), map each to the best new URL, and add 301s in `next.config.mjs → redirects()`. No redirect chains; nothing important should 404.

## Go-live day

1. Freeze content changes. Final `npm run prelaunch`; CI green on `main`.
2. Deploy to production; tag the release `v1.0.0`.
3. Switch DNS (lower TTL to 300 s a day before).
4. Smoke test on production: home, each solution page, submit each form (mark test leads "TEST" in the CRM), consent banner, 404 page, `/robots.txt`, `/sitemap.xml`.
5. Submit sitemap in Search Console; request indexing of the home page.
6. Announce internally; share the internal dashboard login with the sales team via the password manager.

## 48-hour monitoring

| When | Check |
|---|---|
| Every 15 min (automatic) | Uptime workflow: key pages + form endpoint |
| +1 h, +4 h, +24 h, +48 h | `/internal/placeholders` → form delivery last success; CRM receiving leads; host error logs; Search Console coverage errors |
| +24 h | PageSpeed Insights mobile on home and a solution page; analytics receiving consented traffic |
| +48 h | Review funnel drop-off; fix anything above Low severity before resuming normal work |

## Rollback

Trigger: forms not delivering for > 15 minutes with no quick fix, error rate spike, or a serious content/legal error.
Action: promote the previous deployment (README §6). Communicate in the team channel. Fix on a preview deployment, then redeploy.
