import { useId } from 'react'

// Shaded UI icons: gradients and highlights instead of outlines, so they read as small objects.

type P = { size?: number }

const useGid = (): ((name: string) => string) => {
  const base = 'i' + useId().replace(/[^a-zA-Z0-9]/g, '')
  return (name) => base + name
}

const EDGE = 'rgba(60, 30, 10, 0.18)'

export function Drumstick({ size = 20 }: P): JSX.Element {
  const g = useGid()
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <defs>
        <radialGradient id={g('m')} cx="0.4" cy="0.35" r="0.75">
          <stop offset="0" stopColor="#f2a55c" />
          <stop offset="0.6" stopColor="#d2762f" />
          <stop offset="1" stopColor="#a4521b" />
        </radialGradient>
        <linearGradient id={g('b')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fffdf8" />
          <stop offset="1" stopColor="#e3d6c3" />
        </linearGradient>
      </defs>
      <path d="M9.6 14.4 5.2 18.8" stroke={`url(#${g('b')})`} strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="3.9" cy="18.6" r="1.8" fill={`url(#${g('b')})`} stroke={EDGE} strokeWidth=".5" />
      <circle cx="5.4" cy="20.1" r="1.8" fill={`url(#${g('b')})`} stroke={EDGE} strokeWidth=".5" />
      <path
        d="M8.2 15.8c-2.6-2.6-2.4-7.4.9-10.6 3.3-3.2 8.3-3.2 10.4-.3 2.2 3 1.6 7.8-1.6 10.3-3.1 2.4-7.2 3.1-9.7.6z"
        fill={`url(#${g('m')})`}
        stroke={EDGE}
        strokeWidth=".6"
      />
      <path d="M11.2 6.8c1.6-1.2 3.8-1.4 5.1-.5" stroke="#ffe2c2" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity=".75" />
      <circle cx="15.8" cy="11.6" r=".7" fill="#8f4516" opacity=".45" />
      <circle cx="12.6" cy="13.4" r=".55" fill="#8f4516" opacity=".4" />
    </svg>
  )
}

export function Bowl({ size = 22 }: P): JSX.Element {
  const g = useGid()
  const kibble: [number, number, number][] = [
    [7.4, 10.6, -20],
    [10.6, 9.4, 15],
    [13.8, 9.8, -10],
    [16.8, 10.8, 25],
    [9.2, 12, 40],
    [12.4, 11.6, -35],
    [15.4, 12.1, 5]
  ]
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <defs>
        <linearGradient id={g('bowl')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7aa5ff" />
          <stop offset="1" stopColor="#3561d6" />
        </linearGradient>
        <radialGradient id={g('k')} cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#d99a5b" />
          <stop offset="1" stopColor="#8b5227" />
        </radialGradient>
      </defs>
      {kibble.map(([x, y, r]) => (
        <ellipse key={`${x}${y}`} cx={x} cy={y} rx="1.9" ry="1.4" transform={`rotate(${r} ${x} ${y})`} fill={`url(#${g('k')})`} />
      ))}
      <path d="M2.5 12.5h19l-2.2 6.4a2.4 2.4 0 0 1-2.3 1.6H7a2.4 2.4 0 0 1-2.3-1.6z" fill={`url(#${g('bowl')})`} />
      <ellipse cx="12" cy="12.6" rx="9.6" ry="1.4" fill="#a9c4ff" />
      <path d="M5.4 15.2h6" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" opacity=".45" />
    </svg>
  )
}

export function Bolt({ size = 20 }: P): JSX.Element {
  const g = useGid()
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <defs>
        <linearGradient id={g('b')} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor="#ffe36e" />
          <stop offset="1" stopColor="#ff9d0a" />
        </linearGradient>
      </defs>
      <path d="M13.8 2 4.8 13.4h6.1L9.6 22l9.6-12.1h-6.3z" fill={`url(#${g('b')})`} stroke="rgba(170, 90, 0, 0.35)" strokeWidth=".6" strokeLinejoin="round" />
      <path d="M12.6 4.6 7.9 10.6" stroke="#fff7cf" strokeWidth="1.2" strokeLinecap="round" opacity=".8" />
    </svg>
  )
}

