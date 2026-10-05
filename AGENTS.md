# AGENTS.md

Operational memo for Gently: how to build, test and release, and what bit us before.
Product overview and permissions are in [README.md](README.md).

## Layout

- `src/`: React + TypeScript + Tailwind v4 UI. Design tokens live only in `src/index.css`
  (Swiss style: paper/ink/muted/accent `#FF3000`, 0 radius, 4px rules, Inter)
- `src/plugins/`: TypeScript contracts for the native plugins, with browser mocks for `npm run dev`
- `android/app/src/main/java/com/hmiguel/gently/callguard/`: native rule engine and call services
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
cd android && ./gradlew :app:assembleDebug                 # installs as "Gently Dev" (com.hmiguel.gently.dev)
cd android && ./gradlew :app:connectedDebugAndroidTest     # device tests, no calls placed
```

Always use `:app:` task paths: the Capacitor sub-modules' own test tasks fail and aren't ours.

## Releasing

Version lives only in `package.json` (`1.2.3` → versionName `1.2.3`, versionCode `10203`).

### GitHub Release (APK)

```sh
npm version patch          # or minor / major: bumps package.json, commits, tags vX.Y.Z
git push --follow-tags     # .github/workflows/release.yml builds, signs, publishes (~2–3 min)
```

- The workflow fails if the tag doesn't match `package.json`
- Signed with the **GitHub release key** (secrets `GH_RELEASE_KEYSTORE_BASE64`,
  `GH_RELEASE_KEYSTORE_PASSWORD`, `GH_RELEASE_KEY_ALIAS`; backup `~/.android-keys/gently-github.*`)
- Actions → Release APK → *Run workflow* builds a test APK artifact without a release
- Releases are private while the repo is private

### Google Play (AAB)

```sh
npm run release    # after `npm version …`
# android/app/build/outputs/bundle/release/app-release.aab  → upload in Play Console
# android/app/build/outputs/apk/release/app-release.apk     → sideload to test the exact build
```

- Signed with the **Play upload key**: `~/.android-keys/gently-upload.jks`, config in
  `android/keystore.properties` (git-ignored, never commit). Play App Signing holds the real app key
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
