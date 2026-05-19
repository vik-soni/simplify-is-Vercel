import type { Metadata } from "next";
import Link from "next/link";
import { Layers, ShieldCheck, FileSearch } from "lucide-react";
import { MarketingShell } from "@/components/marketing/MarketingShell";

export const metadata: Metadata = {
  title: "Meet Cypher | Simplify IS",
  description: "Meet Cypher, your AI security consultant for practical maturity assessments.",
  alternates: { canonical: "https://simplify.is/meet-cypher" },
};

export default function MeetCypherPage() {
  return (
    <MarketingShell>
      <main className="bg-surface">

        {/* ── Hero ── */}
        <section className="mx-auto max-w-7xl px-4 pb-20 pt-32 text-center md:px-12">
          <h1 className="font-raleway text-6xl md:text-8xl font-black tracking-tighter text-on-surface mb-6 leading-none">
            MEET <span className="text-primary">CYPHER</span>
          </h1>
          <p className="font-josefin text-xl md:text-2xl text-on-surface-muted max-w-3xl mx-auto mb-4 leading-relaxed italic">
            The intelligence that is{" "}
            <span className="text-on-surface not-italic font-bold">Always On, Always Framework-Grounded.</span>
          </p>
          <p className="font-montserrat text-base md:text-lg text-outline max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Trained on ISO 27001:2022, NIST CSF 2.0, payment standards (PCI DSS), Australian prudential and uplift baselines where applicable, plus AI governance frameworks (ISO 42001, NIST AI RMF, AUVA ISS). One consultant voice — grounded in every standard you operate.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/signup"
              className="bg-gradient-to-br from-primary to-primary-deep text-[#1A1917] px-10 py-5 font-josefin font-bold text-lg rounded-sm shadow-glow-brand hover:scale-105 transition-all duration-300"
            >
              Get Started
            </Link>
          </div>
        </section>

        {/* ── Conversational Interface Mockup ── */}
        <section className="group relative mx-auto max-w-5xl px-4 pb-20 md:px-12">
          <div className="absolute -inset-4 bg-primary/10 blur-3xl rounded-full opacity-50 group-hover:opacity-70 transition-opacity" />
          <div className="relative bg-surface-container-high rounded-sm overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.6)]">

            {/* Mockup Header */}
            <div className="bg-surface-container-highest px-8 py-4 flex justify-between items-center border-b border-outline/10">
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/40" />
                <div className="w-3 h-3 rounded-full bg-primary/50" />
              </div>
              <div className="font-geist text-sm text-outline tracking-widest uppercase font-bold">
                Assessment Preview
              </div>
              <div className="w-5" />
            </div>

            {/* Chat Canvas */}
            <div className="p-8 md:p-12 space-y-12">

              {/* User Prompt */}
              <div className="flex justify-end ml-auto max-w-xl">
                <div className="bg-surface-container-high p-6 rounded-sm rounded-tr-none">
                  <p className="font-montserrat text-on-surface-muted text-sm leading-relaxed">
                    Cypher, can we begin an evaluation of our NIST CSF 2.0 alignment? Let&apos;s start
                    with Asset Management.
                  </p>
                </div>
              </div>

              {/* Cypher Response */}
              <div className="flex gap-6 max-w-3xl">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-glow-brand">
                    <span className="font-raleway font-black text-[#1A1917] text-lg">C</span>
                  </div>
                </div>
                <div className="space-y-6">
                  <h3 className="font-josefin text-primary font-bold text-lg tracking-wide uppercase">
                    Cypher AI Analysis
                  </h3>
                  <div className="font-montserrat text-on-surface leading-relaxed space-y-4 font-light">
                    <p>
                      Let&apos;s look at{" "}
                      <strong className="text-primary">ID.AM-01</strong>:{" "}
                      <em className="text-on-surface-muted">
                        &apos;Physical devices and systems within the organisation are inventoried.&apos;
                      </em>{" "}
                      How do you currently track and manage your physical hardware assets?
                    </p>
                  </div>
                </div>
              </div>

              {/* User Follow-up */}
              <div className="flex justify-end ml-auto max-w-xl">
                <div className="bg-surface-container-high p-6 rounded-sm rounded-tr-none">
                  <p className="font-montserrat text-on-surface-muted text-sm leading-relaxed">
                    We have a centralised asset management database (CMDB) for servers and networking
                    gear, but mobile devices are tracked in a separate spreadsheet that&apos;s updated quarterly.
                  </p>
                </div>
              </div>

              {/* Cypher Assessment Note */}
              <div className="flex gap-6 max-w-3xl">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-glow-brand">
                    <span className="font-raleway font-black text-[#1A1917] text-lg">C</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-josefin text-primary font-bold text-lg tracking-wide uppercase">
                    Assessment Note
                  </h3>
                  <div className="font-montserrat text-on-surface leading-relaxed font-light">
                    <p>
                      Based on that, I&apos;ve assessed this at{" "}
                      <strong className="text-primary">Tier 3 (Consistent)</strong> on NIST&apos;s CSF ladder. While you
                      have a centralised process for core infrastructure, the fragmented tracking for
                      mobile devices introduces a visibility lag. Advancing toward Tier 4 suggests
                      integrating your mobile device management (MDM) signals directly into your primary
                      CMDB for real-time inventory.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                      <div className="bg-surface-container p-4 rounded-sm border-l-2 border-primary">
                        <div className="text-[10px] font-geist text-outline mb-1 uppercase tracking-tighter">
                          Implementation tier
                        </div>
                        <div className="text-2xl font-raleway font-bold text-on-surface">Tier 3</div>
                      </div>
                      <div className="bg-surface-container p-4 rounded-sm border-l-2 border-outline/40">
                        <div className="text-[10px] font-geist text-outline mb-1 uppercase tracking-tighter">
                          Finding
                        </div>
                        <div className="text-2xl font-raleway font-bold text-on-surface">CMDB GAP</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Input Simulation */}
              <div className="pt-8 border-t border-outline/10">
                <div className="flex items-center gap-4 bg-surface-container-highest px-6 py-4 rounded-full">
                  <span className="text-outline font-geist text-xs">{">"}_</span>
                  <span className="text-outline font-montserrat text-sm font-light">
                    Ask Cypher about a control, a policy, or a gap you&apos;re working on...
                  </span>
                  <div className="ml-auto w-1 h-6 bg-primary animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Persona Traits ── */}
        <section className="mx-auto max-w-7xl px-4 py-24 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                Icon: Layers,
                title: "Framework-Native Reasoning",
                body: "Cypher reasons directly in ISO 27001:2022 and NIST CSF 2.0 control language — not generic security prose translated after the fact.",
              },
              {
                Icon: ShieldCheck,
                title: "Your Data Stays Yours",
                body: "Every assessment runs in a tenant-isolated vault. No cross-customer training, no silent data reuse, auditable on request.",
              },
              {
                Icon: FileSearch,
                title: "Evidence-Backed Recommendations",
                body: "Every finding cites the exact control, clause, and conversation turn it came from — your next audit starts with the trail already laid.",
              },
            ].map((trait) => (
              <div key={trait.title} className="space-y-4">
                <div className="text-primary">
                  <trait.Icon className="w-9 h-9" aria-hidden="true" strokeWidth={1.5} />
                </div>
                <h4 className="font-josefin font-bold text-on-surface text-xl">{trait.title}</h4>
                <p className="font-montserrat text-on-surface-muted text-sm leading-relaxed font-light">
                  {trait.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Designed For Leaders ── */}
        <section className="bg-surface-container-low px-4 py-20 md:px-12">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="max-w-md">
              <h2 className="font-raleway text-4xl font-bold mb-6 text-on-surface">
                Designed for{" "}
                <span className="italic text-primary">cyber executives and leaders</span>
                <span className="text-primary">.</span>
              </h2>
              <p className="font-montserrat text-on-surface-muted leading-relaxed mb-8 font-light">
                Cypher is built for the people who run security day-to-day — CISOs, security
                managers, GRC leads. It handles the structured parts of an assessment so you can
                spend your time on the judgment calls only you can make.
              </p>
            </div>

            {/* Sample assessment-status tile */}
            <div className="relative w-full md:w-1/2">
              <div className="w-full h-80 bg-surface-container-high rounded-sm overflow-hidden flex items-center justify-center">
                <div className="text-center space-y-6 p-8">
                  <div className="font-geist text-[10px] text-primary uppercase tracking-[0.3em]">
                    Sample — ISO 27001:2022 Assessment
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Org Controls", state: "Complete" },
                      { label: "People", state: "Complete" },
                      { label: "Physical", state: "In Progress" },
                      { label: "Tech A", state: "In Progress" },
                      { label: "Tech B", state: "Not Started" },
                      { label: "Annex A", state: "Not Started" },
                    ].map((domain) => (
                      <div
                        key={domain.label}
                        className="bg-surface-container-highest p-3 rounded-sm text-center"
                      >
                        <div
                          className={`w-2 h-2 rounded-full mx-auto mb-2 ${
                            domain.state === "Complete"
                              ? "bg-green-500"
                              : domain.state === "In Progress"
                              ? "bg-primary"
                              : "bg-outline/50"
                          }`}
                        />
                        <div className="font-geist text-[9px] text-on-surface-muted uppercase tracking-wider">
                          {domain.label}
                        </div>
                        <div className="font-geist text-[8px] text-outline uppercase mt-1">
                          {domain.state}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="font-geist text-[10px] text-outline uppercase tracking-widest">
                    Sample assessment view
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low/40 to-transparent pointer-events-none rounded-sm" />
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="bg-surface px-4 py-24 text-center md:px-12">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-raleway text-4xl font-black text-on-surface mb-6">
              Begin your first consultation.
            </h2>
            <p className="text-on-surface-muted mb-10 font-montserrat font-light">
              Cypher is ready to guide your organisation through its first maturity assessment.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="bg-gradient-to-br from-primary to-primary-deep text-[#1A1917] px-10 py-4 rounded-sm font-josefin font-bold uppercase text-sm tracking-[0.2em] shadow-glow-brand active:scale-95 transition-all"
              >
                Get Started
              </Link>
              <Link
                href="/how-it-works"
                className="bg-surface-container-highest text-on-surface-muted px-10 py-4 rounded-sm font-josefin font-bold uppercase text-sm tracking-[0.2em] hover:bg-surface-bright transition-all"
              >
                How It Works
              </Link>
            </div>
          </div>
        </section>

      </main>
    </MarketingShell>
  );
}
