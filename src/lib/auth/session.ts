/**
 * Signed session cookie — HMAC-SHA256 over `email.expiresAt`, base64url encoded.
 * Uses Web Crypto (crypto.subtle) so the same code runs in middleware's Edge
 * runtime and in route handlers' Node runtime without a separate implementation.
 *
 * No database: the cookie itself carries the verified email + expiry, and the
 * signature makes it tamper-evident. Fine for this app's current scale, but it
 * means there's no server-side session revocation (deleting the cookie is the
 * only "logout") — move to a real session store before this needs revocation,
 * multi-device sign-out, or admin-forced logout.
 */
export const SESSION_COOKIE = "pmp_session";
export const SESSION_TTL_MS = 8 * 60 * 60 * 1000;

const FALLBACK_SECRET = "dev-only-insecure-secret-set-SESSION_SECRET-before-production";

let warnedMissingSecret = false;

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    if (!warnedMissingSecret) {
      console.warn(
        "[auth] SESSION_SECRET is not set — using an insecure default. Set SESSION_SECRET before deploying.",
      );
      warnedMissingSecret = true;
    }
    return FALLBACK_SECRET;
  }
  return secret;
}

const encoder = new TextEncoder();

function base64url(bytes: Uint8Array): string {
  let str = "";
  for (const b of bytes) str += String.fromCharCode(b);
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64urlDecode(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const str = atob(padded);
  const bytes = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) bytes[i] = str.charCodeAt(i);
  return bytes;
}

async function getKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey("raw", encoder.encode(getSecret()), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
    "verify",
  ]);
}

export async function createSessionToken(email: string): Promise<string> {
  const payload = JSON.stringify({ email, expiresAt: Date.now() + SESSION_TTL_MS });
  const payloadBytes = encoder.encode(payload);
  const signature = await crypto.subtle.sign("HMAC", await getKey(), payloadBytes as BufferSource);
  return `${base64url(payloadBytes)}.${base64url(new Uint8Array(signature))}`;
}

export async function verifySessionToken(token: string): Promise<string | null> {
  const [payloadPart, signaturePart] = token.split(".");
  if (!payloadPart || !signaturePart) return null;

  try {
    const payloadBytes = base64urlDecode(payloadPart);
    const signatureBytes = base64urlDecode(signaturePart);
    const valid = await crypto.subtle.verify(
      "HMAC",
      await getKey(),
      signatureBytes as BufferSource,
      payloadBytes as BufferSource,
    );
    if (!valid) return null;

    const { email, expiresAt } = JSON.parse(new TextDecoder().decode(payloadBytes));
    if (typeof email !== "string" || typeof expiresAt !== "number" || Date.now() > expiresAt) return null;
    return email;
  } catch {
    return null;
  }
}
