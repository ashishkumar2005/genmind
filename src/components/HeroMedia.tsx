'use client';

import { useEffect, useRef, useState } from 'react';
import { heroVideo } from '@/content/site';

type NavigatorWithConnection = Navigator & { connection?: { saveData?: boolean; effectiveType?: string } };

/**
 * Hero background. The optional looping video loads only when:
 *  - the admin has enabled it (content/site.ts → heroVideo.enabled),
 *  - the visitor has not asked for reduced motion (OS setting or our toggle),
 *  - Data Saver is off and the connection is not 2G.
 * Otherwise a static CSS gradient is used (zero network cost, no layout shift).
 */
export function HeroMedia() {
  const [playVideo, setPlayVideo] = useState(false);
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);

  // WCAG 2.2.2: moving content that lasts > 5 s needs a pause control.
  const togglePause = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) { void v.play(); setPaused(false); } else { v.pause(); setPaused(true); }
  };

  useEffect(() => {
    if (!heroVideo.enabled) return;
    const evaluate = () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.dataset.reduceEffects === 'true';
      const conn = (navigator as NavigatorWithConnection).connection;
      const slow = Boolean(conn?.saveData) || /(^|-)2g$/.test(conn?.effectiveType ?? '');
      setPlayVideo(!reduce && !slow);
    };
    evaluate();
    window.addEventListener('genminded:reduce-effects', evaluate);
    return () => window.removeEventListener('genminded:reduce-effects', evaluate);
  }, []);

  return (
    <>
      <div className="hero__media" aria-hidden="true">
        <div className="hero__bg" />
        {playVideo && (
          <video ref={ref} autoPlay muted loop playsInline preload="none" poster={heroVideo.poster} tabIndex={-1}>
            <source src={heroVideo.src} type="video/mp4" />
          </video>
        )}
        <div className="hero__scrim" />
      </div>
      {playVideo && (
        <button type="button" className="btn btn--ghost-dark" onClick={togglePause} style={{ position: 'absolute', right: 16, bottom: 16, zIndex: 2 }}>
          {paused ? 'Play background video' : 'Pause background video'}
        </button>
      )}
    </>
  );
}
