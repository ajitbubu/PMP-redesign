import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "./middleware";
import { createSessionToken, SESSION_COOKIE } from "@/lib/auth/session";

function request(path: string, cookie?: string) {
  const headers = new Headers();
  if (cookie) headers.set("cookie", cookie);
  return new NextRequest(new URL(`http://localhost${path}`), { headers });
}

describe("middleware auth gating", () => {
  it("redirects to /login when no session cookie is present", async () => {
    const res = await middleware(request("/dashboard"));
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toMatch(/\/login$/);
  });

  it("redirects to /login when the session token is invalid", async () => {
    const res = await middleware(request("/consent", `${SESSION_COOKIE}=tampered.value`));
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toMatch(/\/login$/);
  });

  it("lets the request through with a valid session token", async () => {
    const token = await createSessionToken("user@example.com");
    const res = await middleware(request("/dashboard", `${SESSION_COOKIE}=${token}`));
    // NextResponse.next() — no redirect Location header.
    expect(res.headers.get("location")).toBeNull();
  });
});
