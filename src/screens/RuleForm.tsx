import { BookUser } from 'lucide-react'
import { useState } from 'react'
import { FormScreen, FormSection, OptionList } from '../components/FormScreen'
import { Button } from '../components/ui'
import { useI18n } from '../i18n'
import { countryName, digitsOf, newRuleId, sameNumber } from '../lib/rules'
import type { Action, Direction, Rule, Target } from '../plugins/callguard'
import type { PickedContact } from '../plugins/contacts'

const inputClass =
  'mt-1 block w-full rounded-none border-0 border-ink bg-transparent py-2 placeholder:text-ink/25 focus:border-accent focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'

const BLANK: Omit<Rule, 'id'> = { action: 'block', direction: 'outgoing', target: 'number' }

/** Option order is fixed here; titles and descriptions come from the dictionary. */
const ACTIONS: Action[] = ['block', 'allow']
const DIRECTIONS: Direction[] = ['outgoing', 'incoming', 'both']
const TARGETS: Target[] = ['number', 'anyone', 'international', 'hidden']

function options<T extends string>(values: T[], text: Record<T, { title: string; description: string }>) {
  return values.map((value) => ({ value, ...text[value] }))
}

/**
 * Creates a rule (no `rule`) or edits/deletes an existing one. Everything a
 * rule needs lives here; the title is the rule read back as a sentence.
 */
export function RuleForm({
  rule,
  homeCountry,
  others,
  onSave,
  onDelete,
  onPickContact,
  onClose,
}: {
  rule?: Rule
  /** SIM country, to explain what "international" covers. */
  homeCountry: string
  /** Every other rule, for duplicate checks. */
  others: Rule[]
  onSave: (rule: Rule) => void
  onDelete?: () => void
  onPickContact: () => Promise<PickedContact | null>
  onClose: () => void
}) {
  const { m } = useI18n()
  const t = m.ruleForm
  const [draft, setDraft] = useState<Omit<Rule, 'id'>>(rule ?? BLANK)
  const [error, setError] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const update = (patch: Partial<Rule>) => {
    setDraft((d) => ({ ...d, ...patch }))
    setError(null)
  }

  function save() {
    const final: Rule = { ...draft, id: rule?.id ?? newRuleId() }
    if (final.target === 'hidden') final.direction = 'incoming'
    if (final.target === 'number') {
      const number = final.number?.trim() ?? ''
      if (digitsOf(number).length < 3) return setError(t.errors.invalid)
      final.number = number
      final.label = final.label?.trim() || undefined
    } else {
      delete final.number
      delete final.label
    }
    const duplicate = others.some(
      (o) =>
        o.target === final.target &&
        o.direction === final.direction &&
        (final.target !== 'number' || sameNumber(o.number ?? '', final.number ?? '')),
    )
    if (duplicate) return setError(t.errors.duplicate)
    onSave(final)
  }

  async function pick() {
    try {
      const contact = await onPickContact()
      if (contact) update({ number: contact.number, label: contact.name ?? draft.label })
    } catch {
      setError(t.errors.contacts)
    }
  }

  return (
    <FormScreen
      index="02"
      label={rule ? t.editRule : t.newRule}
      title={m.rules.describe(draft.target === 'hidden' ? { ...draft, direction: 'incoming' } : draft)}
      onClose={onClose}
      actions={
        <>
          {error && (
            <p className="text-label text-accent-ink" role="alert">
              {error}
            </p>
          )}
          <Button onClick={save}>
            {rule ? t.save : t.create} <span className="size-4 bg-accent" aria-hidden />
          </Button>
          {onDelete && (
            <Button
              variant={confirmDelete ? 'accent' : 'secondary'}
              onClick={() => (confirmDelete ? onDelete() : setConfirmDelete(true))}
              onBlur={() => setConfirmDelete(false)}
            >
              {confirmDelete ? t.confirmDelete : t.delete}
            </Button>
          )}
        </>
      }
    >
      <FormSection index="2.1" label={t.sections.action}>
        <OptionList
          label={t.sections.action}
          options={options(ACTIONS, t.actions)}
          value={draft.action}
          onChange={(action) => update({ action })}
        />
      </FormSection>

      <FormSection index="2.2" label={t.sections.calls}>
        {draft.target === 'hidden' ? (
          <p className="px-6 py-4 text-sm font-medium text-ink/60">
            {t.hiddenNote}
          </p>
        ) : (
          <OptionList
            label={t.sections.calls}
            options={options(DIRECTIONS, t.directions)}
            value={draft.direction}
            onChange={(direction) => update({ direction })}
          />
        )}
      </FormSection>
      <FormSection index="2.3" label={t.sections.who}>
        <OptionList
          label={t.sections.who}
          options={options(TARGETS, t.targets(countryName(homeCountry, m.locale, t.yourCountry)))}
          value={draft.target}
          onChange={(target) => update({ target })}
        />
        {draft.target === 'number' && (
          <div className="swiss-diagonal space-y-6 border-t-2 border-ink bg-muted px-6 py-6">
            <Button variant="secondary" onClick={pick}>
              {t.fromContacts} <BookUser strokeWidth={2.5} className="size-5" />
            </Button>
            <label className="block">
              <span className="text-label text-ink/60">{t.phone}</span>
              <input
                type="tel"
                inputMode="tel"
                autoComplete="off"
                value={draft.number ?? ''}
                onChange={(e) => update({ number: e.target.value })}
                placeholder="+351 912 345 678"
                className={`${inputClass} border-b-4 text-2xl font-bold tabular-nums`}
              />
            </label>
            <label className="block">
              <span className="text-label text-ink/60">{t.name}</span>
              <input
                type="text"
                autoComplete="off"
                value={draft.label ?? ''}
                onChange={(e) => update({ label: e.target.value })}
                placeholder={t.namePlaceholder}
                className={`${inputClass} border-b-2 text-lg font-medium`}
              />
            </label>
          </div>
        )}
      </FormSection>

      <div className="border-t-4 border-ink" />
    </FormScreen>
  )
}
