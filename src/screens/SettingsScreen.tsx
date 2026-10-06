import { Check, ChevronDown, ExternalLink, KeyRound } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { Button } from '../components/ui'
import { FormScreen, FormSection, OptionList } from '../components/FormScreen'
import { LANGUAGES, useI18n, type Language, type TimeFormat } from '../i18n'
import { tap } from '../lib/haptics'
import type { Permissions } from '../plugins/callguard'

/** Full-width tappable row: title, explanation, and a trailing element. */
function Row({
  title,
  description,
  trailing,
  onClick,
  role,
  checked,
}: {
  title: string
  description: string
  trailing: ReactNode
  onClick?: () => void
  role?: 'switch'
  checked?: boolean
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
      role={role}
      aria-checked={role ? checked : undefined}
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

/** Rectangular switch: the knob snaps, it doesn't glide. */
function Switch({ on }: { on: boolean }) {
  return (
    <span aria-hidden className={`flex h-7 w-12 shrink-0 border-4 border-current p-0.5 ${on ? 'justify-end' : 'justify-start'}`}>
      <span className={`size-3.5 ${on ? 'bg-accent' : 'bg-current'}`} />
    </span>
  )
}

export type SettingsNotice = 'codeChanged' | 'lockOn' | 'lockOff'

const PERMISSION_KEYS: (keyof Permissions)[] = ['outgoing', 'incoming']

export function SettingsScreen({
  permissions,
  lockEnabled,
  notice,
  onToggleLock,
  onChangeCode,
  onRequestPermission,
  onRestoreSpam,
  onClose,
}: {
  permissions: Permissions
  lockEnabled: boolean
  /** One-off confirmation after a code change. */
  notice?: SettingsNotice
  /** Turning the lock off asks for the code first; the parent handles that. */
  onToggleLock: () => void
  onChangeCode: () => void
  onRequestPermission: (direction: keyof Permissions) => void
  /** Hand "Caller ID & spam" back to the Phone app (Android's default-apps screen). */
  onRestoreSpam: () => void
  onClose: () => void
}) {
  const { m, language, setLanguage, timeFormat, setTimeFormat, phoneIs24Hour } = useI18n()
  const t = m.settings
  const [showRestoreSteps, setShowRestoreSteps] = useState(false)

  // Each option shows a sample time (15:32) in that style.
  const sample = (hourCycle: 'h12' | 'h23') =>
    new Intl.DateTimeFormat(m.locale, { hour: 'numeric', minute: '2-digit', hourCycle }).format(new Date(2026, 0, 1, 15, 32))
  const timeOptions: { value: TimeFormat; title: string; description: string }[] = [
    { value: 'system', title: t.systemTime, description: t.systemTimeHint(phoneIs24Hour ? 24 : 12) },
    { value: '12', title: t.hours12, description: sample('h12') },
    { value: '24', title: t.hours24, description: sample('h23') },
  ]

  const languageOptions: { value: Language; title: string; description: string }[] = [
    { value: 'system', title: t.systemLanguage, description: t.systemLanguageHint },
    ...LANGUAGES.map(({ code, name }) => ({ value: code as Language, title: name, description: '' })),
  ]

  return (
    <FormScreen index="00" label={t.label} title={t.title} onClose={onClose}>
      <FormSection index="0.1" label={t.accessCode}>
        {notice && (
          <p className="text-label border-b-2 border-ink bg-muted px-6 py-3 text-accent-ink" role="status">
            {t.notices[notice]}
          </p>
        )}
        <Row
          title={t.requireCode}
          description={lockEnabled ? t.requireOn : t.requireOff}
          role="switch"
          checked={lockEnabled}
          trailing={<Switch on={lockEnabled} />}
          onClick={onToggleLock}
        />
        <Row
          title={t.changeCode}
          description={t.changeHint}
          trailing={<KeyRound strokeWidth={2.5} className="size-5 shrink-0" aria-hidden />}
          onClick={onChangeCode}
        />
      </FormSection>

      <FormSection index="0.2" label={t.language}>
        <OptionList label={t.language} options={languageOptions} value={language} onChange={setLanguage} />
      </FormSection>

      <FormSection index="0.3" label={t.timeFormat}>
        <OptionList label={t.timeFormat} options={timeOptions} value={timeFormat} onChange={setTimeFormat} />
      </FormSection>

      <FormSection index="0.4" label={t.permissions}>
        {PERMISSION_KEYS.map((key) =>
          permissions[key] ? (
            <Row
              key={key}
              title={t.permissionRows[key].title}
              description={t.permissionRows[key].description}
              trailing={
                <span className="text-label flex shrink-0 items-center gap-1.5">
                  <Check strokeWidth={3} className="size-4" aria-hidden /> {t.granted}
                </span>
              }
            />
          ) : (
            <Row
              key={key}
              title={t.permissionRows[key].title}
              description={t.permissionRows[key].description}
              onClick={() => onRequestPermission(key)}
              trailing={<span className="text-label shrink-0 bg-accent px-3 py-2 text-paper">{t.grant}</span>}
            />
          ),
        )}
        {permissions.incoming && (
          <>
            <Row
              title={t.restoreSpam.title}
              description={t.restoreSpam.description}
              trailing={
                <ChevronDown
                  strokeWidth={2.5}
                  className={`size-5 shrink-0 transition-transform duration-200 ease-out ${showRestoreSteps ? 'rotate-180' : ''}`}
                  aria-hidden
                />
              }
              onClick={() => setShowRestoreSteps(!showRestoreSteps)}
            />
            {/* Android only lets apps open the full default-apps list, so say which row to pick first. */}
            {showRestoreSteps && (
              <div className="swiss-diagonal border-t-2 border-ink bg-muted px-6 py-5">
                <ol className="space-y-2">
                  {t.restoreSpam.steps.map((step, i) => (
                    <li key={step} className="flex gap-3 text-sm font-medium">
                      <span className="text-label pt-0.5 text-accent-ink tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                      {step}
                    </li>
                  ))}
                </ol>
                <Button variant="secondary" className="mt-5" onClick={onRestoreSpam}>
                  {t.restoreSpam.open} <ExternalLink strokeWidth={2.5} className="size-5" />
                </Button>
              </div>
            )}
          </>
        )}
      </FormSection>

      <div className="border-t-4 border-ink" />
    </FormScreen>
  )
}
