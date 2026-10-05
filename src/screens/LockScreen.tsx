import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Keypad, PinSlots } from '../components/Keypad'
import { SectionLabel } from '../components/ui'
import { buzzError, tap, thud } from '../lib/haptics'
import { getLockedUntil, PIN_LENGTH, setPin, verifyPin } from '../lib/pin'

type Mode = 'setup' | 'unlock' | 'change'
type Step = 'unlock' | 'create' | 'confirm'

const TITLES: Record<Step, string> = {
  unlock: 'Locked.',
  create: 'Set code.',
  confirm: 'Repeat.',
}

const HINTS: Record<Step, string> = {
  unlock: 'Enter your access code',
  create: `Choose a ${PIN_LENGTH}-digit code`,
  confirm: 'Enter the same code again',
}

/** Changing the code: prove the current one first, then the usual set + repeat. */
const CHANGE_TITLES: Partial<Record<Step, string>> = { unlock: 'Current.', create: 'New code.' }
const CHANGE_HINTS: Partial<Record<Step, string>> = { unlock: 'Enter your current code' }

/**
 * PIN entry for first-run setup, unlocking, and changing the code. In
 * "change" mode a wrong current code counts toward the same lockout, and
 * `onCancel` shows a close button.
 */
export function LockScreen({
  mode,
  onUnlock,
  onCancel,
}: {
  mode: Mode
  /** Called once setup, unlock, or the change has succeeded. */
  onUnlock: () => void
  onCancel?: () => void
}) {
  const [step, setStep] = useState<Step>(mode === 'setup' ? 'create' : 'unlock')
  const [digits, setDigits] = useState('')
  const [firstCode, setFirstCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [lockedUntil, setLockedUntil] = useState(0)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    getLockedUntil().then(setLockedUntil)
  }, [])

  // Tick once a second while locked out so the countdown updates.
  const lockedOut = lockedUntil > now
  useEffect(() => {
    if (!lockedOut) return
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [lockedOut])

  async function submit(code: string) {
    setBusy(true)
    try {
      if (step === 'create') {
        setFirstCode(code)
        setStep('confirm')
      } else if (step === 'confirm') {
        if (code === firstCode) {
          await setPin(code)
          thud()
          onUnlock()
          return
        }
        fail('Codes did not match')
        setStep('create')
      } else {
        const result = await verifyPin(code)
        if (result.ok) {
          if (mode === 'change') {
            setStep('create')
            return
          }
          thud()
          onUnlock()
          return
        }
        setNow(Date.now())
        setLockedUntil(result.lockedUntil)
        fail('Wrong code')
      }
    } finally {
      setDigits('')
      setBusy(false)
    }
  }

  function fail(message: string) {
    buzzError()
    setError(message)
  }

  function onDigit(d: string) {
    if (busy || lockedOut) return
    setError(null)
    const next = digits + d
    setDigits(next)
    if (next.length === PIN_LENGTH) submit(next)
  }

  const secondsLeft = Math.ceil((lockedUntil - now) / 1000)
  const title = (mode === 'change' && CHANGE_TITLES[step]) || TITLES[step]
  const hint = (mode === 'change' && CHANGE_HINTS[step]) || HINTS[step]

  return (
    <div className="flex h-full flex-col">
      <section className="swiss-grid pt-safe relative flex flex-1 flex-col overflow-hidden">
        {/* The Gently mark: a red signal circle cut by a black bar. */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -right-16 top-10 size-56 rounded-full bg-accent shadow-[0_0_0_12px_rgba(255,48,0,0.1)]" />
          <div className="absolute right-0 top-40 h-4 w-3/5 bg-ink" />
        </div>

        {onCancel && (
          <button
            type="button"
            aria-label="Cancel"
            onClick={() => {
              tap()
              onCancel()
            }}
            className="relative ml-2 mt-2 flex size-11 items-center justify-center transition-colors duration-150 ease-linear active:bg-ink active:text-paper"
          >
            <X strokeWidth={2.5} className="size-6" />
          </button>
        )}

        <div className="relative mt-auto px-6 pb-8">
          <SectionLabel index="00">{mode === 'change' ? 'Change code' : 'Access'}</SectionLabel>
          <h1 className="text-display mt-4">{title}</h1>
          <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
            <PinSlots length={PIN_LENGTH} filled={digits.length} error={!!error} />
            <p className={`text-label ${error || lockedOut ? 'text-accent-ink' : 'text-ink/60'}`} aria-live="polite">
              {lockedOut ? `Wait ${secondsLeft}s` : (error ?? hint)}
            </p>
          </div>
        </div>
      </section>

      <div className="pb-safe bg-ink">
        <Keypad onDigit={onDigit} onDelete={() => setDigits((d) => d.slice(0, -1))} disabled={busy || lockedOut} />
      </div>
    </div>
  )
}
