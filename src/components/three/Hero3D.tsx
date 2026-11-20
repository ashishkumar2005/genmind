'use client';

import { useEffect, useRef, useState } from 'react';
import { detectQualityWithReason, stepDown, type Quality } from './quality';
import type { HeroSceneHandle, Tier } from './heroScene';
import { OrbitIllustration } from '../illustrations/Illustrations';

/**
 * Hero visual. Order of preference:
 *   3D scene (High/Medium/Low, auto-adjusting)  →  static illustration (Off).
 * The static illustration is server-rendered, so there is always something to
 * see and the 3D canvas never causes layout shift. The canvas fades in once the
 * first frame is drawn. The 3D always runs; the illustration stays only when the
 * browser has no WebGL.
 */
export function Hero3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handleRef = useRef<HeroSceneHandle | null>(null);
  const [quality, setQuality] = useState<Quality>('off');
  const [ready, setReady] = useState(false);

  // Decide the tier after hydration (needs browser APIs).
  useEffect(() => {
    const decide = () => {
      const { quality: q, reason } = detectQualityWithReason();
      if (q === 'off') console.info(`[GenmindEdtech 3D] Showing the illustration: ${reason}.`);
      setQuality(q);
    };
    decide();
  }, []);

  // Create / destroy the scene. Created once per "on" period; tier changes are applied live.
  const on = quality !== 'off';
  useEffect(() => {
    if (!on || !canvasRef.current || !containerRef.current) return;
    let cancelled = false;
    let lowFpsStreak = 0;
    const canvas = canvasRef.current;
    const container = containerRef.current;

    const start = async () => {
      try {
        const { createHeroScene } = await import('./heroScene');
        if (cancelled) return;
        const initial = detectQualityWithReason().quality;
        handleRef.current = createHeroScene(canvas, container, {
          tier: (initial === 'off' ? 'low' : initial) as Tier,
          onFps: (fps) => {
            // Two slow windows in a row (4 s) → step down a tier. At the lowest tier we keep running
            // rather than switching off, so the scene never disappears in front of the visitor.
            lowFpsStreak = fps < 40 ? lowFpsStreak + 1 : 0;
            if (lowFpsStreak >= 2) {
              lowFpsStreak = 0;
              setQuality((q) => {
                const next = stepDown(q);
                if (next === 'off') return q;
                handleRef.current?.setTier(next as Tier);
                return next;
              });
            }
          },
        });
        requestAnimationFrame(() => { if (!cancelled) setReady(true); });
      } catch (err) {
        console.warn('[GenmindEdtech 3D] The 3D scene could not start, showing the illustration instead.', err);
        setQuality('off');
      }
    };

    // Wait until the browser is idle so the headline (LCP) is never delayed by 3D.
    type IdleWindow = Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
    const w = window as IdleWindow;
    const useIdle = Boolean(w.requestIdleCallback);
    const id = useIdle ? w.requestIdleCallback!(() => void start(), { timeout: 1200 }) : window.setTimeout(() => void start(), 300);

    return () => {
      cancelled = true;
      if (useIdle) w.cancelIdleCallback?.(id); else window.clearTimeout(id);
      handleRef.current?.dispose();
      handleRef.current = null;
      setReady(false);
    };
  }, [on]);

  return (
    <div className="hero3d" ref={containerRef}>
      <div className="hero3d__fallback" data-hidden={on && ready}>
        <OrbitIllustration title="Illustration of a glowing planet circled by orbit rings, a gear and a drone, with a robot waving from a platform" />
      </div>
      {on && <canvas ref={canvasRef} className="hero3d__canvas" data-ready={ready} aria-hidden="true" />}
      <p className="visually-hidden">
        Decorative animation: a glowing planet inside a wireframe globe, circled by orbit rings carrying a drone, a robot car, a gear, a microcontroller and a 3D printer, with a humanoid robot waving from a floating platform.
      </p>
    </div>
  );
}
