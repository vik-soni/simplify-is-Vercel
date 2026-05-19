/**
 * Framework library — single source of truth for the 9 frameworks rendered
 * on onboarding Step 3, the public Frameworks page, the public Pricing
 * add-ons grid, and the signup-time pre-selection grid.
 *
 * Framework metadata copy and order are locked by Agent 11 §1.7. If wording
 * changes, this constant is the only place to update.
 */

export type FrameworkPlan = "essential" | "professional";

export interface FrameworkTileData {
  id: string;
  name: string;
  badge: string;
  description: string;
  /** True for NIST CSF 2.0 — pre-selected and locked across all plans. */
  locked?: boolean;
  /** Plan tier required to access this framework. */
  plan: FrameworkPlan;
}

export const NIST_FRAMEWORK_ID = "nist_csf_2_0";

export const MAX_PROFESSIONAL_ADDITIONAL = 3;

/** Marketing-only “coming soon” tiles (not selectable in onboarding). */
export const UPCOMING_FRAMEWORK_TILE_DATA: ReadonlyArray<FrameworkTileData> = [
  {
    id: "soc_2_placeholder",
    name: "SOC 2",
    badge: "UPCOMING",
    description:
      "Trust Services Criteria alignment for availability, confidentiality, processing integrity, privacy and security — common board and customer assurance ask.",
    plan: "professional",
  },
  {
    id: "aus_ism_placeholder",
    name: "ISM (Australian Government)",
    badge: "UPCOMING",
    description:
      "The Australian Government Information Security Manual — baseline controls and guidance for protecting official information and systems.",
    plan: "professional",
  },
  {
    id: "hipaa_placeholder",
    name: "HIPAA",
    badge: "UPCOMING",
    description:
      "US health information privacy and security rules (Privacy & Security Rules) for covered entities and business associates handling PHI.",
    plan: "professional",
  },
];

export const FRAMEWORK_TILE_DATA: ReadonlyArray<FrameworkTileData> = [
  {
    id: "nist_csf_2_0",
    name: "NIST CSF 2.0",
    badge: "ESSENTIALS",
    description:
      "A flexible, voluntary framework helping organisations of all sizes manage and reduce cybersecurity risk through six core functions: Govern, Identify, Protect, Detect, Respond, and Recover.",
    locked: true,
    plan: "essential",
  },
  {
    id: "iso_27001_2022",
    name: "ISO 27001:2022",
    badge: "GLOBAL",
    description:
      "The international standard for information security management systems (ISMS), specifying requirements for establishing, implementing, maintaining and continually improving information security.",
    plan: "professional",
  },
  {
    id: "pci_dss_4_0",
    name: "PCI DSS 4.0",
    badge: "PAYMENTS",
    description:
      "The Payment Card Industry Data Security Standard, designed to ensure that organisations storing, processing, or transmitting cardholder data maintain a secure environment.",
    plan: "professional",
  },
  {
    id: "apra_cps_234",
    name: "APRA CPS 234",
    badge: "AUSTRALIA",
    description:
      "Australian Prudential Regulation Authority Information Security standard for APRA-regulated entities, ensuring resilience against information security incidents.",
    plan: "professional",
  },
  {
    id: "apra_cps_230",
    name: "APRA CPS 230",
    badge: "AUSTRALIA",
    description:
      "Operational Risk Management standard requiring APRA-regulated entities to maintain effective operational risk management frameworks, including business continuity and service provider management.",
    plan: "professional",
  },
  {
    id: "asd_essential_eight",
    name: "ASD Essential Eight",
    badge: "AUSTRALIA",
    description:
      "The Australian Signals Directorate's prioritised mitigation strategies to help organisations protect themselves against various cyber threats, with maturity levels from 0 to 3.",
    plan: "professional",
  },
  {
    id: "iso_42001",
    name: "ISO 42001",
    badge: "AI GOVERNANCE",
    description:
      "The international standard for AI management systems, providing a framework for responsible development and use of artificial intelligence within organisations.",
    plan: "professional",
  },
  {
    id: "auva_iss",
    name: "AUVA ISS",
    badge: "AI SAFETY",
    description:
      "The Australian Voluntary AI Safety Standard, providing guidance for organisations developing or deploying AI systems responsibly within the Australian context.",
    plan: "professional",
  },
  {
    id: "nist_ai_rmf",
    name: "NIST AI RMF",
    badge: "AI GOVERNANCE",
    description:
      "The NIST AI Risk Management Framework, helping organisations manage risks associated with AI systems through governance, mapping, measurement, and management.",
    plan: "professional",
  },
];

export const INDUSTRIES: ReadonlyArray<string> = [
  "Financial Services (Banking, Insurance, Superannuation)",
  "Healthcare",
  "Technology / Software",
  "SaaS / Professional Services",
  "Government / Public Sector",
  "Manufacturing",
  "Retail / E-commerce",
  "Education",
  "Construction",
  "Telecommunications",
  "Media / Entertainment",
  "Energy / Utilities",
  "Hospitality / Travel",
  "Real Estate",
  "Legal Services",
  "Other",
];

export const COUNTRIES: ReadonlyArray<string> = [
  "Australia",
  "New Zealand",
  "United Kingdom",
  "Ireland",
  "United States",
  "Canada",
  "Germany",
  "France",
  "Netherlands",
  "Belgium",
  "Luxembourg",
  "Switzerland",
  "Austria",
  "Sweden",
  "Norway",
  "Denmark",
  "Finland",
  "Italy",
  "Spain",
  "Portugal",
  "Poland",
  "Czech Republic",
  "Japan",
  "South Korea",
  "Singapore",
  "Hong Kong",
  "Taiwan",
  "India",
  "United Arab Emirates",
  "Saudi Arabia",
  "Qatar",
  "Israel",
  "South Africa",
  "Brazil",
  "Mexico",
  "Argentina",
  "Chile",
  "Colombia",
  "Malaysia",
  "Thailand",
  "Indonesia",
  "Philippines",
  "Vietnam",
  "Turkey",
  "Other",
];

export type FrameworkId = (typeof FRAMEWORK_TILE_DATA)[number]["id"];
