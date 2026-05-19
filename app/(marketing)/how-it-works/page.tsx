import type { Metadata } from "next";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { ComingSoonTrigger } from "@/components/marketing/ComingSoonTrigger";
import { ContactCtaButton } from "@/components/marketing/ContactCtaButton";

export const metadata: Metadata = {
  title: "How It Works | Simplify IS",
  description: "See how Cypher guides teams through scoped, conversational security maturity assessments.",
  alternates: { canonical: "https://simplify.is/how-it-works" },
};

export default function HowItWorksPage() {
  return (
    <MarketingShell>
      <main className="pt-24">

        {/* ── Hero ── */}
        <section className="relative flex flex-col items-center overflow-hidden px-4 py-24 text-center md:px-12 md:py-32">
          <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-outline-variant rounded-full blur-[100px]" />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto">
            <span className="font-geist text-primary tracking-[0.2em] text-xs uppercase mb-6 block">
              The Methodology
            </span>
            <h1 className="font-raleway text-5xl md:text-7xl font-extrabold tracking-tight text-on-surface mb-8 leading-[1.1]">
              Practical Security Intelligence, Explained.
            </h1>
            <p className="font-montserrat text-lg md:text-xl text-on-surface-muted leading-relaxed max-w-2xl mx-auto">
              How Cypher transforms complex compliance into a continuous, conversational strategy.
            </p>
          </div>
        </section>

        {/* ── The Process ── */}
        <section className="space-y-32 px-4 py-24 md:px-12">

          {/* Step 1: Initialise */}
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
            <div className="w-full md:w-1/2 space-y-6">
              <span className="font-geist text-surface-container-highest text-4xl font-bold opacity-30">01</span>
              <h2 className="font-raleway text-4xl font-bold text-on-surface">Initialise</h2>
              <p className="text-on-surface-muted leading-relaxed text-lg font-montserrat font-light">
                We start with context. Cypher asks about your industry, size, frameworks, and
                controls already in place, then builds the assessment roadmap around what you
                actually run today.
              </p>
              <ul className="space-y-3 font-josefin text-on-surface-variant">
                <li className="flex items-center gap-3">
                  <span className="text-primary text-lg">◈</span>
                  Organisational Context Mapping
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-primary text-lg">◈</span>
                  Framework Alignment Selection
                </li>
              </ul>
            </div>
            <div className="w-full md:w-1/2 bg-surface-container-low p-4 rounded-sm shadow-2xl">
              <div className="w-full h-[400px] bg-surface-container rounded-sm overflow-hidden relative flex items-center justify-center">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-primary/40 rounded-full" />
                  <div className="absolute top-1/3 left-1/3 w-20 h-20 border border-primary/40 rounded-full" />
                  <div className="absolute top-1/2 left-1/2 w-12 h-12 bg-primary/20 rounded-full" />
                </div>
                <div className="relative z-10 text-center space-y-4 p-8">
                  <div className="font-geist text-xs text-primary uppercase tracking-widest">Context Mapping</div>
                  <p className="mx-auto max-w-sm text-[11px] leading-relaxed text-on-surface-muted">
                    Answers map to your <span className="text-on-surface">selected frameworks</span>,{" "}
                    <span className="text-on-surface">tech stack posture</span>,{" "}
                    <span className="text-on-surface">Threat Readiness narrative</span>, and{" "}
                    <span className="text-on-surface">peer benchmarks</span> — spanning security,
                    payments, and AI governance families.
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-[10px] font-geist">
                    {["Frameworks", "Tech stack", "Threat view", "Peer set"].map((item) => (
                      <div key={item} className="bg-surface-container-highest px-3 py-2 rounded-sm text-on-surface-muted">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Dialogue */}
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row-reverse items-center gap-16">
            <div className="w-full md:w-1/2 space-y-6">
              <span className="font-geist text-surface-container-highest text-4xl font-bold opacity-30">02</span>
              <h2 className="font-raleway text-4xl font-bold text-on-surface">Dialogue</h2>
              <p className="text-on-surface-muted leading-relaxed text-lg font-montserrat font-light">
                Compliance isn&apos;t a checklist; it&apos;s a conversation. Cypher conducts qualitative
                assessments through natural language, probing into the nuances of your operations to
                uncover true security maturity rather than surface-level &apos;Yes/No&apos; responses.
              </p>
              <p className="text-on-surface-muted leading-relaxed font-montserrat font-light text-sm">
                Allow 60 to 90 minutes for a first pass through a framework — you can pause and resume
                at any control without losing context.
              </p>
            </div>
            <div className="w-full md:w-1/2 bg-surface-container-low p-4 rounded-sm shadow-2xl">
              <div className="w-full h-[400px] bg-surface-container rounded-sm overflow-hidden relative p-8 space-y-4">
                <div className="font-geist text-xs text-outline uppercase tracking-widest mb-6">Active Consultation</div>
                <div className="bg-surface-container-high/40 p-4 rounded-sm border-l border-primary/40">
                  <p className="text-sm font-montserrat italic text-on-surface-muted">
                    &ldquo;How mature is your access control process for privileged accounts?&rdquo;
                  </p>
                </div>
                <div className="bg-primary/5 p-4 rounded-sm">
                  <div className="text-[10px] font-geist text-primary uppercase tracking-widest mb-2">Cypher Response</div>
                  <p className="text-xs font-montserrat text-on-surface leading-relaxed">
                    Based on your description, I&apos;m assessing this against ISO 27001:2022
                    A.5.16 Identity management and A.8.2 Privileged access rights. Your current
                    controls map to maturity level 3 — I&apos;ve identified two gaps in the PAM
                    process.
                  </p>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 h-1 bg-primary/60 rounded-full" />
                  <div className="flex-1 h-1 bg-primary/40 rounded-full" />
                  <div className="flex-1 h-1 bg-surface-container-high rounded-full" />
                </div>
                <div className="text-[10px] font-geist text-outline uppercase">Assessment Progress: 67%</div>
              </div>
            </div>
          </div>

          {/* Step 3: Monitor */}
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
            <div className="w-full md:w-1/2 space-y-6">
              <span className="font-geist text-surface-container-highest text-4xl font-bold opacity-30">03</span>
              <h2 className="font-raleway text-4xl font-bold text-on-surface">
                Monitor{" "}
                <span className="text-xs font-geist text-on-surface-muted bg-surface-container-highest px-2 py-1 ml-2">
                  Coming Soon
                </span>
              </h2>
              <p className="text-on-surface-muted leading-relaxed text-lg font-montserrat font-light">
                Security is dynamic. Our upcoming platform update will provide a persistent watchtower
                over your compliance landscape. With real-time gap analysis and maturity tracking in
                development, your strategy will evolve as fast as the threats you face.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface-container-high p-4 rounded-sm">
                  <span className="text-primary font-geist text-2xl">— / 5.0</span>
                  <p className="text-[10px] text-on-surface-muted uppercase tracking-wider font-josefin mt-1">
                    Continuous maturity scoring once the monitoring engine ships.
                  </p>
                </div>
                <div className="bg-surface-container-high p-4 rounded-sm">
                  <span className="text-primary font-geist text-xl">Drift Alerts</span>
                  <p className="text-[10px] text-on-surface-muted uppercase tracking-wider font-josefin mt-1">
                    Detect drift between reassessments without waiting for the next audit window.
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2 bg-surface-container-low p-4 rounded-sm shadow-2xl">
              <div className="w-full h-[400px] bg-surface-container rounded-sm overflow-hidden relative p-8">
                <div className="font-geist text-xs text-outline uppercase tracking-widest mb-6">Monitoring Dashboard</div>
                <div className="space-y-3">
                  {[
                    { label: "Access Control", score: 92, color: "bg-primary" },
                    { label: "Incident Response", score: 78, color: "bg-primary/70" },
                    { label: "Asset Management", score: 85, color: "bg-primary/85" },
                    { label: "Cryptography", score: 60, color: "bg-outline/60" },
                  ].map((item) => (
                    <div key={item.label} className="space-y-1">
                      <div className="flex justify-between text-[10px] font-geist">
                        <span className="text-on-surface-muted uppercase tracking-wider">{item.label}</span>
                        <span className="text-primary">{item.score}%</span>
                      </div>
                      <div className="h-1 bg-surface-container-high rounded-full overflow-hidden">
                        <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.score}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="absolute bottom-8 left-8 right-8 bg-surface-container-highest rounded-sm p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-outline/40 rounded-full animate-pulse" />
                    <span className="text-[10px] font-geist text-outline uppercase tracking-widest">
                      Continuous monitoring — coming soon
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* ── Core Architecture (Bento Grid) ── */}
        <section className="bg-surface-container-low px-4 py-32 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="font-raleway text-4xl font-bold text-on-surface mb-4">Core Architecture</h2>
              <div className="h-px w-24 bg-primary mx-auto" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Card 1 — wide */}
              <div className="md:col-span-2 bg-surface-container-high p-10 rounded-sm flex flex-col justify-between hover:bg-surface-container-highest transition-all duration-300">
                <div>
                  <div className="text-primary text-4xl mb-6">◎</div>
                  <h3 className="font-raleway text-3xl font-bold text-on-surface mb-4">Cypher — The Engine</h3>
                  <p className="text-on-surface-muted leading-relaxed max-w-xl font-montserrat font-light">
                    Cypher scores each control&apos;s posture using the semantics of the framework you chose
                    — for example{" "}
                    <span className="text-on-surface">NIST CSF implementation tiers on a 1–4 ladder</span>,{" "}
                    <span className="text-on-surface">ISO 27001 conformity with nonconformities and opportunities for improvement</span>,{" "}
                    and <span className="text-on-surface">dedicated AI governance treatments</span> (ISO 42001 / AI RMF) where those standards apply — so dashboards match auditor language.
                  </p>
                </div>
                <div className="mt-8 flex gap-4">
                  <span className="px-3 py-1 bg-surface-container-highest rounded-sm font-geist text-[10px] text-primary">
                    Maturity Metrics
                  </span>
                  <span className="px-3 py-1 bg-surface-container-highest rounded-sm font-geist text-[10px] text-primary">
                    Framework-Native Scoring
                  </span>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-surface-container-high p-10 rounded-sm hover:bg-surface-container-highest transition-all duration-300">
                <div className="text-primary text-4xl mb-6">⟁</div>
                <h3 className="font-raleway text-2xl font-bold text-on-surface mb-4">Strategic Alignment</h3>
                <p className="text-on-surface-muted leading-relaxed text-sm font-montserrat font-light">
                  Every assessment produces a board-ready snapshot — maturity by framework, top
                  gaps, and the uplift plan to close them — in language a CEO or audit committee
                  can read.
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-surface-container-highest p-10 rounded-sm">
                <div className="text-primary text-4xl mb-6">⊕</div>
                <h4 className="font-josefin font-semibold text-on-surface text-xl mb-3">Immutable Evidence</h4>
                <p className="text-on-surface-muted text-sm leading-relaxed font-montserrat font-light">
                  Every answer, score, and comment is timestamped and tied to the exact control it
                  came from — so your next auditor starts with the evidence already laid out.
                </p>
              </div>

              {/* Card 4 — CTA card, wide */}
              <div className="md:col-span-2 bg-primary p-10 rounded-sm flex flex-col md:flex-row items-center gap-8 overflow-hidden relative">
                <div className="relative z-10 w-full md:w-2/3">
                  <h3 className="font-raleway text-3xl font-extrabold text-[#1A1917] mb-4">
                    Start your first consultation
                  </h3>
                  <p className="text-[#1A1917]/80 leading-relaxed mb-6 font-montserrat font-light">
                    Start with a full <strong>NIST CSF 2.0</strong> conversational baseline — always included — then optionally add ISO 27001, PCI DSS, or AI-focused frameworks without redoing groundwork.
                  </p>
                  <ComingSoonTrigger
                    source="how_it_works_trial"
                    className="inline-block bg-[#1A1917] text-[#FFFCF2] px-8 py-3 rounded-sm font-bold font-josefin hover:bg-surface-container-highest transition-colors text-sm uppercase tracking-widest"
                  >
                    Start Trial
                  </ComingSoonTrigger>
                </div>
                <div className="w-full md:w-1/3 opacity-20 text-[120px] text-[#1A1917] leading-none">
                  ✦
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="bg-surface px-4 py-32 text-center md:px-12">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-raleway text-4xl md:text-5xl font-extrabold text-on-surface mb-8">
              Ready to start your first consultation?
            </h2>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <ComingSoonTrigger
                source="how_it_works_footer"
                className="bg-primary text-[#1A1917] px-10 py-4 rounded-sm font-bold font-josefin text-sm uppercase tracking-widest hover:bg-[#ff6a33] transition-colors shadow-glow-brand"
              >
                Get Started
              </ComingSoonTrigger>
              <ContactCtaButton
                className="bg-surface-container-highest text-on-surface-muted px-10 py-4 rounded-sm font-bold font-josefin text-sm uppercase tracking-widest hover:bg-surface-bright transition-colors"
                placement="hiw_footer"
              >
                Contact Us
              </ContactCtaButton>
            </div>
          </div>
        </section>

      </main>
    </MarketingShell>
  );
}
