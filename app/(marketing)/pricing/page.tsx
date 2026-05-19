import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { ContactCtaButton } from "@/components/marketing/ContactCtaButton";
import { FrameworkTile } from "@/components/onboarding/FrameworkTile";
import { FrameworkGrid } from "@/components/onboarding/FrameworkGrid";
import { FRAMEWORK_TILE_DATA } from "@/lib/frameworks/library";

export const metadata: Metadata = {
  title: "Pricing | Simplify IS",
  description:
    "Three plans for every stage. Essential covers NIST CSF 2.0, Professional adds multi-framework scale, and Enterprise unlocks full coverage.",
  alternates: { canonical: "https://simplify.is/pricing" },
};

const ESSENTIAL_FEATURES = [
  "NIST CSF 2.0",
  "Cypher AI Consultant",
  "Industry benchmarking",
  "Maturity Roadmap",
  "Progress & Milestones",
  "14-day free trial",
] as const;

const PROFESSIONAL_FEATURES = [
  "NIST CSF 2.0",
  "Choice of 3 additional frameworks",
  "Cypher AI Consultant",
  "Industry benchmarking",
  "Maturity Roadmap",
  "Progress & Milestones",
  "Multi-user collaboration",
  "Priority support",
] as const;

const ENTERPRISE_FEATURES = [
  "Everything in Professional",
  "All frameworks included",
  "Unlimited users",
  "SSO / SAML",
  "Custom AI persona",
  "Dedicated success manager",
] as const;

