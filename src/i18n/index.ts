import { createContext, useContext } from 'react'
import { en, type Messages } from './en'
import { pt } from './pt'

/** A specific language, or follow the phone's. */
export type Language = 'system' | 'en' | 'pt'

/** Shown in their own language so they're recognisable whatever is selected. */
export const LANGUAGE_NAMES: Record<Exclude<Language, 'system'>, string> = { en: 'English', pt: 'Português' }

const MESSAGES: Record<Exclude<Language, 'system'>, Messages> = { en, pt }

export function resolveMessages(language: Language): Messages {
  if (language !== 'system') return MESSAGES[language]
  return navigator.language.toLowerCase().startsWith('pt') ? pt : en
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
