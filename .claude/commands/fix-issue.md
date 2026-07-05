---
description: Implement a fix for an issue following the repo's bug-fix workflow
argument-hint: "<issue # or description>"
allowed-tools: Bash(npm run *), Bash(git *), Bash(gh *), Read, Edit, Write, Grep, Glob
---

Fix: $ARGUMENTS

Follow the project bug-fix workflow:

1. **Root cause** — locate it. Search the codebase and read the relevant files fully. If the
   argument is a GitHub issue number, pull it first with `gh issue view $ARGUMENTS`.
2. **Fix** — make the minimal change that addresses the root cause (not the symptom). Match
   the surrounding code's style and reuse existing utilities.
3. **Regression test** — write a test that FAILS without the fix and passes with it,
   colocated (`*.test.tsx` / `*.test.ts`). Cover both branches of any new conditional.
4. **Gates** — run `npm run test`, `npm run typecheck`, `npm run lint`; all must pass.
5. **Summary** — explain the root cause, the fix, and the test. Don't commit unless asked.
