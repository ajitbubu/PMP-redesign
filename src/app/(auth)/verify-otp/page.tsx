import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AuthShell } from "@/components/layout/auth-shell";
import { OtpForm } from "@/components/sections/auth/otp-form";
import { ResendOtpButton } from "@/components/sections/auth/resend-otp-button";

export const metadata: Metadata = {
  title: "Verify OTP",
  description: "Enter the 6-digit verification code sent to your email to continue.",
};

export default async function VerifyOtpPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;
  if (!email) {
    redirect("/login");
  }

  return (
    <AuthShell
      heading="Verify OTP"
      description={`We've sent a 6-digit verification code to ${email}.`}
      footer={
        <>
          Didn&apos;t receive the code? <ResendOtpButton email={email} />
        </>
      }
    >
      <Link
        href="/login"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back
      </Link>
      <OtpForm email={email} />
    </AuthShell>
  );
}
