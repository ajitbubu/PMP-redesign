import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { EmptyState } from "./empty-state";

describe("EmptyState", () => {
  it("exposes its content as a live status region so filtering-to-zero is announced", () => {
    render(<EmptyState title="No consents found" description="Try clearing your filters." />);
    const status = screen.getByRole("status");
    expect(status).toHaveTextContent("No consents found");
    expect(status).toHaveTextContent("Try clearing your filters.");
  });
});
