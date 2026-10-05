import { registerPlugin, WebPlugin } from '@capacitor/core'

/**
 * Platform-neutral contract for call blocking. Android implements it in
 * android/app/src/main/java/com/hmiguel/gently/callguard/CallGuardPlugin.java.
 * An iOS implementation can later report different `capabilities()`.
 */
export type Mode = 'all' | 'blocklist' | 'allowlist'

export interface NumberEntry {
  number: string
  label?: string
}

export interface Rules {
  enabled: boolean
  mode: Mode
  numbers: NumberEntry[]
}

export interface Status extends Rules {
  /** Whether the OS granted us the right to intercept calls. */
  hasPermission: boolean
}

export interface LogEntry {
  number: string
  /** Epoch milliseconds. */
  at: number
}

export interface Capabilities {
  blockOutgoing: boolean
  blockIncoming: boolean
}

export interface CallGuardPlugin {
  capabilities(): Promise<Capabilities>
  getStatus(): Promise<Status>
  setRules(rules: Rules): Promise<Status>
  requestPermission(): Promise<Status>
  getLog(): Promise<{ entries: LogEntry[] }>
  clearLog(): Promise<void>
}

/** Browser stand-in so the UI can be developed with `npm run dev`. */
class CallGuardWeb extends WebPlugin implements CallGuardPlugin {
  private key = 'gently.dev.callguard'

  private read(): Status & { log: LogEntry[] } {
    try {
      const raw = localStorage.getItem(this.key)
      if (raw) return JSON.parse(raw)
    } catch {
      // fall through to defaults
    }
    return { hasPermission: false, enabled: false, mode: 'blocklist', numbers: [], log: [] }
  }

  private write(state: Status & { log: LogEntry[] }) {
    localStorage.setItem(this.key, JSON.stringify(state))
  }

  async capabilities() {
    return { blockOutgoing: true, blockIncoming: false }
  }

  async getStatus(): Promise<Status> {
    const { log: _log, ...status } = this.read()
    return status
  }

  async setRules(rules: Rules) {
    this.write({ ...this.read(), ...rules })
    return this.getStatus()
  }

  async requestPermission() {
    this.write({ ...this.read(), hasPermission: true })
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
