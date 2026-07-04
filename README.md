# ID-PRIVACY® Privacy Management Portal (PMP)

Production Next.js 15 implementation of the DataSafeguard PMP, built from the Figma
`DSG` design and the `datasafeguard-shadcn` token system.

## Stack

- **Next.js 15** (App Router, TypeScript strict, React 19)
- **Tailwind CSS v4** — DataSafeguard design tokens live in `src/app/globals.css`
  (`@theme inline` + CSS variables), so the design system is centralized.
- **shadcn/ui** primitives (`src/components/ui`), customized to the tokens.
- **next/font** — Inter (body), Hanken Grotesk (display), JetBrains Mono.
- **Google Analytics 4** via `@next/third-parties` — set `NEXT_PUBLIC_GA_ID` to enable;
  client route changes fire `page_view` (`src/components/analytics/analytics-page-view.tsx`).
- **SEO** — Metadata API, dynamic OG image (`src/app/opengraph-image.tsx`),
  `sitemap.ts`, `robots.ts`.

## Getting started

```sh
cp .env.example .env.local   # add SESSION_SECRET at minimum (openssl rand -base64 32)
npm install
npm run dev                  # http://localhost:3000  → redirects to /login
```

Enter any email + check the verification box to request a code. Without
`RESEND_API_KEY` set, the OTP is logged to the server console instead of
emailed — copy it from there to complete verification.

Scripts: `npm run build`, `npm run start`, `npm run lint`, `npm run typecheck`,
`npm run format`.

## Routes

| Route | Screen |
|-------|--------|
| `/login`, `/register`, `/verify-otp` | Auth (managed CAPTCHA, OTP) |
| `/dashboard` | Dashboard + consent-notice modal |
| `/consent`, `/consent/[group]` | Manage Consent + drill-down |
| `/preferences`, `/preferences/[channel]` | Manage Preference + drill-down |
| `/rights/dpar`, `/rights/dsar` | Data Rights (shared module, two routes) |
| `/pia`, `/pia/assessments` | Privacy Impact Assessments |
| `/profile` | User Profile (PII show/hide) |

## Architecture

- `src/app/(auth)` — public auth shell. `src/app/(app)` — authenticated shell
  (navy sidebar / mobile tab bar / header).
- `src/components/ui` — shadcn primitives. `src/components/layout` — app chrome.
  `src/components/shared` — cross-screen pieces. `src/components/sections/*` —
  one folder per screen group.
- `src/lib/data/*` — typed mock data (replace with API calls). `src/lib/types.ts` —
  the shared data contract.

## Design decisions baked in

Resolved during the plan design review (see `../PMP-UI-v2/DSG-design-review.md`):

1. DPAR & DSAR share one component (`rights-module.tsx`), two routes + audit trails.
2. ID-PRIVACY® is the product; DataSafeguard shown as a "Powered by" credit.
3. Consent/Preference group detail defaults to unfiltered "All"; the empty state
   only appears when the user actively filters to zero.
4. CAPTCHA is a managed-service (Turnstile-style) widget, not distorted text — accessible.
5. Wide tables collapse via per-row expand at tablet width.

## Responsive

- **Mobile 375–767px** — hamburger-free bottom tab bar, stacked layouts, ≥44px targets.
- **Tablet 768–1023px** — data tables collapse secondary columns behind row-expand.
- **Desktop 1024px+** — navy sidebar, full tables, `max-w-[1400px]` content.

> Screen data (consent, preferences, rights, PIA, profile) in `src/lib/data/*`
> is still mock/sentinel — wire it to your real API before production. Auth
> is real, not a stub: `src/middleware.ts` gates the `(app)` segment behind a
> signed session cookie (`src/lib/auth/session.ts`, HMAC-SHA256, verified on
> every request), issued only after a genuine OTP challenge-response
> (`src/lib/auth/otp-store.ts` — 6-digit code, 10-minute expiry, 5 attempts,
> 60s resend cooldown, single-use). Delivery goes through Resend when
> `RESEND_API_KEY` is set, or the server console otherwise.
>
> What's still missing before this is production auth: the OTP store is
> in-memory (single process — codes and rate limits reset on restart, don't
> share across instances; move to Redis/a DB table before scaling out), there
> is no persistent user account/profile record tied to the verified email
> (anyone can "sign in" with any email — this is closer to passwordless
> magic-code auth than a real user directory), and there's no server-side
> session revocation (deleting the cookie is the only way to end a session
> today — no admin-forced logout, no multi-device sign-out list).
