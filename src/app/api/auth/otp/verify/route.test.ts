import { describe, expect, it } from "vitest";
import { POST } from "./route";
import { requestOtp } from "@/lib/auth/otp-store";

function post(body: unknown) {
  return POST(
    new Request("http://localhost/api/auth/otp/verify", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }),
  );
}

function seedCode(email: string): string {
  const r = requestOtp(email);
  if ("error" in r) throw new Error("expected a fresh code, got cooldown");
  return r.code;
}

describe("POST /api/auth/otp/verify", () => {
  it("400s with invalid_request when email or code is missing", async () => {
    const res = await post({ email: "verify-missing@example.com" });
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "invalid_request" });
  });

  it("400s with not_found when no code was ever requested", async () => {
    const res = await post({ email: "verify-none@example.com", code: "123456" });
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "not_found" });
  });

  it("400s with the store reason for a wrong code", async () => {
    const email = "verify-bad@example.com";
    const real = seedCode(email);
    const wrong = real === "000000" ? "111111" : "000000";
    const res = await post({ email, code: wrong });
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "invalid" });
  });

  it("200s and sets an HttpOnly, SameSite session cookie on success", async () => {
    const email = "verify-ok@example.com";
    const code = seedCode(email);
    const res = await post({ email, code });

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });

    const setCookie = res.headers.get("set-cookie") ?? "";
    expect(setCookie).toMatch(/pmp_session=/);
    expect(setCookie).toMatch(/HttpOnly/i);
    expect(setCookie).toMatch(/SameSite=lax/i);
  });

  it("400s with invalid_request when only the code is provided (no email)", async () => {
    const res = await post({ code: "123456" });
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "invalid_request" });
  });

  it("400s with invalid_request when the body is not valid JSON", async () => {
    const res = await POST(
      new Request("http://localhost/api/auth/otp/verify", { method: "POST", body: "{" }),
    );
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "invalid_request" });
  });
});
