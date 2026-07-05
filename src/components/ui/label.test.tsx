import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Label } from "./label";

describe("Label", () => {
  it("associates with a control via htmlFor", () => {
    render(
      <>
        <Label htmlFor="email">Email</Label>
        <input id="email" />
      </>,
    );
    expect(screen.getByLabelText("Email")).toBe(screen.getByRole("textbox"));
  });
});
