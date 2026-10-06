/**
 * Renders Play Store phone screenshots (1080×1920) from the web build with demo
 * data, so no real contacts appear, into resources/store/screenshots/<lang>/.
 * Needs `npx vite --port 5199` running.
 * Run: npm run screenshots            (all languages)
 *      LANGS=pt,de npm run screenshots (some)
 */
import { mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer-core'

const root = join(dirname(fileURLToPath(import.meta.url)), '../resources/store/screenshots')
const LANGS = (process.env.LANGS ?? 'en,pt,es,fr,de').split(',')

/** Demo contact names that feel local in each language. */
const NAMES = {
  en: ['Mom', 'Alex'],
  pt: ['Mãe', 'Rui'],
  es: ['Mamá', 'Pablo'],
  fr: ['Maman', 'Lucas'],
  de: ['Mama', 'Jonas'],
}
const chrome = process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const URL = 'http://localhost:5199/'
const PIN = '123456'

const now = Date.now()
const min = 60_000
const demo = (lang) => ({
  permissions: { outgoing: true, incoming: true },
  homeCountry: 'PT',
  enabled: true,
  rules: [
    { id: 'r1', action: 'block', direction: 'outgoing', target: 'anyone' },
    { id: 'r2', action: 'allow', direction: 'outgoing', target: 'number', number: '+351 912 000 101', label: NAMES[lang][0] },
    { id: 'r3', action: 'block', direction: 'both', target: 'number', number: '+351 913 000 202', label: NAMES[lang][1] },
    { id: 'r4', action: 'block', direction: 'incoming', target: 'hidden' },
  ],
  log: [
    { number: '+351913000202', direction: 'in', at: now - 12 * min },
    { number: '+351914000303', direction: 'out', at: now - 47 * min },
    { number: '', direction: 'in', at: now - 3 * 60 * min },
    { number: '+351913000202', direction: 'out', at: now - 26 * 60 * min },
    { number: '+351210000404', direction: 'out', at: now - 30 * 60 * min },
  ],
})

const browser = await puppeteer.launch({ executablePath: chrome, headless: true })
const page = await browser.newPage()
await page.setViewport({ width: 360, height: 640, deviceScaleFactor: 3, isMobile: true, hasTouch: true })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const clickText = async (t) => {
  await page.evaluate((t) => [...document.querySelectorAll('button')].filter((b) => b.textContent.trim() === t).at(-1).click(), t)
  await sleep(200)
}
// Language-independent navigation: by position, not by label.
const clickNth = async (selector, index) => {
  await page.evaluate((s, i) => document.querySelectorAll(s)[i].click(), selector, index)
  await sleep(200)
}
const enter = async (code) => {
  for (const d of code) await clickText(d)
  await sleep(700)
}
const shot = async (lang, name) => {
  await sleep(350)
  await page.screenshot({ path: join(root, lang, name) })
  console.log('wrote', `${lang}/${name}`)
}

await page.goto(URL)
await page.evaluate(() => localStorage.clear())
await page.reload()
await sleep(600)
await enter(PIN)
await enter(PIN)

for (const lang of LANGS) {
  mkdirSync(join(root, lang), { recursive: true })
  await page.evaluate(
    (lang, demo) => {
      localStorage.setItem('CapacitorStorage.gently.language', lang)
      localStorage.setItem('CapacitorStorage.gently.timeFormat', '24')
      localStorage.setItem('gently.dev.callguard', JSON.stringify(demo))
    },
    lang,
    demo(lang),
  )
  await page.reload()
  await sleep(600)

  await shot(lang, '01-locked.png')
  await enter(PIN)
  await shot(lang, '02-status.png')
  await clickNth('nav button', 1)
  await shot(lang, '03-rules.png')
  await clickNth('ul button', 2) // the rule for the second demo contact (block, both)
  await shot(lang, '04-rule-form.png')
  await clickNth('[role=dialog] header button', 0)
  await clickNth('nav button', 2)
  await shot(lang, '05-log.png')
  await clickNth('header button', 1) // About
  await shot(lang, '06-about.png')
}

await browser.close()
