# Testing

Full framework details live in [TESTING.md](../../TESTING.md). Quick reference:

- **Runner:** Vitest 4 + React Testing Library + jsdom. `npm run test` (once),
  `npm run test:watch`, `npm run test:ui`.
- **Location:** colocated. `*.test.ts` for pure logic (`src/lib/**`), `*.test.tsx` for
  components (render with RTL; assert on roles/text, not implementation details).
- **Setup:** `vitest.setup.ts` loads jest-dom matchers and a `ResizeObserver` polyfill
  (Radix primitives need it). Mock `next/navigation` when a component calls `useRouter`;
  stub `fetch` with `vi.stubGlobal` for network paths.

## Expectations (non-negotiable)

- Write a test with every new function; a regression test with every bug fix.
- Cover BOTH branches of every new conditional (if/else, switch).
- Add a test that triggers each new error path.
- Assert real values (`toEqual({ ok: true })`), never just `toBeDefined()` / "doesn't throw".
- Never commit code that fails existing tests. Run `npm run test` before committing.
