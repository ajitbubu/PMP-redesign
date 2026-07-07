/**
 * Server-side flag accessors for React Server Components and route handlers.
 *
 * Client show/hide is UX only. Any endpoint or server component that exposes
 * privileged data or actions MUST independently check (a) the feature is enabled
 * here AND (b) the user is authorized (session) — never trust the client's flag
 * state for access control.
 */
import { notFound } from "next/navigation";
import { loadFlags } from "./load-flags.server";
import { isEnabled, getValue } from "./core";
import type { FlagKey } from "./keys";
import type { FlagValue, FlagsSnapshot } from "./types";

export interface ServerFlags {
  snapshot: FlagsSnapshot;
  isEnabled: (key: FlagKey | string) => boolean;
  getValue: <T extends FlagValue>(key: FlagKey | string, fallback: T) => T;
}

export async function getServerFlags(): Promise<ServerFlags> {
  const snapshot = await loadFlags();
  return {
    snapshot,
    isEnabled: (key) => isEnabled(snapshot.features, key),
    getValue: (key, fallback) => getValue(snapshot.features, key, fallback),
  };
}

/** Convenience gate for route handlers: true only if the feature is enabled server-side. */
export async function isFeatureEnabled(key: FlagKey | string): Promise<boolean> {
  const flags = await getServerFlags();
  return flags.isEnabled(key);
}

/**
 * Server-enforced route gate: renders the 404 page when the feature is off.
 * Call at the top of a gated page/layout so the route is unreachable by direct
 * URL even though the nav entry is hidden — client hiding is UX, this is the
 * boundary. Fails closed (a missing/unknown flag 404s).
 */
export async function requireFeature(key: FlagKey | string): Promise<void> {
  if (!(await isFeatureEnabled(key))) {
    notFound();
  }
}
