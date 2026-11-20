import type { ReactNode } from 'react';
import Image from 'next/image';
import { Breadcrumbs, type Crumb } from './Breadcrumbs';
import { HeaderVideo } from './HeaderVideo';
import generated from '@/content/media.generated.json';
import type { SlotId } from '@/content/media';

type GeneratedEntry = { src: string; width: number; height: number; blurDataURL: string; alt: string; position?: string };
const media = generated as Record<string, GeneratedEntry>;

/** Full-bleed background behind the header text: a real video clip or a real photo. */
export type HeaderBackdrop =
  | { kind: 'video'; src: string; poster: string; label: string }
  | { kind: 'photo'; slot: SlotId };

export function PageHeader({
  title, intro, crumbs, art, backdrop, children,
}: { title: string; intro?: string; crumbs: Crumb[]; art?: ReactNode; backdrop?: HeaderBackdrop; children?: ReactNode }) {
  const photo = backdrop?.kind === 'photo' ? media[backdrop.slot] : undefined;
  const hasBackdrop = backdrop?.kind === 'video' || Boolean(photo);

  return (
    <div className={`page-header${hasBackdrop ? ' page-header--media' : ''}`}>
      {backdrop?.kind === 'video' && <HeaderVideo src={backdrop.src} poster={backdrop.poster} label={backdrop.label} />}
      {photo && (
        <div className="page-header__media">
          <Image
            src={photo.src}
            alt=""
            fill
            priority
            sizes="100vw"
            placeholder="blur"
            blurDataURL={photo.blurDataURL}
            style={{ objectFit: 'cover', objectPosition: photo.position ?? '50% 50%' }}
          />
        </div>
      )}
      <div className={`container${art && !hasBackdrop ? ' page-header__grid' : ''}`}>
        <div className="page-header__text">
          <Breadcrumbs items={crumbs} />
          <h1>{title}</h1>
          {intro && <p>{intro}</p>}
          {children}
        </div>
        {art && !hasBackdrop && <div className="page-header__art">{art}</div>}
      </div>
    </div>
  );
}
