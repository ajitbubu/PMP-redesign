---
name: deploy
description: >-
  Deploy the DataSafeguard PMP to Vercel. Use when asked to deploy, ship to
  production/preview, or cut a release of this Next.js app. Runs the pre-deploy gates
  first, then deploys. Not for local dev — use `npm run dev` for that.
---

# Deploy

Deploy this Next.js 15 app to Vercel. Read `deploy-config.md` (next to this file) for
environments and required variables before deploying.

## Pre-deploy gates (all must pass — never deploy red)

1. `npm run test`
2. `npm run typecheck`
3. `npm run lint`
4. `npm run build` (catches build-only failures the dev server hides)

## Required environment (set in the Vercel project, never committed)

- `SESSION_SECRET` — **required in production** (`openssl rand -base64 32`). Without it the
  app falls back to an insecure dev secret.
- Optional: `NEXT_PUBLIC_SITE_URL`, `RESEND_API_KEY`, `EMAIL_FROM`, `NEXT_PUBLIC_GA_ID`.

## Deploy

- Preview: `vercel` (or push a branch — Vercel builds a preview per PR).
- Production: `vercel --prod` (or merge to `main` if the Git integration is enabled).

## After deploy

- Confirm `/login` returns 200 and that unauthenticated `(app)` routes redirect to it.
- If `RESEND_API_KEY` is set, verify OTP email delivery; otherwise codes log to the server.
- Watch the first production logs for CSP violations from any newly added external origin.
