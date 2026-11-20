/**
 * Original line illustrations: navy lines, pale-blue fills, amber highlights.
 * - Lines use currentColor, so the same drawing works on light and dark backgrounds.
 * - Copper highlights use --illo-accent; soft fills use --illo-fill.
 * - Pass `title` when the drawing carries meaning (role="img"); omit it for decoration.
 * These stand in for photography until real, consented photos are supplied.
 */
import type { ReactNode } from 'react';

type P = { title?: string; className?: string };

function Svg({ title, className, viewBox = '0 0 240 180', children }: P & { viewBox?: string; children: ReactNode }) {
  return (
    <svg
      viewBox={viewBox}
      className={`illo ${className ?? ''}`}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

const A = 'var(--illo-accent)';
const F = 'var(--illo-fill)';

/** Hero fallback: isometric circuit board with a robot arm. Mirrors the 3D scene. */
export function RobotArmIllustration({ title, className }: P) {
  return (
    <Svg title={title} className={className} viewBox="0 0 600 460">
      {/* board */}
      <path d="M20 320 L300 440 L580 320 L580 334 L300 454 L20 334 Z" fill="#a9c4e6" stroke="#a9c4e6" strokeWidth={3} />
      <path d="M300 190 L580 320 L300 440 L20 320 Z" fill="#dcecff" stroke="#b7cfee" strokeWidth={3} />
      {/* traces */}
      <g stroke="#3b8cf0" strokeWidth={3} opacity={0.9}>
        <polyline points="90,320 170,283 230,311 290,283" />
        <polyline points="150,360 230,323 300,355 360,327" />
        <polyline points="380,250 450,282 400,305 470,337" />
        <polyline points="420,380 360,352 430,320 510,357" />
        <polyline points="200,250 260,278 210,301" />
      </g>
      <g fill="#f0a83a" stroke="none">
        {[[90, 320], [290, 283], [150, 360], [360, 327], [380, 250], [470, 337], [420, 380], [510, 357], [200, 250], [210, 301]].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={6} />
        ))}
      </g>
      {/* chip */}
      <path d="M430 265 L480 288 L450 302 L400 279 Z" fill="#14233a" stroke="#b8c2cf" strokeWidth={1.5} />
      {/* LEDs */}
      <circle cx="130" cy="330" r="5" fill="#1fa2ff" stroke="none" />
      <circle cx="145" cy="337" r="5" fill="#1fa2ff" stroke="none" opacity={0.5} />
      {/* silkscreen ring */}
      <ellipse cx="320" cy="318" rx="86" ry="40" stroke="#134074" strokeDasharray="8 6" strokeWidth={1.5} opacity={0.6} />
      {/* arm: base */}
      <ellipse cx="320" cy="312" rx="58" ry="26" fill="#1e3a5f" stroke="#1e3a5f" />
      <path d="M262 300 L262 312 A58 26 0 0 0 378 312 L378 300" fill="#1e3a5f" stroke="#1e3a5f" />
      <ellipse cx="320" cy="300" rx="58" ry="26" fill="#2b4c78" stroke="#3b8cf0" strokeWidth={2} />
      <ellipse cx="320" cy="292" rx="40" ry="18" fill="#ffffff" stroke="#1e3a5f" />
      {/* lower arm */}
      <line x1="320" y1="285" x2="270" y2="140" stroke="#1e3a5f" strokeWidth={40} />
      <line x1="320" y1="285" x2="270" y2="140" stroke="#ffffff" strokeWidth={34} />
      <line x1="312" y1="262" x2="278" y2="164" stroke="#3b8cf0" strokeWidth={3} />
      <circle cx="320" cy="285" r="22" fill="#1e3a5f" stroke="#1e3a5f" />
      {/* upper arm */}
      <line x1="270" y1="140" x2="170" y2="190" stroke="#1e3a5f" strokeWidth={32} />
      <line x1="270" y1="140" x2="170" y2="190" stroke="#ffffff" strokeWidth={26} />
      <circle cx="270" cy="140" r="20" fill="#1e3a5f" stroke="#1e3a5f" />
      {/* wrist + gripper */}
      <circle cx="170" cy="190" r="14" fill="#1e3a5f" stroke="#1e3a5f" />
      <rect x="150" y="200" width="40" height="14" rx="4" fill="#ffffff" stroke="#1e3a5f" />
      <rect x="152" y="212" width="8" height="34" rx="3" fill="#1e3a5f" stroke="#1e3a5f" />
      <rect x="180" y="212" width="8" height="34" rx="3" fill="#1e3a5f" stroke="#1e3a5f" />
      <circle cx="170" cy="222" r="3.5" fill="#1fa2ff" stroke="none" />
      {/* component being placed */}
      <rect x="160" y="248" width="20" height="10" rx="2" fill="#14233a" stroke="#b8c2cf" strokeWidth={1.2} />
      {/* signal pulses */}
      <circle cx="230" cy="311" r="5" fill="#ffb547" stroke="none" />
      <circle cx="450" cy="282" r="5" fill="#ffb547" stroke="none" />
    </Svg>
  );
}

