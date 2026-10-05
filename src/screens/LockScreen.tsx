import { useEffect, useState } from 'react'
import { Keypad, PinSlots } from '../components/Keypad'
import { SectionLabel } from '../components/ui'
import { buzzError, thud } from '../lib/haptics'
import { getLockedUntil, PIN_LENGTH, setPin, verifyPin } from '../lib/pin'

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

/** PIN entry for both first-run setup (`mode="setup"`) and unlocking. */
export function LockScreen({ mode, onUnlock }: { mode: 'setup' | 'unlock'; onUnlock: () => void }) {
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

  return (
    <div className="flex h-full flex-col">
      <section className="swiss-grid pt-safe relative flex flex-1 flex-col overflow-hidden">
        {/* Bauhaus composition: a red signal circle cut by a black bar. */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -right-16 top-10 size-56 rounded-full bg-accent shadow-[0_0_0_12px_rgba(255,48,0,0.1)]" />
          <div className="absolute right-0 top-40 h-4 w-3/5 bg-ink" />
          <div className="absolute right-24 top-6 size-10 border-4 border-ink bg-paper" />
        </div>

        <div className="relative mt-auto px-6 pb-8">
          <SectionLabel index="00">Access</SectionLabel>
          <h1 className="text-display mt-4">{TITLES[step]}</h1>
          <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
            <PinSlots length={PIN_LENGTH} filled={digits.length} error={!!error} />
            <p className={`text-label ${error || lockedOut ? 'text-accent-ink' : 'text-ink/60'}`} aria-live="polite">
              {lockedOut ? `Wait ${secondsLeft}s` : (error ?? HINTS[step])}
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
