import { ArrowRight, ShieldAlert } from 'lucide-react'
import { useState } from 'react'
import { Button, ScreenHeader, Stat } from '../components/ui'
import { requiredPermissions, type LogEntry, type Permissions, type Status } from '../plugins/callguard'

const WEEK_MS = 7 * 24 * 60 * 60 * 1000

const PERMISSION_TEXT: Record<keyof Permissions, { title: string; body: string }> = {
  outgoing: {
    title: 'Outgoing: access required',
    body: 'Allow Gently to screen outgoing calls. Choose Gently as the call redirection app.',
  },
  incoming: {
    title: 'Incoming: access required',
    body: 'Allow Gently to screen incoming calls. Choose Gently as the caller ID & spam app.',
  },
}

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
            label="Status"
            title={
              <>
                Calls
                <br />
                {active ? 'blocked.' : 'open.'}
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
              <p className="text-sm font-black uppercase tracking-[0.15em]">{PERMISSION_TEXT[permission].title}</p>
              <p className="mt-2 text-sm font-medium">{PERMISSION_TEXT[permission].body}</p>
            </div>
          </div>
          <Button
            variant="primary"
            className="mt-6 active:border-paper! active:bg-paper! active:text-ink!"
            onClick={() => onRequestPermission(permission)}
          >
            Grant access <ArrowRight strokeWidth={2.5} className="size-5" />
          </Button>
        </section>
      ))}

      <section className="px-6 py-6">
        {status.rules.length === 0 ? (
          <>
            <p className="mb-4 text-sm font-medium text-ink/70">Nothing to block yet. Start with your first rule.</p>
            <Button onClick={onAddRule}>
              Create a rule <ArrowRight strokeWidth={2.5} className="size-5" />
            </Button>
          </>
        ) : (
          <Button variant={status.enabled ? 'secondary' : 'primary'} onClick={onToggle}>
            {status.enabled ? 'Turn blocking off' : 'Turn blocking on'}
            <span className={`size-4 ${status.enabled ? 'bg-accent' : 'border-2 border-current'}`} aria-hidden />
          </Button>
        )}
      </section>

      <section className="swiss-dots border-t-4 border-ink bg-muted">
        <div className="grid grid-cols-2 gap-[2px] bg-ink pb-[2px]">
          <Stat label="Rules" value={String(status.rules.length).padStart(2, '0')} />
          <Stat label="Today" value={String(log.filter((e) => isToday(e.at)).length).padStart(2, '0')} />
          <Stat label="7 days" value={String(log.filter((e) => now - e.at < WEEK_MS).length).padStart(2, '0')} />
          <Stat label="Total" value={String(log.length).padStart(2, '0')} />
        </div>
        <p className="px-6 py-6 text-sm font-medium text-ink/70">
          Emergency numbers are always allowed. Android never lets an app block them.
        </p>
      </section>
    </>
  )
}
