import { Delete } from 'lucide-react'
import { tap } from '../lib/haptics'

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'] as const

/**
 * 3×4 numeric keypad. The black gap between cells *is* the grid: a visible,
 * 2px structural line instead of per-key borders.
 */
export function Keypad({
  onDigit,
  onDelete,
  disabled,
}: {
  onDigit: (d: string) => void
  onDelete: () => void
  disabled?: boolean
}) {
  return (
    <div className="grid grid-cols-3 gap-[2px] border-t-4 border-ink bg-ink">
      {KEYS.map((key, i) =>
        key === '' ? (
          <div key={i} className="swiss-diagonal bg-muted" aria-hidden />
        ) : (
          <button
            key={i}
            type="button"
            disabled={disabled}
            aria-label={key === 'del' ? 'Delete digit' : key}
            onClick={() => {
              tap()
              if (key === 'del') onDelete()
              else onDigit(key)
            }}
            className="flex h-[4.5rem] items-center justify-center bg-paper text-3xl font-bold tabular-nums transition-colors duration-150 ease-linear active:bg-accent active:text-paper disabled:text-ink/30"
          >
            {key === 'del' ? <Delete strokeWidth={2.5} className="size-7" /> : key}
          </button>
        ),
      )}
    </div>
  )
}

/** Row of square slots showing how many digits are entered. */
export function PinSlots({ length, filled, error }: { length: number; filled: number; error?: boolean }) {
  return (
    <div className="flex gap-2" role="status" aria-label={`${filled} of ${length} digits entered`}>
      {Array.from({ length }, (_, i) => (
        <span
          key={i}
          className={`size-6 border-4 transition-colors duration-150 ease-linear ${
            error ? 'border-accent bg-accent' : i < filled ? 'border-ink bg-ink' : 'border-ink bg-paper'
          }`}
        />
      ))}
    </div>
  )
}
