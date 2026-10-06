import { App as CapApp } from '@capacitor/app'
import { useEffect, useState, type ReactNode } from 'react'
import { FormScreen, FormSection } from '../components/FormScreen'
import { useI18n } from '../i18n'

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

export function AboutScreen({ onClose }: { onClose: () => void }) {
  const { m } = useI18n()
  const t = m.about
  const [version, setVersion] = useState('—')

  useEffect(() => {
    CapApp.getInfo()
      .then((info) => setVersion(`${info.version} (${info.build})`))
      .catch(() => setVersion(__APP_VERSION__))
  }, [])

  return (
    <FormScreen
      index="00"
      label={t.label}
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
        <p className="relative max-w-[62%] text-lg font-medium leading-snug">
          {t.tagline}
        </p>
      </div>

      <FormSection index="0.1" label={t.howItWorks}>
        <ol>
          {t.points.map((point, i) => (
            <Point key={point.title} index={String(i + 1).padStart(2, '0')} title={point.title}>
              {point.body}
            </Point>
          ))}
        </ol>
      </FormSection>

      <FormSection index="0.2" label={t.permissions}>
        <ol>
          {t.permissionPoints.map((point, i) => (
            <Point key={point.title} index={String(i + 1).padStart(2, '0')} title={point.title}>
              {point.body}
            </Point>
          ))}
        </ol>
      </FormSection>

      <section className="swiss-grid border-t-4 border-ink bg-muted px-6 py-8">
        <p className="text-label">
          <span className="text-accent-ink">0.3.</span> {t.privacy}
        </p>
        <p className="mt-4 text-3xl font-black uppercase leading-[0.9] tracking-tighter">
          {t.privacyTitle[0]}
          <br />
          {t.privacyTitle[1]}
        </p>
        <p className="mt-4 text-sm font-medium text-ink/70">
          {t.privacyBody}
        </p>
      </section>

      <section className="border-t-4 border-ink bg-ink px-6 py-6 text-paper">
        <p className="text-sm font-black uppercase tracking-[0.15em]">{t.emergencyTitle}</p>
        <p className="mt-2 text-sm font-medium text-paper/70">
          {t.emergencyBody}
        </p>
      </section>

      <FormSection index="0.4" label={t.details}>
        <Fact label={t.version} value={version} />
        <Fact label={t.requires} value="Android 10+" />
      </FormSection>
      <div className="border-t-4 border-ink" />
    </FormScreen>
  )
}
