import { describe, expect, it } from "vitest";
import { cn, formatDate, maskValue } from "./utils";

describe("cn", () => {
  it("joins truthy class names and drops falsy ones", () => {
    expect(cn("a", false && "b", null, undefined, "c")).toBe("a c");
  });

  it("resolves conflicting Tailwind utilities, last one wins", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
    expect(cn("text-sm text-foreground", "text-lg")).toBe("text-foreground text-lg");
  });
});

describe("formatDate", () => {
  it("formats a valid date as DD Mon YYYY (en-GB)", () => {
    expect(formatDate("2026-07-04")).toMatch(/^\d{2} [A-Za-z]{3} \d{4}$/);
  });

  it("returns the input unchanged when it is not a parseable date", () => {
    expect(formatDate("not-a-date")).toBe("not-a-date");
    expect(formatDate("")).toBe("");
  });
});

describe("maskValue", () => {
  it("returns the value unchanged when it is not longer than the visible count", () => {
    expect(maskValue("ab")).toBe("ab");
    expect(maskValue("abcd")).toBe("abcd");
  });

  it("masks all but the last `visible` characters (default 4)", () => {
    expect(maskValue("abcde")).toBe("•bcde");
    expect(maskValue("jane@example.com")).toBe("••••••••••••.com");
  });

  it("honours a custom visible count", () => {
    expect(maskValue("secret", 2)).toBe("••••et");
  });
});
