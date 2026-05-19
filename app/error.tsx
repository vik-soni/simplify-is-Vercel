"use client";

import Link from "next/link";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-surface text-on-surface font-montserrat flex flex-col">

      {/* Minimal nav */}
      <header
        className="fixed top-0 w-full z-50 px-8 py-4 flex justify-between items-center"
        style={{ background: "rgba(20,19,17,0.8)", backdropFilter: "blur(12px)" }}
      >
        <Link href="/" className="text-2xl font-black text-on-surface tracking-tighter font-raleway">
          Simplify IS
        </Link>
      </header>

      {/* Main */}
      <main
        className="flex-1 flex flex-col items-center justify-center relative overflow-hidden px-6"
        style={{ background: "linear-gradient(135deg, #141311 0%, #1c1b19 100%)" }}
      >
        {/* Background glow */}
        <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
          <div
            className="w-[800px] h-[800px] rounded-full blur-[120px]"
            style={{ background: "radial-gradient(circle, #EB5E28, transparent)" }}
          />
        </div>

        <div className="relative z-10 max-w-4xl w-full text-center">

          {/* Metadata tag */}
          <div className="inline-flex items-center gap-2 mb-8 bg-surface-container-high px-4 py-1.5 border border-outline/15">
            <span className="font-geist text-[10px] uppercase tracking-[0.2em] text-primary">
              System Alert: 0x500
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          </div>

          {/* Giant 500 */}
          <div className="mb-6">
            <h1
              className="font-raleway font-black text-surface-container-highest leading-none tracking-tighter select-none"
              style={{ fontSize: "clamp(8rem, 25vw, 18rem)" }}
            >
              500
            </h1>
            <div style={{ marginTop: "clamp(-3rem, -6vw, -6rem)" }}>
              <h2 className="text-4xl md:text-6xl font-black font-raleway tracking-tight text-on-surface uppercase">
                Internal Fault
              </h2>
            </div>
          </div>

          {/* Message */}
          <div className="max-w-xl mx-auto mb-12">
            <p className="text-on-surface-muted text-lg md:text-xl font-montserrat leading-relaxed font-light">
              A critical error occurred in the archive engine. Our sentinels have been notified.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <button
              onClick={reset}
              className="flex items-center gap-3 px-10 py-4 font-josefin font-semibold hover:scale-95 active:scale-90 transition-all duration-300 text-[#1A1917]"
              style={{ background: "linear-gradient(to right, #EB5E28, #C44A1A)", boxShadow: "0 0 20px rgba(235,94,40,0.15)" }}
            >
              Retry
            </button>
            <Link
              href="/"
              className="px-10 py-4 border border-outline/30 font-josefin font-medium text-on-surface-muted hover:bg-surface-container-high transition-all duration-300"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>

      {/* Minimal footer */}
      <footer className="w-full py-12 bg-surface border-t border-outline/15">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 md:flex-row md:justify-between md:px-12">
          <div className="text-on-surface font-black font-raleway">Simplify IS</div>
          <div className="text-on-surface-muted font-montserrat text-sm font-light">
            © 2026 Simplify.IS
          </div>
        </div>
      </footer>
    </div>
  );
}
