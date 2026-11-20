/**
 * Procedural 3D models of the things students build — no model files to download.
 * Each model is built from Three.js primitives, sits on y = 0, faces +x and is
 * roughly 1.5–2 units across. `update(t)` animates it (t = seconds).
 *
 * Used by the hero scene (heroScene.ts) and the domain viewer (domainViewer.ts).
 */
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

export type Model = { group: THREE.Group; update: (t: number) => void; dispose?: () => void };

export function createMaterials() {
  return {
    plastic: new THREE.MeshStandardMaterial({ color: 0xe9eef7, roughness: 0.35, metalness: 0.1 }),
    dark: new THREE.MeshStandardMaterial({ color: 0x1f2a44, roughness: 0.35, metalness: 0.55 }),
    rubber: new THREE.MeshStandardMaterial({ color: 0x1a2230, roughness: 0.9, metalness: 0 }),
    copper: new THREE.MeshStandardMaterial({ color: 0x22d3ee, roughness: 0.3, metalness: 0.6, emissive: 0x0e7490, emissiveIntensity: 0.4 }), // cyan accent
    chip: new THREE.MeshStandardMaterial({ color: 0x14233a, roughness: 0.35, metalness: 0.1 }),
    metal: new THREE.MeshStandardMaterial({ color: 0xc3ccd8, roughness: 0.28, metalness: 0.9 }),
    pcbGreen: new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.5, metalness: 0.15 }), // deep-blue PCB
    pcbBlue: new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.45, metalness: 0.15 }),
    filament: new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.4, metalness: 0, emissive: 0x0e7490, emissiveIntensity: 0.35 }),
    ledBlue: new THREE.MeshBasicMaterial({ color: new THREE.Color(0x38bdf8).multiplyScalar(1.6), toneMapped: false }),
    ledCopper: new THREE.MeshBasicMaterial({ color: new THREE.Color(0x818cf8).multiplyScalar(1.6), toneMapped: false }),
    ledRed: new THREE.MeshBasicMaterial({ color: 0xff5a4f, toneMapped: false }),
    ledOff: new THREE.MeshBasicMaterial({ color: 0x1e293b }),
  };
}
export type Materials = ReturnType<typeof createMaterials>;

export function setShadows(obj: THREE.Object3D, on: boolean) {
  obj.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (mesh.isMesh) { mesh.castShadow = on; mesh.receiveShadow = false; }
  });
}

function mesh(geo: THREE.BufferGeometry, mat: THREE.Material, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  return m;
}

/* ------------------------------------------------------------------ */
/* Robot arm (robotics)                                                */
/* ------------------------------------------------------------------ */
export function makeRobotArm(m: Materials, scale = 1): Model & { turntable: THREE.Group } {
  const g = new THREE.Group();
  g.add(mesh(new THREE.CylinderGeometry(0.95, 1.1, 0.35, 48), m.dark, 0, 0.175, 0));
  const ring = mesh(new THREE.TorusGeometry(1.0, 0.035, 8, 64), m.copper, 0, 0.36, 0);
  ring.rotation.x = Math.PI / 2;
  g.add(ring);

  const turntable = new THREE.Group();
  turntable.position.y = 0.35;
  g.add(turntable);
  turntable.add(mesh(new THREE.CylinderGeometry(0.72, 0.78, 0.3, 40), m.plastic, 0, 0.15, 0));

  const shoulder = new THREE.Group();
  shoulder.position.y = 0.55;
  turntable.add(shoulder);
  shoulder.add(mesh(new THREE.SphereGeometry(0.4, 32, 20), m.dark));
  shoulder.add(mesh(new RoundedBoxGeometry(0.46, 2.3, 0.46, 3, 0.12), m.plastic, 0, 1.15, 0));
  shoulder.add(mesh(new THREE.BoxGeometry(0.05, 1.6, 0.48), m.copper, 0.2, 1.15, 0));

  const elbow = new THREE.Group();
  elbow.position.y = 2.3;
  shoulder.add(elbow);
  elbow.add(mesh(new THREE.SphereGeometry(0.33, 32, 20), m.dark));
  elbow.add(mesh(new RoundedBoxGeometry(0.36, 1.9, 0.36, 3, 0.1), m.plastic, 0, 0.95, 0));

  const wrist = new THREE.Group();
  wrist.position.y = 1.9;
  elbow.add(wrist);
  wrist.add(mesh(new THREE.SphereGeometry(0.24, 24, 16), m.dark));
  wrist.add(mesh(new RoundedBoxGeometry(0.56, 0.2, 0.34, 2, 0.05), m.plastic, 0, 0.26, 0));
  const fingerGeo = new RoundedBoxGeometry(0.09, 0.46, 0.26, 2, 0.03);
  const fingerL = mesh(fingerGeo, m.dark, -0.18, 0.56, 0);
  const fingerR = mesh(fingerGeo, m.dark, 0.18, 0.56, 0);
  wrist.add(fingerL, fingerR);
  wrist.add(mesh(new THREE.SphereGeometry(0.05, 12, 8), m.ledBlue, 0, 0.4, 0.18));

  g.scale.setScalar(scale);

  return {
    group: g,
    update(t) {
      turntable.rotation.y = Math.sin(t * 0.35) * 0.55 - 0.35;
      shoulder.rotation.z = 0.6 + Math.sin(t * 0.7) * 0.1;
      elbow.rotation.z = 1.4 + Math.sin(t * 0.7 + 0.8) * 0.16;
      wrist.rotation.z = 0.95 + Math.sin(t * 0.7 + 1.6) * 0.12;
      const grip = 0.13 + (Math.sin(t * 1.4) * 0.5 + 0.5) * 0.08;
      fingerL.position.x = -grip;
      fingerR.position.x = grip;
    },
    /** Lets the hero scene add cursor tracking on top of the idle motion. */
    turntable,
  };
}

