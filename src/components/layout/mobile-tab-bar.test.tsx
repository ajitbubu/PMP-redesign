import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { navItems } from "@/lib/data/nav";
import { FlagsProvider } from "@/lib/flags/provider";
import type { FlagsSnapshot } from "@/lib/flags";
import { MobileTabBar } from "./mobile-tab-bar";

vi.mock("next/navigation", () => ({ usePathname: () => "/dashboard" }));

// Every flag a nav entry gates on, all enabled.
const allNavFlags = Object.fromEntries(
  navItems.filter((item) => item.flag).map((item) => [item.flag as string, true]),
);

function renderTabBar(features: Record<string, boolean> = allNavFlags) {
  const snapshot: FlagsSnapshot = { features, meta: null, etag: null };
  return render(
    <FlagsProvider initial={snapshot}>
      <MobileTabBar />
    </FlagsProvider>,
  );
}

beforeEach(() => {
  // The provider polls /api/flags on mount; keep it a clean no-op 304.
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => ({ ok: true, status: 304, json: async () => ({}) })),
  );
});
afterEach(() => vi.unstubAllGlobals());

describe("MobileTabBar", () => {
  it("renders a Primary nav with a link per enabled nav item", () => {
    renderTabBar();
    expect(screen.getByRole("navigation", { name: "Primary" })).toBeInTheDocument();
    for (const item of navItems) {
      expect(screen.getByRole("link", { name: item.label })).toBeInTheDocument();
    }
  });

  it("marks the active route with aria-current=page and leaves others unmarked", () => {
    renderTabBar();
    const active = navItems.find((i) => i.href === "/dashboard");
    if (active) {
      expect(screen.getByRole("link", { name: active.label })).toHaveAttribute(
        "aria-current",
        "page",
      );
    }
    const inactive = navItems.find(
      (i) => i.href !== "/dashboard" && !"/dashboard".startsWith(i.href + "/"),
    );
    if (inactive) {
      expect(screen.getByRole("link", { name: inactive.label })).not.toHaveAttribute(
        "aria-current",
      );
    }
  });

  it("hides nav entries whose feature flag is disabled (fail closed)", () => {
    renderTabBar({}); // no flags enabled
    expect(screen.getByRole("link", { name: "Dashboard" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Consent" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "PIA" })).not.toBeInTheDocument();
  });
});
