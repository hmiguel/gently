import { App as CapApp } from '@capacitor/app'
import { useEffect, useState, type ReactNode } from 'react'
import { KeyRound } from 'lucide-react'
import { FormScreen, FormSection } from '../components/FormScreen'
import { Button } from '../components/ui'

/** Numbered row: red index, bold title, plain explanation. */
function Point({ index, title, children }: { index: string; title: string; children: ReactNode }) {
  return (
    <li className="flex gap-4 border-b-2 border-ink px-6 py-4 last:border-b-0">
      <span className="text-label w-6 shrink-0 pt-1 text-accent-ink tabular-nums">{index}</span>
      <span>
        <span className="block text-base font-black uppercase tracking-tight">{title}</span>
        <span className="mt-1 block text-sm font-medium text-ink/70">{children}</span>
      </span>
    </li>
  )
}

/** Two-column fact row for the colophon table. */
function Fact({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b-2 border-ink px-6 py-3 last:border-b-0">
      <span className="text-label text-ink/60">{label}</span>
      <span className="text-sm font-bold tabular-nums">{value}</span>
    </div>
  )
}

export function AboutScreen({
  notice,
  onChangeCode,
  onClose,
}: {
  /** One-off confirmation, e.g. after the code was changed. */
  notice?: string
  onChangeCode: () => void
  onClose: () => void
}) {
  const [version, setVersion] = useState('—')

  useEffect(() => {
    CapApp.getInfo()
      .then((info) => setVersion(`${info.version} (${info.build})`))
      .catch(() => setVersion('Development'))
  }, [])

  return (
    <FormScreen
      index="00"
      label="About"
      title={
        <>
          Gently<span className="text-accent">.</span>
        </>
      }
      onClose={onClose}
    >
      <div className="relative overflow-hidden px-6 pb-8">
        {/* The mark, as in the launcher icon. */}
        <div aria-hidden className="pointer-events-none absolute -right-10 top-0 size-28 rounded-full bg-accent" />
        <div aria-hidden className="pointer-events-none absolute right-8 top-16 h-3 w-24 bg-ink" />
        <p className="relative max-w-[22ch] text-lg font-medium leading-snug">
          Blocks the calls you choose, outgoing, incoming or both, behind an access code.
        </p>
      </div>

      <FormSection index="0.1" label="How it works">
        <ol>
          <Point index="01" title="Rules">
            Each rule blocks or allows calls to a number, to anyone, or from hidden numbers.
          </Point>
          <Point index="02" title="Specific wins">
            A rule for one number beats a rule for anyone. Block everyone and allow a few to keep only those.
          </Point>
          <Point index="03" title="Access code">
            Changing anything needs your code. The app locks every time it leaves the screen.
          </Point>
        </ol>
      </FormSection>

      <FormSection index="0.2" label="Permissions">
        <ol>
          <Point index="01" title="Call redirection">Lets Gently stop outgoing calls before they connect.</Point>
          <Point index="02" title="Caller ID & spam">Lets Gently reject incoming calls before your phone rings.</Point>
          <Point index="03" title="Contacts">
            Android only passes calls from saved contacts to apps that may read contacts. Gently never reads
            your address book.
          </Point>
        </ol>
      </FormSection>

      <section className="swiss-grid border-t-4 border-ink bg-muted px-6 py-8">
        <p className="text-label">
          <span className="text-accent-ink">0.3.</span> Privacy
        </p>
        <p className="mt-4 text-3xl font-black uppercase leading-[0.9] tracking-tighter">
          Nothing leaves
          <br />
          this phone.
        </p>
        <p className="mt-4 text-sm font-medium text-ink/70">
          No account, no tracking, no internet access. Rules and the log are stored only on this device.
        </p>
      </section>

      <section className="border-t-4 border-ink bg-ink px-6 py-6 text-paper">
        <p className="text-sm font-black uppercase tracking-[0.15em]">Emergency calls always work</p>
        <p className="mt-2 text-sm font-medium text-paper/70">
          Android never lets an app block emergency numbers, and Gently never tries.
        </p>
      </section>

      <FormSection index="0.4" label="Access code">
        <div className="px-6 py-6">
          {notice && (
            <p className="text-label mb-4 text-accent-ink" role="status">
              {notice}
            </p>
          )}
          <Button variant="secondary" onClick={onChangeCode}>
            Change access code <KeyRound strokeWidth={2.5} className="size-5" />
          </Button>
        </div>
      </FormSection>

      <FormSection index="0.5" label="Details">
        <Fact label="Version" value={version} />
        <Fact label="Requires" value="Android 10+" />
      </FormSection>
      <div className="border-t-4 border-ink" />
    </FormScreen>
  )
}
