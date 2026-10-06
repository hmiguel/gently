/**
 * Third step of `npm run site:build`: turns the SSR bundle into static files.
 *   website/dist/            ← CSS + fonts from the client build (kept)
 *   website/.ssr/render.js   ← page renderer from the SSR build
 * Writes every page × language as HTML and Markdown, 404.html, llms.txt, llms-full.txt,
 * sitemap.xml, robots.txt, _headers and site.webmanifest, and generates the icons and the
 * responsive WebP screenshots the pages use.
 */
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import sharp from 'sharp'

const site = dirname(fileURLToPath(import.meta.url))
const repo = join(site, '..')
const dist = join(site, 'dist')

const r = await import(pathToFileURL(join(site, '.ssr/render.js')).href)
const { LANGS, PAGES, SCREENS, SCREEN_WIDTHS, SITE_URL, pathFor, markdownPath } = r

const manifest = JSON.parse(readFileSync(join(dist, '.vite/manifest.json'), 'utf8'))
const entry = manifest['src/site.css']
const build = {
  css: '/' + entry.file,
  font: '/' + entry.assets.find((a) => /inter-latin-wght-normal/.test(a)),
  date: new Date().toISOString().slice(0, 10),
}

function write(path, content) {
  const file = join(dist, path)
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, content)
}

// Pages: HTML for people and search engines, Markdown for AI agents.
let pages = 0
for (const { code } of LANGS) {
  for (const page of PAGES) {
    write(join(pathFor(code, page), 'index.html'), r.renderPage(code, page, build))
    write(markdownPath(code, page), r.renderMarkdown(code, page))
    pages++
  }
}
write('404.html', r.renderNotFound(build))
write('llms.txt', r.renderLlmsTxt())
write('llms-full.txt', r.renderLlmsFull())

// Icons and images, from their single sources in the repo.
const icon = readFileSync(join(repo, 'resources/icon.svg'), 'utf8').replace(/<!--[\s\S]*?-->\s*/, '')
write('favicon.svg', icon)
const icon512 = join(repo, 'resources/store/icon-512.png')
copyFileSync(icon512, join(dist, 'icon-512.png'))
await sharp(icon512).resize(180).png().toFile(join(dist, 'apple-touch-icon.png'))
copyFileSync(join(repo, 'resources/store/feature-graphic.png'), join(dist, 'og.png'))
copyFileSync(join(site, 'src/site.js'), join(dist, 'site.js'))
let images = 0
for (const { code } of LANGS) {
  mkdirSync(join(dist, 'img', code), { recursive: true })
  for (const name of SCREENS) {
    const source = join(repo, 'resources/store/screenshots', code, `${name}.png`)
    for (const width of SCREEN_WIDTHS) {
      await sharp(source).resize(width).webp({ quality: 82 }).toFile(join(dist, 'img', code, `${name}-${width}.webp`))
      images++
    }
  }
}

write(
  'site.webmanifest',
  JSON.stringify(
    {
      name: 'Gently',
      short_name: 'Gently',
      description: 'Call blocker for Android',
      start_url: '/',
      display: 'browser',
      background_color: '#ffffff',
      theme_color: '#ffffff',
      icons: [
        { src: '/favicon.svg', type: 'image/svg+xml', sizes: 'any' },
        { src: '/icon-512.png', type: 'image/png', sizes: '512x512' },
      ],
    },
    null,
    2,
  ),
)

// Sitemap with hreflang alternates for every page.
const urls = PAGES.flatMap((page) =>
  LANGS.map(({ code }) => {
    const alternates = LANGS.map(
      (l) => `    <xhtml:link rel="alternate" hreflang="${l.locale}" href="${SITE_URL}${pathFor(l.code, page)}"/>`,
    ).join('\n')
    return `  <url>\n    <loc>${SITE_URL}${pathFor(code, page)}</loc>\n    <lastmod>${build.date}</lastmod>\n${alternates}\n    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${pathFor('en', page)}"/>\n  </url>`
  }),
)
write(
  'sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`,
)

// Search engines and AI agents are all welcome; the named groups make that explicit.
const AI_AGENTS = [
  'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'anthropic-ai',
  'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot-Extended', 'CCBot', 'Meta-ExternalAgent',
  'Amazonbot', 'DuckAssistBot', 'MistralAI-User', 'cohere-ai',
]
write(
  'robots.txt',
  `# Gently welcomes search engines and AI agents.
# Summary for language models: ${SITE_URL}/llms.txt (full text: ${SITE_URL}/llms-full.txt)
# Every page is also available as Markdown at <page>/index.md.

User-agent: *
Allow: /

${AI_AGENTS.map((a) => `User-agent: ${a}`).join('\n')}
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`,
)

// Cloudflare Pages headers: nothing third-party is ever loaded, so lock everything to this origin.
write(
  '_headers',
  `/*
  Content-Security-Policy: default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; font-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()

/*.md
  Content-Type: text/markdown; charset=utf-8
  X-Robots-Tag: noindex

/llms.txt
  Content-Type: text/plain; charset=utf-8

/llms-full.txt
  Content-Type: text/plain; charset=utf-8

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/img/*
  Cache-Control: public, max-age=604800
`,
)

console.log(`prerendered ${pages} pages (HTML + Markdown) + 404, ${images} WebP images, llms.txt, sitemap, robots, headers`)
