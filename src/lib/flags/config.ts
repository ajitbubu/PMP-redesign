/**
 * Config-source resolution. The CDN base, environment, and tenant are read from
 * env vars — never hardcoded — and combined into the published-config URL:
 *
 *   https://<FLAGS_CDN_BASE>/<FLAGS_ENV>/<FLAGS_TENANT>.json
 *
 * When the CDN vars aren't set (or FLAGS_SOURCE=local), the app falls back to the
 * bundled `flags.local.json` so it runs out of the box in development.
 */

export type FlagsSource =
  | { mode: "local" }
  | { mode: "cdn"; url: string };

/**
 * Resolve where flags come from. Server-only: reads non-public env vars, so call
 * this exclusively from server code (route handlers / server components).
 */
export function getFlagsSource(): FlagsSource {
  const base = process.env.FLAGS_CDN_BASE?.trim().replace(/\/+$/, "");
  const env = process.env.FLAGS_ENV?.trim() || "dev";
  const tenant = process.env.FLAGS_TENANT?.trim();
  const forceLocal = process.env.FLAGS_SOURCE?.trim() === "local";

  if (forceLocal || !base || !tenant) return { mode: "local" };
  return { mode: "cdn", url: `${base}/${env}/${tenant}.json` };
}

const DEFAULT_POLL_MS = 60_000;
const MIN_POLL_MS = 5_000;

/**
 * Client re-fetch cadence for kill-switch propagation. Reads the public env var
 * (inlined into the client bundle) so it's safe to call in the browser.
 */
export function getPollMs(): number {
  const raw = Number(process.env.NEXT_PUBLIC_FLAGS_POLL_MS);
  return Number.isFinite(raw) && raw >= MIN_POLL_MS ? raw : DEFAULT_POLL_MS;
}
