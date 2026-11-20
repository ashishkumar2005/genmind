# Photo sources for each slot

Free photos of **equipment only**, under the Unsplash licence (free for commercial use, no permission needed; credit appreciated). They're already set up in `src/content/media.ts` with alt text and credits.

**To use one:** open the link → **Download free** (choose *Large* or *Original*) → save it into `public/images/` with the exact file name in the table → run `npm run dev`. The illustration in that slot is replaced automatically.

| Slot (where it shows) | Save as | Suggested photo |
|---|---|---|
| Home › Schools panel | `audience-schools.jpg` | Arduino Uno and parts on a blue surface — https://unsplash.com/photos/blue-and-black-circuit-board-gavODTHG36Y |
| Home › Colleges panel | `audience-colleges.jpg` | Circuit board close-up, Tim Käbel — https://unsplash.com/photos/closeup-photo-of-circuit-board-FCrYdP8gohg |
| Home › Students panel | `audience-students.jpg` | Arduino Uno board, Vishnu Mohanan — https://unsplash.com/photos/a-close-up-of-an-electronic-device-on-a-table-qx0OAFhM2Fc |
| Domains › AI | `domain-ai.jpg` | Raspberry Pi close-up, Balazs Koren — https://unsplash.com/photos/a-close-up-of-a-computer-chip-on-a-table-Ct6NnEM5QS4 |
| Domains › Robotics | `domain-robotics.jpg` | Pick “closeup photo of white robot arm” (Possessed Photography) from https://unsplash.com/s/photos/robot-arm |
| Domains › Electronics & IoT | `domain-iot.jpg` | Breadboard + Arduino, Vishnu Mohanan — https://unsplash.com/photos/a-soldering-soldering-tool-is-attached-to-a-bread-board-O68LT-zCYFg |
| Domains › Drones | `domain-drones.jpg` | Quadcopter in flight, Pedro Henrique Santos — https://unsplash.com/photos/shallow-focus-photo-of-black-and-gray-quadcopter-drone-eyP-g_MZHyU |
| Domains › Coding | `domain-coding.jpg` | Pick “laptop computer showing codes” (AltumCode) from https://unsplash.com/s/photos/python-code |
| Domains › 3D printing | `domain-fabrication.jpg` | 3D printer making a hexagon, Kenneth Li — https://unsplash.com/photos/3d-printer-creating-a-hexagonal-shape-bTPDkYQ9-xk |
| Labs page header | `header-labs.jpg` | Raspberry Pi 4 (shot in Kollam, Kerala) — https://unsplash.com/photos/green-and-black-circuit-board-rZKdS0wI8Ks |

## Before you download, check each photo for

- **The licence line** on the photo page must say *Free to use under the Unsplash License*. Skip anything marked **Unsplash+** (paid).
- **Visible brand logos** (e.g. a drone maker's name): fine for illustration, but avoid photos where a brand is the main subject, so it doesn't look like an endorsement.
- **The credit**: if the photographer differs from what `media.ts` lists, update the `credit` field (the Schools and Labs entries say only “Unsplash”; add the name when you download).

## Slots that need your own photos

`header-about`, `header-contact` and `header-case-studies` should show the real team, office and real projects. Stock photos there would mislead visitors. Add them (with consent for anyone pictured, see `photography-and-consent.md`) by adding entries to `media.ts`:

```ts
'header-about': {
  file: 'header-about.jpg',
  alt: 'The GenMindedTech team setting up a robotics lab',
  licence: 'own', showsPeople: true, consentRef: 'CONSENT-2026-014',
},
```

The best photos the site could have are of **your own students building things at your sessions**, such as robot cars on a race track or exhibition stands. They can replace any stock photo above, as long as consent forms are signed.
