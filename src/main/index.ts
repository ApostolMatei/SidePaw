import { app, BrowserWindow, dialog, ipcMain, Menu, nativeImage, Notification, powerMonitor, screen, session, Tray } from 'electron'
import type { IpcMainEvent, IpcMainInvokeEvent, MenuItemConstructorOptions } from 'electron'
import { join } from 'path'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { randomUUID } from 'crypto'

const WIN_W = 280
const WIN_H = 430

type Species = 'cat' | 'bichon' | 'labrador' | 'gorilla'

const SPECIES: { key: Species; label: string }[] = [
  { key: 'cat', label: 'Pisică' },
  { key: 'bichon', label: 'Bichon maltez' },
  { key: 'labrador', label: 'Labrador' },
  { key: 'gorilla', label: 'Gorilă' }
]
const speciesLabel = (s: Species): string => SPECIES.find((x) => x.key === s)?.label ?? s

interface StoredPet {
  id: string
  species: Species
  name: string
  [key: string]: unknown
}

let pets: StoredPet[] = []
const windows = new Map<string, BrowserWindow>()
let tray: Tray | null = null

const userFile = (name: string): string => join(app.getPath('userData'), name)
const iconPath = join(__dirname, '../../resources/icon.png')

let settings = { notifications: true }

function loadSettings(): void {
  try {
    if (existsSync(userFile('settings.json'))) {
      settings = { ...settings, ...JSON.parse(readFileSync(userFile('settings.json'), 'utf-8')) }
    }
  } catch {
    // keep defaults
  }
}

function saveSettings(): void {
  writeFileSync(userFile('settings.json'), JSON.stringify(settings, null, 2))
}

function savePets(): void {
  writeFileSync(userFile('pets.json'), JSON.stringify({ pets }, null, 2))
}

function loadPets(): void {
  try {
    if (existsSync(userFile('pets.json'))) {
      pets = JSON.parse(readFileSync(userFile('pets.json'), 'utf-8')).pets ?? []
    } else if (existsSync(userFile('pet.json'))) {
      const old = JSON.parse(readFileSync(userFile('pet.json'), 'utf-8'))
      pets = [{ ...old, id: randomUUID(), species: 'cat' }]
      savePets()
    }
  } catch {
    pets = []
  }
}

// In dev, Windows must launch electron.exe with the project path as argument.
const loginOpts = (): { path: string; args: string[] } => ({
  path: process.execPath,
  args: app.isPackaged ? [] : [app.getAppPath()]
})
const getAutoStart = (): boolean => app.getLoginItemSettings(loginOpts()).openAtLogin
const setAutoStart = (on: boolean): void => app.setLoginItemSettings({ ...loginOpts(), openAtLogin: on })

// IPC is only honoured from our own pet windows.
const winOf = (e: IpcMainEvent | IpcMainInvokeEvent): BrowserWindow | null => {
  const win = BrowserWindow.fromWebContents(e.sender)
  return win && [...windows.values()].includes(win) ? win : null
}

const isSpecies = (s: unknown): s is Species => SPECIES.some((x) => x.key === s)

const idOf = (win: BrowserWindow): string | undefined =>
  [...windows.entries()].find(([, w]) => w === win)?.[0]

const workAreaOf = (win: BrowserWindow): Electron.Rectangle => screen.getDisplayMatching(win.getBounds()).workArea

function setPos(win: BrowserWindow, x: number, y: number): void {
  // setBounds instead of setPosition: avoids window growing on scaled displays.
  win.setBounds({ x: Math.round(x), y: Math.round(y), width: WIN_W, height: WIN_H })
}

function createPetWindow(id: string, species: Species, name?: string): void {
  const wa = screen.getPrimaryDisplay().workArea
  const x = wa.x + (wa.width - WIN_W) / 2 + (Math.random() - 0.5) * wa.width * 0.6
  const win = new BrowserWindow({
    width: WIN_W,
    height: WIN_H,
    x: Math.round(x),
    y: wa.y + wa.height - WIN_H,
    title: name ? `${name} · Sidepaw` : 'Sidepaw',
    icon: iconPath,
    transparent: true,
    backgroundColor: '#00000000',
    frame: false,
    resizable: false,
    maximizable: false,
    fullscreenable: false,
    alwaysOnTop: true,
    hasShadow: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: true,
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: true,
      spellcheck: false
    }
  })
  win.setAlwaysOnTop(true, 'screen-saver')
  win.on('page-title-updated', (e) => e.preventDefault())

  const query = { id, species }
  if (process.env['ELECTRON_RENDERER_URL']) {
    win.loadURL(`${process.env['ELECTRON_RENDERER_URL']}?${new URLSearchParams(query)}`)
  } else {
    win.loadFile(join(__dirname, '../renderer/index.html'), { query })
  }

  windows.set(id, win)
  win.on('closed', () => {
    windows.delete(id)
    rebuildTray()
  })
}

