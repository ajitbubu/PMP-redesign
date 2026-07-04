import { describe, expect, it, vi } from "vitest";
import { isNavActive } from "./app-sidebar";
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
    expect(isNavActive(item("/rights/dpar", ["/rights/dsar"]), "/rights/dsar/new")).toBe(true);
  });

  it("is inactive for an unrelated path", () => {
    expect(isNavActive(item("/consent"), "/dashboard")).toBe(false);
  });
});
