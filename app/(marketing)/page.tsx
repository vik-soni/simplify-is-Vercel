import type { Metadata } from "next";
import Link from "next/link";
import { Globe, MapPinned } from "lucide-react";
import { MarketingShell } from "@/components/marketing/MarketingShell";

export const metadata: Metadata = {
  title: "Simplify IS | AI Security Assessment Platform",
  description:
    "Simplify IS gives you Cypher, an AI security consultant for ISO 27001 and NIST CSF maturity assessments.",
  alternates: { canonical: "https://simplify.is/" },
  openGraph: {
    title: "Simplify IS | AI Security Assessment Platform",
    description: "AI-driven security maturity assessments for modern teams.",
    url: "https://simplify.is/",
    type: "website",
    images: ["https://simplify.is/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Simplify IS | AI Security Assessment Platform",
    description: "AI-driven security maturity assessments for modern teams.",
    images: ["https://simplify.is/og-image.png"],
  },
};

export default function MarketingPage() {
  return (
    <MarketingShell>
      <main className="mx-auto max-w-7xl space-y-32 px-4 pb-32 pt-48 md:space-y-40 md:px-12">

        {/* ── Hero ── */}
        <section className="text-center space-y-12">
          <div className="inline-flex items-center px-4 py-1 rounded-full bg-surface-container-high text-primary uppercase font-geist text-[10px] tracking-[0.3em]">
            AI-Driven Security Consultant
          </div>
          <h1 className="text-7xl md:text-9xl font-raleway font-black text-on-surface leading-[0.9] max-w-5xl mx-auto" style={{ letterSpacing: "-0.02em" }}>
            Meet Cypher: The{" "}
            <span className="text-primary">AI Security Consultant.</span>
          </h1>
          <p className="max-w-3xl mx-auto text-on-surface-muted text-xl leading-relaxed font-montserrat font-light">
            Human consultants face scheduling conflicts and narrow specialisations. Cypher is always
            available, grounded in leading global frameworks — including ISO 27001:2022, NIST CSF 2.0,
            PCI DSS, and AI governance standards such as ISO 42001 — and gives you consistent, auditable
            advisory across every assessment.
          </p>
          <div className="flex justify-center pt-8">
            <Link
              href="/meet-cypher"
              className="bg-primary text-[#1A1917] px-12 py-5 rounded-sm font-raleway font-black uppercase text-sm tracking-widest hover:bg-[#ff6a33] transition-colors shadow-glow-brand"
            >
              Meet Cypher
            </Link>
          </div>
        </section>

        {/* ── Product Preview ── */}
        <section className="relative">
          <div className="absolute -inset-10 bg-primary/5 blur-[120px] rounded-full" />
          <div className="relative bg-surface-container-high rounded-sm p-12 shadow-2xl">
            <div className="flex justify-between items-center mb-4 border-b border-outline/5 pb-8">
              <div className="flex items-center gap-4">
                <h3 className="font-josefin font-bold text-lg uppercase tracking-widest text-on-surface">
                  Cypher Intelligence Interface
                </h3>
              </div>
              <span className="font-geist text-[10px] text-primary tracking-widest uppercase opacity-80">
                Sample Dashboard
              </span>
            </div>
            <p className="mb-12 text-[11px] font-geist uppercase tracking-[0.25em] text-on-surface-muted opacity-50">
              Illustrative — your dashboard will show your organisation&apos;s real scores.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              <div className="space-y-4">
                <span className="font-josefin text-[10px] text-on-surface-muted uppercase tracking-widest block opacity-50">
                  Current Maturity
                </span>
                <div className="text-6xl font-geist font-bold text-primary tracking-tighter">4.8</div>
                <div className="w-full h-px bg-surface-container-lowest overflow-hidden">
                  <div className="h-full bg-primary w-[96%]" />
                </div>
              </div>
              <div className="space-y-4">
                <span className="font-josefin text-[10px] text-on-surface-muted uppercase tracking-widest block opacity-50">
                  Framework Status
                </span>
                <div className="text-6xl font-geist font-bold text-on-surface tracking-tighter">98%</div>
                <div className="text-[10px] text-outline font-geist opacity-60 uppercase tracking-wider">
                  ISO + NIST ALIGNED
                </div>
              </div>
              <div className="space-y-4">
                <span className="font-josefin text-[10px] text-on-surface-muted uppercase tracking-widest block opacity-50">
                  Advisory Insights
                </span>
                <div className="text-6xl font-geist font-bold text-on-surface tracking-tighter">14</div>
                <div className="text-[10px] text-outline font-geist opacity-60 uppercase tracking-wider">
                  REMEDIAL_TASKS
                </div>
              </div>
              <div className="space-y-4">
                <span className="font-josefin text-[10px] text-on-surface-muted uppercase tracking-widest block opacity-50">
                  Audit State
                </span>
                <div className="text-5xl font-geist font-bold text-on-surface tracking-tighter">READY</div>
                <div className="text-[10px] text-outline font-geist opacity-60 uppercase tracking-wider">
                  EVIDENCE_SYNCED
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Why Cypher ── */}
        <section className="space-y-24" id="how-it-works">
          <div className="text-center max-w-2xl mx-auto space-y-6">
            <h2 className="font-raleway font-bold text-4xl text-on-surface tracking-tight">
              Not a chatbot, a consultant.
            </h2>
            <p className="text-on-surface-muted font-montserrat font-light leading-loose">
              Cypher is trained on globally recognised security and AI governance standards — including ISO 27001:2022,
              NIST CSF 2.0, PCI DSS, and ISO 42001 — with additional regional and payment frameworks in-product. Your assessments
              stay aligned to the versions auditors and boards ask about now.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
            {[
              {
                num: "01 / DIALOGUE",
                title: "Consistent Objectivity",
                body: "Every assessment follows the same rigorous methodology — the control catalogue, the scoring rubric, and the reasoning path — so two organisations asking the same question get the same answer.",
              },
              {
                num: "02 / CONTEXT",
                title: "Unified Knowledge Base",
                body: "Cypher bridges engineering and leadership. Controls map across your selected global standards — security, payment, and AI governance — so evidence and fixes surface everywhere the same risk appears.",
              },
              {
                num: "03 / CONTINUITY",
                title: "Maturity That Compounds",
                body: "Your maturity history is preserved between audits, so reassessments pick up where you left off — you see drift, not a blank slate.",
              },
            ].map((item) => (
              <div key={item.num} className="space-y-8">
                <div className="text-[10px] font-geist text-primary tracking-widest">{item.num}</div>
                <h5 className="font-raleway font-bold text-xl text-on-surface">{item.title}</h5>
                <p className="text-on-surface-muted text-sm leading-relaxed font-montserrat font-light">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Value Section ── */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-12">
            <h2 className="font-raleway font-bold text-5xl text-on-surface leading-tight tracking-tight" style={{ letterSpacing: "-0.02em" }}>
              Unwavering Intelligence.{" "}
              <br />
              <span className="text-primary">Zero Knowledge Gaps.</span>
            </h2>
            <p className="text-on-surface-muted leading-relaxed font-montserrat font-light text-lg">
              Cypher is a consistent, always-available second opinion. Security leads use it to
              move faster through assessments, close gaps in a structured order, and bring the
              same rigour to every framework they own.
            </p>
            <div className="space-y-6">
              {[
                {
                  title: "Industry-Standard Training",
                  body: "Cypher is trained on ISO 27001:2022, NIST CSF 2.0, PCI DSS, AI governance (e.g. ISO 42001, NIST AI RMF), and regional regulatory frameworks — updated as control libraries evolve.",
                },
                {
                  title: "Excellence Without Bias",
                  body: "No shortcuts, no variance between assessors — the same framework-grounded reasoning every time.",
                },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-5">
                  <div className="w-1 h-8 bg-primary flex-shrink-0 mt-1 rounded-full" />
                  <div>
                    <h6 className="font-bold text-on-surface text-sm uppercase tracking-wider font-raleway">
                      {item.title}
                    </h6>
                    <p className="text-sm text-on-surface-muted mt-1 font-montserrat font-light">
                      {item.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Chat preview */}
          <div className="bg-surface-container-high p-12 rounded-sm space-y-8">
            <div className="flex items-center gap-4 border-b border-outline/5 pb-8">
              <div className="w-10 h-10 bg-primary/5 rounded-full flex items-center justify-center">
                <span className="text-primary text-lg">◎</span>
              </div>
              <div>
                <span className="block text-[10px] text-outline uppercase font-geist tracking-widest">
                  Active Consultation
                </span>
                <span className="text-on-surface font-raleway font-bold text-sm">
                  Ask Cypher anything...
                </span>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-surface-container-high/40 p-6 rounded-sm text-sm italic text-on-surface-muted border-l border-primary/30 font-montserrat">
                &ldquo;How does our current VPC configuration align with APRA CPS 234 requirements?&rdquo;
              </div>
              <div className="bg-primary/5 p-6 rounded-sm text-sm">
                <div className="flex gap-2 items-center mb-4">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest font-josefin">
                    Advisory Note
                  </span>
                </div>
                <p className="text-on-surface leading-relaxed font-montserrat font-light">
                  Based on what you&apos;ve described, I&apos;ve identified a gap in log retention.
                  APRA CPS 234 paragraph 23 expects retention aligned to the sensitivity of the
                  data — you mentioned 30 days, but the financial records your teams log here
                  should be retained for 7 years. I&apos;ve flagged this in your roadmap so we can
                  confirm the control change.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Frameworks Grid ── */}
        <section className="space-y-20" id="frameworks">
          <div className="text-center">
            <h2 className="font-raleway font-bold text-4xl text-on-surface tracking-tight">
              Compliance Intelligence
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
              {
                title: "Global Standards",
                body: "Instant intelligence for ISO 27001, NIST CSF 2.0, PCI DSS, and AI governance frameworks. Cypher applies them with consistent logic across your data landscape.",
                cta: "Browse Modules",
                href: "/frameworks",
                Icon: Globe,
              },
              {
                title: "Regional & industry focus",
                body: "Australian prudential and uplift standards, payment card rules, and emerging AI governance — expressed in the same conversational assessment experience, with AI standards called out alongside regional baselines.",
                cta: "Browse Modules",
                href: "/frameworks",
                Icon: MapPinned,
              },
            ].map((card) => (
              <div
                key={card.title}
                className="bg-surface-container-high rounded-sm overflow-hidden flex h-full flex-col group transition-all duration-500"
              >
                <div className="h-40 bg-surface-container-high/40 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center opacity-10">
                    <div className="text-8xl font-raleway font-black text-primary">▦</div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-surface-container/80 backdrop-blur-sm border border-primary/30 flex items-center justify-center shadow-glow-brand">
                      <card.Icon className="w-9 h-9 text-primary" aria-hidden="true" strokeWidth={1.5} />
                    </div>
                  </div>
                </div>
                <div className="p-12 space-y-6 flex flex-1 flex-col">
                  <h3 className="font-raleway font-bold text-2xl tracking-tight text-on-surface">
                    {card.title}
                  </h3>
                  <p className="text-on-surface-muted text-sm leading-relaxed font-montserrat font-light">
                    {card.body}
                  </p>
                  <div className="pt-4 mt-auto">
                    <Link
                      href={card.href}
                      className="w-full py-4 border-b border-outline/10 text-on-surface-muted font-bold font-josefin text-[10px] tracking-[0.3em] hover:text-primary hover:border-primary transition-all uppercase text-center block"
                    >
                      {card.cta}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
    </MarketingShell>
  );
}
