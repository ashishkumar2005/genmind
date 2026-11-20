'use client';

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import type { DomainId } from '@/content/domains';
import { detectQuality, type Quality } from './quality';
import type { DomainViewerHandle } from './domainViewer';
import type { Tier } from './heroScene';

/**
 * 3D model for the selected domain, with the photo/illustration as fallback.
 * The viewer is created once and swaps models as the domain changes.
 */
export function Domain3D({ id, name, fallback }: { id: DomainId; name: string; fallback: ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handle = useRef<DomainViewerHandle | null>(null);
  const idRef = useRef(id);
  const [quality, setQuality] = useState<Quality>('off');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const decide = () => setQuality(detectQuality());
    decide();
    window.addEventListener('genminded:reduce-effects', decide);
    return () => window.removeEventListener('genminded:reduce-effects', decide);
  }, []);

  const on = quality !== 'off';
  useEffect(() => {
    if (!on || !canvasRef.current || !wrapRef.current) return;
    let cancelled = false;
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    import('./domainViewer')
      .then(({ createDomainViewer }) => {
        if (cancelled) return;
        handle.current = createDomainViewer(canvas, wrap, quality as Tier);
        handle.current.show(idRef.current);
        requestAnimationFrame(() => { if (!cancelled) setReady(true); });
      })
      .catch((err) => { console.warn('3D viewer unavailable', err); setQuality('off'); });
    return () => {
      cancelled = true;
      handle.current?.dispose();
      handle.current = null;
      setReady(false);
    };
    // Tier is fixed for the viewer's lifetime; only turning 3D on/off recreates it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [on]);

  useEffect(() => {
    idRef.current = id;
    handle.current?.show(id);
  }, [id]);

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); handle.current?.nudge(-1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); handle.current?.nudge(1); }
  };

  return (
    <div className="domain3d" ref={wrapRef}>
      <div className="domain3d__fallback" data-hidden={on && ready}>{fallback}</div>
      {on && (
        <div
          className="domain3d__stage"
          tabIndex={0}
          role="img"
          aria-label={`3D model: ${name}. Use the left and right arrow keys to turn it.`}
          onKeyDown={onKey}
        >
          <canvas ref={canvasRef} className="domain3d__canvas" data-ready={ready} />
        </div>
      )}
      {on && ready && <p className="domain3d__hint" aria-hidden="true">Drag to turn</p>}
    </div>
  );
}
