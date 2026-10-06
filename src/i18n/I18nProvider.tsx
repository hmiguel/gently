import { Preferences } from '@capacitor/preferences'
import { useEffect, useState, type ReactNode } from 'react'
import { I18nContext, isLanguage, resolveMessages, type Language } from '.'

const KEY = 'gently.language'

/** Loads the saved language before rendering, so the first screen is already translated. */
export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language | null>(null)

  useEffect(() => {
    Preferences.get({ key: KEY }).then(({ value }) =>
      setLanguageState(isLanguage(value) ? value : 'system'),
    )
  }, [])

  const m = resolveMessages(language ?? 'system')
  useEffect(() => {
    document.documentElement.lang = m.locale
  }, [m])

  if (language === null) return null

  const setLanguage = (next: Language) => {
    setLanguageState(next)
    Preferences.set({ key: KEY, value: next })
  }

  return <I18nContext.Provider value={{ m, language, setLanguage }}>{children}</I18nContext.Provider>
}
