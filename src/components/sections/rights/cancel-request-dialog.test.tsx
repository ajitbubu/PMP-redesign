import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CancelRequestDialog } from "./cancel-request-dialog";
import type { RightsRequest } from "@/lib/types";

const request = { id: "DPR-2024-001" } as unknown as RightsRequest;

describe("CancelRequestDialog", () => {
  it("shows the request id in the title when open", () => {
    render(
      <CancelRequestDialog request={request} open onOpenChange={vi.fn()} onConfirm={vi.fn()} />,
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Cancel Request DPR-2024-001?")).toBeInTheDocument();
  });

  it("renders nothing when closed", () => {
    render(
      <CancelRequestDialog
        request={request}
        open={false}
        onOpenChange={vi.fn()}
        onConfirm={vi.fn()}
      />,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("dismisses via Go Back without confirming", async () => {
    const onOpenChange = vi.fn();
    const onConfirm = vi.fn();
    const user = userEvent.setup();
    render(
      <CancelRequestDialog
        request={request}
        open
        onOpenChange={onOpenChange}
        onConfirm={onConfirm}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Go Back" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("confirms the withdrawal via Withdraw Request", async () => {
    const onConfirm = vi.fn();
    const user = userEvent.setup();
    render(
      <CancelRequestDialog request={request} open onOpenChange={vi.fn()} onConfirm={onConfirm} />,
    );
    await user.click(screen.getByRole("button", { name: "Withdraw Request" }));
    expect(onConfirm).toHaveBeenCalledOnce();
  });
});
