import { describe, expect, it } from "vitest";
import { statusBadgeVariant } from "./ui-maps";

describe("statusBadgeVariant", () => {
  it.each([
    ["Completed", "success"],
    ["Active", "success"],
    ["ACTIVE", "success"],
    ["In Progress", "info"],
    ["Pending", "warning"],
    ["Expiring Soon", "warning"],
    ["Rejected", "destructive"],
    ["Expired", "destructive"],
    ["Withdrawn", "destructive"],
  ])("maps %s → %s", (status, variant) => {
    expect(statusBadgeVariant(status)).toBe(variant);
  });

  it("falls back to 'secondary' for an unknown status", () => {
    expect(statusBadgeVariant("Something Else")).toBe("secondary");
    expect(statusBadgeVariant("")).toBe("secondary");
  });
});