/* ------------------------------------------------------------------ */
/* RC robot car (robotics / students)                                  */
/* ------------------------------------------------------------------ */
export function makeRobotCar(m: Materials): Model {
  const g = new THREE.Group();
  // PCB chassis
  g.add(mesh(new RoundedBoxGeometry(1.7, 0.12, 0.95, 2, 0.04), m.pcbGreen, 0, 0.36, 0));
  // Battery pack, controller board, motor driver with heatsink
  g.add(mesh(new RoundedBoxGeometry(0.6, 0.22, 0.5, 2, 0.04), m.dark, -0.45, 0.53, 0));
  g.add(mesh(new THREE.BoxGeometry(0.62, 0.05, 0.42), m.pcbBlue, 0.25, 0.445, 0));
  g.add(mesh(new THREE.BoxGeometry(0.24, 0.05, 0.1), m.chip, 0.25, 0.49, 0.06));
  g.add(mesh(new THREE.BoxGeometry(0.16, 0.14, 0.16), m.metal, 0.05, 0.53, -0.12));
  // Ultrasonic distance sensor ("eyes")
  g.add(mesh(new THREE.BoxGeometry(0.05, 0.2, 0.46), m.pcbBlue, 0.84, 0.52, 0));
  for (const z of [-0.12, 0.12]) {
    const eye = mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.12, 24), m.metal, 0.91, 0.52, z);
    eye.rotation.z = Math.PI / 2;
    g.add(eye);
  }
  // Status LEDs
  const ledA = mesh(new THREE.SphereGeometry(0.035, 10, 8), m.ledBlue, 0.45, 0.5, -0.15);
  const ledB = mesh(new THREE.SphereGeometry(0.035, 10, 8), m.ledCopper, 0.45, 0.5, -0.05);
  g.add(ledA, ledB);
  // Jumper wires from the board to the motors
  const wireMat = m.copper;
  for (const z of [-0.3, 0.3]) {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.1, 0.48, z * 0.5), new THREE.Vector3(0.2, 0.68, z * 0.9), new THREE.Vector3(0.55, 0.44, z * 1.25),
    ]);
    g.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 16, 0.018, 6, false), wireMat));
  }
  // Wheels (with a spoke so the spin is visible)
  const wheels: THREE.Group[] = [];
  const tyreGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.18, 32);
  const hubGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.2, 16);
  const spokeGeo = new THREE.BoxGeometry(0.42, 0.06, 0.205);
  for (const [x, z] of [[0.55, 0.58], [0.55, -0.58], [-0.55, 0.58], [-0.55, -0.58]]) {
    const w = new THREE.Group();
    w.position.set(x, 0.28, z);
    const tyre = new THREE.Mesh(tyreGeo, m.rubber);
    tyre.rotation.x = Math.PI / 2;
    const hub = new THREE.Mesh(hubGeo, m.copper);
    hub.rotation.x = Math.PI / 2;
    w.add(tyre, hub, new THREE.Mesh(spokeGeo, m.dark));
    g.add(w);
    wheels.push(w);
  }
  return {
    group: g,
    update(t) {
      for (const w of wheels) w.rotation.z = -t * 8;
      ledA.material = Math.sin(t * 6) > 0 ? m.ledBlue : m.ledOff;
    },
  };
}

