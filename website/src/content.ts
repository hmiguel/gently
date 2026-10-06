/**
 * One source for every machine-readable view of the site: the support answers (HTML page,
 * Markdown and FAQPage data all use them), the Markdown version of each page, llms.txt and
 * the schema.org JSON-LD. Pages and these files therefore never disagree.
 */
import { CONTACT, LANGS, pathFor, PAGES, SITE_URL, texts, TEST_URL, type Lang, type Page } from './i18n'
import type { Block } from './i18n/en'

export const SOURCE_URL = 'https://github.com/hmiguel/gently'
export const LICENSE_URL = 'https://www.gnu.org/licenses/gpl-3.0.html'
export const SCREENS = ['02-status', '03-rules', '04-rule-form', '05-log']
/** Widths prerender.mjs generates for every screenshot (WebP). */
export const SCREEN_WIDTHS = [360, 540, 720, 1080]

/** Support FAQ with each answer completed by the app's own wording. */
export function faq(lang: Lang) {
  const { s, app } = texts(lang)
  return s.support.faq.map((item) => {
    let a: Block[] = item.a
    if (item.id === 'permissions') a = [...a, app.about.permissionPoints.map((p) => `${p.title}: ${p.body}`)]
    if (item.id === 'spam') a = [...a, app.settings.restoreSpam.steps]
    if (item.id === 'emergency') a = [...a, app.about.emergencyBody]
    return { ...item, a }
  })
}

/** Feature cards: the app's "how it works" points plus site extras. */
export function features(lang: Lang) {
  const { s, app } = texts(lang)
  return [...app.about.points, ...s.home.extras]
}

export function titleAndDescription(lang: Lang, page: Page): [string, string] {
  const { meta } = texts(lang).s
  if (page === 'privacy') return [meta.privacyTitle, meta.privacyDescription]
  if (page === 'support') return [meta.supportTitle, meta.supportDescription]
  return [meta.homeTitle, meta.homeDescription]
}

const url = (lang: Lang, page: Page) => SITE_URL + pathFor(lang, page)
export const markdownPath = (lang: Lang, page: Page) => pathFor(lang, page) + 'index.md'

// ---------------------------------------------------------------- Markdown

const blocksToMd = (blocks: Block[]) =>
  blocks.map((b) => (typeof b === 'string' ? b : b.map((item) => `- ${item}`).join('\n'))).join('\n\n')

/** Plain-text answer for structured data (lists flattened into sentences). */
const blocksToText = (blocks: Block[]) => blocks.map((b) => (typeof b === 'string' ? b : b.join(' '))).join(' ')

/** The page as Markdown: what an AI agent or a reader-mode tool gets at /…/index.md. */
export function renderMarkdown(lang: Lang, page: Page) {
  const { s, app } = texts(lang)
  const [title, description] = titleAndDescription(lang, page)
  const head = `---\ntitle: ${JSON.stringify(title)}\ndescription: ${JSON.stringify(description)}\nurl: ${url(lang, page)}\nlang: ${LANGS.find((l) => l.code === lang)!.locale}\n---\n\n`

  if (page === 'privacy') {
    const p = s.privacy
    return (
      head +
      `# ${p.title.replace(/\.$/, '')}\n\n_${p.updated} ${p.date}_\n\n**${p.summary}**\n\n` +
      p.sections.map((sec) => `## ${sec.title}\n\n${blocksToMd(sec.body)}`).join('\n\n') +
      `\n\n${p.contact} ${CONTACT}\n`
    )
  }

  if (page === 'support') {
    return (
      head +
      `# ${s.support.title.replace(/\.$/, '')}\n\n${s.support.intro}\n\n` +
      faq(lang)
        .map((item) => `## ${item.q}\n\n${blocksToMd(item.a)}`)
        .join('\n\n') +
      `\n\n## ${s.support.contactTitle}\n\n${s.support.contactBody} ${CONTACT}\n`
    )
  }

  return (
    head +
    `# Gently\n\n> ${s.home.tagline}\n\n**${s.home.promise}** ${s.footer.made}.\n\n${s.cta.note}. ${s.cta.join}: ${TEST_URL}\n\n` +
    `## ${s.home.features}\n\n` +
    features(lang)
      .map((f) => `### ${f.title}\n\n${f.body}`)
      .join('\n\n') +
    `\n\n## ${app.about.privacy}\n\n**${app.about.privacyTitle.join(' ')}** ${app.about.privacyBody}\n\n` +
    `## ${s.nav.support}\n\n- [${s.nav.support}](${url(lang, 'support')})\n- [${s.nav.privacy}](${url(lang, 'privacy')})\n- [${s.footer.source}](${SOURCE_URL}) · ${s.footer.openSource}\n`
  )
}

