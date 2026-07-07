import { describe, expect, it, vi } from "vitest";
import { isNavActive } from "./app-sidebar";
import { navItems, visibleNavItems } from "@/lib/data/nav";
import type { NavItem } from "@/lib/types";

// The module is a client component; stub the hook it imports so importing the
// pure `isNavActive` helper doesn't require a Next render context.
vi.mock("next/navigation", () => ({ usePathname: () => "/" }));

const item = (href: string, matches?: string[]) => ({ href, matches }) as NavItem;

describe("isNavActive", () => {
  it("is active on an exact path match", () => {
    expect(isNavActive(item("/consent"), "/consent")).toBe(true);
  });

  it("is active on a nested path under the item href", () => {
    expect(isNavActive(item("/consent"), "/consent/marketing")).toBe(true);
  });

  it("does not treat a sibling with a shared prefix as active", () => {
    expect(isNavActive(item("/consent"), "/consent-archive")).toBe(false);
  });

  it("is active when the pathname matches one of the extra `matches` entries", () => {
    expect(isNavActive(item("/preferences", ["/preferences/"]), "/preferences/email")).toBe(true);
  });

  it("is inactive for an unrelated path", () => {
    expect(isNavActive(item("/consent"), "/dashboard")).toBe(false);
  });
});

// The rail carries a single "DPAR" rights entry; DSAR is not surfaced but its
// route stays highlighted under DPAR via `matches`.
describe("navItems: single DPAR rights entry", () => {
  const dpar = navItems.find((i) => i.href === "/rights/dpar");

  it("registers DPAR and does not surface a separate DSAR entry", () => {
    expect(dpar?.label).toBe("DPAR");
    expect(navItems.some((i) => i.href === "/rights/dsar")).toBe(false);
  });

  it("highlights DPAR across the whole rights section, including DSAR routes", () => {
    expect(isNavActive(dpar!, "/rights/dpar")).toBe(true);
    expect(isNavActive(dpar!, "/rights/dpar/new")).toBe(true);
    expect(isNavActive(dpar!, "/rights/dsar")).toBe(true);
    expect(isNavActive(dpar!, "/rights/dsar/new")).toBe(true);
  });
});

// Feature-flag gating of nav entries. Dashboard is unflagged (always visible);
// Consent/Preferences/DPAR/PIA each require their flag.
describe("visibleNavItems", () => {
  it("keeps unflagged items and items whose flag is enabled", () => {
    const on = new Set(["ucm.enable_consent"]);
    const labels = visibleNavItems((flag) => on.has(flag)).map((i) => i.label);
    expect(labels).toContain("Dashboard"); // no flag → always visible
    expect(labels).toContain("Consent"); // flag enabled
    expect(labels).not.toContain("PIA"); // flag disabled
  });

  it("shows every entry when all flags are enabled", () => {
    expect(visibleNavItems(() => true)).toHaveLength(navItems.length);
  });

  it("hides all flagged entries when every flag is off (fail closed)", () => {
    expect(visibleNavItems(() => false).map((i) => i.label)).toEqual(["Dashboard"]);
  });
});
