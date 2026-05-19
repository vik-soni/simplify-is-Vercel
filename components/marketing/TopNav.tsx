"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { trackEvent } from "@/lib/analytics/gtm";
import { DarkLightToggle } from "./DarkLightToggle";

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
      {/* Logo */}
      <Link
        href="/"
        className="justify-self-start font-raleway font-bold text-xl text-on-surface tracking-tight"
        onClick={() => trackEvent("nav_click", { target: "/" })}
      >
        Simplify IS
      </Link>

      {/* Desktop nav links — centred within content rail */}
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

      {/* Right side */}
      <div className="flex justify-self-end items-center gap-3">
        <DarkLightToggle />
        <Link
          href="/login"
          className="hidden sm:inline-flex items-center px-4 py-2 text-xs font-raleway font-bold uppercase tracking-[0.2em] text-on-surface-muted transition-colors duration-300 hover:text-on-surface"
          onClick={() => trackEvent("cta_click", { target: "/login", placement: "top_nav" })}
        >
          Log In
        </Link>
        <Link
          href="/signup"
          className="inline-flex items-center px-6 py-2 rounded-sm text-xs font-raleway font-black uppercase tracking-[0.2em] bg-primary text-[#1A1917] transition-all duration-300 hover:scale-105 active:scale-95"
          onClick={() => trackEvent("cta_click", { target: "/signup", placement: "top_nav" })}
        >
          Get Started
        </Link>
        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center w-9 h-9 text-on-surface"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle mobile menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      </div>

      {/* Mobile menu */}
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
          <Link
            href="/login"
            className="text-xs font-raleway font-bold uppercase tracking-[0.2em] text-on-surface-muted hover:text-on-surface"
            onClick={() => setMobileOpen(false)}
          >
            Log In
          </Link>
        </div>
      )}
    </header>
  );
}
