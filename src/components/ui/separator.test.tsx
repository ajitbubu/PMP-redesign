import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Separator } from "./separator";

describe("Separator", () => {
  it("renders a horizontal separator by default", () => {
    render(<Separator />);
    expect(screen.getByRole("separator")).toHaveAttribute("aria-orientation", "horizontal");
  });

  it("supports a vertical orientation", () => {
    render(<Separator orientation="vertical" />);
    expect(screen.getByRole("separator")).toHaveAttribute("aria-orientation", "vertical");
  });
});
