/**
 * Hero 3D scene — "tech planet":
 * a glowing core inside a wireframe globe, orbit rings carrying the things
 * students build (drone, robot car, gear, microcontroller, 3D printer), a humanoid
 * robot waving from a floating platform,
 * a constellation-style node network with travelling signals, and a starfield.
 *
 * Plain Three.js, loaded with dynamic import() only on capable devices.
 * Every resource is created and disposed explicitly.
 */
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import {
  createMaterials, makeDrone, makeGear, makeHumanoid, makeMicrocontroller, makePrinter, makeRobotCar, type Model,
} from './models';

export type Tier = 'high' | 'medium' | 'low';
export type HeroSceneHandle = { setTier: (t: Tier) => void; dispose: () => void };
type Options = { tier: Tier; onFps?: (fps: number) => void };

const TIER_SETTINGS: Record<Tier, { dpr: number; bloom: boolean; stars: number; nodes: number; signals: number; fpsCap: number }> = {
  high: { dpr: 2, bloom: true, stars: 1400, nodes: 54, signals: 14, fpsCap: 60 },
  medium: { dpr: 1.5, bloom: false, stars: 900, nodes: 42, signals: 10, fpsCap: 60 },
  low: { dpr: 1, bloom: false, stars: 450, nodes: 30, signals: 6, fpsCap: 30 },
};

