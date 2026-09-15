import { createRoot } from 'react-dom/client'
import '@fontsource/baloo-2/700.css'
import '@fontsource/nunito/600.css'
import '@fontsource/nunito/800.css'
import Critter from '../src/renderer/src/Critter'
import type { Activity, Species } from '../src/renderer/src/pet'

const SPECIES: Species[] = ['cat', 'bichon', 'labrador', 'gorilla']
const q = new URLSearchParams(location.search)
const SIZE = Number(q.get('size') ?? 176)
const ACTS = (q.get('acts')?.split(',') ?? ['idle', 'walk', 'happy', 'eat', 'sleep', 'drag', 'fall']) as Activity[]
const ONLY = q.get('species')?.split(',') as Species[] | undefined

function Sheet(): JSX.Element {
  return (
    <div style={{ padding: 24, background: '#fff3e2', fontFamily: 'Nunito', minHeight: '100vh' }}>
      <table style={{ borderCollapse: 'separate', borderSpacing: 8 }}>
        <thead>
          <tr>
            <th />
            {ACTS.map((a) => (
              <th key={a} style={{ fontFamily: 'Baloo 2', color: '#3a2a22' }}>
                {a}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(ONLY ?? SPECIES).map((s) => (
            <tr key={s}>
              <th style={{ fontFamily: 'Baloo 2', color: '#3a2a22' }}>{s}</th>
              {ACTS.map((a) => (
                <td key={a} className={a} style={{ background: '#fff', borderRadius: 16, padding: 10 }}>
                  <div className={a}>
                    <div style={{ width: SIZE, height: SIZE * 0.8125 }}>
                      <Critter species={s} activity={a} />
                    </div>
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<Sheet />)
