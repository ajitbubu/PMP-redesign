import { describe, it, expect } from "vitest";
import { isEnabled, getValue, normalizeConfig, EMPTY_SNAPSHOT } from "./core";

describe("isEnabled", () => {
  const features = { "ucm.enable_cookie": true, "pia.enable_pia": false, "n.count": 5 };

  it("is true only for a strict boolean true", () => {
    expect(isEnabled(features, "ucm.enable_cookie")).toBe(true);
  });

  it("is false for a false flag", () => {
    expect(isEnabled(features, "pia.enable_pia")).toBe(false);
  });

  it("fails closed for a missing/unknown key", () => {
    expect(isEnabled(features, "does.not_exist")).toBe(false);
  });

  it("does not treat a truthy non-boolean (number) as enabled", () => {
    expect(isEnabled(features, "n.count")).toBe(false);
  });
});

describe("getValue", () => {
  const features = { "checkout.discountPercentage": 15, "ui.label": "beta" };

  it("returns the configured value when the type matches", () => {
    expect(getValue(features, "checkout.discountPercentage", 0)).toBe(15);
    expect(getValue(features, "ui.label", "default")).toBe("beta");
  });

  it("falls back for a missing key", () => {
    expect(getValue(features, "missing.key", 99)).toBe(99);
  });

  it("falls back when the stored type differs from the default", () => {
    // number stored, string default requested → fall back (never coerce)
    expect(getValue(features, "checkout.discountPercentage", "n/a")).toBe("n/a");
  });
});

describe("normalizeConfig", () => {
  it("keeps only primitive feature values and drops the rest", () => {
    const cfg = normalizeConfig({
      features: { a: true, b: "x", c: 3, bad: { nested: 1 }, arr: [1], nul: null },
    });
    expect(cfg.features).toEqual({ a: true, b: "x", c: 3 });
  });

  it("fails closed to empty features for malformed input", () => {
    expect(normalizeConfig(null).features).toEqual({});
    expect(normalizeConfig("nope").features).toEqual({});
    expect(normalizeConfig({ features: "not-an-object" }).features).toEqual({});
    expect(normalizeConfig({ nofeatures: true }).features).toEqual({});
  });
});

describe("EMPTY_SNAPSHOT", () => {
  it("disables every flag", () => {
    expect(isEnabled(EMPTY_SNAPSHOT.features, "ucm.enable_cookie")).toBe(false);
  });
});
