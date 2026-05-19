export type NistControl = {
  controlId: string;
  functionId: "GV" | "ID" | "PR" | "DE" | "RS" | "RC";
  categoryId: string;
  description: string;
  requirements: string[];
  reviewFrequencyDays: number;
  weight: number;
  questionText: string;
};

export const NIST_CSF_CONTROLS: NistControl[] = [
  // ---------------------------------------------------------------------------
  // GOVERN (GV) — Organizational Context (GV.OC)
  // ---------------------------------------------------------------------------
  {
    controlId: "GV.OC-01",
    functionId: "GV",
    categoryId: "OC",
    description:
      "The organizational mission is understood and informs cybersecurity risk management.",
    requirements: [
      "Documented mission/vision statement referencing cybersecurity priorities",
      "Evidence that cybersecurity risk decisions are aligned with mission objectives",
      "Board or leadership acknowledgment of mission-driven risk posture",
    ],
    reviewFrequencyDays: 365,
    weight: 1.0,
    questionText:
      "How does your organization's mission shape the way you think about cybersecurity risk?",
  },
  {
    controlId: "GV.OC-02",
    functionId: "GV",
    categoryId: "OC",
    description:
      "Internal and external stakeholders are understood, and their needs and expectations regarding cybersecurity risk management are understood and considered.",
    requirements: [
      "Stakeholder register identifying internal and external cybersecurity expectations",
      "Records of stakeholder engagement or consultation on risk management",
    ],
    reviewFrequencyDays: 365,
    weight: 1.0,
    questionText:
      "Who are the key stakeholders — inside and outside the org — whose cybersecurity expectations you need to meet?",
  },
  {
    controlId: "GV.OC-03",
    functionId: "GV",
    categoryId: "OC",
    description:
      "Legal, regulatory, and contractual requirements regarding cybersecurity — including privacy and civil liberties obligations — are understood and managed.",
    requirements: [
      "Inventory of applicable cybersecurity laws, regulations, and contractual obligations",
      "Process for tracking regulatory changes and updating compliance posture",
      "Evidence of periodic legal/regulatory compliance reviews",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "Walk me through how you track and manage legal, regulatory, and contractual cybersecurity obligations.",
  },
  {
    controlId: "GV.OC-04",
    functionId: "GV",
    categoryId: "OC",
    description:
      "Critical objectives, capabilities, and services that stakeholders depend on or expect from the organization are understood and communicated.",
    requirements: [
      "Business impact analysis identifying critical services and capabilities",
      "Communication records showing stakeholders are informed of critical dependencies",
    ],
    reviewFrequencyDays: 365,
    weight: 1.0,
    questionText:
      "What are the critical business services your stakeholders depend on, and how do you communicate their importance?",
  },
  {
    controlId: "GV.OC-05",
    functionId: "GV",
    categoryId: "OC",
    description:
      "Outcomes, capabilities, and services that the organization depends on are understood and communicated.",
    requirements: [
      "Documented list of external dependencies (services, suppliers, utilities)",
      "Communication plan for dependency-related risks and outages",
    ],
    reviewFrequencyDays: 365,
    weight: 1.0,
    questionText:
      "What external services or capabilities does your organization depend on, and how are those dependencies documented?",
  },

  // ---------------------------------------------------------------------------
  // GOVERN (GV) — Risk Management Strategy (GV.RM)
  // ---------------------------------------------------------------------------
  {
    controlId: "GV.RM-01",
    functionId: "GV",
    categoryId: "RM",
    description:
      "Risk management objectives are established and agreed to by organizational stakeholders.",
    requirements: [
      "Documented cybersecurity risk management objectives approved by leadership",
      "Evidence of stakeholder agreement (meeting minutes, sign-off records)",
    ],
    reviewFrequencyDays: 365,
    weight: 1.0,
    questionText:
      "What are your formally agreed-upon cybersecurity risk management objectives, and who signed off on them?",
  },
  {
    controlId: "GV.RM-02",
    functionId: "GV",
    categoryId: "RM",
    description:
      "Risk appetite and risk tolerance statements are established, communicated, and maintained.",
    requirements: [
      "Formal risk appetite and tolerance statements",
      "Evidence of communication to relevant personnel",
      "Records showing periodic review and updates",
    ],
    reviewFrequencyDays: 365,
    weight: 1.0,
    questionText:
      "Do you have documented risk appetite and tolerance statements, and how are they communicated across the organization?",
  },
  {
    controlId: "GV.RM-03",
    functionId: "GV",
    categoryId: "RM",
    description:
      "Cybersecurity risk management activities and outcomes are included in enterprise risk management processes.",
    requirements: [
      "Evidence that cybersecurity risk feeds into the enterprise risk register",
      "Records of cybersecurity representation in enterprise risk governance forums",
    ],
    reviewFrequencyDays: 365,
    weight: 1.0,
    questionText:
      "How is cybersecurity risk integrated into your broader enterprise risk management program?",
  },
  {
    controlId: "GV.RM-04",
    functionId: "GV",
    categoryId: "RM",
    description:
      "Strategic direction that describes appropriate risk response options is established and communicated.",
    requirements: [
      "Documented risk response options (accept, mitigate, transfer, avoid)",
      "Communication records showing strategic risk direction is shared with decision-makers",
    ],
    reviewFrequencyDays: 365,
    weight: 1.0,
    questionText:
      "How do you decide between accepting, mitigating, transferring, or avoiding a given cybersecurity risk?",
  },
  {
    controlId: "GV.RM-05",
    functionId: "GV",
    categoryId: "RM",
    description:
      "Lines of communication across the organization are established for cybersecurity risks, including risks from suppliers and other third parties.",
    requirements: [
      "Defined communication channels and escalation paths for cybersecurity risk",
      "Evidence that third-party and supply chain risks are included in risk communications",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "What communication channels exist for escalating cybersecurity risks, including those from suppliers and third parties?",
  },
  {
    controlId: "GV.RM-06",
    functionId: "GV",
    categoryId: "RM",
    description:
      "A standardized method for calculating, documenting, categorizing, and prioritizing cybersecurity risks is established and communicated.",
    requirements: [
      "Documented risk scoring/calculation methodology",
      "Evidence the methodology is communicated and consistently applied",
      "Risk register entries showing categorization and prioritization",
    ],
    reviewFrequencyDays: 365,
    weight: 1.0,
    questionText:
      "What methodology do you use to score, categorize, and prioritize cybersecurity risks?",
  },
  {
    controlId: "GV.RM-07",
    functionId: "GV",
    categoryId: "RM",
    description:
      "Strategic opportunities (i.e., positive risks) are characterized and are included in organizational cybersecurity risk discussions.",
    requirements: [
      "Evidence that positive risk opportunities are identified during risk assessments",
      "Records of strategic opportunity discussions in risk governance forums",
    ],
    reviewFrequencyDays: 365,
    weight: 1.0,
    questionText:
      "Do your risk discussions also capture strategic opportunities — positive risks that could benefit the organization?",
  },

  // ---------------------------------------------------------------------------
  // GOVERN (GV) — Roles, Responsibilities, and Authorities (GV.RR)
  // ---------------------------------------------------------------------------
  {
    controlId: "GV.RR-01",
    functionId: "GV",
    categoryId: "RR",
    description:
      "Organizational leadership is responsible and accountable for cybersecurity risk and fosters a culture that is risk-aware, ethical, and continually improving.",
    requirements: [
      "Charter or policy assigning cybersecurity accountability to senior leadership",
      "Evidence of leadership participation in cybersecurity governance (meeting minutes, reports)",
    ],
    reviewFrequencyDays: 365,
    weight: 1.0,
    questionText:
      "How does your senior leadership demonstrate accountability for cybersecurity risk?",
  },
  {
    controlId: "GV.RR-02",
    functionId: "GV",
    categoryId: "RR",
    description:
      "Roles, responsibilities, and authorities related to cybersecurity risk management are established, communicated, understood, and enforced.",
    requirements: [
      "RACI matrix or equivalent mapping cybersecurity roles and responsibilities",
      "Evidence roles are communicated (onboarding materials, org charts, job descriptions)",
      "Records demonstrating enforcement of assigned responsibilities",
    ],
    reviewFrequencyDays: 365,
    weight: 1.0,
    questionText:
      "How are cybersecurity roles and responsibilities defined, communicated, and enforced across the organization?",
  },
  {
    controlId: "GV.RR-03",
    functionId: "GV",
    categoryId: "RR",
    description:
      "Adequate resources are allocated commensurate with the cybersecurity risk strategy, roles, responsibilities, and policies.",
    requirements: [
      "Budget allocation records for cybersecurity programs and initiatives",
      "Staffing plans or headcount approvals for cybersecurity functions",
    ],
    reviewFrequencyDays: 365,
    weight: 1.0,
    questionText:
      "Are cybersecurity resources — budget and staffing — adequate relative to your risk strategy and responsibilities?",
  },
  {
    controlId: "GV.RR-04",
    functionId: "GV",
    categoryId: "RR",
    description: "Cybersecurity is included in human resources practices.",
    requirements: [
      "HR policies addressing cybersecurity expectations (hiring, onboarding, offboarding)",
      "Evidence of background checks or vetting for security-sensitive roles",
      "Records of cybersecurity clauses in employment agreements",
    ],
    reviewFrequencyDays: 365,
    weight: 1.0,
    questionText:
      "How does your HR process incorporate cybersecurity — from hiring through offboarding?",
  },

  // ---------------------------------------------------------------------------
  // GOVERN (GV) — Policy (GV.PO)
  // ---------------------------------------------------------------------------
  {
    controlId: "GV.PO-01",
    functionId: "GV",
    categoryId: "PO",
    description:
      "Policy for managing cybersecurity risks is established based on organizational context, cybersecurity strategy, and priorities and is communicated and enforced.",
    requirements: [
      "Approved cybersecurity policy document aligned with organizational strategy",
      "Distribution and acknowledgment records showing policy communication",
      "Evidence of enforcement mechanisms (audits, compliance checks)",
    ],
    reviewFrequencyDays: 365,
    weight: 1.0,
    questionText:
      "Tell me about your cybersecurity policy — how is it established, communicated, and enforced?",
  },
  {
    controlId: "GV.PO-02",
    functionId: "GV",
    categoryId: "PO",
    description:
      "Policy for managing cybersecurity risks is reviewed, updated, communicated, and enforced to reflect changes in requirements, threats, technology, and organizational mission.",
    requirements: [
      "Policy review schedule and version history showing regular updates",
      "Records linking policy changes to evolving threats, regulations, or technology shifts",
    ],
    reviewFrequencyDays: 365,
    weight: 1.0,
    questionText:
      "How often do you review and update your cybersecurity policy, and what triggers a revision?",
  },

  // ---------------------------------------------------------------------------
  // GOVERN (GV) — Oversight (GV.OV)
  // ---------------------------------------------------------------------------
  {
    controlId: "GV.OV-01",
    functionId: "GV",
    categoryId: "OV",
    description:
      "Cybersecurity risk management strategy outcomes are reviewed to inform and adjust strategy and direction.",
    requirements: [
      "Reports or dashboards summarizing cybersecurity risk management outcomes",
      "Meeting records showing leadership review of strategy effectiveness",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "How do you review cybersecurity risk management outcomes and feed findings back into your strategy?",
  },
  {
    controlId: "GV.OV-02",
    functionId: "GV",
    categoryId: "OV",
    description:
      "The cybersecurity risk management strategy is reviewed and adjusted to ensure coverage of organizational requirements and risks.",
    requirements: [
      "Periodic strategy review records with gap analysis results",
      "Evidence of strategy adjustments driven by new requirements or emerging risks",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "When did you last review your cybersecurity strategy for gaps, and what adjustments resulted?",
  },
  {
    controlId: "GV.OV-03",
    functionId: "GV",
    categoryId: "OV",
    description:
      "Organizational cybersecurity risk management performance is measured and reviewed for adjustments needed.",
    requirements: [
      "Defined KPIs or metrics for cybersecurity risk management performance",
      "Periodic performance measurement reports and action items from reviews",
    ],
    reviewFrequencyDays: 90,
    weight: 1.0,
    questionText:
      "What metrics do you use to measure cybersecurity risk management performance, and how often are they reviewed?",
  },

  // ---------------------------------------------------------------------------
  // GOVERN (GV) — Cybersecurity Supply Chain Risk Management (GV.SC)
  // ---------------------------------------------------------------------------
  {
    controlId: "GV.SC-01",
    functionId: "GV",
    categoryId: "SC",
    description:
      "A cybersecurity supply chain risk management program, strategy, objectives, policies, and processes are established and agreed to by organizational stakeholders.",
    requirements: [
      "Documented C-SCRM program with strategy, objectives, and policies",
      "Stakeholder sign-off or approval records for the C-SCRM program",
    ],
    reviewFrequencyDays: 365,
    weight: 1.0,
    questionText:
      "Do you have a formal cybersecurity supply chain risk management program, and who has approved it?",
  },
  {
    controlId: "GV.SC-02",
    functionId: "GV",
    categoryId: "SC",
    description:
      "Cybersecurity roles and responsibilities for suppliers, customers, and partners are established, communicated, and coordinated internally and externally.",
    requirements: [
      "Documented roles and responsibilities for supply chain cybersecurity",
      "Communication records showing expectations shared with suppliers and partners",
    ],
    reviewFrequencyDays: 365,
    weight: 1.0,
    questionText:
      "How do you define and communicate cybersecurity roles and responsibilities to your suppliers and partners?",
  },
  {
    controlId: "GV.SC-03",
    functionId: "GV",
    categoryId: "SC",
    description:
      "Cybersecurity supply chain risk management is integrated into cybersecurity and enterprise risk management, risk assessment, and improvement processes.",
    requirements: [
      "Evidence of supply chain risks in the enterprise risk register",
      "Records showing C-SCRM activities inform broader risk assessments and improvements",
    ],
    reviewFrequencyDays: 365,
    weight: 1.0,
    questionText:
      "How is supply chain risk management woven into your overall cybersecurity and enterprise risk programs?",
  },
  {
    controlId: "GV.SC-04",
    functionId: "GV",
    categoryId: "SC",
    description:
      "Suppliers are known and prioritized by criticality.",
    requirements: [
      "Supplier inventory with criticality ratings",
      "Criteria and process used to assess supplier criticality",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "Do you maintain an inventory of suppliers ranked by criticality, and what criteria drive that ranking?",
  },
  {
    controlId: "GV.SC-05",
    functionId: "GV",
    categoryId: "SC",
    description:
      "Requirements to address cybersecurity risks in supply chains are established, prioritized, and integrated into contracts and other types of agreements with suppliers and other relevant third parties.",
    requirements: [
      "Standard cybersecurity clauses in supplier contracts and agreements",
      "Records showing prioritized requirements are enforced in procurement",
    ],
    reviewFrequencyDays: 365,
    weight: 1.0,
    questionText:
      "What cybersecurity requirements do you embed in supplier contracts, and how do you enforce them?",
  },
  {
    controlId: "GV.SC-06",
    functionId: "GV",
    categoryId: "SC",
    description:
      "Planning and due diligence are performed to reduce risks before entering into formal supplier or other third-party relationships.",
    requirements: [
      "Pre-engagement due diligence checklists or assessment results for suppliers",
      "Records of risk-based decision-making before formalizing supplier relationships",
    ],
    reviewFrequencyDays: 365,
    weight: 1.0,
    questionText:
      "What due diligence do you perform on a supplier's security posture before entering a formal relationship?",
  },
  {
    controlId: "GV.SC-07",
    functionId: "GV",
    categoryId: "SC",
    description:
      "The risks posed by a supplier, their products and services, and other third parties are understood, recorded, prioritized, assessed, responded to, and monitored over the course of the relationship.",
    requirements: [
      "Ongoing supplier risk assessment records",
      "Evidence of risk monitoring and response actions throughout supplier lifecycle",
      "Periodic supplier security review reports",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "How do you continuously monitor and assess the cybersecurity risks posed by your suppliers over the life of the relationship?",
  },
  {
    controlId: "GV.SC-08",
    functionId: "GV",
    categoryId: "SC",
    description:
      "Relevant suppliers and other third parties are included in incident planning, response, and recovery activities.",
    requirements: [
      "Incident response plan sections addressing supplier/third-party roles",
      "Records of supplier participation in incident response exercises or tabletops",
    ],
    reviewFrequencyDays: 365,
    weight: 1.0,
    questionText:
      "Are your critical suppliers included in your incident response planning and exercises?",
  },
  {
    controlId: "GV.SC-09",
    functionId: "GV",
    categoryId: "SC",
    description:
      "Supply chain security practices are integrated into cybersecurity and enterprise risk management programs, and their performance is monitored throughout the technology product and service life cycle.",
    requirements: [
      "Evidence of supply chain security integration across product/service lifecycles",
      "Performance monitoring reports for supply chain security practices",
    ],
    reviewFrequencyDays: 365,
    weight: 1.0,
    questionText:
      "How do you monitor supply chain security performance across the full lifecycle of your technology products and services?",
  },
  {
    controlId: "GV.SC-10",
    functionId: "GV",
    categoryId: "SC",
    description:
      "Cybersecurity supply chain risk management plans include provisions for activities that occur after the conclusion of a partnership or service agreement.",
    requirements: [
      "Off-boarding or relationship termination procedures for suppliers",
      "Evidence of data return, destruction, or access revocation upon contract end",
    ],
    reviewFrequencyDays: 365,
    weight: 1.0,
    questionText:
      "What happens from a cybersecurity standpoint when a supplier relationship or service agreement ends?",
  },

  // ---------------------------------------------------------------------------
  // IDENTIFY (ID) — Asset Management (ID.AM)
  // ---------------------------------------------------------------------------
  {
    controlId: "ID.AM-01",
    functionId: "ID",
    categoryId: "AM",
    description:
      "Inventories of hardware managed by the organization are maintained.",
    requirements: [
      "Up-to-date hardware asset inventory (servers, endpoints, network devices, IoT)",
      "Evidence of regular inventory reconciliation and updates",
    ],
    reviewFrequencyDays: 90,
    weight: 1.0,
    questionText:
      "How do you maintain and keep current your inventory of hardware assets?",
  },
  {
    controlId: "ID.AM-02",
    functionId: "ID",
    categoryId: "AM",
    description:
      "Inventories of software, services, and systems managed by the organization are maintained.",
    requirements: [
      "Up-to-date software and services inventory (applications, SaaS, platforms)",
      "Evidence of regular inventory reconciliation and updates",
    ],
    reviewFrequencyDays: 90,
    weight: 1.0,
    questionText:
      "How do you track all software, services, and systems your organization manages?",
  },
  {
    controlId: "ID.AM-03",
    functionId: "ID",
    categoryId: "AM",
    description:
      "Representations of the organization's authorized network communication and internal and external network data flows are maintained.",
    requirements: [
      "Network architecture diagrams showing authorized communication paths",
      "Data flow diagrams documenting internal and external data movements",
      "Evidence of periodic review and updates to network documentation",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "Do you maintain up-to-date network diagrams and data flow maps, and how often are they reviewed?",
  },
  {
    controlId: "ID.AM-04",
    functionId: "ID",
    categoryId: "AM",
    description:
      "Inventories of services provided by suppliers are maintained.",
    requirements: [
      "Supplier service catalog or inventory with associated risk classifications",
      "Records linking supplier services to internal systems or business processes",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "Do you have a complete inventory of services provided by your suppliers, and how is it maintained?",
  },
  {
    controlId: "ID.AM-05",
    functionId: "ID",
    categoryId: "AM",
    description:
      "Assets are prioritized based on classification, criticality, resources, and impact on the mission.",
    requirements: [
      "Asset classification and criticality ratings",
      "Documented criteria used for prioritization (impact, sensitivity, business value)",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "How do you classify and prioritize your assets based on their criticality and mission impact?",
  },
  {
    controlId: "ID.AM-07",
    functionId: "ID",
    categoryId: "AM",
    description:
      "Inventories of data and corresponding metadata for designated data types are maintained.",
    requirements: [
      "Data inventory or catalog covering designated data types (PII, PHI, financial, IP)",
      "Metadata records (owner, classification, retention, location) for cataloged data",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "How do you inventory your critical data types and track their metadata — ownership, classification, and location?",
  },
  {
    controlId: "ID.AM-08",
    functionId: "ID",
    categoryId: "AM",
    description:
      "Systems, hardware, software, services, and data are managed throughout their life cycles.",
    requirements: [
      "Lifecycle management procedures (procurement, deployment, maintenance, decommission)",
      "Records of end-of-life tracking and disposal for hardware, software, and data",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "How do you manage the full lifecycle of your systems, hardware, software, and data from acquisition to disposal?",
  },

  // ---------------------------------------------------------------------------
  // IDENTIFY (ID) — Risk Assessment (ID.RA)
  // ---------------------------------------------------------------------------
  {
    controlId: "ID.RA-01",
    functionId: "ID",
    categoryId: "RA",
    description:
      "Vulnerabilities in assets are identified, validated, and recorded.",
    requirements: [
      "Vulnerability scanning reports covering infrastructure and applications",
      "Validated vulnerability records with severity ratings",
      "Remediation tracking and closure evidence",
    ],
    reviewFrequencyDays: 30,
    weight: 1.0,
    questionText:
      "How do you identify and validate vulnerabilities in your assets, and how are they tracked to remediation?",
  },
  {
    controlId: "ID.RA-02",
    functionId: "ID",
    categoryId: "RA",
    description:
      "Cyber threat intelligence is received from information sharing forums and sources.",
    requirements: [
      "Subscriptions or memberships to threat intelligence feeds and ISACs",
      "Records of threat intelligence received and how it is consumed/analyzed",
    ],
    reviewFrequencyDays: 90,
    weight: 1.0,
    questionText:
      "What threat intelligence sources do you subscribe to, and how do you consume that intelligence?",
  },
  {
    controlId: "ID.RA-03",
    functionId: "ID",
    categoryId: "RA",
    description:
      "Internal and external threats to the organization are identified and recorded.",
    requirements: [
      "Threat register or catalog documenting internal and external threats",
      "Evidence of periodic threat landscape reviews and updates",
    ],
    reviewFrequencyDays: 90,
    weight: 1.0,
    questionText:
      "How do you identify, record, and keep current the internal and external threats facing your organization?",
  },
  {
    controlId: "ID.RA-04",
    functionId: "ID",
    categoryId: "RA",
    description:
      "Potential impacts and likelihoods of threats exploiting vulnerabilities are identified and recorded.",
    requirements: [
      "Risk assessment records documenting impact and likelihood ratings",
      "Methodology documentation for impact/likelihood determination",
    ],
    reviewFrequencyDays: 90,
    weight: 1.0,
    questionText:
      "How do you assess and document the likelihood and potential impact of threats exploiting known vulnerabilities?",
  },
  {
    controlId: "ID.RA-05",
    functionId: "ID",
    categoryId: "RA",
    description:
      "Threats, vulnerabilities, likelihoods, and impacts are used to understand inherent risk and inform risk response prioritization.",
    requirements: [
      "Risk register entries showing inherent risk scores derived from threat/vulnerability analysis",
      "Evidence that risk scores drive response prioritization decisions",
    ],
    reviewFrequencyDays: 90,
    weight: 1.0,
    questionText:
      "How do threat and vulnerability data feed into your inherent risk calculations and response prioritization?",
  },
  {
    controlId: "ID.RA-06",
    functionId: "ID",
    categoryId: "RA",
    description:
      "Risk responses are chosen, prioritized, planned, tracked, and communicated.",
    requirements: [
      "Risk treatment plans with chosen responses and owners",
      "Tracking records showing progress on risk response actions",
      "Communication records to stakeholders on risk response status",
    ],
    reviewFrequencyDays: 90,
    weight: 1.0,
    questionText:
      "How do you select, track, and communicate your risk response actions?",
  },
  {
    controlId: "ID.RA-07",
    functionId: "ID",
    categoryId: "RA",
    description:
      "Changes and exceptions are managed, assessed for risk impact, recorded, and tracked.",
    requirements: [
      "Change management process with risk impact assessment steps",
      "Exception request and approval records with risk justifications",
    ],
    reviewFrequencyDays: 90,
    weight: 1.0,
    questionText:
      "How do you handle changes and exceptions — are they assessed for risk impact and formally tracked?",
  },
  {
    controlId: "ID.RA-08",
    functionId: "ID",
    categoryId: "RA",
    description:
      "Processes for receiving, analyzing, and responding to vulnerability disclosures are established.",
    requirements: [
      "Vulnerability disclosure policy (VDP) or coordinated disclosure process",
      "Records of disclosures received and response actions taken",
    ],
    reviewFrequencyDays: 365,
    weight: 1.0,
    questionText:
      "Do you have a vulnerability disclosure process, and how do you handle incoming disclosures?",
  },
  {
    controlId: "ID.RA-09",
    functionId: "ID",
    categoryId: "RA",
    description:
      "The authenticity and integrity of hardware and software are assessed prior to acquisition and use.",
    requirements: [
      "Pre-acquisition integrity verification procedures (checksums, signatures, provenance)",
      "Records of hardware/software authenticity checks before deployment",
    ],
    reviewFrequencyDays: 365,
    weight: 1.0,
    questionText:
      "How do you verify the authenticity and integrity of hardware and software before putting them into production?",
  },
  {
    controlId: "ID.RA-10",
    functionId: "ID",
    categoryId: "RA",
    description:
      "Critical suppliers are assessed prior to acquisition.",
    requirements: [
      "Pre-acquisition security assessment results for critical suppliers",
      "Documented assessment criteria and risk acceptance decisions",
    ],
    reviewFrequencyDays: 365,
    weight: 1.0,
    questionText:
      "What security assessments do you perform on critical suppliers before entering into an agreement?",
  },

  // ---------------------------------------------------------------------------
  // IDENTIFY (ID) — Improvement (ID.IM)
  // ---------------------------------------------------------------------------
  {
    controlId: "ID.IM-01",
    functionId: "ID",
    categoryId: "IM",
    description: "Improvements are identified from evaluations.",
    requirements: [
      "Audit, assessment, or evaluation reports with improvement recommendations",
      "Tracking records for identified improvements and their implementation status",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "How do findings from audits and evaluations translate into concrete cybersecurity improvements?",
  },
  {
    controlId: "ID.IM-02",
    functionId: "ID",
    categoryId: "IM",
    description:
      "Improvements are identified from security tests and exercises, including those done in coordination with suppliers and relevant third parties.",
    requirements: [
      "Penetration test, red team, or tabletop exercise reports with findings",
      "Improvement action items derived from tests, with completion tracking",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "What improvements have come out of your most recent security tests or exercises?",
  },
  {
    controlId: "ID.IM-03",
    functionId: "ID",
    categoryId: "IM",
    description:
      "Improvements are identified from execution of operational processes, procedures, and activities.",
    requirements: [
      "Lessons-learned records from operational cybersecurity activities",
      "Process improvement tracking driven by operational feedback",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "How do you capture lessons learned from day-to-day cybersecurity operations and turn them into improvements?",
  },
  {
    controlId: "ID.IM-04",
    functionId: "ID",
    categoryId: "IM",
    description:
      "Incident response plans and other cybersecurity plans that affect operations are established, communicated, maintained, and improved.",
    requirements: [
      "Current incident response plan and related cybersecurity plans",
      "Evidence of plan communication, testing, and periodic updates",
      "Improvement records from post-incident reviews feeding back into plans",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "How do you maintain and continuously improve your incident response plan and other cybersecurity operational plans?",
  },

  // ---------------------------------------------------------------------------
  // PROTECT (PR) — Identity Management, Authentication, and Access Control (PR.AA)
  // ---------------------------------------------------------------------------
  {
    controlId: "PR.AA-01",
    functionId: "PR",
    categoryId: "AA",
    description:
      "Identities and credentials for authorized users, services, and hardware are managed by the organization.",
    requirements: [
      "Identity management system covering users, service accounts, and device identities",
      "Credential lifecycle management procedures (issuance, rotation, revocation)",
      "Evidence of regular access reviews and credential hygiene checks",
    ],
    reviewFrequencyDays: 90,
    weight: 1.0,
    questionText:
      "How do you manage identities and credentials for users, service accounts, and hardware?",
  },
  {
    controlId: "PR.AA-02",
    functionId: "PR",
    categoryId: "AA",
    description:
      "Identities are proofed and bound to credentials based on the context of interactions.",
    requirements: [
      "Identity proofing procedures appropriate to the risk level of the interaction",
      "Records of identity verification before credential issuance",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "How do you verify someone's identity before issuing credentials, and does the rigor vary by context?",
  },
  {
    controlId: "PR.AA-03",
    functionId: "PR",
    categoryId: "AA",
    description:
      "Users, services, and hardware are authenticated.",
    requirements: [
      "Authentication mechanisms in place for users, services, and devices",
      "MFA enforcement records for privileged and remote access",
    ],
    reviewFrequencyDays: 90,
    weight: 1.0,
    questionText:
      "What authentication mechanisms are in place for your users, services, and hardware — and where is MFA enforced?",
  },
  {
    controlId: "PR.AA-04",
    functionId: "PR",
    categoryId: "AA",
    description:
      "Identity assertions are protected, conveyed, and verified.",
    requirements: [
      "Secure token/assertion handling procedures (SAML, OAuth, OIDC)",
      "Evidence that identity assertions are encrypted in transit and validated on receipt",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "How do you protect and verify identity assertions (tokens, SAML, OIDC) as they move between systems?",
  },
  {
    controlId: "PR.AA-05",
    functionId: "PR",
    categoryId: "AA",
    description:
      "Access permissions, entitlements, and authorizations are defined in a policy, managed, enforced, and reviewed, and incorporate the principles of least privilege and separation of duties.",
    requirements: [
      "Access control policy incorporating least privilege and separation of duties",
      "Periodic access reviews and entitlement recertification records",
      "Evidence of automated or manual enforcement of access policies",
    ],
    reviewFrequencyDays: 90,
    weight: 1.0,
    questionText:
      "How do you enforce least privilege and separation of duties, and how often do you recertify access entitlements?",
  },
  {
    controlId: "PR.AA-06",
    functionId: "PR",
    categoryId: "AA",
    description:
      "Physical access to assets is managed, monitored, and enforced commensurate with risk.",
    requirements: [
      "Physical access control mechanisms (badge systems, biometrics, visitor logs)",
      "Physical access monitoring and audit records",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "How do you control, monitor, and audit physical access to your critical assets and facilities?",
  },

  // ---------------------------------------------------------------------------
  // PROTECT (PR) — Awareness and Training (PR.AT)
  // ---------------------------------------------------------------------------
  {
    controlId: "PR.AT-01",
    functionId: "PR",
    categoryId: "AT",
    description:
      "Personnel are provided with awareness and training so that they possess the knowledge and skills to perform general tasks with security risks in mind.",
    requirements: [
      "Security awareness training program with required completion for all personnel",
      "Training completion records and periodic refresher evidence",
      "Phishing simulation or social engineering test results",
    ],
    reviewFrequencyDays: 365,
    weight: 1.0,
    questionText:
      "Tell me about your security awareness training program — what does it cover and how do you track completion?",
  },
  {
    controlId: "PR.AT-02",
    functionId: "PR",
    categoryId: "AT",
    description:
      "Individuals in specialized roles are provided with awareness and training so that they possess the knowledge and skills to perform relevant tasks with security risks in mind.",
    requirements: [
      "Role-based training curricula for specialized positions (admins, developers, incident responders)",
      "Completion records and certification evidence for role-specific training",
    ],
    reviewFrequencyDays: 365,
    weight: 1.0,
    questionText:
      "What role-specific security training do you provide for specialized positions like admins, developers, or IR staff?",
  },

  // ---------------------------------------------------------------------------
  // PROTECT (PR) — Data Security (PR.DS)
  // ---------------------------------------------------------------------------
  {
    controlId: "PR.DS-01",
    functionId: "PR",
    categoryId: "DS",
    description:
      "The confidentiality, integrity, and availability of data-at-rest are protected.",
    requirements: [
      "Encryption-at-rest implementation for sensitive data stores",
      "Access controls and integrity verification for data at rest",
      "Evidence of key management practices for data-at-rest encryption",
    ],
    reviewFrequencyDays: 90,
    weight: 1.0,
    questionText:
      "How do you protect data at rest — encryption, access controls, and key management?",
  },
  {
    controlId: "PR.DS-02",
    functionId: "PR",
    categoryId: "DS",
    description:
      "The confidentiality, integrity, and availability of data-in-transit are protected.",
    requirements: [
      "Encryption-in-transit configuration (TLS, IPsec) for sensitive communications",
      "Evidence of certificate management and protocol version enforcement",
    ],
    reviewFrequencyDays: 90,
    weight: 1.0,
    questionText:
      "What protections are in place for data in transit — TLS enforcement, certificate management, protocol standards?",
  },
  {
    controlId: "PR.DS-10",
    functionId: "PR",
    categoryId: "DS",
    description:
      "The confidentiality, integrity, and availability of data-in-use are protected.",
    requirements: [
      "Controls protecting data during processing (memory protection, secure enclaves, DLP)",
      "Evidence of data-in-use protection mechanisms in production environments",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "How do you protect data while it is actively being processed or in use?",
  },
  {
    controlId: "PR.DS-11",
    functionId: "PR",
    categoryId: "DS",
    description:
      "Backups of data are created, protected, maintained, and tested.",
    requirements: [
      "Backup policy and schedules covering critical data and systems",
      "Backup integrity verification and restoration test records",
      "Evidence of off-site or immutable backup storage",
    ],
    reviewFrequencyDays: 90,
    weight: 1.0,
    questionText:
      "How do you handle backups — scheduling, protection, offsite storage, and restoration testing?",
  },

  // ---------------------------------------------------------------------------
  // PROTECT (PR) — Platform Security (PR.PS)
  // ---------------------------------------------------------------------------
  {
    controlId: "PR.PS-01",
    functionId: "PR",
    categoryId: "PS",
    description:
      "Configuration management practices are established and applied.",
    requirements: [
      "Configuration management policy and baseline standards",
      "Evidence of configuration enforcement (hardening benchmarks, drift detection)",
      "Change records for configuration modifications",
    ],
    reviewFrequencyDays: 90,
    weight: 1.0,
    questionText:
      "How do you establish and enforce secure configuration baselines across your platforms?",
  },
  {
    controlId: "PR.PS-02",
    functionId: "PR",
    categoryId: "PS",
    description:
      "Software is maintained, replaced, and removed commensurate with risk.",
    requirements: [
      "Patch management process with defined SLAs based on severity",
      "Records of software upgrades, replacements, and end-of-life removals",
    ],
    reviewFrequencyDays: 30,
    weight: 1.0,
    questionText:
      "How do you keep software patched, replace aging components, and remove end-of-life software?",
  },
  {
    controlId: "PR.PS-03",
    functionId: "PR",
    categoryId: "PS",
    description:
      "Hardware is maintained, replaced, and removed commensurate with risk.",
    requirements: [
      "Hardware maintenance schedules and lifecycle management records",
      "Evidence of secure decommissioning and disposal procedures",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "How do you maintain hardware, handle end-of-life replacement, and securely dispose of retired equipment?",
  },
  {
    controlId: "PR.PS-04",
    functionId: "PR",
    categoryId: "PS",
    description:
      "Log records are generated and made available for continuous monitoring.",
    requirements: [
      "Logging policy defining what events are captured and retained",
      "Evidence that logs are centrally collected and available for analysis",
      "Log retention and integrity protection records",
    ],
    reviewFrequencyDays: 90,
    weight: 1.0,
    questionText:
      "What events do you log, where are logs collected, and how do you ensure their integrity and availability?",
  },
  {
    controlId: "PR.PS-05",
    functionId: "PR",
    categoryId: "PS",
    description:
      "Installation and execution of unauthorized software are prevented.",
    requirements: [
      "Application whitelisting or software restriction policies",
      "Evidence of enforcement (blocked execution logs, policy compliance reports)",
    ],
    reviewFrequencyDays: 90,
    weight: 1.0,
    questionText:
      "How do you prevent the installation and execution of unauthorized software on your systems?",
  },
  {
    controlId: "PR.PS-06",
    functionId: "PR",
    categoryId: "PS",
    description:
      "Secure software development practices are integrated and their performance is monitored throughout the software development life cycle.",
    requirements: [
      "Secure SDLC documentation (SAST, DAST, code review, dependency scanning)",
      "Evidence of security gates in CI/CD pipelines",
      "Metrics or reports tracking secure development practice effectiveness",
    ],
    reviewFrequencyDays: 90,
    weight: 1.0,
    questionText:
      "How are secure development practices embedded in your SDLC, and how do you measure their effectiveness?",
  },

  // ---------------------------------------------------------------------------
  // PROTECT (PR) — Technology Infrastructure Resilience (PR.IR)
  // ---------------------------------------------------------------------------
  {
    controlId: "PR.IR-01",
    functionId: "PR",
    categoryId: "IR",
    description:
      "Networks and environments are protected from unauthorized logical access and usage.",
    requirements: [
      "Network segmentation and firewall rule documentation",
      "Evidence of network access controls (VPN, NAC, micro-segmentation)",
      "Periodic network access review records",
    ],
    reviewFrequencyDays: 90,
    weight: 1.0,
    questionText:
      "How do you protect your networks from unauthorized logical access — segmentation, firewalls, NAC?",
  },
  {
    controlId: "PR.IR-02",
    functionId: "PR",
    categoryId: "IR",
    description:
      "The organization's technology assets are protected from environmental threats.",
    requirements: [
      "Environmental controls documentation (fire suppression, HVAC, flood protection)",
      "Monitoring and alerting for environmental conditions in data centers/server rooms",
    ],
    reviewFrequencyDays: 365,
    weight: 1.0,
    questionText:
      "What environmental protections (fire, flood, HVAC) are in place for your critical technology assets?",
  },
  {
    controlId: "PR.IR-03",
    functionId: "PR",
    categoryId: "IR",
    description:
      "Mechanisms are implemented to achieve resilience requirements in normal and adverse situations.",
    requirements: [
      "Resilience architecture documentation (redundancy, failover, high availability)",
      "Evidence of resilience testing (failover drills, disaster recovery exercises)",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "What resilience mechanisms — redundancy, failover, HA — do you have, and how are they tested?",
  },
  {
    controlId: "PR.IR-04",
    functionId: "PR",
    categoryId: "IR",
    description:
      "Adequate resource capacity to ensure availability is maintained.",
    requirements: [
      "Capacity planning documentation and monitoring dashboards",
      "Evidence of capacity thresholds and alerting for critical systems",
    ],
    reviewFrequencyDays: 90,
    weight: 1.0,
    questionText:
      "How do you monitor and plan for resource capacity to ensure your systems stay available?",
  },

  // ---------------------------------------------------------------------------
  // DETECT (DE) — Continuous Monitoring (DE.CM)
  // ---------------------------------------------------------------------------
  {
    controlId: "DE.CM-01",
    functionId: "DE",
    categoryId: "CM",
    description:
      "Networks and network services are monitored to find potentially adverse events.",
    requirements: [
      "Network monitoring tools and coverage documentation (IDS/IPS, NDR, flow analysis)",
      "Alert rules and thresholds for network-based threat detection",
      "Evidence of monitored network segments and services",
    ],
    reviewFrequencyDays: 30,
    weight: 1.0,
    questionText:
      "What tools and processes do you use to monitor networks and network services for adverse events?",
  },
  {
    controlId: "DE.CM-02",
    functionId: "DE",
    categoryId: "CM",
    description:
      "The physical environment is monitored to find potentially adverse events.",
    requirements: [
      "Physical monitoring systems (CCTV, intrusion detection, environmental sensors)",
      "Alert and escalation procedures for physical security events",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "How do you monitor the physical environment — cameras, intrusion sensors, environmental alerts?",
  },
  {
    controlId: "DE.CM-03",
    functionId: "DE",
    categoryId: "CM",
    description:
      "Personnel activity and technology usage are monitored to find potentially adverse events.",
    requirements: [
      "User activity monitoring tools (UEBA, DLP, privileged session monitoring)",
      "Policies and procedures governing personnel monitoring and privacy considerations",
    ],
    reviewFrequencyDays: 90,
    weight: 1.0,
    questionText:
      "How do you monitor personnel activity and technology usage for insider threats or misuse?",
  },
  {
    controlId: "DE.CM-06",
    functionId: "DE",
    categoryId: "CM",
    description:
      "External service provider activities and services are monitored to find potentially adverse events.",
    requirements: [
      "Monitoring of external service provider connections and activity",
      "SLA monitoring and alerting for third-party service anomalies",
    ],
    reviewFrequencyDays: 90,
    weight: 1.0,
    questionText:
      "How do you monitor the activities and services of your external service providers for security events?",
  },
  {
    controlId: "DE.CM-09",
    functionId: "DE",
    categoryId: "CM",
    description:
      "Computing hardware and software, runtime environments, and their data are monitored to find potentially adverse events.",
    requirements: [
      "Endpoint detection and response (EDR) or host-based monitoring coverage",
      "Runtime application monitoring and integrity checking",
      "Evidence of alert triage and response for endpoint/host events",
    ],
    reviewFrequencyDays: 30,
    weight: 1.0,
    questionText:
      "How do you monitor endpoints, runtime environments, and their data for potentially adverse events?",
  },

  // ---------------------------------------------------------------------------
  // DETECT (DE) — Adverse Event Analysis (DE.AE)
  // ---------------------------------------------------------------------------
  {
    controlId: "DE.AE-02",
    functionId: "DE",
    categoryId: "AE",
    description:
      "Potentially adverse events are analyzed to better understand associated activities.",
    requirements: [
      "Analysis procedures for triaging and investigating potential security events",
      "Records of event analysis with conclusions and recommended actions",
    ],
    reviewFrequencyDays: 30,
    weight: 1.0,
    questionText:
      "When a potentially adverse event is detected, how do you analyze it to understand what happened?",
  },
  {
    controlId: "DE.AE-03",
    functionId: "DE",
    categoryId: "AE",
    description:
      "Information is correlated from multiple sources.",
    requirements: [
      "SIEM or log correlation platform integrating multiple data sources",
      "Correlation rules and use cases documented and tuned",
    ],
    reviewFrequencyDays: 90,
    weight: 1.0,
    questionText:
      "How do you correlate information from multiple sources to get a clearer picture of security events?",
  },
  {
    controlId: "DE.AE-04",
    functionId: "DE",
    categoryId: "AE",
    description:
      "The estimated impact and scope of adverse events are determined.",
    requirements: [
      "Impact and scope assessment procedures for detected events",
      "Records of impact determinations for recent events or incidents",
    ],
    reviewFrequencyDays: 90,
    weight: 1.0,
    questionText:
      "How do you determine the impact and scope of an adverse event once it is detected?",
  },
  {
    controlId: "DE.AE-06",
    functionId: "DE",
    categoryId: "AE",
    description:
      "Information on adverse events is provided to authorized staff and tools.",
    requirements: [
      "Notification and escalation procedures for adverse event information",
      "Evidence that event data feeds into authorized analysis tools and dashboards",
    ],
    reviewFrequencyDays: 90,
    weight: 1.0,
    questionText:
      "How is information about adverse events communicated to the right people and tools in a timely manner?",
  },
  {
    controlId: "DE.AE-07",
    functionId: "DE",
    categoryId: "AE",
    description:
      "Cyber threat intelligence and other contextual information are integrated into the analysis.",
    requirements: [
      "Threat intelligence platform or feed integration with analysis workflows",
      "Evidence of CTI enrichment in event/incident investigation records",
    ],
    reviewFrequencyDays: 90,
    weight: 1.0,
    questionText:
      "How do you integrate cyber threat intelligence into your event analysis and investigation workflows?",
  },
  {
    controlId: "DE.AE-08",
    functionId: "DE",
    categoryId: "AE",
    description:
      "Incidents are declared when adverse events meet the defined incident criteria.",
    requirements: [
      "Documented incident declaration criteria and thresholds",
      "Records of incident declarations with justification referencing criteria",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "What criteria trigger a formal incident declaration, and how is that decision documented?",
  },

  // ---------------------------------------------------------------------------
  // RESPOND (RS) — Incident Management (RS.MA)
  // ---------------------------------------------------------------------------
  {
    controlId: "RS.MA-01",
    functionId: "RS",
    categoryId: "MA",
    description:
      "The incident response plan is executed in coordination with relevant third parties once an incident is declared.",
    requirements: [
      "Incident response plan with defined activation procedures",
      "Evidence of third-party coordination during incident response (communications, joint actions)",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "Walk me through how your incident response plan kicks off once an incident is declared, including third-party coordination.",
  },
  {
    controlId: "RS.MA-02",
    functionId: "RS",
    categoryId: "MA",
    description: "Incident reports are triaged and validated.",
    requirements: [
      "Triage procedures for incoming incident reports",
      "Records of incident validation decisions (confirmed, false positive, duplicate)",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "How do you triage and validate incoming incident reports to confirm they are real?",
  },
  {
    controlId: "RS.MA-03",
    functionId: "RS",
    categoryId: "MA",
    description: "Incidents are categorized and prioritized.",
    requirements: [
      "Incident categorization and severity/priority schema",
      "Records of incident categorization decisions for recent incidents",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "How do you categorize and prioritize incidents — what criteria drive the severity rating?",
  },
  {
    controlId: "RS.MA-04",
    functionId: "RS",
    categoryId: "MA",
    description: "Incidents are escalated or elevated as needed.",
    requirements: [
      "Escalation matrix defining when and to whom incidents are elevated",
      "Records of incident escalations and notifications",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "What does your escalation path look like when an incident needs to be elevated?",
  },
  {
    controlId: "RS.MA-05",
    functionId: "RS",
    categoryId: "MA",
    description:
      "The criteria for initiating incident recovery are applied.",
    requirements: [
      "Documented criteria for transitioning from response to recovery",
      "Records showing recovery initiation decisions reference established criteria",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "What criteria determine when an incident transitions from active response to recovery?",
  },

  // ---------------------------------------------------------------------------
  // RESPOND (RS) — Incident Analysis (RS.AN)
  // ---------------------------------------------------------------------------
  {
    controlId: "RS.AN-03",
    functionId: "RS",
    categoryId: "AN",
    description:
      "Analysis is performed to determine what has taken place during an incident and the root cause of the incident.",
    requirements: [
      "Root cause analysis methodology and documentation",
      "Incident investigation reports with timeline reconstruction and root cause findings",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "How do you perform root cause analysis during an incident, and what does a typical investigation report look like?",
  },
  {
    controlId: "RS.AN-06",
    functionId: "RS",
    categoryId: "AN",
    description:
      "Actions performed during an investigation are recorded, and the records' integrity and provenance are preserved.",
    requirements: [
      "Investigation activity logging procedures ensuring chain of custody",
      "Evidence of tamper-resistant storage for investigation records",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "How do you ensure that actions taken during an investigation are logged with integrity and chain of custody?",
  },
  {
    controlId: "RS.AN-07",
    functionId: "RS",
    categoryId: "AN",
    description:
      "Incident data and metadata are collected, and their integrity and provenance are preserved.",
    requirements: [
      "Forensic data collection procedures preserving integrity (hashing, write-blocking)",
      "Evidence of chain-of-custody documentation for collected incident data",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "How do you collect and preserve incident data and metadata with forensic integrity?",
  },
  {
    controlId: "RS.AN-08",
    functionId: "RS",
    categoryId: "AN",
    description:
      "An incident's magnitude is estimated and validated.",
    requirements: [
      "Magnitude estimation procedures (affected systems, data, users, business impact)",
      "Records of magnitude assessments for recent incidents",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "How do you estimate and validate the magnitude of an incident — affected systems, data, and business impact?",
  },

  // ---------------------------------------------------------------------------
  // RESPOND (RS) — Incident Response Reporting and Communication (RS.CO)
  // ---------------------------------------------------------------------------
  {
    controlId: "RS.CO-02",
    functionId: "RS",
    categoryId: "CO",
    description:
      "Internal and external stakeholders are notified of incidents.",
    requirements: [
      "Incident notification procedures listing required internal and external recipients",
      "Records of stakeholder notifications with timestamps",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "Who gets notified when an incident occurs, and what does that notification process look like?",
  },
  {
    controlId: "RS.CO-03",
    functionId: "RS",
    categoryId: "CO",
    description:
      "Information is shared with designated internal and external stakeholders.",
    requirements: [
      "Information-sharing procedures defining what, when, and with whom to share",
      "Records of information shared with law enforcement, regulators, ISACs, or partners",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "How do you decide what incident information to share and with which stakeholders — regulators, law enforcement, partners?",
  },

  // ---------------------------------------------------------------------------
  // RESPOND (RS) — Incident Mitigation (RS.MI)
  // ---------------------------------------------------------------------------
  {
    controlId: "RS.MI-01",
    functionId: "RS",
    categoryId: "MI",
    description: "Incidents are contained.",
    requirements: [
      "Containment strategies and playbooks for common incident types",
      "Records of containment actions taken during recent incidents",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "What containment strategies and playbooks do you have, and how quickly can you isolate an affected system?",
  },
  {
    controlId: "RS.MI-02",
    functionId: "RS",
    categoryId: "MI",
    description: "Incidents are eradicated.",
    requirements: [
      "Eradication procedures for removing threat actors, malware, and vulnerabilities",
      "Records of eradication activities and verification of successful removal",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "How do you eradicate the threat from your environment, and how do you verify the threat is fully removed?",
  },

  // ---------------------------------------------------------------------------
  // RECOVER (RC) — Incident Recovery Plan Execution (RC.RP)
  // ---------------------------------------------------------------------------
  {
    controlId: "RC.RP-01",
    functionId: "RC",
    categoryId: "RP",
    description:
      "The recovery portion of the incident response plan is executed once initiated from the incident response process.",
    requirements: [
      "Recovery plan with defined activation procedures and roles",
      "Records of recovery plan execution for recent incidents",
    ],
    reviewFrequencyDays: 365,
    weight: 1.0,
    questionText:
      "How does the recovery phase of your incident response plan get activated, and who drives execution?",
  },
  {
    controlId: "RC.RP-02",
    functionId: "RC",
    categoryId: "RP",
    description:
      "Recovery actions are selected, scoped, prioritized, and performed.",
    requirements: [
      "Recovery action prioritization criteria and procedures",
      "Records of recovery actions taken with sequencing and scope documentation",
    ],
    reviewFrequencyDays: 365,
    weight: 1.0,
    questionText:
      "How do you decide which recovery actions to take first and scope them appropriately?",
  },
  {
    controlId: "RC.RP-03",
    functionId: "RC",
    categoryId: "RP",
    description:
      "The integrity of backups and other restoration assets is verified before using them for restoration.",
    requirements: [
      "Backup integrity verification procedures before restoration",
      "Evidence of integrity checks (checksums, test restores) for recent recovery activities",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "How do you verify the integrity of backups before using them to restore systems after an incident?",
  },
  {
    controlId: "RC.RP-04",
    functionId: "RC",
    categoryId: "RP",
    description:
      "Critical mission functions and cybersecurity risk management are considered to establish post-incident operational norms.",
    requirements: [
      "Post-incident operational norm procedures considering mission-critical functions",
      "Records of decisions establishing new operational baselines after incidents",
    ],
    reviewFrequencyDays: 365,
    weight: 1.0,
    questionText:
      "After an incident, how do you re-establish operational norms while accounting for mission-critical functions?",
  },
  {
    controlId: "RC.RP-05",
    functionId: "RC",
    categoryId: "RP",
    description:
      "The integrity of restored assets is verified, systems and services are restored, and normal operating status is confirmed.",
    requirements: [
      "Post-restoration integrity verification procedures",
      "Sign-off records confirming systems are restored and operating normally",
    ],
    reviewFrequencyDays: 365,
    weight: 1.0,
    questionText:
      "How do you verify that restored assets have integrity and that normal operations have truly resumed?",
  },
  {
    controlId: "RC.RP-06",
    functionId: "RC",
    categoryId: "RP",
    description:
      "The criteria for determining the end of incident recovery are applied, and incident-related documentation is completed.",
    requirements: [
      "Documented criteria for declaring recovery complete",
      "Completed incident documentation and after-action reports",
    ],
    reviewFrequencyDays: 365,
    weight: 1.0,
    questionText:
      "What criteria determine that incident recovery is officially complete, and how is the final documentation handled?",
  },

  // ---------------------------------------------------------------------------
  // RECOVER (RC) — Incident Recovery Communication (RC.CO)
  // ---------------------------------------------------------------------------
  {
    controlId: "RC.CO-03",
    functionId: "RC",
    categoryId: "CO",
    description:
      "Recovery activities and progress in restoring operational capabilities are communicated to designated internal and external stakeholders.",
    requirements: [
      "Recovery status communication plan defining audience and cadence",
      "Records of recovery progress updates sent to stakeholders",
    ],
    reviewFrequencyDays: 365,
    weight: 1.0,
    questionText:
      "How do you keep internal and external stakeholders informed about recovery progress during and after an incident?",
  },
  {
    controlId: "RC.CO-04",
    functionId: "RC",
    categoryId: "CO",
    description:
      "Public updates on incident recovery are shared using approved methods and messaging.",
    requirements: [
      "Approved public communication templates and approval workflows for incident updates",
      "Records of public statements or updates issued during past incident recoveries",
    ],
    reviewFrequencyDays: 365,
    weight: 1.0,
    questionText:
      "How do you handle public communications about incident recovery — who approves the messaging and through what channels?",
  },
];