const adopt = (species: Species): void => createPetWindow(randomUUID(), species)

const sendAction = (id: string, action: string): void => {
  const win = windows.get(id)
  if (!win) return
  win.show()
  win.webContents.send('pet:action', action)
}

function toggleVisible(id: string): void {
  const win = windows.get(id)
  if (!win) return
  if (win.isVisible()) win.hide()
  else win.show()
  rebuildTray()
}

async function removePet(id: string): Promise<void> {
  const pet = pets.find((p) => p.id === id)
  if (pet) {
    const { response } = await dialog.showMessageBox({
      type: 'question',
      title: 'Sidepaw',
      buttons: ['Trimite acasă', 'Anulează'],
      defaultId: 1,
      cancelId: 1,
      message: `Trimiți acasă pe ${pet.name}?`,
      detail: 'Progresul lui se șterge definitiv.'
    })
    if (response !== 0) return
    pets = pets.filter((p) => p.id !== id)
    savePets()
  }
  windows.get(id)?.destroy()
  rebuildTray()
}

function petActions(id: string): MenuItemConstructorOptions[] {
  const visible = windows.get(id)?.isVisible() ?? false
  return [
    { label: 'Mângâie', click: () => sendAction(id, 'pet') },
    { label: 'Dansează', click: () => sendAction(id, 'dance') },
    { label: 'Hrănește', click: () => sendAction(id, 'feed') },
    { label: 'Culcă / Trezește', click: () => sendAction(id, 'sleep') },
    { label: 'Redenumește', click: () => sendAction(id, 'rename') },
    { label: visible ? 'Ascunde' : 'Arată', click: () => toggleVisible(id) },
    { type: 'separator' },
    { label: 'Trimite acasă…', click: () => removePet(id) }
  ]
}

function commonItems(): MenuItemConstructorOptions[] {
  return [
    { label: 'Adoptă încă unul', submenu: SPECIES.map((s) => ({ label: s.label, click: () => adopt(s.key) })) },
    {
      label: 'Notificări',
      type: 'checkbox',
      checked: settings.notifications,
      click: (item) => {
        settings.notifications = item.checked
        saveSettings()
      }
    },
    {
      label: process.platform === 'win32' ? 'Pornește cu Windows' : 'Pornește la login',
      type: 'checkbox',
      checked: getAutoStart(),
      click: (item) => setAutoStart(item.checked)
    },
    { type: 'separator' },
    { label: 'Închide Sidepaw', click: () => app.quit() }
  ]
}

function rebuildTray(): void {
  if (!tray || tray.isDestroyed()) return
  const petItems: MenuItemConstructorOptions[] = pets.map((p) => ({
    label: `${p.name} · ${speciesLabel(p.species)}`,
    submenu: petActions(p.id)
  }))
  if (petItems.length) petItems.push({ type: 'separator' })
  tray.setContextMenu(Menu.buildFromTemplate([...petItems, ...commonItems()]))
}

ipcMain.handle('pet:load', (_e, id: string) => pets.find((p) => p.id === id) ?? null)

ipcMain.handle('pet:save', (e, id: unknown, data: StoredPet) => {
  if (!winOf(e) || typeof id !== 'string' || !data || typeof data !== 'object') return
  if (!isSpecies(data.species) || typeof data.name !== 'string' || data.name.length > 16) return
  const i = pets.findIndex((p) => p.id === id)
  const nameChanged = i === -1 || pets[i].name !== data.name
  const entry = { ...data, id }
  if (i === -1) pets.push(entry)
  else pets[i] = entry
  savePets()
  if (nameChanged) {
    winOf(e)?.setTitle(`${data.name} · Sidepaw`)
    rebuildTray()
  }
})

