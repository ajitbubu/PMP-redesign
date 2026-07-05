import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PrivacySearch } from "./privacy-search";
import { searchSuggestions } from "@/lib/data/dashboard";

describe("PrivacySearch", () => {
  it("has a labelled search field and a named search button", () => {
    render(<PrivacySearch />);
    expect(screen.getByLabelText("Search your privacy rights")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Search" })).toBeInTheDocument();
  });

  it("updates the field as the user types", async () => {
    const user = userEvent.setup();
    render(<PrivacySearch />);
    const input = screen.getByLabelText("Search your privacy rights");
    await user.type(input, "delete my data");
    expect(input).toHaveValue("delete my data");
  });

  it("fills the field when a suggestion chip is clicked", async () => {
    const suggestion = searchSuggestions[0]!;
    const user = userEvent.setup();
    render(<PrivacySearch />);
    await user.click(screen.getByRole("button", { name: suggestion }));
    expect(screen.getByLabelText("Search your privacy rights")).toHaveValue(suggestion);
  });
});
