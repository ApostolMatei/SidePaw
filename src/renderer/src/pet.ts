export type Activity = 'idle' | 'walk' | 'sleep' | 'eat' | 'happy' | 'dance' | 'drag' | 'fall' | 'no'

export type Species = 'cat' | 'bichon' | 'labrador' | 'gorilla'

export const SPECIES_INFO: Record<Species, { adopted: string; defaultName: string; scale: number; craving: 'fish' | 'bone' | 'banana' }> = {
  cat: { adopted: 'Ai adoptat un pisoi!', defaultName: 'Miso', scale: 1, craving: 'fish' },
  bichon: { adopted: 'Ai adoptat un bichon maltez!', defaultName: 'Fluffy', scale: 0.85, craving: 'bone' },
  labrador: { adopted: 'Ai adoptat un labrador!', defaultName: 'Max', scale: 1.15, craving: 'bone' },
  gorilla: { adopted: 'Ai adoptat o gorilă!', defaultName: 'Kong', scale: 1.3, craving: 'banana' }
}

export interface PetData {
  name: string
  species: Species
  adoptedAt: number
  lastVisit: number
  hunger: number // 100 = sătul, 0 = flămând
  energy: number
  happiness: number
  /** Minutes of good care — the pet only grows while you are around and it is looked after. */
  care: number
  counts: { pet: number; feed: number; sleep: number; dance?: number }
}

/*
 * Needs balance. All rates are per minute of *active* time: the clock stops while the app is
 * closed, the screen is locked or you are away from the PC, so nobody is forced to log in.
 *
 * One hour at the PC with a well-kept pet looks like this:
 *   hunger     100 → 25 in 30 min, one meal (+65) buys another ~26 min   → ~2 meals / hour
 *   energy     drops for ~70 min, then an ~11 min nap refills it          → 1 nap / hour
 *   happiness  -1/min; meals give a little, petting ~40, a dance 22 but costs 12 energy and 6 food
 * Ignoring a need makes the others fall faster, and stops the pet from growing.
 */
export const RATES = {
  hunger: { awake: 2.5, asleep: 1 },
  energy: { idle: 1.1, walk: 1.8, asleep: -8 },
  happiness: { awake: 1, asleep: 0.2, hungry: 1.5, tired: 1 }
}

export const ACTIONS = {
  feed: 65,
  feedJoy: 6,
  /** The pet refuses food above this and refuses to nap above `sleepMax` energy. */
  feedMax: 80,
  sleepMax: 70,
  /** Diminishing joy for petting in quick succession; after the last one it has had enough. */
  petJoy: [18, 12, 8, 5, 3],
  petWindowMs: 60_000,
  wakeJoy: 5,
  /** Dancing is the big happiness boost, paid for with energy and food. Two dances in a row, then a break. */
  dance: { energy: 12, hunger: 6, joy: [22, 12], windowMs: 120_000, minEnergy: 25, minHunger: 25, ms: 4200 }
}

export const LEVELS = {
  /** Thought bubble with what it wants. */
  emote: 30,
  /** Card turns red. */
  warn: 25,
  /** Windows notification if the bubble was ignored. */
  notify: 10,
  autoSleep: 12,
  /** Too tired or sad to wander around. */
  lazy: 25
}

const STAGES = [
  { label: 'Pui', until: 120, scale: 0.7 },
  { label: 'Tânăr', until: 600, scale: 0.85 },
  { label: 'Adult', until: Infinity, scale: 1 }
]

/** Away longer than this counts as a real break: the pet slept and greets you. */
export const BREAK_MINUTES = 20

export const clamp = (v: number, min = 0, max = 100): number => Math.min(max, Math.max(min, v))

export function createPet(name: string, species: Species): PetData {
  const now = Date.now()
  return {
    name,
    species,
    adoptedAt: now,
    lastVisit: now,
    hunger: 80,
    energy: 90,
    happiness: 70,
    care: 0,
    counts: { pet: 0, feed: 0, sleep: 0, dance: 0 }
  }
}

export function tick(p: PetData, seconds: number, activity: Activity): PetData {
  const m = seconds / 60
  const asleep = activity === 'sleep'
  const hunger = asleep ? RATES.hunger.asleep : RATES.hunger.awake
  const energy = asleep ? RATES.energy.asleep : activity === 'walk' ? RATES.energy.walk : RATES.energy.idle
  let sad = asleep ? RATES.happiness.asleep : RATES.happiness.awake
  if (p.hunger < LEVELS.warn) sad += RATES.happiness.hungry
  if (!asleep && p.energy < 20) sad += RATES.happiness.tired

  const worst = Math.min(p.hunger, p.energy, p.happiness)
  const growth = worst <= 0 ? 0 : worst < LEVELS.warn ? 0.5 : 1

  return {
    ...p,
    hunger: clamp(p.hunger - hunger * m),
    energy: clamp(p.energy - energy * m),
    happiness: clamp(p.happiness - sad * m),
    care: p.care + growth * m
  }
}

/** Coming back after the app was closed: needs are frozen, but a long break counts as sleep. */
export function resume(saved: PetData, now: number): PetData {
  const p = { ...saved, care: saved.care ?? 0 }
  const away = (now - p.lastVisit) / 60_000
  return { ...p, energy: away >= BREAK_MINUTES ? 100 : p.energy, lastVisit: now }
}

export function stageOf(care: number): { label: string; scale: number; next: number | null } {
  const i = STAGES.findIndex((s) => care < s.until)
  const s = STAGES[i]
  return { label: s.label, scale: s.scale, next: s.until === Infinity ? null : s.until - care }
}

function duration(minutes: number): string {
  const total = Math.max(1, Math.ceil(minutes))
  const h = Math.floor(total / 60)
  const min = total % 60
  if (h === 0) return `${min} min`
  return min === 0 ? `${h} h` : `${h} h ${min} min`
}

export function growthText(care: number): string {
  const { next } = stageOf(care)
  return next === null ? `${duration(care)} de îngrijire` : `crește în ${duration(next)}`
}

export function personality(p: PetData): string {
  const { pet, feed, sleep } = p.counts
  const dance = p.counts.dance ?? 0
  const total = pet + feed + sleep + dance
  if (total < 10) return 'Încă se descoperă'
  const max = Math.max(pet, feed, sleep, dance)
  if (max / total < 0.4) return 'Echilibrat'
  if (max === dance) return 'Dansator'
  if (max === pet) return 'Afectuos'
  if (max === feed) return 'Pofticios'
  return 'Somnoros'
}
