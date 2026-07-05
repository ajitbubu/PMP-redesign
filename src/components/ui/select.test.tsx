import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./select";

describe("Select", () => {
  it("renders an accessible combobox trigger", () => {
    render(
      <Select defaultValue="b">
        <SelectTrigger aria-label="Fruit">
          <SelectValue placeholder="Pick one" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">Apple</SelectItem>
          <SelectItem value="b">Banana</SelectItem>
        </SelectContent>
      </Select>,
    );
    expect(screen.getByRole("combobox", { name: "Fruit" })).toBeInTheDocument();
  });
});
