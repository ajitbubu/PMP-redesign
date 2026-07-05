import { describe, expect, it, vi } from "vitest";
import { createSessionToken, SESSION_TTL_MS, verifySessionToken } from "./session";

describe("session", () => {
  it("round-trips a signed token — the verified email matches what was signed", async () => {
    const token = await createSessionToken("user@example.com");
    expect(await verifySessionToken(token)).toBe("user@example.com");
  });

  it("rejects a token with a tampered payload (forged email, same signature)", async () => {
    const token = await createSessionToken("user@example.com");
    const [payloadPart, signaturePart] = token.split(".");
    expect(payloadPart).toBeTruthy();

    // Swap in a different (but validly-encoded) payload while keeping the
    // original signature — this must fail, or the signature check is a no-op.
    const forgedToken = await createSessionToken("attacker@example.com");
    const [forgedPayloadPart] = forgedToken.split(".");
    const stitched = `${forgedPayloadPart}.${signaturePart}`;

    expect(await verifySessionToken(stitched)).toBeNull();
  });

  it("rejects a malformed token (missing signature segment)", async () => {
    expect(await verifySessionToken("not-a-real-token")).toBeNull();
  });

  it("rejects a token past its expiry", async () => {
    vi.useFakeTimers();
    try {
      const start = new Date("2026-01-01T00:00:00Z").getTime();
      vi.setSystemTime(start);
      const token = await createSessionToken("user@example.com");
      vi.setSystemTime(start + SESSION_TTL_MS + 1); // one ms past the 8h TTL
      expect(await verifySessionToken(token)).toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });

  it("rejects a token signed under a different secret (the secret is actually used)", async () => {
    const previous = process.env.SESSION_SECRET;
    try {
      process.env.SESSION_SECRET = "secret-A";
      const token = await createSessionToken("user@example.com");
      process.env.SESSION_SECRET = "secret-B";
      expect(await verifySessionToken(token)).toBeNull();
    } finally {
      if (previous === undefined) delete process.env.SESSION_SECRET;
      else process.env.SESSION_SECRET = previous;
    }
  });

  it("rejects a validly-signed token whose payload has the wrong field types", async () => {
    const previous = process.env.SESSION_SECRET;
    process.env.SESSION_SECRET = "forge-secret";
    try {
      const enc = new TextEncoder();
      const b64url = (bytes: Uint8Array) => {
        let s = "";
        for (const b of bytes) s += String.fromCharCode(b);
        return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
      };
      const sign = async (payload: unknown) => {
        const bytes = enc.encode(JSON.stringify(payload));
        const key = await crypto.subtle.importKey(
          "raw",
          enc.encode("forge-secret"),
          { name: "HMAC", hash: "SHA-256" },
          false,
          ["sign"],
        );
        const sig = new Uint8Array(await crypto.subtle.sign("HMAC", key, bytes));
        return `${b64url(bytes)}.${b64url(sig)}`;
      };
      const future = Date.now() + 60_000;
      // Signature is valid, but the field types violate the payload contract.
      expect(await verifySessionToken(await sign({ email: 123, expiresAt: future }))).toBeNull();
      expect(await verifySessionToken(await sign({ email: "u@x.com", expiresAt: "soon" }))).toBeNull();
    } finally {
      if (previous === undefined) delete process.env.SESSION_SECRET;
      else process.env.SESSION_SECRET = previous;
    }
  });
});
