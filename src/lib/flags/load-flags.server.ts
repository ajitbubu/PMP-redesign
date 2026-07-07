/**
 * Server-only flag loader. Fetches the published config from the CDN (or reads
 * the bundled local file), validates it, and caches it per Cache-Control. Import
 * ONLY from server code — it reads server env vars and does the outbound fetch.
 *
 * Fail-closed everywhere: HTTPS is required, payloads are validated, and any
 * error returns the last-known-good snapshot or `EMPTY_SNAPSHOT` (all off).
 */
import { EMPTY_SNAPSHOT, normalizeConfig } from "./core";
import { getFlagsSource } from "./config";
import type { FlagsSnapshot } from "./types";
// Temporary local config until a real CDN is wired up (set FLAGS_CDN_BASE etc).
import localConfig from "./flags.local.json";

const DEFAULT_TTL_MS = 60_000;
const MIN_TTL_MS = 10_000;
const MAX_TTL_MS = 60 * 60_000;

// Per-instance cache so we honor Cache-Control and can send If-None-Match.
let cache: { snapshot: FlagsSnapshot; expiresAt: number } | null = null;

function toSnapshot(raw: unknown, headerEtag: string | null): FlagsSnapshot {
  const { features, meta } = normalizeConfig(raw);
  return { features, meta, etag: headerEtag ?? meta?.etag ?? null };
}

function ttlFromCacheControl(res: Response): number {
  const match = res.headers.get("cache-control")?.match(/max-age=(\d+)/i);
  const maxAge = match?.[1] ? Number(match[1]) * 1000 : DEFAULT_TTL_MS;
  return Math.min(Math.max(maxAge, MIN_TTL_MS), MAX_TTL_MS);
}

export async function loadFlags(): Promise<FlagsSnapshot> {
  const source = getFlagsSource();

  if (source.mode === "local") {
    return toSnapshot(localConfig, null);
  }

  // Serve cached config while Cache-Control says it's still fresh.
  if (cache && cache.expiresAt > Date.now()) return cache.snapshot;

  try {
    // HTTPS only — a plaintext config URL is a downgrade/tampering risk.
    if (!source.url.startsWith("https://")) {
      throw new Error("Flags config URL must use HTTPS");
    }

    const res = await fetch(source.url, {
      // Conditional GET: revalidate against the stored ETag.
      headers: cache?.snapshot.etag ? { "If-None-Match": cache.snapshot.etag } : {},
      // We manage freshness ourselves via the cache + Cache-Control below.
      cache: "no-store",
    });

    if (res.status === 304 && cache) {
      cache = { snapshot: cache.snapshot, expiresAt: Date.now() + ttlFromCacheControl(res) };
      return cache.snapshot;
    }
    if (!res.ok) throw new Error(`Flags fetch failed: HTTP ${res.status}`);

    const snapshot = toSnapshot(await res.json(), res.headers.get("etag"));
    cache = { snapshot, expiresAt: Date.now() + ttlFromCacheControl(res) };
    return snapshot;
  } catch (error) {
    console.error("[flags] load failed — failing closed:", error);
    // Last-known-good if we ever loaded successfully; otherwise everything off.
    return cache?.snapshot ?? EMPTY_SNAPSHOT;
  }
}
