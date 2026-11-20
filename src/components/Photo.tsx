import Image from 'next/image';
import type { ReactNode } from 'react';
import generated from '@/content/media.generated.json';
import type { SlotId } from '@/content/media';

type GeneratedEntry = { src: string; width: number; height: number; blurDataURL: string; alt: string; credit?: string; position?: string };
const media = generated as Record<string, GeneratedEntry>;

export function hasPhoto(slot: SlotId) {
  return Boolean(media[slot]);
}

/**
 * Shows the real photo for a slot when one has been added (see src/content/media.ts),
 * otherwise renders `fallback` (an illustration).
 * One treatment everywhere: 4:3 crop (or `ratio`), 12px radius, blur-up placeholder.
 */
export function Photo({
  slot, fallback, sizes, ratio = '4 / 3', priority = false, className = '',
}: {
  slot: SlotId; fallback: ReactNode; sizes: string; ratio?: string; priority?: boolean; className?: string;
}) {
  const p = media[slot];
  if (!p) return <>{fallback}</>;
  return (
    <div className={`photo ${className}`} style={{ aspectRatio: ratio }}>
      <Image
        src={p.src}
        alt={p.alt}
        width={p.width}
        height={p.height}
        sizes={sizes}
        placeholder="blur"
        blurDataURL={p.blurDataURL}
        priority={priority}
        style={{ objectPosition: p.position ?? '50% 50%' }}
      />
    </div>
  );
}

/** Credits for every stock photo in use (shown on the site map page). */
export function photoCredits(): { slot: string; credit: string }[] {
  return Object.entries(media).filter(([, p]) => p.credit).map(([slot, p]) => ({ slot, credit: p.credit! }));
}
