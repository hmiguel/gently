import type { Rule } from '../plugins/callguard'

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
