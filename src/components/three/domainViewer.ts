/**
 * Interactive 3D viewer for the "What students learn" panel.
 * One WebGL renderer, one model per domain (built on first view, then cached).
 * Drag (mouse or touch) or use the arrow keys to turn the model; it slowly
 * turns by itself otherwise. Paused when off-screen; everything is disposed on unmount.
 */
import * as THREE from 'three';
import {
  createMaterials, makeDrone, makeHumanoid, makeLaptop, makeMicrocontroller, makeNeuralNet, makePrinter, type Model,
} from './models';
import type { DomainId } from '@/content/domains';
import type { Tier } from './heroScene';

export type DomainViewerHandle = { show: (id: DomainId) => void; nudge: (dir: -1 | 1) => void; dispose: () => void };

const DPR: Record<Tier, number> = { high: 2, medium: 1.5, low: 1 };

export function createDomainViewer(canvas: HTMLCanvasElement, container: HTMLElement, tier: Tier): DomainViewerHandle {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: tier !== 'low', alpha: true });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, DPR[tier]));
  renderer.shadowMap.enabled = tier !== 'low';
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.05, 50);

  scene.add(new THREE.HemisphereLight(0x9cc3ff, 0x05070d, 0.9));
  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(3, 5, 4);
  key.castShadow = tier !== 'low';
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = -3; key.shadow.camera.right = 3; key.shadow.camera.top = 3; key.shadow.camera.bottom = -3;
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x22d3ee, 1.6);
  rim.position.set(-4, 2.5, -3);
  scene.add(rim);

  // Display plinth: a dark disc with a glowing cyan rim and a soft blue halo
  const plinth = new THREE.Group();
  const discMat = new THREE.MeshStandardMaterial({ color: 0x0b1222, roughness: 0.4, metalness: 0.5 });
  const disc = new THREE.Mesh(new THREE.CylinderGeometry(1.9, 2.0, 0.12, 64), discMat);
  disc.position.y = -0.06;
  disc.receiveShadow = true;
  plinth.add(disc);
  const rimMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(0x22d3ee).multiplyScalar(1.4), toneMapped: false });
  const rimRing = new THREE.Mesh(new THREE.TorusGeometry(1.95, 0.025, 8, 96), rimMat);
  rimRing.rotation.x = Math.PI / 2;
  plinth.add(rimRing);
  // Second, fainter orbit ring for the "stage" look
  const haloMat = new THREE.MeshBasicMaterial({ color: 0x6366f1, transparent: true, opacity: 0.55, toneMapped: false });
  const halo = new THREE.Mesh(new THREE.TorusGeometry(2.35, 0.012, 8, 128), haloMat);
  halo.rotation.x = Math.PI / 2;
  halo.position.y = 0.02;
  plinth.add(halo);
  const coreLight = new THREE.PointLight(0x3b82f6, 6, 6, 2);
  coreLight.position.set(0, 0.6, 0);
  scene.add(coreLight);
  scene.add(plinth);

  const turntable = new THREE.Group();
  scene.add(turntable);

  const mats = createMaterials();
  const builders: Record<DomainId, () => Model> = {
    ai: () => makeNeuralNet(mats),
    robotics: () => makeHumanoid(mats),
    iot: () => makeMicrocontroller(mats),
    drones: () => makeDrone(mats),
    coding: () => makeLaptop(mats),
    fabrication: () => makePrinter(mats),
  };
  type Entry = { model: Model; scale: number; center: THREE.Vector3; minY: number };
  const cache = new Map<DomainId, Entry>();
  let current: Entry | null = null;

  const fit = (model: Model) => {
    const box = new THREE.Box3().setFromObject(model.group);
    const size = box.getSize(new THREE.Vector3());
    const scale = 2.6 / Math.max(size.x, size.z, size.y * 1.1);
    const center = box.getCenter(new THREE.Vector3());
    return { scale, center, minY: box.min.y };
  };

  const show = (id: DomainId) => {
    if (current) turntable.remove(current.model.group);
    let entry = cache.get(id);
    if (!entry) {
      const model = builders[id]();
      model.update(0);
      model.group.traverse((o) => { const me = o as THREE.Mesh; if (me.isMesh) me.castShadow = tier !== 'low'; });
      const { scale, center, minY } = fit(model);
      entry = { model, scale, center, minY };
      cache.set(id, entry);
    }
    const { model, scale, center, minY } = entry;
    model.group.scale.setScalar(scale);
    model.group.position.set(-center.x * scale, -minY * scale, -center.z * scale); // centred, standing on the plinth
    turntable.add(model.group);
    current = entry;
    // Frame the model: camera distance from its scaled height.
    const h = Math.max(1.2, (new THREE.Box3().setFromObject(model.group).getSize(new THREE.Vector3()).y));
    camera.position.set(0, 1.4 + h * 0.35, 5.6);
    camera.lookAt(0, h * 0.42, 0);
    spinVelocity = 0.6;
  };

  // ---- Interaction: drag to rotate, keyboard nudges, gentle auto-turn ----
  let angle = -0.6;
  let spinVelocity = 0;
  let dragging = false;
  let lastX = 0;
  const onDown = (e: PointerEvent) => { dragging = true; lastX = e.clientX; canvas.setPointerCapture(e.pointerId); };
  const onMove = (e: PointerEvent) => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    lastX = e.clientX;
    angle += dx * 0.01;
    spinVelocity = dx * 0.6;
  };
  const onUp = (e: PointerEvent) => { dragging = false; try { canvas.releasePointerCapture(e.pointerId); } catch { /* ignore */ } };
  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerup', onUp);
  canvas.addEventListener('pointercancel', onUp);

  const resize = () => {
    const w = Math.max(1, container.clientWidth);
    const h = Math.max(1, container.clientHeight);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  };
  const ro = new ResizeObserver(resize);
  ro.observe(container);
  resize();

  let visible = true;
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0.01 });
  io.observe(container);

  const start = performance.now();
  let last = start;
  let raf = 0;
  const minFrame = tier === 'low' ? 1000 / 30 : 0;
  const loop = (now: number) => {
    raf = requestAnimationFrame(loop);
    if (!visible || document.hidden) { last = now; return; }
    if (now - last < minFrame) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!dragging) {
      spinVelocity *= 0.94;
      angle += (0.25 + spinVelocity) * dt;
    }
    turntable.rotation.y = angle;
    current?.model.update((now - start) / 1000);
    renderer.render(scene, camera);
  };
  raf = requestAnimationFrame(loop);

  return {
    show,
    nudge(dir) { angle += dir * 0.35; spinVelocity = 0; },
    dispose() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onUp);
      for (const { model } of cache.values()) {
        model.dispose?.();
        model.group.traverse((o) => {
          const me = o as THREE.Mesh;
          if (me.geometry) me.geometry.dispose();
        });
      }
      Object.values(mats).forEach((mt) => mt.dispose());
      discMat.dispose(); rimMat.dispose(); haloMat.dispose();
      disc.geometry.dispose(); rimRing.geometry.dispose(); halo.geometry.dispose();
      // No forceContextLoss(): React (Strict Mode / Fast Refresh) can re-create the scene on the
      // same <canvas>, and a deliberately lost context would make that second start fail.
      renderer.dispose();
    },
  };
}
