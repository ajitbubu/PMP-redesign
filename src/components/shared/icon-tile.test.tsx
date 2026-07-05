import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Bell } from "lucide-react";
import { IconTile } from "./icon-tile";

describe("IconTile", () => {
  it("hides the decorative tile from assistive tech (solid accent)", () => {
    const { container } = render(<IconTile icon={Bell} accent="info" />);
    const tile = container.querySelector('[aria-hidden="true"]');
    expect(tile).toBeInTheDocument();
    expect(tile?.className).toMatch(/bg-primary/);
  });

  it("applies the soft accent variant when requested", () => {
    const { container } = render(<IconTile icon={Bell} accent="success" soft />);
    expect(container.querySelector('[aria-hidden="true"]')?.className).toMatch(/bg-green-100/);
  });
});
