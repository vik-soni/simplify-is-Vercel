import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { ComingSoonTrigger } from "@/components/marketing/ComingSoonTrigger";
import { ContactCtaButton } from "@/components/marketing/ContactCtaButton";
import { FrameworkTile } from "@/components/onboarding/FrameworkTile";
import { FrameworkGrid } from "@/components/onboarding/FrameworkGrid";
import { FRAMEWORK_TILE_DATA, UPCOMING_FRAMEWORK_TILE_DATA } from "@/lib/frameworks/library";

export const metadata: Metadata = {
  title: "Frameworks | Simplify IS",
  description:
    "Standards we support — NIST CSF 2.0, ISO 27001:2022, PCI DSS 4.0, APRA CPS 234 and more, all conducted as conversational assessments by Cypher.",
  alternates: { canonical: "https://simplify.is/frameworks" },
};

export default function FrameworksPage() {
  return (
    <MarketingShell>
      <main className="pb-24 pt-32">
        <section className="mx-auto mb-24 max-w-7xl px-4 md:px-12">
          <div className="grid items-center gap-16 md:grid-cols-2">
            <div>
              <p className="font-geist text-[11px] uppercase tracking-[0.3em] text-primary">
                Strategic Architecture
              </p>
              <h1 className="editorial-tight mt-4 font-raleway text-5xl font-extrabold leading-[1.05] tracking-tight text-on-surface md:text-7xl">
                Compliance <span className="text-primary italic">Automated</span> at the Core.
              </h1>
              <p className="mt-6 max-w-xl font-montserrat text-base leading-relaxed text-on-surface-muted md:text-lg">
                Cypher maps one conversational assessment across security and AI governance standards,
                giving your team consistent, framework-grounded guidance without spreadsheet overhead.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <ComingSoonTrigger
                  source="frameworks_hero"
                  className="inline-flex items-center gap-2 rounded-sm bg-gradient-to-r from-primary to-primary-deep px-8 py-4 font-josefin text-xs font-bold uppercase tracking-[0.22em] text-white shadow-glow-brand transition-all duration-300 motion-reduce:transition-none hover:shadow-glow-brand-lg active:scale-95"
                >
                  Get Started
                </ComingSoonTrigger>
                <ContactCtaButton
                  className="inline-flex items-center gap-2 rounded-sm bg-surface-container-highest px-8 py-4 font-josefin text-xs font-bold uppercase tracking-[0.22em] text-on-surface-muted transition-colors duration-300 hover:bg-surface-bright hover:text-on-surface"
                  placement="frameworks_hero"
                >
                  Talk to Founder
                </ContactCtaButton>
              </div>
            </div>

            <div className="rounded-sm bg-surface-container-high p-6">
              <div className="rounded-sm bg-surface-container p-6">
                <p className="font-geist text-[10px] uppercase tracking-[0.3em] text-primary">
                  Framework Coverage
                </p>
                <div className="mt-5 rounded-sm bg-surface-container-highest p-4">
                  <p className="font-josefin text-xs font-bold uppercase tracking-[0.2em] text-on-surface">
                    9 frameworks in product
                  </p>
                  <p className="mt-1 font-geist text-[10px] uppercase tracking-[0.2em] text-primary">Available now</p>
                  <div className="mt-3 space-y-2">
                    <div className="rounded-sm bg-surface-container px-3 py-2">
                      <p className="font-geist text-[9px] uppercase tracking-[0.16em] text-primary">Core Standards</p>
                      <p className="mt-1 font-montserrat text-[11px] leading-snug text-on-surface-muted">
                        NIST CSF 2.0, ISO 27001:2022
                      </p>
                    </div>
                    <div className="rounded-sm bg-surface-container px-3 py-2">
                      <p className="font-geist text-[9px] uppercase tracking-[0.16em] text-primary">Australian Standards</p>
                      <p className="mt-1 font-montserrat text-[11px] leading-snug text-on-surface-muted">
                        APRA CPS 234, APRA CPS 230, ASD Essential Eight
                      </p>
                    </div>
                    <div className="rounded-sm bg-surface-container px-3 py-2">
                      <p className="font-geist text-[9px] uppercase tracking-[0.16em] text-primary">AI Governance</p>
                      <p className="mt-1 font-montserrat text-[11px] leading-snug text-on-surface-muted">
                        ISO 42001, NIST AI RMF, AUVA ISS
                      </p>
                    </div>
                    <div className="rounded-sm bg-surface-container px-3 py-2">
                      <p className="font-geist text-[9px] uppercase tracking-[0.16em] text-primary">Payments</p>
                      <p className="mt-1 font-montserrat text-[11px] leading-snug text-on-surface-muted">
                        PCI DSS 4.0
                      </p>
                    </div>
                  </div>
                </div>
                <p className="mt-4 font-montserrat text-xs leading-relaxed text-on-surface-muted">
                  Full library spans core security, operational resilience, and AI governance standards.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto mb-24 max-w-7xl px-4 md:px-12">
          <div className="mb-10 flex flex-wrap items-baseline justify-between gap-4">
            <h2 className="font-raleway text-3xl font-bold tracking-tight text-on-surface md:text-4xl">
              Framework Library
            </h2>
            <span className="font-geist text-[11px] uppercase tracking-[0.3em] text-primary">
              Available now
            </span>
          </div>
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

        <section className="mx-auto mb-24 max-w-7xl px-4 md:px-12">
          <div className="mb-10 flex flex-wrap items-baseline justify-between gap-4">
            <h2 className="font-raleway text-3xl font-bold tracking-tight text-on-surface md:text-4xl">
              Upcoming
            </h2>
            <span className="font-geist text-[11px] uppercase tracking-[0.3em] text-on-surface-muted">
              On the roadmap — not yet in-product
            </span>
          </div>
          <FrameworkGrid>
            {UPCOMING_FRAMEWORK_TILE_DATA.map((framework) => (
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

        <section className="mx-auto mb-24 max-w-7xl px-4 md:px-12">
          <div className="rounded-sm bg-surface-container-high p-10 md:p-14">
            <h2 className="font-raleway text-3xl font-extrabold text-on-surface md:text-4xl">
              How Cypher Automates Maturity
            </h2>
            <div className="mt-8 space-y-8">
              <div className="flex gap-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary font-josefin text-xs font-bold text-on-primary">
                  1
                </div>
                <div>
                  <h3 className="font-raleway text-xl font-bold text-on-surface">
                    Conversational Signal Capture
                  </h3>
                  <p className="mt-2 font-montserrat text-sm leading-relaxed text-on-surface-muted">
                    Cypher asks focused questions and captures operational evidence in plain language,
                    so teams can move quickly without sacrificing structure.
                  </p>
                </div>
              </div>
              <div className="flex gap-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-container-highest font-josefin text-xs font-bold text-on-surface">
                  2
                </div>
                <div>
                  <h3 className="font-raleway text-xl font-bold text-on-surface">
                    Cross-Framework Mapping
                  </h3>
                  <p className="mt-2 font-montserrat text-sm leading-relaxed text-on-surface-muted">
                    Responses are reused across mapped controls, helping one assessment feed multiple
                    standards and reducing duplicate work for your team.
                  </p>
                </div>
              </div>
              <div className="flex gap-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-container-highest font-josefin text-xs font-bold text-on-surface">
                  3
                </div>
                <div>
                  <h3 className="font-raleway text-xl font-bold text-on-surface">
                    Actionable Roadmap Outputs
                  </h3>
                  <p className="mt-2 font-montserrat text-sm leading-relaxed text-on-surface-muted">
                    Results flow into dashboards and roadmap views so leadership sees where to focus
                    next, not just where gaps exist.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 text-center md:px-12">
          <h2 className="font-raleway text-4xl font-black text-on-surface md:text-5xl">
            Ready to begin?
          </h2>
          <p className="mt-6 font-montserrat text-base leading-relaxed text-on-surface-muted md:text-lg">
            Start your 14-day free trial of the Essential plan. No credit card required.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <ComingSoonTrigger
              source="frameworks_footer"
              className="inline-flex items-center gap-2 rounded-sm bg-gradient-to-r from-primary to-primary-deep px-10 py-4 font-josefin text-xs font-bold uppercase tracking-[0.22em] text-white shadow-glow-brand transition-all duration-300 motion-reduce:transition-none hover:shadow-glow-brand-lg active:scale-95"
            >
              Get Started &rarr;
            </ComingSoonTrigger>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-sm border border-outline/40 px-10 py-4 font-josefin text-xs font-bold uppercase tracking-[0.22em] text-on-surface transition-colors duration-300 motion-reduce:transition-none hover:border-primary hover:text-primary"
            >
              View Pricing
            </Link>
          </div>
          <div className="mt-12">
            <ContactCtaButton
              className="inline-flex items-center gap-2 rounded-sm bg-surface-container-highest px-8 py-3 font-josefin text-xs font-bold uppercase tracking-[0.22em] text-on-surface-muted transition-colors duration-300 hover:bg-surface-bright hover:text-on-surface"
              placement="frameworks_footer"
            >
              Talk to Founder
            </ContactCtaButton>
          </div>
        </section>
      </main>
    </MarketingShell>
  );
}
