import type { SidepawApi } from '../../preload'

declare global {
  interface Window {
    sidepaw: SidepawApi
  }
}
