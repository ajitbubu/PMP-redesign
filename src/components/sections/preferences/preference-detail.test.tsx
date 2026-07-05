import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PreferenceDetail } from "./preference-detail";
import type { PreferenceRecord } from "@/lib/types";

const records = [
  { id: "p1", group: "Marketing", purpose: "Promotions", status: "Active", expiry: "2026-12-01" },
  { id: "p2", group: "Billing", purpose: "Invoices", status: "Expired", expiry: "2025-01-01" },
] as unknown as PreferenceRecord[];

const renderDetail = () =>
  render(<PreferenceDetail channelName="Email" records={records} />);

describe("PreferenceDetail", () => {
  it("lists the preference groups", () => {
    renderDetail();
    expect(screen.getAllByText("Marketing").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Billing").length).toBeGreaterThan(0);
  });

  it("filters records by the search query", async () => {
    const user = userEvent.setup();
    renderDetail();
    await user.type(screen.getByLabelText("Search Email preferences"), "Marketing");
    expect(screen.getAllByText("Marketing").length).toBeGreaterThan(0);
    expect(screen.queryByText("Billing")).not.toBeInTheDocument();
  });

  it("shows an empty state and recovers via Clear Filters", async () => {
    const user = userEvent.setup();
    renderDetail();
    await user.type(screen.getByLabelText("Search Email preferences"), "zzz-none-zzz");
    expect(screen.getByText("No Preferences Found")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Clear Filters" }));
    expect(screen.queryByText("No Preferences Found")).not.toBeInTheDocument();
  });

  it("expands a row to reveal its legal detail and toggle", async () => {
    const user = userEvent.setup();
    renderDetail();
    const [viewAll] = screen.getAllByRole("button", { name: /View All Consents/ });
    await user.click(viewAll!);
    expect(screen.getAllByText(/Detailed legal text for Marketing/i).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("switch", { name: "Toggle Marketing" }).length).toBeGreaterThan(0);
  });

  it("opens the audit-log drawer for a record", async () => {
    const user = userEvent.setup();
    renderDetail();
    const [auditBtn] = screen.getAllByRole("button", { name: "Audit Log" });
    await user.click(auditBtn!);
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
  });
});
