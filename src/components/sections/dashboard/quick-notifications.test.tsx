import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { QuickNotifications } from "./quick-notifications";
import { quickNotifications } from "@/lib/data/dashboard";

describe("QuickNotifications", () => {
  it("renders each notification's title and body", () => {
    render(<QuickNotifications />);
    for (const n of quickNotifications) {
      expect(screen.getByText(n.title)).toBeInTheDocument();
      expect(screen.getByText(n.body)).toBeInTheDocument();
    }
  });
});
