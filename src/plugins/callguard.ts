import { registerPlugin, WebPlugin } from '@capacitor/core'

/**
 * Platform-neutral contract for call blocking. Android implements it in
 * android/app/src/main/java/com/lixo/gently/callguard/CallGuardPlugin.java.
 * An iOS implementation can later report different `capabilities()`.
 */
export type Direction = 'outgoing' | 'incoming' | 'both'
export type Action = 'block' | 'allow'
/** One number, everyone, numbers outside the SIM's country, or incoming calls without caller ID. */
export type Target = 'number' | 'anyone' | 'international' | 'hidden'

/**
 * One rule. For a given call the most specific matching rule wins (number or
 * hidden, then international, then anyone); on a tie, block wins. Mirrors RuleStore.java.
 */
export interface Rule {
  id: string
  action: Action
  direction: Direction
  target: Target
  /** Only for target 'number'. */
  number?: string
  label?: string
}

export interface Rules {
  /** Master switch: when off, no rule applies. */
  enabled: boolean
  rules: Rule[]
}

/** OS grants per direction: call redirection (outgoing), call screening (incoming). */
export interface Permissions {
  outgoing: boolean
  incoming: boolean
}

export interface Status extends Rules {
  permissions: Permissions
  /** ISO country of the SIM, which defines what "international" means. */
  homeCountry: string
}

export interface LogEntry {
  /** Empty for hidden incoming callers. */
  number: string
  /** Missing on entries logged before incoming blocking existed: treat as 'out'. */
  direction?: 'in' | 'out'
  /** Epoch milliseconds. */
  at: number
}

/** Which OS grants the current rules depend on. */
export function requiredPermissions(rules: Rule[]): (keyof Permissions)[] {
  const needs = (d: keyof Permissions) => rules.some((r) => r.direction === d || r.direction === 'both')
  return (['outgoing', 'incoming'] as const).filter(needs)
}

export interface Capabilities {
  blockOutgoing: boolean
  blockIncoming: boolean
}

export interface CallGuardPlugin {
  capabilities(): Promise<Capabilities>
  /** The phone's 12/24-hour setting. */
  timeFormat(): Promise<{ is24Hour: boolean }>
  getStatus(): Promise<Status>
  setRules(rules: Rules): Promise<Status>
  requestPermission(options: { direction: 'outgoing' | 'incoming' }): Promise<Status>
  /** Opens Android's default-apps screen; resolves with the status on return. */
  openDefaultApps(): Promise<Status>
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
      homeCountry: 'PT',
      enabled: false,
      rules: [],
      log: [],
    }
  }

  private write(state: Status & { log: LogEntry[] }) {
    localStorage.setItem(this.key, JSON.stringify(state))
  }

  async capabilities() {
    return { blockOutgoing: true, blockIncoming: true }
  }

  async timeFormat() {
    return { is24Hour: !new Intl.DateTimeFormat(undefined, { hour: 'numeric' }).resolvedOptions().hour12 }
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

  async openDefaultApps() {
    const state = this.read()
    this.write({ ...state, permissions: { ...state.permissions, incoming: false } })
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
