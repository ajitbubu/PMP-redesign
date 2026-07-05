import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Switch } from "./switch";

describe("Switch", () => {
  it("reflects the checked state and reports toggles", async () => {
    const onCheckedChange = vi.fn();
    const user = userEvent.setup();
    render(<Switch checked={false} onCheckedChange={onCheckedChange} aria-label="Notifications" />);

    const sw = screen.getByRole("switch", { name: "Notifications" });
    expect(sw).not.toBeChecked();
    await user.click(sw);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });
});
