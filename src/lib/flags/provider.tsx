"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  EMPTY_SNAPSHOT,
  getValue as coreGetValue,
  isEnabled as coreIsEnabled,
  normalizeConfig,
} from "./core";
import { getPollMs } from "./config";
import type { FlagKey } from "./keys";
import type { FlagValue, FlagsSnapshot } from "./types";

interface FlagsContextValue {
  snapshot: FlagsSnapshot;
  /** True once an initial value is known (from the server seed or first fetch). */
  loaded: boolean;
  isEnabled: (key: FlagKey | string) => boolean;
  getValue: <T extends FlagValue>(key: FlagKey | string, fallback: T) => T;
}

const FlagsContext = createContext<FlagsContextValue | null>(null);

/**
 * Provides feature flags to the client tree. Seed it with the server-loaded
 * `initial` snapshot so gated UI renders correctly on first paint (no flash),
 * then it polls `/api/flags` on an interval so kill-switches propagate.
 */
export function FlagsProvider({
  initial,
  pollMs,
  children,
}: {
  initial?: FlagsSnapshot;
  pollMs?: number;
  children: ReactNode;
}) {
  const [snapshot, setSnapshot] = useState<FlagsSnapshot>(initial ?? EMPTY_SNAPSHOT);
  const [loaded, setLoaded] = useState<boolean>(Boolean(initial));
  const loadedRef = useRef<boolean>(Boolean(initial));
  const etagRef = useRef<string | null>(initial?.etag ?? null);
  const interval = pollMs ?? getPollMs();

  useEffect(() => {
    let active = true;

    async function refresh() {
      try {
        const res = await fetch("/api/flags", {
          cache: "no-store",
          headers: etagRef.current ? { "If-None-Match": etagRef.current } : {},
        });
        if (!active) return;
        if (res.status === 304) {
          loadedRef.current = true;
          setLoaded(true);
          return;
        }
        if (!res.ok) throw new Error(`flags HTTP ${res.status}`);

        // Re-validate on the client too — never trust the payload shape.
        const body: unknown = await res.json();
        const { features, meta } = normalizeConfig(body);
        const bodyEtag =
          typeof (body as { etag?: unknown })?.etag === "string"
            ? (body as { etag: string }).etag
            : (meta?.etag ?? null);

        etagRef.current = bodyEtag;
        loadedRef.current = true;
        setSnapshot({ features, meta, etag: bodyEtag });
        setLoaded(true);
      } catch (error) {
        if (!active) return;
        console.error("[flags] refresh failed:", error);
        // Fail closed only if we never had a good snapshot; otherwise keep the
        // last-known-good so a transient network blip doesn't flap features.
        if (!loadedRef.current) setSnapshot(EMPTY_SNAPSHOT);
        loadedRef.current = true;
        setLoaded(true);
      }
    }

    refresh();
    const id = setInterval(refresh, interval);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, [interval]);

  const value = useMemo<FlagsContextValue>(
    () => ({
      snapshot,
      loaded,
      isEnabled: (key) => coreIsEnabled(snapshot.features, key),
      getValue: <T extends FlagValue>(key: FlagKey | string, fallback: T): T =>
        coreGetValue(snapshot.features, key, fallback),
    }),
    [snapshot, loaded],
  );

  return <FlagsContext.Provider value={value}>{children}</FlagsContext.Provider>;
}

/**
 * Access flags in a client component. If no provider is mounted (e.g. an
 * isolated unit test), returns a fail-closed value: every flag reads off.
 */
export function useFlags(): FlagsContextValue {
  const ctx = useContext(FlagsContext);
  if (!ctx) {
    return {
      snapshot: EMPTY_SNAPSHOT,
      loaded: false,
      isEnabled: () => false,
      getValue: (_key, fallback) => fallback,
    };
  }
  return ctx;
}

/** Boolean convenience hook. */
export function useFlag(key: FlagKey | string): boolean {
  return useFlags().isEnabled(key);
}

/**
 * Declarative gate: renders `children` only when the flag is enabled, else
 * `fallback` (nothing by default). Hidden while flags are still loading, so
 * gated UI never flashes.
 */
export function Flag({
  name,
  children,
  fallback = null,
}: {
  name: FlagKey | string;
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return <>{useFlag(name) ? children : fallback}</>;
}
