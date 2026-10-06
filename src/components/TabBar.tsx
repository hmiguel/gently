import { useI18n } from '../i18n'
import { tap } from '../lib/haptics'

export type Tab = 'status' | 'rules' | 'log'

const TABS: { id: Tab; index: string }[] = [
  { id: 'status', index: '01' },
  { id: 'rules', index: '02' },
  { id: 'log', index: '03' },
]

/** Bottom navigation: three ruled cells, the active one inverted to black. */
export function TabBar({ active, onChange }: { active: Tab; onChange: (tab: Tab) => void }) {
  const { m } = useI18n()
  return (
    <nav className="pb-safe border-t-4 border-ink bg-ink" aria-label={m.common.sections}>
      <div className="grid grid-cols-3 gap-[2px]">
        {TABS.map((tab) => {
          const current = tab.id === active
          return (
            <button
              key={tab.id}
              type="button"
              aria-current={current ? 'page' : undefined}
              onClick={() => {
                tap()
                onChange(tab.id)
              }}
              className={`flex h-16 flex-col items-start justify-center px-4 text-left transition-colors duration-150 ease-linear ${
                current ? 'bg-ink text-paper' : 'bg-paper text-ink active:bg-muted'
              }`}
            >
              <span className={`text-label ${current ? 'text-accent' : 'text-accent-ink'}`}>{tab.index}</span>
              <span className="text-sm font-bold uppercase tracking-[0.15em]">{m.tabs[tab.id]}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
