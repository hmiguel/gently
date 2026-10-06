# Gently

Block the calls you choose on Android: outgoing, incoming or international, with simple rules.
No ads, no account, no internet access.

**Website:** [gently.lixo.dev](https://gently.lixo.dev) ·
**Google Play:** [closed test](https://play.google.com/apps/testing/com.lixo.gently) ·
**License:** [GPL-3.0-or-later](LICENSE)

- **Rules:** each rule says *block* or *allow*, *outgoing / incoming / both*, and *who*: one number
  (picked from contacts or typed), anyone, international numbers (outside the SIM's country), or hidden
  callers. The most specific rule wins (number/hidden, then international, then anyone), so "block all
  outgoing" + "allow Mom" works as an allowlist
- **Access code:** 6 digits, stored as a salted PBKDF2 hash, with an escalating lockout after 5 wrong attempts.
  The app locks whenever it leaves the screen; the code can be changed in Settings (current code required)
- **Log:** every blocked attempt, with time, number and direction
- **Settings** (⚙): turn the access code on/off (on by default; turning it off needs the code), change it,
  choose the language (system, English, Português, Español, Français, Deutsch) and the clock
  (system, 12-hour, 24-hour), see and re-grant permissions
- **About** (ⓘ): how it works, what each permission is for, privacy, version
- Emergency numbers are never blocked (Android enforces this)

## Permissions

| Permission | Why |
|---|---|
| Call redirection role | Cancel outgoing calls before they connect |
| Caller ID & spam (call screening) role | Reject incoming calls before the phone rings |
| `READ_CONTACTS` | Android only passes calls from saved contacts to a screening app that holds it. Gently never reads the address book; numbers are added through the system contact picker |

There is **no `INTERNET` permission**: rules and the log never leave the device.

## Stack

- UI: React + TypeScript + Tailwind CSS v4, packaged with [Capacitor](https://capacitorjs.com)
- Design: Swiss International style. Tokens live in `src/styles/tokens.css` (shared with the website)
- UI text: `src/i18n/` (English, Português, Español, Français, Deutsch)
- Native: `android/app/src/main/java/com/lixo/gently/callguard/`
  - `GentlyRedirectionService` uses Android's `CallRedirectionService` (Android 10+) to cancel matching calls from any dialer
  - `GentlyScreeningService` uses `CallScreeningService` to reject matching incoming calls before they ring
  - `RuleStore` holds the rules and log in SharedPreferences, so blocking keeps working while the app is closed
  - `CallGuardPlugin` is the bridge to the UI (`src/plugins/callguard.ts`)
  - `ContactPickerPlugin` opens the system contact picker for a single number (`src/plugins/contacts.ts`)
- Screens: `src/screens/` (Status, Rules + RuleForm, Log, Settings, About, LockScreen)

The `CallGuard` plugin interface is platform-neutral to make a future iOS port easier, but note that
iOS has no API for blocking outgoing calls.

## Development

```sh
npm install
npm run dev          # UI in the browser (CallGuard is mocked with localStorage)
```

Android (needs Android Studio; uses its bundled JDK):

```sh
export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
npm run build && npx cap sync android
cd android && ./gradlew assembleDebug    # or: npx cap run android
```

On first launch: set the access code, create a rule, then use **Grant access** on the Status screen:
choose Gently as the call redirection app (outgoing) and/or the caller ID & spam app, then allow Contacts
(incoming).

Debug builds install as **Gently Dev** (`com.lixo.gently.dev`) next to the release app.

Device tests (rule precedence, international detection; they place no calls, and the international
cases only run with a Portuguese SIM):

```sh
cd android && ./gradlew :app:connectedDebugAndroidTest
```

Install on a phone without a cable via Wireless debugging (Android 11+):

```sh
adb pair <ip>:<pairing-port> <code>   # from "Pair device with pairing code"
adb connect <ip>:<port>               # from the Wireless debugging screen
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

Xiaomi/HyperOS also needs **Install via USB** enabled in Developer options.

## Icons & store assets

- Master artwork: `resources/icon.svg` (and `icon-monochrome.svg` for themed icons), on the 108×108
  adaptive-icon grid using the app's palette
- The launcher icon is a vector: `android/app/src/main/res/drawable/ic_launcher_foreground.xml`.
  Keep it in sync with the SVG if the mark changes
- `npm run assets` renders the legacy launcher PNGs and the Play Store files in `resources/store/`
  (`icon-512.png`, `feature-graphic.png`) using your installed Chrome

## Website

`website/` builds **gently.lixo.dev** (landing, privacy policy, support; 5 languages):
`npm run site:build && npm run site:preview`. Details in [AGENTS.md](AGENTS.md#website).

## Releases

`npm version patch && git push --follow-tags` publishes a signed APK as a GitHub Release and, once
connected, uploads the AAB to Google Play. Details, keys and secrets: [AGENTS.md](AGENTS.md#releasing).

## Contributing

Issues and pull requests are welcome. Before opening a PR, run `npm run build && npm run lint`, and for
native changes build the app (`cd android && ./gradlew :app:assembleDebug`). New UI text goes into
`src/i18n/en.ts` and every other language file (the build fails if one is missing). Coding agents:
start with [AGENTS.md](AGENTS.md).

Security issues: please email hugo@lixo.dev instead of opening a public issue.

## License

Copyright © 2026 Hugo Conceicao.

Gently is free software: you can redistribute it and/or modify it under the terms of the
[GNU General Public License](LICENSE) as published by the Free Software Foundation, either version 3
of the License, or (at your option) any later version. It is distributed in the hope that it will be
useful, but WITHOUT ANY WARRANTY; see the license for details.

The Inter typeface is licensed under the SIL Open Font License 1.1.

