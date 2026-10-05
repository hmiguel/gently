import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import { useState } from 'react'
import { Button, ScreenHeader } from '../components/ui'
import type { LogEntry, NumberEntry } from '../plugins/callguard'

const time = new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' })
const day = new Intl.DateTimeFormat(undefined, { day: '2-digit', month: 'short' })

const digitsOf = (n: string) => n.replace(/\D/g, '')

/** Blocked attempts, laid out like a departures board. */
export function LogScreen({
  log,
  numbers,
  onClear,
}: {
  log: LogEntry[]
  numbers: NumberEntry[]
  onClear: () => void
}) {
  const [confirming, setConfirming] = useState(false)

  const labelFor = (n: string) => {
    const d = digitsOf(n)
    if (!d) return undefined
    return numbers.find((e) => d.length >= 7 && (digitsOf(e.number).endsWith(d) || d.endsWith(digitsOf(e.number))))
      ?.label
  }

  return (
    <>
      <ScreenHeader index="03" label="Log" title="Log." />

      {log.length === 0 ? (
        <section className="swiss-grid border-y-4 border-ink bg-muted px-6 py-16">
          <p className="text-4xl font-black uppercase leading-[0.9] tracking-tighter">
            No calls
            <br />
            blocked.
          </p>
          <p className="mt-4 text-sm font-medium text-ink/60">Blocked attempts will appear here.</p>
        </section>
      ) : (
        <>
          <div className="text-label grid grid-cols-[4.5rem_4.5rem_1fr] border-y-4 border-ink bg-muted px-6 py-3">
            <span>Time</span>
            <span>Date</span>
            <span>Number</span>
          </div>
          <ol>
            {log.map((entry) => {
              const label = labelFor(entry.number)
              const incoming = entry.direction === 'in'
              const Arrow = incoming ? ArrowDownLeft : ArrowUpRight
              return (
                <li
                  key={`${entry.at}-${entry.number}`}
                  className="grid grid-cols-[4.5rem_4.5rem_1fr] items-baseline border-b-2 border-ink px-6 py-3 tabular-nums"
                >
                  <span className="text-lg font-black">{time.format(entry.at)}</span>
                  <span className="text-label text-ink/60">{day.format(entry.at)}</span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-2 font-bold">
                      <Arrow
                        strokeWidth={3}
                        className={`size-4 shrink-0 ${incoming ? 'text-accent-ink' : ''}`}
                        aria-label={incoming ? 'Incoming' : 'Outgoing'}
                      />
                      <span className="truncate">{entry.number || 'Hidden number'}</span>
                    </span>
                    {label && <span className="text-label block truncate text-accent-ink">{label}</span>}
                  </span>
                </li>
              )
            })}
          </ol>
          <section className="px-6 py-8">
            <Button
              variant={confirming ? 'accent' : 'secondary'}
              onClick={() => {
                if (confirming) onClear()
                setConfirming(!confirming)
              }}
              onBlur={() => setConfirming(false)}
            >
              {confirming ? 'Tap again to clear' : 'Clear log'}
              <span className="text-label">{String(log.length).padStart(2, '0')}</span>
            </Button>
          </section>
        </>
      )}
    </>
  )
}
