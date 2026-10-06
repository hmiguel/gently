import type { Rule } from '../plugins/callguard'

type RuleText = Pick<Rule, 'action' | 'direction' | 'target' | 'number' | 'label'>

function subject(rule: Pick<Rule, 'target' | 'number' | 'label'>): string {
  if (rule.target === 'anyone') return 'Anyone'
  if (rule.target === 'international') return 'International'
  if (rule.target === 'hidden') return 'Hidden numbers'
  return rule.label || rule.number || 'A number'
}

/**
 * English UI text, and the shape every other language must match (see pt.ts).
 * Display headlines fit ~8 characters per word at phone width; keep translations short.
 */
export const en = {
  /** BCP 47 tag for dates, times and country names. */
  locale: 'en',

  common: {
    close: 'Close',
    cancel: 'Cancel',
    settings: 'Settings',
    about: 'About Gently',
    lockApp: 'Lock app',
    sections: 'Sections',
  },

  tabs: { status: 'Status', rules: 'Rules', log: 'Log' },

  lock: {
    access: 'Access',
    changeCode: 'Change code',
    turnOff: 'Turn off code',
    titles: { unlock: 'Locked.', create: 'Set code.', confirm: 'Repeat.' },
    hints: {
      unlock: 'Enter your access code',
      create: (length: number) => `Choose a ${length}-digit code`,
      confirm: 'Enter the same code again',
    },
    changeTitles: { unlock: 'Current.', create: 'New code.' },
    changeHint: 'Enter your current code',
    disableTitle: 'Confirm.',
    disableHint: 'Enter your code to turn it off',
    mismatch: 'Codes did not match',
    wrong: 'Wrong code',
    wait: (seconds: number) => `Wait ${seconds}s`,
    deleteDigit: 'Delete digit',
    progress: (filled: number, length: number) => `${filled} of ${length} digits entered`,
  },

  status: {
    label: 'Status',
    title: (active: boolean) => (active ? ['Calls', 'blocked.'] : ['Calls', 'open.']),
    permissions: {
      outgoing: {
        title: 'Outgoing: access required',
        body: 'Allow Gently to screen outgoing calls. Choose Gently as the call redirection app.',
      },
      incoming: {
        title: 'Incoming: access required',
        body: 'Choose Gently as the caller ID & spam app, then allow Contacts (Android only lets Gently screen calls from saved contacts with it). If no prompt appears, Gently opens its settings: turn on Contacts under Permissions.',
      },
    },
    grantAccess: 'Grant access',
    empty: 'Nothing to block yet. Start with your first rule.',
    createRule: 'Create a rule',
    turnOn: 'Turn blocking on',
    turnOff: 'Turn blocking off',
    stats: { rules: 'Rules', today: 'Today', week: '7 days', total: 'Total' },
    emergency: 'Emergency numbers are always allowed. Android never lets an app block them.',
  },

  rules: {
    label: 'Rules',
    title: 'Rules.',
    newRule: 'New rule',
    overlap: 'When rules overlap, a rule for a specific number wins over a rule for anyone.',
    empty: ['No rules', 'yet.'],
    emptyBody: 'Create one to block a number, block everyone, or allow only a few.',
    action: { block: 'Block', allow: 'Allow' },
    direction: { outgoing: 'Outgoing', incoming: 'Incoming', both: 'Both' },

    /** Who the rule applies to, as a short name. */
    subject,

    /** The rule as one plain sentence, e.g. "Block calls to Mom." */
    describe(rule: RuleText): string {
      const verb = rule.action === 'block' ? 'Block' : 'Allow'
      if (rule.target === 'anyone') {
        return rule.direction === 'both' ? `${verb} all calls.` : `${verb} all ${rule.direction} calls.`
      }
      if (rule.target === 'international') {
        return rule.direction === 'both'
          ? `${verb} all international calls.`
          : `${verb} all international ${rule.direction} calls.`
      }
      if (rule.target === 'hidden') return `${verb} calls from hidden numbers.`
      const who = subject(rule)
      if (rule.direction === 'outgoing') return `${verb} calls to ${who}.`
      if (rule.direction === 'incoming') return `${verb} calls from ${who}.`
      return `${verb} calls to and from ${who}.`
    },
  },

  ruleForm: {
    newRule: 'New rule',
    editRule: 'Edit rule',
    create: 'Create rule',
    save: 'Save changes',
    delete: 'Delete rule',
    confirmDelete: 'Tap again to delete',
    sections: { action: 'Action', calls: 'Calls', who: 'Who' },
    hiddenNote: 'Hidden numbers only exist on incoming calls, so this rule applies to incoming calls.',
    fromContacts: 'Choose from contacts',
    phone: 'Phone number',
    name: 'Name (optional)',
    namePlaceholder: 'Who is it?',
    errors: {
      invalid: 'Enter a valid number',
      duplicate: 'A rule like this already exists',
      contacts: 'Could not open contacts',
    },
    actions: {
      block: { title: 'Block', description: 'Stop these calls' },
      allow: { title: 'Allow', description: 'Let these through, even if another rule blocks everyone' },
    },
    directions: {
      outgoing: { title: 'Outgoing', description: 'Calls made from this phone' },
      incoming: { title: 'Incoming', description: 'Calls received on this phone' },
      both: { title: 'Both', description: 'Calls in either direction' },
    },
    targets: (country: string) => ({
      number: { title: 'A number', description: 'From your contacts or typed in' },
      anyone: { title: 'Anyone', description: 'Every number' },
      international: { title: 'International', description: `Numbers outside ${country}` },
      hidden: { title: 'Hidden numbers', description: 'Incoming calls with no caller ID' },
    }),
    yourCountry: 'your country',
  },

  log: {
    label: 'Log',
    title: 'Log.',
    empty: ['No calls', 'blocked.'],
    emptyBody: 'Blocked attempts will appear here.',
    when: 'When',
    number: 'Number',
    incoming: 'Incoming',
    outgoing: 'Outgoing',
    hidden: 'Hidden number',
    clear: 'Clear log',
    confirmClear: 'Tap again to clear',
  },

  settings: {
    label: 'Settings',
    title: 'Settings.',
    accessCode: 'Access code',
    requireCode: 'Require access code',
    requireOn: 'The app locks whenever you leave it',
    requireOff: 'The app opens without a code',
    changeCode: 'Change access code',
    changeHint: 'Needs your current code',
    notices: {
      codeChanged: 'Access code changed',
      lockOn: 'Access code turned on',
      lockOff: 'Access code turned off',
    },
    permissions: 'Permissions',
    permissionRows: {
      outgoing: { title: 'Outgoing calls', description: 'Call redirection app' },
      incoming: { title: 'Incoming calls', description: 'Caller ID & spam app, and contacts' },
    },
    granted: 'Granted',
    grant: 'Grant',
    language: 'Language',
    systemLanguage: 'System default',
    systemLanguageHint: "Follows the phone's language",
  },

  about: {
    label: 'About',
    tagline: 'Blocks the calls you choose, outgoing, incoming or both, behind an access code.',
    howItWorks: 'How it works',
    points: [
      {
        title: 'Rules',
        body: 'Each rule blocks or allows calls to a number, to anyone, to international numbers, or from hidden numbers.',
      },
      {
        title: 'Specific wins',
        body: 'A rule for one number beats an international rule, which beats a rule for anyone. Block everyone and allow a few to keep only those.',
      },
      {
        title: 'Access code',
        body: 'On by default: changing anything needs your code, and the app locks when you leave it. You can turn it off in Settings.',
      },
    ],
    permissions: 'Permissions',
    permissionPoints: [
      { title: 'Call redirection', body: 'Lets Gently stop outgoing calls before they connect.' },
      { title: 'Caller ID & spam', body: 'Lets Gently reject incoming calls before your phone rings.' },
      {
        title: 'Contacts',
        body: 'Android only passes calls from saved contacts to apps that may read contacts. Gently never reads your address book.',
      },
    ],
    privacy: 'Privacy',
    privacyTitle: ['Nothing leaves', 'this phone.'],
    privacyBody: 'No account, no tracking, no internet access. Rules and the log are stored only on this device.',
    emergencyTitle: 'Emergency calls always work',
    emergencyBody: 'Android never lets an app block emergency numbers, and Gently never tries.',
    details: 'Details',
    version: 'Version',
    requires: 'Requires',
  },
}

export type Messages = typeof en
