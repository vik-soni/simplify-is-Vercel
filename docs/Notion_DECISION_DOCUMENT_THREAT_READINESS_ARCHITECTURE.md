DECISION_DOCUMENT_THREAT_READINESS_ARCHITECTURE.md
Overview
This document captures architectural decisions made for Agent 16: Threat Readiness & Tech Stack Discovery feature. It serves as the source of truth for why certain design choices were made and can be referenced when future iterations or audits occur.

Decision 1: Tech Stack Discovery as Prerequisite for Threat Readiness
Decision: Tech stack discovery must be completed before threat readiness can be viewed.
Rationale:

Threat severity calculations require understanding of actual infrastructure topology
Without tech stack context, threats become generic and less actionable
Tech stack context allows for industry-specific recommendations (e.g., AWS-specific backup strategies)
This ensures data relevance and user confidence in recommendations

Trade-off: Adds friction to onboarding but improves quality downstream.

Decision 2: Adaptive Questioning in Tech Stack Discovery
Decision: Questions adapt based on user responses rather than following a fixed questionnaire.
Rationale:

Reduces survey fatigue by skipping irrelevant paths (e.g., if on-premises, skip multi-cloud questions)
Allows follow-up depth on critical areas (e.g., if single-cloud, drill into redundancy concerns)
Creates conversational experience via Cypher rather than form-filling
Captures nuance without requiring users to navigate complex branching

Trade-off: More complex backend logic but significantly better UX.

Decision 3: Three-Factor Threat Severity Calculation
Decision: Threat severity = (Industry Risk Weight × Data Sensitivity) + (1 - Control Maturity Average) + Tech Stack Risk Multiplier
Rationale:

Industry Risk Weight: Different industries face fundamentally different threat landscapes (healthcare threats ≠ SaaS threats)
Control Maturity Gap: Shows which threats can actually exploit current weaknesses
Tech Stack Multiplier: Reflects whether the organization's actual infrastructure amplifies or mitigates threat exposure

This three-legged stool ensures threats are contextual and material to each organization.
Example:

A financial services firm (high data sensitivity) with poor identity controls (low maturity) on AWS with no multi-region setup (tech stack weakness) faces HIGH severity for "Account Takeover" (8.7/10)
The same threat for a non-critical SaaS tool with good controls might be MEDIUM (4.2/10)


Decision 4: Industry-Specific Tech Stack Multipliers
Decision: Each industry gets a custom lookup table of tech stack risk factors with multipliers.
Rationale:

Availability is critical for healthcare (downtime = patient safety) → single-cloud is 1.4x risk
Compliance audit trails are critical for financial services → weak monitoring is 1.6x risk
Data residency is critical for government → multi-region requirement is industry-specific

Generic multipliers would miss these nuances.
Approach: Core 5 industries researched deeply. Unknown industries map to closest match via Claude intelligence, stored once during onboarding.

Decision 5: User Customization with System Score Persistence
Decision: Users can move threats between High/Medium/Lower/Does Not Apply buckets, but system-generated severity score remains visible and unchanged.
Rationale:

Empowers users to reflect business context (e.g., "This threat is technically High but we don't operate in that market")
Preserves audit trail of what the system recommended vs. what the user chose
Prevents users from accidentally dismissing genuine threats while still allowing overrides
Control recommendations weight toward High threats the user has marked as relevant

Trade-off: Requires teaching users the difference between "system thinks" and "I think," but improves decision quality.

Decision 6: Control Impact Scoring via Threshold Modeling
Decision: Controls are scored by how many High/Medium threats would change severity if that control improved.
Rationale:

Highlights "keystone controls"—those that unlock multiple high-priority improvements
Avoids over-optimization (fixing a control that only helps low-priority threats)
Provides clear ROI messaging: "Fixing this control would move 3 High threats to Medium"
Aligns remediation effort to business impact

Example:

"Access Control" might affect 5 threats (3 High, 2 Medium) = high impact
"Logging