/* ------------------------------------------------------------------ */
/* Quadcopter drone (drones)                                           */
/* ------------------------------------------------------------------ */
export function makeDrone(m: Materials): Model {
  const g = new THREE.Group();
  const body = new THREE.Group();
  g.add(body);
  body.position.y = 0.32;
  body.add(mesh(new RoundedBoxGeometry(0.56, 0.16, 0.42, 3, 0.06), m.plastic));
  body.add(mesh(new RoundedBoxGeometry(0.38, 0.08, 0.28, 2, 0.03), m.dark, 0, 0.1, 0));
  // Camera gimbal
  body.add(mesh(new THREE.SphereGeometry(0.08, 16, 12), m.dark, 0.24, -0.1, 0));
  const lens = mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.03, 16), m.ledBlue, 0.32, -0.1, 0);
  lens.rotation.z = Math.PI / 2;
  body.add(lens);

  const props: THREE.Group[] = [];
  const armGeo = new THREE.BoxGeometry(0.62, 0.05, 0.07);
  const motorGeo = new THREE.CylinderGeometry(0.075, 0.075, 0.1, 20);
  const bladeGeo = new THREE.BoxGeometry(0.64, 0.012, 0.07);
  const discGeo = new THREE.CircleGeometry(0.32, 32);
  const discMat = new THREE.MeshBasicMaterial({ color: 0x93c5fd, transparent: true, opacity: 0.12, depthWrite: false, side: THREE.DoubleSide });
  [45, 135, 225, 315].forEach((deg, i) => {
    const a = THREE.MathUtils.degToRad(deg);
    const dx = Math.cos(a), dz = Math.sin(a);
    const arm = mesh(armGeo, m.dark, dx * 0.36, 0, dz * 0.36);
    arm.rotation.y = -a;
    body.add(arm);
    body.add(mesh(motorGeo, m.dark, dx * 0.68, 0.05, dz * 0.68));
    const prop = new THREE.Group();
    prop.position.set(dx * 0.68, 0.12, dz * 0.68);
    prop.add(new THREE.Mesh(bladeGeo, m.plastic));
    const disc = new THREE.Mesh(discGeo, discMat);
    disc.rotation.x = -Math.PI / 2;
    prop.add(disc);
    body.add(prop);
    props.push(prop);
    // Navigation LEDs: copper at the front, blue at the back
    body.add(mesh(new THREE.SphereGeometry(0.03, 8, 6), dx > 0 ? m.ledCopper : m.ledBlue, dx * 0.68, -0.02, dz * 0.68));
    void i;
  });
  // Landing skids
  for (const z of [-0.16, 0.16]) {
    body.add(mesh(new THREE.BoxGeometry(0.04, 0.2, 0.04), m.dark, 0.12, -0.16, z));
    body.add(mesh(new THREE.BoxGeometry(0.04, 0.2, 0.04), m.dark, -0.12, -0.16, z));
    body.add(mesh(new THREE.BoxGeometry(0.5, 0.03, 0.03), m.dark, 0, -0.26, z));
  }
  return {
    group: g,
    update(t) {
      props.forEach((p, i) => { p.rotation.y = t * 38 * (i % 2 ? 1 : -1); });
      body.position.y = 0.32 + Math.sin(t * 1.8) * 0.04;
    },
    dispose() { discMat.dispose(); },
  };
}

