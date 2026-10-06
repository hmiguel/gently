import type { Rule } from '../plugins/callguard'
import type { Messages } from './en'

type RuleText = Pick<Rule, 'action' | 'direction' | 'target' | 'number' | 'label'>

function subject(rule: Pick<Rule, 'target' | 'number' | 'label'>): string {
  if (rule.target === 'anyone') return 'Alle'
  if (rule.target === 'international') return 'International'
  if (rule.target === 'hidden') return 'Unterdrückte Nummern'
  return rule.label || rule.number || 'Eine Nummer'
}

/** Deutsch (informal "du"). Same shape as en.ts; the compiler flags anything missing. */
export const de: Messages = {
  locale: 'de-DE',

  common: {
    close: 'Schließen',
    cancel: 'Abbrechen',
    settings: 'Einstellungen',
    about: 'Über Gently',
    lockApp: 'App sperren',
    sections: 'Bereiche',
  },

  tabs: { status: 'Status', rules: 'Regeln', log: 'Verlauf' },

  lock: {
    access: 'Zugang',
    changeCode: 'Code ändern',
    turnOff: 'Code ausschalten',
    titles: { unlock: 'Gesperrt.', create: 'Neuer Code.', confirm: 'Nochmal.' },
    hints: {
      unlock: 'Gib deinen Zugangscode ein',
      create: (length) => `Wähle einen ${length}-stelligen Code`,
      confirm: 'Gib denselben Code nochmal ein',
    },
    changeTitles: { unlock: 'Aktuell.', create: 'Neuer Code.' },
    changeHint: 'Gib deinen aktuellen Code ein',
    disableTitle: 'Prüfen.',
    disableHint: 'Gib deinen Code ein, um ihn auszuschalten',
    mismatch: 'Die Codes stimmen nicht überein',
    wrong: 'Falscher Code',
    wait: (seconds) => `Warte ${seconds} s`,
    deleteDigit: 'Ziffer löschen',
    progress: (filled, length) => `${filled} von ${length} Ziffern eingegeben`,
  },

  status: {
    label: 'Status',
    title: (active) => (active ? ['Sperre', 'aktiv.'] : ['Sperre', 'aus.']),
    permissions: {
      outgoing: {
        title: 'Ausgehend: Zugriff nötig',
        body: 'Erlaube Gently, ausgehende Anrufe zu prüfen. Wähle Gently als App für Anrufweiterleitung.',
      },
      incoming: {
        title: 'Eingehend: Zugriff nötig',
        body: 'Wähle Gently als App für Anrufer-ID und Spam und erlaube dann den Zugriff auf Kontakte (Android lässt Gently Anrufe gespeicherter Kontakte nur damit prüfen). Erscheint keine Anfrage, öffnet Gently seine Einstellungen: Aktiviere dort Kontakte unter Berechtigungen.',
      },
    },
    grantAccess: 'Zugriff erlauben',
    empty: 'Noch nichts zu sperren. Leg deine erste Regel an.',
    createRule: 'Regel anlegen',
    turnOn: 'Sperre einschalten',
    turnOff: 'Sperre ausschalten',
    stats: { rules: 'Regeln', today: 'Heute', week: '7 Tage', total: 'Gesamt' },
    emergency: 'Notrufnummern sind immer erlaubt. Android lässt keine App sie sperren.',
  },

  rules: {
    label: 'Regeln',
    title: 'Regeln.',
    newRule: 'Neue Regel',
    overlap: 'Überschneiden sich Regeln, gewinnt die Regel für eine bestimmte Nummer gegen die Regel für alle.',
    empty: ['Noch keine', 'Regeln.'],
    emptyBody: 'Leg eine an, um eine Nummer zu sperren, alle zu sperren oder nur wenige zu erlauben.',
    action: { block: 'Sperren', allow: 'Erlauben' },
    direction: { outgoing: 'Ausgehend', incoming: 'Eingehend', both: 'Beide' },
    subject,

    describe(rule: RuleText): string {
      const verb = rule.action === 'block' ? 'sperren' : 'erlauben'
      const which = { outgoing: 'ausgehenden ', incoming: 'eingehenden ', both: '' }[rule.direction]
      if (rule.target === 'anyone') return `Alle ${which}Anrufe ${verb}.`
      if (rule.target === 'international') return `Alle internationalen ${which}Anrufe ${verb}.`
      if (rule.target === 'hidden') return `Anrufe von unterdrückten Nummern ${verb}.`
      const who = subject(rule)
      if (rule.direction === 'outgoing') return `Anrufe an ${who} ${verb}.`
      if (rule.direction === 'incoming') return `Anrufe von ${who} ${verb}.`
      return `Anrufe mit ${who} ${verb}.`
    },
  },

  ruleForm: {
    newRule: 'Neue Regel',
    editRule: 'Regel bearbeiten',
    create: 'Regel anlegen',
    save: 'Speichern',
    delete: 'Regel löschen',
    confirmDelete: 'Nochmal tippen zum Löschen',
    sections: { action: 'Aktion', calls: 'Anrufe', who: 'Wer' },
    hiddenNote: 'Unterdrückte Nummern gibt es nur bei eingehenden Anrufen, daher gilt diese Regel für eingehende Anrufe.',
    fromContacts: 'Aus Kontakten wählen',
    phone: 'Telefonnummer',
    name: 'Name (optional)',
    namePlaceholder: 'Wer ist das?',
    errors: {
      invalid: 'Gib eine gültige Nummer ein',
      duplicate: 'Eine gleiche Regel gibt es schon',
      contacts: 'Kontakte konnten nicht geöffnet werden',
    },
    actions: {
      block: { title: 'Sperren', description: 'Diese Anrufe verhindern' },
      allow: { title: 'Erlauben', description: 'Durchlassen, auch wenn eine andere Regel alle sperrt' },
    },
    directions: {
      outgoing: { title: 'Ausgehend', description: 'Anrufe von diesem Handy' },
      incoming: { title: 'Eingehend', description: 'Anrufe auf dieses Handy' },
      both: { title: 'Beide', description: 'Anrufe in beide Richtungen' },
    },
    targets: (country) => ({
      number: { title: 'Eine Nummer', description: 'Aus deinen Kontakten oder eingetippt' },
      anyone: { title: 'Alle', description: 'Jede Nummer' },
      international: { title: 'International', description: `Nummern außerhalb von ${country}` },
      hidden: { title: 'Unterdrückte Nummern', description: 'Eingehende Anrufe ohne Rufnummer' },
    }),
    yourCountry: 'deinem Land',
  },

  log: {
    label: 'Verlauf',
    title: 'Verlauf.',
    empty: ['Keine Anrufe', 'gesperrt.'],
    emptyBody: 'Gesperrte Versuche erscheinen hier.',
    when: 'Wann',
    number: 'Nummer',
    incoming: 'Eingehend',
    outgoing: 'Ausgehend',
    hidden: 'Unterdrückte Nummer',
    clear: 'Verlauf löschen',
    confirmClear: 'Nochmal tippen zum Löschen',
  },

  settings: {
    label: 'Einstellungen',
    title: 'Einstellungen.',
    accessCode: 'Zugangscode',
    requireCode: 'Zugangscode verlangen',
    requireOn: 'Die App sperrt sich, sobald du sie verlässt',
    requireOff: 'Die App öffnet ohne Code',
    changeCode: 'Zugangscode ändern',
    changeHint: 'Fragt nach deinem aktuellen Code',
    notices: {
      codeChanged: 'Zugangscode geändert',
      lockOn: 'Zugangscode eingeschaltet',
      lockOff: 'Zugangscode ausgeschaltet',
    },
    permissions: 'Berechtigungen',
    permissionRows: {
      outgoing: { title: 'Ausgehende Anrufe', description: 'App für Anrufweiterleitung' },
      incoming: { title: 'Eingehende Anrufe', description: 'App für Anrufer-ID und Spam, und Kontakte' },
    },
    granted: 'Erteilt',
    grant: 'Erteilen',
    language: 'Sprache',
    systemLanguage: 'Systemsprache',
    systemLanguageHint: 'Folgt der Sprache des Handys',
    timeFormat: 'Zeitformat',
    systemTime: 'System',
    systemTimeHint: (hours) => `Folgt dem Handy (${hours} Stunden)`,
    hours12: '12 Stunden',
    hours24: '24 Stunden',
  },

  about: {
    label: 'Über',
    tagline: 'Sperrt die Anrufe, die du wählst, ausgehend, eingehend oder beides, geschützt durch einen Zugangscode.',
    howItWorks: 'So funktioniert es',
    points: [
      {
        title: 'Regeln',
        body: 'Jede Regel sperrt oder erlaubt Anrufe an eine Nummer, an alle, an internationale Nummern oder von unterdrückten Nummern.',
      },
      {
        title: 'Konkret gewinnt',
        body: 'Eine Regel für eine Nummer gewinnt gegen eine internationale Regel, die gegen eine Regel für alle gewinnt. Sperr alle und erlaube ein paar, um nur diese zu behalten.',
      },
      {
        title: 'Zugangscode',
        body: 'Standardmäßig an: Jede Änderung braucht deinen Code, und die App sperrt sich, wenn du sie verlässt. Du kannst ihn in den Einstellungen ausschalten.',
      },
    ],
    permissions: 'Berechtigungen',
    permissionPoints: [
      { title: 'Anrufweiterleitung', body: 'Damit stoppt Gently ausgehende Anrufe, bevor sie verbunden werden.' },
      { title: 'Anrufer-ID und Spam', body: 'Damit lehnt Gently eingehende Anrufe ab, bevor dein Handy klingelt.' },
      {
        title: 'Kontakte',
        body: 'Android gibt Anrufe gespeicherter Kontakte nur an Apps weiter, die Kontakte lesen dürfen. Gently liest dein Adressbuch nie.',
      },
    ],
    privacy: 'Datenschutz',
    privacyTitle: ['Nichts verlässt', 'dieses Handy.'],
    privacyBody: 'Kein Konto, kein Tracking, kein Internetzugriff. Regeln und Verlauf bleiben nur auf diesem Gerät.',
    emergencyTitle: 'Notrufe funktionieren immer',
    emergencyBody: 'Android lässt keine App Notrufnummern sperren, und Gently versucht es nie.',
    details: 'Details',
    version: 'Version',
    requires: 'Benötigt',
  },
}
