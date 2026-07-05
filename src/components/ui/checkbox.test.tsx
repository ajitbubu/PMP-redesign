import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Checkbox } from "./checkbox";

describe("Checkbox", () => {
  it("reports toggles through onCheckedChange", async () => {
    const onCheckedChange = vi.fn();
    const user = userEvent.setup();
    render(<Checkbox aria-label="Accept" checked={false} onCheckedChange={onCheckedChange} />);

    const box = screen.getByRole("checkbox", { name: "Accept" });
    expect(box).not.toBeChecked();
    await user.click(box);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });
});
