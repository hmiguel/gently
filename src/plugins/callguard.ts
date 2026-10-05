import { registerPlugin, WebPlugin } from '@capacitor/core'

/**
 * Platform-neutral contract for call blocking. Android implements it in
 * android/app/src/main/java/com/hmiguel/gently/callguard/CallGuardPlugin.java.
 * An iOS implementation can later report different `capabilities()`.
 */
export type Mode = 'all' | 'blocklist' | 'allowlist'
export type Direction = 'outgoing' | 'incoming' | 'both'

export interface NumberEntry {
  number: string
  label?: string
}

export interface Rules {
  enabled: boolean
  mode: Mode
  direction: Direction
  /** Reject incoming calls with no caller number. */
  blockHidden: boolean
  numbers: NumberEntry[]
}

/** OS grants per direction: call redirection (outgoing), call screening (incoming). */
export interface Permissions {
  outgoing: boolean
  incoming: boolean
}

export interface Status extends Rules {
  permissions: Permissions
}

export interface LogEntry {
  /** Empty for hidden incoming callers. */
  number: string
  /** Missing on entries logged before incoming blocking existed: treat as 'out'. */
  direction?: 'in' | 'out'
  /** Epoch milliseconds. */
  at: number
}

/** Which OS grants the chosen direction depends on. */
export function requiredPermissions(direction: Direction): (keyof Permissions)[] {
  return direction === 'both' ? ['outgoing', 'incoming'] : [direction]
}

export interface Capabilities {
  blockOutgoing: boolean
  blockIncoming: boolean
}

export interface CallGuardPlugin {
  capabilities(): Promise<Capabilities>
  getStatus(): Promise<Status>
  setRules(rules: Rules): Promise<Status>
  requestPermission(options: { direction: 'outgoing' | 'incoming' }): Promise<Status>
  getLog(): Promise<{ entries: LogEntry[] }>
  clearLog(): Promise<void>
}

/** Browser stand-in so the UI can be developed with `npm run dev`. */
class CallGuardWeb extends WebPlugin implements CallGuardPlugin {
  private key = 'gently.dev.callguard'

  private read(): Status & { log: LogEntry[] } {
    try {
      const raw = localStorage.getItem(this.key)
      if (raw) return { ...this.defaults(), ...JSON.parse(raw) }
    } catch {
      // fall through to defaults
    }
    return this.defaults()
  }

  private defaults(): Status & { log: LogEntry[] } {
    return {
      permissions: { outgoing: false, incoming: false },
      enabled: false,
      mode: 'blocklist',
      direction: 'outgoing',
      blockHidden: false,
      numbers: [],
      log: [],
    }
  }

  private write(state: Status & { log: LogEntry[] }) {
    localStorage.setItem(this.key, JSON.stringify(state))
  }

  async capabilities() {
    return { blockOutgoing: true, blockIncoming: true }
  }

  async getStatus(): Promise<Status> {
    const { log: _log, ...status } = this.read()
    return status
  }

  async setRules(rules: Rules) {
    this.write({ ...this.read(), ...rules })
    return this.getStatus()
  }

  async requestPermission({ direction }: { direction: 'outgoing' | 'incoming' }) {
    const state = this.read()
    this.write({ ...state, permissions: { ...state.permissions, [direction]: true } })
    return this.getStatus()
  }

  async getLog() {
    return { entries: this.read().log }
  }

  async clearLog() {
    this.write({ ...this.read(), log: [] })
  }
}

export const CallGuard = registerPlugin<CallGuardPlugin>('CallGuard', {
  web: () => new CallGuardWeb(),
})
