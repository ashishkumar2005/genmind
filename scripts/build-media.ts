/**
 * Image pipeline step: `npm run media` (runs before `dev` and `build`).
 *
 * For each photo slot in src/content/media.ts whose file exists in /public/images:
 *  - validates alt text, resolution and people/consent rules,
 *  - reads width and height (so next/image reserves space: no layout shift),
 *  - creates a tiny blurred WebP placeholder (shown while the photo loads).
 * Writes src/content/media.generated.json. Responsive sizes and AVIF/WebP
 * conversion are then handled by next/image at request time.
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { photos } from '../src/content/media';

const ROOT = path.resolve(__dirname, '..');
const IMG_DIR = path.join(ROOT, 'public', 'images');
const OUT = path.join(ROOT, 'src', 'content', 'media.generated.json');
const MIN_LONG_EDGE = 1600;

type Generated = Record<string, { src: string; width: number; height: number; blurDataURL: string; alt: string; credit?: string; position?: string }>;

async function main() {
  const out: Generated = {};
  const errors: string[] = [];
  const warnings: string[] = [];
  const missing: string[] = [];

  for (const [slot, p] of Object.entries(photos)) {
    if (!p) continue;
    const file = path.join(IMG_DIR, p.file);
    if (!fs.existsSync(file)) { missing.push(`${slot} → public/images/${p.file}`); continue; }

    const alt = p.alt.trim();
    if (!alt) { errors.push(`${slot}: alt text is required`); continue; }
    if (/^(image|photo|picture) of/i.test(alt)) warnings.push(`${slot}: alt should not start with "${alt.split(' ').slice(0, 2).join(' ')}"`);
    if (alt.length > 150) warnings.push(`${slot}: alt is ${alt.length} characters; keep it under 150`);
    if (p.showsPeople && !p.consentRef) { errors.push(`${slot}: shows people but has no consentRef — not published`); continue; }

    const img = sharp(file);
    const meta = await img.metadata();
    if (!meta.width || !meta.height) { errors.push(`${slot}: could not read image size`); continue; }
    if (Math.max(meta.width, meta.height) < MIN_LONG_EDGE) warnings.push(`${slot}: ${meta.width}×${meta.height}px is below the ${MIN_LONG_EDGE}px minimum and may look soft`);
    if (fs.statSync(file).size > 8 * 1024 * 1024) warnings.push(`${slot}: original is over 8 MB; consider exporting at 2400px long edge`);

    const blur = await sharp(file).rotate().resize(16).webp({ quality: 40 }).toBuffer();
    const oriented = meta.orientation && meta.orientation >= 5; // EXIF rotation swaps width/height
    out[slot] = {
      src: `/images/${p.file}`,
      width: oriented ? meta.height : meta.width,
      height: oriented ? meta.width : meta.height,
      blurDataURL: `data:image/webp;base64,${blur.toString('base64')}`,
      alt,
      credit: p.credit,
      position: p.position,
    };
  }

  fs.writeFileSync(OUT, `${JSON.stringify(out, null, 2)}\n`);

  console.log(`media: ${Object.keys(out).length} photo slot(s) ready.`);
  if (missing.length) console.log(`media: ${missing.length} slot(s) still using illustrations — add these files to use photos:\n  ${missing.join('\n  ')}`);
  warnings.forEach((w) => console.warn(`media warning: ${w}`));
  if (errors.length) {
    errors.forEach((e) => console.error(`media error: ${e}`));
    process.exit(1);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
