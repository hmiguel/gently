import { Preferences } from '@capacitor/preferences'

/**
 * The access code is never stored: only a salted PBKDF2 hash. Failed attempts
 * are persisted so restarting the app doesn't reset the lockout.
 */
export const PIN_LENGTH = 6

const PIN_KEY = 'gently.pin'
const ATTEMPTS_KEY = 'gently.pin.attempts'
const ITERATIONS = 150_000
const FREE_ATTEMPTS = 5
const BASE_LOCKOUT_MS = 30_000

interface StoredPin {
  salt: string
  hash: string
  iterations: number
}

interface Attempts {
  failures: number
  lockedUntil: number
}

export type VerifyResult = { ok: true } | { ok: false; lockedUntil: number }

const toHex = (buf: ArrayBuffer | Uint8Array) =>
  Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, '0')).join('')

const fromHex = (hex: string) => new Uint8Array(hex.match(/../g)!.map((h) => parseInt(h, 16)))

async function derive(pin: string, salt: Uint8Array, iterations: number) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(pin), 'PBKDF2', false, [
    'deriveBits',
  ])
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: salt as BufferSource, iterations, hash: 'SHA-256' },
    key,
    256,
  )
  return toHex(bits)
}

async function readJSON<T>(key: string): Promise<T | null> {
  const { value } = await Preferences.get({ key })
  return value ? (JSON.parse(value) as T) : null
}

export async function hasPin() {
  return (await readJSON<StoredPin>(PIN_KEY)) !== null
}

export async function setPin(pin: string) {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const stored: StoredPin = { salt: toHex(salt), hash: await derive(pin, salt, ITERATIONS), iterations: ITERATIONS }
  await Preferences.set({ key: PIN_KEY, value: JSON.stringify(stored) })
  await Preferences.remove({ key: ATTEMPTS_KEY })
}

export async function getLockedUntil() {
  return (await readJSON<Attempts>(ATTEMPTS_KEY))?.lockedUntil ?? 0
}

export async function verifyPin(pin: string): Promise<VerifyResult> {
  const attempts = (await readJSON<Attempts>(ATTEMPTS_KEY)) ?? { failures: 0, lockedUntil: 0 }
  if (attempts.lockedUntil > Date.now()) return { ok: false, lockedUntil: attempts.lockedUntil }

  const stored = await readJSON<StoredPin>(PIN_KEY)
  if (stored && (await derive(pin, fromHex(stored.salt), stored.iterations)) === stored.hash) {
    await Preferences.remove({ key: ATTEMPTS_KEY })
    return { ok: true }
  }

  // Lockout doubles for every failure past the free attempts: 30s, 60s, 120s…
  const failures = attempts.failures + 1
  const over = failures - FREE_ATTEMPTS
  const lockedUntil = over >= 0 ? Date.now() + BASE_LOCKOUT_MS * 2 ** Math.min(over, 6) : 0
  await Preferences.set({ key: ATTEMPTS_KEY, value: JSON.stringify({ failures, lockedUntil }) })
  return { ok: false, lockedUntil }
}
