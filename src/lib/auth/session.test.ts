import { describe, expect, it } from "vitest";
import { createSessionToken, verifySessionToken } from "./session";

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
});
