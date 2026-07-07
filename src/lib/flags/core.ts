import type { FlagValue, FlagsConfig, FlagsSnapshot } from "./types";

/**
 * Isomorphic (client + server) flag logic. All of it is fail-closed: unknown or
 * malformed input resolves to "feature off" / the caller's default, never on.
 */

/** The safe default: no features, so every `isEnabled` is false. */
export const EMPTY_SNAPSHOT: FlagsSnapshot = { features: {}, meta: null, etag: null };

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Validate and sanitize an untrusted config document. Anything that isn't a
 * well-formed object with a `features` map is coerced to empty (→ all off), and
 * individual feature entries that aren't JSON primitives are dropped. This is
 * the single trust boundary for config data — call it on every fetched payload.
 */
export function normalizeConfig(raw: unknown): FlagsConfig {
  if (!isPlainObject(raw)) return { meta: null, features: {} };

  const features: Record<string, FlagValue> = {};
  if (isPlainObject(raw.features)) {
    for (const [key, value] of Object.entries(raw.features)) {
      if (typeof value === "boolean" || typeof value === "string" || typeof value === "number") {
        features[key] = value;
      }
      // Objects/arrays/null/undefined are ignored — that key stays "off".
    }
  }

  const meta = isPlainObject(raw.meta) ? (raw.meta as FlagsConfig["meta"]) : null;
  return { meta, features };
}

/** Boolean gate. Only a strict `true` enables a feature; everything else is off. */
export function isEnabled(features: Record<string, FlagValue>, key: string): boolean {
  return features[key] === true;
}

/**
 * Read a typed non-boolean flag (string/number). Returns the configured value
 * only when it matches the fallback's type; otherwise the fallback. Missing keys
 * and type mismatches both fall back — never throw, never return `undefined`.
 */
export function getValue<T extends FlagValue>(
  features: Record<string, FlagValue>,
  key: string,
  fallback: T,
): T {
  const value = features[key];
  return typeof value === typeof fallback ? (value as T) : fallback;
}
