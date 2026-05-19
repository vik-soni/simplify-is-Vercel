import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { ComingSoonTrigger } from "@/components/marketing/ComingSoonTrigger";

export const metadata: Metadata = {
  title: "Maturity Model | Simplify IS",
  description: "NIST CSF 2.0's four implementation tiers, applied to ISO 27001, NIST CSF 2.0, and APRA CPS 234. Understand how Cypher measures and improves your security maturity.",
  alternates: { canonical: "https://simplify.is/maturity-model" },
};

const tiers = [
  {
    num: "01",
    title: "Partial",
    body: "Cyber security risk is managed ad hoc. Awareness is limited, practices are reactive, and there is little organisational visibility across controls.",
    label: "Reactive",
    width: "w-1/4",
    offset: "",
  },
  {
    num: "02",
    title: "Risk Informed",
    body: "Risk-management practices are approved by leadership but are not yet established as organisation-wide policy. Decisions are informed but inconsistent.",
    label: "Approved",
    width: "w-2/4",
    offset: "md:-translate-y-4",
  },
  {
    num: "03",
    title: "Repeatable",
    body: "Risk management is formalised, expressed as organisation-wide policy, and updated regularly as the threat landscape and the business shift.",
    label: "Standardised",
    width: "w-3/4",
    offset: "md:-translate-y-8",
  },
  {
    num: "04",
    title: "Adaptive",
    body: "Continuous improvement, threat-informed defence, and predictive risk decisions integrated with strategic planning. The organisation learns from every incident.",
    label: "Predictive",
    width: "w-full",
    offset: "md:-translate-y-12",
    featured: true,
  },
];

