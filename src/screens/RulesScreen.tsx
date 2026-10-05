import { ArrowDownLeft, ArrowLeftRight, ArrowUpRight, ChevronRight, Plus } from 'lucide-react'
import { Button, ScreenHeader } from '../components/ui'
import { tap } from '../lib/haptics'
import { describeRule, ruleSubject } from '../lib/rules'
import type { Direction, Rule } from '../plugins/callguard'

const DIRECTION_ICON: Record<Direction, typeof ArrowUpRight> = {
  outgoing: ArrowUpRight,
  incoming: ArrowDownLeft,
  both: ArrowLeftRight,
}

/** The list of rules. Tap a rule to edit or delete it; "New rule" opens an empty form. */
export function RulesScreen({
  rules,
  onOpen,
  onCreate,
}: {
  rules: Rule[]
  onOpen: (id: string) => void
  onCreate: () => void
}) {
  return (
    <>
      <ScreenHeader index="02" label="Rules" title="Rules." />

      <div className="px-6 pb-6">
        <Button onClick={onCreate}>
          New rule <Plus strokeWidth={3} className="size-5" />
        </Button>
      </div>

      {rules.length > 0 ? (
        <>
          <ul className="border-t-4 border-ink">
            {rules.map((rule, i) => {
              const Icon = DIRECTION_ICON[rule.direction]
              const blocks = rule.action === 'block'
              return (
                <li key={rule.id}>
                  <button
                    type="button"
                    aria-label={describeRule(rule)}
                    onClick={() => {
                      tap()
                      onOpen(rule.id)
                    }}
                    className="group flex w-full items-center gap-4 border-b-2 border-ink py-4 pl-6 pr-4 text-left transition-colors duration-150 ease-linear active:bg-ink active:text-paper"
                  >
                    <span className="text-label w-6 self-start pt-1 text-accent-ink tabular-nums">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="text-label flex items-center gap-1.5">
                        {/* Block rules carry the red signal; allow rules stay black. */}
                        <span
                          aria-hidden
                          className={`size-2.5 ${blocks ? 'bg-accent' : 'border-2 border-current'}`}
                        />
                        {blocks ? 'Block' : 'Allow'}
                        <Icon strokeWidth={3} className="ml-1 size-3.5" aria-hidden />
                        {rule.direction}
                      </span>
                      <span className="mt-1 block truncate text-xl font-black uppercase leading-tight tracking-tight">
                        {ruleSubject(rule)}
                      </span>
                      {rule.target === 'number' && rule.label && (
                        <span className="block truncate text-sm font-medium tabular-nums opacity-60">
                          {rule.number}
                        </span>
                      )}
                    </span>
                    <ChevronRight strokeWidth={2.5} className="size-5 shrink-0" aria-hidden />
                  </button>
                </li>
              )
            })}
          </ul>
          <p className="px-6 py-6 text-sm font-medium text-ink/60">
            When rules overlap, a rule for a specific number wins over a rule for anyone.
          </p>
        </>
      ) : (
        <section className="swiss-grid border-y-4 border-ink bg-muted px-6 py-12">
          <p className="text-3xl font-black uppercase leading-[0.9] tracking-tighter">
            No rules
            <br />
            yet.
          </p>
          <p className="mt-3 text-sm font-medium text-ink/60">
            Create one to block a number, block everyone, or allow only a few.
          </p>
        </section>
      )}
    </>
  )
}
