import type { CSSProperties, ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/baloo-2/700.css'
import '@fontsource/nunito/600.css'
import '@fontsource/nunito/800.css'
import '../src/renderer/src/styles.css'
import './plan.css'
import Critter, { CAT_VARIANTS, INK } from '../src/renderer/src/Critter'
import type { CatVariant } from '../src/renderer/src/Critter'
import { Bolt, Bone, Fish, Heart, Sparkle } from '../src/renderer/src/Icons'
import PetCard from '../src/renderer/src/PetCard'
import type { Activity, Species } from '../src/renderer/src/pet'
import icon from '../build/icon.png'

if (new URLSearchParams(location.search).has('static')) document.documentElement.classList.add('static')

const TOTAL = 6

function Pet({
  s = 'cat',
  a = 'idle',
  w,
  v,
  flip,
  style
}: {
  s?: Species
  a?: Activity
  w: number
  v?: CatVariant
  flip?: boolean
  style?: CSSProperties
}): JSX.Element {
  return (
    <div className={`pet-box ${a}`} style={{ width: w, height: w * 0.8125, ...style }}>
      <div style={{ width: '100%', height: '100%', transform: flip ? 'scaleX(-1)' : undefined }}>
        <Critter species={s} activity={a} variant={v} />
      </div>
    </div>
  )
}

function Page({ n, children, className = '' }: { n: number; children: ReactNode; className?: string }): JSX.Element {
  return (
    <section className={`page ${className}`}>
      {children}
      {n > 1 && (
        <div className="foot">
          <span>Sidepaw · Plan de produs</span>
          <span>
            {String(n).padStart(2, '0')} / {String(TOTAL).padStart(2, '0')}
          </span>
        </div>
      )}
    </section>
  )
}

function Head({ n, kicker, title, lead }: { n: string; kicker: string; title: ReactNode; lead?: ReactNode }): JSX.Element {
  return (
    <header>
      <div className="kicker">
        <span className="num">{n}</span>
        {kicker}
      </div>
      <h2>{title}</h2>
      {lead && <p className="lead">{lead}</p>}
    </header>
  )
}

function Check({ color = '#46a758' }: { color?: string }): JSX.Element {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill={color} stroke={INK} strokeWidth="2" />
      <path d="M7.5 12.5l3 3 6-6.5" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Cloud({ x, y, w }: { x: number; y: number; w: number }): JSX.Element {
  return (
    <svg className="drop" width={w} height={w * 0.5} viewBox="0 0 100 50" style={{ left: x, top: y }}>
      <path
        d="M18 44a14 14 0 0 1 2-28 18 18 0 0 1 33-6 15 15 0 0 1 26 9 13 13 0 0 1 3 25z"
        fill="#fff"
        stroke={INK}
        strokeWidth="2.5"
        strokeLinejoin="round"
        opacity=".95"
      />
    </svg>
  )
}

function Gift({ size = 150 }: { size?: number }): JSX.Element {
  const l = { stroke: INK, strokeWidth: 3, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const }
  return (
    <svg width={size} height={size} viewBox="0 0 120 120">
      <path d="M44 26c-10-14-28-6-20 4 5 6 20 6 36 6-6-4-10-6-16-10z" fill="#5b8def" {...l} />
      <path d="M76 26c10-14 28-6 20 4-5 6-20 6-36 6 6-4 10-6 16-10z" fill="#5b8def" {...l} />
      <rect x="20" y="52" width="80" height="58" rx="8" fill="#ffecd4" {...l} />
      <rect x="14" y="36" width="92" height="20" rx="6" fill="#f59e3d" {...l} />
      <rect x="52" y="36" width="16" height="74" fill="#5b8def" {...l} />
      <path d="M26 64h20" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity=".7" />
      <g transform="translate(79 84)" fill={INK}>
        <ellipse cx="0" cy="4" rx="7" ry="6" />
        <circle cx="-7" cy="-5" r="3" />
        <circle cx="0" cy="-8" r="3" />
        <circle cx="7" cy="-5" r="3" />
      </g>
    </svg>
  )
}

/* ------------------------------------------------------------------ 1. Cover */

function Cover(): JSX.Element {
  const loop = ['Adopți', 'Îngrijești', 'Te joci', 'Câștigi cutii', 'Descoperi', 'Personalizezi']
  return (
    <Page n={1} className="cover">
      <div className="sun" />
      <div className="ground" />

      <div style={{ position: 'absolute', left: 56, right: 56, top: 46, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="wordmark">
          <img src={icon} alt="" />
          Sidepaw
        </div>
        <span className="tag">Plan de produs · 2026</span>
      </div>

      <div style={{ position: 'absolute', left: 56, right: 56, top: 150 }}>
        <h1>
          Micul tău companion.
          <br />
          <span className="outline-text">O lume întreagă</span>
          <br />
          <span className="outline-text">de colecționat.</span>
        </h1>
      </div>

      <Pet a="idle" w={520} style={{ position: 'absolute', left: 137, top: 520 }} />
      <div style={{ position: 'absolute', left: 520, top: 520, transform: 'rotate(8deg)' }}>
        <Heart size={44} />
      </div>
      <div style={{ position: 'absolute', left: 205, top: 590, transform: 'rotate(-12deg)' }}>
        <Sparkle size={40} />
      </div>

      <div style={{ position: 'absolute', left: 56, right: 56, bottom: 36 }}>
        <div className="label" style={{ marginBottom: 10 }}>
          Bucla centrală
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
          {loop.map((x, i) => (
            <span key={x} style={{ display: 'contents' }}>
              <span className="tag" style={i === 0 ? { background: 'var(--orange)' } : undefined}>
                {x}
              </span>
              {i < loop.length - 1 && <b style={{ color: 'var(--ink-soft)' }}>→</b>}
            </span>
          ))}
        </div>
        <p style={{ marginTop: 14, fontSize: 13.5, color: '#6b5242', maxWidth: 560 }}>
          Un animal care trăiește pe desktop, se bucură când te întorci și crește cu tine — plus o colecție de rarități pe care o
          descoperi jucându-te.
        </p>
      </div>
    </Page>
  )
}

/* ------------------------------------------------------------------ 2. Character */

function Character(): JSX.Element {
  const faces: [Activity, string][] = [
    ['idle', 'Relaxat'],
    ['happy', 'Fericit'],
    ['eat', 'Mănâncă'],
    ['sleep', 'Doarme'],
    ['drag', 'Surprins']
  ]
  const family: [Species, string, string, string][] = [
    ['cat', 'Miso', 'Pisică', 'Curios, jucăuș'],
    ['bichon', 'Fluffy', 'Bichon maltez', 'Alintat, pufos'],
    ['labrador', 'Max', 'Labrador', 'Loial, energic'],
    ['gorilla', 'Kong', 'Gorilă', 'Calm, puternic']
  ]
  // [side, top, text, featureX, featureY] — feature points are on the 290 px Miso below.
  const notes: ['l' | 'r', number, string, number, number][] = [
    ['l', 44, 'Coadă și urechi pe straturi separate', 254, 92],
    ['l', 112, 'Blană în trei tonuri: bază, umbră, dungi', 303, 157],
    ['l', 182, 'Picioare independente pentru pași', 283, 222],
    ['r', 34, 'Cap mare, ~45% din înălțime', 392, 80],
    ['r', 104, 'Ochi mari, cu două lumini', 413, 126],
    ['r', 176, 'Contur cald de cerneală, colțuri rotunde', 450, 150]
  ]
  return (
    <Page n={2}>
      <Head
        n="01"
        kicker="Aspect & personalitate"
        title="Miso, redesenat din temelii."
        lead="Stil de sticker: siluetă clară, contur cald de cerneală și mișcări elastice. Fiecare parte a corpului e un strat separat, așa că animațiile rulează direct în aplicație, fără video."
      />

      <div className="label" style={{ margin: '22px 0 10px' }}>
        Expresii
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
        {faces.map(([a, label]) => (
          <div key={a} className="card" style={{ padding: '6px 4px 10px', textAlign: 'center', background: a === 'happy' ? '#fff1dc' : '#fff' }}>
            <Pet a={a} w={112} style={{ margin: '0 auto' }} />
            <b style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: 14 }}>{label}</b>
          </div>
        ))}
      </div>

      <div className="card" style={{ height: 256, marginTop: 24, background: '#fff1dc', overflow: 'hidden' }}>
        <div className="label" style={{ position: 'absolute', left: 18, top: 14 }}>
          Construcție
        </div>
        <Pet a="idle" w={290} style={{ position: 'absolute', left: 194, top: 8 }} />
        <svg width="678" height="252" style={{ position: 'absolute', left: 0, top: 0 }}>
          {notes.map(([side, y, , fx, fy]) => (
            <g key={`${side}${y}`} stroke={INK} strokeWidth="1.5" fill={INK}>
              <path d={`M${side === 'l' ? 168 : 500} ${y + 15} L${fx} ${fy}`} strokeDasharray="3 3" />
              <circle cx={fx} cy={fy} r="3.5" stroke="#fff" strokeWidth="1.5" />
            </g>
          ))}
        </svg>
        {notes.map(([side, y, t]) => (
          <span
            key={t}
            style={{
              position: 'absolute',
              left: side === 'l' ? 18 : 500,
              top: y,
              width: 150,
              boxSizing: 'border-box',
              padding: '5px 9px',
              fontSize: 11,
              fontWeight: 800,
              lineHeight: 1.3,
              background: '#fff',
              border: '1.5px solid var(--ink)',
              borderRadius: 9
            }}
          >
            {t}
          </span>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginTop: 18 }}>
        {[
          ['Silueta întâi', 'Recunoști animalul doar după umbră.'],
          ['Ochii spun tot', 'Expresia vine din ochi și gură.'],
          ['Mișcare elastică', 'Squash & stretch la fiecare săritură.'],
          ['Culori calde', 'Raritățile schimbă blana și efectele.'],
          ['Mereu viu', 'Respiră, clipește, mișcă urechea.']
        ].map(([b, t], i) => (
          <div key={b} style={{ fontSize: 11.5, lineHeight: 1.35 }}>
            <span className="dot" style={{ marginBottom: 6 }}>
              {i + 1}
            </span>
            <b style={{ display: 'block', fontSize: 13 }}>{b}</b>
            <span className="muted">{t}</span>
          </div>
        ))}
      </div>

      <div className="label" style={{ margin: '22px 0 10px' }}>
        Familia de start
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {family.map(([s, name, kind, trait]) => (
          <div key={s} className="card" style={{ padding: '4px 12px 12px' }}>
            <Pet s={s} a="idle" w={124} style={{ margin: '0 auto' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <b style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: 17 }}>{name}</b>
              <span className="muted" style={{ fontSize: 11, fontWeight: 800 }}>
                {kind}
              </span>
            </div>
            <div className="muted" style={{ fontSize: 12 }}>
              {trait}
            </div>
          </div>
        ))}
      </div>
    </Page>
  )
}

/* ------------------------------------------------------------------ 3. App design */

function StatsCard({ style }: { style?: CSSProperties }): JSX.Element {
  return (
    <PetCard
      s={{ name: 'Miso', stage: 'Tânăr', age: '3 zile', trait: 'Afectuos', hunger: 72, energy: 45, happiness: 90 }}
      sleeping={false}
      style={{ ...style, animation: 'none', fontFamily: 'var(--body)' }}
    />
  )
}

function AppDesign(): JSX.Element {
  const swatches: [string, string, string][] = [
    ['#3a2a22', 'Cerneală', 'contur, text'],
    ['#fff8ee', 'Hârtie', 'carduri'],
    ['#f59e3d', 'Portocaliu', 'accent, hrană'],
    ['#5b8def', 'Albastru', 'energie, somn'],
    ['#f2668b', 'Roz', 'fericire'],
    ['#ffd24d', 'Auriu', 'rarități, premii']
  ]
  return (
    <Page n={3}>
      <Head
        n="02"
        kicker="Designul aplicației"
        title="Trăiește pe desktop, nu într-o fereastră."
        lead="Fără ferestre clasice: animalul stă pe bara de activități, iar interfața apare doar când ai nevoie de ea — un card mic, ca o bulă de dialog."
      />

      <div className="scene" style={{ marginTop: 20 }}>
        <StatsCard style={{ position: 'absolute', left: 44, top: 12, margin: 0, transform: 'scale(.9)', transformOrigin: '0 0' }} />
        <Pet a="idle" w={140} style={{ position: 'absolute', left: 56, top: 238 }} />

        <div className="thought static-bubble" style={{ position: 'absolute', left: 420, top: 160, margin: 0, animation: 'none' }}>
          <Bone size={24} />
        </div>
        <Pet s="labrador" a="walk" w={170} style={{ position: 'absolute', left: 330, top: 206 }} />

        <Pet s="bichon" a="sleep" w={150} flip style={{ position: 'absolute', left: 500, top: 221 }} />
        <span className="emote" style={{ left: 612, top: 210, fontSize: 16 }}>
          z
        </span>
        <span className="emote" style={{ left: 626, top: 188, fontSize: 21 }}>
          z
        </span>
        <span className="emote" style={{ left: 644, top: 162, fontSize: 27 }}>
          Z
        </span>

        <div className="taskbar">
          <img src={icon} alt="" />
          <span>RO</span>
          <span>14:07</span>
        </div>

        <span className="callout" style={{ left: 246, top: 16 }}>
          1
        </span>
        <span className="callout" style={{ left: 184, top: 258 }}>
          2
        </span>
        <span className="callout" style={{ left: 336, top: 240 }}>
          3
        </span>
        <span className="callout" style={{ left: 532, top: 340 }}>
          4
        </span>
      </div>

      <div className="legend">
        <div>
          <span className="callout">1</span>
          <span>
            <b>Treci cu mouse-ul</b> — apare cardul cu stări și acțiuni.
          </span>
        </div>
        <div>
          <span className="callout">2</span>
          <span>
            <b>Click</b> — îl mângâi; sare de bucurie și scoate inimioare.
          </span>
        </div>
        <div>
          <span className="callout">3</span>
          <span>
            <b>Trage-l</b> — se leagănă în aer, apoi cade pe bară.
          </span>
        </div>
        <div>
          <span className="callout">4</span>
          <span>
            <b>Tray / click dreapta</b> — meniu, adopți încă unul.
          </span>
        </div>
      </div>

      <div className="label" style={{ margin: '22px 0 10px' }}>
        Sistem vizual
      </div>
      <div className="row">
        {swatches.map(([c, n, u]) => (
          <div key={c} className="card swatch">
            <i style={{ background: c }} />
            <div>
              <b>{n}</b>
              <span className="muted">{u}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 16 }}>
        <div className="card" style={{ padding: '14px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
            <span style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: 52, lineHeight: 1 }}>Aa</span>
            <span>
              <b style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: 18 }}>Baloo 2</b>
              <br />
              <span className="muted">Titluri în plan, pe site și în magazin</span>
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginTop: 8 }}>
            <span style={{ fontFamily: 'var(--body)', fontWeight: 700, fontSize: 40, lineHeight: 1 }}>Aa</span>
            <span>
              <b style={{ fontFamily: 'var(--body)', fontSize: 15 }}>Segoe UI</b>
              <br />
              <span className="muted">Interfața aplicației — nativă Windows</span>
            </span>
          </div>
        </div>
        <div className="card" style={{ padding: '14px 18px' }}>
          <div className="label">Două registre</div>
          <p style={{ marginTop: 8, fontSize: 12.5 }}>
            <b>Personajele</b> au contur de cerneală și culori calde — ele sunt vedeta.
          </p>
          <p style={{ marginTop: 6, fontSize: 12.5 }}>
            <b>Interfața</b> e discretă: carduri albe, umbră moale, colțuri de 16 px, iconițe cu volum. Nu concurează cu animalul.
          </p>
        </div>
      </div>
    </Page>
  )
}

