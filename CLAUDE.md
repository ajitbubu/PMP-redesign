# DataSafeguard PMP (ID-PRIVACY®)

Production Next.js 15 app: App Router · React 19 · TypeScript (strict) · Tailwind v4 ·
shadcn/ui · Vitest. See [README.md](README.md) for the full stack, routes, and architecture.

Common commands: `npm run dev` · `npm run test` · `npm run typecheck` · `npm run lint` ·
`npm run build` · `npm run format`.

## Detailed rules

Topic-specific conventions are split into modular files under `.claude/rules/` and imported
here so they load with this file:

@.claude/rules/code-style.md
@.claude/rules/testing.md
@.claude/rules/api-conventions.md

## Testing

Run tests: `npm run test` (Vitest). Test directory: colocated `*.test.ts`/`*.test.tsx`
files next to the source they cover. See [TESTING.md](TESTING.md) for framework
details and conventions.

Test expectations:
- 100% test coverage is the goal — tests make vibe coding safe.
- When writing new functions, write a corresponding test.
- When fixing a bug, write a regression test.
- When adding error handling, write a test that triggers the error.
- When adding a conditional (if/else, switch), write tests for BOTH paths.
- Never commit code that makes existing tests fail.
