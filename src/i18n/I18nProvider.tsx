import { Preferences } from '@capacitor/preferences'
import { useEffect, useState, type ReactNode } from 'react'
import { CallGuard } from '../plugins/callguard'
import { I18nContext, isLanguage, resolveMessages, type Language, type TimeFormat } from '.'

const LANGUAGE_KEY = 'gently.language'
const TIME_FORMAT_KEY = 'gently.timeFormat'

const isTimeFormat = (value: unknown): value is TimeFormat => value === 'system' || value === '12' || value === '24'

/**
 * Language and clock preferences. Loads them (and the phone's 12/24-hour setting)
 * before rendering, so the first screen is already right.
 */
export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language | null>(null)
  const [timeFormat, setTimeFormatState] = useState<TimeFormat>('system')
  const [phoneIs24Hour, setPhoneIs24Hour] = useState(true)

  useEffect(() => {
    Promise.all([
      Preferences.get({ key: LANGUAGE_KEY }),
      Preferences.get({ key: TIME_FORMAT_KEY }),
      CallGuard.timeFormat().catch(() => ({ is24Hour: true })),
    ]).then(([lang, time, phone]) => {
      setTimeFormatState(isTimeFormat(time.value) ? time.value : 'system')
      setPhoneIs24Hour(phone.is24Hour)
      setLanguageState(isLanguage(lang.value) ? lang.value : 'system')
    })
  }, [])

  const m = resolveMessages(language ?? 'system')
  useEffect(() => {
    document.documentElement.lang = m.locale
  }, [m])

  if (language === null) return null

  const setLanguage = (next: Language) => {
    setLanguageState(next)
    Preferences.set({ key: LANGUAGE_KEY, value: next })
  }
  const setTimeFormat = (next: TimeFormat) => {
    setTimeFormatState(next)
    Preferences.set({ key: TIME_FORMAT_KEY, value: next })
  }
  const is24 = timeFormat === 'system' ? phoneIs24Hour : timeFormat === '24'

  return (
    <I18nContext.Provider
      value={{ m, language, setLanguage, timeFormat, setTimeFormat, phoneIs24Hour, hourCycle: is24 ? 'h23' : 'h12' }}
    >
      {children}
    </I18nContext.Provider>
  )
}
