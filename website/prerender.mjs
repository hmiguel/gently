/**
 * Third step of `npm run site:build`: turns the SSR bundle into static files.
 *   website/dist/            ← CSS + fonts from the client build (kept)
 *   website/.ssr/render.js   ← page renderer from the SSR build
 * Writes every page × language, 404.html, sitemap.xml, robots.txt, _headers, and
 * copies the favicon, Open Graph image, site.js and the screenshots the pages use.
 */
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const site = dirname(fileURLToPath(import.meta.url))
const repo = join(site, '..')
const dist = join(site, 'dist')

const { renderPage, renderNotFound, LANGS, PAGES, pathFor, SITE_URL } = await import(
  pathToFileURL(join(site, '.ssr/render.js')).href
)

const manifest = JSON.parse(readFileSync(join(dist, '.vite/manifest.json'), 'utf8'))
const css = '/' + manifest['src/site.css'].file

function write(path, content) {
  const file = join(dist, path)
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, content)
}

let pages = 0
for (const { code } of LANGS) {
  for (const page of PAGES) {
    write(join(pathFor(code, page), 'index.html'), renderPage(code, page, css))
    pages++
  }
}
write('404.html', renderNotFound(css))

// Static assets, from their single sources in the repo.
write('favicon.svg', readFileSync(join(repo, 'resources/icon.svg'), 'utf8').replace(/<!--[\s\S]*?-->\s*/, ''))
copyFileSync(join(repo, 'resources/store/feature-graphic.png'), join(dist, 'og.png'))
copyFileSync(join(site, 'src/site.js'), join(dist, 'site.js'))
const SCREENS = ['02-status', '03-rules', '04-rule-form', '05-log']
for (const { code } of LANGS) {
  mkdirSync(join(dist, 'img', code), { recursive: true })
  for (const name of SCREENS) {
    copyFileSync(join(repo, 'resources/store/screenshots', code, `${name}.png`), join(dist, 'img', code, `${name}.png`))
  }
}

// Sitemap with hreflang alternates for every page.
const urls = PAGES.flatMap((page) =>
  LANGS.map(({ code }) => {
    const alternates = LANGS.map(
      (l) => `    <xhtml:link rel="alternate" hreflang="${l.locale}" href="${SITE_URL}${pathFor(l.code, page)}"/>`,
    ).join('\n')
    return `  <url>\n    <loc>${SITE_URL}${pathFor(code, page)}</loc>\n${alternates}\n  </url>`
  }),
)
write(
  'sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`,
)
write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`)

// Cloudflare Pages headers: nothing third-party is ever loaded, so lock everything to this origin.
write(
  '_headers',
  `/*
  Content-Security-Policy: default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; font-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()

/assets/*
  Cache-Control: public, max-age=31536000, immutable
`,
)

console.log(`prerendered ${pages} pages + 404, sitemap, robots, headers → ${dist}`)
