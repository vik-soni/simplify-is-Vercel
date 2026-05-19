import type { Metadata } from "next";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { PolicyScrollSpyNav } from "@/components/marketing/PolicyScrollSpyNav";
import { ContactCtaButton } from "@/components/marketing/ContactCtaButton";

export const metadata: Metadata = {
  title: "Terms of Service | Simplify IS",
  description:
    "Review Simplify IS terms of service and acceptable use for organisations operating in Australia and internationally.",
  alternates: { canonical: "https://simplify.is/terms" },
};

const sections = [
  {
    id: "introduction",
    num: "01",
    navLabel: "1. Acceptance",
    title: "Purpose & Acceptance",
    content: (
      <>
        <p>
          By accessing or using Simplify IS (the &ldquo;Service&rdquo;), you agree to be bound by these
          Terms of Service. Simplify IS provides a platform for organisations to assess cyber security
          maturity with Cypher acting as an automated AI consultant.
        </p>
        <p>
          The Service is designed for professional use by organisations to manage security frameworks
          and governance protocols. All interactions with the Service are governed by these terms as
          established by Simplify IS (Australia).
        </p>
      </>
    ),
  },
  {
    id: "account",
    num: "02",
    navLabel: "2. Access Tiers",
    title: "Access Tiers",
    content: null,
  },
  {
    id: "cypher",
    num: "03",
    navLabel: "3. Cypher AI",
    title: "Cypher & AI Advice",
    content: null,
  },
  {
    id: "retention",
    num: "04",
    navLabel: "4. Data Retention",
    title: "Data Retention",
    content: null,
  },
  {
    id: "liability",
    num: "05",
    navLabel: "5. Liability",
    title: "Limitation of Liability",
    content: null,
  },
];