/* ------------------------------------------------------------------ */
/* 3D printer printing a hexagonal part (3D design & printing)         */
/* ------------------------------------------------------------------ */
export function makePrinter(m: Materials): Model {
  const g = new THREE.Group();
  g.add(mesh(new RoundedBoxGeometry(1.25, 0.1, 1.05, 2, 0.03), m.dark, 0, 0.05, 0));
  const postGeo = new THREE.BoxGeometry(0.06, 1.35, 0.06);
  for (const [x, z] of [[-0.56, -0.46], [0.56, -0.46], [-0.56, 0.46], [0.56, 0.46]]) g.add(mesh(postGeo, m.dark, x, 0.75, z));
  for (const z of [-0.46, 0.46]) g.add(mesh(new THREE.BoxGeometry(1.18, 0.06, 0.06), m.dark, 0, 1.42, z));
  for (const x of [-0.56, 0.56]) g.add(mesh(new THREE.BoxGeometry(0.06, 0.06, 0.98), m.dark, x, 1.42, 0));
  // Bed
  g.add(mesh(new THREE.BoxGeometry(0.9, 0.04, 0.8), m.copper, 0, 0.3, 0));
  const bedTop = 0.32;
  // Printed part: hexagonal prism appearing layer by layer
  const layers: THREE.Mesh[] = [];
  const N = 22, H = 0.028;
  const layerGeo = new THREE.CylinderGeometry(0.22, 0.22, H, 6);
  for (let i = 0; i < N; i++) {
    const l = mesh(layerGeo, m.filament, 0, bedTop + H / 2 + i * H, 0);
    l.visible = false;
    g.add(l);
    layers.push(l);
  }
  // Gantry + print head
  const gantry = new THREE.Group();
  g.add(gantry);
  gantry.add(mesh(new THREE.BoxGeometry(1.12, 0.05, 0.05), m.metal, 0, 0, 0));
  const head = new THREE.Group();
  gantry.add(head);
  head.add(mesh(new RoundedBoxGeometry(0.2, 0.16, 0.16, 2, 0.03), m.plastic, 0, 0.06, 0.06));
  const nozzle = mesh(new THREE.ConeGeometry(0.035, 0.08, 16), m.copper, 0, -0.04, 0);
  nozzle.rotation.x = Math.PI;
  head.add(nozzle);
  const hot = mesh(new THREE.SphereGeometry(0.02, 8, 6), m.ledCopper, 0, -0.085, 0);
  head.add(hot);
  // Filament spool on the side
  const spool = mesh(new THREE.TorusGeometry(0.2, 0.07, 12, 32), m.filament, 0.75, 1.15, 0);
  spool.rotation.y = Math.PI / 2;
  g.add(spool);
  g.add(mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.2, 16), m.dark, 0.75, 1.15, 0).rotateX(Math.PI / 2));
  const filamentCurve = new THREE.CatmullRomCurve3([new THREE.Vector3(0.7, 1.05, 0), new THREE.Vector3(0.45, 1.6, 0), new THREE.Vector3(0.05, 1.3, 0.06)]);
  g.add(new THREE.Mesh(new THREE.TubeGeometry(filamentCurve, 20, 0.012, 6, false), m.filament));

  const CYCLE = 12;
  return {
    group: g,
    update(t) {
      const p = Math.min(1, (t % CYCLE) / (CYCLE - 2)); // 10 s printing, 2 s showing the finished part
      const done = Math.floor(p * N);
      layers.forEach((l, i) => { l.visible = i < done; });
      const top = bedTop + done * H;
      gantry.position.y = top + 0.12;
      head.position.x = done < N ? Math.sin(t * 7) * 0.22 : 0.42;
      head.position.z = done < N ? Math.cos(t * 5.3) * 0.12 : 0;
      hot.visible = done < N;
      spool.rotation.x = done < N ? t * 0.6 : spool.rotation.x;
    },
  };
}

