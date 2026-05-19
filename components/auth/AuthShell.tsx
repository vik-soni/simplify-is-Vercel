"use client";

import Link from "next/link";
import { ReactNode, useEffect } from "react";
import { DarkLightToggle } from "@/components/marketing/DarkLightToggle";

export function AuthShell({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.body.classList.add("marketing");
    return () => {
      document.body.classList.remove("marketing");
    };
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-8 font-montserrat md:px-12">
      {/* Ember glow decorations */}
      <div className="fixed -top-24 -left-24 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed -bottom-24 -right-24 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Theme toggle — top right */}
      <div className="fixed right-4 top-4 z-50 md:right-12">
        <DarkLightToggle />
      </div>

      {/* Logo — top left */}
      <div className="fixed left-4 top-4 z-50 md:left-12">
        <Link
          href="/"
          className="font-raleway font-bold text-lg text-on-surface tracking-tight hover:text-primary transition-colors duration-300"
        >
          Simplify IS
        </Link>
      </div>

      {/* Content card */}
      <main className="w-full max-w-md flex flex-col items-center space-y-8 relative z-10">
        <div className="w-full bg-surface-container-high p-8 rounded-xl shadow-glow-brand shadow-2xl">
          {children}
        </div>

        {/* Footer links */}
        <footer className="w-full pt-6 border-t border-outline/5">
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-[11px] font-mono uppercase tracking-[0.2em] text-[#CCC5B9]/60">
            <Link href="/privacy" className="hover:text-primary transition-colors duration-300">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-primary transition-colors duration-300">
              Terms of Service
            </Link>
          </div>
          <div className="mt-6 text-center">
            <p className="font-josefin text-[10px] uppercase tracking-widest text-outline/30">
              © 2026 Simplify.IS
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
