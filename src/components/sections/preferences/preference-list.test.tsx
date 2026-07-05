import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PreferenceList } from "./preference-list";
import { preferenceChannels } from "@/lib/data/preferences";

describe("PreferenceList", () => {
  it("lists every preference channel initially", () => {
    render(<PreferenceList />);
    for (const channel of preferenceChannels) {
      expect(screen.getByText(channel.name)).toBeInTheDocument();
    }
  });

  it("filters channels by the query", async () => {
    const first = preferenceChannels[0]!;
    const user = userEvent.setup();
    render(<PreferenceList />);

    await user.type(screen.getByLabelText("Filter groups"), first.name);
    expect(screen.getByText(first.name)).toBeInTheDocument();

    const other = preferenceChannels.find(
      (c) => !c.name.toLowerCase().includes(first.name.toLowerCase()),
    );
    if (other) expect(screen.queryByText(other.name)).not.toBeInTheDocument();
  });

  it("shows an empty state when nothing matches", async () => {
    const user = userEvent.setup();
    render(<PreferenceList />);
    await user.type(screen.getByLabelText("Filter groups"), "zzz-nope-zzz");
    expect(screen.getByText("No Groups Found")).toBeInTheDocument();
  });
});
