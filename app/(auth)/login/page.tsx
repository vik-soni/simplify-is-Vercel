import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Log In | Simplify IS",
  description: "Securely log in to your Simplify IS account.",
  alternates: { canonical: "https://simplify.is/login" },
};

type Search = { success?: string; email?: string };

export default function LoginPage({ searchParams }: { searchParams?: Search }) {
  const successBanner =
    searchParams?.success === "verified"
      ? "Your email has been verified. Log in with your details."
      : searchParams?.success === "reset"
        ? "Password reset successful. Log in with your new credentials."
        : undefined;
  const initialEmail = searchParams?.email ? String(searchParams.email) : undefined;

  return (
    <AuthShell>
      <h1 className="mb-2 font-raleway text-3xl font-black tracking-tight text-on-surface">Log in to Simplify IS</h1>
      <p className="mb-6 font-montserrat text-secondary text-sm font-medium tracking-wide">Continue your security assessment</p>
      <LoginForm successBanner={successBanner} initialEmail={initialEmail} />
    </AuthShell>
  );
}

