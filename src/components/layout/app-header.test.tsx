import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { currentUser } from "@/lib/data/nav";
import { AppHeader } from "./app-header";

// AppHeader embeds UserMenu (useRouter) and NotificationBell.
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => "/dashboard",
}));

describe("AppHeader", () => {
  it("renders a banner landmark with the greeting and portal name", () => {
    render(<AppHeader />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`Welcome Back, ${currentUser.firstName}`))).toBeInTheDocument();
    expect(screen.getByText("Privacy Management Portal")).toBeInTheDocument();
  });
});
