import { de as appDe } from '../../../src/i18n/de'
import { en as appEn, type Messages } from '../../../src/i18n/en'
import { es as appEs } from '../../../src/i18n/es'
import { fr as appFr } from '../../../src/i18n/fr'
import { pt as appPt } from '../../../src/i18n/pt'
import { de } from './de'
import { en, type Site } from './en'
import { es } from './es'
import { fr } from './fr'
import { pt } from './pt'

export type Lang = 'en' | 'pt' | 'es' | 'fr' | 'de'
export type Page = 'home' | 'privacy' | 'support'

export const SITE_URL = 'https://gently.lixo.dev'
export const CONTACT = 'hugo@lixo.dev'
export const TEST_URL = 'https://play.google.com/apps/testing/com.lixo.gently'

/** Display order and names (in their own language), same as the app's settings. */
export const LANGS: { code: Lang; name: string; locale: string }[] = [
  { code: 'en', name: 'English', locale: 'en' },
  { code: 'pt', name: 'Português', locale: 'pt-PT' },
  { code: 'es', name: 'Español', locale: 'es-ES' },
  { code: 'fr', name: 'Français', locale: 'fr-FR' },
  { code: 'de', name: 'Deutsch', locale: 'de-DE' },
]

export const PAGES: Page[] = ['home', 'privacy', 'support']

const SITE: Record<Lang, Site> = { en, pt, es, fr, de }
const APP: Record<Lang, Messages> = { en: appEn, pt: appPt, es: appEs, fr: appFr, de: appDe }

/** Site text plus the app's own wording for the same language. */
export function texts(lang: Lang) {
  return { s: SITE[lang], app: APP[lang] }
}

/** URL segment per page (the support page is published as /help/). */
const SLUGS: Record<Exclude<Page, 'home'>, string> = { privacy: 'privacy', support: 'help' }

/** URL path for a page: English at the root, others under /<lang>/. Always ends with "/". */
export function pathFor(lang: Lang, page: Page) {
  const base = lang === 'en' ? '/' : `/${lang}/`
  return page === 'home' ? base : `${base}${SLUGS[page]}/`
}
