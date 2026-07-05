import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DataSafeguardWordmark, PoweredByDataSafeguard } from "./datasafeguard-wordmark";

describe("DataSafeguard wordmark", () => {
  it("renders the wordmark as real text", () => {
    render(<DataSafeguardWordmark />);
    expect(screen.getByText("data")).toBeInTheDocument();
    expect(screen.getByText("safeguard")).toBeInTheDocument();
  });

  it("renders the 'Powered by' credit with the wordmark", () => {
    render(<PoweredByDataSafeguard />);
    expect(screen.getByText("Powered by")).toBeInTheDocument();
    expect(screen.getByText("data")).toBeInTheDocument();
  });
});