export function NeuralNetIllustration(p: P) {
  const l1 = [50, 90, 130];
  const l2 = [30, 70, 110, 150];
  const l3 = [70, 110];
  return (
    <Svg {...p}>
      <g strokeWidth={1.2} opacity={0.55}>
        {l1.map((a) => l2.map((b) => <line key={`a${a}${b}`} x1={50} y1={a} x2={120} y2={b} />))}
        {l2.map((a) => l3.map((b) => <line key={`b${a}${b}`} x1={120} y1={a} x2={190} y2={b} />))}
      </g>
      <line x1={50} y1={90} x2={120} y2={70} stroke={A} strokeWidth={2.5} />
      <line x1={120} y1={70} x2={190} y2={110} stroke={A} strokeWidth={2.5} />
      {l1.map((y) => <circle key={`n1${y}`} cx={50} cy={y} r={10} fill={F} />)}
      {l2.map((y) => <circle key={`n2${y}`} cx={120} cy={y} r={10} fill={F} />)}
      {l3.map((y) => <circle key={`n3${y}`} cx={190} cy={y} r={10} fill={F} />)}
      <circle cx={50} cy={90} r={10} fill={A} stroke={A} />
      <circle cx={120} cy={70} r={10} fill={A} stroke={A} />
      <circle cx={190} cy={110} r={10} fill={A} stroke={A} />
    </Svg>
  );
}

export function RobotCarIllustration(p: P) {
  return (
    <Svg {...p}>
      <rect x="40" y="80" width="150" height="46" rx="10" fill={F} />
      <rect x="70" y="60" width="80" height="26" rx="4" />
      <g strokeWidth={1.5}>{[78, 88, 98, 108, 118, 128, 138].map((x) => <line key={x} x1={x} y1={60} x2={x} y2={54} />)}</g>
      <rect x="84" y="68" width="22" height="12" rx="2" fill={A} stroke={A} />
      {/* ultrasonic eyes */}
      <rect x="188" y="88" width="16" height="30" rx="4" />
      <circle cx="210" cy="96" r="7" fill={F} />
      <circle cx="210" cy="112" r="7" fill={F} />
      {/* wheels */}
      <circle cx="72" cy="132" r="22" fill={F} />
      <circle cx="72" cy="132" r="8" />
      <circle cx="160" cy="132" r="22" fill={F} />
      <circle cx="160" cy="132" r="8" />
      {/* wire */}
      <path d="M150 66 C 175 40, 195 60, 196 86" stroke={A} />
      {/* track */}
      <line x1="10" y1="160" x2="230" y2="160" strokeDasharray="10 8" opacity={0.6} />
    </Svg>
  );
}