/* ------------------------------------------------------------------ */
/* Microcontroller board with jumper wires (electronics & IoT)         */
/* ------------------------------------------------------------------ */
export function makeMicrocontroller(m: Materials): Model {
  const g = new THREE.Group();
  g.add(mesh(new RoundedBoxGeometry(1.5, 0.06, 1.0, 2, 0.02), m.pcbBlue, 0, 0.03, 0));
  // Main chip with pins
  g.add(mesh(new RoundedBoxGeometry(0.62, 0.08, 0.17, 2, 0.02), m.chip, 0.22, 0.1, 0.1));
  const pinGeo = new THREE.BoxGeometry(0.025, 0.03, 0.06);
  const pins = new THREE.InstancedMesh(pinGeo, m.metal, 28);
  const mtx = new THREE.Matrix4();
  for (let i = 0; i < 14; i++) {
    const x = -0.06 + i * 0.044;
    mtx.makeTranslation(x, 0.075, 0.1 + 0.115); pins.setMatrixAt(i * 2, mtx);
    mtx.makeTranslation(x, 0.075, 0.1 - 0.115); pins.setMatrixAt(i * 2 + 1, mtx);
  }
  pins.instanceMatrix.needsUpdate = true;
  g.add(pins);
  // USB port, power jack, crystal, reset button
  g.add(mesh(new THREE.BoxGeometry(0.32, 0.2, 0.26), m.metal, -0.64, 0.16, 0.24));
  g.add(mesh(new THREE.BoxGeometry(0.3, 0.2, 0.18), m.chip, -0.64, 0.16, -0.28));
  g.add(mesh(new THREE.BoxGeometry(0.12, 0.05, 0.05), m.metal, -0.15, 0.085, 0.1));
  g.add(mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.05, 16), m.ledRed, -0.32, 0.09, -0.32));
  // Header strips
  g.add(mesh(new THREE.BoxGeometry(1.0, 0.14, 0.06), m.chip, 0.1, 0.13, 0.44));
  g.add(mesh(new THREE.BoxGeometry(0.9, 0.14, 0.06), m.chip, 0.15, 0.13, -0.44));
  // LEDs
  const leds = [m.ledBlue, m.ledCopper, m.ledBlue].map((mat, i) => {
    const led = mesh(new THREE.BoxGeometry(0.05, 0.03, 0.03), mat, -0.32 + i * 0.08, 0.075, 0.02);
    g.add(led);
    return { led, mat };
  });
  // Jumper wires out of the header
  const colours = [m.copper, m.ledRed, m.ledBlue];
  colours.forEach((mat, i) => {
    const x = -0.1 + i * 0.12;
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(x, 0.2, 0.44), new THREE.Vector3(x, 0.55, 0.62), new THREE.Vector3(x + 0.1, 0.35, 0.95), new THREE.Vector3(x + 0.2, 0.05, 1.15),
    ]);
    g.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 24, 0.022, 8, false), mat));
  });
  // A small sensor module at the end of the wires
  g.add(mesh(new THREE.BoxGeometry(0.42, 0.04, 0.26), m.pcbGreen, 0.13, 0.03, 1.22));
  g.add(mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.06, 20), m.dark, 0.13, 0.08, 1.22));

  return {
    group: g,
    update(t) {
      leds.forEach(({ led, mat }, i) => { led.material = Math.sin(t * (3 + i * 1.7)) > 0 ? mat : m.ledOff; });
    },
  };
}

/* ------------------------------------------------------------------ */
/* Neural network (artificial intelligence)                            */
/* ------------------------------------------------------------------ */
export function makeNeuralNet(m: Materials): Model {
  const g = new THREE.Group();
  const sizes = [4, 6, 6, 3];
  const xs = [-1.2, -0.4, 0.4, 1.2];
  const pos: THREE.Vector3[][] = sizes.map((n, l) =>
    Array.from({ length: n }, (_, i) => new THREE.Vector3(xs[l], 1.1 + (i - (n - 1) / 2) * 0.36, Math.sin(i * 1.7 + l) * 0.28)),
  );
  const nodeMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.25, metalness: 0.3, emissive: 0x1d4ed8, emissiveIntensity: 0.6 });
  const nodeGeo = new THREE.SphereGeometry(0.085, 20, 14);
  const nodes: THREE.Mesh[][] = pos.map((layer) => layer.map((p) => { const n = mesh(nodeGeo, nodeMat, p.x, p.y, p.z); g.add(n); return n; }));

  const linePts: number[] = [];
  for (let l = 0; l < sizes.length - 1; l++) for (const a of pos[l]) for (const b of pos[l + 1]) linePts.push(a.x, a.y, a.z, b.x, b.y, b.z);
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePts, 3));
  const lineMat = new THREE.LineBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.35 });
  g.add(new THREE.LineSegments(lineGeo, lineMat));

  // Stand (so the network reads as a model on the table, not floating text)
  g.add(mesh(new THREE.CylinderGeometry(0.5, 0.6, 0.08, 40), m.dark, 0, 0.04, 0));
  g.add(mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.42, 12), m.metal, 0, 0.29, 0));

  // Signals hop layer to layer; positions are derived from time, so no state to keep.
  const hash = (a: number, b: number) => { const x = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return x - Math.floor(x); };
  const signals = Array.from({ length: 9 }, () => { const s = mesh(new THREE.SphereGeometry(0.045, 10, 8), m.ledCopper); g.add(s); return s; });
  const HOP = 0.55;
  const tmp = new THREE.Vector3();

  return {
    group: g,
    update(t) {
      nodes.flat().forEach((n) => n.scale.setScalar(1));
      signals.forEach((s, k) => {
        const tt = t + k * 0.37;
        const hop = Math.floor(tt / HOP);
        const f = (tt % HOP) / HOP;
        const l = hop % (sizes.length - 1);
        const a = Math.floor(hash(hop, k) * sizes[l]);
        const b = Math.floor(hash(hop + 0.5, k) * sizes[l + 1]);
        tmp.lerpVectors(pos[l][a], pos[l + 1][b], f);
        s.position.copy(tmp);
        if (f > 0.85) nodes[l + 1][b].scale.setScalar(1.35);
      });
    },
    dispose() { nodeMat.dispose(); lineMat.dispose(); },
  };
}

