"use client";

import Link from "next/link";
import { LayoutDashboard, Home, MessageSquare } from "lucide-react";
import { ContactHelperCard } from "@/components/marketing/ContactHelperCard";

export function ErrorPageHelperCards() {
  return (
    <div className="mt-24 grid grid-cols-1 items-stretch gap-6 text-left md:grid-cols-3">
      <Link
        href="/signup"
        className="flex h-full flex-col border border-outline/5 bg-surface-container-low p-8 transition-all hover:border-primary/40 hover:bg-surface-container"
      >
        <LayoutDashboard className="mb-4 h-7 w-7 text-primary" strokeWidth={1.5} aria-hidden />
        <h3 className="mb-2 font-josefin text-xs font-bold uppercase tracking-widest text-on-surface">
          Coming soon
        </h3>
        <p className="font-montserrat text-xs font-light leading-relaxed text-on-surface-muted">
          Join the waitlist — we&apos;ll reach out when Simplify IS is ready for demo and launch.
        </p>
      </Link>
      <Link
        href="/"
        className="flex h-full flex-col border border-outline/5 bg-surface-container-low p-8 transition-all hover:border-primary/40 hover:bg-surface-container"
      >
        <Home className="mb-4 h-7 w-7 text-primary" strokeWidth={1.5} aria-hidden />
        <h3 className="mb-2 font-josefin text-xs font-bold uppercase tracking-widest text-on-surface">
          Back to Home
        </h3>
        <p className="font-montserrat text-xs font-light leading-relaxed text-on-surface-muted">
          Take another path through the product or read the latest about Cypher and how Simplify IS works.
        </p>
      </Link>
      <ContactHelperCard
        Icon={MessageSquare}
        title="Contact us"
        body="Can't find what you need, or think the link you followed is broken? Tell us — we'll take a look."
      />
    </div>
  );
}
