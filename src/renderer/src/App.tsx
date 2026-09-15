import { useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties, FormEvent, PointerEvent } from 'react'
import Critter from './Critter'
import { Banana, Bone, Fish, Heart, Moon, Sparkle } from './Icons'
import PetCard from './PetCard'
import {
  type Activity,
  type PetData,
  type Species,
  ACTIONS,
  BREAK_MINUTES,
  LEVELS,
  SPECIES_INFO,
  clamp,
  createPet,
  growthText,
  personality,
  resume,
  stageOf,
  tick
} from './pet'

const api = window.sidepaw
const TICK_SECONDS = 5
const REMIND_MS = 30 * 60_000

const params = new URLSearchParams(location.search)
const PET_ID = params.get('id') ?? ''
const START_SPECIES = (params.get('species') ?? 'cat') as Species

interface DragState {
  offX: number
  offY: number
  startX: number
  startY: number
  moved: boolean
  onPet: boolean
}

const CRAVING = { fish: Fish, bone: Bone, banana: Banana }

export default function App(): JSX.Element | null {
  const [pet, setPet] = useState<PetData | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [activity, setActivity] = useState<Activity>('idle')
  const [facing, setFacing] = useState<1 | -1>(1)
  const [hover, setHover] = useState(false)
  const [renaming, setRenaming] = useState(false)
  const [nameInput, setNameInput] = useState('')
  const [say, setSay] = useState<string | null>(null)
  const [danceKind, setDanceKind] = useState<'a' | 'b'>('a')

  const petRef = useRef(pet)
  petRef.current = pet
  const activityRef = useRef(activity)
  activityRef.current = activity
  const hoverRef = useRef(hover)
  hoverRef.current = hover
  const dragRef = useRef<DragState | null>(null)
  const actionTimer = useRef<number>(undefined)
  const sayTimer = useRef<number>(undefined)
  // The pet's clock only runs while someone is actually at the PC.
  const awayRef = useRef(false)
  const awaySince = useRef(0)
  const petLog = useRef<number[]>([])
  const danceLog = useRef<number[]>([])

  const hasPet = pet !== null
  const species = pet?.species ?? START_SPECIES
  const info = SPECIES_INFO[species] ?? SPECIES_INFO.cat

  const doTemp = (a: Activity, ms: number): void => {
    clearTimeout(actionTimer.current)
    setActivity(a)
    actionTimer.current = window.setTimeout(() => setActivity('idle'), ms)
  }

  const refuse = (text: string): void => {
    doTemp('no', 1300)
    clearTimeout(sayTimer.current)
    setSay(text)
    sayTimer.current = window.setTimeout(() => setSay(null), 2200)
  }

  useEffect(() => {
    api.load(PET_ID).then((d) => {
      if (d) {
        const saved = d as PetData
        const breakTaken = Date.now() - saved.lastVisit >= BREAK_MINUTES * 60_000
        setPet(resume(saved, Date.now()))
        if (breakTaken) setTimeout(() => doTemp('happy', 2500), 700)
      }
      setLoaded(true)
    })
  }, [])

  useEffect(() => {
    if (!pet) return
    const t = setTimeout(() => api.save(PET_ID, { ...pet, lastVisit: Date.now() }), 400)
    return () => clearTimeout(t)
  }, [pet])

  useEffect(() => {
    const onPresence = (state: 'active' | 'away'): void => {
      const away = state === 'away'
      if (away === awayRef.current) return
      awayRef.current = away
      if (away) {
        awaySince.current = Date.now()
      } else if (Date.now() - awaySince.current >= BREAK_MINUTES * 60_000 && activityRef.current !== 'sleep') {
        doTemp('happy', 2500)
      }
    }
    api.getPresence().then(onPresence)
    return api.onPresence(onPresence)
  }, [])

  useEffect(() => {
    const id = setInterval(() => {
      if (awayRef.current) return
      setPet((p) => p && tick(p, TICK_SECONDS, activityRef.current))
    }, TICK_SECONDS * 1000)
    return () => clearInterval(id)
  }, [])

  const interactive = hover || !hasPet || renaming || activity === 'drag'
  useEffect(() => {
    api.setIgnoreMouse(!interactive)
  }, [interactive])

  // Falls asleep when exhausted, wakes up on its own once rested.
  useEffect(() => {
    if (!pet) return
    if (activity === 'sleep' && pet.energy >= 100) {
      setActivity('idle')
      setPet((p) => p && { ...p, happiness: clamp(p.happiness + ACTIONS.wakeJoy) })
    } else if ((activity === 'idle' || activity === 'walk') && pet.energy < LEVELS.autoSleep) {
      setActivity('sleep')
    }
  }, [pet?.energy, activity])

  // Growing up is worth a celebration.
  const stageLabel = pet ? stageOf(pet.care).label : null
  const lastStage = useRef<string | null>(null)
  useEffect(() => {
    if (!pet || !stageLabel) return
    if (lastStage.current && lastStage.current !== stageLabel) {
      api.notify(`${pet.name} a crescut!`, `Acum e ${stageLabel.toLowerCase()}. Mulțumită grijii tale.`)
      doTemp('happy', 3000)
    }
    lastStage.current = stageLabel
  }, [stageLabel])

  // Notifications only when a need got critical and the thought bubble was ignored; reminds every 30 min.
  const notified = useRef({ hunger: 0, happiness: 0 })
  useEffect(() => {
    if (!pet || awayRef.current) return
    const needs = [
      ['hunger', pet.hunger, `${pet.name} îi e foame`, 'Nu a mai mâncat de mult. Hrănește-l din card sau din tray.'],
      ['happiness', pet.happiness, `${pet.name} are nevoie de tine`, 'Nu l-a mai băgat nimeni în seamă. Mângâie-l puțin.']
    ] as const
    const now = Date.now()
    for (const [key, value, title, body] of needs) {
      if (value < LEVELS.notify && now - notified.current[key] >= REMIND_MS) {
        notified.current[key] = now
        api.notify(title, body)
      } else if (value > LEVELS.emote) {
        notified.current[key] = 0
      }
    }
  }, [pet?.hunger, pet?.happiness])

  const act = useCallback((action: string) => {
    const p = petRef.current
    const sleeping = activityRef.current === 'sleep'
    switch (action) {
      case 'pet': {
        if (!p) return
        if (sleeping) {
          clearTimeout(actionTimer.current)
          setActivity('idle')
          return
        }
        const now = Date.now()
        petLog.current = petLog.current.filter((t) => now - t < ACTIONS.petWindowMs)
        const joy = ACTIONS.petJoy[petLog.current.length]
        if (joy === undefined) {
          refuse('Ajunge, mulțumesc!')
          return
        }
        petLog.current.push(now)
        setPet((q) => q && { ...q, happiness: clamp(q.happiness + joy), counts: { ...q.counts, pet: q.counts.pet + 1 } })
        doTemp('happy', 2500)
        break
      }
      case 'feed':
        if (!p) return
        if (p.hunger >= ACTIONS.feedMax) {
          refuse('Nu mi-e foame')
          return
        }
        setPet(
          (q) =>
            q && {
              ...q,
              hunger: clamp(q.hunger + ACTIONS.feed),
              happiness: clamp(q.happiness + ACTIONS.feedJoy),
              counts: { ...q.counts, feed: q.counts.feed + 1 }
            }
        )
        doTemp('eat', 3000)
        break
      case 'sleep':
        if (!p) return
        clearTimeout(actionTimer.current)
        if (sleeping) {
          setActivity('idle')
        } else if (p.energy >= ACTIONS.sleepMax) {
          refuse('Nu mi-e somn')
        } else {
          setActivity('sleep')
          setPet((q) => q && { ...q, counts: { ...q.counts, sleep: q.counts.sleep + 1 } })
        }
        break
      case 'dance': {
        if (!p) return
        const d = ACTIONS.dance
        if (sleeping) return refuse('Zzz… mai lasă-mă')
        if (p.energy < d.minEnergy) return refuse('N-am energie de dans')
        if (p.hunger < d.minHunger) return refuse('Mi-e prea foame')
        const now = Date.now()
        danceLog.current = danceLog.current.filter((t) => now - t < d.windowMs)
        const joy = d.joy[danceLog.current.length]
        if (joy === undefined) return refuse('Gata, m-am distrat!')
        danceLog.current.push(now)
        // Alternate between the two routines.
        setDanceKind((k) => (k === 'a' ? 'b' : 'a'))
        setPet(
          (q) =>
            q && {
              ...q,
              energy: clamp(q.energy - d.energy),
              hunger: clamp(q.hunger - d.hunger),
              happiness: clamp(q.happiness + joy),
              counts: { ...q.counts, dance: (q.counts.dance ?? 0) + 1 }
            }
        )
        doTemp('dance', d.ms)
        break
      }
      case 'rename':
        setNameInput('')
        setRenaming(true)
        break
    }
  }, [])

  useEffect(() => api.onAction(act), [act])

  useEffect(() => {
    if (!hasPet) return
    let walkUntil = 0
    let dir: 1 | -1 = 1
    const id = setInterval(() => {
      const a = activityRef.current
      if (hoverRef.current || dragRef.current) {
        if (a === 'walk') setActivity('idle')
        return
      }
      const now = Date.now()
      if (a === 'walk') {
        if (now > walkUntil) {
          setActivity('idle')
          return
        }
        api.moveBy(dir * 2).then((edge) => {
          if (!edge) return
          dir = edge === 'left' ? 1 : -1
          setFacing(dir)
        })
        return
      }
      const p = petRef.current
      const lazy = !p || p.energy < LEVELS.lazy || p.happiness < LEVELS.lazy || p.hunger < LEVELS.notify
      if (a === 'idle' && !lazy && Math.random() < 0.004) {
        dir = Math.random() < 0.5 ? 1 : -1
        setFacing(dir)
        walkUntil = now + 2000 + Math.random() * 5000
        setActivity('walk')
      }
    }, 30)
    return () => clearInterval(id)
  }, [hasPet])

  const onPointerDown = (e: PointerEvent<HTMLDivElement>): void => {
    const target = e.target as HTMLElement
    if (e.button !== 0 || target.closest('input, button')) return
    e.currentTarget.setPointerCapture(e.pointerId)
    dragRef.current = {
      offX: e.clientX,
      offY: e.clientY,
      startX: e.screenX,
      startY: e.screenY,
      moved: false,
      onPet: target.closest('.pet') !== null
    }
  }

  const onPointerMove = (e: PointerEvent<HTMLDivElement>): void => {
    const d = dragRef.current
    if (!d) return
    if (!d.moved) {
      if (Math.hypot(e.screenX - d.startX, e.screenY - d.startY) < 5) return
      d.moved = true
      clearTimeout(actionTimer.current)
      setActivity('drag')
    }
    api.dragTo(e.screenX - d.offX, e.screenY - d.offY)
  }

  const onPointerUp = async (): Promise<void> => {
    const d = dragRef.current
    dragRef.current = null
    if (!d) return
    if (d.moved) {
      // Before naming, stay where dropped so the bubble can be moved out of the way.
      if (pet) {
        setActivity('fall')
        await api.fall()
      }
      setActivity('idle')
    } else if (d.onPet && pet) {
      act('pet')
    }
  }

  const submitName = (e: FormEvent): void => {
    e.preventDefault()
    const name = nameInput.trim() || info.defaultName
    setPet((p) => (p ? { ...p, name } : createPet(name, START_SPECIES)))
    setRenaming(false)
    setNameInput('')
  }

  if (!loaded) return null

  const stage = pet ? stageOf(pet.care) : { label: '', scale: 0.7 }
  const naming = !pet || renaming
  const showStats = !naming && hover && activity !== 'drag' && activity !== 'fall'
  const sleeping = activity === 'sleep'
  const sad = !!pet && (pet.happiness < LEVELS.warn || pet.hunger <= 0)

  const Craving = CRAVING[info.craving]
  let thought: JSX.Element | null = null
  if (pet && !sleeping) {
    if (pet.hunger < LEVELS.emote) thought = <Craving size={26} />
    else if (pet.energy < LEVELS.lazy) thought = <Moon size={24} />
    else if (pet.happiness < LEVELS.emote) thought = <Heart size={24} />
  }

  return (
    <div className="stage">
      <div
        className="zone"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        {naming && (
          <form className="bubble naming" onSubmit={submitName}>
            <div className="naming-head">
              <Sparkle size={22} />
              <b>{pet ? 'Un nume nou' : info.adopted}</b>
            </div>
            <p className="naming-sub">{pet ? `Cum îl chemi de acum pe ${pet.name}?` : 'Ce nume îi dai?'}</p>
            <input
              autoFocus
              maxLength={16}
              value={nameInput}
              placeholder={info.defaultName}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Escape' && pet && setRenaming(false)}
            />
            <button type="submit" className="primary">
              Gata
            </button>
          </form>
        )}

        {showStats && pet && (
          <PetCard
            s={{
              name: pet.name,
              stage: stage.label,
              age: growthText(pet.care),
              trait: personality(pet),
              hunger: pet.hunger,
              energy: pet.energy,
              happiness: pet.happiness
            }}
            sleeping={sleeping}
            onFeed={() => act('feed')}
            onSleep={() => act('sleep')}
            onPet={() => act('pet')}
            onDance={() => act('dance')}
            onMore={() => api.openMenu()}
          />
        )}

        {!showStats && !naming && say && <div className="say">{say}</div>}
        {!showStats && !naming && !say && thought && <div className="thought">{thought}</div>}

        <div
          className={`pet ${activity}${activity === 'dance' ? ` dance-${danceKind}` : ''}${sad ? ' sad' : ''}`}
          style={{ '--scale': stage.scale * info.scale, '--facing': facing } as CSSProperties}
          onContextMenu={(e) => {
            e.preventDefault()
            if (pet) api.openMenu()
          }}
        >
          <div className="flip">
            <Critter species={species} activity={activity} sad={sad} />
          </div>
          {activity === 'happy' && (
            <div className="hearts">
              <span>
                <Heart size={18} />
              </span>
              <span>
                <Heart size={14} />
              </span>
              <span>
                <Heart size={16} />
              </span>
            </div>
          )}
          {activity === 'dance' && (
            <div className="notes">
              <span>♪</span>
              <span>♫</span>
              <span>♪</span>
            </div>
          )}
          {sleeping && (
            <div className="zzz">
              <span>z</span>
              <span>z</span>
              <span>Z</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