/* ------------------------------------------------------------------ */
/* Laptop with code being typed (coding)                               */
/* ------------------------------------------------------------------ */
const CODE = [
  'def follow_line(sensor, motors):',
  '    while True:',
  '        left, right = sensor.read()',
  '        if left > THRESHOLD:',
  '            motors.turn_left(speed=60)',
  '        elif right > THRESHOLD:',
  '            motors.turn_right(speed=60)',
  '        else:',
  '            motors.forward(speed=80)',
];
const KEYWORD = /^(def|while|True|if|elif|else)$/;

export function makeLaptop(m: Materials): Model {
  const g = new THREE.Group();
  const shell = new THREE.MeshStandardMaterial({ color: 0x8a96b3, roughness: 0.3, metalness: 0.7 });
  g.add(mesh(new RoundedBoxGeometry(1.8, 0.07, 1.2, 2, 0.03), shell, 0, 0.035, 0));
  // Keyboard
  const keyGeo = new THREE.BoxGeometry(0.1, 0.02, 0.1);
  const keys = new THREE.InstancedMesh(keyGeo, m.chip, 13 * 4);
  const mtx = new THREE.Matrix4();
  let k = 0;
  for (let r = 0; r < 4; r++) for (let c = 0; c < 13; c++) { mtx.makeTranslation(-0.72 + c * 0.12, 0.08, -0.42 + r * 0.12); keys.setMatrixAt(k++, mtx); }
  keys.instanceMatrix.needsUpdate = true;
  g.add(keys);
  g.add(mesh(new THREE.BoxGeometry(0.56, 0.005, 0.32), m.dark, 0, 0.073, 0.3));

  // Screen with a live canvas texture
  const canvas = document.createElement('canvas');
  canvas.width = 640; canvas.height = 380;
  const ctx = canvas.getContext('2d')!;
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  const lid = new THREE.Group();
  lid.position.set(0, 0.07, -0.6);
  lid.rotation.x = -0.28;
  g.add(lid);
  lid.add(mesh(new RoundedBoxGeometry(1.8, 1.12, 0.05, 2, 0.02), shell, 0, 0.56, 0));
  const screenMat = new THREE.MeshBasicMaterial({ map: tex, toneMapped: false });
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.64, 0.97), screenMat);
  screen.position.set(0, 0.57, 0.027);
  lid.add(screen);

  const total = CODE.join('\n').length;
  let lastChars = -1;
  const draw = (chars: number) => {
    ctx.fillStyle = '#0f1b2d';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#1b2d48';
    ctx.fillRect(0, 0, canvas.width, 30);
    ['#ff5a4f', '#f59e0b', '#38bdf8'].forEach((c, i) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(18 + i * 18, 15, 5, 0, Math.PI * 2); ctx.fill(); });
    ctx.fillStyle = '#9fb3cc'; ctx.font = '15px monospace'; ctx.fillText('robot.py', 80, 20);
    ctx.font = '19px monospace';
    let left = chars;
    CODE.forEach((line, i) => {
      if (left <= 0) return;
      const shown = line.slice(0, left);
      left -= line.length + 1;
      const y = 62 + i * 34;
      ctx.fillStyle = '#5b6b80'; ctx.fillText(String(i + 1).padStart(2, ' '), 14, y);
      // Simple syntax colouring: keywords copper, calls blue, rest silkscreen.
      let x = 52;
      const parts = shown.split(/(\b(?:def|while|True|if|elif|else)\b|[a-z_]+(?=\())/g).filter(Boolean);
      for (const part of parts) {
        ctx.fillStyle = KEYWORD.test(part) ? '#f59e0b' : /^[a-z_]+$/.test(part) && shown.includes(`${part}(`) ? '#38bdf8' : '#e6eefb';
        ctx.fillText(part, x, y);
        x += ctx.measureText(part).width;
      }
      if (left <= 0 && Math.floor(performance.now() / 450) % 2 === 0) { ctx.fillStyle = '#e6eefb'; ctx.fillRect(x + 2, y - 16, 10, 20); }
    });
    tex.needsUpdate = true;
  };
  draw(0);

  const CYCLE = 14;
  return {
    group: g,
    update(t) {
      const p = Math.min(1, (t % CYCLE) / (CYCLE - 3));
      const chars = Math.floor(p * total);
      const blink = Math.floor(t / 0.45);
      const key = chars * 2 + (blink % 2);
      if (key !== lastChars) { lastChars = key; draw(chars); }
    },
    dispose() { tex.dispose(); screenMat.dispose(); shell.dispose(); },
  };
}