ipcMain.handle('win:moveBy', (e, step: unknown) => {
  const win = winOf(e)
  if (!win || typeof step !== 'number' || !Number.isFinite(step)) return null
  const dx = Math.max(-10, Math.min(10, step))
  const b = win.getBounds()
  const wa = workAreaOf(win)
  const minX = wa.x - 60
  const maxX = wa.x + wa.width - WIN_W + 60
  let x = b.x + dx
  let edge: 'left' | 'right' | null = null
  if (x <= minX) {
    x = minX
    edge = 'left'
  } else if (x >= maxX) {
    x = maxX
    edge = 'right'
  }
  setPos(win, x, b.y)
  return edge
})

ipcMain.on('win:dragTo', (e, x: unknown, y: unknown) => {
  const win = winOf(e)
  if (win && typeof x === 'number' && typeof y === 'number' && Number.isFinite(x) && Number.isFinite(y)) setPos(win, x, y)
})

ipcMain.handle('win:fall', (e) => {
  const win = winOf(e)
  return new Promise<void>((resolve) => {
    if (!win) return resolve()
    const wa = workAreaOf(win)
    const targetY = wa.y + wa.height - WIN_H
    let vy = 0
    const timer = setInterval(() => {
      if (win.isDestroyed()) {
        clearInterval(timer)
        return resolve()
      }
      const b = win.getBounds()
      vy = Math.min(vy + 2, 40)
      const y = Math.min(b.y + vy, targetY)
      setPos(win, b.x, y)
      if (y >= targetY) {
        clearInterval(timer)
        resolve()
      }
    }, 16)
  })
})

ipcMain.on('win:ignoreMouse', (e, ignore: unknown) => {
  winOf(e)?.setIgnoreMouseEvents(ignore === true, { forward: true })
})

ipcMain.on('pet:notify', (e, rawTitle: unknown, rawBody: unknown) => {
  const win = winOf(e)
  if (!win || typeof rawTitle !== 'string' || typeof rawBody !== 'string') return
  if (!settings.notifications || !Notification.isSupported()) return
  const title = rawTitle.slice(0, 80)
  const body = rawBody.slice(0, 200)
  const note = new Notification({ title, body, icon: iconPath })
  note.on('click', () => {
    if (!win || win.isDestroyed()) return
    win.show()
    win.moveTop()
  })
  note.show()
})

// Pets only live while someone is at the PC: idle for 3 min, locked or asleep counts as away.
const AWAY_AFTER_S = 180
let presence: 'active' | 'away' = 'active'

function setPresence(next: 'active' | 'away'): void {
  if (next === presence) return
  presence = next
  windows.forEach((w) => w.webContents.send('presence', next))
}

const checkPresence = (): void => setPresence(powerMonitor.getSystemIdleState(AWAY_AFTER_S) === 'active' ? 'active' : 'away')

ipcMain.handle('presence:get', () => presence)

ipcMain.on('menu:open', (e) => {
  const win = winOf(e)
  const id = win && idOf(win)
  if (!win || !id) return
  Menu.buildFromTemplate([...petActions(id), { type: 'separator' }, ...commonItems()]).popup({ window: win })
})

if (!app.requestSingleInstanceLock()) {
  app.quit()
} else {
  app.on('second-instance', () => windows.forEach((w) => w.show()))

  // Windows only shows toasts for apps with an explicit user model id.
  app.setAppUserModelId('com.sidepaw.app')

  // Pet windows never navigate, open popups or embed other content.
  app.on('web-contents-created', (_e, contents) => {
    contents.on('will-navigate', (ev) => ev.preventDefault())
    contents.on('will-attach-webview', (ev) => ev.preventDefault())
    contents.setWindowOpenHandler(() => ({ action: 'deny' }))
  })

  app.whenReady().then(() => {
    session.defaultSession.setPermissionRequestHandler((_wc, _perm, cb) => cb(false))
    loadSettings()
    loadPets()

    setInterval(checkPresence, 5000)
    powerMonitor.on('suspend', () => setPresence('away'))
    powerMonitor.on('lock-screen', () => setPresence('away'))
    powerMonitor.on('resume', checkPresence)
    powerMonitor.on('unlock-screen', checkPresence)

    tray = new Tray(nativeImage.createFromPath(iconPath).resize({ width: 16, height: 16 }))
    tray.setToolTip('Sidepaw')
    tray.on('click', () =>
      windows.forEach((w) => {
        w.show()
        w.moveTop()
      })
    )

    if (pets.length === 0) adopt('cat')
    else pets.forEach((p) => createPetWindow(p.id, p.species, p.name))
    rebuildTray()
  })

  // Keep running in the tray even when every pet is gone.
  app.on('window-all-closed', () => {})
}
