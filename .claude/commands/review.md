---
description: Pre-commit review of the working tree — tests, types, lint, a11y, conventions
argument-hint: "[optional path/area to scope the review]"
allowed-tools: Bash(npm run *), Bash(git status:*), Bash(git diff:*), Read, Grep, Glob
---

Review the current uncommitted changes for the DataSafeguard PMP before they are committed.

1. Show what changed: `git status --short` and `git diff --stat`.
2. Run the gates and report each result:
   - `npm run test`
   - `npm run typecheck`
   - `npm run lint`
3. Read the diff and check against project conventions (see `.claude/rules/`):
   - **a11y** — form errors announced (`role="alert"`), inputs labelled, required state
     programmatic, decorative SVGs hidden, interactive controls named, `<th scope>` on tables.
   - **tests** — new logic / bug fixes have tests; both branches of new conditionals covered.
   - **types** — no `any`; indexed access narrowed (`noUncheckedIndexedAccess`).
   - **styling** — Tailwind token classes only, no raw hex; `@/` imports.
4. Summarize findings by severity (High / Medium / Low) with `file:line` and a concrete fix.

Do NOT commit — report and recommend only. If `$ARGUMENTS` names a path or area, scope to it.
