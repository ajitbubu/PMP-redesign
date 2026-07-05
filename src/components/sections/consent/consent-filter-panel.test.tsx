import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConsentFilterPanel, defaultConsentPanelFilters } from "./consent-filter-panel";

describe("ConsentFilterPanel", () => {
  it("renders a labelled group per filter dimension", () => {
    render(
      <ConsentFilterPanel
        filters={defaultConsentPanelFilters}
        onChange={vi.fn()}
        onReset={vi.fn()}
      />,
    );
    for (const legend of ["Status", "Purpose", "Consent State", "Preference"]) {
      expect(screen.getByText(legend)).toBeInTheDocument();
    }
  });

  it("emits the updated filter set when a chip is selected", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <ConsentFilterPanel filters={defaultConsentPanelFilters} onChange={onChange} onReset={vi.fn()} />,
    );
    await user.click(screen.getByRole("button", { name: "Active" }));
    expect(onChange).toHaveBeenCalledWith({ ...defaultConsentPanelFilters, status: "Active" });
  });

  it("marks the selected option as pressed", () => {
    render(
      <ConsentFilterPanel
        filters={{ ...defaultConsentPanelFilters, purpose: "Legal Obligation" }}
        onChange={vi.fn()}
        onReset={vi.fn()}
      />,
    );
    expect(screen.getByRole("button", { name: "Legal Obligation" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("calls onReset when Reset is clicked", async () => {
    const user = userEvent.setup();
    const onReset = vi.fn();
    render(
      <ConsentFilterPanel filters={defaultConsentPanelFilters} onChange={vi.fn()} onReset={onReset} />,
    );
    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(onReset).toHaveBeenCalledOnce();
  });
});
