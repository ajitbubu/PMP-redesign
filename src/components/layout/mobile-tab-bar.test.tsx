import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { navItems } from "@/lib/data/nav";
import { MobileTabBar } from "./mobile-tab-bar";

vi.mock("next/navigation", () => ({ usePathname: () => "/dashboard" }));

describe("MobileTabBar", () => {
  it("renders a Primary nav with a link per nav item", () => {
    render(<MobileTabBar />);
    expect(screen.getByRole("navigation", { name: "Primary" })).toBeInTheDocument();
    for (const item of navItems) {
      expect(screen.getByRole("link", { name: item.label })).toBeInTheDocument();
    }
  });

  it("marks the active route with aria-current=page and leaves others unmarked", () => {
    render(<MobileTabBar />);
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
});