export default function TermsPage() {
  return (
    <MarketingShell>
      <main className="mx-auto grid w-full max-w-7xl flex-grow grid-cols-1 gap-12 px-4 pb-24 pt-32 md:grid-cols-12 md:px-12">

        {/* ── Sidebar / Table of Contents ── */}
        <aside className="md:col-span-4 lg:col-span-3 space-y-8">
          <div className="sticky top-32 space-y-8">
            <div className="bg-surface-container-low p-8 shadow-[0_20px_40px_rgba(0,0,0,0.4)] rounded-sm space-y-6">
              <div className="space-y-1">
                <h2 className="font-josefin text-xs uppercase tracking-widest text-primary font-bold">
                  Navigation
                </h2>
                <h3 className="font-raleway text-xl font-bold tracking-tight text-on-surface">
                  Legal Index
                </h3>
              </div>
              <PolicyScrollSpyNav sections={sections.map((s) => ({ id: s.id, navLabel: s.navLabel }))} />
            </div>

            <div className="bg-primary/5 p-8 border border-primary/20 rounded-sm">
              <p className="font-josefin text-[10px] uppercase tracking-[0.2em] text-primary mb-2">
                Effective Date
              </p>
              <p className="font-geist text-sm text-on-surface">January 01, 2026</p>
              <p className="font-josefin text-[10px] uppercase tracking-[0.2em] text-primary mt-6 mb-2">
                Version
              </p>
              <p className="font-geist text-sm text-on-surface">v1.0 · 2026</p>
            </div>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <article className="md:col-span-8 lg:col-span-9 space-y-20">
          <header className="space-y-6">
            <span className="font-geist text-primary text-sm tracking-tighter uppercase">
              Effective January 2026
            </span>
            <h1 className="font-raleway text-5xl md:text-7xl font-black tracking-tighter leading-none text-on-surface">
              Terms of <br />
              <span className="text-on-surface-muted">Service.</span>
            </h1>
            <p className="font-montserrat text-xl text-on-surface-muted max-w-2xl leading-relaxed font-light">
              This document constitutes a binding legal agreement between you (the User) and Simplify IS,
              including its centralised AI agent, Cypher.
            </p>
          </header>

          {/* Section 01 */}
          <section className="space-y-8 scroll-mt-32" id="introduction">
            <div className="flex items-baseline gap-4">
              <span className="font-geist text-4xl text-primary/40">01</span>
              <h2 className="font-raleway text-3xl font-bold tracking-tight text-on-surface">
                Purpose &amp; Acceptance
              </h2>
            </div>
            <div className="space-y-6 text-on-surface-muted font-montserrat leading-loose bg-surface-container-low p-8 rounded-sm shadow-[0_20px_40px_rgba(0,0,0,0.4)] font-light">
              <p>
                By accessing or using Simplify IS (the &ldquo;Service&rdquo;), you agree to be bound by
                these Terms of Service. Simplify IS provides a platform for organisations to assess cyber
                security maturity with Cypher acting as an automated AI consultant.
              </p>
              <p>
                The Service is designed for professional use by organisations to manage security
                frameworks and governance protocols. All interactions with the Service are governed by
                these terms as established by Simplify IS (Australia).
              </p>
            </div>
          </section>

          {/* Section 02 */}
          <section className="space-y-8 scroll-mt-32" id="account">
            <div className="flex items-baseline gap-4">
              <span className="font-geist text-4xl text-primary/40">02</span>
              <h2 className="font-raleway text-3xl font-bold tracking-tight text-on-surface">
                Access Tiers
              </h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-surface-container-high p-8 rounded-sm border border-outline/15">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-primary text-2xl">⊕</span>
                  <h4 className="font-raleway font-bold text-on-surface">Multi-User Access</h4>
                </div>
                <p className="text-sm text-on-surface-muted leading-relaxed font-montserrat font-light">
                  While single-user accounts are available on the Essential tier, all multi-user access
                  and organisational collaboration requires an active Professional or Enterprise tier
                  subscription.
                </p>
              </div>
              <div className="bg-surface-container-high p-8 rounded-sm border border-outline/15">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-primary text-2xl">◈</span>
                  <h4 className="font-raleway font-bold text-on-surface">Entity Responsibility</h4>
                </div>
                <p className="text-sm text-on-surface-muted leading-relaxed font-montserrat font-light">
                  The subscribing organisation is responsible for all activities occurring under its
                  account, ensuring internal security compliance matches the platform&apos;s requirements.
                </p>
              </div>
            </div>
          </section>

          {/* Section 03 */}
          <section className="space-y-8 scroll-mt-32" id="cypher">
            <div className="flex items-baseline gap-4">
              <span className="font-geist text-4xl text-primary/40">03</span>
              <h2 className="font-raleway text-3xl font-bold tracking-tight text-on-surface">
                Cypher &amp; AI Advice
              </h2>
            </div>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-transparent blur opacity-25 group-hover:opacity-50 transition duration-1000" />
              <div className="relative bg-surface-container-low p-10 rounded-sm space-y-6">
                <p className="font-montserrat text-on-surface leading-relaxed italic border-l-2 border-primary pl-6 font-light">
                  &ldquo;Cypher is designed to provide security assessment and advice based on current
                  industry frameworks. No user data provided to the Service is used to train our
                  underlying AI models.&rdquo;
                </p>
                <div className="space-y-4 text-on-surface-muted text-sm leading-relaxed font-montserrat font-light">
                  <p>
                    The model is provided strictly for self-assessment purposes. Users and their
                    organisations are solely responsible for their own decisions, implementations, and
                    final security posture based on the advice provided by Cypher.
                  </p>
                  <p>
                    Simplify IS maintains a strict policy of data isolation; your organisational
                    intelligence remains yours alone and is never fed back into the centralised learning
                    engine.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 04 */}
          <section className="space-y-8 scroll-mt-32" id="retention">
            <div className="flex items-baseline gap-4">
              <span className="font-geist text-4xl text-primary/40">04</span>
              <h2 className="font-raleway text-3xl font-bold tracking-tight text-on-surface">
                Data Retention
              </h2>
            </div>
            <div className="bg-surface-container-low p-10 rounded-sm border border-outline/15">
              <div className="space-y-6">
                <h4 className="font-josefin text-xs uppercase tracking-widest text-primary">
                  Retention Policy
                </h4>
                <p className="font-montserrat text-on-surface-muted leading-relaxed font-light">
                  Data ingested into the Simplify IS platform is retained while your user account remains
                  active. After account termination, data is kept for the minimum period required under
                  applicable Australian law and, where relevant, other jurisdictions, to meet financial
                  record-keeping and security auditing obligations.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-geist text-sm">
                    <thead>
                      <tr className="border-b border-outline/15">
                        <th className="py-4 font-josefin font-medium uppercase text-on-surface-muted">
                          Status
                        </th>
                        <th className="py-4 font-josefin font-medium uppercase text-on-surface-muted">
                          Policy
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-on-surface-muted">
                      <tr className="border-b border-outline/10">
                        <td className="py-4">Active Account</td>
                        <td className="py-4">Indefinite (Duration of Service)</td>
                      </tr>
                      <tr>
                        <td className="py-4">Inactive / Terminated</td>
                        <td className="py-4">Statutory Minimum + Audit Grace Period</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          {/* Section 05 */}
          <section className="space-y-8 scroll-mt-32" id="liability">
            <div className="flex items-baseline gap-4">
              <span className="font-geist text-4xl text-primary/40">05</span>
              <h2 className="font-raleway text-3xl font-bold tracking-tight text-on-surface">
                Limitation of Liability
              </h2>
            </div>
            <div className="bg-surface-container-highest p-10 rounded-sm border border-outline/15">
              <p className="font-montserrat text-on-surface-muted leading-loose mb-6 text-sm font-light">
                SIMPLIFY IS TAKES NO RESPONSIBILITY FOR ANY LOSS EXPERIENCED, FINANCIAL OR OTHERWISE,
                RESULTING FROM THE USE OF THE SERVICE OR THE ADVICE RENDERED BY CYPHER. USERS
                ACKNOWLEDGE THAT THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; WITHOUT WARRANTY OF ANY
                KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY,
                FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
              </p>
              <p className="font-montserrat text-on-surface-muted leading-loose text-sm font-light">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, SIMPLIFY IS SHALL NOT BE LIABLE FOR ANY
                INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES RESULTING FROM UNAUTHORISED ACCESS,
                ALTERATION OF DATA, OR RELIANCE ON AUTOMATED SECURITY MATURITY ASSESSMENTS.
              </p>
            </div>
          </section>

          {/* Footer Row */}
          <div className="pt-12 border-t border-outline/15 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="space-y-2">
              <p className="font-raleway font-bold text-lg text-on-surface">Need clarification?</p>
              <p className="font-montserrat text-on-surface-muted text-sm font-light">
                Our support team is available for platform-related enquiries.
              </p>
            </div>
            <ContactCtaButton
              className="bg-surface-container-high hover:bg-primary text-on-surface hover:text-[#1A1917] px-8 py-4 font-raleway font-bold transition-all duration-300 shadow-[0_20px_40px_rgba(0,0,0,0.4)] text-sm uppercase tracking-widest"
              placement="terms_footer"
            >
              Contact Support
            </ContactCtaButton>
          </div>
        </article>
      </main>
    </MarketingShell>
  );
}