/** llms.txt (https://llmstxt.org): a compact, link-rich briefing for language models. */
export function renderLlmsTxt() {
  const en = texts('en').s
  const md = (lang: Lang, page: Page) => SITE_URL + markdownPath(lang, page)
  return `# Gently

> Gently is a free, open-source Android app (Android 10+) that blocks outgoing, incoming or international phone calls with simple rules, protected by an optional 6-digit access code. It has no ads, no account and no internet permission: rules and the call log never leave the phone.

Key facts:

- Platform: Android 10 or newer. There is no iOS version: iOS does not let apps block outgoing calls.
- Price: free and ad-free, forever. Status: closed testing on Google Play (${TEST_URL}).
- Made in Europe.
- Rules: block or allow; outgoing, incoming or both; one number, anyone, international numbers (outside the SIM's country) or hidden numbers. The most specific rule wins: number or hidden, then international, then anyone.
- Uses Android's call redirection and call screening roles. Holding the "Caller ID & spam" role pauses the phone's own spam protection (e.g. Google Phone) while Gently holds it.
- Emergency numbers are never blocked.
- Languages: ${LANGS.map((l) => l.name).join(', ')}.
- Developer: hmiguel (https://github.com/hmiguel), contact ${CONTACT}. Source code: ${SOURCE_URL} (GPL-3.0-or-later).

## Docs

- [Overview](${md('en', 'home')}): ${en.meta.homeDescription}
- [Help & FAQ](${md('en', 'support')}): ${en.meta.supportDescription}
- [Privacy policy](${md('en', 'privacy')}): ${en.meta.privacyDescription}

## Other languages

${LANGS.filter((l) => l.code !== 'en')
  .map((l) => `- [${l.name}](${md(l.code, 'home')}): ${PAGES.map((p) => md(l.code, p)).join(', ')}`)
  .join('\n')}

## Optional

- [Full content in one file](${SITE_URL}/llms-full.txt)
- [Source code](${SOURCE_URL})
`
}

/** llms-full.txt: every English page in full, for agents that want one fetch. */
export function renderLlmsFull() {
  return renderLlmsTxt() + '\n\n' + PAGES.map((p) => renderMarkdown('en', p)).join('\n\n---\n\n')
}

// ---------------------------------------------------------------- JSON-LD

/** schema.org graph for one page: organisation, website, the app, the page, breadcrumbs, FAQ. */
export function structuredData(lang: Lang, page: Page, dateModified: string) {
  const { s } = texts(lang)
  const locale = LANGS.find((l) => l.code === lang)!.locale
  const [title, description] = titleAndDescription(lang, page)
  const pageUrl = url(lang, page)
  const author = { '@type': 'Person', '@id': `${SITE_URL}/#author`, name: 'hmiguel', url: 'https://github.com/hmiguel', email: CONTACT }
  const website = {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: `${SITE_URL}/`,
    name: 'Gently',
    inLanguage: LANGS.map((l) => l.locale),
    publisher: { '@id': author['@id'] },
  }
  const app = {
    '@type': 'MobileApplication',
    '@id': `${SITE_URL}/#app`,
    name: 'Gently',
    alternateName: s.meta.homeTitle,
    description: `${s.home.tagline} ${s.home.promise}`,
    url: url(lang, 'home'),
    installUrl: TEST_URL,
    operatingSystem: 'Android 10+',
    applicationCategory: 'UtilitiesApplication',
    applicationSubCategory: 'Call blocker',
    inLanguage: LANGS.map((l) => l.locale),
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
    featureList: features(lang).map((f) => `${f.title}: ${f.body}`),
    screenshot: SCREENS.map((n) => `${SITE_URL}/img/${lang}/${n}-1080.webp`),
    image: `${SITE_URL}/icon-512.png`,
    author: { '@id': author['@id'] },
    publisher: { '@id': author['@id'] },
    license: LICENSE_URL,
    codeRepository: SOURCE_URL,
  }
  const webpage: Record<string, unknown> = {
    '@type': page === 'support' ? ['WebPage', 'FAQPage'] : 'WebPage',
    '@id': `${pageUrl}#webpage`,
    url: pageUrl,
    name: title,
    description,
    inLanguage: locale,
    isPartOf: { '@id': website['@id'] },
    about: { '@id': app['@id'] },
    dateModified,
  }
  if (page !== 'home') {
    webpage.breadcrumb = {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Gently', item: url(lang, 'home') },
        { '@type': 'ListItem', position: 2, name: page === 'privacy' ? s.nav.privacy : s.nav.support, item: pageUrl },
      ],
    }
  }
  if (page === 'support') {
    webpage.mainEntity = faq(lang).map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: blocksToText(item.a) },
    }))
  }
  return { '@context': 'https://schema.org', '@graph': [author, website, app, webpage] }
}