export function CircuitIllustration(p: P) {
  return (
    <Svg {...p}>
      <rect x="30" y="45" width="180" height="110" rx="10" fill={F} />
      <rect x="18" y="80" width="22" height="26" rx="3" />
      <rect x="95" y="80" width="56" height="40" rx="4" />
      <g strokeWidth={1.5}>
        {[100, 110, 120, 130, 140].map((x) => <line key={`t${x}`} x1={x} y1={80} x2={x} y2={74} />)}
        {[100, 110, 120, 130, 140].map((x) => <line key={`b${x}`} x1={x} y1={120} x2={x} y2={126} />)}
      </g>
      <g>{[60, 72, 84, 96, 108, 120, 132, 144, 156, 168, 180].map((x) => <rect key={x} x={x - 4} y={52} width={8} height={8} rx={1} />)}</g>
      <polyline points="151,100 175,100 175,135 195,135" stroke={A} />
      <polyline points="40,93 70,93 70,110 95,110" stroke={A} />
      <circle cx="195" cy="135" r="5" fill={A} stroke={A} />
      <circle cx="58" cy="138" r="6" fill="var(--illo-led)" stroke="var(--illo-led)" />
      {/* wireless */}
      <path d="M182 30 a 14 14 0 0 1 20 0" />
      <path d="M176 22 a 22 22 0 0 1 32 0" opacity={0.7} />
      <line x1="192" y1="36" x2="192" y2="45" />
    </Svg>
  );
}

export function DroneIllustration(p: P) {
  const rotors: [number, number][] = [[55, 52], [185, 52], [55, 128], [185, 128]];
  return (
    <Svg {...p}>
      {rotors.map(([x, y]) => <line key={`arm${x}${y}`} x1={120} y1={90} x2={x} y2={y} strokeWidth={5} />)}
      {rotors.map(([x, y]) => (
        <g key={`r${x}${y}`}>
          <ellipse cx={x} cy={y} rx={34} ry={9} fill={F} opacity={0.9} />
          <circle cx={x} cy={y} r={7} fill={A} stroke={A} />
        </g>
      ))}
      <rect x="92" y="74" width="56" height="34" rx="12" fill={F} />
      <circle cx="120" cy="118" r="9" />
      <circle cx="120" cy="118" r="3.5" fill="currentColor" />
      <circle cx="104" cy="84" r="3" fill="var(--illo-led)" stroke="var(--illo-led)" />
    </Svg>
  );
}

export function CodeIllustration(p: P) {
  const lines: [number, number, boolean?][] = [[0, 70], [16, 96, true], [16, 60], [32, 84], [16, 40, true], [0, 30]];
  return (
    <Svg {...p}>
      <rect x="25" y="28" width="190" height="128" rx="10" fill={F} />
      <line x1="25" y1="50" x2="215" y2="50" />
      {[40, 52, 64].map((x) => <circle key={x} cx={x} cy={39} r={3.5} />)}
      {lines.map(([indent, len, hot], i) => (
        <line key={i} x1={45 + indent} y1={68 + i * 14} x2={45 + indent + len} y2={68 + i * 14} stroke={hot ? A : 'currentColor'} strokeWidth={4} />
      ))}
      <line x1="85" y1="140" x2="85" y2="152" stroke={A} strokeWidth={2.5} />
    </Svg>
  );
}

export function PrinterIllustration(p: P) {
  return (
    <Svg {...p}>
      <rect x="40" y="30" width="160" height="130" rx="6" />
      <line x1="40" y1="60" x2="200" y2="60" strokeWidth={4} />
      <path d="M112 60 L128 60 L124 74 L116 74 Z" fill={A} stroke={A} />
      <line x1="120" y1="74" x2="120" y2="84" stroke={A} />
      {/* printed object, layer by layer */}
      {[0, 1, 2, 3, 4, 5].map((i) => <line key={i} x1={98 + i * 1.5} y1={130 - i * 7} x2={142 - i * 1.5} y2={130 - i * 7} strokeWidth={4} opacity={1 - i * 0.08} />)}
      <rect x="70" y="134" width="100" height="8" rx="2" fill={F} />
      <circle cx="215" cy="40" r="16" fill={F} />
      <circle cx="215" cy="40" r="5" />
      <path d="M200 46 C 170 60, 150 40, 128 60" stroke={A} strokeWidth={1.5} />
    </Svg>
  );
}

