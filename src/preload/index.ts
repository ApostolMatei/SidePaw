import { contextBridge, ipcRenderer } from 'electron'

const api = {
  load: (id: string): Promise<unknown> => ipcRenderer.invoke('pet:load', id),
  save: (id: string, data: unknown): Promise<void> => ipcRenderer.invoke('pet:save', id, data),
  moveBy: (dx: number): Promise<'left' | 'right' | null> => ipcRenderer.invoke('win:moveBy', dx),
  dragTo: (x: number, y: number): void => ipcRenderer.send('win:dragTo', x, y),
  fall: (): Promise<void> => ipcRenderer.invoke('win:fall'),
  setIgnoreMouse: (ignore: boolean): void => ipcRenderer.send('win:ignoreMouse', ignore),
  openMenu: (): void => ipcRenderer.send('menu:open'),
  getPresence: (): Promise<'active' | 'away'> => ipcRenderer.invoke('presence:get'),
  onPresence: (cb: (state: 'active' | 'away') => void): (() => void) => {
    const listener = (_e: unknown, state: 'active' | 'away'): void => cb(state)
    ipcRenderer.on('presence', listener)
    return () => {
      ipcRenderer.removeListener('presence', listener)
    }
  },
  notify: (title: string, body: string): void => ipcRenderer.send('pet:notify', title, body),
  onAction: (cb: (action: string) => void): (() => void) => {
    const listener = (_e: unknown, action: string): void => cb(action)
    ipcRenderer.on('pet:action', listener)
    return () => {
      ipcRenderer.removeListener('pet:action', listener)
    }
  }
}

contextBridge.exposeInMainWorld('sidepaw', api)

export type SidepawApi = typeof api