export function Heart({ size = 20, fill }: P & { fill?: string }): JSX.Element {
  const g = useGid()
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <defs>
        <radialGradient id={g('h')} cx="0.35" cy="0.3" r="0.85">
          <stop offset="0" stopColor={fill ?? '#ff8fa6'} />
          <stop offset="1" stopColor={fill ?? '#e02d58'} />
        </radialGradient>
      </defs>
      <path d="M12 21s-8.5-5.1-8.5-11.3A4.9 4.9 0 0 1 12 6.8a4.9 4.9 0 0 1 8.5 2.9C20.5 15.9 12 21 12 21z" fill={`url(#${g('h')})`} />
      <ellipse cx="7.6" cy="9.4" rx="1.9" ry="1.2" transform="rotate(-35 7.6 9.4)" fill="#fff" opacity=".55" />
    </svg>
  )
}

export function Paw({ size = 22 }: P): JSX.Element {
  const g = useGid()
  const toes: [number, number, number][] = [
    [6, 9.6, -20],
    [9.6, 6.2, -8],
    [14.4, 6.2, 8],
    [18, 9.6, 20]
  ]
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <defs>
        <radialGradient id={g('p')} cx="0.35" cy="0.3" r="0.85">
          <stop offset="0" stopColor="#ffb3c4" />
          <stop offset="1" stopColor="#ec5a80" />
        </radialGradient>
      </defs>
      {toes.map(([x, y, r]) => (
        <ellipse key={x} cx={x} cy={y} rx="2.1" ry="2.7" transform={`rotate(${r} ${x} ${y})`} fill={`url(#${g('p')})`} />
      ))}
      <path d="M12 11.2c3 0 6 3.4 6 6.2 0 2-1.6 3-3.2 3-1.2 0-1.8-.6-2.8-.6s-1.6.6-2.8.6c-1.6 0-3.2-1-3.2-3 0-2.8 3-6.2 6-6.2z" fill={`url(#${g('p')})`} />
      <ellipse cx="9.6" cy="14.4" rx="1.3" ry=".8" transform="rotate(-35 9.6 14.4)" fill="#fff" opacity=".5" />
    </svg>
  )
}

export function Music({ size = 22 }: P): JSX.Element {
  const g = useGid()
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <defs>
        <linearGradient id={g('n')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#b69cff" />
          <stop offset="1" stopColor="#6d3fe0" />
        </linearGradient>
      </defs>
      <path d="M9 17.5V6.2l10-2.4v11.4" stroke={`url(#${g('n')})`} strokeWidth="2.2" fill="none" strokeLinejoin="round" />
      <path d="M9 6.2l10-2.4v3.2L9 9.4z" fill={`url(#${g('n')})`} />
      <ellipse cx="6.6" cy="17.8" rx="3.1" ry="2.5" transform="rotate(-18 6.6 17.8)" fill={`url(#${g('n')})`} />
      <ellipse cx="16.6" cy="15.4" rx="3.1" ry="2.5" transform="rotate(-18 16.6 15.4)" fill={`url(#${g('n')})`} />
      <ellipse cx="5.6" cy="17" rx="1" ry=".6" transform="rotate(-30 5.6 17)" fill="#fff" opacity=".6" />
    </svg>
  )
}

export function Moon({ size = 20 }: P): JSX.Element {
  const g = useGid()
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <defs>
        <linearGradient id={g('m')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff4b8" />
          <stop offset="1" stopColor="#f2b72f" />
        </linearGradient>
      </defs>
      <path d="M19.8 15.2A8.4 8.4 0 0 1 8.8 4.2a8.4 8.4 0 1 0 11 11z" fill={`url(#${g('m')})`} />
      <circle cx="9.4" cy="15.6" r="1.3" fill="#d49a1e" opacity=".3" />
      <circle cx="12.8" cy="18.2" r=".8" fill="#d49a1e" opacity=".3" />
      <path d="M17.4 3.4l.5 1.3 1.3.5-1.3.5-.5 1.3-.5-1.3-1.3-.5 1.3-.5z" fill="#8aa3ff" />
    </svg>
  )
}

export function Sun({ size = 20 }: P): JSX.Element {
  const g = useGid()
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <defs>
        <radialGradient id={g('s')} cx="0.4" cy="0.35" r="0.8">
          <stop offset="0" stopColor="#fff09a" />
          <stop offset="1" stopColor="#ffa60a" />
        </radialGradient>
      </defs>
      <path
        d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M5.3 5.3l1.7 1.7M17 17l1.7 1.7M5.3 18.7 7 17M17 7l1.7-1.7"
        stroke="#ffb72b"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="5" fill={`url(#${g('s')})`} />
    </svg>
  )
}

