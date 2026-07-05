import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PaginationBar } from "./pagination-bar";

describe("PaginationBar", () => {
  it("shows the current range and total", () => {
    render(<PaginationBar rangeStart={1} rangeEnd={10} total={42} />);
    expect(screen.getByText("1-10")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("disables First/Previous on the first page and marks the current page", () => {
    render(<PaginationBar rangeStart={1} rangeEnd={10} total={42} />);
    expect(screen.getByRole("button", { name: "First page" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Previous page" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next page" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "1" })).toHaveAttribute("aria-current", "page");
  });

  it("exposes a labelled pagination landmark", () => {
    render(<PaginationBar rangeStart={1} rangeEnd={10} total={42} />);
    expect(screen.getByRole("navigation", { name: "Pagination" })).toBeInTheDocument();
  });
});
