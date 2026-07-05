import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConsentGroupsList } from "./consent-groups-list";
import { consentGroups } from "@/lib/data/consents";

describe("ConsentGroupsList", () => {
  it("lists every consent group by name initially", () => {
    render(<ConsentGroupsList />);
    for (const group of consentGroups) {
      expect(screen.getByText(group.name)).toBeInTheDocument();
    }
  });

  it("filters the list by the search query", async () => {
    const first = consentGroups[0]!;
    const user = userEvent.setup();
    render(<ConsentGroupsList />);

    await user.type(screen.getByLabelText("Search groups"), first.name);
    expect(screen.getByText(first.name)).toBeInTheDocument();

    const other = consentGroups.find(
      (g) => !g.name.toLowerCase().includes(first.name.toLowerCase()),
    );
    if (other) expect(screen.queryByText(other.name)).not.toBeInTheDocument();
  });

  it("shows an empty state when nothing matches", async () => {
    const user = userEvent.setup();
    render(<ConsentGroupsList />);
    await user.type(screen.getByLabelText("Search groups"), "zzz-no-such-group-zzz");
    expect(screen.getByText("No groups found")).toBeInTheDocument();
  });
});
