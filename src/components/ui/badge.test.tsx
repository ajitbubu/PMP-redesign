import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "./badge";

describe("Badge", () => {
  it("renders its content in a span by default", () => {
    render(<Badge>New</Badge>);
    const el = screen.getByText("New");
    expect(el.tagName).toBe("SPAN");
    expect(el).toHaveAttribute("data-slot", "badge");
  });

  it("applies the variant styling", () => {
    render(<Badge variant="success">Active</Badge>);
    expect(screen.getByText("Active").className).toMatch(/bg-green-100/);
  });

  it("renders as its child element when asChild is set", () => {
    render(
      <Badge asChild>
        <a href="/x">Link</a>
      </Badge>,
    );
    expect(screen.getByRole("link", { name: "Link" })).toHaveAttribute("data-slot", "badge");
  });
});
