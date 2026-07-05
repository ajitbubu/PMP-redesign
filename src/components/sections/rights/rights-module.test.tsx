import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RightsModule } from "./rights-module";
import { getRightsModule } from "@/lib/data/rights";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  usePathname: () => "/rights/dpar",
  useSearchParams: () => new URLSearchParams(),
}));

const config = getRightsModule("dpar");

// The table (lg) and card list (mobile) both render in jsdom, so action
// buttons are duplicated; pick the enabled ones.
function enabledButtons(name: string) {
  return screen
    .getAllByRole("button", { name })
    .filter((b) => !(b as HTMLButtonElement).disabled);
}

describe("RightsModule", () => {
  it("marks the active segment with aria-current", () => {
    render(<RightsModule kind="dpar" />);
    expect(screen.getByRole("link", { name: "DPAR" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "DSAR" })).not.toHaveAttribute("aria-current");
  });

  it("filters the request list by the search query", async () => {
    const user = userEvent.setup();
    render(<RightsModule kind="dpar" />);
    const target = config.requests[0]!;
    const other = config.requests.find(
      (r) => r.id !== target.id && !r.id.toLowerCase().includes(target.id.toLowerCase()),
    );

    await user.type(screen.getByLabelText("Search requests"), target.id);
    expect(screen.getAllByText(target.id).length).toBeGreaterThan(0);
    if (other) expect(screen.queryAllByText(other.id)).toHaveLength(0);
  });

  it("shows an empty state and recovers via Clear search", async () => {
    const user = userEvent.setup();
    render(<RightsModule kind="dpar" />);
    await user.type(screen.getByLabelText("Search requests"), "zzz-no-match-zzz");
    expect(screen.getByText("No requests found")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Clear search" }));
    expect(screen.queryByText("No requests found")).not.toBeInTheDocument();
  });

  it("emails a report and announces it via a status toast", async () => {
    const completed = config.requests.find((r) => r.status === "Completed");
    if (!completed) return;
    const user = userEvent.setup();
    render(<RightsModule kind="dpar" />);

    const [emailBtn] = enabledButtons("Email Report");
    expect(emailBtn).toBeDefined();
    await user.click(emailBtn!);

    const toast = await screen.findByRole("status");
    expect(toast).toHaveTextContent("Report Successfully Emailed");
  });

  it("opens the cancel dialog for an in-flight request", async () => {
    const inflight = config.requests.find(
      (r) => r.status !== "Completed" && r.status !== "Rejected",
    );
    if (!inflight) return;
    const user = userEvent.setup();
    render(<RightsModule kind="dpar" />);

    const [cancelBtn] = enabledButtons("Cancel");
    expect(cancelBtn).toBeDefined();
    await user.click(cancelBtn!);
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
  });
});