export function ClassroomLabIllustration(p: P) {
  return (
    <Svg {...p}>
      {/* lamp */}
      <line x1="120" y1="0" x2="120" y2="22" />
      <path d="M100 34 L140 34 L132 22 L108 22 Z" fill={F} />
      {/* bench */}
      <rect x="15" y="122" width="210" height="10" rx="3" fill={F} />
      <line x1="30" y1="132" x2="30" y2="172" /><line x1="210" y1="132" x2="210" y2="172" />
      {/* laptop */}
      <rect x="28" y="80" width="64" height="40" rx="4" fill={F} />
      <line x1="20" y1="122" x2="100" y2="122" strokeWidth={4} />
      <polyline points="38,108 52,96 64,104 82,88" stroke={A} />
      {/* robot */}
      <rect x="130" y="76" width="44" height="36" rx="8" fill={F} />
      <circle cx="144" cy="92" r="5" fill="var(--illo-led)" stroke="var(--illo-led)" />
      <circle cx="160" cy="92" r="5" fill="var(--illo-led)" stroke="var(--illo-led)" />
      <line x1="152" y1="76" x2="152" y2="64" /><circle cx="152" cy="60" r="4" fill={A} stroke={A} />
      <circle cx="138" cy="116" r="6" /><circle cx="166" cy="116" r="6" />
      {/* parts tray */}
      <rect x="186" y="106" width="34" height="14" rx="2" />
      <circle cx="195" cy="113" r="2.5" fill={A} stroke={A} /><circle cx="205" cy="113" r="2.5" /><circle cx="213" cy="113" r="2.5" fill={A} stroke={A} />
    </Svg>
  );
}

export function WorkstationIllustration(p: P) {
  return (
    <Svg {...p}>
      <rect x="20" y="24" width="120" height="80" rx="6" fill={F} />
      <polyline points="32,86 52,70 68,78 88,50 108,60 128,38" stroke={A} strokeWidth={2.5} />
      <line x1="80" y1="104" x2="80" y2="122" /><line x1="58" y1="122" x2="102" y2="122" strokeWidth={4} />
      <rect x="20" y="132" width="120" height="16" rx="3" />
      {/* oscilloscope */}
      <rect x="152" y="60" width="72" height="62" rx="6" fill={F} />
      <rect x="160" y="68" width="40" height="30" rx="2" />
      <path d="M162 84 q 5 -12 10 0 t 10 0 t 10 0 t 6 0" stroke="var(--illo-led)" />
      <circle cx="212" cy="76" r="4" /><circle cx="212" cy="92" r="4" />
      <path d="M188 122 C 188 150, 140 150, 140 140" stroke={A} />
    </Svg>
  );
}

