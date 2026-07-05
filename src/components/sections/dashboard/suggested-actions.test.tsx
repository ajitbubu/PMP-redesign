import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SuggestedActions } from "./suggested-actions";
import { suggestedActions } from "@/lib/data/dashboard";

describe("SuggestedActions", () => {
  it("renders one link per suggested action, each showing its title", () => {
    render(<SuggestedActions />);
    expect(screen.getAllByRole("link")).toHaveLength(suggestedActions.length);
    for (const action of suggestedActions) {
      expect(screen.getByText(action.title)).toBeInTheDocument();
    }
  });
});
