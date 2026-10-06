import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Button, ScreenHeader } from '../components/ui'
import { useI18n } from '../i18n'
import { labelFor } from '../lib/rules'
import type { LogEntry, Rule } from '../plugins/callguard'

/** "03:32" stays big; a 12-hour locale's "PM" becomes a small label so the column never wraps. */
function formatTime(time: Intl.DateTimeFormat, ts: number) {
  const parts = time.formatToParts(ts)
  const period = parts.find((p) => p.type === 'dayPeriod')?.value
  const clock = parts
    .filter((p) => p.type !== 'dayPeriod')
    .map((p) => p.value)
    .join('')
    .trim()
  return { clock, period }
}

/** Blocked attempts, laid out like a departures board. */
export function LogScreen({
  log,
  rules,
  onClear,
}: {
  log: LogEntry[]
  rules: Rule[]
  onClear: () => void
}) {
  const { m, hourCycle } = useI18n()
  const [confirming, setConfirming] = useState(false)
  const time = useMemo(
    () => new Intl.DateTimeFormat(m.locale, { hour: '2-digit', minute: '2-digit', hourCycle }),
    [m, hourCycle],
  )
  const day = useMemo(() => new Intl.DateTimeFormat(m.locale, { day: '2-digit', month: 'short' }), [m])

  return (
    <>
      <ScreenHeader index="03" label={m.log.label} title={m.log.title} />

      {log.length === 0 ? (
        <section className="swiss-grid border-y-4 border-ink bg-muted px-6 py-16">
          <p className="text-4xl font-black uppercase leading-[0.9] tracking-tighter">
            {m.log.empty[0]}
            <br />
            {m.log.empty[1]}
          </p>
          <p className="mt-4 text-sm font-medium text-ink/60">{m.log.emptyBody}</p>
        </section>
      ) : (
        <>
          <div className="text-label grid grid-cols-[5.5rem_1fr] border-y-4 border-ink bg-muted px-6 py-3">
            <span>{m.log.when}</span>
            <span>{m.log.number}</span>
          </div>
          <ol>
            {log.map((entry) => {
              const label = labelFor(rules, entry.number)
              const { clock, period } = formatTime(time, entry.at)
              const incoming = entry.direction === 'in'
              const Arrow = incoming ? ArrowDownLeft : ArrowUpRight
              return (
                <li
                  key={`${entry.at}-${entry.number}`}
                  className="grid grid-cols-[5.5rem_1fr] items-baseline border-b-2 border-ink px-6 py-3 tabular-nums"
                >
                  <span>
                    <span className="block text-lg font-black">
                      {clock}
                      {period && <span className="text-label ml-0.5 align-top">{period}</span>}
                    </span>
                    <span className="text-label block text-ink/60">{day.format(entry.at)}</span>
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-2 font-bold">
                      <Arrow
                        strokeWidth={3}
                        className={`size-4 shrink-0 ${incoming ? 'text-accent-ink' : ''}`}
                        aria-label={incoming ? m.log.incoming : m.log.outgoing}
                      />
                      <span className="truncate">{entry.number || m.log.hidden}</span>
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
              {confirming ? m.log.confirmClear : m.log.clear}
              <span className={`size-4 ${confirming ? 'bg-paper' : 'border-2 border-current'}`} aria-hidden />
            </Button>
          </section>
        </>
      )}
    </>
  )
}