/* ------------------------------------------------------------------ */
/* Gear (engineering / mechanics)                                      */
/* ------------------------------------------------------------------ */
export function makeGear(m: Materials, teeth = 12): Model {
  const g = new THREE.Group();
  const outer = 1, root = 0.8, holeR = 0.32;
  const shape = new THREE.Shape();
  const step = (Math.PI * 2) / teeth;
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    const pts: [number, number][] = [
      [root, a], [outer, a + step * 0.15], [outer, a + step * 0.45], [root, a + step * 0.6],
    ];
    pts.forEach(([r, ang], j) => {
      const x = Math.cos(ang) * r, y = Math.sin(ang) * r;
      if (i === 0 && j === 0) shape.moveTo(x, y); else shape.lineTo(x, y);
    });
    const next = (i + 1) * step;
    shape.lineTo(Math.cos(next) * root, Math.sin(next) * root);
  }
  const hole = new THREE.Path();
  hole.absarc(0, 0, holeR, 0, Math.PI * 2, true);
  shape.holes.push(hole);
  const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.32, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.03, bevelSegments: 2, curveSegments: 24 });
  geo.center();
  const gearMat = new THREE.MeshStandardMaterial({ color: 0x8b98c9, roughness: 0.3, metalness: 0.75 });
  const gear = new THREE.Mesh(geo, gearMat);
  const spin = new THREE.Group();
  spin.add(gear);
  const hubRing = new THREE.Mesh(new THREE.TorusGeometry(holeR + 0.02, 0.04, 10, 40), m.copper);
  spin.add(hubRing);
  spin.position.y = 1.05;
  g.add(spin);
  return {
    group: g,
    update(t) { spin.rotation.z = t * 0.6; },
    dispose() { gearMat.dispose(); },
  };
}

