# Test Plan — DataSafeguard PMP

Companion to [TESTING.md](TESTING.md) (framework & conventions). This document is the
_what/how-much/where-are-the-gaps_ view: what to test, the test type per area, coverage
targets, example cases, and the gap analysis that drives the backlog.

## Current baseline

- Pre-existing: [session.test.ts](src/lib/auth/session.test.ts),
  [otp-store.test.ts](src/lib/auth/otp-store.test.ts) — auth logic only.
- This branch adds: API route + middleware integration tests, and unit tests for
  `utils`, `ui-maps`, `isNavActive`, `mailer`, plus the timer-based auth gaps.
- The `a11y/component-accessibility-pass` branch adds 7 component suites.
- No coverage instrumentation / CI gate is configured yet.

## Test types & tooling

| Type | Runner | Scope |
|------|--------|-------|
| Unit | Vitest (no DOM) | pure logic: `lib/utils`, `lib/ui-maps`, `lib/auth/*`, `isNavActive` |
| Component | Vitest + RTL + jsdom | behaviour + a11y of `components/**` |
| Integration | Vitest (Node globals) | route handlers `app/api/**`, `middleware.ts` — call with `Request`/`NextRequest`, assert `Response`/cookies |
| E2E | Playwright *or* gstack `/qa` | full flows across pages |
| A11y assertion | RTL roles (+ optional `jest-axe`) | roles / labels / landmarks, inside component tests |

## Area-by-area

| # | Area | What to test | Type | Target |
|---|------|-------------|------|--------|
| 1 | Auth crypto `session.ts` | sign/verify round-trip, tamper, **expiry**, malformed, **secret actually used** | Unit | 100% |
| 2 | OTP store `otp-store.ts` | issue/verify, single-use, lockout, cooldown, **expiry**, **cooldown-elapsed** | Unit | 100% |
| 3 | Mailer `mailer.ts` | Resend path vs console-fallback branch | Unit | 100% |
| 4 | API `otp/request` | email validation, 429 cooldown, 200 + mailer called, normalization | Integration | 100% branches |
| 5 | API `otp/verify` | invalid_request, per-reason 400s, cookie flags on success | Integration | 100% branches |
| 6 | API `session` | DELETE clears cookie | Integration | 100% |
| 7 | Middleware | no cookie → redirect, bad token → redirect, valid → next | Integration | 100% |
| 8 | Utils | `formatDate` (valid/invalid), `maskValue` (short/long/boundary), `cn` | Unit | 100% |
| 9 | UI maps | `statusBadgeVariant` — every case group + default | Unit | 100% |
| 10 | Nav logic `isNavActive` | exact, prefix, `matches[]`, non-match | Unit | 100% |
| 11 | Interactive sections (forms, filters, tables, dialogs) | validation, empty-state, row-expand, toggles, toast | Component | 90% |
| 12 | UI primitives with logic (dialog/table/input/select) | behaviour + a11y contract | Component | 80% |
| 13 | Layout/shared (user-menu, bell, pagination, stat-card) | interaction + naming | Component | 80% |
| 14 | Pages `app/**/page.tsx` | render smoke (no throw) | Component | render-only |
| 15 | Critical flows (login→OTP→dashboard, submit request, manage consent) | end-to-end | E2E | flows pass |
| 16 | Responsive (tablet row-collapse, mobile tab bar↔sidebar) | breakpoints | E2E/visual | key breakpoints |

## Coverage targets

- `lib/**`, `app/api/**`, `middleware.ts` → **100%** lines & branches (pure / security-critical, cheap).
- Interactive section components → **90%**, every user-facing branch.
- UI primitives / layout / shared → **80%**, weighted to ones with logic.
- Pages → render smoke only; depth via e2e.
- Repo gate → **85%** overall, with `src/lib/**` at 100%.
- Enable reporting in [vitest.config.ts](vitest.config.ts):
  ```ts
  test: { coverage: { provider: "v8", reporter: ["text", "html"],
    thresholds: { lines: 85, branches: 85,
      "src/lib/**": { lines: 100, branches: 100 } } } }
  ```

## Gap analysis (prioritised)

**Critical (addressed on this branch):**
1. All 3 API route handlers — the entire request→response/cookie boundary.
2. Middleware — the sole authorization gate for every `(app)` route.
3. OTP & session **expiry** paths (needed `vi.useFakeTimers()`), session **secret-in-use**.
4. `utils.ts` (`maskValue` gates PII display).

**Moderate (addressed on this branch):**
5. `ui-maps.ts` `statusBadgeVariant` branches.
6. `mailer.ts` Resend-vs-console branch.
7. `isNavActive` — drives every nav highlight.

**Still open (follow-up):**
8. ~47 untested components — biggest: `submit-request-form`, `profile-form`, `privacy-search`,
   `consent-filter-panel`, `preference-list/detail` filtering, `rights-module` (segmented + toast),
   the two dialogs, `pagination-bar`, `user-menu` logout. (Merge the a11y branch's 7 first.)
9. No e2e for the real login→dashboard flow.
10. No coverage instrumentation / CI gate.
11. `opengraph-image`, `sitemap`, `robots`, static `lib/data/*` — low value; skip or render-smoke.

## Execution order

1. Pure logic: `utils`, `ui-maps`, `isNavActive` ✅ (this branch)
2. Timer gaps in `otp-store` / `session` ✅ (this branch)
3. API + middleware integration ✅ (this branch)
4. Interactive section components (after merging the a11y branch's 7)
5. Enable coverage + CI threshold
6. One Playwright happy-path e2e