export function Dots({ size = 20 }: P): JSX.Element {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      {[6, 12, 18].map((x) => (
        <circle key={x} cx={x} cy="12" r="1.8" fill="#6b7280" />
      ))}
    </svg>
  )
}

export function Sparkle({ size = 20, fill }: P & { fill?: string }): JSX.Element {
  const g = useGid()
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <defs>
        <linearGradient id={g('s')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={fill ?? '#ffe98a'} />
          <stop offset="1" stopColor={fill ?? '#f5a300'} />
        </linearGradient>
      </defs>
      <path d="M12 2.5c.9 5 2.5 6.6 7.5 7.5-5 .9-6.6 2.5-7.5 7.5-.9-5-2.5-6.6-7.5-7.5 5-.9 6.6-2.5 7.5-7.5z" fill={`url(#${g('s')})`} />
      <path d="M19 16.5c.3 1.8.9 2.4 2.7 2.7-1.8.3-2.4.9-2.7 2.7-.3-1.8-.9-2.4-2.7-2.7 1.8-.3 2.4-.9 2.7-2.7z" fill={`url(#${g('s')})`} />
    </svg>
  )
}

export function Fish({ size = 22 }: P): JSX.Element {
  const g = useGid()
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <defs>
        <linearGradient id={g('f')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6f96e6" />
          <stop offset="0.55" stopColor="#a9c6f5" />
          <stop offset="1" stopColor="#eef4ff" />
        </linearGradient>
      </defs>
      <path d="M21 7.2 17 11c-.5-.5-1-.9-1.6-1.3L17.5 12l-2.1 2.3c.6-.4 1.1-.8 1.6-1.3l4 3.8c.4-3.2.4-6.4 0-9.6z" fill="#5a80d4" />
      <path d="M2.5 12c2.8-4.4 8.6-5.8 13.3-2.4 1.1.8 1.1 4 0 4.8C11.1 17.8 5.3 16.4 2.5 12z" fill={`url(#${g('f')})`} />
      <path d="M9.4 8.6c-.8 1-1.1 2.2-1.1 3.4s.3 2.4 1.1 3.4" stroke="#5a80d4" strokeWidth=".8" fill="none" opacity=".6" />
      <circle cx="5.9" cy="11.2" r="1.15" fill="#fff" />
      <circle cx="6.1" cy="11.3" r=".6" fill="#1f2937" />
    </svg>
  )
}

export function Bone({ size = 22 }: P): JSX.Element {
  const g = useGid()
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <defs>
        <linearGradient id={g('b')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fffdf7" />
          <stop offset="1" stopColor="#dccbb2" />
        </linearGradient>
      </defs>
      <path
        d="M7.5 9.8 14.2 16.5a2.6 2.6 0 1 0 3.4 3.3 2.6 2.6 0 1 0 2.2-4.4 2.6 2.6 0 0 0-3.4-2.2L9.8 7.5a2.6 2.6 0 0 0-2.2-3.4 2.6 2.6 0 1 0-4.4 2.2 2.6 2.6 0 1 0 3.3 3.4z"
        fill={`url(#${g('b')})`}
        stroke="rgba(120, 90, 50, 0.3)"
        strokeWidth=".7"
      />
      <path d="M8.6 7.6 13.8 12.8" stroke="#fff" strokeWidth="1" strokeLinecap="round" opacity=".8" />
    </svg>
  )
}

export function Banana({ size = 22 }: P): JSX.Element {
  const g = useGid()
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <defs>
        <linearGradient id={g('b')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff07a" />
          <stop offset="1" stopColor="#efb00c" />
        </linearGradient>
      </defs>
      <path d="M3.6 13.2c4.6 4 11.8 3 15.9-4.6.7 7.2-4.4 12.1-10.1 11.8-3.2-.1-5.4-2.8-5.8-7.2z" fill={`url(#${g('b')})`} />
      <path d="M5.6 15.4c3.6 2.2 8.6 1.4 11.8-2.8" stroke="#d99a0a" strokeWidth=".9" fill="none" opacity=".6" />
      <path d="M19.4 8.8l.9-2.8" stroke="#6b4a1f" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="3.9" cy="13.4" r=".8" fill="#6b4a1f" />
    </svg>
  )
}
