"use client";

import { useRef, useState, type ChangeEvent, type FormEvent, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const OTP_LENGTH = 6;

const ERROR_MESSAGES: Record<string, string> = {
  invalid: "That code doesn't match. Check your email and try again.",
  expired: "That code expired. Request a new one.",
  too_many_attempts: "Too many attempts. Request a new code.",
  not_found: "Request a new code to continue.",
};

export function OtpForm({ email }: { email: string }) {
  const router = useRouter();
  const [digits, setDigits] = useState<string[]>(() => Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  function handleChange(index: number, event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
    if (value && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const response = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: digits.join("") }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(ERROR_MESSAGES[data.error] ?? "Couldn't verify that code. Try again.");
        return;
      }

      router.push("/dashboard");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="otp-0">
          <KeyRound className="size-4 text-muted-foreground" />
          One-Time Password
          <span className="text-destructive">*</span>
        </Label>
        <div className="flex gap-2">
          {digits.map((digit, index) => (
            <Input
              key={index}
              id={`otp-${index}`}
              ref={(element) => {
                inputsRef.current[index] = element;
              }}
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(event) => handleChange(index, event)}
              onKeyDown={(event) => handleKeyDown(index, event)}
              aria-label={`Digit ${index + 1} of 6`}
              className="size-12 px-0 text-center text-lg"
            />
          ))}
        </div>
        <p className="text-sm text-muted-foreground">Enter the code from your email.</p>
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={submitting || digits.some((digit) => !digit)}
      >
        {submitting ? "Verifying…" : "Verify & Continue"}
        <ArrowRight className="size-4" />
      </Button>
    </form>
  );
}