/* ------------------------------------------------------------------ 4. Collection */

function Collection(): JSX.Element {
  const tiers: [string, keyof typeof CAT_VARIANTS, string, string, string, string, Activity][] = [
    ['Miso Clasic', 'classic', 'Comun', '#eadccb', '#f5ede2', '60%', 'idle'],
    ['Argintiu', 'silver', 'Neobișnuit', '#8fd18a', '#dff3dc', '25%', 'idle'],
    ['Tuxedo', 'tuxedo', 'Rar', '#7ea6ff', '#dde8ff', '10%', 'idle'],
    ['Nebula', 'nebula', 'Epic', '#b692ff', '#ece2ff', '4%', 'happy'],
    ['Solaris', 'sunfire', 'Mitic', '#ffc93d', '#fff1c4', '1%', 'happy']
  ]
  return (
    <Page n={4}>
      <Head
        n="03"
        kicker="Colecție & cutii"
        title="Fiecare cutie poate ascunde o raritate."
        lead="Cinci niveluri de raritate. Variantele rare au blană, animații și efecte proprii — dar același suflet: rămân animale pe care le îngrijești, nu doar cartonașe."
      />

      <div className="rarity" style={{ marginTop: 26 }}>
        {tiers.map(([name, v, tier, color, bg, chance, a], i) => (
          <div key={name} className="card r-card" style={i === 4 ? { boxShadow: '0 4px 0 var(--ink), 0 0 0 5px #ffe28a' } : undefined}>
            <div className="r-top" style={{ background: bg }}>
              {i >= 3 && <div className="rays" style={{ opacity: i === 4 ? 1 : 0.6 }} />}
              {i >= 3 && (
                <>
                  <div style={{ position: 'absolute', left: 10, top: 10 }}>
                    <Sparkle size={18} fill={i === 4 ? '#ffd24d' : '#c9b2ff'} />
                  </div>
                  <div style={{ position: 'absolute', right: 12, top: 30 }}>
                    <Sparkle size={13} fill={i === 4 ? '#ffd24d' : '#c9b2ff'} />
                  </div>
                </>
              )}
              <Pet a={a} v={CAT_VARIANTS[v]} w={132} />
            </div>
            <div className="r-body">
              <div className="r-name">{name}</div>
              <span className="r-pill" style={{ background: color }}>
                {tier}
              </span>
              <div className="r-chance">{chance}</div>
              <div className="muted" style={{ fontSize: 10.5, fontWeight: 800 }}>
                șansă / cutie
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22, marginTop: 30 }}>
        <div>
          <h3>Reguli corecte, afișate mereu</h3>
          <ul className="list" style={{ marginTop: 12 }}>
            {[
              ['Cutiile se câștigă', 'Din mini-jocuri, îngrijire zilnică și evenimente.'],
              ['Șansele sunt publice', 'Procentele apar pe fiecare cutie, înainte s-o deschizi.'],
              ['Duplicatele nu se pierd', 'Devin materiale pentru accesorii și decoruri.'],
              ['Garanție prin progres', 'Minim o raritate „Rar” la fiecare 10 cutii.'],
              ['Cosmetice la preț fix', 'Ce vrei sigur, cumperi direct din magazin.']
            ].map(([b, t], i) => (
              <li key={b}>
                <span className="dot">{i + 1}</span>
                <span>
                  <b>{b}</b>
                  <span className="muted">{t}</span>
                </span>
              </li>
            ))}
          </ul>
          <p className="muted" style={{ marginTop: 14, fontSize: 11 }}>
            Procentele sunt un punct de plecare — le ajustăm după test.
          </p>
        </div>

        <div className="card" style={{ overflow: 'hidden', background: '#fff1dc', padding: 0 }}>
          <div style={{ position: 'relative', height: 250, overflow: 'hidden', borderBottom: '2px solid var(--ink)', background: '#dde8ff' }}>
            <div className="rays" style={{ inset: '-40%' }} />
            <div style={{ position: 'absolute', left: 30, top: 58 }}>
              <Gift size={140} />
            </div>
            <Pet a="happy" v={CAT_VARIANTS.tuxedo} w={170} style={{ position: 'absolute', right: 14, top: 70 }} />
            <span className="tag" style={{ position: 'absolute', left: 16, top: 16, background: '#7ea6ff' }}>
              <Sparkle size={16} fill="#fff" /> Rar! Tuxedo
            </span>
          </div>
          <div style={{ padding: '14px 18px 18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 12 }}>
              <span>Progres spre „Rar” garantat</span>
              <span>7 / 10</span>
            </div>
            <div className="progress" style={{ marginTop: 7 }}>
              <i style={{ width: '70%' }} />
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <span className="tag" style={{ fontSize: 11 }}>
                +3 materiale
              </span>
              <span className="tag" style={{ fontSize: 11 }}>
                Colecție 12 / 40
              </span>
            </div>
          </div>
        </div>
      </div>
    </Page>
  )
}

/* ------------------------------------------------------------------ 5. Game + Plus */

function GameAndPlus(): JSX.Element {
  const drops: [ReactNode, number, number, number][] = [
    [<Fish size={34} />, 150, 70, -20],
    [<Fish size={30} />, 250, 210, 16],
    [<Sparkle size={30} />, 130, 150, 0],
    [<Heart size={28} />, 262, 64, 12],
    [<Fish size={28} />, 40, 160, 30]
  ]
  return (
    <Page n={5}>
      <Head n="04" kicker="Jocuri & motiv să revii" title="Joci un minut. Câștigi ceva real." />

      <div style={{ display: 'grid', gridTemplateColumns: '330px 1fr', gap: 24, marginTop: 24 }}>
        <div className="game">
          <Cloud x={24} y={64} w={96} />
          <Cloud x={196} y={132} w={110} />
          {drops.map(([el, x, y, r], i) => (
            <div key={i} className="drop" style={{ left: x, top: y, transform: `rotate(${r}deg)` }}>
              {el}
            </div>
          ))}
          <div className="grass" />
          <Pet a="happy" w={170} style={{ position: 'absolute', left: 80, bottom: 26 }} />
          <div className="hud">
            <span className="tag" style={{ background: '#ffd24d' }}>
              <Sparkle size={15} /> 1 240
            </span>
            <span className="tag">x3 combo</span>
            <span className="tag" style={{ background: '#fff' }}>
              0:42
            </span>
          </div>
        </div>

        <div>
          <h3>Primul joc: Ploaia de pești</h3>
          <p className="muted" style={{ marginTop: 6 }}>
            Rundă de 60–90 de secunde. Prinzi ce cade, eviți șosetele, faci combo-uri. Simplu de învățat, greu de lăsat.
          </p>
          <div className="label" style={{ margin: '16px 0 8px' }}>
            Recompense
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <span className="tag" style={{ background: '#dde8ff' }}>
              <Bolt size={15} /> Experiență
            </span>
            <span className="tag" style={{ background: '#ffdbe5' }}>
              <Heart size={15} /> Accesorii
            </span>
            <span className="tag" style={{ background: '#ffe0b3' }}>
              <Sparkle size={15} /> Cutii
            </span>
          </div>
          <div className="label" style={{ margin: '18px 0 8px' }}>
            De ce revii
          </div>
          <ul className="checks" style={{ marginTop: 0 }}>
            <li>
              <Check color="#f59e3d" /> Colecții sezoniere și evenimente scurte
            </li>
            <li>
              <Check color="#f59e3d" /> Animalul crește: pui → tânăr → adult
            </li>
            <li>
              <Check color="#f59e3d" /> Pauzele nu șterg progresul — nimeni nu „moare”
            </li>
            <li>
              <Check color="#f59e3d" /> Mai târziu: Expediții și Memorie
            </li>
          </ul>
        </div>
      </div>

      <div style={{ marginTop: 56 }}>
        <Head n="05" kicker="Plus · 10 $ pe lună" title="Gratuit e complet. Plus e mai mult." />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginTop: 20 }}>
        <div className="card plan-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Free</h3>
            <span className="price">0 $</span>
          </div>
          <ul className="checks">
            {['Un companion activ', 'Îngrijire completă și evoluție', 'Primul mini-joc', 'Colecția de bază'].map((x) => (
              <li key={x}>
                <Check /> {x}
              </li>
            ))}
          </ul>
        </div>
        <div className="card plan-card" style={{ background: '#ffe0b3' }}>
          <span className="tag" style={{ position: 'absolute', right: 18, top: -16, background: 'var(--orange)' }}>
            <Sparkle size={15} /> Recomandat
          </span>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Plus</h3>
            <span className="price">
              10 $<span style={{ fontSize: 14 }}> / lună</span>
            </span>
          </div>
          <ul className="checks">
            {['Mai multe animale pe ecran simultan', 'Sincronizare între calculatoare', 'Decoruri premium', 'Cosmetice noi, garantat, în fiecare lună'].map(
              (x) => (
                <li key={x}>
                  <Check color="#f59e3d" /> {x}
                </li>
              )
            )}
          </ul>
        </div>
      </div>
      <p className="muted" style={{ marginTop: 14, fontSize: 12 }}>
        Animalele obținute rămân în colecție și după anulare. Cei 10 $ sunt o ipoteză de preț, de testat.
      </p>
    </Page>
  )
}

/* ------------------------------------------------------------------ 6. Site + roadmap */

function Launch(): JSX.Element {
  const steps: [string, string, string][] = [
    ['Miso redesenat', 'Aspect + animații + interfață', 'În lucru'],
    ['Joc + colecție', 'O experiență completă', 'Următorul'],
    ['Test cu oameni', '30–50 testeri, feedback', ''],
    ['Plus + site', 'Lansare și extindere', '']
  ]
  return (
    <Page n={6}>
      <Head n="06" kicker="Site & validare" title="Arată-l viu. Apoi măsoară." />

      <div className="browser" style={{ marginTop: 20 }}>
        <div className="bar">
          <i style={{ background: '#ff8a80' }} />
          <i style={{ background: '#ffd24d' }} />
          <i style={{ background: '#8fd18a' }} />
          <span className="url">sidepaw.app</span>
        </div>
        <div style={{ position: 'relative', height: 206, padding: '22px 30px' }}>
          <div className="wordmark" style={{ fontSize: 17 }}>
            <img src={icon} alt="" style={{ width: 28, height: 28 }} />
            Sidepaw
          </div>
          <h2 style={{ fontSize: 32, maxWidth: 360, marginTop: 14 }}>Un prieten mic pe desktopul tău.</h2>
          <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
            <span className="tag" style={{ background: 'var(--orange)', padding: '8px 16px', fontSize: 13 }}>
              Descarcă pentru Windows
            </span>
            <span className="tag" style={{ padding: '8px 16px', fontSize: 13 }}>
              Vezi raritățile
            </span>
          </div>
          <div style={{ position: 'absolute', right: 62, top: 14, width: 176, height: 176, borderRadius: '50%', background: '#ffe0b3', border: '2px solid var(--ink)' }} />
          <Pet a="happy" w={220} style={{ position: 'absolute', right: 40, top: 22 }} />
          <div style={{ position: 'absolute', right: 250, top: 34 }}>
            <Heart size={26} />
          </div>
        </div>
      </div>
      <p className="muted" style={{ marginTop: 10, fontSize: 12 }}>
        Animal interactiv în primul ecran · demo real din aplicație · galerie cu rarități · comparație Free / Plus
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: 18 }}>
        {[
          ['30–50', 'testeri reali'],
          ['Ziua 7', 'câți revin după o săptămână'],
          ['Plus', 'câți plătesc și de ce'],
          ['Anulări', 'motivele, din interviuri']
        ].map(([b, t]) => (
          <div key={b} className="card kpi">
            <div className="big">{b}</div>
            <div className="muted" style={{ fontSize: 12, fontWeight: 600 }}>
              {t}
            </div>
          </div>
        ))}
      </div>
      <p className="muted" style={{ marginTop: 10, fontSize: 12 }}>
        Inventarul și recompensele se validează pe server înainte de lansarea plăților.
      </p>

      <div className="label" style={{ margin: '20px 0 12px' }}>
        Ordinea de construit
      </div>
      <div className="steps">
        {steps.map(([t, s, badge], i) => (
          <div key={t} className={`step${i === 0 ? ' now' : ''}`}>
            <div className="circle">{i + 1}</div>
            <b style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: 16, display: 'block' }}>{t}</b>
            <span className="muted" style={{ fontSize: 12 }}>
              {s}
            </span>
            {badge && (
              <div>
                <span className="r-pill" style={{ background: i === 0 ? 'var(--orange)' : '#fff' }}>
                  {badge}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="banner" style={{ marginTop: 18 }}>
        <div className="label" style={{ color: '#ffb866' }}>
          Primul pas
        </div>
        <div style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: 25, lineHeight: 1.15, marginTop: 4, maxWidth: 430 }}>
          Un Miso impecabil și un mini-joc complet.
        </div>
        <Pet a="idle" w={190} flip style={{ position: 'absolute', right: 20, bottom: -34 }} />
      </div>

      <p className="muted" style={{ position: 'absolute', left: 56, right: 56, bottom: 48, fontSize: 10.5 }}>
        1.000 abonați × 10 $ = 10.000 $ brut / lună, înainte de taxe și costuri — exemplu aritmetic, nu prognoză.
      </p>
    </Page>
  )
}

function Doc(): JSX.Element {
  return (
    <div className="doc">
      <Cover />
      <Character />
      <AppDesign />
      <Collection />
      <GameAndPlus />
      <Launch />
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<Doc />)
