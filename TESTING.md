# Testing

100% test coverage is the key to great vibe coding. Tests let you move fast, trust
your instincts, and ship with confidence — without them, vibe coding is just yolo
coding. With tests, it's a superpower.

## Framework

[Vitest](https://vitest.dev) 4 + [React Testing Library](https://testing-library.com/react)
+ jsdom.

## Running tests

```sh
npm run test        # run once (CI mode)
npm run test:watch  # watch mode
npm run test:ui     # Vitest's browser UI
```

## Test layers

- **Unit tests** — colocated as `*.test.ts` next to the source file (e.g.
  `src/lib/auth/session.test.ts`). Cover pure logic and business rules:
  validation, state machines, crypto/signing, data transforms. No DOM.
- **Component tests** — colocated as `*.test.tsx`. Render with
  `@testing-library/react`, assert on user-visible behavior (text, roles,
  interactions), not implementation details.
- **Integration tests** — not yet set up. If this grows API routes with real
  request/response cycles worth testing end-to-end, add them under `src/app/api/**/*.test.ts`.
- **E2E tests** — not set up. This project uses `/qa` (gstack browser-based QA)
  for end-to-end flow verification instead of a maintained Playwright suite.

## Conventions

- File naming: `<subject>.test.ts` or `<subject>.test.tsx`, colocated with the file under test.
- `describe(subject)` → `it("does X when Y")` — name tests by observable behavior, not method names.
- Assert real behavior and values (`expect(result).toEqual({ok: true})`), never
  just `toBeDefined()` / "doesn't throw".
- Mock nothing that doesn't need mocking — this codebase's business logic
  (`src/lib/auth/*`) is pure enough to test directly against real inputs.
