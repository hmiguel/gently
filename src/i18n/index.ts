import { createContext, useContext } from 'react'
import { en, type Messages } from './en'
import { es } from './es'
import { fr } from './fr'
import { pt } from './pt'

const MESSAGES = { en, pt, es, fr } satisfies Record<string, Messages>

export type LanguageCode = keyof typeof MESSAGES
/** A specific language, or follow the phone's. */
export type Language = 'system' | LanguageCode

/** Settings order. Names are in their own language so they're recognisable whatever is selected. */
export const LANGUAGES: { code: LanguageCode; name: string }[] = [
  { code: 'en', name: 'English' },
  { code: 'pt', name: 'Português' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
]

export const isLanguage = (value: unknown): value is Language =>
  value === 'system' || (typeof value === 'string' && value in MESSAGES)

/** The phone's language when we have it, English otherwise. */
export function resolveMessages(language: Language): Messages {
  if (language !== 'system') return MESSAGES[language]
  const phone = navigator.language.toLowerCase().slice(0, 2)
  return isLanguage(phone) && phone !== 'system' ? MESSAGES[phone] : en
}

export interface I18n {
  /** Messages for the effective language. */
  m: Messages
  language: Language
  setLanguage: (language: Language) => void
}

export const I18nContext = createContext<I18n | null>(null)

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n outside I18nProvider')
  return ctx
}
