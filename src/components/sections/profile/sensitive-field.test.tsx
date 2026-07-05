import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SensitiveField } from "./sensitive-field";

describe("SensitiveField", () => {
  it("names the show/hide toggle with the field label so multiple fields are distinguishable", () => {
    render(<SensitiveField label="Email" value="jane@example.com" />);
    expect(screen.getByRole("button", { name: "Show Email" })).toBeInTheDocument();
  });

  it("keeps the value out of the accessibility tree until revealed, then toggles back", async () => {
    const user = userEvent.setup();
    render(<SensitiveField label="Email" value="jane@example.com" />);

    // Hidden: the full value is not rendered; an sr-only marker stands in for AT.
    expect(screen.queryByText("jane@example.com")).not.toBeInTheDocument();
    expect(screen.getByText("Email hidden")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Show Email" }));
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();

    const hideButton = screen.getByRole("button", { name: "Hide Email" });
    await user.click(hideButton);
    expect(screen.queryByText("jane@example.com")).not.toBeInTheDocument();
  });
});
