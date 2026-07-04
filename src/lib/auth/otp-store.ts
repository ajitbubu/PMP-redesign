/**
 * In-memory OTP challenge store. Single-process only — codes are lost on
 * restart and not shared across instances. Fine for this app's current
 * scale; swap for Redis/a database table before running multiple instances.
 */
type OtpRecord = {
  code: string;
  expiresAt: number;
  attempts: number;
  lastSentAt: number;
};

const OTP_TTL_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const RESEND_COOLDOWN_MS = 60 * 1000;

// Keyed on globalThis, not a plain module-level const: next dev compiles each
// API route as an independent on-demand bundle, so a plain `new Map()` here
// would give /request and /verify their own separate copies of this module
// (and thus separate stores) instead of sharing one. globalThis is the one
// thing guaranteed to be the same object across those bundles within a
// single Node process — the standard fix for this class of dev-mode issue
// (same reason Prisma clients are cached on globalThis in Next.js apps).
const globalStore = globalThis as unknown as { __otpStore?: Map<string, OtpRecord> };
const store = globalStore.__otpStore ?? (globalStore.__otpStore = new Map<string, OtpRecord>());

function generateCode(): string {
  const bytes = new Uint32Array(1);
  crypto.getRandomValues(bytes);
  return (bytes[0]! % 1_000_000).toString().padStart(6, "0");
}

export function requestOtp(
  email: string,
): { code: string } | { error: "cooldown"; retryAfterMs: number } {
  const now = Date.now();
  const existing = store.get(email);
  if (existing && now - existing.lastSentAt < RESEND_COOLDOWN_MS) {
    return { error: "cooldown", retryAfterMs: RESEND_COOLDOWN_MS - (now - existing.lastSentAt) };
  }
  const code = generateCode();
  store.set(email, { code, expiresAt: now + OTP_TTL_MS, attempts: 0, lastSentAt: now });
  return { code };
}

export type VerifyResult =
  | { ok: true }
  | { ok: false; reason: "not_found" | "expired" | "too_many_attempts" | "invalid" };

export function verifyOtp(email: string, code: string): VerifyResult {
  const record = store.get(email);
  if (!record) return { ok: false, reason: "not_found" };

  const now = Date.now();
  if (now > record.expiresAt) {
    store.delete(email);
    return { ok: false, reason: "expired" };
  }
  if (record.attempts >= MAX_ATTEMPTS) {
    store.delete(email);
    return { ok: false, reason: "too_many_attempts" };
  }
  if (record.code !== code) {
    record.attempts += 1;
    return { ok: false, reason: "invalid" };
  }

  store.delete(email); // single-use
  return { ok: true };
}
