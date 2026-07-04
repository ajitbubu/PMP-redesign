# Deploy configuration

Reference for the `deploy` skill. Values live in the Vercel project / `.env.local`, never git.

## Environments

| Target     | Trigger                       | URL                              |
| ---------- | ----------------------------- | -------------------------------- |
| Preview    | `vercel` / branch push        | per-deploy `*.vercel.app`        |
| Production | `vercel --prod` / merge `main`| https://pmp.datasafeguard.ai     |

## Environment variables

| Var                   | Required   | Notes                                                                 |
| --------------------- | ---------- | --------------------------------------------------------------------- |
| `SESSION_SECRET`      | ✅ prod     | HMAC-SHA256 signing key. `openssl rand -base64 32`. Insecure dev fallback if unset. |
| `NEXT_PUBLIC_SITE_URL`| recommended| Canonical URL for metadata, `sitemap.ts`, `robots.ts`.                |
| `RESEND_API_KEY`      | optional   | Real OTP email via Resend. Unset → codes log to server console.       |
| `EMAIL_FROM`          | optional   | From-address for OTP mail.                                            |
| `NEXT_PUBLIC_GA_ID`   | optional   | GA4 id; analytics only injected when set.                            |

## Notes

- The OTP store is in-memory / single-process — codes and rate limits reset on redeploy and
  are not shared across instances. Move to Redis/DB before running more than one instance.
- `.vercel/` and `.env*.local` are gitignored — keep it that way.
