import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { tap } from '../lib/haptics'

type Variant = 'primary' | 'secondary' | 'accent'

const variants: Record<Variant, string> = {
  primary: 'bg-ink text-paper border-ink active:bg-accent active:border-accent',
  secondary: 'bg-paper text-ink border-ink active:bg-ink active:text-paper',
  accent: 'bg-accent text-paper border-accent active:bg-ink active:border-ink',
}

/** Full-width rectangular button. Press = instant color snap, never a fade. */
export function Button({
  variant = 'primary',
  type = 'button',
  className = '',
  onClick,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      {...props}
      type={type}
      onClick={(e) => {
        tap()
        onClick?.(e)
      }}
      className={`flex h-16 w-full items-center justify-between border-4 px-5 text-sm font-bold uppercase tracking-[0.15em] transition-colors duration-150 ease-linear disabled:opacity-40 ${variants[variant]} ${className}`}
    />
  )
}

/** "01. STATUS" — numbered section label, the red prefix is the only color. */
export function SectionLabel({ index, children }: { index: string; children: ReactNode }) {
  return (
    <p className="text-label">
      <span className="text-accent-ink">{index}.</span> {children}
    </p>
  )
}

/** Label above a massive, flush-left headline. */
export function ScreenHeader({ index, label, title }: { index: string; label: string; title: ReactNode }) {
  return (
    <header className="px-6 pb-8 pt-6">
      <SectionLabel index={index}>{label}</SectionLabel>
      <h1 className="text-display mt-4">{title}</h1>
    </header>
  )
}

/** One cell of a stats grid. */
export function Stat({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="bg-paper p-5">
      <p className="text-label text-ink/60">{label}</p>
      <p className="mt-3 text-4xl font-black uppercase tracking-tighter tabular-nums">{value}</p>
    </div>
  )
}
