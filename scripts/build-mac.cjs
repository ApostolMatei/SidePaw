// Builds a distributable macOS package. macOS packaging must run on macOS so
// Apple can create the correct bundle, sign it and (when configured) notarize it.
const { spawnSync } = require('node:child_process')
const fs = require('node:fs')
const path = require('node:path')

const projectDir = path.resolve(__dirname, '..')
const packageJson = JSON.parse(fs.readFileSync(path.join(projectDir, 'package.json'), 'utf8'))
const setupMode = process.argv.includes('--setup')

if (process.platform !== 'darwin') {
  console.error('Build-ul macOS trebuie rulat pe un Mac (macOS).')
  console.error('Pe Windows poți rula npm run setup:win; pentru Mac, copiază proiectul pe macOS și rulează npm ci && npm run setup:mac.')
  process.exit(1)
}

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const run = (command, args) => {
  const result = spawnSync(command, args, { stdio: 'inherit', shell: false })
  if (result.error) throw result.error
  if (result.status !== 0) process.exit(result.status ?? 1)
}

run(npm, ['run', 'icon'])
run(npm, ['run', 'build'])

const targets = setupMode ? ['pkg'] : process.argv.slice(2)
run(npm, ['exec', '--', 'electron-builder', '--mac', '--universal', ...targets])

if (setupMode) {
  const distDir = path.join(projectDir, 'dist')
  const pkgFile = fs.readdirSync(distDir).find((file) => file.startsWith(`Sidepaw-Setup-${packageJson.version}-`) && file.endsWith('.pkg'))
  if (!pkgFile) throw new Error('Installerul .pkg nu a fost creat în dist/.')

  const pkgPath = path.join(distDir, pkgFile)
  const zipPath = path.join(distDir, `Sidepaw-Setup-${packageJson.version}-macOS.zip`)
  if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath)
  run('zip', ['-j', zipPath, pkgPath])
  console.log(`Setup-ul de trimis este: ${zipPath}`)
}
