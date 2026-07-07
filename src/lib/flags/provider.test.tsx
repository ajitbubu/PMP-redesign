import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { FlagsProvider, useFlags, useFlag, Flag } from "./provider";
import { FLAGS } from "./keys";

function Probe() {
  const { loaded } = useFlags();
  const on = useFlag(FLAGS.UCM_ENABLE_COOKIE);
  return (
    <div>
      <span>{on ? "ON" : "OFF"}</span>
      <span data-testid="loaded">{loaded ? "loaded" : "loading"}</span>
      <Flag name={FLAGS.UCM_ENABLE_COOKIE}>
        <span>gated-content</span>
      </Flag>
    </div>
  );
}

// A large poll interval keeps the periodic re-fetch from firing mid-test; only
// the initial refresh() runs.
const NO_POLL = 10 * 60_000;

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("FlagsProvider", () => {
  it("enables a feature once the config reports it on (isEnabled works)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        status: 200,
        json: async () => ({ features: { [FLAGS.UCM_ENABLE_COOKIE]: true }, etag: null }),
      })),
    );

    render(
      <FlagsProvider pollMs={NO_POLL}>
        <Probe />
      </FlagsProvider>,
    );

    expect(await screen.findByText("gated-content")).toBeInTheDocument();
    expect(screen.getByText("ON")).toBeInTheDocument();
  });

  it("fails closed (feature OFF) when the config fetch fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("network down");
      }),
    );

    render(
      <FlagsProvider pollMs={NO_POLL}>
        <Probe />
      </FlagsProvider>,
    );

    // It resolves to "loaded" but stays fail-closed.
    await waitFor(() => expect(screen.getByTestId("loaded")).toHaveTextContent("loaded"));
    expect(screen.getByText("OFF")).toBeInTheDocument();
    expect(screen.queryByText("gated-content")).not.toBeInTheDocument();
  });

  it("renders gated UI immediately when seeded with an enabled snapshot (no flash)", () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({ ok: true, status: 304, json: async () => ({}) })),
    );

    render(
      <FlagsProvider
        pollMs={NO_POLL}
        initial={{ features: { [FLAGS.UCM_ENABLE_COOKIE]: true }, meta: null, etag: null }}
      >
        <Probe />
      </FlagsProvider>,
    );

    // Present on the very first render — no loading gate, no flash.
    expect(screen.getByText("gated-content")).toBeInTheDocument();
    expect(screen.getByText("ON")).toBeInTheDocument();
  });
});
