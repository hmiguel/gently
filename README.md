# Gently

Android app that blocks outgoing and incoming calls, protected by an access code.

- **Direction:** outgoing, incoming, or both
- **Modes:** block all calls, block a list of numbers, or allow only a list of numbers
- **Hidden numbers:** optionally reject incoming calls with no caller ID
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
