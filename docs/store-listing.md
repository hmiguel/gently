# Google Play listing: Gently

Copy each field into Play Console → Grow → Store presence → Main store listing.

## App name (max 30)

```
Gently: Call Blocker
```
(20 characters)

## Short description (max 80)

```
Block outgoing and incoming calls with simple rules, protected by a code.
```
(73 characters)

## Full description (max 4000)

```
Gently blocks the calls you choose — outgoing, incoming, or both — and keeps your rules behind an access code.

SIMPLE RULES
Each rule reads like a sentence: "Block calls to Alex." "Block all outgoing calls." "Allow calls from Mom."
• Block or allow
• Outgoing, incoming, or both
• One number, anyone, international numbers, or hidden numbers
Pick numbers straight from your contacts or type them in.

SPECIFIC WINS
A rule for one number beats a rule for anyone. Block all outgoing calls and allow just a few people, and only those calls go through. Block international calls and still allow the one relative abroad.

PROTECTED BY A CODE
Changing anything needs your 6-digit access code. Gently locks itself every time you leave the app, and repeated wrong attempts trigger a growing lockout.

QUIET BLOCKING
Blocked outgoing calls never connect. Blocked incoming calls are rejected before your phone rings. Every blocked attempt is listed in the log, with time and direction.

PRIVATE BY DESIGN
• No account, no ads, no tracking
• No internet permission — nothing can leave your phone
• Your contacts are never read; the system picker shares only the number you choose

EMERGENCY CALLS ALWAYS WORK
Android never lets an app block emergency numbers, and Gently never tries.

Available in English, Portuguese, Spanish and French. Requires Android 10 or newer. Gently uses Android's official call redirection and call screening features, which you enable in a single step from the app.
```

## Category & tags

- **Category:** Tools (alternative: Communication)
- **Tags:** call blocker, call control, privacy

## Contact details

- **Email:** hugo@lixo.dev (required, shown publicly)
- **Website:** optional
- **Privacy policy URL:** https://gist.github.com/hmiguel/71b7c9a76dec40cfcf0e282566d070cc

## Graphics

| Asset | File |
|---|---|
| App icon 512×512 | `resources/store/icon-512.png` |
| Feature graphic 1024×500 | `resources/store/feature-graphic.png` |
| Phone screenshots (1080×2400) | `resources/store/screenshots/*.png` |

---

# Data safety form (Play Console → Policy → App content → Data safety)

- **Does your app collect or share any of the required user data types?** → **No**
  - Reason: all data (rules, numbers, log) is processed and stored only on the device and never
    transmitted off it. Google's definition of "collect" covers data sent off the device, so on-device
    only data is not "collected".
- **Is all of the user data collected by your app encrypted in transit?** → not applicable (nothing transmitted)
- **Do you provide a way for users to request that their data is deleted?** → Uninstalling or clearing app storage deletes everything

# Other App content declarations

- **Ads:** No ads
- **App access:** All functionality is available without special access. Note for reviewers:
  *"On first launch, set any 6-digit access code. Create a rule on the Rules tab, then grant the call
  redirection / call screening role from the Status screen."*
- **Content rating questionnaire:** Utility app; no violence, sexual content, gambling, user-generated
  content sharing, or location sharing → expected rating: Everyone / PEGI 3
- **Target audience:** 18+ (avoids the extra Families policy requirements; the app is not designed for children)
- **News app:** No
- **Government app:** No
- **Financial features:** None
- **Health:** No
