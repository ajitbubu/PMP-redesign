/**
 * Client-safe entry point for the flags module. Import UI/hooks/keys from here.
 *
 * Server-only helpers (config fetching, `getServerFlags`) live in
 * `@/lib/flags/server` and must NOT be re-exported here — that would pull the
 * outbound fetch + server env access into the client bundle.
 */
export { FLAGS, type FlagKey } from "./keys";
export { FlagsProvider, useFlags, useFlag, Flag } from "./provider";
export { isEnabled, getValue, normalizeConfig, EMPTY_SNAPSHOT } from "./core";
export type { FlagValue, FlagsConfig, FlagsSnapshot, FlagsMeta } from "./types";
