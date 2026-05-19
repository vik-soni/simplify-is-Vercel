import Link from "next/link";
import { ComingSoonContent } from "./ComingSoonContent";

interface ComingSoonPageProps {
  source?: string;
}

export function ComingSoonPage({ source = "login_page" }: ComingSoonPageProps) {
  return (
    <div className="min-h-screen bg-surface font-montserrat text-on-surface flex flex-col">
      <header
        className="fixed top-0 z-50 flex w-full items-center justify-between px-8 py-4"
        style={{ background: "rgba(20,19,17,0.8)", backdropFilter: "blur(12px)" }}
      >
        <Link href="/" className="font-raleway text-2xl font-black tracking-tighter text-on-surface">
          Simplify IS
        </Link>
        <Link
          href="/"
          className="font-josefin text-xs uppercase tracking-widest text-on-surface-muted transition-colors hover:text-primary"
        >
          Home
        </Link>
      </header>

      <main
        className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 pb-16 pt-32"
        style={{ background: "linear-gradient(135deg, #141311 0%, #1c1b19 100%)" }}
      >
        <ComingSoonContent variant="page" source={source} />
      </main>

      <footer className="w-full border-t border-outline/15 bg-surface py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 md:flex-row md:justify-between md:px-12">
          <span className="font-raleway font-black text-on-surface">Simplify IS</span>
          <span className="font-montserrat text-sm font-light text-on-surface-muted">
            © 2026 Simplify.IS
          </span>
        </div>
      </footer>
    </div>
  );
}
