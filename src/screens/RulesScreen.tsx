import { BookUser, Plus, X } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Button, ScreenHeader, SectionLabel } from '../components/ui'
import { tap } from '../lib/haptics'
import type { Direction, Mode, NumberEntry, Rules } from '../plugins/callguard'
import type { PickedContact } from '../plugins/contacts'

const DIRECTIONS: { id: Direction; title: string }[] = [
  { id: 'outgoing', title: 'Outgoing' },
  { id: 'incoming', title: 'Incoming' },
  { id: 'both', title: 'Both' },
]

const MODES: { id: Mode; title: string; description: string }[] = [
  { id: 'all', title: 'All calls', description: 'Block every call' },
  { id: 'blocklist', title: 'Blocklist', description: 'Block only the numbers below' },
  { id: 'allowlist', title: 'Allowlist', description: 'Allow only the numbers below' },
]

const digitsOf = (n: string) => n.replace(/\D/g, '')

export function RulesScreen({
  rules,
  onChange,
  onPickContact,
}: {
  rules: Rules
  onChange: (rules: Rules) => void
  onPickContact: () => Promise<PickedContact | null>
}) {
  const [number, setNumber] = useState('')
  const [label, setLabel] = useState('')
  const [error, setError] = useState<string | null>(null)

  /** Adds an entry to the top of the list; returns false (with an error shown) if rejected. */
  function addEntry(rawNumber: string, rawLabel?: string) {
    const trimmed = rawNumber.trim()
    if (digitsOf(trimmed).length < 3) {
      setError('Enter a valid number')
      return false
    }
    if (rules.numbers.some((n) => digitsOf(n.number) === digitsOf(trimmed))) {
      setError('Already on the list')
      return false
    }
    const name = rawLabel?.trim()
    const entry: NumberEntry = { number: trimmed, ...(name && { label: name }) }
    onChange({ ...rules, numbers: [entry, ...rules.numbers] })
    setError(null)
    return true
  }

  function add(e: FormEvent) {
    e.preventDefault()
    if (addEntry(number, label)) {
      setNumber('')
      setLabel('')
    }
  }

  async function pick() {
    try {
      const contact = await onPickContact()
      if (contact) addEntry(contact.number, contact.name)
    } catch {
      setError('Could not open contacts')
    }
  }

  function remove(entry: NumberEntry) {
    tap()
    onChange({ ...rules, numbers: rules.numbers.filter((n) => n !== entry) })
  }

  const listUnused = rules.mode === 'all'

  return (
    <>
      <ScreenHeader index="02" label="Rules" title="Rules." />

      <section className="border-t-4 border-ink">
        <div className="px-6 py-4">
          <SectionLabel index="2.1">Direction</SectionLabel>
        </div>
        {/* Segmented control: the black gap is the ruling between cells. */}
        <div
          className="grid grid-cols-3 gap-[2px] border-t-2 border-ink bg-ink"
          role="radiogroup"
          aria-label="Calls to block"
        >
          {DIRECTIONS.map((direction) => {
            const selected = rules.direction === direction.id
            return (
              <button
                key={direction.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => {
                  tap()
                  onChange({ ...rules, direction: direction.id })
                }}
                className={`flex h-16 items-center justify-center text-xs font-bold uppercase tracking-[0.15em] transition-colors duration-150 ease-linear ${
                  selected ? 'bg-ink text-paper' : 'bg-paper active:bg-muted'
                }`}
              >
                {direction.title}
              </button>
            )
          })}
        </div>
      </section>

      <section className="border-t-4 border-ink" role="radiogroup" aria-label="Blocking mode">
        <div className="border-b-2 border-ink px-6 py-4">
          <SectionLabel index="2.2">Mode</SectionLabel>
        </div>
        {MODES.map((mode) => {
          const selected = rules.mode === mode.id
          return (
            <button
              key={mode.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => {
                tap()
                onChange({ ...rules, mode: mode.id })
              }}
              className={`flex w-full items-center justify-between gap-4 border-b-2 border-ink px-6 py-5 text-left transition-colors duration-150 ease-linear ${
                selected ? 'bg-ink text-paper' : 'bg-paper active:bg-muted'
              }`}
            >
              <span>
                <span className="block text-lg font-black uppercase tracking-tight">{mode.title}</span>
                <span className={`mt-1 block text-sm font-medium ${selected ? 'text-paper/70' : 'text-ink/60'}`}>
                  {mode.description}
                </span>
              </span>
              <span
                aria-hidden
                className={`size-5 shrink-0 border-4 ${selected ? 'border-accent bg-accent' : 'border-ink'}`}
              />
            </button>
          )
        })}
        {rules.direction !== 'outgoing' && (
          <button
            type="button"
            role="switch"
            aria-checked={rules.blockHidden}
            onClick={() => {
              tap()
              onChange({ ...rules, blockHidden: !rules.blockHidden })
            }}
            className="flex w-full items-center justify-between gap-4 border-b-2 border-ink bg-paper px-6 py-5 text-left active:bg-muted"
          >
            <span>
              <span className="block text-lg font-black uppercase tracking-tight">Hidden numbers</span>
              <span className="mt-1 block text-sm font-medium text-ink/60">
                {rules.blockHidden ? 'Incoming private calls are rejected' : 'Incoming private calls ring normally'}
              </span>
            </span>
            {/* Rectangular switch: the knob snaps, it doesn't glide. */}
            <span
              aria-hidden
              className={`flex h-7 w-12 shrink-0 border-4 border-ink p-0.5 ${rules.blockHidden ? 'justify-end bg-ink' : 'justify-start'}`}
            >
              <span className={`size-3.5 ${rules.blockHidden ? 'bg-accent' : 'bg-ink'}`} />
            </span>
          </button>
        )}
      </section>

      <section className={`swiss-diagonal border-b-4 border-ink bg-muted px-6 py-8 ${listUnused ? 'opacity-50' : ''}`}>
        <div className="flex items-baseline justify-between">
          <SectionLabel index="2.3">Numbers</SectionLabel>
          <span className="text-label tabular-nums">{String(rules.numbers.length).padStart(2, '0')}</span>
        </div>
        {listUnused && (
          <p className="mt-3 text-sm font-medium">The list is ignored while every call is blocked.</p>
        )}

        <Button variant="secondary" className="mt-6" onClick={pick}>
          From contacts <BookUser strokeWidth={2.5} className="size-5" />
        </Button>

        <p className="text-label mt-8 text-ink/60">Or type a number</p>

        <form onSubmit={add} className="mt-2 flex items-end gap-3">
          <div className="flex-1 space-y-4">
            <label className="block">
              <span className="text-label text-ink/60">Phone number</span>
              <input
                type="tel"
                inputMode="tel"
                autoComplete="off"
                value={number}
                onChange={(e) => {
                  setNumber(e.target.value)
                  setError(null)
                }}
                placeholder="+351 912 345 678"
                className="mt-1 block w-full rounded-none border-0 border-b-4 border-ink bg-transparent py-2 text-xl font-bold tabular-nums placeholder:text-ink/25 focus:border-accent focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </label>
            <label className="block">
              <span className="text-label text-ink/60">Label (optional)</span>
              <input
                type="text"
                autoComplete="off"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Who is it?"
                className="mt-1 block w-full rounded-none border-0 border-b-2 border-ink bg-transparent py-2 text-base font-medium placeholder:text-ink/25 focus:border-accent focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </label>
          </div>
          <button
            type="submit"
            aria-label="Add number"
            onClick={tap}
            className="group flex size-16 shrink-0 items-center justify-center bg-ink text-paper transition-colors duration-150 ease-linear active:bg-accent"
          >
            <Plus strokeWidth={3} className="size-7 transition-transform duration-200 ease-out group-active:rotate-90" />
          </button>
        </form>
        {error && <p className="text-label mt-3 text-accent-ink" role="alert">{error}</p>}
      </section>

      {rules.numbers.length > 0 ? (
        <ul>
          {rules.numbers.map((entry, i) => (
            <li key={entry.number} className="flex items-center gap-4 border-b-2 border-ink py-4 pl-6 pr-3">
              <span className="text-label w-6 text-accent-ink tabular-nums">{String(i + 1).padStart(2, '0')}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xl font-bold tabular-nums">{entry.number}</span>
                {entry.label && <span className="text-label block truncate text-ink/60">{entry.label}</span>}
              </span>
              <button
                type="button"
                aria-label={`Remove ${entry.label ?? entry.number}`}
                onClick={() => remove(entry)}
                className="flex size-11 shrink-0 items-center justify-center border-2 border-ink transition-colors duration-150 ease-linear active:border-accent active:bg-accent active:text-paper"
              >
                <X strokeWidth={2.5} className="size-5" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="px-6 py-10 text-2xl font-black uppercase leading-none tracking-tighter text-ink/20">
          No numbers yet.
        </p>
      )}
    </>
  )
}
