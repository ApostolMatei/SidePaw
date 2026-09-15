import type { CSSProperties } from 'react'
import { Bolt, Bowl, Dots, Drumstick, Heart, Moon, Music, Paw, Sun } from './Icons'

export interface CardStats {
  name: string
  stage: string
  age: string
  trait: string
  hunger: number
  energy: number
  happiness: number
}

export const LOW = 25

/** Short warning for the most urgent need, or null when all is well. */
export function needOf(s: Pick<CardStats, 'hunger' | 'energy' | 'happiness'>): string | null {
  if (s.hunger < LOW) return 'Îi e foame'
  if (s.energy < LOW) return 'Are nevoie de somn'
  if (s.happiness < LOW) return 'Vrea atenție'
  return null
}

function Stat({ label, value, icon, kind }: { label: string; value: number; icon: JSX.Element; kind: string }): JSX.Element {
  const low = value < LOW
  return (
    <div className={`stat ${kind}${low ? ' low' : ''}`}>
      <span className="stat-icon">{icon}</span>
      <span className="stat-label">{label}</span>
      <span className="stat-value">{Math.round(value)}%</span>
      <div className="stat-bar">
        <i style={{ width: `${Math.max(3, value)}%` }} />
      </div>
    </div>
  )
}

export default function PetCard({
  s,
  sleeping,
  onFeed,
  onSleep,
  onPet,
  onDance,
  onMore,
  style
}: {
  s: CardStats
  sleeping: boolean
  onFeed?: () => void
  onSleep?: () => void
  onPet?: () => void
  onDance?: () => void
  onMore?: () => void
  style?: CSSProperties
}): JSX.Element {
  const need = needOf(s)
  return (
    <div className="bubble pet-card" style={style}>
      <div className="card-head">
        <div className="card-title">
          <div className="pet-name">{s.name}</div>
          <div className="sub">
            {s.stage} · {s.age}
          </div>
        </div>
        <button className="icon-btn" title="Mai multe" onClick={onMore}>
          <Dots size={18} />
        </button>
      </div>

      <div className={`mood${need ? ' alert' : ''}`}>{need ?? s.trait}</div>

      <div className="stats">
        <Stat kind="food" label="Sătul" value={s.hunger} icon={<Drumstick size={18} />} />
        <Stat kind="energy" label="Energie" value={s.energy} icon={<Bolt size={18} />} />
        <Stat kind="love" label="Fericire" value={s.happiness} icon={<Heart size={18} />} />
      </div>

      <div className="actions">
        <button className="btn" onClick={onFeed}>
          <Bowl size={24} />
          Hrănește
        </button>
        <button className="btn" onClick={onSleep}>
          {sleeping ? <Sun size={22} /> : <Moon size={22} />}
          {sleeping ? 'Trezește' : 'Culcă'}
        </button>
        <button className="btn" onClick={onPet}>
          <Paw size={22} />
          Mângâie
        </button>
        <button className="btn" onClick={onDance}>
          <Music size={22} />
          Dansează
        </button>
      </div>
    </div>
  )
}
