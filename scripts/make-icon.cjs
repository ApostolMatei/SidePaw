// Renders the app icon with Electron and writes build/icon.png + build/icon.ico.
const { app, BrowserWindow } = require('electron')
const { spawnSync } = require('node:child_process')
const fs = require('fs')
const path = require('path')

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffd59a"/>
      <stop offset="1" stop-color="#ffb35c"/>
    </linearGradient>
    <clipPath id="h"><path d="M108 38 C128 38 141 50 141 66 C141 74 139 79 136 83 L142 86 L133 88 C126 93 117 95 108 95 C99 95 90 93 83 88 L74 86 L80 83 C77 79 75 74 75 66 C75 50 88 38 108 38Z"/></clipPath>
  </defs>
  <rect x="10" y="10" width="236" height="236" rx="60" fill="url(#bg)" stroke="#3a2a22" stroke-width="10"/>
  <g transform="translate(-152 -26) scale(2.6)" stroke-linecap="round" stroke-linejoin="round">
    <path d="M80 58 L80 31 Q81 24 87 28 L103 43Z" fill="#f6a350" stroke="#3a2a22" stroke-width="2.6"/>
    <path d="M85 50 L85.5 35 L97 45Z" fill="#f7a3ac"/>
    <path d="M113 43 L129 28 Q135 24 136 31 L136 58Z" fill="#f6a350" stroke="#3a2a22" stroke-width="2.6"/>
    <path d="M119 45 L130.5 35 L131 50Z" fill="#f7a3ac"/>
    <path d="M108 38 C128 38 141 50 141 66 C141 74 139 79 136 83 L142 86 L133 88 C126 93 117 95 108 95 C99 95 90 93 83 88 L74 86 L80 83 C77 79 75 74 75 66 C75 50 88 38 108 38Z" fill="#f6a350" stroke="#3a2a22" stroke-width="2.6"/>
    <g clip-path="url(#h)">
      <ellipse cx="108" cy="101" rx="36" ry="12" fill="#e2803a" opacity=".4"/>
      <ellipse cx="108" cy="80" rx="14" ry="9.5" fill="#ffecd4"/>
    </g>
    <path d="M108 40 v8 M100.5 41.5 l1.8 6 M115.5 41.5 l-1.8 6" stroke="#d56f2b" stroke-width="2.8"/>
    <ellipse cx="95.5" cy="65" rx="5.6" ry="6.7" fill="#3a2a22"/>
    <ellipse cx="120.5" cy="65" rx="5.6" ry="6.7" fill="#3a2a22"/>
    <circle cx="97.2" cy="62.6" r="2.4" fill="#fff"/>
    <circle cx="122.2" cy="62.6" r="2.4" fill="#fff"/>
    <ellipse cx="88.5" cy="77" rx="5" ry="3" fill="#f47c8a" opacity=".45"/>
    <ellipse cx="127.5" cy="77" rx="5" ry="3" fill="#f47c8a" opacity=".45"/>
    <path d="M104 73.5 h8 q0 3.2 -4 5 q-4 -1.8 -4 -5z" fill="#e8737f" stroke="#3a2a22" stroke-width="1.3"/>
    <path d="M103.5 80.5 q2.25 2.8 4.5 0 q2.25 2.8 4.5 0" stroke="#3a2a22" stroke-width="1.7" fill="none"/>
  </g>
</svg>`

function pngToIco(png) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(1, 4)
  const entry = Buffer.alloc(16)
  entry.writeUInt8(0, 0) // 0 = 256px
  entry.writeUInt8(0, 1)
  entry.writeUInt8(0, 2)
  entry.writeUInt8(0, 3)
  entry.writeUInt16LE(1, 4)
  entry.writeUInt16LE(32, 6)
  entry.writeUInt32LE(png.length, 8)
  entry.writeUInt32LE(22, 12)
  return Buffer.concat([header, entry, png])
}

function pngToIcns(png, outDir) {
  if (process.platform !== 'darwin') return

  const iconset = path.join(outDir, 'icon.iconset')
  fs.rmSync(iconset, { recursive: true, force: true })
  fs.mkdirSync(iconset, { recursive: true })

  const source = require('electron').nativeImage.createFromBuffer(png)
  const sizes = [
    [16, 16, ''],
    [16, 32, '@2x'],
    [32, 32, ''],
    [32, 64, '@2x'],
    [128, 128, ''],
    [128, 256, '@2x'],
    [256, 256, ''],
    [256, 512, '@2x']
  ]
  for (const [base, size, scale] of sizes) {
    fs.writeFileSync(path.join(iconset, `icon_${base}x${base}${scale}.png`), source.resize({ width: size, height: size }).toPNG())
  }

  const result = spawnSync('iconutil', ['-c', 'icns', iconset, '-o', path.join(outDir, 'icon.icns')], { stdio: 'inherit' })
  fs.rmSync(iconset, { recursive: true, force: true })
  if (result.status !== 0) throw new Error('iconutil nu a putut crea icon.icns')
}

app.disableHardwareAcceleration()
app.whenReady().then(async () => {
  const win = new BrowserWindow({
    width: 256,
    height: 256,
    show: false,
    frame: false,
    transparent: true,
    webPreferences: { offscreen: true }
  })
  const html = `<html><body style="margin:0;background:transparent;overflow:hidden">${svg}</body></html>`
  await win.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(html))
  await new Promise((r) => setTimeout(r, 500))
  const png = (await win.webContents.capturePage()).resize({ width: 256, height: 256 }).toPNG()

  const outDir = path.join(__dirname, '..', 'build')
  fs.mkdirSync(outDir, { recursive: true })
  fs.writeFileSync(path.join(outDir, 'icon.png'), png)
  fs.writeFileSync(path.join(outDir, 'icon.ico'), pngToIco(png))
  pngToIcns(png, outDir)
  fs.writeFileSync(path.join(__dirname, '..', 'resources', 'icon.png'), png)
  console.log('icon written')
  app.quit()
})
