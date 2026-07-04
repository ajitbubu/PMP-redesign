import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthForm } from "./auth-form";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("AuthForm", () => {
  it("announces a rate-limit error through an alert region tied to the email field", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify({ retryAfterMs: 60000 }), { status: 429 })),
    );
    const user = userEvent.setup();
    render(<AuthForm />);

    await user.type(screen.getByLabelText(/email address/i), "user@example.com");
    await user.click(screen.getByRole("button", { name: /send otp/i }));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/please wait 60s/i);
    expect(screen.getByLabelText(/email address/i)).toHaveAttribute(
      "aria-describedby",
      alert.id,
    );
  });
});
