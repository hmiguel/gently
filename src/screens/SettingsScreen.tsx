import { Check, KeyRound } from 'lucide-react'
import type { ReactNode } from 'react'
import { FormScreen, FormSection } from '../components/FormScreen'
import { tap } from '../lib/haptics'
import type { Permissions } from '../plugins/callguard'

/** Full-width tappable row: title, explanation, and a trailing element. */
function Row({
  title,
  description,
  trailing,
  onClick,
}: {
  title: string
  description: string
  trailing: ReactNode
  onClick?: () => void
}) {
  const body = (
    <>
      <span className="min-w-0">
        <span className="block text-base font-black uppercase tracking-tight">{title}</span>
        <span className="mt-0.5 block text-sm font-medium opacity-60">{description}</span>
      </span>
      {trailing}
    </>
  )
  const className =
    'flex w-full items-center justify-between gap-4 border-b-2 border-ink px-6 py-4 text-left last:border-b-0'
  if (!onClick) return <div className={className}>{body}</div>
  return (
    <button
      type="button"
      onClick={() => {
        tap()
        onClick()
      }}
      className={`${className} transition-colors duration-150 ease-linear active:bg-ink active:text-paper`}
    >
      {body}
    </button>
  )
}

const PERMISSION_ROWS: { key: keyof Permissions; title: string; description: string }[] = [
  { key: 'outgoing', title: 'Outgoing calls', description: 'Call redirection app' },
  { key: 'incoming', title: 'Incoming calls', description: 'Caller ID & spam app, and contacts' },
]

export function SettingsScreen({
  permissions,
  notice,
  onChangeCode,
  onRequestPermission,
  onClose,
}: {
  permissions: Permissions
  /** One-off confirmation, e.g. after the code was changed. */
  notice?: string
  onChangeCode: () => void
  onRequestPermission: (direction: keyof Permissions) => void
  onClose: () => void
}) {
  return (
    <FormScreen index="00" label="Settings" title="Settings." onClose={onClose}>
      <FormSection index="0.1" label="Access code">
        {notice && (
          <p className="text-label border-b-2 border-ink bg-muted px-6 py-3 text-accent-ink" role="status">
            {notice}
          </p>
        )}
        <Row
          title="Change access code"
          description="Needs your current code"
          trailing={<KeyRound strokeWidth={2.5} className="size-5 shrink-0" aria-hidden />}
          onClick={onChangeCode}
        />
      </FormSection>

      <FormSection index="0.2" label="Permissions">
        {PERMISSION_ROWS.map(({ key, title, description }) =>
          permissions[key] ? (
            <Row
              key={key}
              title={title}
              description={description}
              trailing={
                <span className="text-label flex shrink-0 items-center gap-1.5">
                  <Check strokeWidth={3} className="size-4" aria-hidden /> Granted
                </span>
              }
            />
          ) : (
            <Row
              key={key}
              title={title}
              description={description}
              onClick={() => onRequestPermission(key)}
              trailing={
                <span className="text-label shrink-0 bg-accent px-3 py-2 text-paper">Grant</span>
              }
            />
          ),
        )}
      </FormSection>

      <div className="border-t-4 border-ink" />
    </FormScreen>
  )
}
