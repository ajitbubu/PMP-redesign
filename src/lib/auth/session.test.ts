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
});
