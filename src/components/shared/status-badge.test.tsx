import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusBadge } from "./status-badge";

describe("StatusBadge", () => {
  it("renders the status label as visible text (meaning is not colour-only)", () => {
    render(<StatusBadge status="In Progress" />);
    expect(screen.getByText("In Progress")).toBeInTheDocument();
  });

  it("renders any status string passed to it", () => {
    render(<StatusBadge status="Withdrawn" />);
    expect(screen.getByText("Withdrawn")).toBeInTheDocument();
  });
});