export default function MaturityModelPage() {
  return (
    <MarketingShell>
      <main className="bg-surface">

        {/* ── Hero ── */}
        <header className="relative overflow-hidden px-4 pb-32 pt-48 md:px-12">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent" />
          </div>
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container-highest rounded-full">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span className="font-geist text-[10px] uppercase tracking-[0.2em] text-on-surface-muted">
                  NIST CSF 2.0 Implementation Tiers
                </span>
              </div>
              <h1 className="font-raleway text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-on-surface">
                Simplify IS{" "}
                <br />
                <span className="text-primary">Maturity Model</span>
              </h1>
              <p className="font-montserrat text-xl text-on-surface-muted max-w-xl leading-relaxed font-light">
                A data-driven methodology for continuous security evolution. We don&apos;t just assess
                status; we measure your organisation&apos;s posture and chart the path to predictable
                resilience.
              </p>
            </div>
            <div className="flex-1 relative">
              <div className="relative w-full aspect-square bg-surface-container-high rounded-sm overflow-hidden shadow-2xl">
                <div className="w-full h-full flex flex-col items-center justify-center gap-6 p-8 md:p-10">
                  <div className="font-geist text-[10px] text-primary uppercase tracking-[0.3em]">
                    Sample Maturity Benchmark
                  </div>
                  <div className="w-full max-w-[460px] rounded-sm bg-surface-container p-4">
                    <svg viewBox="0 0 360 360" className="w-full h-auto" role="img" aria-label="Radar chart comparing your score and industry score across six NIST CSF functions">
                      <polygon points="180,54 289,117 289,243 180,306 71,243 71,117" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
                      <polygon points="180,81 261,128 261,232 180,279 99,232 99,128" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
                      <polygon points="180,108 234,140 234,220 180,252 126,220 126,140" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
                      <polygon points="180,135 207,151 207,209 180,225 153,209 153,151" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
                      <line x1="180" y1="180" x2="180" y2="54" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                      <line x1="180" y1="180" x2="289" y2="117" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                      <line x1="180" y1="180" x2="289" y2="243" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                      <line x1="180" y1="180" x2="180" y2="306" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                      <line x1="180" y1="180" x2="71" y2="243" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                      <line x1="180" y1="180" x2="71" y2="117" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

                      <polygon points="180,103 221,156 215,214 180,239 115,217 130,151" fill="rgba(235,94,40,0.35)" stroke="rgba(235,94,40,0.95)" strokeWidth="2" />
                      <polygon points="180,92 234,149 240,223 180,247 105,223 113,141" fill="rgba(176,186,199,0.2)" stroke="rgba(176,186,199,0.9)" strokeWidth="2" strokeDasharray="4 4" />

                      <text x="180" y="43" textAnchor="middle" className="fill-on-surface-muted text-[10px] font-geist">Govern</text>
                      <text x="180" y="56" textAnchor="middle" className="fill-primary text-[8px] font-geist">You 2.4</text>
                      <text x="180" y="66" textAnchor="middle" className="fill-outline text-[8px] font-geist">Ind 2.8</text>
                      <text x="254" y="114" textAnchor="start" className="fill-on-surface-muted text-[10px] font-geist">Identify</text>
                      <text x="254" y="126" textAnchor="start" className="fill-primary text-[8px] font-geist">You 2.1</text>
                      <text x="254" y="136" textAnchor="start" className="fill-outline text-[8px] font-geist">Ind 2.6</text>
                      <text x="254" y="246" textAnchor="start" className="fill-on-surface-muted text-[10px] font-geist">Protect</text>
                      <text x="254" y="258" textAnchor="start" className="fill-primary text-[8px] font-geist">You 1.9</text>
                      <text x="254" y="268" textAnchor="start" className="fill-outline text-[8px] font-geist">Ind 2.7</text>
                      <text x="180" y="322" textAnchor="middle" className="fill-on-surface-muted text-[10px] font-geist">Detect</text>
                      <text x="180" y="334" textAnchor="middle" className="fill-primary text-[8px] font-geist">You 1.8</text>
                      <text x="180" y="344" textAnchor="middle" className="fill-outline text-[8px] font-geist">Ind 2.1</text>
                      <text x="106" y="246" textAnchor="end" className="fill-on-surface-muted text-[10px] font-geist">Respond</text>
                      <text x="106" y="258" textAnchor="end" className="fill-primary text-[8px] font-geist">You 2.3</text>
                      <text x="106" y="268" textAnchor="end" className="fill-outline text-[8px] font-geist">Ind 2.0</text>
                      <text x="106" y="114" textAnchor="end" className="fill-on-surface-muted text-[10px] font-geist">Recover</text>
                      <text x="106" y="126" textAnchor="end" className="fill-primary text-[8px] font-geist">You 2.2</text>
                      <text x="106" y="136" textAnchor="end" className="fill-outline text-[8px] font-geist">Ind 2.5</text>

                      <text x="188" y="137" className="fill-outline text-[8px] font-geist">1</text>
                      <text x="188" y="110" className="fill-outline text-[8px] font-geist">2</text>
                      <text x="188" y="83" className="fill-outline text-[8px] font-geist">3</text>
                      <text x="188" y="56" className="fill-outline text-[8px] font-geist">4</text>
                    </svg>
                    <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-[10px] font-geist uppercase tracking-[0.16em]">
                      <span className="inline-flex items-center gap-2 text-on-surface">
                        <span className="h-2 w-2 rounded-full bg-primary" />
                        This is you
                      </span>
                      <span className="inline-flex items-center gap-2 text-on-surface-muted">
                        <span className="h-2 w-2 rounded-full bg-outline" />
                        This is industry
                      </span>
                    </div>
                  </div>
                  <div className="w-full border-t border-outline/10 pt-4 flex justify-between text-[10px] font-geist text-outline">
                    <span>NIST 6-FUNCTION VIEW</span>
                    <span className="text-primary font-bold">YOU VS INDUSTRY</span>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-tr from-surface via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </header>

        {/* ── 4-Tier Hierarchy ── */}
        <section className="py-32 bg-surface-container-low">
          <div className="max-w-7xl mx-auto px-4 md:px-12">
            <div className="mb-24 space-y-4">
              <h2 className="font-raleway text-4xl font-bold tracking-tight text-on-surface">NIST CSF 2.0 Implementation Tiers</h2>
              <p className="font-montserrat text-on-surface-muted max-w-2xl font-light">
                Cypher measures organisational security against the four tiers defined by NIST CSF 2.0,
                each representing a leap in predictability and control. ISO 27001 and APRA CPS 234
                results are mapped onto the same scale so your maturity reads consistently across
                frameworks.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {tiers.map((tier) => (
                <div
                  key={tier.num}
                  className={`group relative p-8 rounded-sm flex flex-col justify-between min-h-[400px] transition-all duration-500 ${tier.offset} ${
                    tier.featured
                      ? "bg-primary/10 hover:bg-primary/20"
                      : "bg-surface-container-high hover:bg-surface-container-highest"
                  }`}
                >
                  <div>
                    <div className={`font-geist text-4xl font-black mb-6 ${tier.featured ? "text-primary" : "text-primary"}`}>
                      {tier.num}
                    </div>
                    <h3 className="font-raleway text-xl font-bold text-on-surface mb-4">{tier.title}</h3>
                    <p className="font-montserrat text-sm text-on-surface-muted leading-relaxed mb-6 font-light">{tier.body}</p>
                  </div>
                  <div className="space-y-3">
                    <div className="h-1 w-full bg-surface-container-lowest rounded-full overflow-hidden">
                      <div
                        className={`h-full ${tier.featured ? "bg-primary shadow-[0_0_10px_rgba(235,94,40,0.6)]" : "bg-primary"} ${tier.width}`}
                      />
                    </div>
                    <span className={`text-[10px] font-geist uppercase tracking-widest ${tier.featured ? "text-primary font-bold" : "text-outline"}`}>
                      {tier.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How Cypher Calculates Maturity ── */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute top-1/2 left-0 w-full h-1/2 bg-surface-container-low -z-10" style={{ transform: "skewY(3deg)", transformOrigin: "left" }} />
          <div className="max-w-7xl mx-auto px-4 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: "◎", title: "Conversational Signals", body: "Cypher captures evidence from your responses — process descriptions, control owners, review cadence — and turns them into tier signals." },
                  { icon: "⊕", title: "Auditable Trail", body: "Every answer, score, and recommendation is timestamped against the control it came from, ready for your next auditor." },
                  { icon: "⊡", title: "Cross-Framework Mapping", body: "Tier signals flow across ISO 27001:2022, NIST CSF 2.0, and APRA CPS 234 — fix a gap once, see it clear in every framework it satisfies." },
                  { icon: "◈", title: "Drift Awareness", body: "Reassess on your cadence and Cypher highlights where tiers have moved since the last assessment." },
                ].map((card, i) => (
                  <div
                    key={card.title}
                    className={`bg-surface-container-high p-8 rounded-sm space-y-4 ${i % 2 === 1 ? "mt-8" : ""}`}
                  >
                    <div className="text-primary text-3xl">{card.icon}</div>
                    <h4 className="font-raleway font-bold text-on-surface">{card.title}</h4>
                    <p className="text-sm text-on-surface-muted font-montserrat font-light">{card.body}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="order-1 lg:order-2 space-y-8">
              <div className="font-geist text-primary tracking-[0.3em] uppercase text-xs font-bold">The Cypher Engine</div>
              <h2 className="font-raleway text-5xl font-extrabold leading-tight text-on-surface">
                Quantifying Security Through Discussions.
              </h2>
              <p className="font-montserrat text-on-surface-muted text-lg leading-relaxed font-light">
                Maturity isn&apos;t an opinion; it&apos;s a calculation. Cypher scores every answer
                against the framework&apos;s tier criteria, so two assessments of the same control
                land at the same place.
              </p>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <span className="text-primary mt-1 text-xl">✓</span>
                  <div>
                    <strong className="text-on-surface block mb-1 font-raleway">Consistent Scoring</strong>
                    <p className="text-sm text-on-surface-muted font-montserrat font-light">
                      Tiers are derived from the conversation Cypher has with you — not a yes/no
                      survey — so the score reflects how the control actually runs.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-primary mt-1 text-xl">✓</span>
                  <div>
                    <strong className="text-on-surface block mb-1 font-raleway">Living Maturity</strong>
                    <p className="text-sm text-on-surface-muted font-montserrat font-light">
                      Your tier moves whenever you reassess, edit a finding, or capture new evidence —
                      so the score on screen reflects what you ran today, not what you ran last quarter.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ── Coming Soon ── */}
        <section className="py-32 bg-surface-container-low">
          <div className="max-w-7xl mx-auto px-4 md:px-12">
            <div className="mb-16 border-b border-outline/10 pb-4">
              <h2 className="text-xs font-geist font-bold text-primary uppercase tracking-[0.3em]">Next Horizon</h2>
              <h3 className="text-2xl font-raleway font-black text-on-surface mt-2 uppercase tracking-tight">Coming Soon</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-surface-container-high p-8 rounded-sm transition-all flex items-start gap-6">
                <div className="text-primary text-4xl flex-shrink-0">⊕</div>
                <div>
                  <h4 className="font-bold font-raleway text-on-surface mb-2 text-xl">Real-time signal capture</h4>
                  <p className="text-sm text-on-surface-muted leading-relaxed font-montserrat font-light">
                    Direct telemetry ingestion from your security stack to automate the assessment of
                    control effectiveness without manual intervention.
                  </p>
                </div>
              </div>
              <div className="bg-surface-container-high p-8 rounded-sm transition-all flex items-start gap-6">
                <div className="text-primary text-4xl flex-shrink-0">◈</div>
                <div>
                  <h4 className="font-bold font-raleway text-on-surface mb-2 text-xl">Evidence chaining</h4>
                  <p className="text-sm text-on-surface-muted leading-relaxed font-montserrat font-light">
                    Cryptographic linking of system logs and configuration data to specific compliance
                    requirements, creating an unbreakable audit trail.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="bg-surface px-4 py-24 text-center md:px-12">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-raleway text-4xl font-black text-on-surface mb-6">
              Start measuring your maturity today.
            </h2>
            <p className="text-on-surface-muted mb-10 font-montserrat font-light">
              Cypher is ready to guide your organisation through its first maturity assessment.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <ComingSoonTrigger
                source="maturity_model_footer"
                className="bg-gradient-to-br from-primary to-primary-deep text-[#1A1917] px-10 py-4 rounded-sm font-josefin font-bold uppercase text-sm tracking-[0.2em] shadow-glow-brand active:scale-95 transition-all"
              >
                Get Started
              </ComingSoonTrigger>
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
