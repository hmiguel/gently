# Gently

Android app that blocks outgoing and incoming calls, protected by an access code.

- **Rules:** each rule says *block* or *allow*, *outgoing / incoming / both*, and *who*: one number
  (picked from contacts or typed), anyone, or hidden callers. A rule for a specific number wins over a
  rule for anyone, so "block all outgoing" + "allow Mom" works as an allowlist
- **Access code:** 6 digits, stored as a salted PBKDF2 hash, with an escalating lockout after 5 wrong attempts
- **Log:** every blocked attempt, with time and number
- Emergency numbers are never blocked (Android enforces this)

## Stack

- UI: React + TypeScript + Tailwind CSS v4, packaged with [Capacitor](https://capacitorjs.com)
- Design: Swiss International style. All tokens live in `src/index.css`
- Native: `android/app/src/main/java/com/hmiguel/gently/callguard/`
  - `GentlyRedirectionService` uses Android's `CallRedirectionService` (Android 10+) to cancel matching calls from any dialer
  - `GentlyScreeningService` uses `CallScreeningService` to reject matching incoming calls before they ring
  - `RuleStore` holds the rules and log in SharedPreferences, so blocking keeps working while the app is closed
  - `CallGuardPlugin` is the bridge to the UI (`src/plugins/callguard.ts`)

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

On first launch: set the access code, tap **Grant access**, and choose Gently as the call redirection app.

## Icons & store assets

- Master artwork: `resources/icon.svg` (and `icon-monochrome.svg` for themed icons), on the 108×108
  adaptive-icon grid using the app's palette
- The launcher icon is a vector: `android/app/src/main/res/drawable/ic_launcher_foreground.xml`.
  Keep it in sync with the SVG if the mark changes
- `npm run assets` renders the legacy launcher PNGs and the Play Store files in `resources/store/`
  (`icon-512.png`, `feature-graphic.png`) using your installed Chrome

