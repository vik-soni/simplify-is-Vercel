"use client";

import Link from "next/link";
import { useContactModal } from "./ContactModalProvider";

export function Footer() {
  const contact = useContactModal();
  return (
    <footer className="border-t border-outline/5 bg-surface-container-lowest px-4 pb-12 pt-24 md:px-12">
      <div className="mx-auto max-w-7xl space-y-16">
        {/* Grid */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          {/* Brand col — spans 2 */}
          <div className="space-y-6 md:col-span-2">
            <span className="font-raleway text-2xl font-bold tracking-tighter text-on-surface">
              Simplify IS
            </span>
            <p className="font-montserrat text-[11px] text-on-surface-muted/80">simplify.is</p>
            <div className="space-y-4">
              <h6 className="font-geist text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
                About
              </h6>
              <p className="max-w-xl font-montserrat text-sm font-light leading-relaxed text-outline">
                Simplify IS — short for &ldquo;Simplify Information Security&rdquo; — is dedicated
                to making cyber security clear, accessible, and actionable. Our mission is to cut
                through the complexity and noise that often surrounds security frameworks, tools, and
                jargon.
              </p>
              <p className="text-outline text-sm leading-relaxed max-w-xl font-montserrat font-light">
                At the heart of Simplify IS is Cypher, your AI Security Consultant. Cypher asks the
                right questions, performs a tailored security assessment, and helps you understand
                your organisation&apos;s security maturity level along with key areas for
                improvement.
              </p>
            </div>
          </div>

          {/* Platform */}
          <div className="space-y-6">
            <h6 className="font-geist font-bold text-primary uppercase text-[10px] tracking-[0.3em]">
              Platform
            </h6>
            <ul className="space-y-4 text-on-surface-muted text-xs font-montserrat font-light tracking-wide">
              <li>
                <Link href="/how-it-works" className="hover:text-primary transition-colors duration-300">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/frameworks" className="hover:text-primary transition-colors duration-300">
                  Frameworks
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-primary transition-colors duration-300">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/meet-cypher" className="hover:text-primary transition-colors duration-300">
                  Meet Cypher
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-6">
            <h6 className="font-geist font-bold text-primary uppercase text-[10px] tracking-[0.3em]">
              Resources
            </h6>
            <ul className="space-y-4 text-on-surface-muted text-xs font-montserrat font-light tracking-wide">
              <li>
                <Link href="/maturity-model" className="hover:text-primary transition-colors duration-300">
                  Maturity Model
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary transition-colors duration-300">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary transition-colors duration-300">
                  Terms of Service
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => contact.open()}
                  className="hover:text-primary transition-colors duration-300 text-left"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-12 border-t border-outline/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-geist text-[9px] text-outline uppercase tracking-[0.4em] opacity-40">
            © 2026 Simplify.IS
          </p>
          <div className="font-josefin text-sm text-on-surface-muted/60">Built in Australia</div>
        </div>
      </div>
    </footer>
  );
}
