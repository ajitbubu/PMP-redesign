import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrandLogo } from "./brand-logo";

describe("BrandLogo", () => {
  it("exposes an accessible name for the brand mark", () => {
    render(<BrandLogo />);
    expect(screen.getByRole("img", { name: "DataSafeguard" })).toBeInTheDocument();
  });
});
