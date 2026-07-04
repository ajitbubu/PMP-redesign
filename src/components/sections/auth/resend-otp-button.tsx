"use client";

import { useState } from "react";

export function ResendOtpButton({ email }: { email: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [cooldown, setCooldown] = useState(0);

  async function handleResend() {
    setStatus("sending");
    try {
      const response = await fetch("/api/auth/otp/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.status === 429) {
        const data = await response.json();
        setCooldown(Math.ceil((data.retryAfterMs ?? 60_000) / 1000));
        setStatus("error");
        return;
      }
      setStatus(response.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  const label =
    status === "sent"
      ? "Code resent"
      : status === "sending"
        ? "Sending…"
        : cooldown > 0
          ? `Wait ${cooldown}s`
          : "Resend OTP";

  return (
    <button
      type="button"
      onClick={handleResend}
      disabled={status === "sending"}
      className="font-semibold text-primary hover:underline disabled:cursor-not-allowed disabled:opacity-50"
    >
      {label}
    </button>
  );
}
