'use client';

/**
 * 3D quality tiers: High / Medium / Low / Off.
 *
 * The 3D scenes always run (site owner's decision). The tier comes from the GPU,
 * device memory and CPU cores; "off" only when the browser has no WebGL.
 */

export type Quality = 'high' | 'medium' | 'low' | 'off';
export type QualityPref = 'auto' | 'on' | 'off';

const KEY = 'genminded-3d';

type Nav = Navigator & { deviceMemory?: number; connection?: { saveData?: boolean; effectiveType?: string } };

export function readPref(): QualityPref {
  try {
    const v = window.localStorage.getItem(KEY);
    return v === 'on' || v === 'off' ? v : 'auto';
  } catch { return 'auto'; }
}

export function writePref(p: QualityPref) {
  try { window.localStorage.setItem(KEY, p); } catch { /* ignore */ }
  // Every 3D view on the page re-checks its setting (hero and domain viewer stay in sync).
  window.dispatchEvent(new Event('genminded:reduce-effects'));
}

function webgl(): { ok: boolean; renderer: string } {
  try {
    const c = document.createElement('canvas');
    const gl = (c.getContext('webgl2') || c.getContext('webgl')) as WebGLRenderingContext | null;
    if (!gl) return { ok: false, renderer: '' };
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : '';
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return { ok: true, renderer };
  } catch {
    return { ok: false, renderer: '' };
  }
}

/** Device-based tier, ignoring the visitor's motion/data preferences. */
function deviceTier(renderer: string): Exclude<Quality, 'off'> {
  const nav = navigator as Nav;
  if (/swiftshader|llvmpipe|software|basic render/i.test(renderer)) return 'low';
  const mem = nav.deviceMemory ?? 4;
  const cores = nav.hardwareConcurrency ?? 4;
  const mobile = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;
  const weakGpu = /mali-4|mali-t|adreno \(tm\) [1-5]\d\d|powervr|intel\(r\) (hd|uhd) graphics [2-6]\d\d\b/i.test(renderer);
  if (mem <= 2 || cores <= 2) return 'low';
  if (mobile || weakGpu || mem < 8 || cores < 8) return mem >= 4 && !weakGpu ? 'medium' : 'low';
  return 'high';
}

/**
 * Returns the tier to use and, when it is "off", why (logged to the console to make support easy).
 * The 3D always runs: the only reason to show the illustration is a browser without WebGL.
 * Slow devices still get a lighter tier (and the scene steps down further if it drops frames).
 */
export function detectQualityWithReason(): { quality: Quality; reason: string } {
  if (typeof window === 'undefined') return { quality: 'off', reason: 'server render' };
  const gl = webgl();
  if (!gl.ok) return { quality: 'off', reason: 'WebGL is not available in this browser' };
  return { quality: deviceTier(gl.renderer), reason: 'automatic' };
}

export function detectQuality(): Quality {
  return detectQualityWithReason().quality;
}

export function stepDown(q: Quality): Quality {
  return q === 'high' ? 'medium' : q === 'medium' ? 'low' : 'off';
}
