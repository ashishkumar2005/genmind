# Team training pack

This version of the site has no in-browser admin; editing is done in `src/content/` through Git, and leads are handled in the CRM. Role-based admin training for Editor, Registration Manager and Judge roles should be written when the admin area (Phases 1–4 features: registration, payments, judging, certificates) is added to this codebase.

## 10-minute walkthrough — Sales

1. **(2 min) Where leads come from.** Four forms: Book a consultation (primary), Institutional enquiry, Request a quote, Contact. Each lead arrives in the CRM with its type and the page it came from.
2. **(2 min) Our promise.** The site tells visitors we reply *within one working day*. Check the CRM every morning and after lunch.
3. **(2 min) The internal dashboard.** `/internal/placeholders` (password in the password manager): placeholder register, form delivery status, funnel and A/B results.
4. **(2 min) Trust content.** You can supply real testimonials, client logos and case studies — but only with written permission. Send them to the content owner with the permission document.
5. **(2 min) If forms stop.** Tell the developer immediately; point visitors to phone/email. See runbook 1.

## 10-minute walkthrough — Content editor

1. **(3 min) The two content files.** `src/content/site.ts` (company facts, trust content, lead magnets) and `src/content/solutions.ts` (service pages, lab comparison).
2. **(3 min) The rules.** Real and approved only. Numbers need a source and date. Logos/testimonials need `permission: true`. Follow `docs/style-guide.md`.
3. **(2 min) Making a change.** Edit on GitHub → open a pull request → check the preview link → ask for review → merge.
4. **(2 min) Photos.** Follow `docs/photography-and-consent.md`: specs, naming, alt text and consent forms.

## One-page cheat sheet

| I want to… | Do this |
|---|---|
| Add the company phone/email/address | `site.ts → company` |
| Show a client logo | Add to `trust.logos` with `permission: true` and the permission reference |
| Add a testimonial | `trust.testimonials`, `permission: true`, approval date |
| Add a number ("labs installed") | `trust.stats` with `source` and `asOf` |
| Add a team member | `team` array; photo in `/public/team/`, with consent |
| Publish a lead-magnet PDF | Put the PDF in `/public/downloads/`, set `fileUrl` and `available: true` |
| Fill the lab comparison | `solutions.ts → labs` |
| Turn on the hero video | Upload `public/media/hero-loop.mp4` (≤ 6 MB) and poster, set `heroVideo.enabled: true` |
| See what's still missing | `/internal/placeholders` or `npm run check:placeholders` |
| Something is broken | `docs/runbooks.md` |
