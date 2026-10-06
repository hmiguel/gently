# Gently: Privacy Policy

<!-- The policy of record is the website: https://gently.lixo.dev/privacy/ (source:
website/src/i18n/*.ts, privacy section). This English copy is kept for reference. -->

_Last updated: 5 October 2026_

Gently is a call blocker for Android. This policy explains what the app does with your information.
The short version: **Gently does not collect, store remotely, share or sell any personal data.
Everything stays on your phone.**

## What the app stores, and where

Gently stores the following **only on your device**, in the app's private storage:

- **Your rules:** the phone numbers you add, and the optional name you give each one.
- **The blocked-call log:** the number, time and direction (incoming or outgoing) of calls Gently blocked.
  The log keeps at most the 200 most recent entries, and you can clear it at any time.
- **Your access code:** stored only as a salted, one-way hash (PBKDF2), never as the code itself.

This data never leaves your device. Gently has **no internet permission**, so Android does not allow it
to connect to any server. There is no account, analytics, advertising, crash reporting or tracking of
any kind.

Uninstalling Gently, or clearing its storage in Android settings, deletes all of this data.

## Permissions

| Permission | Why Gently needs it |
|---|---|
| Call redirection (system role) | To cancel outgoing calls that match your rules before they connect. |
| Caller ID & spam (call screening role) | To reject incoming calls that match your rules before your phone rings. |
| Contacts (`READ_CONTACTS`) | Android only passes calls from saved contacts to a call-screening app that holds this permission. Gently does **not** read, copy or upload your contacts. When you add a number "from contacts", Android's own contact picker gives Gently only the single number you choose. |
| Vibrate | Haptic feedback when you tap the keypad and buttons. |

Gently only sees the phone number of a call when Android asks it to check that call against your rules.
It does not record calls, read call contents, or access your call history.

## Children

Gently does not collect personal data from anyone, including children.

## Changes

If this policy changes, the new version will be published at this same address with an updated date.

## Contact

Questions about this policy: **hugo@lixo.dev**