/** Hero fallback for the "tech planet" scene: glowing core, wireframe globe, orbit rings, node network, waving robot. */
export function OrbitIllustration({ title, className }: P) {
  const nodes: [number, number][] = [
    [70, 120], [130, 60], [210, 40], [330, 30], [450, 55], [530, 110], [560, 210], [545, 330], [500, 420], [400, 480],
    [280, 490], [160, 450], [80, 380], [45, 270], [110, 220], [490, 250], [250, 110], [420, 400],
  ];
  const links: [number, number][] = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 10], [10, 11], [11, 12], [12, 13], [13, 0], [13, 14], [14, 0], [6, 15], [15, 7], [2, 16], [16, 3], [8, 17], [17, 9]];
  return (
    <svg viewBox="0 0 600 520" className={`illo ${className ?? ''}`} role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true} focusable="false" fill="none">
      <defs>
        <radialGradient id="orb-core" cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#3b82f6" />
          <stop offset="0.55" stopColor="#1d3fb8" />
          <stop offset="1" stopColor="#0a1a5c" />
        </radialGradient>
        <radialGradient id="orb-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0.55" stopColor="#3b82f6" stopOpacity="0.35" />
          <stop offset="1" stopColor="#3b82f6" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="orb-ring" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#6366f1" />
          <stop offset="1" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
      {/* network */}
      <g stroke="#60a5fa" strokeOpacity="0.25" strokeWidth="1">
        {links.map(([a, b]) => <line key={`${a}-${b}`} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} />)}
      </g>
      <g fill="#a5c4ff">{nodes.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i % 3 ? 4 : 6} opacity={0.85} />)}</g>
      {/* glow + core */}
      <circle cx="300" cy="260" r="200" fill="url(#orb-glow)" />
      <circle cx="300" cy="260" r="118" fill="url(#orb-core)" />
      {/* wireframe globe */}
      <g stroke="#8fb4ff" strokeOpacity="0.4" strokeWidth="1">
        <circle cx="300" cy="260" r="165" />
        <ellipse cx="300" cy="260" rx="165" ry="55" />
        <ellipse cx="300" cy="260" rx="165" ry="110" />
        <ellipse cx="300" cy="260" rx="55" ry="165" />
        <ellipse cx="300" cy="260" rx="110" ry="165" />
        <line x1="135" y1="260" x2="465" y2="260" />
        <line x1="300" y1="95" x2="300" y2="425" />
      </g>
      {/* orbit rings */}
      <ellipse cx="300" cy="270" rx="270" ry="92" stroke="url(#orb-ring)" strokeWidth="2.5" transform="rotate(-18 300 270)" />
      <ellipse cx="300" cy="260" rx="235" ry="140" stroke="#22d3ee" strokeOpacity="0.55" strokeWidth="1.5" transform="rotate(28 300 260)" />
      {/* riders: a gear and a drone on the rings */}
      <g transform="translate(520 175)">
        <circle r="26" fill="#8b98c9" />
        <circle r="10" fill="#0b1222" />
        {Array.from({ length: 10 }, (_, i) => <rect key={i} x="-5" y="-34" width="10" height="12" rx="2" fill="#8b98c9" transform={`rotate(${i * 36})`} />)}
      </g>
      {/* humanoid robot waving from a floating platform */}
      <g transform="translate(478 352)">
        <ellipse cx="0" cy="118" rx="62" ry="14" fill="#0b1222" stroke="#22d3ee" strokeWidth="2.5" />
        <ellipse cx="0" cy="126" rx="44" ry="8" fill="#3b82f6" opacity="0.18" />
        {/* legs */}
        <rect x="-20" y="62" width="15" height="48" rx="6" fill="#e9eef7" />
        <rect x="5" y="62" width="15" height="48" rx="6" fill="#e9eef7" />
        <rect x="-24" y="106" width="21" height="9" rx="3" fill="#1f2a44" />
        <rect x="3" y="106" width="21" height="9" rx="3" fill="#1f2a44" />
        {/* body */}
        <rect x="-30" y="0" width="60" height="66" rx="14" fill="#e9eef7" />
        <rect x="-18" y="14" width="36" height="26" rx="6" fill="#1f2a44" />
        <circle cx="0" cy="27" r="7" fill="#38bdf8" />
        <circle cx="0" cy="27" r="10" fill="none" stroke="#22d3ee" strokeWidth="1.5" />
        {/* left arm down, right arm waving */}
        <rect x="-44" y="6" width="12" height="46" rx="6" fill="#e9eef7" transform="rotate(8 -38 6)" />
        <rect x="32" y="-34" width="12" height="44" rx="6" fill="#e9eef7" transform="rotate(-28 38 8)" />
        <circle cx="52" cy="-36" r="7" fill="#1f2a44" />
        {/* head */}
        <rect x="-8" y="-8" width="16" height="10" rx="3" fill="#1f2a44" />
        <rect x="-26" y="-46" width="52" height="40" rx="13" fill="#e9eef7" />
        <rect x="-20" y="-36" width="40" height="18" rx="7" fill="#1f2a44" />
        <rect x="-13" y="-30" width="8" height="5" rx="2" fill="#38bdf8" />
        <rect x="5" y="-30" width="8" height="5" rx="2" fill="#38bdf8" />
        <line x1="0" y1="-46" x2="0" y2="-60" stroke="#1f2a44" strokeWidth="2.5" />
        <circle cx="0" cy="-62" r="4" fill="#818cf8" />
      </g>
      <g transform="translate(95 360)" stroke="#e9eef7" strokeWidth="3" strokeLinecap="round">
        <line x1="-26" y1="-12" x2="26" y2="12" /><line x1="-26" y1="12" x2="26" y2="-12" />
        <rect x="-12" y="-7" width="24" height="14" rx="4" fill="#2563eb" stroke="#e9eef7" strokeWidth="2" />
        {[[-26, -12], [26, 12], [-26, 12], [26, -12]].map(([x, y]) => <ellipse key={`${x}${y}`} cx={x} cy={y} rx="14" ry="4" stroke="#93c5fd" strokeWidth="1.5" />)}
      </g>
    </svg>
  );
}
