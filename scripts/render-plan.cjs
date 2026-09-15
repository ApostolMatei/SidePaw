// Prints the design plan (served by `npx vite --config design/vite.config.ts`) to PDF,
// plus one PNG per page for quick review.
// Usage: npx electron scripts/render-plan.cjs [url] [--png]
const { app, BrowserWindow } = require('electron')
const fs = require('fs')
const path = require('path')

const url = process.argv.find((a) => a.startsWith('http')) ?? 'http://localhost:5199/plan.html'
const wantPng = process.argv.includes('--png')
const root = path.join(__dirname, '..')
const outPdf = path.join(root, 'output', 'pdf', 'Sidepaw-Plan.pdf')
const pngDir = path.join(root, 'tmp', 'plan-pages')

const PAGE_W = 794
const PAGE_H = 1122

app.whenReady().then(async () => {
  const win = new BrowserWindow({
    width: PAGE_W,
    height: PAGE_H,
    show: false,
    useContentSize: true
  })
  await win.loadURL(url + (url.includes('?') ? '&' : '?') + 'static')
  await win.webContents.executeJavaScript('document.fonts.ready.then(() => new Promise((r) => setTimeout(r, 800)))')

  if (wantPng) {
    // Screens are shorter than an A4 page, so previews are captured at 90 % zoom.
    const ZOOM = 0.9
    fs.mkdirSync(pngDir, { recursive: true })
    await win.webContents.executeJavaScript(
      "document.querySelector('.doc').style.gap = '0px'; document.querySelector('.doc').style.padding = '0px'; document.querySelector('.doc').style.alignItems = 'flex-start'; 1"
    )
    win.webContents.setZoomFactor(ZOOM)
    const pages = await win.webContents.executeJavaScript("document.querySelectorAll('.page').length")
    for (let i = 0; i < pages; i++) {
      await win.webContents.executeJavaScript(`window.scrollTo(0, ${i * PAGE_H}); new Promise((r) => setTimeout(r, 200))`)
      const img = await win.webContents.capturePage({ x: 0, y: 0, width: Math.floor(PAGE_W * ZOOM), height: Math.floor(PAGE_H * ZOOM) })
      fs.writeFileSync(path.join(pngDir, `page-${i + 1}.png`), img.toPNG())
    }
    win.webContents.setZoomFactor(1)
    await win.webContents.executeJavaScript('window.scrollTo(0, 0); 1')
  }

  const pdf = await win.webContents.printToPDF({
    pageSize: 'A4',
    printBackground: true,
    margins: { marginType: 'none' },
    preferCSSPageSize: true
  })
  fs.mkdirSync(path.dirname(outPdf), { recursive: true })
  fs.writeFileSync(outPdf, pdf)
  console.log('wrote', outPdf)
  app.quit()
})
