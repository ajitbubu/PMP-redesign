import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Popover, PopoverTrigger, PopoverContent } from "./popover";

describe("Popover", () => {
  it("reveals its content only after the trigger is activated", async () => {
    const user = userEvent.setup();
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Panel</PopoverContent>
      </Popover>,
    );

    expect(screen.queryByText("Panel")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Open" }));
    expect(await screen.findByText("Panel")).toBeInTheDocument();
  });
});
