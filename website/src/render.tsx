/* eslint-disable react/only-export-components -- build-time renderer, never hot-reloaded */
import { renderToStaticMarkup } from 'react-dom/server'
import { pathFor, texts, type Lang, type Page } from './i18n'
import { Document } from './layout'
import { Landing } from './pages/Landing'
import { Privacy } from './pages/Privacy'
import { Support } from './pages/Support'

export { LANGS, PAGES, pathFor, SITE_URL } from './i18n'

const BODIES: Record<Page, (props: { lang: Lang }) => React.JSX.Element> = {
  home: Landing,
  privacy: Privacy,
  support: Support,
}

/** One page as a complete HTML document. Used at build time only (website/prerender.mjs). */
export function renderPage(lang: Lang, page: Page, css: string) {
  const Body = BODIES[page]
  return (
    '<!doctype html>' +
    renderToStaticMarkup(
      <Document lang={lang} page={page} css={css}>
        <Body lang={lang} />
      </Document>,
    )
  )
}

/** 404 page (English, links home). Cloudflare Pages serves /404.html for unknown paths. */
export function renderNotFound(css: string) {
  const { s } = texts('en')
  return (
    '<!doctype html>' +
    renderToStaticMarkup(
      <Document lang="en" page="home" css={css}>
        <section className="swiss-grid">
          <div className="mx-auto max-w-6xl px-6 py-24">
            <h1 className="text-display">{s.notFound.title}</h1>
            <p className="mt-6 text-xl font-medium">{s.notFound.body}</p>
            <a href={pathFor('en', 'home')} className="text-label mt-8 inline-block border-b-2 border-accent pb-1">
              {s.notFound.home} →
            </a>
          </div>
        </section>
      </Document>,
    )
  )
}
