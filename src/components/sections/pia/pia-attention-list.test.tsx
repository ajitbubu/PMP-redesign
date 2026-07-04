import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PiaAttentionList } from "./pia-attention-list";
import { piaAttention } from "@/lib/data/pia";

describe("PiaAttentionList", () => {
  it("exposes each item's completion as a labelled progressbar with numeric bounds", () => {
    render(<PiaAttentionList />);
    const bars = screen.getAllByRole("progressbar");
    expect(bars).toHaveLength(piaAttention.length);

    piaAttention.forEach((item, i) => {
      expect(bars[i]).toHaveAttribute("aria-valuenow", String(item.progress));
      expect(bars[i]).toHaveAttribute("aria-valuemin", "0");
      expect(bars[i]).toHaveAttribute("aria-valuemax", "100");
      expect(bars[i]).toHaveAccessibleName(`${item.name} progress`);
    });
  });
});
