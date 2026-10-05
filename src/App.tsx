import { App as CapApp } from '@capacitor/app'
import { Info, Lock, Settings } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { TabBar, type Tab } from './components/TabBar'
import { tap } from './lib/haptics'
import { hasPin } from './lib/pin'
import { CallGuard, type LogEntry, type Permissions, type Rule, type Rules, type Status } from './plugins/callguard'
import { ContactPicker } from './plugins/contacts'
import { LockScreen } from './screens/LockScreen'
import { LogScreen } from './screens/LogScreen'
import { AboutScreen } from './screens/AboutScreen'
import { RuleForm } from './screens/RuleForm'
import { SettingsScreen } from './screens/SettingsScreen'
import { RulesScreen } from './screens/RulesScreen'
import { StatusScreen } from './screens/StatusScreen'

type Phase = 'loading' | 'setup' | 'locked' | 'open'

/** Full-screen pages layered over the tabs. A rule with `id: null` is a new one. */
type Overlay =
  | { kind: 'rule'; id: string | null }
  | { kind: 'settings'; notice?: string }
  | { kind: 'changeCode' }
  | { kind: 'about' }

export default function App() {
  const [phase, setPhase] = useState<Phase>('loading')
  const [tab, setTab] = useState<Tab>('status')
  const [status, setStatus] = useState<Status | null>(null)
  const [log, setLog] = useState<LogEntry[]>([])
  const [overlay, setOverlay] = useState<Overlay | null>(null)
  const overlayRef = useRef(overlay)
  useEffect(() => {
    overlayRef.current = overlay
  }, [overlay])
  // System dialogs (permissions, contact picker) background the app; that must not lock it.
  const expectingSystemDialog = useRef(false)

  const withSystemDialog = useCallback(async <T,>(open: () => Promise<T>) => {
    expectingSystemDialog.current = true
    try {
      return await open()
    } finally {
      expectingSystemDialog.current = false
    }
  }, [])

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

  // Android back closes the open form; otherwise it backgrounds the app.
  useEffect(() => {
    const sub = CapApp.addListener('backButton', () => {
      if (overlayRef.current) setOverlay(null)
      else CapApp.minimizeApp()
    })
    return () => {
      sub.then((s) => s.remove())
    }
  }, [])

  const saveRules = async (rules: Rules) => {
    setStatus((s) => (s ? { ...s, ...rules } : s)) // optimistic
    setStatus(await CallGuard.setRules(rules))
  }

  const requestPermission = async (direction: keyof Permissions) => {
    setStatus(await withSystemDialog(() => CallGuard.requestPermission({ direction })))
  }

  const pickContact = async () => (await withSystemDialog(() => ContactPicker.pickPhone())).contact

  if (phase === 'loading') return <div className="h-full bg-paper" />
  if (phase !== 'open') {
    return (
      <LockScreen
        key={phase}
        mode={phase === 'setup' ? 'setup' : 'unlock'}
        onUnlock={() => {
          setPhase('open')
          refresh()
        }}
      />
    )
  }

  const rules: Rules | null = status && { enabled: status.enabled, rules: status.rules }
  const saveRuleList = (list: Rule[]) => rules && saveRules({ ...rules, rules: list })

  return (
    <div className="flex h-full flex-col">
      <header className="pt-safe border-b-4 border-ink bg-paper">
        <div className="flex h-14 items-center justify-between pl-6 pr-2">
          <span className="text-xl font-black uppercase tracking-tighter">
            Gently<span className="text-accent">.</span>
          </span>
          <div className="flex">
            <button
              type="button"
              aria-label="Settings"
              onClick={() => {
                tap()
                setOverlay({ kind: 'settings' })
              }}
              className="flex size-11 items-center justify-center transition-colors duration-150 ease-linear active:bg-ink active:text-paper"
            >
              <Settings strokeWidth={2.5} className="size-5" />
            </button>
            <button
              type="button"
              aria-label="About Gently"
              onClick={() => {
                tap()
                setOverlay({ kind: 'about' })
              }}
              className="flex size-11 items-center justify-center transition-colors duration-150 ease-linear active:bg-ink active:text-paper"
            >
              <Info strokeWidth={2.5} className="size-5" />
            </button>
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
                onAddRule={() => setOverlay({ kind: 'rule', id: null })}
              />
            )}
            {tab === 'rules' && (
              <RulesScreen
                rules={rules.rules}
                onOpen={(id) => setOverlay({ kind: 'rule', id })}
                onCreate={() => setOverlay({ kind: 'rule', id: null })}
              />
            )}
            {tab === 'log' && (
              <LogScreen
                log={log}
                rules={status.rules}
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

      {status && overlay?.kind === 'settings' && (
        <SettingsScreen
          permissions={status.permissions}
          notice={overlay.notice}
          onChangeCode={() => setOverlay({ kind: 'changeCode' })}
          onRequestPermission={requestPermission}
          onClose={() => setOverlay(null)}
        />
      )}
      {overlay?.kind === 'about' && <AboutScreen onClose={() => setOverlay(null)} />}
      {overlay?.kind === 'changeCode' && (
        <div className="fixed inset-0 z-40 animate-sheet-in bg-paper">
          <LockScreen
            mode="change"
            onCancel={() => setOverlay({ kind: 'settings' })}
            onUnlock={() => setOverlay({ kind: 'settings', notice: 'Access code changed' })}
          />
        </div>
      )}
      {rules && overlay?.kind === 'rule' && (
        <RuleForm
          key={overlay.id ?? 'new'}
          rule={rules.rules.find((r) => r.id === overlay.id)}
          others={rules.rules.filter((r) => r.id !== overlay.id)}
          onPickContact={pickContact}
          onClose={() => setOverlay(null)}
          onSave={(rule) => {
            const exists = rules.rules.some((r) => r.id === rule.id)
            saveRuleList(exists ? rules.rules.map((r) => (r.id === rule.id ? rule : r)) : [...rules.rules, rule])
            setOverlay(null)
          }}
          onDelete={
            overlay.id === null
              ? undefined
              : () => {
                  saveRuleList(rules.rules.filter((r) => r.id !== overlay.id))
                  setOverlay(null)
                }
          }
        />
      )}
    </div>
  )
}