/* ------------------------------------------------------------------ */
/* Humanoid robot (robotics) — stands on y = 0, faces +z, about 3.1 tall */
/* ------------------------------------------------------------------ */
export function makeHumanoid(m: Materials): Model {
  const g = new THREE.Group();
  const body = new THREE.Group();
  g.add(body);

  // Torso + glowing chest core
  body.add(mesh(new RoundedBoxGeometry(0.92, 1.0, 0.62, 4, 0.18), m.plastic, 0, 1.65, 0));
  body.add(mesh(new RoundedBoxGeometry(0.54, 0.42, 0.06, 2, 0.05), m.dark, 0, 1.72, 0.31));
  const core = mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.04, 32), m.ledBlue, 0, 1.72, 0.35);
  core.rotation.x = Math.PI / 2;
  body.add(core);
  const coreRing = mesh(new THREE.TorusGeometry(0.15, 0.018, 8, 40), m.copper, 0, 1.72, 0.35);
  body.add(coreRing);
  // Pelvis and neck
  body.add(mesh(new RoundedBoxGeometry(0.7, 0.28, 0.5, 3, 0.1), m.dark, 0, 1.08, 0));
  body.add(mesh(new THREE.CylinderGeometry(0.13, 0.15, 0.16, 20), m.dark, 0, 2.22, 0));

  // Head: visor with eyes, ear discs, antenna
  const head = new THREE.Group();
  head.position.y = 2.56;
  body.add(head);
  head.add(mesh(new RoundedBoxGeometry(0.78, 0.6, 0.62, 4, 0.2), m.plastic));
  head.add(mesh(new RoundedBoxGeometry(0.64, 0.28, 0.06, 3, 0.08), m.dark, 0, 0.02, 0.3));
  const eyes: THREE.Mesh[] = [-0.14, 0.14].map((x) => {
    const e = mesh(new RoundedBoxGeometry(0.11, 0.07, 0.03, 2, 0.02), m.ledBlue, x, 0.03, 0.34);
    head.add(e);
    return e;
  });
  for (const x of [-0.41, 0.41]) {
    const ear = mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.06, 24), m.copper, x, 0, 0);
    ear.rotation.z = Math.PI / 2;
    head.add(ear);
  }
  head.add(mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.24, 8), m.dark, 0, 0.42, 0));
  const tip = mesh(new THREE.SphereGeometry(0.05, 12, 8), m.ledCopper, 0, 0.56, 0);
  head.add(tip);

  // Arms: shoulder → upper arm → elbow → forearm → hand
  const makeArm = (side: 1 | -1) => {
    const shoulder = new THREE.Group();
    shoulder.position.set(side * 0.58, 2.0, 0);
    body.add(shoulder);
    shoulder.add(mesh(new THREE.SphereGeometry(0.17, 20, 14), m.dark));
    shoulder.add(mesh(new RoundedBoxGeometry(0.22, 0.5, 0.22, 3, 0.08), m.plastic, 0, -0.3, 0));
    const elbow = new THREE.Group();
    elbow.position.y = -0.58;
    shoulder.add(elbow);
    elbow.add(mesh(new THREE.SphereGeometry(0.12, 16, 12), m.dark));
    elbow.add(mesh(new RoundedBoxGeometry(0.19, 0.44, 0.19, 3, 0.07), m.plastic, 0, -0.25, 0));
    elbow.add(mesh(new THREE.SphereGeometry(0.13, 16, 12), m.dark, 0, -0.52, 0));
    return { shoulder, elbow };
  };
  const armR = makeArm(1);
  const armL = makeArm(-1);

  // Legs: hip → thigh → knee → shin → foot
  for (const side of [-1, 1]) {
    const hip = new THREE.Group();
    hip.position.set(side * 0.2, 1.05, 0);
    g.add(hip);
    hip.add(mesh(new RoundedBoxGeometry(0.25, 0.46, 0.27, 3, 0.08), m.plastic, 0, -0.24, 0));
    hip.add(mesh(new THREE.SphereGeometry(0.12, 16, 12), m.dark, 0, -0.5, 0));
    hip.add(mesh(new RoundedBoxGeometry(0.23, 0.42, 0.25, 3, 0.08), m.plastic, 0, -0.72, 0));
    hip.add(mesh(new RoundedBoxGeometry(0.3, 0.12, 0.44, 2, 0.05), m.dark, 0, -0.98, 0.06));
  }

  return {
    group: g,
    update(t) {
      body.position.y = Math.sin(t * 2) * 0.025;
      // Right arm waves; left arm swings gently.
      armR.shoulder.rotation.z = 2.5 + Math.sin(t * 4) * 0.22;
      armR.elbow.rotation.z = 0.35 + Math.sin(t * 4 + 0.6) * 0.25;
      armL.shoulder.rotation.z = -0.12;
      armL.shoulder.rotation.x = Math.sin(t * 1.2) * 0.15;
      armL.elbow.rotation.x = -0.25;
      head.rotation.y = Math.sin(t * 0.6) * 0.3;
      head.rotation.z = Math.sin(t * 0.9) * 0.05;
      const blink = (t % 3.2) < 0.12 ? 0.15 : 1;
      eyes.forEach((e) => { e.scale.y = blink; });
      core.scale.setScalar(1 + Math.sin(t * 3) * 0.08);
      tip.material = Math.sin(t * 2.5) > 0 ? m.ledCopper : m.ledOff;
    },
  };
}
