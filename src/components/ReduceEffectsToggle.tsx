'use client';

import { useEffect, useState } from 'react';

const KEY = 'genminded-reduce-effects';

/** User-visible "Reduce effects" switch, remembered across visits. Also applied before paint by the inline script in layout.tsx. */
export function ReduceEffectsToggle() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    try { setOn(window.localStorage.getItem(KEY) === 'true'); } catch { /* ignore */ }
  }, []);

  const toggle = () => {
    const next = !on;
    setOn(next);
    document.documentElement.dataset.reduceEffects = String(next);
    try { window.localStorage.setItem(KEY, String(next)); } catch { /* ignore */ }
    window.dispatchEvent(new Event('genminded:reduce-effects'));
  };

  return (
    <button type="button" className="link-button" aria-pressed={on} onClick={toggle}>
      Reduce effects: {on ? 'on' : 'off'}
    </button>
  );
}
