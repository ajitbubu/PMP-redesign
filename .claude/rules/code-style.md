# Code style

Conventions for the DataSafeguard PMP (Next.js 15 · React 19 · TypeScript strict ·
Tailwind v4 · shadcn/ui). Match the surrounding code first; the rules below fill gaps.

## TypeScript

- `strict` is on, plus `noUncheckedIndexedAccess` — indexed access is `T | undefined`.
  Narrow or assert before use (see `src/components/sections/auth/otp-form.test.tsx` for
  the tuple pattern).
- Prefer inline `type` for props (`{ tile }: { tile: StatTile }`).
- Shared data contracts live in `src/lib/types.ts` — import from there, don't redefine.

## React / components

- Add `"use client"` only when a component actually uses state/effects/handlers.
- One folder per screen group under `src/components/sections/*`; cross-screen pieces in
  `src/components/shared`; shadcn primitives in `src/components/ui`.
- Compose primitives; don't fork them. Extend via `className` + `cn()` (`src/lib/utils.ts`).

## Styling

- Design tokens are centralized in `src/app/globals.css` (`@theme inline` + CSS vars).
  Use token classes (`text-foreground`, `bg-card`, `border-border`) — never raw hex.
- Icons: lucide-react auto-applies `aria-hidden` to icons with no a11y prop, so decorative
  icons need nothing extra; only add `aria-label`/`role` when the icon carries meaning.

## Imports & formatting

- Use the `@/` alias for `src` imports.
- Prettier (`npm run format`) + `prettier-plugin-tailwindcss` orders classes — run it,
  don't hand-order class names.

## Accessibility (this is a privacy/compliance product — a11y is correctness)

- Form errors: `role="alert"` + `aria-describedby`; dynamic status: `role="status"`.
- Every input needs an associated `<Label htmlFor>` or `aria-label`; required state must be
  programmatic (`required` / `aria-required`), not an asterisk alone.
- Interactive icon-only controls need an accessible name; data tables need `scope` on `<th>`.
