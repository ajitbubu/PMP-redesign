import { describe, expect, it, vi } from "vitest";
import { POST } from "./route";

// Don't hit Resend / console during the route test; just observe the call.
const { sendOtpEmail } = vi.hoisted(() => ({ sendOtpEmail: vi.fn().mockResolvedValue(undefined) }));
vi.mock("@/lib/auth/mailer", () => ({ sendOtpEmail }));

function post(body: unknown) {
  return POST(
    new Request("http://localhost/api/auth/otp/request", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }),
  );
}

describe("POST /api/auth/otp/request", () => {
  it("400s with invalid_email for a malformed address", async () => {
    const res = await post({ email: "not-an-email" });
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "invalid_email" });
  });

  it("400s with invalid_email when email is missing", async () => {
    const res = await post({});
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "invalid_email" });
  });

  it("200s and emails a 6-digit code for a valid new address", async () => {
    const res = await post({ email: "req-ok@example.com" });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(sendOtpEmail).toHaveBeenCalledWith(
      "req-ok@example.com",
      expect.stringMatching(/^\d{6}$/),
    );
  });

  it("trims and lowercases the email before validating", async () => {
    const res = await post({ email: "  MixedCase@Example.COM  " });
    expect(res.status).toBe(200);
    expect(sendOtpEmail).toHaveBeenCalledWith("mixedcase@example.com", expect.any(String));
  });

  it("429s with a cooldown on an immediate second request for the same email", async () => {
    await post({ email: "req-cooldown@example.com" });
    const res = await post({ email: "req-cooldown@example.com" });
    expect(res.status).toBe(429);
    const body = await res.json();
    expect(body.error).toBe("cooldown");
    expect(body.retryAfterMs).toBeGreaterThan(0);
  });

  it("400s with invalid_email when the body is not valid JSON", async () => {
    const res = await POST(
      new Request("http://localhost/api/auth/otp/request", { method: "POST", body: "not json" }),
    );
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "invalid_email" });
  });
});
