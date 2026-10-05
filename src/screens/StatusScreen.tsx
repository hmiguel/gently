import { ArrowRight, ShieldAlert } from 'lucide-react'
import { Button, ScreenHeader, Stat } from '../components/ui'
import type { LogEntry, Mode, Status } from '../plugins/callguard'

const MODE_NAMES: Record<Mode, string> = {
  all: 'All',
  blocklist: 'Block',
  allowlist: 'Allow',
}

function isToday(ts: number) {
  return new Date(ts).toDateString() === new Date().toDateString()
}

export function StatusScreen({
  status,
  log,
  onToggle,
  onRequestPermission,
}: {
  status: Status
  log: LogEntry[]
  onToggle: () => void
  onRequestPermission: () => void
}) {
  const active = status.enabled && status.hasPermission

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

      {!status.hasPermission && (
        <section className="border-y-4 border-ink bg-accent px-6 py-6 text-paper">
          <div className="flex items-start gap-4">
            <ShieldAlert strokeWidth={2.5} className="size-8 shrink-0" />
            <div>
              <p className="text-sm font-black uppercase tracking-[0.15em]">Permission required</p>
              <p className="mt-2 text-sm font-medium">
                Gently must be allowed to screen outgoing calls before it can block anything.
              </p>
            </div>
          </div>
          <Button variant="primary" className="mt-6 active:border-paper! active:bg-paper! active:text-ink!" onClick={onRequestPermission}>
            Grant access <ArrowRight strokeWidth={2.5} className="size-5" />
          </Button>
        </section>
      )}

      <section className="px-6 py-6">
        <Button variant={status.enabled ? 'secondary' : 'primary'} onClick={onToggle}>
          {status.enabled ? 'Turn blocking off' : 'Turn blocking on'}
          <span className={`size-4 ${status.enabled ? 'bg-accent' : 'border-2 border-current'}`} aria-hidden />
        </Button>
      </section>

      <section className="swiss-dots border-t-4 border-ink bg-muted">
        <div className="grid grid-cols-2 gap-[2px] bg-ink pb-[2px]">
          <Stat label="Mode" value={MODE_NAMES[status.mode]} />
          <Stat label="Numbers" value={String(status.numbers.length).padStart(2, '0')} />
          <Stat label="Today" value={String(log.filter((e) => isToday(e.at)).length).padStart(2, '0')} />
          <Stat label="Total" value={String(log.length).padStart(2, '0')} />
        </div>
        <p className="px-6 py-6 text-sm font-medium text-ink/70">
          Emergency numbers are always allowed. Android never lets an app block them.
        </p>
      </section>
    </>
  )
}
