"use client";

import { ComingSoonTrigger } from "@/components/marketing/ComingSoonTrigger";

export function ErrorPageComingSoonCta({ label }: { label: string }) {
  return (
    <ComingSoonTrigger
      source="error_page"
      className="flex items-center gap-3 px-10 py-4 font-josefin font-semibold text-[#1A1917] transition-all duration-300 hover:scale-95 active:scale-90"
      style={{
        background: "linear-gradient(to right, #EB5E28, #C44A1A)",
        boxShadow: "0 0 20px rgba(235,94,40,0.15)",
      }}
    >
      {label}
    </ComingSoonTrigger>
  );
}
