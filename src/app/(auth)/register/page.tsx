import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/layout/auth-shell";
import { AuthForm } from "@/components/sections/auth/auth-form";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Join DataSafeguard and start your privacy management journey.",
};

export default function RegisterPage() {
  return (
    <AuthShell
      heading="Create Account"
      description="Join DataSafeguard and start your privacy management journey."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Log In
          </Link>
        </>
      }
    >
      <AuthForm />
    </AuthShell>
  );
}
