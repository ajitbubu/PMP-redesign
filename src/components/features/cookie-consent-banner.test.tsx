import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { CookieConsentBanner } from "./cookie-consent-banner";
import { FlagsProvider } from "@/lib/flags/provider";
import { FLAGS } from "@/lib/flags/keys";
import type { FlagsSnapshot } from "@/lib/flags/types";

// Large poll interval so the periodic re-fetch never fires mid-test.
const NO_POLL = 10 * 60_000;

function renderBanner(features: FlagsSnapshot["features"]) {
  return render(
    <FlagsProvider pollMs={NO_POLL} initial={{ features, meta: null, etag: null }}>
      <CookieConsentBanner />
    </FlagsProvider>,
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("CookieConsentBanner — disable kill-switch", () => {
  // The provider seeds from `initial`, but its mount effect still fetches once.
  const stubFetch = () =>
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({ ok: true, status: 304, json: async () => ({}) })),
    );

  it("renders the 'We value your privacy' banner when the disable flag is off", () => {
    stubFetch();
    renderBanner({ [FLAGS.UCM_DISABLE_PRIVACY_BANNER]: false });

    expect(screen.getByText("We value your privacy")).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Cookie consent" })).toBeInTheDocument();
  });

  it("hides the banner when the disable flag is on", () => {
    stubFetch();
    renderBanner({ [FLAGS.UCM_DISABLE_PRIVACY_BANNER]: true });

    expect(screen.queryByText("We value your privacy")).not.toBeInTheDocument();
    expect(screen.queryByRole("region", { name: "Cookie consent" })).not.toBeInTheDocument();
  });

  it("shows the banner when the flag is absent (fail-safe: not disabled)", () => {
    stubFetch();
    renderBanner({});

    expect(screen.getByText("We value your privacy")).toBeInTheDocument();
  });
});
