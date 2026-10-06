import { ArrowRight, ShieldAlert } from 'lucide-react'
import { useState } from 'react'
import { Button, ScreenHeader, Stat } from '../components/ui'
import { useI18n } from '../i18n'
import { requiredPermissions, type LogEntry, type Permissions, type Status } from '../plugins/callguard'

const WEEK_MS = 7 * 24 * 60 * 60 * 1000

function isToday(ts: number) {
  return new Date(ts).toDateString() === new Date().toDateString()
}

export function StatusScreen({
  status,
  log,
  onToggle,
  onRequestPermission,
  onAddRule,
}: {
  status: Status
  log: LogEntry[]
  onToggle: () => void
  onRequestPermission: (direction: keyof Permissions) => void
  onAddRule: () => void
}) {
  const { m } = useI18n()
  const [now] = useState(Date.now)
  const missing = requiredPermissions(status.rules).filter((p) => !status.permissions[p])
  const active = status.enabled && status.rules.length > 0 && missing.length === 0

  return (
    <>
      <div className="relative overflow-hidden">
        {/* Red circle appears only while blocking is live: the stop signal. */}
        <div
          aria-hidden
          className={`pointer-events-none absolute -right-10 top-4 size-40 rounded-full transition-colors duration-200 ease-out ${
            active ? 'bg-accent shadow-[0_0_0_10px_rgba(255,48,0,0.1)]' : 'border-4 border-ink bg-paper'
          }`}
        />
        <div className="relative">
          <ScreenHeader
            index="01"
            label={m.status.label}
            title={
              <>
                {m.status.title(active)[0]}
                <br />
                {m.status.title(active)[1]}
              </>
            }
          />
        </div>
      </div>

      {missing.map((permission, i) => (
        <section
          key={permission}
          className={`border-b-4 border-ink bg-accent px-6 py-6 text-paper ${i === 0 ? 'border-t-4' : ''}`}
        >
          <div className="flex items-start gap-4">
            <ShieldAlert strokeWidth={2.5} className="size-8 shrink-0" />
            <div>
              <p className="text-sm font-black uppercase tracking-[0.15em]">{m.status.permissions[permission].title}</p>
              <p className="mt-2 text-sm font-medium">{m.status.permissions[permission].body}</p>
            </div>
          </div>
          <Button
            variant="primary"
            className="mt-6 active:border-paper! active:bg-paper! active:text-ink!"
            onClick={() => onRequestPermission(permission)}
          >
            {m.status.grantAccess} <ArrowRight strokeWidth={2.5} className="size-5" />
          </Button>
        </section>
      ))}

      <section className="px-6 py-6">
        {status.rules.length === 0 ? (
          <>
            <p className="mb-4 text-sm font-medium text-ink/70">{m.status.empty}</p>
            <Button onClick={onAddRule}>
              {m.status.createRule} <ArrowRight strokeWidth={2.5} className="size-5" />
            </Button>
          </>
        ) : (
          <Button variant={status.enabled ? 'secondary' : 'primary'} onClick={onToggle}>
            {status.enabled ? m.status.turnOff : m.status.turnOn}
            <span className={`size-4 ${status.enabled ? 'bg-accent' : 'border-2 border-current'}`} aria-hidden />
          </Button>
        )}
      </section>

      <section className="swiss-dots border-t-4 border-ink bg-muted">
        <div className="grid grid-cols-2 gap-[2px] bg-ink pb-[2px]">
          <Stat label={m.status.stats.rules} value={String(status.rules.length).padStart(2, '0')} />
          <Stat label={m.status.stats.today} value={String(log.filter((e) => isToday(e.at)).length).padStart(2, '0')} />
          <Stat label={m.status.stats.week} value={String(log.filter((e) => now - e.at < WEEK_MS).length).padStart(2, '0')} />
          <Stat label={m.status.stats.total} value={String(log.length).padStart(2, '0')} />
        </div>
        <p className="px-6 py-6 text-sm font-medium text-ink/70">
          {m.status.emergency}
        </p>
      </section>
    </>
  )
}
