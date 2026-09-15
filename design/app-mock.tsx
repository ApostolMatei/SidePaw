// Runs the real pet UI in a browser with a fake Electron bridge.
const q = new URLSearchParams(location.search)
const fresh = q.has('new')

const pet = {
  name: q.get('name') ?? 'Miso',
  species: q.get('species') ?? 'cat',
  adoptedAt: Date.now() - 3 * 3_600_000,
  lastVisit: Date.now(),
  hunger: Number(q.get('hunger') ?? 72),
  energy: Number(q.get('energy') ?? 45),
  happiness: Number(q.get('happy') ?? 88),
  counts: { pet: 14, feed: 4, sleep: 2 }
}

window.sidepaw = {
  load: async () => (fresh ? null : pet),
  save: async () => {},
  moveBy: async () => null,
  dragTo: () => {},
  fall: async () => {},
  setIgnoreMouse: () => {},
  openMenu: () => {},
  notify: (title: string, body: string) => console.log('notify', title, body),
  onAction: () => () => {}
} as unknown as typeof window.sidepaw

await import('../src/renderer/src/main')

export {}
