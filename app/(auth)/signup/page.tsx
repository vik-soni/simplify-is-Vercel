import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { SignupForm } from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Sign Up | Simplify IS",
  description: "Create your Simplify IS account and start your first security maturity assessment.",
  alternates: { canonical: "https://simplify.is/signup" },
};

export default function SignupPage() {
  return (
    <AuthShell>
      <h1 className="mb-2 font-raleway text-3xl font-black tracking-tight text-on-surface uppercase">Simplify IS</h1>
      <p className="mb-6 font-josefin text-[10px] tracking-[0.25em] text-[#EB5E28] font-bold uppercase">
        Security Provisioning Protocol
      </p>
      <Suspense fallback={<div className="h-96" aria-hidden />}>
        <SignupForm />
      </Suspense>
    </AuthShell>
  );
}
