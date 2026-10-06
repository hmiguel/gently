# AGENTS.md

Operational memo for Gently: how to build, test and release, and what bit us before.
Product overview and permissions are in [README.md](README.md).

## Layout

- `src/`: React + TypeScript + Tailwind v4 UI. Design tokens live only in `src/index.css`
  (Swiss style: paper/ink/muted/accent `#FF3000`, 0 radius, 4px rules, Inter)
- `src/plugins/`: TypeScript contracts for the native plugins, with browser mocks for `npm run dev`
- `src/i18n/`: **all UI text**. `en.ts` defines the shape; `pt.ts` (pt-PT), `es.ts` (es-ES),
  `fr.ts` (fr-FR) and `de.ts` (de-DE, informal "du") are typed against it, so a missing translation fails the build. A new language is a
  new file plus one line in `MESSAGES` and `LANGUAGES` in `src/i18n/index.ts`. Components read it with `const { m } = useI18n()`. Rule
  sentences (`m.rules.describe`) and dates use the selected language. Display headlines (`text-display`)
  fit ~8 characters per word at 360px: keep translated titles short
- `android/app/src/main/java/com/lixo/gently/callguard/`: native rule engine and call services
  - `RuleStore`: rules + log in SharedPreferences; precedence number/hidden > international > anyone, block wins ties
  - `International`: SIM-country vs E.164 calling code
  - `GentlyRedirectionService` (outgoing), `GentlyScreeningService` (incoming)
  - `CallGuardPlugin`, `ContactPickerPlugin`: Capacitor bridges
- `resources/`: icon masters (SVG) and Play Store assets; `docs/`: privacy policy, store listing

## Everyday commands

```sh
export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"   # Android Studio's JDK

npm run dev                       # UI in the browser with mocked plugins
npm run build && npm run lint     # typecheck + build + oxlint
npx cap sync android              # copy web build into the Android project
cd android && ./gradlew :app:assembleDebug                 # installs as "Gently Dev" (com.lixo.gently.dev)
cd android && ./gradlew :app:connectedDebugAndroidTest     # device tests, no calls placed
```

Always use `:app:` task paths: the Capacitor sub-modules' own test tasks fail and aren't ours.

## Releasing

Version lives only in `package.json` (`1.2.3` → versionName `1.2.3`, versionCode `10203`).

### One command, both stores

```sh
# edit distribution/whatsnew/whatsnew-en-US (Play "What's new", max 500 chars)
npm version patch          # or minor / major: bumps package.json, commits, tags vX.Y.Z
git push --follow-tags     # .github/workflows/release.yml takes it from here
```

The workflow (`.github/workflows/release.yml`, shared setup in `.github/actions/prepare`) runs:

| Job | Key (secrets) | Output |
|---|---|---|
| `version` | none | fails if the tag doesn't match `package.json` |
| `apk` | GitHub release key (`GH_RELEASE_*`) | signed APK attached to a GitHub Release |
| `play` | Play upload key (`PLAY_UPLOAD_*`) | AAB + R8 mapping uploaded to Google Play |

- `play` skips itself until the secret `PLAY_SERVICE_ACCOUNT_JSON` exists. Track: closed testing
  (`alpha`) unless the repo variable `PLAY_TRACK` says `internal` / `beta` / `production`
- Actions → Release → *Run workflow* builds a test APK artifact only (no release, no Play upload)
- Key backups: `~/.android-keys/` (`gently-upload.*` for Play, `gently-github.*` for GitHub)
- GitHub releases are private while the repo is private

### Google Play by hand (first upload, or without CI)

```sh
npm run release
# android/app/build/outputs/bundle/release/app-release.aab  → upload in Play Console
# android/app/build/outputs/apk/release/app-release.apk     → sideload to test the exact build
```

- Local signing: `android/keystore.properties` (git-ignored, never commit). Play App Signing holds the
  real app key; the upload key can be reset through Play Console support
- Store copy, Data safety answers: `docs/store-listing.md`. Privacy policy: `docs/privacy-policy.md`,
  published as a gist (URL in the file header); update the gist when the policy changes
- Graphics: `npm run assets` (icons, feature graphic); `npm run screenshots` with
  `npx vite --port 5199` running (1080×1920, demo data, never real contacts)

A GitHub APK, a Play install and a local release build are signed by different keys: switching between
them means uninstalling (which wipes rules, code and log).

## Gotchas we already paid for

- **Test the release build on a device before shipping.** R8 shrinking broke Capacitor's
  annotation-based permission aliases (works in debug, silently never returns in release). Use plain
  Android APIs (`ContextCompat.checkSelfPermission`, `ActivityResultLauncher`) for runtime permissions
- **Incoming screening needs `READ_CONTACTS`.** Without it Android skips the screening app for callers in
  the user's contacts (`dumpsys telecom` shows "contact exists" and no `SCREENING_BOUND`)
- **Debug calls on a phone:** `adb shell dumpsys telecom` shows `REDIRECTION_*` / `SCREENING_*` events per
  call; release builds can't be `run-as`, so use that and `logcat -s Gently`
- **Xiaomi / HyperOS:** enable *Install via USB* in Developer options; installing a *new* package over
  adb needs an on-phone confirmation; the permission prompt may never show after a denial, which is why
  Gently falls back to its App info page
- **Play screenshots:** the long side may be at most twice the short side (1080×2400 is rejected)
- **Emulator** on this Mac is unreliable (QEMU hangs); prefer a real phone over Wireless debugging
- **Never place real calls to test international rules** (cost); the device tests cover them
