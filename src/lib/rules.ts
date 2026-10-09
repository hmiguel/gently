import type { Messages } from '../i18n/en'
import type { Rule, Schedule } from '../plugins/callguard'

export const digitsOf = (n: string) => n.replace(/\D/g, '')

/** Same tolerance as the native RuleStore: "+351 912 345 678" matches "912345678". */
export function sameNumber(a: string, b: string) {
  const da = digitsOf(a)
  const db = digitsOf(b)
  if (!da || !db) return false
  if (da === db) return true
  const [longer, shorter] = da.length >= db.length ? [da, db] : [db, da]
  return shorter.length >= 7 && longer.endsWith(shorter)
}

export const newRuleId = () => crypto.randomUUID()

/** Label for a logged number: the name from a matching number rule, if any. */
export function labelFor(rules: Rule[], number: string) {
  if (!digitsOf(number)) return undefined
  return rules.find((r) => r.target === 'number' && r.number && sameNumber(r.number, number))?.label
}

/** Country name for an ISO code in the given locale, e.g. "PT" -> "Portugal". */
export function countryName(iso: string, locale: string, fallback: string) {
  try {
    return (iso && new Intl.DisplayNames(locale, { type: 'region' }).of(iso)) || fallback
  } catch {
    return fallback
  }
}

/** "07:00" in the user's clock style: "07:00" on a 24-hour clock, "7:00 AM" on a 12-hour one. */
export function formatClock(hhmm: string, locale: string, hourCycle: 'h12' | 'h23') {
  const [h, min] = hhmm.split(':').map(Number)
  const hour = hourCycle === 'h23' ? '2-digit' : 'numeric'
  return new Intl.DateTimeFormat(locale, { hour, minute: '2-digit', hourCycle }).format(
    new Date(2000, 0, 1, h, min),
  )
}

export const sameSchedule = (a?: Schedule, b?: Schedule) => a?.from === b?.from && a?.until === b?.until

/** The rule as a sentence, its time window (if any) in the user's clock style. */
export function describeRule(m: Messages, rule: Rule | Omit<Rule, 'id'>, hourCycle: 'h12' | 'h23') {
  const s = rule.schedule
  const window = s && m.rules.between(formatClock(s.from, m.locale, hourCycle), formatClock(s.until, m.locale, hourCycle))
  return m.rules.describe(rule, window)
}
