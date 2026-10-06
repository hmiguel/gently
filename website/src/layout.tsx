import { Fragment, type CSSProperties, type ReactNode } from 'react'
import { MADE_IN, markdownPath, SOURCE_URL, SPONSOR_URL, structuredData, titleAndDescription } from './content'
import { LANGS, pathFor, SITE_URL, texts, TEST_URL, type Lang, type Page } from './i18n'
import type { Block } from './i18n/en'

/** "01. Rules": numbered section label, as in the app. */
export function SectionLabel({ index, children }: { index: string; children: ReactNode }) {
  return (
    <p className="text-label">
      <span className="text-accent-ink">{index}.</span> {children}
    </p>
  )
}

/** Page headline, one entry per line. Never hyphenates: the size adapts to the longest word. */
export function Display({ lines }: { lines: string[] }) {
  const chars = Math.max(...lines.flatMap((line) => line.split(/\s+/)).map((word) => word.length))
  return (
    <div className="@container">
      <h1 className="text-display-fit" style={{ '--chars': chars } as CSSProperties}>
        {lines.map((line, i) => (
          <Fragment key={i}>
            {i > 0 && <br />}
            {line}
          </Fragment>
        ))}
      </h1>
    </div>
  )
}

/** Paragraphs and bullet lists from a Block[] (see website/src/i18n/en.ts). */
export function Blocks({ blocks, className = '' }: { blocks: Block[]; className?: string }) {
  return (
    <div className={`space-y-4 ${className}`}>
      {blocks.map((block, i) =>
        typeof block === 'string' ? (
          <p key={i}>{block}</p>
        ) : (
          <ul key={i} className="space-y-2">
            {block.map((item) => (
              <li key={item} className="flex gap-3">
                <span aria-hidden className="mt-[0.45em] size-2 shrink-0 bg-accent" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ),
      )}
    </div>
  )
}

/** Primary call to action: black block with the red signal square, inverts to red on hover. */
export function JoinButton({ lang }: { lang: Lang }) {
  const { s } = texts(lang)
  return (
    <a
      href={TEST_URL}
      className="group inline-flex h-16 w-full items-center justify-between gap-6 border-4 border-ink bg-ink px-6 text-sm font-bold uppercase tracking-[0.15em] text-paper transition-colors duration-150 ease-linear hover:border-accent hover:bg-accent sm:w-auto"
    >
      {s.cta.join}
      <span aria-hidden className="size-4 bg-accent group-hover:bg-paper" />
    </a>
  )
}

/** The Gently mark: red signal circle crossed by a black bar. */
export function Mark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="24 24 60 60" aria-hidden className={className}>
      <circle cx="59" cy="54" r="24" fill="#FF3000" />
      <rect x="26" y="60.5" width="44" height="8" fill="#000" />
    </svg>
  )
}

function Header({ lang, page }: { lang: Lang; page: Page }) {
  const { s } = texts(lang)
  const link = 'text-label px-2 py-3 hover:text-accent-ink'
  return (
    <header className="border-b-4 border-ink">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-6 py-4">
        <a href={pathFor(lang, 'home')} className="flex items-center gap-3 text-xl font-black uppercase tracking-tighter">
          <Mark className="size-7" />
          <span>
            Gently<span className="text-accent">.</span>
          </span>
        </a>
        <nav className="flex flex-wrap items-center gap-x-2" aria-label="Gently">
          <a href={pathFor(lang, 'privacy')} className={link} aria-current={page === 'privacy' ? 'page' : undefined}>
            {s.nav.privacy}
          </a>
          <a href={pathFor(lang, 'support')} className={link} aria-current={page === 'support' ? 'page' : undefined}>
            {s.nav.support}
          </a>
        </nav>
      </div>
      {/* Language switcher: plain links, so it works without JS; site.js remembers the choice. */}
      <nav aria-label={s.nav.language} className="border-t-2 border-ink">
        <ul className="mx-auto flex max-w-6xl flex-wrap px-4">
          {LANGS.map((l) => (
            <li key={l.code}>
              <a
                href={pathFor(l.code, page)}
                hrefLang={l.locale}
                lang={l.locale}
                data-lang={l.code}
                aria-current={l.code === lang ? 'true' : undefined}
                className={`text-label block px-2 py-2 ${l.code === lang ? 'bg-ink text-paper' : 'hover:text-accent-ink'}`}
              >
                {l.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

/** Build year for the footer (pages are rendered once, at build time). */
const YEAR = new Date().getFullYear()

function Footer({ lang }: { lang: Lang }) {
  const { s } = texts(lang)
  return (
    <footer className="border-t-4 border-ink">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-label">
          Gently<span className="text-accent">.</span> · {MADE_IN} · {YEAR}
        </p>
        <p className="flex flex-wrap gap-x-4 gap-y-2">
          <a className="text-label hover:text-accent-ink" href={pathFor(lang, 'privacy')}>
            {s.nav.privacy}
          </a>
          <a className="text-label hover:text-accent-ink" href={pathFor(lang, 'support')}>
            {s.nav.support}
          </a>
          <a className="text-label hover:text-accent-ink" href={SOURCE_URL} title={s.footer.openSource}>
            {s.footer.source}
          </a>
          <a className="text-label text-accent-ink hover:text-ink" href={SPONSOR_URL}>
            ♥ {s.footer.sponsor}
          </a>
        </p>
      </div>
    </footer>
  )
}

/** Built asset URLs and build facts, passed in by prerender.mjs. */
export interface Build {
  css: string
  /** Latin Inter subset, preloaded so the headline renders in its real font immediately. */
  font: string
  /** ISO date of the build, for sitemap and structured data. */
  date: string
}

/** Full HTML document for one page. */
export function Document({
  lang,
  page,
  build,
  noindex = false,
  children,
}: {
  lang: Lang
  page: Page
  build: Build
  noindex?: boolean
  children: ReactNode
}) {
  const { s } = texts(lang)
  const [title, description] = titleAndDescription(lang, page)
  const locale = LANGS.find((l) => l.code === lang)!.locale
  const url = SITE_URL + pathFor(lang, page)
  const ogImage = `${SITE_URL}/og.png`
  return (
    <html lang={locale}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="theme-color" content="#ffffff" />
        <meta name="robots" content={noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large'} />
        <link rel="canonical" href={url} />
        {LANGS.map((l) => (
          <link key={l.code} rel="alternate" hrefLang={l.locale} href={SITE_URL + pathFor(l.code, page)} />
        ))}
        <link rel="alternate" hrefLang="x-default" href={SITE_URL + pathFor('en', page)} />
        {/* The same page as Markdown, for AI agents and reader tools (see /llms.txt). */}
        <link rel="alternate" type="text/markdown" href={markdownPath(lang, page)} />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Gently" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1024" />
        <meta property="og:image:height" content="500" />
        <meta property="og:image:alt" content={s.meta.homeTitle} />
        <meta property="og:locale" content={locale.replace('-', '_')} />
        {LANGS.filter((l) => l.code !== lang).map((l) => (
          <meta key={l.code} property="og:locale:alternate" content={l.locale.replace('-', '_')} />
        ))}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
        <link rel="preload" href={build.font} as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="stylesheet" href={build.css} />
        {!noindex && (
          <script
            type="application/ld+json"
            // JSON-LD is data, not executed: allowed by the CSP. "<" escaped so text can't close the tag.
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(structuredData(lang, page, build.date)).replace(/</g, '\\u003c'),
            }}
          />
        )}
        {/* Remembers language choices; on "/" redirects first-time visitors to their language. */}
        <script src="/site.js" />
      </head>
      <body>
        <a
          href="#content"
          className="text-label sr-only bg-ink text-paper focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:px-4 focus:py-3"
        >
          {s.nav.skip}
        </a>
        <Header lang={lang} page={page} />
        <main id="content">{children}</main>
        <Footer lang={lang} />
      </body>
    </html>
  )
}
