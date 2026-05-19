/**
 * Canonical assessment framework IDs (Supabase control_assessment_questions.framework).
 * Maps app/onboarding slugs and legacy harness IDs to DB identifiers.
 */

export const SUPPORTED_ASSESSMENT_FRAMEWORKS = [
  "NIST_CSF_2.0",
  "ISO_27001_2022",
  "ISO42001",
  "NIST_AI_RMF",
  "PCI_DSS",
  "APRA_CPS_230",
  "APRA_CPS_234",
  "ASD_E8",
  "AU_VAISS",
] as const;

export type AssessmentFrameworkId = (typeof SUPPORTED_ASSESSMENT_FRAMEWORKS)[number];

/** Legacy / harness / control_mappings identifiers → canonical assessment ID. */
const LEGACY_TO_CANONICAL: Record<string, AssessmentFrameworkId> = {
  ISO27001: "ISO_27001_2022",
  NIST_CSF: "NIST_CSF_2.0",
  NIST_CSF_2_0: "NIST_CSF_2.0",
  APRA_CPS234: "APRA_CPS_234",
  APRA_CPS230: "APRA_CPS_230",
  AU_AI_SAFETY: "AU_VAISS",
  CIS_V8: "NIST_CSF_2.0",
};

/** App library slug (onboarding) → canonical assessment ID. */
const SLUG_TO_CANONICAL: Record<string, AssessmentFrameworkId> = {
  nist_csf_2_0: "NIST_CSF_2.0",
  "nist_csf_2.0": "NIST_CSF_2.0",
  iso_27001_2022: "ISO_27001_2022",
  "iso_27001:2022": "ISO_27001_2022",
  pci_dss_4_0: "PCI_DSS",
  pci_dss: "PCI_DSS",
  apra_cps_230: "APRA_CPS_230",
  apra_cps_234: "APRA_CPS_234",
  asd_essential_eight: "ASD_E8",
  iso_42001: "ISO42001",
  auva_iss: "AU_VAISS",
  nist_ai_rmf: "NIST_AI_RMF",
};

/** Canonical assessment ID → controls.catalog `framework` column (legacy names). */
export const CANONICAL_TO_CONTROLS_CATALOG: Record<AssessmentFrameworkId, string> = {
  "NIST_CSF_2.0": "NIST_CSF",
  ISO_27001_2022: "ISO27001",
  ISO42001: "ISO42001",
  NIST_AI_RMF: "NIST_AI_RMF",
  PCI_DSS: "PCI_DSS",
  APRA_CPS_230: "APRA_CPS230",
  APRA_CPS_234: "APRA_CPS234",
  ASD_E8: "ASD_E8",
  AU_VAISS: "AU_VAISS",
};

export function isSupportedAssessmentFramework(
  value: string,
): value is AssessmentFrameworkId {
  return (SUPPORTED_ASSESSMENT_FRAMEWORKS as readonly string[]).includes(value);
}

/**
 * Normalise any framework string (slug, legacy, or canonical) to the
 * control_assessment_questions.framework value, or null if unsupported.
 */
export function normalizeAssessmentFrameworkId(raw: string): AssessmentFrameworkId | null {
  if (isSupportedAssessmentFramework(raw)) return raw;
  const upper = raw.toUpperCase().replace(/[\s.:-]+/g, "_");
  if (isSupportedAssessmentFramework(upper)) return upper;
  const legacy = LEGACY_TO_CANONICAL[upper] ?? LEGACY_TO_CANONICAL[raw];
  if (legacy) return legacy;
  const slug = SLUG_TO_CANONICAL[raw.toLowerCase()];
  if (slug) return slug;
  return null;
}

export function consolidatedQuestionKey(frameworkId: string, controlId: string): string {
  return `${frameworkId}:${controlId}`;
}