export default function PricingPage() {
  return (
    <MarketingShell>
      <main className="px-4 pb-24 pt-32 md:px-12">
        {/* Hero */}
        <section className="mx-auto mb-24 max-w-5xl">
          <p className="font-geist text-[11px] uppercase tracking-[0.3em] text-primary">
            Pricing
          </p>
          <h1 className="editorial-tight mt-4 font-raleway text-5xl font-black leading-[1.05] tracking-tight text-on-surface md:text-7xl">
            Plans for every stage
          </h1>
          <p className="mt-6 max-w-2xl font-montserrat text-base leading-relaxed text-on-surface-muted md:text-lg">
            Start with NIST CSF 2.0 on Essential. Scale up to Professional when you
            need additional frameworks or advanced features. Founder pricing locked
            in for the first 20 customers.
          </p>
          <div className="mt-8 inline-flex items-center gap-3 rounded-sm border border-primary/40 bg-primary/15 px-4 py-3">
            <span aria-hidden className="text-primary">
              ★
            </span>
            <div>
              <p className="font-josefin text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                First 20 Customers
              </p>
              <p className="font-montserrat text-xs text-on-surface-muted">
                Founder pricing with 40% discount locked in.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing tiers */}
        <section className="mx-auto mb-24 grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Essential */}
          <article className="flex flex-col rounded-sm bg-surface-container-high p-8">
            <header>
              <p className="font-josefin text-xs font-bold uppercase tracking-[0.22em] text-on-surface">
                Essential
              </p>
              <p className="mt-3 font-montserrat text-sm text-on-surface-muted">
                For organisations starting their security maturity journey.
              </p>
              <div className="mt-6 flex items-baseline gap-2 opacity-50">
                <span className="font-raleway text-2xl font-black text-on-surface line-through">
                  AUD $490
                </span>
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-raleway text-4xl font-black text-primary">
                  AUD $290
                </span>
                <span className="font-josefin text-[10px] uppercase tracking-[0.2em] text-on-surface-muted">
                  / month
                </span>
              </div>
              <p className="mt-2 font-geist text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
                Founder Price: 40% off
              </p>
            </header>
            <ul className="mt-8 flex-grow space-y-3">
              {ESSENTIAL_FEATURES.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-3 font-montserrat text-sm text-on-surface-muted"
                >
                  <span aria-hidden className="text-primary">
                    &#10003;
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/signup"
              className="mt-10 inline-flex w-full items-center justify-center gap-2 rounded-sm bg-gradient-to-r from-primary to-primary-deep px-6 py-4 font-josefin text-xs font-bold uppercase tracking-[0.22em] text-white shadow-glow-brand transition-transform duration-300 motion-reduce:transition-none active:scale-95"
            >
              Start Free Trial &rarr;
            </Link>
          </article>

          {/* Professional */}
          <article className="relative flex flex-col rounded-sm border-2 border-primary bg-surface-container-highest p-8 shadow-glow-brand">
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 font-geist text-[10px] font-bold uppercase tracking-[0.22em] text-on-primary">
              Most Popular
            </span>
            <header>
              <p className="font-josefin text-xs font-bold uppercase tracking-[0.22em] text-on-surface">
                Professional
              </p>
              <p className="mt-3 font-montserrat text-sm text-on-surface-muted">
                For organisations needing comprehensive coverage across multiple
                frameworks.
              </p>
              <div className="mt-6 flex items-baseline gap-2 opacity-50">
                <span className="font-raleway text-2xl font-black text-on-surface line-through">
                  AUD $990
                </span>
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-raleway text-4xl font-black text-primary">
                  AUD $590
                </span>
                <span className="font-josefin text-[10px] uppercase tracking-[0.2em] text-on-surface-muted">
                  / month
                </span>
              </div>
              <p className="mt-2 font-geist text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
                Founder Price: 40% off &middot; Paid only — no trial
              </p>
            </header>
            <ul className="mt-8 flex-grow space-y-3">
              {PROFESSIONAL_FEATURES.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-3 font-montserrat text-sm text-on-surface"
                >
                  <span aria-hidden className="text-primary">
                    &#10003;
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/signup?plan=professional"
              className="mt-10 inline-flex w-full items-center justify-center gap-2 rounded-sm border-2 border-primary px-6 py-4 font-josefin text-xs font-bold uppercase tracking-[0.22em] text-primary transition-colors duration-300 hover:bg-primary/10"
            >
              Get Started &rarr;
            </Link>
          </article>

          {/* Enterprise */}
          <article className="flex flex-col rounded-sm bg-surface-container-high p-8 opacity-90">
            <header>
              <p className="font-josefin text-xs font-bold uppercase tracking-[0.22em] text-on-surface">
                Enterprise
              </p>
              <p className="mt-3 font-montserrat text-sm text-on-surface-muted">
                Every framework, every user, every feature.
              </p>
              <div className="mt-6 flex items-baseline gap-2">
                <span className="font-raleway text-4xl font-black text-on-surface">
                  AUD $1,990
                </span>
                <span className="font-josefin text-[10px] uppercase tracking-[0.2em] text-on-surface-muted">
                  / month
                </span>
              </div>
              <p className="mt-2 font-geist text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
                Unlimited users + every framework included
              </p>
            </header>
            <ul className="mt-8 flex-grow space-y-3">
              {ENTERPRISE_FEATURES.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-3 font-montserrat text-sm text-on-surface-muted"
                >
                  <span aria-hidden className="text-primary">
                    &#10003;
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="mt-10 inline-flex w-full items-center justify-center gap-2 rounded-sm bg-surface-container-highest px-6 py-4 font-josefin text-xs font-bold uppercase tracking-[0.22em] text-on-surface-muted"
            >
              Contact for Enterprise
            </button>
          </article>
        </section>

        {/* Additional frameworks (informational) */}
        <section className="mx-auto mb-24 max-w-7xl">
          <header className="mb-10 flex flex-col gap-6 border-b border-outline/10 pb-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="font-geist text-[11px] uppercase tracking-[0.3em] text-primary">
                Additional Frameworks
              </p>
              <h2 className="editorial-tight mt-3 font-raleway text-3xl font-extrabold tracking-tight text-on-surface md:text-4xl">
                Customise your Professional plan
              </h2>
              <p className="mt-3 font-montserrat text-sm leading-relaxed text-on-surface-muted">
                If you choose the Professional plan, these are the framework options
                shown during onboarding. You can choose any three frameworks in
                addition to NIST CSF 2.0. Later, you can add more frameworks or switch
                frameworks in Organisation Settings.
              </p>
              <p className="mt-2 font-geist text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                ★ Condition applies
              </p>
            </div>
            <div className="rounded-sm border border-primary/40 bg-primary/15 px-6 py-4 md:min-w-[240px]">
              <p className="font-josefin text-[10px] uppercase tracking-[0.22em] text-primary">
                Framework Rate
              </p>
              <p className="mt-1 font-raleway text-2xl font-black text-on-surface">
                $249
                <span className="ml-2 font-josefin text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-muted">
                  / month
                </span>
              </p>
              <p className="mt-1 font-montserrat text-[11px] text-on-surface-muted">
                Per framework add-on
              </p>
            </div>
          </header>

          <FrameworkGrid>
            {FRAMEWORK_TILE_DATA.map((framework) => (
              <FrameworkTile
                key={framework.id}
                framework={framework}
                state="unselected"
                informational
                showCheckmark={false}
                showUpgradePill={false}
                showIncludedPill={false}
              />
            ))}
          </FrameworkGrid>

        </section>

        {/* Closing CTA */}
        <section className="mx-auto max-w-4xl rounded-sm bg-surface-container-high p-12 text-center md:p-16">
          <h2 className="font-raleway text-3xl font-extrabold text-on-surface md:text-4xl">
            Questions about pricing?
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-montserrat text-sm leading-relaxed text-on-surface-muted md:text-base">
            We&rsquo;re happy to walk you through the platform and help you choose
            the right plan for your organisation.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <ContactCtaButton
              className="inline-flex items-center gap-2 rounded-sm border border-outline/40 px-8 py-3 font-josefin text-xs font-bold uppercase tracking-[0.22em] text-on-surface transition-colors duration-300 hover:border-primary hover:text-primary"
              placement="pricing_footer"
            >
              Contact Us
            </ContactCtaButton>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-sm bg-gradient-to-r from-primary to-primary-deep px-8 py-3 font-josefin text-xs font-bold uppercase tracking-[0.22em] text-white shadow-glow-brand transition-transform duration-300 motion-reduce:transition-none active:scale-95"
            >
              Start Free Trial &rarr;
            </Link>
          </div>
        </section>
      </main>
    </MarketingShell>
  );
}
