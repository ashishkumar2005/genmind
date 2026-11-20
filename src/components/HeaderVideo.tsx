'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Background video for a page header. Muted, looping and silent; the poster shows at once.
 * Pauses while scrolled out of view (saves battery and data). The small button lets anyone
 * pause the motion (WCAG 2.2.2).
 */
export function HeaderVideo({ src, poster, label }: { src: string; poster: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);
  const userPaused = useRef(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true; // React omits the attribute in server HTML; browsers only autoplay muted video.
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !userPaused.current) v.play().catch(() => {});
      else v.pause();
    }, { threshold: 0.05 });
    io.observe(v);
    return () => io.disconnect();
  }, []);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) { userPaused.current = false; v.play().catch(() => {}); setPaused(false); }
    else { userPaused.current = true; v.pause(); setPaused(true); }
  };

  return (
    <div className="page-header__media">
      <video ref={ref} src={src} poster={poster} muted loop playsInline autoPlay preload="metadata" aria-hidden="true" />
      <button type="button" className="page-header__pause" onClick={toggle} aria-label={paused ? `Play background video: ${label}` : `Pause background video: ${label}`}>
        {paused ? '▶' : '❚❚'}
      </button>
    </div>
  );
}
