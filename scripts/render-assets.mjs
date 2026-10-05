/**
 * Renders the PNG assets from resources/icon.svg with the system Chrome:
 *   - legacy launcher PNGs (android/app/src/main/res/mipmap-*)
 *   - Play Store icon 512×512 and feature graphic 1024×500 (resources/store)
 *
 * The adaptive icon itself is a vector (res/drawable/ic_launcher_foreground.xml)
 * and needs no rendering. Run: npm run assets
 */
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer-core'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const res = join(root, 'android/app/src/main/res')
const chrome = process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

const icon = readFileSync(join(root, 'resources/icon.svg'), 'utf8').replace(/<!--[\s\S]*?-->\s*/, '')
const iconUri = `data:image/svg+xml;base64,${Buffer.from(icon).toString('base64')}`
const inter = readFileSync(join(root, 'node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2'))
const interUri = `data:font/woff2;base64,${inter.toString('base64')}`

// Same tokens as src/index.css.
const css = `
  @font-face { font-family: Inter; src: url(${interUri}) format('woff2'); font-weight: 100 900; }
  :root { --paper: #fff; --ink: #000; --accent: #ff3000; }
  * { margin: 0; box-sizing: border-box; }
  body { background: transparent; font-family: Inter, sans-serif; }
`

const DENSITIES = { mdpi: 48, hdpi: 72, xhdpi: 96, xxhdpi: 144, xxxhdpi: 192 }

/** Launcher PNG: the icon scaled into the legacy 48dp frame, square or circular. */
const launcherHtml = (round) => `
  <style>${css}
    .frame { width: 100vw; height: 100vh; overflow: hidden; background: var(--paper);
      border-radius: ${round ? '50%' : '8%'}; }
    .frame img { width: 150%; height: 150%; margin: -25%; display: block; }
  </style>
  <div class="frame"><img src="${iconUri}"></div>`

/** Play Store icon: full bleed, Play applies its own mask. */
const storeIconHtml = `
  <style>${css} img { width: 100vw; height: 100vh; display: block; transform: scale(1.35); }
    body { background: var(--paper); overflow: hidden; }</style>
  <img src="${iconUri}">`

/** Feature graphic: wordmark on the grid, the signal composition bleeding off the right edge. */
const featureHtml = `
  <style>${css}
    body { width: 1024px; height: 500px; overflow: hidden; position: relative; background-color: var(--paper);
      background-image: linear-gradient(to right, rgb(0 0 0 / .05) 1px, transparent 1px),
                        linear-gradient(to bottom, rgb(0 0 0 / .05) 1px, transparent 1px);
      background-size: 24px 24px; }
    .circle { position: absolute; width: 400px; height: 400px; border-radius: 50%; background: var(--accent);
      right: -90px; top: 20px; box-shadow: 0 0 0 20px rgb(255 48 0 / .1); }
    .bar { position: absolute; height: 40px; background: var(--ink); left: 600px; right: 130px; top: 150px; }
    .text { position: absolute; left: 64px; bottom: 72px; }
    .label { font-size: 18px; font-weight: 700; letter-spacing: .2em; text-transform: uppercase; }
    .label b { color: #e02a00; }
    h1 { font-size: 168px; font-weight: 900; letter-spacing: -.05em; line-height: .85; text-transform: uppercase;
      margin-top: 20px; }
    h1 span { color: var(--accent); }
    .rule { position: absolute; left: 0; right: 0; bottom: 0; height: 12px; background: var(--ink); }
  </style>
  <div class="circle"></div><div class="bar"></div>
  <div class="text"><p class="label"><b>01.</b> Call blocker</p><h1>Gently<span>.</span></h1></div>
  <div class="rule"></div>`

const browser = await puppeteer.launch({ executablePath: chrome, headless: true })
const page = await browser.newPage()

async function render(html, path, width, height, transparent = false) {
  await page.setViewport({ width, height, deviceScaleFactor: 1 })
  await page.setContent(html, { waitUntil: 'load' })
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({ path, omitBackground: transparent })
  console.log('wrote', path.replace(root + '/', ''))
}

for (const [density, size] of Object.entries(DENSITIES)) {
  await render(launcherHtml(false), join(res, `mipmap-${density}/ic_launcher.png`), size, size, true)
  await render(launcherHtml(true), join(res, `mipmap-${density}/ic_launcher_round.png`), size, size, true)
}
await render(storeIconHtml, join(root, 'resources/store/icon-512.png'), 512, 512)
await render(featureHtml, join(root, 'resources/store/feature-graphic.png'), 1024, 500)

await browser.close()
