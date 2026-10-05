import { App as CapApp } from '@capacitor/app'
import { Lock } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { TabBar, type Tab } from './components/TabBar'
import { tap } from './lib/haptics'
import { hasPin } from './lib/pin'
import { CallGuard, type LogEntry, type Rules, type Status } from './plugins/callguard'
import { LockScreen } from './screens/LockScreen'
import { LogScreen } from './screens/LogScreen'
import { RulesScreen } from './screens/RulesScreen'
import { StatusScreen } from './screens/StatusScreen'

type Phase = 'loading' | 'setup' | 'locked' | 'open'

export default function App() {
  const [phase, setPhase] = useState<Phase>('loading')
  const [tab, setTab] = useState<Tab>('status')
  const [status, setStatus] = useState<Status | null>(null)
  const [log, setLog] = useState<LogEntry[]>([])
  // The permission dialog backgrounds the app; that must not lock it.
  const expectingSystemDialog = useRef(false)

  const refresh = useCallback(async () => {
    const [s, l] = await Promise.all([CallGuard.getStatus(), CallGuard.getLog()])
    setStatus(s)
    setLog(l.entries)
  }, [])

  useEffect(() => {
    hasPin().then((exists) => setPhase(exists ? 'locked' : 'setup'))
  }, [])

  // Lock whenever the app leaves the foreground; refresh when it returns.
  useEffect(() => {
    const sub = CapApp.addListener('appStateChange', ({ isActive }) => {
      if (isActive) {
        refresh()
      } else if (!expectingSystemDialog.current) {
        setPhase((p) => (p === 'open' ? 'locked' : p))
      }
    })
    return () => {
      sub.then((s) => s.remove())
    }
  }, [refresh])

  const saveRules = async (rules: Rules) => {
    setStatus((s) => (s ? { ...s, ...rules } : s)) // optimistic
    setStatus(await CallGuard.setRules(rules))
  }

  const requestPermission = async () => {
    expectingSystemDialog.current = true
    try {
      setStatus(await CallGuard.requestPermission())
    } finally {
      expectingSystemDialog.current = false
    }
  }

  if (phase === 'loading') return <div className="h-full bg-paper" />
  if (phase !== 'open') {
    return <LockScreen key={phase} mode={phase === 'setup' ? 'setup' : 'unlock'} onUnlock={() => {
          setPhase('open')
          refresh()
        }} />
  }

  const rules: Rules | null = status && { enabled: status.enabled, mode: status.mode, numbers: status.numbers }

  return (
    <div className="flex h-full flex-col">
      <header className="pt-safe border-b-4 border-ink bg-paper">
        <div className="flex h-14 items-center justify-between pl-6 pr-2">
          <span className="text-xl font-black uppercase tracking-tighter">
            Gently<span className="text-accent">.</span>
          </span>
          <button
            type="button"
            aria-label="Lock app"
            onClick={() => {
              tap()
              setPhase('locked')
            }}
            className="flex size-11 items-center justify-center transition-colors duration-150 ease-linear active:bg-ink active:text-paper"
          >
            <Lock strokeWidth={2.5} className="size-5" />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        {status && rules && (
          <>
            {tab === 'status' && (
              <StatusScreen
                status={status}
                log={log}
                onToggle={() => saveRules({ ...rules, enabled: !rules.enabled })}
                onRequestPermission={requestPermission}
              />
            )}
            {tab === 'rules' && <RulesScreen rules={rules} onChange={saveRules} />}
            {tab === 'log' && (
              <LogScreen
                log={log}
                numbers={status.numbers}
                onClear={async () => {
                  await CallGuard.clearLog()
                  setLog([])
                }}
              />
            )}
          </>
        )}
      </main>

      <TabBar active={tab} onChange={setTab} />
    </div>
  )
}
