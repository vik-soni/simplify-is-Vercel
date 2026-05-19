import Link from "next/link";
import { LayoutDashboard, Home, MessageSquare } from "lucide-react";
import { ErrorPageComingSoonCta } from "./ErrorPageCta";
import { ErrorPageHelperCards } from "./ErrorPageHelperCards";

interface SecondaryCard {
  Icon: React.ElementType;
  title: string;
  body: string;
  href: string;
  openContactModal?: boolean;
}

interface ErrorPageProps {
  code: string;
  tag?: string;
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
  /** When true, primary CTA opens the coming-soon waitlist modal instead of linking. */
  waitlistCta?: boolean;
  secondaryLabel?: string;
  secondaryHref?: string;
  helperCards?: SecondaryCard[];
}

const DEFAULT_HELPER_CARDS: SecondaryCard[] = [
  {
    Icon: LayoutDashboard,
    title: "Coming soon",
    body: "Join the waitlist — we'll reach out when Simplify IS is ready for demo and launch.",
    href: "/signup",
  },
  {
    Icon: Home,
    title: "Back to Home",
    body: "Take another path through the product or read the latest about Cypher and how Simplify IS works.",
    href: "/",
  },
  {
    Icon: MessageSquare,
    title: "Contact us",
    body: "Can't find what you need, or think the link you followed is broken? Tell us — we'll take a look.",
    href: "#",
    openContactModal: true,
  },
];

export function ErrorPage({
  code,
  tag,
  title,
  description,
  ctaLabel,
  ctaHref,
  waitlistCta = false,
  secondaryLabel = "Back to Home",
  secondaryHref = "/",
  helperCards = DEFAULT_HELPER_CARDS,
}: ErrorPageProps) {
  const tagText = tag ?? `${code} · ${title}`;

  return (
    <div className="min-h-screen bg-surface text-on-surface font-montserrat flex flex-col">
      <header
        className="fixed top-0 w-full z-50 px-8 py-4 flex justify-between items-center"
        style={{ background: "rgba(20,19,17,0.8)", backdropFilter: "blur(12px)" }}
      >
        <Link
          href="/"
          className="text-2xl font-black text-on-surface tracking-tighter font-raleway"
        >
          Simplify IS
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="font-josefin text-xs uppercase tracking-widest text-on-surface-muted hover:text-primary transition-colors"
          >
            Home
          </Link>
        </div>
      </header>

      <main
        className="flex-1 flex flex-col items-center justify-center relative overflow-hidden px-6"
        style={{ background: "linear-gradient(135deg, #141311 0%, #1c1b19 100%)" }}
      >
        <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
          <div
            className="w-[800px] h-[800px] rounded-full blur-[120px]"
            style={{ background: "radial-gradient(circle, #EB5E28, transparent)" }}
          />
        </div>

        <div className="relative z-10 max-w-4xl w-full text-center pt-32 pb-16">
          <div className="inline-flex items-center gap-2 mb-8 bg-surface-container-high px-4 py-1.5 border border-outline/15">
            <span className="font-geist text-[10px] uppercase tracking-[0.2em] text-primary">
              {tagText}
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          </div>

          <div className="mb-6">
            <h1
              className="font-raleway font-black text-surface-container-highest leading-none tracking-tighter select-none"
              style={{ fontSize: "clamp(8rem, 25vw, 18rem)" }}
            >
              {code}
            </h1>
            <div style={{ marginTop: "clamp(-3rem, -6vw, -6rem)" }}>
              <h2 className="text-4xl md:text-6xl font-black font-raleway tracking-tight text-on-surface uppercase">
                {title}
              </h2>
            </div>
          </div>

          <div className="max-w-xl mx-auto mb-12">
            <p className="text-on-surface-muted text-lg md:text-xl font-montserrat leading-relaxed font-light">
              {description}
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            {ctaLabel && waitlistCta ? <ErrorPageComingSoonCta label={ctaLabel} /> : null}
            {ctaLabel && !waitlistCta && ctaHref ? (
              <Link
                href={ctaHref}
                className="flex items-center gap-3 px-10 py-4 font-josefin font-semibold text-[#1A1917] transition-all duration-300 hover:scale-95 active:scale-90"
                style={{
                  background: "linear-gradient(to right, #EB5E28, #C44A1A)",
                  boxShadow: "0 0 20px rgba(235,94,40,0.15)",
                }}
              >
                {ctaLabel}
              </Link>
            ) : null}
            <Link
              href={secondaryHref}
              className="px-10 py-4 border border-outline/30 font-josefin font-medium text-on-surface-muted hover:bg-surface-container-high transition-all duration-300"
            >
              {secondaryLabel}
            </Link>
          </div>

          {helperCards.length > 0 ? <ErrorPageHelperCards /> : null}
        </div>
      </main>

      <footer className="w-full py-12 bg-surface border-t border-outline/15">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 md:flex-row md:justify-between md:px-12">
          <div className="text-on-surface font-black font-raleway">Simplify IS</div>
          <div className="text-on-surface-muted font-montserrat text-sm font-light">
            © 2026 Simplify.IS
          </div>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="text-on-surface-muted hover:text-primary transition-colors font-montserrat text-xs uppercase tracking-widest"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-on-surface-muted hover:text-primary transition-colors font-montserrat text-xs uppercase tracking-widest"
            >
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
