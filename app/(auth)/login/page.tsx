import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/marketing/ComingSoonPage";

export const metadata: Metadata = {
  title: "Coming Soon | Simplify IS",
  description: "Simplify IS is launching soon. Join the waitlist to be first in line.",
  alternates: { canonical: "https://simplify.is/login" },
};

export default function LoginPage() {
  return <ComingSoonPage source="login_page" />;
}
