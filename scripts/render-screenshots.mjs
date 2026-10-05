/**
 * Renders Play Store phone screenshots (1080×1920) from the web build with demo
 * data, so no real contacts appear. Needs `npx vite --port 5199` running.
 * Run: npm run screenshots
 */
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer-core'

const out = join(dirname(fileURLToPath(import.meta.url)), '../resources/store/screenshots')
const chrome = process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const URL = 'http://localhost:5199/'
const PIN = '123456'

const now = Date.now()
const min = 60_000
const demo = {
  permissions: { outgoing: true, incoming: true },
  enabled: true,
  rules: [
    { id: 'r1', action: 'block', direction: 'outgoing', target: 'anyone' },
    { id: 'r2', action: 'allow', direction: 'outgoing', target: 'number', number: '+351 912 000 101', label: 'Mom' },
    { id: 'r3', action: 'block', direction: 'both', target: 'number', number: '+351 913 000 202', label: 'Alex' },
    { id: 'r4', action: 'block', direction: 'incoming', target: 'hidden' },
  ],
  log: [
    { number: '+351913000202', direction: 'in', at: now - 12 * min },
    { number: '+351914000303', direction: 'out', at: now - 47 * min },
    { number: '', direction: 'in', at: now - 3 * 60 * min },
    { number: '+351913000202', direction: 'out', at: now - 26 * 60 * min },
    { number: '+351210000404', direction: 'out', at: now - 30 * 60 * min },
  ],
}

const browser = await puppeteer.launch({ executablePath: chrome, headless: true })
const page = await browser.newPage()
await page.setViewport({ width: 360, height: 640, deviceScaleFactor: 3, isMobile: true, hasTouch: true })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const clickText = async (t) => {
  await page.evaluate((t) => [...document.querySelectorAll('button')].filter((b) => b.textContent.trim() === t).at(-1).click(), t)
  await sleep(200)
}
const clickTab = async (label) => {
  // Tab text is "02Rules": the index span plus the label.
  await page.evaluate((l) => [...document.querySelectorAll('nav button')].find((b) => b.textContent.endsWith(l)).click(), label)
  await sleep(200)
}
const enter = async (code) => {
  for (const d of code) await clickText(d)
  await sleep(700)
}
const shot = async (name) => {
  await sleep(350)
  await page.screenshot({ path: join(out, name) })
  console.log('wrote', name)
}

await page.goto(URL)
await page.evaluate(() => localStorage.clear())
await page.reload()
await sleep(600)
await enter(PIN)
await enter(PIN)
await page.evaluate((demo) => localStorage.setItem('gently.dev.callguard', JSON.stringify(demo)), demo)
await page.reload()
await sleep(600)

await shot('01-locked.png')
await enter(PIN)
await shot('02-status.png')
await clickTab('Rules')
await shot('03-rules.png')
await page.click('button[aria-label^="Block calls to and from Alex"]')
await shot('04-rule-form.png')
await page.click('button[aria-label="Close"]')
await clickTab('Log')
await shot('05-log.png')
await page.click('button[aria-label="About Gently"]')
await shot('06-about.png')

await browser.close()
