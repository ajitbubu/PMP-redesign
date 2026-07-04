import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/layout/auth-shell";
import { AuthForm } from "@/components/sections/auth/auth-form";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to the ID-PRIVACY Privacy Management Portal.",
};

export default function LoginPage() {
  return (
    <AuthShell
      heading="Login"
      description="Sign in to Data Safeguard and continue protecting what matters most - data privacy and compliance."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-primary hover:underline">
            Register
          </Link>
        </>
      }
    >
      <AuthForm />
    </AuthShell>
  );
}
