import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "./button";

describe("Button", () => {
  it("renders a native button with its label by default", () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole("button", { name: "Save" }).tagName).toBe("BUTTON");
  });

  it("applies variant and size classes", () => {
    render(
      <Button variant="destructive" size="lg">
        Delete
      </Button>,
    );
    const btn = screen.getByRole("button", { name: "Delete" });
    expect(btn.className).toMatch(/bg-destructive/);
    expect(btn.className).toMatch(/h-12/);
  });

  it("renders as its child element when asChild is set", () => {
    render(
      <Button asChild>
        <a href="/next">Go</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Go" });
    expect(link).toHaveAttribute("href", "/next");
    expect(link).toHaveAttribute("data-slot", "button");
  });

  it("is disabled when the disabled prop is set", () => {
    render(<Button disabled>Nope</Button>);
    expect(screen.getByRole("button", { name: "Nope" })).toBeDisabled();
  });
});
