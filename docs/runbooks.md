# Runbooks

Each runbook: **symptoms → check → fix → confirm**. Keep this file next to the code so it stays current.

---

## 1. Form or email stopped working

**Symptoms:** no new leads in the CRM; visitors report an error after submitting; uptime check "Form endpoint" fails.

1. Open `/internal/placeholders` → *Form delivery*. Note the last success and last failure message.
2. Check host logs for `"evt":"crm_sync","ok":false`. The `error` field says why (timeout, 401, 404, 5xx).
3. Fix by cause:
   - `LEAD_WEBHOOK_URL is not set` → add it in the host's environment variables and redeploy.
   - `401/403` → the webhook secret changed; update `LEAD_WEBHOOK_SECRET` on both sides.
   - `404` → the CRM/Zapier hook was deleted or renamed; create a new one and update the URL.
   - Timeout/5xx → the CRM is down; check its status page. Visitors already see "please email or call us".
4. Confirm: submit the contact form yourself; check it arrives in the CRM and *Last successful delivery* updates.
5. Recover: ask the CRM provider for failed-delivery logs; search host logs for `"evt":"crm_sync","ok":false` in the outage window to see which form types were affected.

## 2. Site is slow

1. Run PageSpeed Insights on the home page (mobile). Note LCP, INP, CLS.
2. Check the host status page and the latest deployment — did it start after a deploy? If yes, **roll back** (README §6) and investigate on a preview.
3. Common causes: a large image added without `next/image`; a new third-party script; hero video enabled with a file over 6 MB; a client component added to a page that used to be static.
4. Confirm: Lighthouse CI on the fix passes the budgets.

## 3. Payment webhook failing

*Not applicable yet — payments are not part of this codebase (ADR-0006).* When added: check the provider dashboard → Webhooks → recent deliveries; verify the signing secret; replay failed events; confirm orders reconcile.

## 4. Restore from backup

- **Code and content:** everything is in Git. Restore = deploy a previous commit or tag (README §6).
- **Host settings:** keep a copy of all environment variable *names* (not values) in this repo (`.env.example`) and the values in the team password manager.
- **Leads:** stored in the CRM, not on this site. Use the CRM's export and backup features; export monthly (see maintenance checklist).

## 5. Rotate secrets

Do this every 6 months, and immediately when someone with access leaves or a secret may have leaked.

1. Generate a new value (password manager, 32+ random characters).
2. `LEAD_WEBHOOK_SECRET`: update the receiving side first, then the host env var, then redeploy.
3. `INTERNAL_PASSWORD`: update the host env var, redeploy, share the new value through the password manager only.
4. Analytics IDs are public and do not need rotating.
5. Record the date in the maintenance log.

## 6. Add a new language

Follow ADR-0005: get a professional translation of every page, add locale routes and `hreflang` tags, set `lang` on mixed-language text, add Devanagari/Gurmukhi fonts to `/public/fonts` for share images, extend the e2e page list, and run the full test suite.

## 7. Onboard / offboard a team member

**Onboard:** add them to GitHub (least privilege), the host (viewer unless they deploy), the CRM, and the password manager vault. Walk them through `docs/training.md`.

**Offboard (same day):** remove from GitHub, host, CRM, analytics, Search Console, password manager; rotate `INTERNAL_PASSWORD` and any secret they could see; reassign their open leads.
