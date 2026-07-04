import { describe, expect, it } from "vitest";
import { requestOtp, verifyOtp } from "./otp-store";

describe("otp-store", () => {
  it("verifies successfully with the exact code just issued, then consumes it (single-use)", () => {
    const email = "correct-code@example.com";
    const result = requestOtp(email);
    if ("error" in result) throw new Error("expected a fresh code, got cooldown");

    expect(verifyOtp(email, result.code)).toEqual({ ok: true });
    // Same code again must fail — it was deleted after the first successful verify.
    expect(verifyOtp(email, result.code)).toEqual({ ok: false, reason: "not_found" });
  });

  it("rejects an incorrect code and reports 'invalid' without consuming the real code", () => {
    const email = "wrong-code@example.com";
    const result = requestOtp(email);
    if ("error" in result) throw new Error("expected a fresh code, got cooldown");

    expect(verifyOtp(email, "000000")).toEqual({ ok: false, reason: "invalid" });
    // The real code should still work — one wrong guess doesn't invalidate it.
    expect(verifyOtp(email, result.code)).toEqual({ ok: true });
  });

  it("locks out after 5 incorrect attempts, even with the correct code on the 6th try", () => {
    const email = "lockout@example.com";
    const result = requestOtp(email);
    if ("error" in result) throw new Error("expected a fresh code, got cooldown");

    for (let i = 0; i < 5; i++) {
      expect(verifyOtp(email, "000000")).toEqual({ ok: false, reason: "invalid" });
    }
    expect(verifyOtp(email, result.code)).toEqual({ ok: false, reason: "too_many_attempts" });
  });

  it("enforces the resend cooldown — a second request for the same email is rejected", () => {
    const email = "cooldown@example.com";
    const first = requestOtp(email);
    if ("error" in first) throw new Error("expected a fresh code, got cooldown");

    const second = requestOtp(email);
    expect(second).toMatchObject({ error: "cooldown" });
    if (!("error" in second)) throw new Error("expected cooldown on immediate resend");
    expect(second.retryAfterMs).toBeGreaterThan(0);
  });
});
