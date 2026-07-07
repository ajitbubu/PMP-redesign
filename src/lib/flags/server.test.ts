import { describe, it, expect, vi } from "vitest";
import { getServerFlags, isFeatureEnabled, requireFeature } from "./server";
import { FLAGS } from "./keys";

// notFound() throws in real Next; make it deterministic for the test.
vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
}));

describe("server flags (reads the bundled local config)", () => {
  it("reports declared critical-feature flags as enabled", async () => {
    const flags = await getServerFlags();
    expect(flags.isEnabled(FLAGS.UCM_ENABLE_CONSENT)).toBe(true);
    expect(flags.isEnabled(FLAGS.PIA_ENABLE_PIA)).toBe(true);
    expect(flags.isEnabled(FLAGS.PROFILE_ENABLE_PROFILE)).toBe(true);
  });

  it("fails closed for an unknown flag", async () => {
    expect(await isFeatureEnabled("does.not_exist")).toBe(false);
  });

  it("reads a numeric flag via getValue, falling back when absent", async () => {
    const flags = await getServerFlags();
    expect(flags.getValue(FLAGS.UCM_COOKIE_TTL_DAYS, 365)).toBe(180);
    expect(flags.getValue("missing.number", 42)).toBe(42);
  });

  it("requireFeature resolves when enabled and 404s when off/unknown", async () => {
    await expect(requireFeature(FLAGS.UCM_ENABLE_CONSENT)).resolves.toBeUndefined();
    await expect(requireFeature("nope.nope")).rejects.toThrow("NEXT_NOT_FOUND");
  });
});