/** Deterministic PRNG so the constellation is the same on every visit. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function glowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(200,240,255,1)');
  g.addColorStop(0.3, 'rgba(56,189,248,0.55)');
  g.addColorStop(1, 'rgba(37,99,235,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function createHeroScene(canvas: HTMLCanvasElement, container: HTMLElement, opts: Options): HeroSceneHandle {
  let tier = opts.tier;
  let settings = TIER_SETTINGS[tier];
  const rand = mulberry32(20261115);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: tier !== 'low', alpha: true, powerPreference: tier === 'high' ? 'high-performance' : 'default' });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, settings.dpr));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 200);
  const camBase = new THREE.Vector3(0, 1.0, 13);
  const lookTarget = new THREE.Vector3();

  // ---------- Lights ----------
  scene.add(new THREE.HemisphereLight(0x9cc3ff, 0x05070d, 0.7));
  const key = new THREE.DirectionalLight(0xffffff, 1.7);
  key.position.set(5, 6, 8);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x22d3ee, 1.3);
  rim.position.set(-6, 2, -5);
  scene.add(rim);
  const coreLight = new THREE.PointLight(0x3b82f6, 25, 14, 2);
  scene.add(coreLight);

  // ---------- World (everything that tilts with the cursor) ----------
  const world = new THREE.Group();
  scene.add(world);
  // Everything except the robot turns on this axis: a steady auto-rotation plus a drag-to-spin.
  const spinner = new THREE.Group();
  world.add(spinner);

  // Core planet + atmosphere
  const coreMat = new THREE.MeshStandardMaterial({ color: 0x0b2a8a, emissive: 0x1d4ed8, emissiveIntensity: 0.65, roughness: 0.35, metalness: 0.25 });
  const core = new THREE.Mesh(new THREE.SphereGeometry(1.7, 64, 48), coreMat);
  spinner.add(core);
  const atmoMat = new THREE.MeshBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.16, side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false });
  spinner.add(new THREE.Mesh(new THREE.SphereGeometry(2.0, 48, 32), atmoMat));

  // Wireframe globe with vertex dots
  const ico = new THREE.IcosahedronGeometry(2.75, 1);
  const wireMat = new THREE.LineBasicMaterial({ color: 0x8fb4ff, transparent: true, opacity: 0.32 });
  const wire = new THREE.LineSegments(new THREE.WireframeGeometry(ico), wireMat);
  const dotMat = new THREE.PointsMaterial({ color: 0xcfe0ff, size: 0.07, sizeAttenuation: true, transparent: true, opacity: 0.9 });
  const dots = new THREE.Points(ico, dotMat);
  const globe = new THREE.Group();
  globe.add(wire, dots);
  spinner.add(globe);

  // Orbit rings (each in its own tilted plane), carrying models
  const mats = createMaterials();
  const ringDefs = [
    { r: 3.9, tube: 0.014, color: 0x6366f1, opacity: 0.95, rx: 1.22, ry: 0.32, rz: 0, speed: 0.3 },
    { r: 4.7, tube: 0.011, color: 0x22d3ee, opacity: 0.7, rx: 1.42, ry: -0.2, rz: -0.42, speed: -0.22 },
    { r: 3.25, tube: 0.008, color: 0x93c5fd, opacity: 0.4, rx: 1.05, ry: 0.5, rz: 0.62, speed: 0.38 },
  ];
  const ringMats: THREE.MeshBasicMaterial[] = [];
  const rings = ringDefs.map((d) => {
    const plane = new THREE.Group();
    plane.rotation.set(d.rx, d.ry, d.rz);
    const mat = new THREE.MeshBasicMaterial({ color: new THREE.Color(d.color).multiplyScalar(1.3), transparent: true, opacity: d.opacity, toneMapped: false });
    ringMats.push(mat);
    plane.add(new THREE.Mesh(new THREE.TorusGeometry(d.r, d.tube, 8, 220), mat));
    spinner.add(plane);
    return { plane, def: d };
  });

  type Rider = { model: Model; ring: number; angle: number; carrier: THREE.Group; spinY: number };
  const riders: Rider[] = [];
  const addRider = (model: Model, ring: number, angle: number, scale: number, spinY = 0.4) => {
    const carrier = new THREE.Group();
    model.group.scale.setScalar(scale);
    carrier.add(model.group);
    rings[ring].plane.add(carrier);
    riders.push({ model, ring, angle, carrier, spinY });
  };
  addRider(makeDrone(mats), 1, 0.35, 0.75, 0.0);
  addRider(makeGear(mats), 0, Math.PI * 0.05, 0.55, 0.25);
  addRider(makeRobotCar(mats), 0, Math.PI * 1.05, 0.5, 0.5);
  addRider(makeMicrocontroller(mats), 1, Math.PI * 1.25, 0.45, 0.3);
  addRider(makePrinter(mats), 2, Math.PI * 1.6, 0.42, 0.3);
  const ringInverse = rings.map((r) => r.plane.quaternion.clone().invert());

  // Humanoid robot on a floating platform, in front of the planet, facing the viewer
  const robotStage = new THREE.Group();
  robotStage.position.set(2.5, -2.9, 2.4);
  robotStage.rotation.y = -0.45;
  world.add(robotStage);
  const padMat = new THREE.MeshStandardMaterial({ color: 0x0b1222, roughness: 0.35, metalness: 0.6 });
  const pad = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.1, 0.16, 48), padMat);
  pad.position.y = -0.08;
  robotStage.add(pad);
  const padRingMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(0x22d3ee).multiplyScalar(1.5), toneMapped: false });
  const padRing = new THREE.Mesh(new THREE.TorusGeometry(1.03, 0.022, 8, 80), padRingMat);
  padRing.rotation.x = Math.PI / 2;
  robotStage.add(padRing);
  const beamMat = new THREE.MeshBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.1, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending });
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 0.6, 1.6, 40, 1, true), beamMat);
  beam.position.y = -0.95;
  robotStage.add(beam);
  const robot = makeHumanoid(mats);
  robot.group.scale.setScalar(0.72);
  robotStage.add(robot.group);

  // Constellation network
  const nodePos: THREE.Vector3[] = [];
  const NODE_MAX = TIER_SETTINGS.high.nodes;
  while (nodePos.length < NODE_MAX) {
    const v = new THREE.Vector3(rand() * 2 - 1, (rand() * 2 - 1) * 0.75, rand() * 2 - 1);
    if (v.length() < 0.2) continue;
    v.normalize().multiplyScalar(3.4 + rand() * 3.0);
    nodePos.push(v);
  }
  const nodeGeo = new THREE.SphereGeometry(0.055, 12, 8);
  const nodeMat = new THREE.MeshStandardMaterial({ color: 0xa5c4ff, emissive: 0x3b82f6, emissiveIntensity: 0.6, roughness: 0.4, metalness: 0.3 });
  const nodes = new THREE.InstancedMesh(nodeGeo, nodeMat, NODE_MAX);
  const mtx = new THREE.Matrix4();
  nodePos.forEach((p, i) => { mtx.makeTranslation(p.x, p.y, p.z); nodes.setMatrixAt(i, mtx); });
  nodes.instanceMatrix.needsUpdate = true;
  nodes.count = settings.nodes;
  const edges: [number, number][] = [];
  for (let i = 0; i < NODE_MAX; i++) for (let j = i + 1; j < NODE_MAX; j++) if (nodePos[i].distanceTo(nodePos[j]) < 2.0) edges.push([i, j]);
  const edgePts: number[] = [];
  edges.forEach(([a, b]) => edgePts.push(nodePos[a].x, nodePos[a].y, nodePos[a].z, nodePos[b].x, nodePos[b].y, nodePos[b].z));
  const edgeGeo = new THREE.BufferGeometry();
  edgeGeo.setAttribute('position', new THREE.Float32BufferAttribute(edgePts, 3));
  const edgeMat = new THREE.LineBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.2 });
  const network = new THREE.Group();
  network.add(nodes, new THREE.LineSegments(edgeGeo, edgeMat));
  spinner.add(network);

  // Signals travelling along network edges (glow sprites, one material each so they can fade)
  const glowTex = glowTexture();
  const signals = Array.from({ length: TIER_SETTINGS.high.signals }, (_, i) => {
    const mat = new THREE.SpriteMaterial({ map: glowTex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true });
    const s = new THREE.Sprite(mat);
    s.scale.setScalar(0.42);
    s.visible = i < settings.signals;
    network.add(s);
    return s;
  });
  const hash = (a: number, b: number) => { const x = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return x - Math.floor(x); };

  // Starfield (outside the world group so it barely moves)
  const starCount = TIER_SETTINGS.high.stars;
  const starPos = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    const v = new THREE.Vector3(rand() * 2 - 1, rand() * 2 - 1, rand() * 2 - 1).normalize().multiplyScalar(30 + rand() * 40);
    starPos[i * 3] = v.x; starPos[i * 3 + 1] = v.y; starPos[i * 3 + 2] = v.z;
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  starGeo.setDrawRange(0, settings.stars);
  const starMat = new THREE.PointsMaterial({ color: 0xdbe7ff, size: 0.12, sizeAttenuation: true, transparent: true, opacity: 0.85, depthWrite: false });
  const stars = new THREE.Points(starGeo, starMat);
  scene.add(stars);

  // ---------- Post-processing (High tier only) ----------
  let composer: EffectComposer | null = null;
  let bloom: UnrealBloomPass | null = null;
  const buildComposer = () => {
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.9, 0.6, 0.15);
    composer.addPass(bloom);
    composer.addPass(new OutputPass());
  };
  const disposeComposer = () => { bloom?.dispose(); composer?.dispose(); composer = null; bloom = null; };
  if (settings.bloom) buildComposer();

  // ---------- Size & framing ----------
  const resize = () => {
    const w = Math.max(1, container.clientWidth);
    const h = Math.max(1, container.clientHeight);
    camera.aspect = w / h;
    // The canvas has its own column (or its own block on small screens), so the scene is centred.
    // Tall canvases need a wider field of view to keep the rings and robot in frame.
    lookTarget.set(0.5, -0.6, 0);
    if (camera.aspect >= 1.2) { camera.fov = 40; camBase.z = 14.5; }
    else if (camera.aspect >= 0.8) { camera.fov = 46; camBase.z = 15.5; }
    else { camera.fov = 54; camBase.z = 16.5; }
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
    composer?.setSize(w, h);
    bloom?.resolution.set(w, h);
  };
  const ro = new ResizeObserver(resize);
  ro.observe(container);
  resize();

  // ---------- Interaction ----------
  const pointer = new THREE.Vector2();
  const pointerSmoothed = new THREE.Vector2();
  const onPointer = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    pointer.set((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
  };
  window.addEventListener('pointermove', onPointer, { passive: true });

  // Drag (mouse or touch) to spin the planet system; it keeps its momentum, then settles back to auto-rotation.
  const AUTO_SPIN = 0.3; // radians per second: one full turn about every 21 s (medium)
  let spinAngle = 0;
  let spinVel = AUTO_SPIN;
  let dragging = false;
  let dragX = 0;
  let dragT = 0;
  const onDown = (e: PointerEvent) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    dragging = true; dragX = e.clientX; dragT = performance.now();
    canvas.setPointerCapture?.(e.pointerId);
  };
  const onMove = (e: PointerEvent) => {
    if (!dragging) return;
    const now = performance.now();
    const dx = e.clientX - dragX;
    const delta = (dx / Math.max(1, container.clientWidth)) * Math.PI * 1.6;
    spinAngle += delta;
    const dt = Math.max(1, now - dragT) / 1000;
    spinVel = THREE.MathUtils.clamp(delta / dt, -6, 6);
    dragX = e.clientX; dragT = now;
  };
  const onUp = (e: PointerEvent) => { dragging = false; canvas.releasePointerCapture?.(e.pointerId); };
  canvas.style.touchAction = 'pan-y'; // horizontal drags spin, vertical swipes still scroll the page
  canvas.style.cursor = 'grab';
  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerup', onUp);
  canvas.addEventListener('pointercancel', onUp);

  let visible = true;
  let pageVisible = !document.hidden;
  const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { threshold: 0.01 });
  io.observe(container);
  const onVis = () => { pageVisible = !document.hidden; };
  document.addEventListener('visibilitychange', onVis);

  let raf = 0;
  let last = performance.now();
  let acc = 0;
  let frames = 0;
  let fpsWindow = last;
  const start = last;

  let prevT = 0;
  const renderFrame = (t: number) => {
    const dt = Math.min(0.1, Math.max(0, t - prevT));
    prevT = t;
    if (!dragging) {
      spinVel += (AUTO_SPIN - spinVel) * Math.min(1, dt * 1.5); // momentum eases back to the auto speed
      spinAngle += spinVel * dt;
    }
    spinner.rotation.y = spinAngle;
    canvas.style.cursor = dragging ? 'grabbing' : 'grab';
    pointerSmoothed.lerp(pointer, 0.04);
    world.rotation.y = pointerSmoothed.x * 0.25;
    world.rotation.x = pointerSmoothed.y * 0.12;

    core.rotation.y = t * 0.05;
    globe.rotation.y = t * 0.12;
    globe.rotation.x = Math.sin(t * 0.1) * 0.08;
    network.rotation.y = -t * 0.05;
    stars.rotation.y = t * 0.004;
    coreLight.intensity = 22 + Math.sin(t * 1.3) * 4;

    // Riders move along their ring and stay upright in world space.
    for (const r of riders) {
      const d = rings[r.ring].def;
      const a = r.angle + t * d.speed;
      r.carrier.position.set(Math.cos(a) * d.r, Math.sin(a) * d.r, 0);
      r.carrier.quaternion.copy(ringInverse[r.ring]);
      r.model.group.rotation.y = t * r.spinY;
      r.model.update(t);
    }

    // Signals hop along network edges and fade in/out.
    signals.forEach((s, k) => {
      if (!s.visible || edges.length === 0) return;
      const HOP = 1.4;
      const tt = t + k * 0.53;
      const hop = Math.floor(tt / HOP);
      const f = (tt % HOP) / HOP;
      const [a, b] = edges[Math.floor(hash(hop, k) * edges.length)];
      s.position.lerpVectors(nodePos[a], nodePos[b], f);
      (s.material as THREE.SpriteMaterial).opacity = Math.sin(f * Math.PI);
    });

    robot.update(t);
    robotStage.position.y = -2.9 + Math.sin(t * 1.1) * 0.12; // gentle float
    padRingMat.color.set(0x22d3ee).multiplyScalar(1.3 + Math.sin(t * 2) * 0.3);

    camera.position.set(camBase.x + pointerSmoothed.x * 0.4, camBase.y - pointerSmoothed.y * 0.25, camBase.z);
    camera.lookAt(lookTarget);

    if (composer) composer.render();
    else renderer.render(scene, camera);
  };

  const loop = (now: number) => {
    raf = requestAnimationFrame(loop);
    if (!visible || !pageVisible) { last = now; return; }
    acc += now - last;
    last = now;
    if (acc < 1000 / settings.fpsCap - 1) return;
    acc = 0;
    renderFrame((now - start) / 1000);
    frames++;
    if (now - fpsWindow >= 2000) {
      opts.onFps?.((frames * 1000) / (now - fpsWindow));
      frames = 0;
      fpsWindow = now;
    }
  };
  renderFrame(0);
  raf = requestAnimationFrame(loop);

  return {
    setTier(next: Tier) {
      if (next === tier) return;
      tier = next;
      settings = TIER_SETTINGS[tier];
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, settings.dpr));
      if (settings.bloom && !composer) buildComposer();
      if (!settings.bloom && composer) disposeComposer();
      starGeo.setDrawRange(0, settings.stars);
      nodes.count = settings.nodes;
      signals.forEach((s, i) => { s.visible = i < settings.signals; });
      resize();
    },
    dispose() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onPointer);
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onUp);
      document.removeEventListener('visibilitychange', onVis);
      disposeComposer();
      riders.forEach((r) => r.model.dispose?.());
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const ms = mesh.material ? (Array.isArray(mesh.material) ? mesh.material : [mesh.material]) : [];
        ms.forEach((mt) => mt.dispose());
      });
      Object.values(mats).forEach((mt) => mt.dispose());
      ringMats.forEach((mt) => mt.dispose());
      padMat.dispose(); padRingMat.dispose(); beamMat.dispose();
      ico.dispose();
      glowTex.dispose();
      // No forceContextLoss(): React (Strict Mode / Fast Refresh) can re-create the scene on the
      // same <canvas>, and a deliberately lost context would make that second start fail.
      renderer.dispose();
    },
  };
}
