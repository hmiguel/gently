import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import { tap } from '../lib/haptics'
import { SectionLabel } from './ui'

/**
 * Full-screen form that slides over the tabs. One task per screen: a title,
 * the fields, and the actions pinned to the bottom.
 */
export function FormScreen({
  index,
  label,
  title,
  onClose,
  children,
  actions,
}: {
  index: string
  label: string
  title: ReactNode
  onClose: () => void
  children: ReactNode
  actions: ReactNode
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={label}
      className="fixed inset-0 z-40 flex animate-sheet-in flex-col bg-paper"
    >
      <header className="pt-safe border-b-4 border-ink">
        <div className="flex h-14 items-center justify-between pl-6 pr-2">
          <SectionLabel index={index}>{label}</SectionLabel>
          <button
            type="button"
            aria-label="Close"
            onClick={() => {
              tap()
              onClose()
            }}
            className="flex size-11 items-center justify-center transition-colors duration-150 ease-linear active:bg-ink active:text-paper"
          >
            <X strokeWidth={2.5} className="size-6" />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <h1 className="px-6 pb-8 pt-6 text-4xl font-black uppercase leading-[0.9] tracking-tighter">{title}</h1>
        {children}
      </div>

      <footer className="pb-safe border-t-4 border-ink bg-paper">
        <div className="space-y-3 px-6 py-4">{actions}</div>
      </footer>
    </div>
  )
}

/** A titled group of fields inside a form. */
export function FormSection({ index, label, children }: { index: string; label: string; children: ReactNode }) {
  return (
    <section className="border-t-4 border-ink">
      <div className="border-b-2 border-ink px-6 py-4">
        <SectionLabel index={index}>{label}</SectionLabel>
      </div>
      {children}
    </section>
  )
}

/** Single-choice list: the chosen row inverts to black with a red marker. */
export function OptionList<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: { value: T; title: string; description: string }[]
  value: T
  onChange: (value: T) => void
}) {
  return (
    <div role="radiogroup" aria-label={label}>
      {options.map((option) => {
        const selected = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => {
              tap()
              onChange(option.value)
            }}
            className={`flex w-full items-center justify-between gap-4 border-b-2 border-ink px-6 py-4 text-left transition-colors duration-150 ease-linear last:border-b-0 ${
              selected ? 'bg-ink text-paper' : 'bg-paper active:bg-muted'
            }`}
          >
            <span>
              <span className="block text-base font-black uppercase tracking-tight">{option.title}</span>
              <span className={`mt-0.5 block text-sm font-medium ${selected ? 'text-paper/70' : 'text-ink/60'}`}>
                {option.description}
              </span>
            </span>
            <span
              aria-hidden
              className={`size-5 shrink-0 border-4 ${selected ? 'border-accent bg-accent' : 'border-ink'}`}
            />
          </button>
        )
      })}
    </div>
  )
}
