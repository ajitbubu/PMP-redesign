# API & data conventions

## Route handlers

- App Router route handlers live under `src/app/api/**/route.ts`.
- Auth endpoints: `api/auth/otp/request`, `api/auth/otp/verify`, `api/auth/session`.
- Return the right status and let the client map it: `429` (rate limited, with
  `retryAfterMs`), `400` (invalid/expired — with an `error` code the client maps to copy),
  `200/204` on success. Keep the `error` code strings **stable** — the UI switches on them
  (e.g. `otp-form.tsx` maps `invalid`/`expired`/`too_many_attempts`/`not_found`).

## Auth model (real, not stubbed)

- `src/middleware.ts` gates the `(app)` segment behind a signed session cookie.
- Session = HMAC-SHA256 (`src/lib/auth/session.ts`), verified on every request.
- OTP: `src/lib/auth/otp-store.ts` — 6-digit, 10-min expiry, 5 attempts, 60s resend
  cooldown, single-use. In-memory today (swap for Redis/DB before scaling out).
- Never log OTP codes or session secrets in committed code (the dev-only console fallback
  aside).

## Data layer

- Screen data is typed mock/sentinel in `src/lib/data/*`; the shared contract is
  `src/lib/types.ts`. Replace mock reads with real API calls behind the **same types** —
  don't reshape the types to fit a component.

## Security headers

- CSP and related headers are set centrally. Any new external origin (image host, script,
  connect target) must be added to the CSP allow-list, or the browser will block it.
