import type { Metadata } from "next";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { PolicyScrollSpyNav } from "@/components/marketing/PolicyScrollSpyNav";
import { ContactCtaButton } from "@/components/marketing/ContactCtaButton";

export const metadata: Metadata = {
  title: "Privacy Policy | Simplify IS",
  description:
    "How Simplify IS collects, uses, stores, and protects personal information and assessment data under Australian privacy law.",
  alternates: { canonical: "https://simplify.is/privacy" },
};

const sections = [
  { id: "collection", navLabel: "1. Data Collection", num: "01" },
  { id: "usage", navLabel: "2. How We Use Data", num: "02" },
  { id: "isolation", navLabel: "3. Data Isolation", num: "03" },
  { id: "retention", navLabel: "4. Retention", num: "04" },
  { id: "rights", navLabel: "5. Your Rights", num: "05" },
];

export default function PrivacyPage() {
  return (
    <MarketingShell>
      <main className="mx-auto grid w-full max-w-7xl flex-grow grid-cols-1 gap-12 px-4 pb-24 pt-32 md:grid-cols-12 md:px-12">

        {/* ── Sidebar ── */}
        <aside className="md:col-span-4 lg:col-span-3 space-y-8">
          <div className="sticky top-32 space-y-8">
            <div className="bg-surface-container-low p-8 shadow-[0_20px_40px_rgba(0,0,0,0.4)] rounded-sm space-y-6">
              <div className="space-y-1">
                <h2 className="font-josefin text-xs uppercase tracking-widest text-primary font-bold">
                  Navigation
                </h2>
                <h3 className="font-raleway text-xl font-bold tracking-tight text-on-surface">
                  Policy Index
                </h3>
              </div>
              <PolicyScrollSpyNav sections={sections} />
            </div>

            <div className="bg-primary/5 p-8 border border-primary/20 rounded-sm">
              <p className="font-josefin text-[10px] uppercase tracking-[0.2em] text-primary mb-2">
                Effective Date
              </p>
              <p className="font-geist text-sm text-on-surface">January 01, 2026</p>
              <p className="font-josefin text-[10px] uppercase tracking-[0.2em] text-primary mt-6 mb-2">
                Jurisdiction
              </p>
              <p className="font-geist text-sm text-on-surface">
                Australia (Privacy Act 1988 (Cth), APPs)
              </p>
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
              Privacy <br />
              <span className="text-on-surface-muted">Policy.</span>
            </h1>
            <p className="font-montserrat text-xl text-on-surface-muted max-w-2xl leading-relaxed font-light">
              Simplify IS is designed for security-conscious teams and handles personal information in line
              with the Australian Privacy Principles (APPs), strict least-privilege access, and data
              isolation between organisations.
            </p>
          </header>

          {/* Section 01 */}
          <section className="space-y-8 scroll-mt-32" id="collection">
            <div className="flex items-baseline gap-4">
              <span className="font-geist text-4xl text-primary/40">01</span>
              <h2 className="font-raleway text-3xl font-bold tracking-tight text-on-surface">
                Data Collection
              </h2>
            </div>
            <div className="space-y-6 text-on-surface-muted font-montserrat leading-loose bg-surface-container-low p-8 rounded-sm shadow-[0_20px_40px_rgba(0,0,0,0.4)] font-light">
              <p>
                We collect only the minimum data required to provide account access and assessment
                functionality. This includes your name, business email address, and organisational
                context you provide during onboarding.
              </p>
              <p>
                Assessment conversations with Cypher are stored securely to enable session continuity
                and historical maturity tracking. No data is shared with third parties for commercial
                purposes.
              </p>
            </div>
          </section>

          {/* Section 02 */}
          <section className="space-y-8 scroll-mt-32" id="usage">
            <div className="flex items-baseline gap-4">
              <span className="font-geist text-4xl text-primary/40">02</span>
              <h2 className="font-raleway text-3xl font-bold tracking-tight text-on-surface">
                How We Use Data
              </h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {[
                {
                  icon: "◎",
                  title: "Platform Operations",
                  body: "Account authentication, session management, and assessment delivery. Your data powers your product experience, nothing else.",
                },
                {
                  icon: "⊕",
                  title: "Product Quality",
                  body: "Anonymised, aggregated telemetry and analytics are used for reliability and service improvement — never linked to individual users.",
                },
                {
                  icon: "◈",
                  title: "Security Monitoring",
                  body: "Access logs and audit trails are maintained for platform security and to satisfy Australian compliance requirements.",
                },
                {
                  icon: "⊡",
                  title: "Compliance Reporting",
                  body: "Your assessment outputs and maturity scores are yours alone. We do not share, sell, or license your assessment data to any party.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="bg-surface-container-high p-8 rounded-sm border border-outline/15"
                >
                  <div className="text-primary text-2xl mb-3">{item.icon}</div>
                  <h4 className="font-raleway font-bold text-on-surface mb-3">{item.title}</h4>
                  <p className="text-sm text-on-surface-muted leading-relaxed font-montserrat font-light">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 03 */}
          <section className="space-y-8 scroll-mt-32" id="isolation">
            <div className="flex items-baseline gap-4">
              <span className="font-geist text-4xl text-primary/40">03</span>
              <h2 className="font-raleway text-3xl font-bold tracking-tight text-on-surface">
                Data Isolation
              </h2>
            </div>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-transparent blur opacity-25 group-hover:opacity-50 transition duration-1000" />
              <div className="relative bg-surface-container-low p-10 rounded-sm space-y-6">
                <p className="font-montserrat text-on-surface leading-relaxed italic border-l-2 border-primary pl-6 font-light">
                  &ldquo;No assessment data provided to Cypher is used to train the underlying AI models.
                  Your organisational intelligence is your sovereign asset.&rdquo;
                </p>
                <div className="space-y-4 text-on-surface-muted text-sm leading-relaxed font-montserrat font-light">
                  <p>
                    Each organisation&apos;s data is stored in an isolated namespace within our Supabase
                    infrastructure with row-level security enabled on all tables. Cypher&apos;s context
                    is scoped strictly to your organisation&apos;s sessions.
                  </p>
                  <p>
                    We do not perform cross-tenant data analysis. Your assessment conversations, scores,
                    and uploaded documents are logically and technically separated from all other
                    customers at all times.
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
                Retention
              </h2>
            </div>
            <div className="bg-surface-container-low p-10 rounded-sm border border-outline/15">
              <div className="space-y-6">
                <h4 className="font-josefin text-xs uppercase tracking-widest text-primary">
                  Retention Schedule
                </h4>
                <p className="font-montserrat text-on-surface-muted leading-relaxed font-light">
                  Data is retained for the duration of your active subscription. Upon account
                  cancellation or termination, your data is held for the statutory minimum period
                  required under Australian law before secure deletion.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-geist text-sm">
                    <thead>
                      <tr className="border-b border-outline/15">
                        <th className="py-4 font-josefin font-medium uppercase text-on-surface-muted">
                          Data Type
                        </th>
                        <th className="py-4 font-josefin font-medium uppercase text-on-surface-muted">
                          Retention Period
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-on-surface-muted">
                      <tr className="border-b border-outline/10">
                        <td className="py-4">Account Data</td>
                        <td className="py-4">Duration of subscription + 90 days</td>
                      </tr>
                      <tr className="border-b border-outline/10">
                        <td className="py-4">Assessment Conversations</td>
                        <td className="py-4">Duration of subscription</td>
                      </tr>
                      <tr className="border-b border-outline/10">
                        <td className="py-4">Billing Records</td>
                        <td className="py-4">7 years (statutory requirement)</td>
                      </tr>
                      <tr>
                        <td className="py-4">Security Audit Logs</td>
                        <td className="py-4">12 months rolling</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          {/* Section 05 */}
          <section className="space-y-8 scroll-mt-32" id="rights">
            <div className="flex items-baseline gap-4">
              <span className="font-geist text-4xl text-primary/40">05</span>
              <h2 className="font-raleway text-3xl font-bold tracking-tight text-on-surface">
                Your Rights
              </h2>
            </div>
            <div className="bg-surface-container-highest p-10 rounded-sm border border-outline/15">
              <div className="space-y-6 font-montserrat text-on-surface-muted leading-relaxed font-light">
                <p>
                  Under the <em>Privacy Act 1988</em> (Cth) and the Australian Privacy Principles (APPs),
                  you may request access to and correction of personal information we hold about you,
                  subject to exceptions provided by law. You may request account deletion through the
                  product account management flow at any time.
                </p>
                <p>
                  For privacy enquiries or requests relating to your personal information, use the{" "}
                  <ContactCtaButton
                    className="text-primary font-geist underline underline-offset-2 hover:text-on-surface transition-colors"
                    placement="privacy_rights_inline"
                  >
                    Contact form
                  </ContactCtaButton>
                  . We aim to <strong>acknowledge</strong> requests within <strong>three working days</strong>.
                  Taking further action on a request — including verification and fulfilling access, correction,
                  or deletion — may take up to <strong>30 days</strong> where permitted by law.
                </p>
              </div>
            </div>
          </section>

          {/* Footer Row */}
          <div className="pt-12 border-t border-outline/15 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="space-y-2">
              <p className="font-raleway font-bold text-lg text-on-surface">Privacy questions?</p>
              <p className="font-montserrat text-on-surface-muted text-sm font-light">
                Reach out to our privacy team for any data-related enquiries.
              </p>
            </div>
            <ContactCtaButton
              className="bg-surface-container-high hover:bg-primary text-on-surface hover:text-[#1A1917] px-8 py-4 font-raleway font-bold transition-all duration-300 shadow-[0_20px_40px_rgba(0,0,0,0.4)] text-sm uppercase tracking-widest"
              placement="privacy_footer"
            >
              Contact Us
            </ContactCtaButton>
          </div>
        </article>
      </main>
    </MarketingShell>
  );
}
