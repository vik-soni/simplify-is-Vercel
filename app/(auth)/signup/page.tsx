import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/marketing/ComingSoonPage";

export const metadata: Metadata = {
  title: "Coming Soon | Simplify IS",
  description: "Simplify IS is launching soon. Join the waitlist to be first in line.",
  alternates: { canonical: "https://simplify.is/signup" },
};

export default function SignupPage() {
  return <ComingSoonPage source="signup_page" />;
}
