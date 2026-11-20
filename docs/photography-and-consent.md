# Photography, video and consent

Real photos of our work are the strongest trust signal the site can have. Stock photos of strangers are not used.

## Where photos go

Every photo slot on the site is listed in `src/content/media.ts`; suggested free equipment photos for each are in `docs/photo-sources.md`. Save a file into `public/images/` and run `npm run media` (automatic with `dev`/`build`): it validates alt text and consent, records the size and makes the blur placeholder.

## Shot list

| Set | Shots | Notes |
|---|---|---|
| Labs | Wide shot of a set-up lab; 3–4 detail shots of kits and workstations | Tidy, well lit, no clutter or visible brand logos of other companies |
| Students building | Hands assembling circuits/robots; small team around a laptop; a robot moving | Prefer hands and backs of heads; faces only with consent |
| Teachers | Teacher guiding a group; training session with staff | |
| Events | Hackathon teams, judging, prize moment, exhibition stalls | Get event-specific consent forms signed on the day |
| Product close-ups | Kits, boards, sensors on a plain background | 1:1 and 4:3 versions |
| Team | Head-and-shoulders portraits, same background and lighting for everyone | For /about |
| Drone / exterior | Partner campus exterior (with institution's written permission) | Follow DGCA drone rules; no flights over people |
| Hero video (optional) | 8–15 s loop of students building, no faces close up | ≤ 6 MB, 1920×1080, H.264, no audio |

## Technical specs

- Minimum **2400 px** on the long edge (portraits 1600 px). RAW or high-quality JPEG.
- Shoot both **landscape and portrait** of key scenes (for mobile art direction).
- Leave space on one side of hero images for text.
- The site creates AVIF/WebP, responsive sizes and blur placeholders automatically through `next/image`; upload the original high-quality JPEG.

## File naming

`<set>_<place-or-event>_<yyyymmdd>_<nn>.jpg` — lowercase, hyphens, no spaces.
Example: `lab_ludhiana-school_20261204_03.jpg`.
Keep the consent form reference in the image's metadata (IPTC "Instructions") and in the photo log.

## Alt text

Describe what matters in the context of the page, in one sentence: "Two students wiring a motor driver to an Arduino board." Not "image", not the file name, not "photo of".

## Consent — mandatory

- **Adults:** signed photo/video release before use.
- **Under 18:** written consent from a **parent or guardian** (DPDP Act 2023 requires verifiable parental consent for children's personal data), plus permission from the school. Ask the student too.
- Never publish a child's **full name together with their school**. First name only, or no name.
- Record each consent in the photo log: file names, person, guardian, date, scope (website / social / print), expiry.
- If consent is withdrawn, remove the images within 7 days from the site and social channels.

### Template: photo/video consent (parent/guardian)

> I, ______________ (parent/guardian of ______________, Class ___, ______________ School), give permission to GenMindedTech Pvt. Ltd. to take and use photographs and video of my child during ______________ (event/programme) on ___/___/______.
>
> These may be used on: ☐ the GenMindedTech website ☐ social media ☐ printed brochures and proposals.
>
> I understand that: my child's full name and school will not be published together; I can withdraw this permission at any time by writing to ______________ and the images will be removed from the website and social media within 7 days; this permission lasts for ___ years.
>
> Signature: ______________ Date: ___/___/______ Phone: ______________

*(Have this template reviewed by your legal adviser before use.)*
