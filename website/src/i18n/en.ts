/**
 * Website-only text. Wording shared with the app (permissions, privacy promise,
 * emergency calls, restore steps) comes from src/i18n instead, so both always match.
 * Other languages are typed against this shape.
 *
 * A section body is a list of blocks: a string is a paragraph, a string[] is a bullet list.
 */
export type Block = string | string[]

/** FAQ entries the support page completes with app text: permissions, spam (restore steps), emergency. */
export type Faq = { id: FaqId; q: string; a: Block[] }
export type FaqId = 'start' | 'permissions' | 'spam' | 'contacts' | 'international' | 'emergency' | 'code' | 'internet' | 'ios'

export const en = {
  meta: {
    homeTitle: 'Gently: call blocker for Android',
    homeDescription:
      'Block outgoing, incoming or international calls with simple rules. No ads, no account, no internet access.',
    privacyTitle: 'Privacy policy · Gently call blocker',
    privacyDescription: 'Gently stores your rules and blocked-call log only on your phone. Nothing is collected or shared.',
    supportTitle: 'Help & FAQ · Gently call blocker',
    supportDescription: 'Setting up Gently, permissions, spam protection, international rules and more.',
  },
  nav: { skip: 'Skip to content', privacy: 'Privacy', support: 'Support', language: 'Language' },
  cta: {
    join: 'Join the test',
    note: 'In closed testing on Google Play · Android 10+',
  },
  home: {
    tagline: 'Block the calls you choose: outgoing, incoming or international, with simple rules.',
    title: ['Calls', 'blocked.'],
    features: 'What it does',
    extras: [
      { title: 'International', body: 'Block every call outside your country in one rule, and still allow the one relative abroad.' },
      { title: 'Quiet', body: 'Blocked calls never connect or ring. Each attempt is listed in the log with time and direction.' },
      { title: 'Five languages', body: 'English, Português, Español, Français and Deutsch, including dates and a 12/24-hour clock.' },
    ],
    screens: 'The app',
    screenAlts: ['Status screen with blocking on', 'List of rules', 'Editing a rule', 'Log of blocked calls'],
    supportTitle: 'Questions?',
    supportBody: 'Permissions, spam protection, international numbers and more, explained.',
    supportLink: 'Read the support page',
  },
  privacy: {
    title: 'Privacy.',
    updated: 'Last updated',
    date: '5 October 2026',
    summary:
      'Gently does not collect, store remotely, share or sell any personal data. Everything stays on your phone.',
    sections: [
      {
        title: 'What the app stores, and where',
        body: [
          "Gently stores the following only on your device, in the app's private storage:",
          [
            'Your rules: the phone numbers you add, and the optional name you give each one.',
            'The blocked-call log: number, time and direction of blocked calls. At most the 200 most recent, and you can clear it at any time.',
            'Your access code: only as a salted, one-way hash (PBKDF2), never the code itself.',
            'Your preferences: language, time format and whether the access code is on.',
          ],
          'This data never leaves your device. Gently has no internet permission, so Android does not allow it to connect to any server. There is no account, analytics, advertising, crash reporting or tracking of any kind.',
          "Uninstalling Gently, or clearing its storage in Android settings, deletes all of this data.",
        ] as Block[],
      },
      {
        title: 'Permissions',
        body: [
          [
            'Call redirection: to cancel outgoing calls that match your rules before they connect.',
            'Caller ID & spam (call screening): to reject incoming calls that match your rules before your phone rings.',
            "Contacts: Android only passes calls from saved contacts to a call-screening app that holds this permission. Gently does not read, copy or upload your contacts. When you add a number from contacts, Android's contact picker gives Gently only the number you choose.",
            'Vibrate: haptic feedback on the keypad and buttons.',
          ],
          'Gently only sees the phone number of a call when Android asks it to check that call against your rules. It does not record calls, read call contents or access your call history.',
        ] as Block[],
      },
      { title: 'Children', body: ['Gently does not collect personal data from anyone, including children.'] as Block[] },
      {
        title: 'Changes',
        body: ['If this policy changes, the new version will be published on this page with an updated date.'] as Block[],
      },
    ],
    contact: 'Questions about this policy:',
  },
  support: {
    title: 'Support.',
    intro: 'Answers to the common questions. Anything else: write to us.',
    faq: [
      {
        id: 'start', q: 'How do I start?',
        a: [
          [
            'Open Gently and create a 6-digit access code.',
            'On the Rules tab, tap New rule: choose Block or Allow, which calls, and who.',
            'On the Status screen, tap Grant access and choose Gently in the Android dialog.',
            'Turn blocking on.',
          ],
        ] as Block[],
      },
      { id: 'permissions', q: 'Why does Gently need these permissions?', a: [] as Block[] },
      {
        id: 'spam', q: "My phone's spam protection stopped working",
        a: [
          'Android allows only one "Caller ID & spam" app. Gently needs that role to block incoming calls, so while it holds it, your Phone app (e.g. Google Phone) pauses its spam filtering. Outgoing blocking does not affect it.',
          'To give it back: in Gently, open Settings › Permissions › Restore spam protection, then:',
        ] as Block[],
      },
      {
        id: 'contacts', q: 'Calls from my contacts are not blocked',
        a: [
          'Android only lets Gently check calls from saved contacts when it has the Contacts permission. Grant it from the Status screen, or in Android settings: Apps › Gently › Permissions › Contacts › Allow.',
          'On Xiaomi phones the prompt sometimes does not appear after an earlier refusal; Gently then opens that settings page for you.',
        ] as Block[],
      },
      {
        id: 'international', q: 'What counts as international?',
        a: [
          "Any number outside the country of your SIM card. With a Portuguese SIM, everything outside +351 is international, also while you travel. Countries that share a calling code count as domestic to each other (for example the US and Canada, +1).",
        ] as Block[],
      },
      { id: 'emergency', q: 'Can Gently block emergency calls?', a: [] as Block[] },
      {
        id: 'code', q: 'I forgot my access code',
        a: [
          'For security, the code cannot be recovered. You can reset Gently in Android settings: Apps › Gently › Storage › Clear data. This also deletes your rules and log.',
        ] as Block[],
      },
      {
        id: 'internet', q: 'Does it block WhatsApp or other internet calls?',
        a: ['No. Android only lets apps check regular phone calls; calls inside apps like WhatsApp or Signal are not visible to Gently.'] as Block[],
      },
      {
        id: 'ios', q: 'Is there an iPhone version?',
        a: ['No. iOS does not allow apps to block outgoing calls, which is at the heart of Gently.'] as Block[],
      },
    ] as Faq[],
    contactTitle: 'Still stuck?',
    contactBody: 'Write to us and include your phone model and Android version.',
  },
  footer: { source: 'Source code', openSource: 'Open source (GPL-3.0)', made: 'Made by lixo.dev' },
  notFound: { title: 'Not found.', body: 'This page does not exist.', home: 'Go to the home page' },
}

export type Site = typeof en
