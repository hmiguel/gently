import type { Site } from './en'

/** Deutsch (informal "du", like the app). */
export const de: Site = {
  meta: {
    homeTitle: 'Gently: Anrufsperre für Android',
    homeDescription:
      'Sperre ausgehende, eingehende oder internationale Anrufe mit einfachen Regeln, geschützt durch einen Code. Keine Werbung, kein Konto, kein Internetzugriff.',
    privacyTitle: 'Datenschutzerklärung · Gently',
    privacyDescription: 'Gently speichert deine Regeln und den Verlauf gesperrter Anrufe nur auf deinem Handy. Nichts wird erfasst oder geteilt.',
    supportTitle: 'Hilfe · Gently',
    supportDescription: 'Gently einrichten, Berechtigungen, Spamschutz, internationale Regeln und mehr.',
  },
  nav: { privacy: 'Datenschutz', support: 'Hilfe', language: 'Sprache' },
  cta: {
    join: 'Am Test teilnehmen',
    note: 'Im geschlossenen Test bei Google Play · Android 10+',
  },
  home: {
    title: ['Sperre', 'aktiv.'],
    features: 'Was es kann',
    extras: [
      { title: 'International', body: 'Sperr mit einer Regel alle Anrufe ins Ausland und erlaube trotzdem die eine Verwandte im Ausland.' },
      { title: 'Leise', body: 'Gesperrte Anrufe verbinden nie und klingeln nie. Jeder Versuch steht mit Uhrzeit und Richtung im Verlauf.' },
      { title: 'Fünf Sprachen', body: 'English, Português, Español, Français und Deutsch, inklusive Datum und 12/24-Stunden-Uhr.' },
    ],
    screens: 'Die App',
    screenAlts: ['Statusanzeige mit aktiver Sperre', 'Liste der Regeln', 'Regel bearbeiten', 'Verlauf gesperrter Anrufe'],
    supportTitle: 'Fragen?',
    supportBody: 'Berechtigungen, Spamschutz, internationale Nummern und mehr, erklärt.',
    supportLink: 'Zur Hilfeseite',
  },
  privacy: {
    title: 'Datenschutz.',
    updated: 'Stand',
    date: '5. Oktober 2026',
    summary: 'Gently erfasst, speichert extern, teilt oder verkauft keine personenbezogenen Daten. Alles bleibt auf deinem Handy.',
    sections: [
      {
        title: 'Was die App speichert, und wo',
        body: [
          'Gently speichert Folgendes nur auf deinem Gerät, im privaten Speicher der App:',
          [
            'Deine Regeln: die Nummern, die du hinzufügst, und den optionalen Namen dazu.',
            'Den Verlauf gesperrter Anrufe: Nummer, Uhrzeit und Richtung. Höchstens die 200 neuesten, und du kannst ihn jederzeit löschen.',
            'Deinen Zugangscode: nur als gesalzener Einweg-Hash (PBKDF2), nie den Code selbst.',
            'Deine Einstellungen: Sprache, Zeitformat und ob der Zugangscode aktiv ist.',
          ],
          'Diese Daten verlassen dein Gerät nie. Gently hat keine Internetberechtigung, daher lässt Android keine Verbindung zu Servern zu. Es gibt kein Konto, keine Statistiken, keine Werbung, keine Absturzberichte und kein Tracking.',
          'Wenn du Gently deinstallierst oder den Speicher in den Android-Einstellungen löschst, werden all diese Daten gelöscht.',
        ],
      },
      {
        title: 'Berechtigungen',
        body: [
          [
            'Anrufweiterleitung: um ausgehende Anrufe, die zu deinen Regeln passen, vor dem Verbinden abzubrechen.',
            'Anrufer-ID und Spam: um eingehende Anrufe, die zu deinen Regeln passen, abzulehnen, bevor dein Handy klingelt.',
            'Kontakte: Android gibt Anrufe gespeicherter Kontakte nur an Apps mit dieser Berechtigung weiter. Gently liest, kopiert oder überträgt deine Kontakte nicht. Wenn du eine Nummer aus den Kontakten hinzufügst, gibt die Kontaktauswahl von Android Gently nur die gewählte Nummer.',
            'Vibration: haptisches Feedback auf Tastatur und Buttons.',
          ],
          'Gently sieht die Nummer eines Anrufs nur, wenn Android es bittet, den Anruf mit deinen Regeln zu prüfen. Es nimmt keine Anrufe auf, liest keine Inhalte und greift nicht auf deine Anrufliste zu.',
        ],
      },
      { title: 'Kinder', body: ['Gently erfasst von niemandem personenbezogene Daten, auch nicht von Kindern.'] },
      { title: 'Änderungen', body: ['Ändert sich diese Erklärung, wird die neue Fassung auf dieser Seite mit neuem Datum veröffentlicht.'] },
    ],
    contact: 'Fragen zu dieser Erklärung:',
  },
  support: {
    title: 'Hilfe.',
    intro: 'Antworten auf die häufigsten Fragen. Für alles andere: schreib uns.',
    faq: [
      {
        id: 'start',
        q: 'Wie fange ich an?',
        a: [
          [
            'Öffne Gently und leg einen 6-stelligen Zugangscode an.',
            'Tippe im Tab Regeln auf Neue Regel: wähle Sperren oder Erlauben, welche Anrufe und wer.',
            'Tippe in der Statusanzeige auf Zugriff erlauben und wähle Gently im Android-Dialog.',
            'Schalte die Sperre ein.',
          ],
        ],
      },
      { id: 'permissions', q: 'Warum braucht Gently diese Berechtigungen?', a: [] },
      {
        id: 'spam',
        q: 'Der Spamschutz meines Handys funktioniert nicht mehr',
        a: [
          'Android erlaubt nur eine App für „Anrufer-ID und Spam“. Gently braucht diese Rolle, um eingehende Anrufe zu sperren; solange Gently sie hat, pausiert deine Telefon-App (z. B. Google Telefon) ihren Spamfilter. Das Sperren ausgehender Anrufe ist davon nicht betroffen.',
          'So gibst du sie zurück: Öffne in Gently Einstellungen › Berechtigungen › Spamschutz zurückgeben, dann:',
        ],
      },
      {
        id: 'contacts',
        q: 'Anrufe meiner Kontakte werden nicht gesperrt',
        a: [
          'Android lässt Gently Anrufe gespeicherter Kontakte nur mit der Kontakte-Berechtigung prüfen. Erteile sie in der Statusanzeige oder in den Android-Einstellungen: Apps › Gently › Berechtigungen › Kontakte › Zulassen.',
          'Auf Xiaomi-Handys erscheint die Anfrage nach einer früheren Ablehnung manchmal nicht mehr; dann öffnet Gently diese Einstellungsseite für dich.',
        ],
      },
      {
        id: 'international',
        q: 'Was gilt als international?',
        a: [
          'Jede Nummer außerhalb des Landes deiner SIM-Karte. Mit einer deutschen SIM ist alles außer +49 international, auch auf Reisen. Länder mit derselben Vorwahl gelten untereinander als Inland (zum Beispiel USA und Kanada, +1).',
        ],
      },
      { id: 'emergency', q: 'Kann Gently Notrufe sperren?', a: [] },
      {
        id: 'code',
        q: 'Ich habe meinen Zugangscode vergessen',
        a: [
          'Aus Sicherheitsgründen lässt sich der Code nicht wiederherstellen. Du kannst Gently in den Android-Einstellungen zurücksetzen: Apps › Gently › Speicher › Daten löschen. Dabei werden auch deine Regeln und der Verlauf gelöscht.',
        ],
      },
      {
        id: 'internet',
        q: 'Sperrt es WhatsApp oder andere Internetanrufe?',
        a: ['Nein. Android lässt Apps nur normale Telefonanrufe prüfen; Anrufe in Apps wie WhatsApp oder Signal sieht Gently nicht.'],
      },
      {
        id: 'ios',
        q: 'Gibt es eine iPhone-Version?',
        a: ['Nein. iOS erlaubt Apps nicht, ausgehende Anrufe zu sperren, und genau das ist der Kern von Gently.'],
      },
    ],
    contactTitle: 'Noch Fragen?',
    contactBody: 'Schreib uns und nenn dein Handymodell und deine Android-Version.',
  },
  footer: { made: 'Gemacht von lixo.dev' },
  notFound: { title: 'Nicht da.', body: 'Diese Seite gibt es nicht.', home: 'Zur Startseite' },
}
