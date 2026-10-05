import type { Action, Direction, Rule, Target } from '../plugins/callguard'

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

/** Who the rule applies to, as a short name. */
export function ruleSubject(rule: Pick<Rule, 'target' | 'number' | 'label'>) {
  if (rule.target === 'anyone') return 'Anyone'
  if (rule.target === 'international') return 'International'
  if (rule.target === 'hidden') return 'Hidden numbers'
  return rule.label || rule.number || 'A number'
}

/** The rule as one plain sentence, e.g. "Block outgoing calls to Mom." */
export function describeRule(rule: Pick<Rule, 'action' | 'direction' | 'target' | 'number' | 'label'>) {
  const verb = rule.action === 'block' ? 'Block' : 'Allow'
  if (rule.target === 'anyone') {
    if (rule.direction === 'both') return `${verb} all calls.`
    return `${verb} all ${rule.direction} calls.`
  }
  if (rule.target === 'international') {
    if (rule.direction === 'both') return `${verb} all international calls.`
    return `${verb} all international ${rule.direction} calls.`
  }
  if (rule.target === 'hidden') return `${verb} calls from hidden numbers.`
  const who = ruleSubject(rule)
  if (rule.direction === 'outgoing') return `${verb} calls to ${who}.`
  if (rule.direction === 'incoming') return `${verb} calls from ${who}.`
  return `${verb} calls to and from ${who}.`
}

/** Label for a logged number: the name from a matching number rule, if any. */
export function labelFor(rules: Rule[], number: string) {
  if (!digitsOf(number)) return undefined
  return rules.find((r) => r.target === 'number' && r.number && sameNumber(r.number, number))?.label
}

export const ACTION_OPTIONS: { value: Action; title: string; description: string }[] = [
  { value: 'block', title: 'Block', description: 'Stop these calls' },
  { value: 'allow', title: 'Allow', description: 'Let these through, even if another rule blocks everyone' },
]

export const DIRECTION_OPTIONS: { value: Direction; title: string; description: string }[] = [
  { value: 'outgoing', title: 'Outgoing', description: 'Calls made from this phone' },
  { value: 'incoming', title: 'Incoming', description: 'Calls received on this phone' },
  { value: 'both', title: 'Both', description: 'Calls in either direction' },
]

/** Country name for an ISO code in the viewer's language, e.g. "PT" -> "Portugal". */
export function countryName(iso: string) {
  try {
    return (iso && new Intl.DisplayNames(undefined, { type: 'region' }).of(iso)) || 'your country'
  } catch {
    return 'your country'
  }
}

export function targetOptions(homeCountry: string): { value: Target; title: string; description: string }[] {
  return [
    { value: 'number', title: 'A number', description: 'From your contacts or typed in' },
    { value: 'anyone', title: 'Anyone', description: 'Every number' },
    { value: 'international', title: 'International', description: `Numbers outside ${countryName(homeCountry)}` },
    { value: 'hidden', title: 'Hidden numbers', description: 'Incoming calls with no caller ID' },
  ]
}
