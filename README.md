# Gently

Android app that blocks outgoing and incoming calls, protected by an access code.

- **Rules:** each rule says *block* or *allow*, *outgoing / incoming / both*, and *who*: one number
  (picked from contacts or typed), anyone, international numbers (outside the SIM's country), or hidden
  callers. The most specific rule wins (number/hidden, then international, then anyone), so "block all
  outgoing" + "allow Mom" works as an allowlist
- **Access code:** 6 digits, stored as a salted PBKDF2 hash, with an escalating lockout after 5 wrong attempts.
  The app locks whenever it leaves the screen; the code can be changed in Settings (current code required)
- **Log:** every blocked attempt, with time, number and direction
- **Settings** (⚙): change the access code, see and re-grant permissions
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
- Design: Swiss International style. All tokens live in `src/index.css`
- Native: `android/app/src/main/java/com/hmiguel/gently/callguard/`
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

Debug builds install as **Gently Dev** (`com.hmiguel.gently.dev`) next to the release app.

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

## Releasing to Google Play

The version lives in `package.json` only (`1.2.3` becomes `versionName 1.2.3`, `versionCode 10203`).
Bump it with `npm version patch|minor|major` before every upload.

```sh
export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
npm run release
# -> android/app/build/outputs/bundle/release/app-release.aab   (upload to Play)
# -> android/app/build/outputs/apk/release/app-release.apk      (install on a device to test)
```

Release builds are shrunk with R8 and signed with the **upload key** described in
`android/keystore.properties` (git-ignored; the keystore itself lives in `~/.android-keys/`).
The app uses Play App Signing, so Google holds the app signing key; a lost upload key can be reset
through Play Console support. **Back up both files anyway.**

Store copy, Data safety answers and the privacy policy draft are in `docs/`. Graphics are in
`resources/store/`; regenerate them with `npm run assets` and (with `npx vite --port 5199` running)
`npm run screenshots`.

## GitHub releases (APK)

Pushing a version tag builds a signed APK and attaches it to a GitHub Release
(`.github/workflows/release.yml`):

```sh
npm version patch          # bumps package.json, commits, tags v1.0.1
git push --follow-tags
```

These APKs are signed with a separate **GitHub release key** (repo secrets `GH_RELEASE_*`; local
backup in `~/.android-keys/gently-github.*`), not the Play upload key. Play re-signs its builds with
Google's key, so a GitHub APK and a Play install can't update each other.

A manual run (Actions → Release APK → Run workflow) builds the APK as a downloadable artifact without
creating a release.

