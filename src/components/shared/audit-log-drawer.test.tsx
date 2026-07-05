import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuditLogDrawer } from "./audit-log-drawer";

describe("AuditLogDrawer", () => {
  it("shows the audit log titled by the item when open", () => {
    render(<AuditLogDrawer open onOpenChange={vi.fn()} itemName="Marketing consent" />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Audit Log")).toBeInTheDocument();
    expect(screen.getByText("Marketing consent")).toBeInTheDocument();
  });

  it("renders nothing when closed", () => {
    render(<AuditLogDrawer open={false} onOpenChange={vi.fn()} itemName="Marketing consent" />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes via the footer Close button", async () => {
    const onOpenChange = vi.fn();
    const user = userEvent.setup();
    render(<AuditLogDrawer open onOpenChange={onOpenChange} itemName="Marketing consent" />);
    // Both the sheet's built-in ✕ and the footer button are named "Close";
    // the footer button is the last one.
    const closeButtons = screen.getAllByRole("button", { name: "Close" });
    await user.click(closeButtons[closeButtons.length - 1]!);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
