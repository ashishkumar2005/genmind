'use client';

import { useEffect, useRef, useState } from 'react';
import type { DomainVideo as Clip } from '@/content/videos';

/**
 * Real looping video for the selected domain. Muted, inline and silent, so browsers allow
 * autoplay. The poster shows instantly; the clip fades in once it can play.
 * Click or press Space/Enter on the video to pause it (WCAG 2.2.2: moving content must be pausable).
 */
export function DomainVideo({ clip }: { clip: Clip }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);
  const [ready, setReady] = useState(false);

  // A new clip starts playing (and un-pauses) whenever the domain changes.
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    setReady(false);
    setPaused(false);
    v.muted = true; // React omits the attribute in server HTML; browsers only autoplay muted video.
    v.load();
    v.play().catch(() => { /* autoplay blocked: the poster stays visible */ });
  }, [clip.src]);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) { v.play().catch(() => {}); setPaused(false); }
    else { v.pause(); setPaused(true); }
  };

  return (
    <figure className="domvid">
      <video
        ref={ref}
        className="domvid__video"
        data-ready={ready}
        src={clip.src}
        poster={clip.poster}
        muted
        loop
        playsInline
        autoPlay
        preload="metadata"
        aria-label={`${clip.alt}. Click to ${paused ? 'play' : 'pause'}.`}
        tabIndex={0}
        onCanPlay={() => setReady(true)}
        onClick={toggle}
        onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(); } }}
      />
      {paused && <span className="domvid__state" aria-hidden="true">Paused</span>}
      <figcaption className="domvid__credit">Video: {clip.credit}</figcaption>
    </figure>
  );
}
