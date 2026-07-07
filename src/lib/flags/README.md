# Feature flags

Gate major features behind toggles read from a **public** JSON config, fetched at
startup and re-checked on an interval so a kill-switch propagates.

## Config source

The published config URL is built from env vars (never hardcoded):

```text
https://<FLAGS_CDN_BASE>/<FLAGS_ENV>/<FLAGS_TENANT>.json
# e.g. https://datasafeguard.com/prod/samsung.json
```

| Var | Example | Notes |
| --- | --- | --- |
| `FLAGS_CDN_BASE` | `https://datasafeguard.com` | HTTPS required. |
| `FLAGS_ENV` | `prod` | Defaults to `dev`. |
| `FLAGS_TENANT` | `samsung` | — |
| `FLAGS_SOURCE` | `local` | Force the bundled file even if the CDN vars are set. |
| `NEXT_PUBLIC_FLAGS_POLL_MS` | `60000` | Client re-fetch cadence (min 5000). |

**Local (default today):** when the CDN vars are unset — or `FLAGS_SOURCE=local` —
the app reads [`flags.local.json`](./flags.local.json). Swap in real CDN values to
go live; no code change needed.

## Config shape

```jsonc
{
  "meta":     { "tenant","environment","platform","appVersion","version","publishedAt","cdnUrl","etag" },
  "features": {
    "ucm.enable_cookie": true,      // cookie-consent banner
    "ucm.enable_consent": true,     // Consent module
    "ucm.enable_preference": true,  // Preferences module
    "dsar.enable_dsar": true,       // Data rights (DPAR/DSAR) module
    "pia.enable_pia": true,         // PIA module
    "profile.enable_profile": true, // User profile
    "ucm.cookie_ttl_days": 180      // numeric example (read via getValue)
  }
}
```

`features` is a **flat** map; keys are `"<module>.<flag>"`; values are plain JSON
booleans, strings, or numbers. Declare every key in [`keys.ts`](./keys.ts).
Dashboard is intentionally **not** gated — it's the post-login landing, so it
must always stay reachable.

## Critical features are gated at two layers

1. **UI (UX):** the nav rail / tab bar / user-menu hide entries whose flag is off
   (`visibleNavItems`, `useFlag`, `<Flag>`), seeded from the server → no flash.
2. **Edge enforcement (the boundary):** [`middleware.ts`](../../middleware.ts) maps
   each gated route prefix to its flag and **redirects to `/dashboard`** when off —
   before any render, with a proper status. Pages also call `requireFeature()` as
   a defense-in-depth backstop. A disabled feature is genuinely unreachable, not
   just hidden.

## Usage

**Client** (gate UI — this is UX only, not security):

```tsx
import { Flag, useFlag, useFlags, FLAGS } from "@/lib/flags";

<Flag name={FLAGS.UCM_ENABLE_COOKIE}><CookieConsentBanner /></Flag>;

const on = useFlag(FLAGS.PIA_ENABLE_PIA);
const ttl = useFlags().getValue(FLAGS.UCM_COOKIE_TTL_DAYS, 365);
```

**Server** (the real boundary — RSC & route handlers):

```ts
import { getServerFlags } from "@/lib/flags/server";

const flags = await getServerFlags();
if (!flags.isEnabled(FLAGS.UCM_ENABLE_COOKIE)) return notFound();
```

Startup wiring lives in [`src/app/layout.tsx`](../../app/layout.tsx): it
`loadFlags()` server-side and seeds `<FlagsProvider initial={…}>` so gated UI is
correct on first paint (no flash), then the provider polls `/api/flags`.

## Security model

- **Public config, non-sensitive only.** Never secrets, tokens, PII, or internal
  URLs — the JSON is world-readable.
- **Client show/hide is UX, not access control.** For any feature exposing
  privileged data/actions, the **server** must independently enforce (a) the flag
  is on *and* (b) the user is authorized. Gate the protected endpoints too — see
  [`api/ucm/cookie-consent/route.ts`](../../app/api/ucm/cookie-consent/route.ts).
- **Fail closed.** Missing/unknown flag, malformed config, or a failed fetch →
  the feature is OFF. `isEnabled` requires a strict `true`.
- **HTTPS only** for the CDN fetch; payloads are validated by `normalizeConfig`
  before use (`features` must be an object; non-primitive entries are dropped).
- **No injection.** Flag values are data only — never feed them into `eval`,
  `innerHTML`, or URL/HTML construction without sanitizing.
- **CSP:** the client polls same-origin `/api/flags` (covered by `connect-src
  'self'`). If you switch the client to fetch the CDN directly, add that origin
  to the CSP `connect-src` allow-list in `next.config.ts`.
