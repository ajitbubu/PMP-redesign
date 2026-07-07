import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConsentDetail } from "./consent-detail";
import { getConsentRecords } from "@/lib/data/consents";

const records = getConsentRecords("loan-issuance");
const active = records.find((r) => r.state === "Active")!;

describe("ConsentDetail", () => {
  it("renders a row per record with its name and description", () => {
    render(<ConsentDetail groupName="Loan Issuance" records={records} />);
    const first = records[0]!;
    expect(screen.getByText(first.name)).toBeInTheDocument();
    expect(screen.getByText(first.description)).toBeInTheDocument();
  });

  it("expands and collapses a row's preferences on the Preferences toggle", async () => {
    const user = userEvent.setup();
    render(<ConsentDetail groupName="Loan Issuance" records={records} />);

    expect(screen.queryByText("Email alerts")).not.toBeInTheDocument();

    const [prefButton] = screen.getAllByRole("button", { name: "Preferences" });
    await user.click(prefButton!);

    expect(screen.getByText("Email alerts")).toBeInTheDocument();
    expect(screen.getByText("SMS channel")).toBeInTheDocument();
    expect(screen.getByText("Push notification")).toBeInTheDocument();
    expect(screen.getAllByText(/Last updated:/).length).toBeGreaterThan(0);

    await user.click(prefButton!);
    expect(screen.queryByText("Email alerts")).not.toBeInTheDocument();
  });

  it("filters rows by category and shows an empty state that clears", async () => {
    const user = userEvent.setup();
    render(<ConsentDetail groupName="Loan Issuance" records={records} />);

    await user.type(screen.getByLabelText("Search consents"), "zzz-no-match-zzz");
    expect(screen.getByText("No Consents Found")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Clear Filters" }));
    expect(screen.queryByText("No Consents Found")).not.toBeInTheDocument();
  });
});

describe("ConsentDetail — legal consent withdrawal flow", () => {
  it("opens the confirmation modal with the Opt-In → Opt-Out change on toggle", async () => {
    const user = userEvent.setup();
    render(<ConsentDetail groupName="Loan Issuance" records={records} />);

    await user.click(screen.getByRole("switch", { name: `Toggle ${active.name}` }));

    expect(await screen.findByText("Consent Update Required")).toBeInTheDocument();
    expect(screen.getByText(/Reason for withdrawal/)).toBeInTheDocument();
    expect(screen.getByText("Opt-In")).toBeInTheDocument();
    expect(screen.getByText("Opt-Out")).toBeInTheDocument();
  });

  it("cancelling leaves the permission unchanged and the toggle enabled", async () => {
    const user = userEvent.setup();
    render(<ConsentDetail groupName="Loan Issuance" records={records} />);
    const toggle = screen.getByRole("switch", { name: `Toggle ${active.name}` });
    expect(toggle).toBeChecked();

    await user.click(toggle);
    await user.click(await screen.findByRole("button", { name: "Cancel" }));

    await waitFor(() =>
      expect(screen.queryByText("Consent Update Required")).not.toBeInTheDocument(),
    );
    expect(screen.getByRole("switch", { name: `Toggle ${active.name}` })).toBeChecked();
    expect(screen.getByRole("switch", { name: `Toggle ${active.name}` })).not.toBeDisabled();
  });

  it("confirming applies the change, locks the toggle, and records an audit entry", async () => {
    const user = userEvent.setup();
    render(<ConsentDetail groupName="Loan Issuance" records={records} />);

    await user.click(screen.getByRole("switch", { name: `Toggle ${active.name}` }));
    await user.type(
      await screen.findByLabelText(/Reason for withdrawal/),
      "No longer required",
    );
    await user.click(screen.getByRole("button", { name: "Confirm" }));

    await waitFor(() =>
      expect(screen.queryByText("Consent Update Required")).not.toBeInTheDocument(),
    );

    // Toggle is locked during the cooldown.
    expect(screen.getByRole("switch", { name: `Toggle ${active.name}` })).toBeDisabled();

    // The new version + reason appear in the audit log.
    await user.click(screen.getAllByRole("button", { name: "Audit Log" })[0]!);
    expect(await screen.findByText(/Consent Withdrawn/)).toBeInTheDocument();
    expect(screen.getByText("No longer required")).toBeInTheDocument();
  });
});
