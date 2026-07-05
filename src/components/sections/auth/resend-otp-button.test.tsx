import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ResendOtpButton } from "./resend-otp-button";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("ResendOtpButton", () => {
  it("announces success in a status region after resending", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response(null, { status: 200 })));
    const user = userEvent.setup();
    render(<ResendOtpButton email="user@example.com" />);

    await user.click(screen.getByRole("button", { name: /resend otp/i }));

    const status = await screen.findByRole("status");
    expect(status).toHaveTextContent(/a new code has been sent/i);
  });

  it("surfaces a message when the resend fails at the network level (regression: was silent)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("network down");
      }),
    );
    const user = userEvent.setup();
    render(<ResendOtpButton email="user@example.com" />);

    await user.click(screen.getByRole("button", { name: /resend otp/i }));

    const status = await screen.findByRole("status");
    expect(status).toHaveTextContent(/couldn't resend the code/i);
  });

  it("reports the cooldown when the server rate-limits the resend (429)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify({ retryAfterMs: 30000 }), { status: 429 })),
    );
    const user = userEvent.setup();
    render(<ResendOtpButton email="user@example.com" />);

    await user.click(screen.getByRole("button", { name: /resend otp/i }));

    const status = await screen.findByRole("status");
    expect(status).toHaveTextContent(/please wait 30s/i);
  });
});
