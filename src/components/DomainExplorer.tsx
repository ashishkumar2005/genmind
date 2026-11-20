'use client';

import { useRef, useState, type KeyboardEvent } from 'react';
import { domains, type DomainId } from '@/content/domains';
import {
  CircuitIllustration, CodeIllustration, DroneIllustration, NeuralNetIllustration, PrinterIllustration, RobotCarIllustration,
} from './illustrations/Illustrations';
import { Photo, hasPhoto } from './Photo';
import { DomainVideo } from './DomainVideo';
import { Domain3D } from './three/Domain3D';
import { domainVideos } from '@/content/videos';

const ILLO: Record<DomainId, (p: { title?: string; className?: string }) => JSX.Element> = {
  ai: NeuralNetIllustration,
  robotics: RobotCarIllustration,
  iot: CircuitIllustration,
  drones: DroneIllustration,
  coding: CodeIllustration,
  fabrication: PrinterIllustration,
};

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Stage card (real video clip for the domain + domain tabs) beside an info card.
 * WAI-ARIA tabs: arrow keys move between domains, Home/End jump to first/last,
 * only the selected tab is in the tab order. Prev/next buttons do the same.
 */
export function DomainExplorer() {
  const [active, setActive] = useState(0);
  // The interactive 3D model is shown first; "Real footage" swaps in a real video clip of the same domain.
  const [view, setView] = useState<'3d' | 'video'>('3d');
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const last = domains.length - 1;

  const go = (next: number, focus = false) => {
    const i = (next + domains.length) % domains.length;
    setActive(i);
    if (focus) tabs.current[i]?.focus();
    tabs.current[i]?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  };

  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowRight') go(active + 1, true);
    else if (e.key === 'ArrowLeft') go(active - 1, true);
    else if (e.key === 'Home') go(0, true);
    else if (e.key === 'End') go(last, true);
    else return;
    e.preventDefault();
  };

  const d = domains[active];
  const Illo = ILLO[d.id];

  return (
    <div className="domx">
      <div className="domx__stage">
        <p className="domx__counter" aria-hidden="true">{pad(active + 1)} / {pad(domains.length)} · <b>{d.name}</b></p>
        <div
          className="domx__view"
          role="tabpanel"
          id={`domain-panel-${d.id}`}
          aria-labelledby={`domain-tab-${d.id}`}
        >
          {view === 'video' && domainVideos[d.id]
            ? <DomainVideo clip={domainVideos[d.id]} />
            : <Domain3D id={d.id} name={d.name} fallback={<Illo title={`Illustration: ${d.name}`} />} />}
          {domainVideos[d.id] && (
            <div className="domx__viewswitch" role="group" aria-label="How to show this domain">
              <button type="button" aria-pressed={view === '3d'} onClick={() => setView('3d')}>3D model</button>
              <button type="button" aria-pressed={view === 'video'} onClick={() => setView('video')}>Real footage</button>
            </div>
          )}
        </div>
        <div className="domx__tabs" role="tablist" aria-label="Learning domains">
          {domains.map((dom, i) => (
            <button
              key={dom.id}
              ref={(el) => { tabs.current[i] = el; }}
              id={`domain-tab-${dom.id}`}
              role="tab"
              type="button"
              aria-selected={i === active}
              aria-controls={`domain-panel-${dom.id}`}
              tabIndex={i === active ? 0 : -1}
              className="domx__tab"
              onClick={() => go(i)}
              onKeyDown={onKey}
            >
              {dom.name}
            </button>
          ))}
        </div>
      </div>

      <div className="domx__info" aria-live="polite">
        <div className="domx__head">
          <p className="eyebrow">{d.label}</p>
          <div className="domx__nav">
            <button type="button" className="domx__arrow" aria-label="Previous domain" onClick={() => go(active - 1)}>‹</button>
            <button type="button" className="domx__arrow" aria-label="Next domain" onClick={() => go(active + 1)}>›</button>
          </div>
        </div>
        <div className="domx__body" key={d.id}>
          <p className="domx__num">Domain {pad(active + 1)}</p>
          <h3>{d.name}</h3>
          <p>{d.summary}</p>
          {/* The video lives in the stage; the info card shows a real photo only when one exists. */}
          {hasPhoto(`domain-${d.id}`) && (
            <div className="domx__photo">
              <Photo slot={`domain-${d.id}`} fallback={null} sizes="(max-width: 980px) 90vw, 420px" ratio="16 / 9" />
            </div>
          )}
          <p className="domx__apps-label">What students build</p>
          <ul className="domx__apps">
            {d.projects.map((p) => <li key={p}>{p}</li>)}
          </ul>
          <p className="muted" style={{ margin: 0 }}>{d.ages}</p>
        </div>
      </div>
    </div>
  );
}
