"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { trackEvent } from "@/lib/analytics/gtm";
import { DarkLightToggle } from "./DarkLightToggle";
import { ComingSoonTrigger } from "./ComingSoonTrigger";

const links = [
  { href: "/how-it-works", label: "How It Works" },
  { href: "/frameworks", label: "Frameworks" },
  { href: "/pricing", label: "Pricing" },
];

export function TopNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 h-20 glass-nav">
      <div className="mx-auto grid h-full max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-4 md:px-12">
        <Link
          href="/"
          className="justify-self-start font-raleway text-xl font-bold tracking-tight text-on-surface"
          onClick={() => trackEvent("nav_click", { target: "/" })}
        >
          Simplify IS
        </Link>

        <nav className="hidden items-center justify-center gap-10 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => trackEvent("nav_click", { target: link.href })}
              className={`text-xs font-raleway font-bold uppercase tracking-[0.2em] transition-colors duration-300 hover:text-primary ${
                pathname === link.href ? "text-primary" : "text-on-surface"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-self-end gap-3">
          <DarkLightToggle />
          <ComingSoonTrigger
            placement="top_nav_login"
            source="top_nav_login"
            className="hidden items-center px-4 py-2 text-xs font-raleway font-bold uppercase tracking-[0.2em] text-on-surface-muted transition-colors duration-300 hover:text-on-surface sm:inline-flex"
          >
            Log In
          </ComingSoonTrigger>
          <ComingSoonTrigger
            placement="top_nav_signup"
            source="top_nav_signup"
            className="inline-flex items-center rounded-sm bg-primary px-6 py-2 text-xs font-raleway font-black uppercase tracking-[0.2em] text-[#1A1917] transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Get Started
          </ComingSoonTrigger>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center text-on-surface md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="absolute left-0 right-0 top-20 flex flex-col gap-4 border-b border-outline/5 bg-surface-container px-4 py-6 md:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => {
                setMobileOpen(false);
                trackEvent("nav_click", { target: link.href });
              }}
              className={`text-xs font-raleway font-bold uppercase tracking-[0.2em] transition-colors duration-300 hover:text-primary ${
                pathname === link.href ? "text-primary" : "text-on-surface"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <ComingSoonTrigger
            placement="top_nav_mobile_login"
            source="top_nav_mobile_login"
            className="text-left text-xs font-raleway font-bold uppercase tracking-[0.2em] text-on-surface-muted hover:text-on-surface"
          >
            Log In
          </ComingSoonTrigger>
        </div>
      )}
    </header>
  );
}
