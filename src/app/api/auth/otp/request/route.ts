import { NextResponse } from "next/server";
import { requestOtp } from "@/lib/auth/otp-store";
import { sendOtpEmail } from "@/lib/auth/mailer";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  const result = requestOtp(email);
  if ("error" in result) {
    return NextResponse.json({ error: "cooldown", retryAfterMs: result.retryAfterMs }, { status: 429 });
  }

  await sendOtpEmail(email, result.code);
  return NextResponse.json({ ok: true });
}
