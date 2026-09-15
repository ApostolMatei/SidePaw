import { useId } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import type { Activity, Species } from './pet'
import './critter.css'

// Sticker-style vector rig. Every species uses the same layer order so one set of
// CSS animations drives all of them: far legs → tail → body → near legs → head.
// Coordinates live in a 160×130 view box, ground at y = 122, facing right.

export const INK = '#3a2a22'
const SW = 2.4
const BLUSH = '#f47c8a'
const MOUTH = '#7a2e33'
const TONGUE = '#f28a96'

// Face adds a 'sad' look on top of the activities; the rig itself only cares about poses.
type Face = Activity | 'sad'
type A = { a: Face }
type Pt = [number, number]

const origin = (x: number, y: number): CSSProperties => ({ transformOrigin: `${x}px ${y}px` })

const line = { stroke: INK, strokeWidth: SW, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

/** Scalloped blob around an ellipse — fluffy fur outlines. */
function cloud(cx: number, cy: number, rx: number, ry: number, n: number, bump: number, rot = 0): string {
  const at = (t: number, k: number): Pt => [cx + Math.cos(t) * (rx + k), cy + Math.sin(t) * (ry + k)]
  const step = (Math.PI * 2) / n
  const p0 = at(rot, 0)
  let d = `M${p0[0].toFixed(2)} ${p0[1].toFixed(2)}`
  for (let i = 0; i < n; i++) {
    const c = at(rot + step * (i + 0.5), bump * 2)
    const p = at(rot + step * (i + 1), 0)
    d += ` Q${c[0].toFixed(2)} ${c[1].toFixed(2)} ${p[0].toFixed(2)} ${p[1].toFixed(2)}`
  }
  return d + 'Z'
}

/** Leg with ink outline and a lighter paw tip. */
function Leg({
  x,
  y,
  w,
  h,
  fill,
  paw,
  cls
}: {
  x: number
  y: number
  w: number
  h: number
  fill: string
  paw?: string
  cls: string
}): JSX.Element {
  return (
    <g className={`leg ${cls}`} style={origin(x + w / 2, y + 3)}>
      <rect x={x} y={y} width={w} height={h} rx={w / 2} fill={fill} {...line} />
      {paw && <path d={`M${x + 1.6} ${y + h - 6} h${w - 3.2} v2 a${w / 2 - 1.6} 4 0 0 1 -${w - 3.2} 0z`} fill={paw} />}
      <path d={`M${x + w * 0.38} ${y + h - 1.5} v-2.6 M${x + w * 0.62} ${y + h - 1.5} v-2.6`} {...line} strokeWidth={1.1} opacity={0.5} />
    </g>
  )
}

/** Thick tail drawn as an outlined stroke. */
function StrokeTail({ d, fill, w, children }: { d: string; fill: string; w: number; children?: ReactNode }): JSX.Element {
  return (
    <>
      <path d={d} stroke={INK} strokeWidth={w + SW * 2} strokeLinecap="round" fill="none" />
      <path d={d} stroke={fill} strokeWidth={w} strokeLinecap="round" fill="none" />
      {children}
    </>
  )
}

function Eyes({ a, cx, cy, gap, r }: A & { cx: number; cy: number; gap: number; r: number }): JSX.Element {
  const xs = [cx - gap, cx + gap]
  if (a === 'sleep') {
    return (
      <g {...line} strokeWidth={2.2} fill="none">
        {xs.map((x) => (
          <path key={x} d={`M${x - r} ${cy} q${r} ${r * 0.95} ${r * 2} 0`} />
        ))}
      </g>
    )
  }
  if (a === 'happy' || a === 'eat') {
    return (
      <g {...line} strokeWidth={2.4} fill="none">
        {xs.map((x) => (
          <path key={x} d={`M${x - r} ${cy + r * 0.45} q${r} ${-r * 1.5} ${r * 2} 0`} />
        ))}
      </g>
    )
  }
  if (a === 'no') {
    return (
      <g {...line} strokeWidth={2.4} fill="none">
        <path d={`M${xs[0] - r} ${cy - r * 0.5} l${r * 1.8} ${r * 0.7} l${-r * 1.8} ${r * 0.7}`} />
        <path d={`M${xs[1] + r} ${cy - r * 0.5} l${-r * 1.8} ${r * 0.7} l${r * 1.8} ${r * 0.7}`} />
      </g>
    )
  }
  if (a === 'drag' || a === 'fall') {
    return (
      <g>
        {xs.map((x) => (
          <g key={x}>
            <circle cx={x} cy={cy} r={r * 1.15} fill="#fff" stroke={INK} strokeWidth={1.8} />
            <circle className="pupil" cx={x} cy={cy + 0.4} r={r * 0.5} fill={INK} />
          </g>
        ))}
      </g>
    )
  }
  return (
    <g>
      {a === 'sad' && (
        <g {...line} strokeWidth={2} fill="none">
          <path d={`M${xs[0] - r * 1.2} ${cy - r * 1.75} L${xs[0] + r * 0.9} ${cy - r * 2.35}`} />
          <path d={`M${xs[1] + r * 1.2} ${cy - r * 1.75} L${xs[1] - r * 0.9} ${cy - r * 2.35}`} />
        </g>
      )}
    <g className="eyes">
      <g className="look">
        {xs.map((x) => (
          <g key={x}>
            <ellipse cx={x} cy={cy} rx={r} ry={r * 1.2} fill={INK} />
            <ellipse cx={x} cy={cy + r * 0.52} rx={r * 0.6} ry={r * 0.36} fill="#8a6450" opacity={0.55} />
            <circle cx={x + r * 0.3} cy={cy - r * 0.42} r={r * 0.42} fill="#fff" />
            <circle cx={x - r * 0.38} cy={cy + r * 0.38} r={r * 0.17} fill="#fff" />
          </g>
        ))}
      </g>
    </g>
    </g>
  )
}

function Mouth({ a, cx, cy, s = 1 }: A & { cx: number; cy: number; s?: number }): JSX.Element {
  if (a === 'happy') {
    return (
      <g>
        <path d={`M${cx - 5 * s} ${cy - 1} q${5 * s} ${9 * s} ${10 * s} 0z`} fill={MOUTH} {...line} strokeWidth={1.5} />
        <ellipse cx={cx} cy={cy + 3.6 * s} rx={2.8 * s} ry={1.7 * s} fill={TONGUE} />
      </g>
    )
  }
  if (a === 'eat') return <ellipse className="chew" cx={cx} cy={cy + 1} rx={3 * s} ry={2.4 * s} fill={MOUTH} {...line} strokeWidth={1.3} />
  if (a === 'drag' || a === 'fall') return <ellipse cx={cx} cy={cy + 1.5} rx={2.4 * s} ry={3.2 * s} fill={MOUTH} {...line} strokeWidth={1.4} />
  if (a === 'sleep') return <path d={`M${cx - 2.5} ${cy + 1} q2.5 1.6 5 0`} {...line} strokeWidth={1.4} fill="none" />
  if (a === 'sad') return <path d={`M${cx - 4 * s} ${cy + 2.2} q${4 * s} ${-3.6 * s} ${8 * s} 0`} {...line} strokeWidth={1.6} fill="none" />
  if (a === 'no') return <path d={`M${cx - 3.5 * s} ${cy + 1.2} h${7 * s}`} {...line} strokeWidth={1.6} />
  return <path d={`M${cx - 4.5 * s} ${cy} q${2.25 * s} ${2.8 * s} ${4.5 * s} 0 q${2.25 * s} ${2.8 * s} ${4.5 * s} 0`} {...line} strokeWidth={1.6} fill="none" />
}

function Blush({ xs, y, rx = 5, ry = 3 }: { xs: number[]; y: number; rx?: number; ry?: number }): JSX.Element {
  return (
    <g className="blush">
      {xs.map((x) => (
        <ellipse key={x} cx={x} cy={y} rx={rx} ry={ry} fill={BLUSH} opacity={0.38} />
      ))}
    </g>
  )
}

/* ---------------------------------------------------------------- Cat (Miso) */

export interface CatVariant {
  fur: string
  shade: string
  cream: string
  stripe: string
}

// Coat palettes for collectible cats, from common to mythic.
export const CAT_VARIANTS = {
  classic: { fur: '#f6a350', shade: '#e2803a', cream: '#ffecd4', stripe: '#d56f2b' },
  silver: { fur: '#b3b6c2', shade: '#8e929f', cream: '#f1f2f6', stripe: '#737887' },
  tuxedo: { fur: '#48444c', shade: '#322f36', cream: '#fbfaf7', stripe: '#48444c' },
  nebula: { fur: '#9076f2', shade: '#6d52d8', cream: '#ece4ff', stripe: '#5b40c6' },
  sunfire: { fur: '#ffd04d', shade: '#f2a72b', cream: '#fff7da', stripe: '#ea8d1b' }
} satisfies Record<string, CatVariant>

function Cat({ a, uid, v = CAT_VARIANTS.classic }: A & { uid: string; v?: CatVariant }): JSX.Element {
  const FUR = v.fur
  const SHADE = v.shade
  const CREAM = v.cream
  const STRIPE = v.stripe
  const EAR = '#f7a3ac'
  const body = 'M40 100 C40 81 58 75 78 75 C98 75 110 85 109 101 C108 115 94 119 74 119 C52 119 40 114 40 100Z'
  const head =
    'M108 38 C128 38 141 50 141 66 C141 74 139 79 136 83 L142 86 L133 88 C126 93 117 95 108 95 C99 95 90 93 83 88 L74 86 L80 83 C77 79 75 74 75 66 C75 50 88 38 108 38Z'
  const tail = 'M46 99 C30 99 18 90 18 74 C18 60 26 53 33 45'
  return (
    <>
      <defs>
        <clipPath id={`${uid}b`}>
          <path d={body} />
        </clipPath>
        <clipPath id={`${uid}h`}>
          <path d={head} />
        </clipPath>
      </defs>
      <Leg cls="leg-b" x={52} y={100} w={12} h={22} fill={SHADE} paw={CREAM} />
      <Leg cls="leg-a" x={92} y={100} w={12} h={22} fill={SHADE} paw={CREAM} />
      <g className="tail" style={origin(46, 99)}>
        <StrokeTail d={tail} fill={FUR} w={8.5}>
          <path d={tail} stroke={STRIPE} strokeWidth={8.5} strokeDasharray="3 8" strokeDashoffset={-14} fill="none" opacity={0.75} />
          <path d="M22.5 58 C25 52 29 48 33 45" stroke={CREAM} strokeWidth={8.5} strokeLinecap="round" fill="none" />
        </StrokeTail>
      </g>
      <path d={body} fill={FUR} {...line} />
      <g clipPath={`url(#${uid}b)`}>
        <ellipse cx={72} cy={123} rx={44} ry={11} fill={SHADE} opacity={0.55} />
        <ellipse cx={99} cy={106} rx={10} ry={13} fill={CREAM} />
        <path d="M60 76 q-2.5 6 0 12 M70 75 q-2.5 6 0 11 M50 80 q-2 5 0 9" stroke={STRIPE} strokeWidth={3} strokeLinecap="round" fill="none" />
      </g>
      <Leg cls="leg-a" x={43} y={103} w={13} h={20} fill={FUR} paw={CREAM} />
      <Leg cls="leg-b" x={84} y={103} w={13} h={20} fill={FUR} paw={CREAM} />
      <path d="M40 106 C38 94 46 88 55 90 C63 92 66 102 62 110" fill={FUR} {...line} />

      <g className="head" style={origin(100, 92)}>
        <g className="ear ear-l" style={origin(90, 50)}>
          <path d="M80 58 L80 31 Q81 24 87 28 L103 43Z" fill={FUR} {...line} />
          <path d="M85 50 L85.5 35 L97 45Z" fill={EAR} />
        </g>
        <g className="ear ear-r" style={origin(126, 50)}>
          <path d="M113 43 L129 28 Q135 24 136 31 L136 58Z" fill={FUR} {...line} />
          <path d="M119 45 L130.5 35 L131 50Z" fill={EAR} />
        </g>
        <path d={head} fill={FUR} {...line} />
        <g clipPath={`url(#${uid}h)`}>
          <ellipse cx={108} cy={101} rx={36} ry={12} fill={SHADE} opacity={0.4} />
          <ellipse cx={95} cy={47} rx={10} ry={5} fill="#fff" opacity={0.2} transform="rotate(-24 95 47)" />
          <ellipse cx={108} cy={80} rx={14} ry={9.5} fill={CREAM} />
        </g>
        <path d="M108 40 v8 M100.5 41.5 l1.8 6 M115.5 41.5 l-1.8 6" stroke={STRIPE} strokeWidth={2.8} strokeLinecap="round" />
        <Eyes a={a} cx={108} cy={65} gap={12.5} r={5.3} />
        <Blush xs={[88.5, 127.5]} y={77} />
        <path d="M104 73.5 h8 q0 3.2 -4 5 q-4 -1.8 -4 -5z" fill="#e8737f" {...line} strokeWidth={1.3} />
        <Mouth a={a} cx={108} cy={80.5} />
        <g stroke={INK} strokeWidth={1.1} strokeLinecap="round" opacity={0.45}>
          <path d="M91 79 L77 76.5 M91 82.5 L78 83.5 M125 79 L139 76.5 M125 82.5 L138 83.5" />
        </g>
      </g>
      {a === 'eat' && <Bowl />}
    </>
  )
}

function Bowl(): JSX.Element {
  return (
    <g className="prop">
      <ellipse cx={137} cy={111} rx={16} ry={4} fill="#b77945" {...line} strokeWidth={1.8} />
      <circle cx={131} cy={109.5} r={2.2} fill="#8f5a33" />
      <circle cx={138} cy={108.8} r={2.2} fill="#9c6337" />
      <circle cx={144} cy={110} r={2} fill="#8f5a33" />
      <path d="M120 111 h34 l-4.5 11 h-25z" fill="#6f8ff2" {...line} strokeWidth={2} />
      <path d="M124 115.5 h26" stroke="#fff" strokeWidth={2} strokeLinecap="round" opacity={0.45} />
    </g>
  )
}

/* ---------------------------------------------------------------- Bichon */

function Bichon({ a }: A): JSX.Element {
  const W = '#fffdf7'
  const S = '#ece2d2'
  const EAR = '#f0e1c9'
  return (
    <>
      <Leg cls="leg-b" x={54} y={104} w={12} h={18} fill={S} />
      <Leg cls="leg-a" x={90} y={104} w={12} h={18} fill={S} />
      <g className="tail" style={origin(46, 96)}>
        <path d={cloud(38, 80, 10, 11, 8, 2.2)} fill={W} {...line} />
        <path d={cloud(40, 83, 4, 4, 5, 1.3)} fill={S} opacity={0.7} />
      </g>
      <path d={cloud(72, 101, 32, 17, 13, 2.8)} fill={W} {...line} />
      <path d="M50 113 q20 6 44 0" stroke={S} strokeWidth={5} strokeLinecap="round" fill="none" opacity={0.8} />
      <Leg cls="leg-a" x={45} y={106} w={13} h={17} fill={W} />
      <Leg cls="leg-b" x={82} y={106} w={13} h={17} fill={W} />

      <g className="head" style={origin(104, 92)}>
        <g className="ear ear-l" style={origin(84, 60)}>
          <path d={cloud(83, 78, 8.5, 16, 9, 2)} fill={EAR} {...line} />
        </g>
        <g className="ear ear-r" style={origin(133, 60)}>
          <path d={cloud(133, 78, 8.5, 16, 9, 2)} fill={EAR} {...line} />
        </g>
        <path d={cloud(108, 45, 15, 9, 8, 2.6, 0.3)} fill={W} {...line} />
        <path d={cloud(108, 69, 26, 24, 15, 2.6)} fill={W} {...line} />
        <ellipse cx={108} cy={81} rx={11} ry={7.5} fill="#f5ede0" />
        <g className="bow" style={origin(108, 36)}>
          <path d="M108 36 L96 29 Q93 36 96 43Z M108 36 L120 29 Q123 36 120 43Z" fill="#ff7f9d" {...line} strokeWidth={2} />
          <circle cx={108} cy={36} r={3.4} fill="#ff5c86" {...line} strokeWidth={1.8} />
        </g>
        <Eyes a={a} cx={108} cy={67} gap={10.5} r={4.9} />
        <Blush xs={[92, 124]} y={77} rx={4.5} />
        <ellipse cx={108} cy={77} rx={4.6} ry={3.5} fill={INK} />
        <ellipse cx={106.6} cy={75.8} rx={1.5} ry={0.9} fill="#fff" opacity={0.8} />
        <Mouth a={a} cx={108} cy={83} s={0.9} />
      </g>
      {a === 'eat' && <Bowl />}
    </>
  )
}

/* ---------------------------------------------------------------- Labrador */

function Labrador({ a, uid }: A & { uid: string }): JSX.Element {
  const Y = '#eab873'
  const D = '#cf944c'
  const L = '#f8dfb3'
  const body = 'M34 96 C34 80 54 75 76 75 C98 75 113 83 113 98 C113 112 99 117 76 117 C51 117 34 112 34 96Z'
  const head = 'M110 37 C126 37 137 48 137 62 C137 76 126 86 110 86 C94 86 83 76 83 62 C83 48 94 37 110 37Z'
  return (
    <>
      <defs>
        <clipPath id={`${uid}b`}>
          <path d={body} />
        </clipPath>
      </defs>
      <Leg cls="leg-b" x={48} y={98} w={12} h={24} fill={D} />
      <Leg cls="leg-a" x={94} y={98} w={12} h={24} fill={D} />
      <g className="tail" style={origin(40, 94)}>
        <StrokeTail d="M40 94 C27 90 19 80 17 66" fill={Y} w={7.5} />
      </g>
      <path d={body} fill={Y} {...line} />
      <g clipPath={`url(#${uid}b)`}>
        <ellipse cx={74} cy={121} rx={46} ry={11} fill={D} opacity={0.5} />
        <ellipse cx={62} cy={80} rx={22} ry={4} fill="#fff" opacity={0.2} />
      </g>
      <Leg cls="leg-a" x={39} y={101} w={13} h={22} fill={Y} />
      <Leg cls="leg-b" x={86} y={101} w={13} h={22} fill={Y} />
      <path d={`M${90} ${84} Q110 97 130 84`} stroke={INK} strokeWidth={9} strokeLinecap="round" fill="none" />
      <path d={`M${90} ${84} Q110 97 130 84`} stroke="#e5484d" strokeWidth={4.6} strokeLinecap="round" fill="none" />

      <g className="head" style={origin(106, 90)}>
        <path d={head} fill={Y} {...line} />
        <ellipse cx={100} cy={46} rx={9} ry={4.5} fill="#fff" opacity={0.22} transform="rotate(-20 100 46)" />
        <g className="ear ear-l" style={origin(88, 46)}>
          <path d="M90 43 C77 42 72 58 75 73 C77 81 86 81 88 74 C90 64 95 52 90 43Z" fill={D} {...line} />
        </g>
        <g className="ear ear-r" style={origin(132, 46)}>
          <path d="M130 43 C143 42 148 58 145 73 C143 81 134 81 132 74 C130 64 125 52 130 43Z" fill={D} {...line} />
        </g>
        {a !== 'sleep' && a !== 'sad' && a !== 'no' && <path d="M96 52 q4 -3 8 -1 M116 51 q4 -2 8 1" stroke={D} strokeWidth={2.4} strokeLinecap="round" fill="none" />}
        <Eyes a={a} cx={110} cy={60} gap={11} r={4.7} />
        <path d="M97 77 C97 69 103 66 110 66 C117 66 124 69 124 77 C124 85 117 88 110 88 C103 88 97 85 97 77Z" fill={L} {...line} />
        <Blush xs={[92, 128]} y={73} rx={4.5} />
        <ellipse cx={110} cy={71.5} rx={5.8} ry={4.1} fill={INK} />
        <ellipse cx={108.2} cy={70.2} rx={2} ry={1.1} fill="#fff" opacity={0.75} />
        <path d="M110 75.5 v3" {...line} strokeWidth={1.4} />
        {a === 'happy' ? (
          <g>
            <path d="M103 79 q7 9 14 0z" fill={MOUTH} {...line} strokeWidth={1.5} />
            <path d="M107 83 h7 v5 a3.5 3.5 0 0 1 -7 0z" fill={TONGUE} {...line} strokeWidth={1.4} />
          </g>
        ) : (
          <Mouth a={a} cx={110} cy={79} />
        )}
      </g>
      <circle cx={110} cy={94} r={3.8} fill="#f5c542" {...line} strokeWidth={1.8} />
      {a === 'eat' && <Bowl />}
    </>
  )
}

/* ---------------------------------------------------------------- Gorilla */

function Gorilla({ a, uid }: A & { uid: string }): JSX.Element {
  const G = '#5a5864'
  const GD = '#403e48'
  const SILVER = '#a4a2b0'
  const FACE = '#b09c90'
  const body = 'M28 106 C26 88 42 74 64 67 C84 61 108 60 118 74 C126 88 120 112 102 117 L62 118 C42 118 29 115 28 106Z'
  const arm = 'M100 68 C114 65 124 74 123 88 L121 110 C121 117 117 122 110 122 L103 122 C96 122 93 117 94 111 L96 88 C94 76 94 70 100 68Z'
  return (
    <>
      <defs>
        <clipPath id={`${uid}b`}>
          <path d={body} />
        </clipPath>
      </defs>
      <Leg cls="leg-b" x={34} y={101} w={16} h={21} fill={GD} />
      <g className="leg leg-b arm" style={origin(90, 76)}>
        <rect x={81} y={72} width={18} height={50} rx={9} fill={GD} {...line} />
      </g>
      <path d={body} fill={G} {...line} />
      <g clipPath={`url(#${uid}b)`}>
        <path d="M30 90 C38 70 66 62 92 66 C86 78 58 88 30 90Z" fill={SILVER} opacity={0.6} />
        <ellipse cx={72} cy={124} rx={50} ry={12} fill={GD} opacity={0.6} />
      </g>
      <Leg cls="leg-a" x={46} y={103} w={18} h={20} fill={G} />
      <path d="M28 108 C26 96 36 90 46 92 C56 94 60 104 56 112" fill={G} {...line} />
      <g className="leg leg-a arm" style={origin(108, 76)}>
        <path d={arm} fill={G} {...line} />
        <path d="M101 85 C104 80 112 79 116 82" stroke="#fff" strokeWidth={2.2} strokeLinecap="round" fill="none" opacity={0.18} />
        <path d="M96 115 C100 118 116 118 121 115" stroke={FACE} strokeWidth={3.2} strokeLinecap="round" fill="none" />
      </g>

      <g className="head" style={origin(114, 84)}>
        <circle cx={99} cy={60} r={5.5} fill={FACE} {...line} />
        <circle cx={145} cy={60} r={5.5} fill={FACE} {...line} />
        <ellipse cx={122} cy={36} rx={12} ry={9} fill={G} {...line} />
        <path d="M122 32 C138 32 146 45 146 60 C146 76 135 85 122 85 C109 85 98 76 98 60 C98 45 106 32 122 32Z" fill={G} {...line} />
        <path d="M122 49 C129 42 142 45 142 59 C142 74 133 82 122 82 C111 82 102 74 102 59 C102 45 115 42 122 49Z" fill={FACE} {...line} strokeWidth={1.8} />
        <ellipse cx={110} cy={70} rx={4} ry={2.5} fill="#fff" opacity={0.18} />
        <path d="M104 53 Q113 45.5 122 52 Q131 45.5 140 53" stroke={GD} strokeWidth={5} strokeLinecap="round" fill="none" />
        <Eyes a={a} cx={122} cy={59.5} gap={8.5} r={3.9} />
        <ellipse cx={122} cy={69.5} rx={8.5} ry={5.2} fill="#927e73" />
        <ellipse cx={119} cy={69.5} rx={1.8} ry={1.4} fill={INK} />
        <ellipse cx={125} cy={69.5} rx={1.8} ry={1.4} fill={INK} />
        <Blush xs={[107, 137]} y={68} rx={3.8} ry={2.5} />
        <Mouth a={a} cx={122} cy={76.5} s={0.9} />
      </g>
      {a === 'eat' && <Banana />}
    </>
  )
}

function Banana(): JSX.Element {
  return (
    <g className="prop">
      <path d="M122 112 q14 8 28 -8 q2 13 -14 17 q-10 2 -14 -9z" fill="#f7d44c" {...line} strokeWidth={2} />
      <path d="M126 114 q10 3 20 -6" stroke="#e0b62d" strokeWidth={2} strokeLinecap="round" fill="none" />
      <path d="M150 104 l3 -4" {...line} strokeWidth={2.6} />
    </g>
  )
}

/* ---------------------------------------------------------------- Rig */

const BODIES: Record<Species, (p: A & { uid: string; v?: CatVariant }) => JSX.Element> = {
  cat: Cat,
  bichon: Bichon,
  labrador: Labrador,
  gorilla: Gorilla
}

export default function Critter({
  species,
  activity,
  variant,
  sad = false
}: {
  species: Species
  activity: Activity
  variant?: CatVariant
  sad?: boolean
}): JSX.Element {
  const face: Face = activity === 'dance' ? 'happy' : sad && (activity === 'idle' || activity === 'walk') ? 'sad' : activity
  const uid = 'c' + useId().replace(/[^a-zA-Z0-9]/g, '')
  const Body = BODIES[species] ?? Cat
  return (
    <svg className={`pet-svg ${species}`} viewBox="0 0 160 130">
      <ellipse className="shadow" cx={78} cy={123} rx={46} ry={5} fill="rgba(40,24,12,.2)" />
      <g className="critter">
        <Body a={face} uid={uid} v={variant} />
      </g>
    </svg>
  )
}
