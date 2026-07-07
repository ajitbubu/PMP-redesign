/** Flag values are plain JSON primitives — never objects, arrays, or null. */
export type FlagValue = boolean | string | number;

/** Non-sensitive descriptive metadata about a published config (never secrets). */
export interface FlagsMeta {
  tenant: string;
  environment: string;
  platform: string;
  appVersion: string;
  version: string;
  publishedAt: string;
  cdnUrl: string;
  etag: string;
}

/** The raw config document shape: descriptive `meta` + a flat `features` map. */
export interface FlagsConfig {
  meta: Partial<FlagsMeta> | null;
  features: Record<string, FlagValue>;
}

/**
 * The validated, in-app snapshot the provider/server hand to consumers. `etag`
 * drives conditional re-fetches; an empty `features` map means "everything off".
 */
export interface FlagsSnapshot {
  features: Record<string, FlagValue>;
  meta: Partial<FlagsMeta> | null;
  etag: string | null;
}
