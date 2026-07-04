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

  const sending = status === "sending";
  const label = sending ? "Sending…" : cooldown > 0 ? `Wait ${cooldown}s` : "Resend OTP";

  // Outcome message, announced via the live region below — including the
  // previously-silent network-failure case (status "error" with no cooldown).
  const statusMessage =
    status === "sent"
      ? "A new code has been sent."
      : status === "error" && cooldown > 0
        ? `Please wait ${cooldown}s before requesting another code.`
        : status === "error"
          ? "Couldn't resend the code. Please try again."
          : "";

  return (
    <>
      <button
        type="button"
        onClick={handleResend}
        disabled={status === "sending"}
        aria-busy={status === "sending"}
        className="font-semibold text-primary hover:underline disabled:cursor-not-allowed disabled:opacity-50"
      >
        {label}
      </button>
      <span
        role="status"
        aria-live="polite"
        className={
          statusMessage
            ? `mt-2 block text-sm ${status === "error" ? "text-destructive" : "text-muted-foreground"}`
            : "sr-only"
        }
      >
        {statusMessage}
      </span>
    </>
  );
}
