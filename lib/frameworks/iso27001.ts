export type IsoControl = {
  controlId: string;
  groupId: string;
  controlName: string;
  description: string;
  requirements: string[];
  reviewFrequencyDays: number;
  weight: number;
  questionText: string;
  questionContext: string;
  followUpTemplates: string[];
};

// ---------------------------------------------------------------------------
// ISO 27001:2022 — Mandatory Clauses (C.4 – C.10)
// ---------------------------------------------------------------------------

const MANDATORY_CLAUSES: IsoControl[] = [
  {
    controlId: "C.4.1",
    groupId: "org_context",
    controlName: "Context of the organization",
    description:
      "Determine external and internal issues relevant to the organization's purpose that affect its ability to achieve the intended outcomes of the ISMS.",
    requirements: [
      "Documented list of internal and external issues (e.g. PESTLE analysis, stakeholder map)",
      "Evidence that issues are reviewed and updated at least annually",
      "Minutes from management meetings where context was discussed",
    ],
    reviewFrequencyDays: 365,
    weight: 1.0,
    questionText:
      "How does your organisation identify and track the internal and external factors that shape your information security posture?",
    questionContext:
      "Clause 4.1 requires understanding the business environment, regulatory landscape, and internal capabilities that influence the ISMS.",
    followUpTemplates: [
      "Do you maintain a formal register of internal/external issues, and how often is it refreshed?",
      "How do changes in your market or regulatory environment feed into ISMS planning?",
      "Who is responsible for monitoring shifts in the threat landscape relevant to your context?",
    ],
  },
  {
    controlId: "C.4.2",
    groupId: "org_context",
    controlName: "Interested parties and their requirements",
    description:
      "Identify the interested parties relevant to the ISMS and their requirements, including legal, regulatory, and contractual obligations.",
    requirements: [
      "Stakeholder register listing interested parties and their security expectations",
      "Mapping of legal, regulatory, and contractual obligations to ISMS scope",
      "Evidence of periodic review of interested-party requirements",
    ],
    reviewFrequencyDays: 365,
    weight: 1.0,
    questionText:
      "Who are the key stakeholders that have expectations about how you protect information, and how do you track those expectations?",
    questionContext:
      "Clause 4.2 ensures the organisation knows who cares about its ISMS and what they need.",
    followUpTemplates: [
      "How do you capture contractual security requirements from customers or partners?",
      "Are regulatory obligations mapped to specific ISMS controls or processes?",
      "How are changes in stakeholder expectations communicated to the security team?",
    ],
  },
  {
    controlId: "C.5.1",
    groupId: "org_context",
    controlName: "Leadership and commitment",
    description:
      "Top management must demonstrate leadership and commitment to the ISMS by ensuring policy alignment, resource allocation, and promoting continual improvement.",
    requirements: [
      "Board or executive-level endorsement of the information security policy",
      "Evidence of budget and resource allocation for the ISMS",
      "Management review meeting minutes showing active engagement",
    ],
    reviewFrequencyDays: 365,
    weight: 1.0,
    questionText:
      "How does your executive leadership demonstrate visible commitment to information security?",
    questionContext:
      "Clause 5 requires that senior management actively champion the ISMS, not just sign off on paper.",
    followUpTemplates: [
      "Does your board or executive team receive regular information security briefings?",
      "How is the ISMS budget determined and approved at leadership level?",
      "Can you point to a recent decision where leadership prioritised security over convenience?",
    ],
  },
  {
    controlId: "C.6.1",
    groupId: "org_context",
    controlName: "Risk assessment and treatment planning",
    description:
      "Establish and maintain a risk assessment process that identifies, analyses, and evaluates information security risks, plus a risk treatment plan with selected controls.",
    requirements: [
      "Documented risk assessment methodology (criteria, likelihood, impact scales)",
      "Current risk register with risk owners and treatment decisions",
      "Statement of Applicability mapping selected Annex A controls to identified risks",
    ],
    reviewFrequencyDays: 365,
    weight: 1.0,
    questionText:
      "Walk me through your risk assessment process — how do you identify, score, and decide what to do about information security risks?",
    questionContext:
      "Clause 6 is the heart of the ISMS: the risk-based approach that drives control selection.",
    followUpTemplates: [
      "How often is the risk register reviewed, and what triggers an out-of-cycle reassessment?",
      "Who owns risk acceptance decisions, and is there a defined threshold for escalation?",
      "How does the Statement of Applicability link back to specific risk treatment decisions?",
    ],
  },
  {
    controlId: "C.7.1",
    groupId: "org_context",
    controlName: "Support and resources",
    description:
      "Determine and provide the resources, competence, awareness, communication, and documented information needed for the ISMS.",
    requirements: [
      "Resource plan or budget showing ISMS staffing and tooling",
      "Competence matrix or training records for ISMS roles",
      "Document control procedure for ISMS documentation lifecycle",
    ],
    reviewFrequencyDays: 365,
    weight: 1.0,
    questionText:
      "How do you make sure your team has the skills, tools, and bandwidth to run the ISMS effectively?",
    questionContext:
      "Clause 7 covers the practical enablers: people, money, training, communications, and document management.",
    followUpTemplates: [
      "Is there a formal competence framework for information security roles?",
      "How is ISMS documentation version-controlled and kept current?",
      "What communication channels exist for security-related announcements across the organisation?",
    ],
  },
  {
    controlId: "C.8.1",
    groupId: "org_context",
    controlName: "Operational planning and control",
    description:
      "Plan, implement, and control the processes needed to meet ISMS requirements, including risk assessments and risk treatment plans at planned intervals.",
    requirements: [
      "Operational procedures for executing risk treatment plans",
      "Records of risk assessments performed at planned intervals or after significant change",
      "Evidence that outsourced ISMS processes are controlled",
    ],
    reviewFrequencyDays: 365,
    weight: 1.0,
    questionText:
      "How do you turn your risk treatment plans into day-to-day operational security activities?",
    questionContext:
      "Clause 8 bridges strategy and execution — ensuring plans become reality.",
    followUpTemplates: [
      "How do you track completion of risk treatment actions across teams?",
      "What triggers an ad-hoc risk assessment outside the normal schedule?",
      "How are outsourced processes (e.g. SOC, managed services) governed under the ISMS?",
    ],
  },
  {
    controlId: "C.9.1",
    groupId: "org_context",
    controlName: "Performance evaluation and internal audit",
    description:
      "Monitor, measure, analyse, and evaluate ISMS performance. Conduct internal audits at planned intervals and perform management reviews.",
    requirements: [
      "ISMS metrics dashboard or KPI report",
      "Internal audit programme and completed audit reports with findings",
      "Management review minutes with decisions and action items",
    ],
    reviewFrequencyDays: 365,
    weight: 1.0,
    questionText:
      "How do you measure whether your ISMS is actually working, and what does your internal audit programme look like?",
    questionContext:
      "Clause 9 closes the feedback loop — you can't improve what you don't measure.",
    followUpTemplates: [
      "What key metrics or KPIs do you track for information security performance?",
      "How independent are your internal auditors from the teams they audit?",
      "What was the most significant finding from your last management review?",
    ],
  },
  {
    controlId: "C.10.1",
    groupId: "org_context",
    controlName: "Continual improvement",
    description:
      "Continually improve the suitability, adequacy, and effectiveness of the ISMS. React to nonconformities with corrective actions.",
    requirements: [
      "Nonconformity and corrective action register with root-cause analysis",
      "Evidence of closed corrective actions and effectiveness verification",
      "Improvement initiatives tracked and reviewed in management meetings",
    ],
    reviewFrequencyDays: 365,
    weight: 1.0,
    questionText:
      "When something goes wrong or an audit finds a gap, how does your corrective action process work end-to-end?",
    questionContext:
      "Clause 10 drives the Plan-Do-Check-Act cycle forward through corrective action and continual improvement.",
    followUpTemplates: [
      "Can you walk through a recent nonconformity from detection to verified closure?",
      "How do you ensure corrective actions address root cause rather than just symptoms?",
      "What mechanism exists for anyone in the organisation to suggest ISMS improvements?",
    ],
  },
];

// ---------------------------------------------------------------------------
// A.5 — Organizational Controls (A.5.1 – A.5.37)
// ---------------------------------------------------------------------------

const ANNEX_A5: IsoControl[] = [
  {
    controlId: "A.5.1",
    groupId: "org_context",
    controlName: "Policies for information security",
    description:
      "Define, approve, publish, communicate, and periodically review a set of information security policies that provide management direction and support.",
    requirements: [
      "Approved information security policy document signed by top management",
      "Evidence of policy communication to all employees and relevant external parties",
      "Record of policy review and update within the defined cycle",
    ],
    reviewFrequencyDays: 365,
    weight: 1.0,
    questionText:
      "Tell me about your information security policy suite — what policies do you maintain and how do you keep them current?",
    questionContext:
      "A.5.1 is the top-level policy anchor; auditors always ask for it first.",
    followUpTemplates: [
      "How do new joiners acknowledge they've read and understood the policies?",
      "Is there a defined owner for each policy, and how are conflicts between policies resolved?",
      "When was the last material update to the information security policy, and what triggered it?",
    ],
  },
  {
    controlId: "A.5.2",
    groupId: "org_context",
    controlName: "Information security roles and responsibilities",
    description:
      "Define and allocate information security responsibilities so every relevant role knows what is expected of them.",
    requirements: [
      "RACI matrix or role descriptions that include security responsibilities",
      "Appointment letters or terms of reference for key ISMS roles (e.g. CISO, risk owners)",
      "Evidence that responsibilities are communicated and understood",
    ],
    reviewFrequencyDays: 365,
    weight: 1.0,
    questionText:
      "How are information security roles and responsibilities defined across your organisation — who owns what?",
    questionContext:
      "A.5.2 ensures accountability is clear, not just assumed.",
    followUpTemplates: [
      "Is there a single person ultimately accountable for the ISMS, and how is that made visible?",
      "How do you handle security responsibilities for roles that span multiple departments?",
      "Are security responsibilities included in job descriptions and performance reviews?",
    ],
  },
  {
    controlId: "A.5.3",
    groupId: "org_context",
    controlName: "Segregation of duties",
    description:
      "Separate conflicting duties and areas of responsibility to reduce opportunities for unauthorised or unintentional modification or misuse of assets.",
    requirements: [
      "Documented segregation-of-duties matrix for critical processes (e.g. change approval vs. deployment)",
      "Technical enforcement via role-based access preventing conflicting permissions",
      "Periodic review confirming no single person can initiate and approve the same transaction",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "Where do you enforce segregation of duties, and how do you catch situations where one person can both initiate and approve a sensitive action?",
    questionContext:
      "A.5.3 prevents fraud and error by splitting conflicting responsibilities.",
    followUpTemplates: [
      "Can you give an example of a process where segregation is technically enforced?",
      "How do you handle segregation in small teams where people wear multiple hats?",
      "Are SoD violations flagged automatically or detected through periodic review?",
    ],
  },
  {
    controlId: "A.5.4",
    groupId: "org_context",
    controlName: "Management responsibilities",
    description:
      "Require all management to actively support information security within their areas of responsibility in accordance with policies and procedures.",
    requirements: [
      "Evidence that managers communicate security expectations to their teams",
      "Training or briefing records showing management participation in security awareness",
      "Documented escalation paths for security issues raised by staff",
    ],
    reviewFrequencyDays: 365,
    weight: 1.0,
    questionText:
      "How do your people-managers actively reinforce information security expectations with their teams?",
    questionContext:
      "A.5.4 ensures security culture is driven by line management, not just the security team.",
    followUpTemplates: [
      "Are managers held accountable for security compliance within their teams?",
      "How does management handle situations where business pressure conflicts with security requirements?",
      "Do managers receive specific security leadership training?",
    ],
  },
  {
    controlId: "A.5.5",
    groupId: "org_context",
    controlName: "Contact with authorities",
    description:
      "Maintain appropriate contacts with relevant authorities such as law enforcement, regulators, and supervisory bodies.",
    requirements: [
      "Contact register listing relevant authorities with contact details and trigger scenarios",
      "Defined process for when and how to notify authorities of security incidents",
      "Evidence of at least annual review of authority contact information",
    ],
    reviewFrequencyDays: 365,
    weight: 1.0,
    questionText:
      "If you had a major security incident tomorrow, which authorities would you need to contact and do you have those channels ready?",
    questionContext:
      "A.5.5 ensures the organisation isn't scrambling for phone numbers during a crisis.",
    followUpTemplates: [
      "Do you have pre-established relationships with law enforcement cyber units?",
      "How does your authority notification process integrate with your incident response plan?",
      "Are regulatory notification timelines (e.g. 72-hour GDPR breach notification) documented?",
    ],
  },
  {
    controlId: "A.5.6",
    groupId: "org_context",
    controlName: "Contact with special interest groups",
    description:
      "Maintain contacts with special interest groups, security forums, and professional associations to stay current on threats and best practices.",
    requirements: [
      "List of industry groups, ISACs, or professional bodies the organisation participates in",
      "Evidence of threat intelligence or best-practice sharing received from these groups",
      "Assigned personnel responsible for monitoring and disseminating relevant intelligence",
    ],
    reviewFrequencyDays: 365,
    weight: 1.0,
    questionText:
      "What industry groups, ISACs, or security communities does your team participate in to stay ahead of emerging threats?",
    questionContext:
      "A.5.6 leverages collective intelligence from peers and industry bodies.",
    followUpTemplates: [
      "How is threat intelligence from these groups fed into your risk assessment process?",
      "Do you contribute back to any of these communities, or primarily consume information?",
      "Has participation in a special interest group directly led to a security improvement?",
    ],
  },
  {
    controlId: "A.5.7",
    groupId: "org_context",
    controlName: "Threat intelligence",
    description:
      "Collect and analyse information about threats to information security to produce actionable threat intelligence.",
    requirements: [
      "Threat intelligence feeds or subscriptions actively consumed by the security team",
      "Documented process for triaging and acting on threat intelligence",
      "Evidence that threat intel has been used to update controls or risk assessments",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "How do you gather, analyse, and act on threat intelligence relevant to your organisation?",
    questionContext:
      "A.5.7 is new in 2022 — it formalises proactive threat awareness beyond just reacting to incidents.",
    followUpTemplates: [
      "What threat intelligence sources do you subscribe to (commercial feeds, OSINT, government alerts)?",
      "How quickly does actionable threat intelligence translate into a defensive change?",
      "Do you tailor threat intelligence to your specific industry and technology stack?",
    ],
  },
  {
    controlId: "A.5.8",
    groupId: "org_context",
    controlName: "Information security in project management",
    description:
      "Integrate information security into project management to ensure risks are identified and addressed throughout the project lifecycle.",
    requirements: [
      "Security checkpoints or gates embedded in the project management methodology",
      "Evidence of security risk assessments performed during project initiation or design phases",
      "Project closure sign-off that includes confirmation of security requirements met",
    ],
    reviewFrequencyDays: 365,
    weight: 1.0,
    questionText:
      "How is information security baked into your project management process — from inception to go-live?",
    questionContext:
      "A.5.8 prevents security from being bolted on as an afterthought at the end of projects.",
    followUpTemplates: [
      "At what project phase is a security risk assessment first performed?",
      "Is there a security sign-off gate before any project goes live?",
      "How do you handle projects that are behind schedule — does security get cut?",
    ],
  },
  {
    controlId: "A.5.9",
    groupId: "asset_mgmt",
    controlName: "Inventory of information and other associated assets",
    description:
      "Identify, document, and maintain an inventory of information and other associated assets, including their owners.",
    requirements: [
      "Asset register covering hardware, software, data, and cloud services with assigned owners",
      "Automated discovery or reconciliation process to keep the register accurate",
      "Periodic review confirming completeness and correctness of asset records",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "How do you maintain an accurate inventory of your information assets — hardware, software, data, and cloud services?",
    questionContext:
      "A.5.9 is foundational: you can't protect what you don't know you have.",
    followUpTemplates: [
      "How do you discover and register new assets as they're provisioned?",
      "What happens when an asset has no clear owner — how is that resolved?",
      "How do you handle shadow IT or unmanaged cloud services in your inventory?",
    ],
  },
  {
    controlId: "A.5.10",
    groupId: "asset_mgmt",
    controlName: "Acceptable use of information and other associated assets",
    description:
      "Define, document, and implement rules for the acceptable use of information and other associated assets.",
    requirements: [
      "Acceptable use policy covering information, systems, email, internet, and personal devices",
      "Signed acknowledgement from all employees and relevant third parties",
      "Evidence of enforcement actions or awareness reminders",
    ],
    reviewFrequencyDays: 365,
    weight: 1.0,
    questionText:
      "Do you have clear acceptable-use rules for company systems and data, and how do people know about them?",
    questionContext:
      "A.5.10 sets the behavioural boundaries for asset usage.",
    followUpTemplates: [
      "Does the acceptable use policy cover personal devices used for work (BYOD)?",
      "How is the acceptable use policy enforced — technically, administratively, or both?",
      "When was the last time the acceptable use policy was updated for new technology (e.g. generative AI)?",
    ],
  },
  {
    controlId: "A.5.11",
    groupId: "asset_mgmt",
    controlName: "Return of assets",
    description:
      "Ensure all employees and external party users return organisational assets upon termination of their employment, contract, or agreement.",
    requirements: [
      "Offboarding checklist that includes return of all physical and logical assets",
      "Evidence that asset return is tracked and reconciled against the asset register",
      "Process for remote-wiping or revoking access to assets that cannot be physically returned",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "When someone leaves the organisation, how do you make sure every asset — laptop, badge, token, licence — comes back?",
    questionContext:
      "A.5.11 closes the loop on asset lifecycle when employment ends.",
    followUpTemplates: [
      "Is asset return verified before final payroll processing?",
      "How do you handle assets that are lost or not returned by departing employees?",
      "Does your process cover cloud account deprovisioning and SaaS licence reclamation?",
    ],
  },
  {
    controlId: "A.5.12",
    groupId: "asset_mgmt",
    controlName: "Classification of information",
    description:
      "Classify information according to the organisation's needs for confidentiality, integrity, and availability, taking into account legal and business requirements.",
    requirements: [
      "Information classification scheme with defined levels (e.g. Public, Internal, Confidential, Restricted)",
      "Guidelines for classifying common information types (HR, financial, customer, IP)",
      "Evidence that information owners have applied classifications to key data sets",
    ],
    reviewFrequencyDays: 365,
    weight: 1.0,
    questionText:
      "What is your information classification scheme, and how consistently is it applied across the organisation?",
    questionContext:
      "A.5.12 provides the foundation for proportionate protection — not everything needs the same controls.",
    followUpTemplates: [
      "How many classification levels do you use, and is there clear guidance on which applies?",
      "Are classification labels applied to documents, emails, and data stores in practice?",
      "How do you handle situations where information is over- or under-classified?",
    ],
  },
  {
    controlId: "A.5.13",
    groupId: "asset_mgmt",
    controlName: "Labelling of information",
    description:
      "Develop and implement appropriate labelling procedures for information in accordance with the classification scheme.",
    requirements: [
      "Labelling standard specifying how each classification level is visually marked",
      "Technical controls that auto-label or enforce labelling (e.g. email headers, document footers)",
      "Spot-check evidence confirming that labelling is consistently applied",
    ],
    reviewFrequencyDays: 365,
    weight: 1.0,
    questionText:
      "How do you label information so people handling it know its classification at a glance?",
    questionContext:
      "A.5.13 makes classification visible and actionable in daily workflows.",
    followUpTemplates: [
      "Do you use automated labelling tools (e.g. Microsoft Purview) or is it manual?",
      "How are labels applied to unstructured data like chat messages or whiteboard photos?",
      "What happens if someone receives a document without a classification label?",
    ],
  },
  {
    controlId: "A.5.14",
    groupId: "asset_mgmt",
    controlName: "Information transfer",
    description:
      "Maintain rules, procedures, and agreements for the transfer of information within and outside the organisation, using any type of communication facility.",
    requirements: [
      "Information transfer policy covering email, file sharing, removable media, and APIs",
      "Technical controls enforcing secure transfer (e.g. TLS, encrypted file sharing, DLP rules)",
      "Transfer agreements with external parties where sensitive data is exchanged",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "How do you control how information moves in and out of the organisation — email, file shares, APIs, USB drives?",
    questionContext:
      "A.5.14 addresses the moment data leaves a controlled boundary.",
    followUpTemplates: [
      "Are USB drives or removable media permitted, and if so under what conditions?",
      "How do you ensure encryption is applied to sensitive data in transit?",
      "Do you have data transfer agreements with third parties who receive your data?",
    ],
  },
  {
    controlId: "A.5.15",
    groupId: "access_identity",
    controlName: "Access control",
    description:
      "Establish, document, and review an access control policy based on business and information security requirements.",
    requirements: [
      "Access control policy defining principles (least privilege, need-to-know, default-deny)",
      "Technical enforcement of policy across systems (e.g. RBAC, ABAC, network segmentation)",
      "Periodic access reviews confirming policy adherence",
    ],
    reviewFrequencyDays: 90,
    weight: 1.0,
    questionText:
      "What is your overarching access control philosophy, and how do you enforce least-privilege in practice?",
    questionContext:
      "A.5.15 sets the strategic direction for who gets access to what and why.",
    followUpTemplates: [
      "Is your access model role-based, attribute-based, or a hybrid?",
      "How do you handle exceptions where someone needs access outside their standard role?",
      "Are access decisions logged and auditable?",
    ],
  },
  {
    controlId: "A.5.16",
    groupId: "access_identity",
    controlName: "Identity management",
    description:
      "Manage the full lifecycle of identities, including registration, provisioning, review, and de-provisioning.",
    requirements: [
      "Identity lifecycle process from joiner to mover to leaver with defined SLAs",
      "Centralised identity provider (IdP) or directory used across key systems",
      "Evidence of timely de-provisioning when identities are no longer needed",
    ],
    reviewFrequencyDays: 90,
    weight: 1.0,
    questionText:
      "Walk me through the lifecycle of a user identity — from when someone joins, moves role, to when they leave.",
    questionContext:
      "A.5.16 ensures identities don't accumulate stale or excessive permissions over time.",
    followUpTemplates: [
      "Do you use a centralised identity provider, and what percentage of systems are integrated?",
      "What is your SLA for disabling accounts when someone leaves the organisation?",
      "How do you handle identity for non-human accounts like service accounts and API keys?",
    ],
  },
  {
    controlId: "A.5.17",
    groupId: "access_identity",
    controlName: "Authentication information",
    description:
      "Control the allocation and management of authentication information (passwords, tokens, certificates) through a defined process.",
    requirements: [
      "Authentication policy specifying password complexity, MFA requirements, and token handling",
      "Technical enforcement of password policy and MFA across critical systems",
      "Process for secure distribution and reset of authentication credentials",
    ],
    reviewFrequencyDays: 90,
    weight: 1.0,
    questionText:
      "How do you manage authentication credentials — passwords, MFA tokens, certificates — across your environment?",
    questionContext:
      "A.5.17 governs the secrets that prove identity. Weak credentials undermine every other control.",
    followUpTemplates: [
      "What is your MFA coverage — is it enforced for all users or only privileged accounts?",
      "How do you handle shared or service account credentials?",
      "Do you use a secrets manager for application-level authentication information?",
    ],
  },
  {
    controlId: "A.5.18",
    groupId: "access_identity",
    controlName: "Access rights",
    description:
      "Provision, review, modify, and remove access rights in accordance with the access control policy and based on business needs.",
    requirements: [
      "Formal access request and approval workflow for granting access rights",
      "User access reviews performed at defined intervals (e.g. quarterly for sensitive systems)",
      "Evidence of access removal upon role change or termination",
    ],
    reviewFrequencyDays: 90,
    weight: 1.0,
    questionText:
      "How do access rights get requested, approved, and reviewed — and how quickly are they removed when no longer needed?",
    questionContext:
      "A.5.18 is the operational engine of access control — the day-to-day granting and revoking.",
    followUpTemplates: [
      "How frequently are user access reviews conducted for your most sensitive systems?",
      "What tooling supports the access request and approval workflow?",
      "How do you detect and remediate excessive or orphaned access rights?",
    ],
  },
  {
    controlId: "A.5.19",
    groupId: "supplier_security",
    controlName: "Information security in supplier relationships",
    description:
      "Establish and maintain information security requirements for mitigating risks associated with supplier access to organisational assets.",
    requirements: [
      "Supplier security policy or standard defining baseline requirements for all suppliers",
      "Risk-based categorisation of suppliers (e.g. critical, high, medium, low)",
      "Due diligence process performed before onboarding new suppliers with data access",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "How do you assess and manage information security risks introduced by your suppliers and third parties?",
    questionContext:
      "A.5.19 recognises that your security is only as strong as your weakest supplier.",
    followUpTemplates: [
      "Do you maintain a register of suppliers with access to sensitive information?",
      "How do you categorise suppliers by security risk level?",
      "What due diligence do you perform before granting a new supplier access to your systems?",
    ],
  },
  {
    controlId: "A.5.20",
    groupId: "supplier_security",
    controlName: "Addressing information security within supplier agreements",
    description:
      "Include relevant information security requirements in agreements with suppliers, covering data handling, incident notification, audit rights, and sub-processing.",
    requirements: [
      "Standard security clauses or schedules included in supplier contracts",
      "Contractual requirement for suppliers to notify security incidents within defined timelines",
      "Right-to-audit clause or equivalent assurance mechanism (e.g. SOC 2 report acceptance)",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "What security requirements do you bake into supplier contracts, and how do you ensure they're enforceable?",
    questionContext:
      "A.5.20 turns security expectations into binding contractual obligations.",
    followUpTemplates: [
      "Do your supplier contracts include incident notification timelines?",
      "Do you have right-to-audit clauses or accept third-party assurance reports as alternatives?",
      "How do you handle suppliers who refuse to accept your standard security clauses?",
    ],
  },
  {
    controlId: "A.5.21",
    groupId: "supplier_security",
    controlName: "Managing information security in the ICT supply chain",
    description:
      "Define and implement processes to manage information security risks associated with the ICT products and services supply chain.",
    requirements: [
      "ICT supply chain risk assessment covering hardware, software, and service dependencies",
      "Requirements for suppliers to propagate security obligations to their sub-suppliers",
      "Monitoring of supply chain threat intelligence (e.g. software supply chain attacks)",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "How do you manage security risks that come through your technology supply chain — software dependencies, hardware sourcing, sub-contractors?",
    questionContext:
      "A.5.21 addresses multi-tier supply chain risk — your supplier's supplier can be your vulnerability.",
    followUpTemplates: [
      "Do you maintain a software bill of materials (SBOM) for critical applications?",
      "How do you verify the integrity of software and hardware received from suppliers?",
      "Are your key suppliers required to flow down security requirements to their sub-contractors?",
    ],
  },
  {
    controlId: "A.5.22",
    groupId: "supplier_security",
    controlName: "Monitoring, review and change management of supplier services",
    description:
      "Regularly monitor, review, evaluate, and manage changes to supplier information security practices and service delivery.",
    requirements: [
      "Periodic supplier security assessments or reviews (e.g. annual questionnaires, audits)",
      "Process for evaluating the impact of supplier changes on organisational security",
      "Tracking of supplier security incidents and remediation",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "Once a supplier is onboarded, how do you keep tabs on their security posture over time?",
    questionContext:
      "A.5.22 ensures supplier security doesn't become set-and-forget after contract signing.",
    followUpTemplates: [
      "How frequently do you reassess critical suppliers' security posture?",
      "What happens when a supplier notifies you of a significant change to their service?",
      "How are supplier security incidents tracked and followed up?",
    ],
  },
  {
    controlId: "A.5.23",
    groupId: "supplier_security",
    controlName: "Information security for use of cloud services",
    description:
      "Establish processes for acquisition, use, management, and exit from cloud services in line with the organisation's information security requirements.",
    requirements: [
      "Cloud security policy covering data residency, encryption, access, and shared responsibility",
      "Cloud service risk assessments performed before adoption of new cloud services",
      "Exit strategy or data portability plan for critical cloud services",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "How do you evaluate and govern the security of cloud services before and after you adopt them?",
    questionContext:
      "A.5.23 is new in 2022 — it specifically addresses cloud adoption risks and the shared responsibility model.",
    followUpTemplates: [
      "Do you have a formal process for approving new cloud services before they're adopted?",
      "How do you ensure your data can be extracted if you need to exit a cloud provider?",
      "How is the shared responsibility model documented and understood for each cloud service?",
    ],
  },
  {
    controlId: "A.5.24",
    groupId: "incident_mgmt",
    controlName: "Information security incident management planning and preparation",
    description:
      "Establish and maintain an incident management plan defining roles, responsibilities, procedures, and communication channels for responding to information security incidents.",
    requirements: [
      "Incident response plan with defined severity levels, roles, and escalation paths",
      "Incident response team identified with current contact information",
      "Evidence of incident response testing or simulation (e.g. tabletop exercise) within the past year",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "Walk me through your incident response plan — if a breach happened right now, who does what?",
    questionContext:
      "A.5.24 is about being prepared before an incident strikes, not scrambling during one.",
    followUpTemplates: [
      "When did you last run an incident response tabletop exercise or simulation?",
      "How are severity levels defined, and who has authority to escalate?",
      "Is your incident response plan integrated with your business continuity plan?",
    ],
  },
  {
    controlId: "A.5.25",
    groupId: "incident_mgmt",
    controlName: "Assessment and decision on information security events",
    description:
      "Assess information security events and decide whether they should be categorised as information security incidents.",
    requirements: [
      "Triage criteria for classifying events as incidents vs. false positives",
      "Defined process and responsible person for event-to-incident escalation decisions",
      "Evidence of event triage records showing classification decisions",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "How do you triage security events and decide which ones are real incidents worth mobilising for?",
    questionContext:
      "A.5.25 prevents alert fatigue by establishing clear escalation criteria.",
    followUpTemplates: [
      "What criteria distinguish a security event from a confirmed incident?",
      "Who makes the call to escalate an event to a full incident, and how quickly?",
      "How do you track false positive rates to tune your detection capabilities?",
    ],
  },
  {
    controlId: "A.5.26",
    groupId: "incident_mgmt",
    controlName: "Response to information security incidents",
    description:
      "Respond to information security incidents according to documented procedures, including containment, eradication, and recovery activities.",
    requirements: [
      "Documented response procedures for common incident types (malware, data breach, DDoS, insider threat)",
      "Evidence of incident response actions taken with timestamps (incident log)",
      "Post-incident handoff to recovery and normal operations",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "When an incident is confirmed, what does your containment and response playbook look like in practice?",
    questionContext:
      "A.5.26 is the 'do' phase of incident management — executing the response plan under pressure.",
    followUpTemplates: [
      "Do you have pre-built playbooks for different incident types (ransomware, data leak, etc.)?",
      "How do you coordinate response across teams (IT, legal, communications, management)?",
      "What tools support your incident response workflow?",
    ],
  },
  {
    controlId: "A.5.27",
    groupId: "incident_mgmt",
    controlName: "Learning from information security incidents",
    description:
      "Use knowledge gained from information security incidents to strengthen controls, update procedures, and prevent recurrence.",
    requirements: [
      "Post-incident review (blameless retrospective) conducted for all significant incidents",
      "Lessons-learned register with identified improvements and action owners",
      "Evidence that lessons learned have been implemented (e.g. control changes, training updates)",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "After an incident is resolved, how do you extract lessons and make sure the same thing doesn't happen again?",
    questionContext:
      "A.5.27 closes the improvement loop — incidents should make you stronger.",
    followUpTemplates: [
      "Do you conduct formal post-incident reviews, and are they blameless?",
      "Can you share an example where a past incident led to a meaningful security improvement?",
      "How are lessons learned communicated beyond the incident response team?",
    ],
  },
  {
    controlId: "A.5.28",
    groupId: "incident_mgmt",
    controlName: "Collection of evidence",
    description:
      "Establish and apply procedures for the identification, collection, acquisition, and preservation of evidence related to information security events.",
    requirements: [
      "Evidence handling procedures aligned with legal admissibility requirements",
      "Chain-of-custody process for digital forensic evidence",
      "Forensic tools and trained personnel available or on retainer",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "If an incident required forensic investigation or legal proceedings, how would you collect and preserve digital evidence?",
    questionContext:
      "A.5.28 ensures evidence integrity for potential legal or disciplinary action.",
    followUpTemplates: [
      "Do you have a chain-of-custody process for digital evidence?",
      "Are forensic capabilities available in-house or through a retained third party?",
      "How do you ensure evidence collection doesn't compromise the ongoing investigation or recovery?",
    ],
  },
  {
    controlId: "A.5.29",
    groupId: "business_continuity",
    controlName: "Information security during disruption",
    description:
      "Plan how to maintain information security at an appropriate level during disruption, whether caused by a crisis, disaster, or other business continuity event.",
    requirements: [
      "Business continuity plan that addresses information security requirements during disruption",
      "Defined minimum acceptable security posture for crisis operations",
      "Evidence of BCP testing that includes security scenario considerations",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "During a major disruption — natural disaster, ransomware, or infrastructure failure — how do you maintain your security posture?",
    questionContext:
      "A.5.29 prevents security from being abandoned in the rush to restore operations.",
    followUpTemplates: [
      "Do your business continuity plans define a minimum acceptable security baseline?",
      "How do you prevent crisis-mode workarounds from creating permanent security gaps?",
      "Has a past disruption ever exposed a gap in your security continuity planning?",
    ],
  },
  {
    controlId: "A.5.30",
    groupId: "business_continuity",
    controlName: "ICT readiness for business continuity",
    description:
      "Plan, implement, maintain, and test ICT readiness to ensure business continuity objectives can be met, including recovery time and recovery point objectives.",
    requirements: [
      "ICT continuity plan with defined RTOs and RPOs for critical systems",
      "Disaster recovery procedures and infrastructure (e.g. failover sites, cloud DR)",
      "Evidence of DR testing within the past year with documented results",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "What are your RTOs and RPOs for critical systems, and when did you last test whether you can actually meet them?",
    questionContext:
      "A.5.30 is new in 2022 — it elevates ICT disaster recovery to a first-class control.",
    followUpTemplates: [
      "Are RTOs and RPOs defined per system based on business impact analysis?",
      "What DR infrastructure do you have in place (hot standby, warm, cold)?",
      "What was the outcome of your most recent disaster recovery test?",
    ],
  },
  {
    controlId: "A.5.31",
    groupId: "compliance_legal",
    controlName: "Legal, statutory, regulatory and contractual requirements",
    description:
      "Identify, document, and keep up to date all relevant legal, statutory, regulatory, and contractual requirements related to information security.",
    requirements: [
      "Register of applicable legal and regulatory requirements with compliance status",
      "Mapping of legal requirements to specific ISMS controls and processes",
      "Process for monitoring changes in legislation and regulation",
    ],
    reviewFrequencyDays: 365,
    weight: 1.0,
    questionText:
      "How do you keep track of all the legal and regulatory requirements that apply to your information security programme?",
    questionContext:
      "A.5.31 ensures the organisation knows its compliance obligations and can demonstrate adherence.",
    followUpTemplates: [
      "Do you maintain a legal/regulatory compliance register, and who keeps it updated?",
      "How are new or changing regulations identified and assessed for ISMS impact?",
      "Are contractual security obligations from customer agreements tracked systematically?",
    ],
  },
  {
    controlId: "A.5.32",
    groupId: "compliance_legal",
    controlName: "Intellectual property rights",
    description:
      "Implement procedures to ensure compliance with legal, statutory, regulatory, and contractual requirements related to intellectual property rights and use of proprietary software.",
    requirements: [
      "Software licence register with compliance tracking against entitlements",
      "Policy prohibiting unauthorised software installation or use of pirated content",
      "Periodic software audit reconciling deployed software against valid licences",
    ],
    reviewFrequencyDays: 365,
    weight: 1.0,
    questionText:
      "How do you ensure compliance with software licensing and intellectual property obligations?",
    questionContext:
      "A.5.32 protects the organisation from legal exposure due to licence violations.",
    followUpTemplates: [
      "Do you run periodic software licence audits or use software asset management tools?",
      "How do you prevent unauthorised software from being installed on company systems?",
      "Are open-source licence obligations tracked for software you develop or distribute?",
    ],
  },
  {
    controlId: "A.5.33",
    groupId: "compliance_legal",
    controlName: "Protection of records",
    description:
      "Protect records from loss, destruction, falsification, unauthorised access, and unauthorised release in accordance with legal, regulatory, contractual, and business requirements.",
    requirements: [
      "Records retention schedule aligned with legal and business requirements",
      "Access controls and integrity protections on records repositories",
      "Evidence of secure disposal of records that have exceeded their retention period",
    ],
    reviewFrequencyDays: 365,
    weight: 1.0,
    questionText:
      "How do you protect critical business records and ensure they're retained for the right period and then securely disposed of?",
    questionContext:
      "A.5.33 covers the full lifecycle of records — from creation to controlled destruction.",
    followUpTemplates: [
      "Do you have a records retention schedule, and is it aligned with regulatory requirements?",
      "How are records protected from tampering or unauthorised modification?",
      "What is the process for securely disposing of records that have reached end-of-life?",
    ],
  },
  {
    controlId: "A.5.34",
    groupId: "compliance_legal",
    controlName: "Privacy and protection of PII",
    description:
      "Ensure privacy and protection of personally identifiable information (PII) as required by applicable legislation, regulation, and contractual obligations.",
    requirements: [
      "Privacy impact assessments (PIAs) performed for processing activities involving PII",
      "Data processing register or records of processing activities",
      "Technical and organisational measures for PII protection (pseudonymisation, access controls, encryption)",
    ],
    reviewFrequencyDays: 365,
    weight: 1.0,
    questionText:
      "How do you ensure personal data is identified, protected, and handled in line with privacy regulations?",
    questionContext:
      "A.5.34 bridges information security and data privacy — they're intertwined but distinct.",
    followUpTemplates: [
      "Do you maintain a register of processing activities as required by GDPR or equivalent?",
      "How are privacy impact assessments integrated into your project lifecycle?",
      "What technical measures (encryption, pseudonymisation, access controls) protect PII at rest and in transit?",
    ],
  },
  {
    controlId: "A.5.35",
    groupId: "compliance_legal",
    controlName: "Independent review of information security",
    description:
      "Independently review the organisation's approach to managing information security and its implementation at planned intervals or when significant changes occur.",
    requirements: [
      "Independent security review or audit conducted within the defined interval",
      "Scope of review covering policy, process, and technical control effectiveness",
      "Findings tracked through to remediation with evidence of closure",
    ],
    reviewFrequencyDays: 365,
    weight: 1.0,
    questionText:
      "When was your last independent security review, and what did it cover?",
    questionContext:
      "A.5.35 provides an objective lens — internal teams can have blind spots.",
    followUpTemplates: [
      "Was the review conducted by an external party or an internal team independent of the ISMS?",
      "How are review findings prioritised and tracked to closure?",
      "Did the last review result in any significant changes to your security programme?",
    ],
  },
  {
    controlId: "A.5.36",
    groupId: "compliance_legal",
    controlName: "Compliance with policies, rules and standards for information security",
    description:
      "Regularly review compliance of information processing and procedures with the organisation's information security policies, standards, and other security requirements.",
    requirements: [
      "Compliance monitoring programme covering key policies and standards",
      "Evidence of compliance checks (e.g. configuration audits, policy adherence reviews)",
      "Non-compliance findings tracked and remediated",
    ],
    reviewFrequencyDays: 365,
    weight: 1.0,
    questionText:
      "How do you verify that people and systems are actually complying with your security policies in practice?",
    questionContext:
      "A.5.36 addresses the gap between policy-on-paper and policy-in-practice.",
    followUpTemplates: [
      "Do you conduct periodic technical compliance checks against your own standards?",
      "How are policy violations detected, reported, and addressed?",
      "What is the escalation path when a business unit is persistently non-compliant?",
    ],
  },
  {
    controlId: "A.5.37",
    groupId: "compliance_legal",
    controlName: "Documented operating procedures",
    description:
      "Document and make available operating procedures for information processing facilities to ensure consistent and secure operations.",
    requirements: [
      "Operating procedures documented for critical systems and processes",
      "Procedures reviewed and updated at defined intervals",
      "Evidence that procedures are accessible to personnel who need them",
    ],
    reviewFrequencyDays: 365,
    weight: 1.0,
    questionText:
      "Are your key operational security procedures documented, and how do you keep them current?",
    questionContext:
      "A.5.37 ensures institutional knowledge is captured, not trapped in individuals' heads.",
    followUpTemplates: [
      "How do you ensure procedures are updated when systems or processes change?",
      "Are procedures version-controlled and easily accessible to operations staff?",
      "Do you have procedures for common security operations tasks (patching, backup, log review)?",
    ],
  },
];

// ---------------------------------------------------------------------------
// A.6 — People Controls (A.6.1 – A.6.8)
// ---------------------------------------------------------------------------

const ANNEX_A6: IsoControl[] = [
  {
    controlId: "A.6.1",
    groupId: "org_context",
    controlName: "Screening",
    description:
      "Conduct background verification checks on all candidates for employment in accordance with relevant laws, regulations, and proportionate to business requirements and risk.",
    requirements: [
      "Screening policy defining checks required for different role categories (e.g. identity, criminal, credit)",
      "Evidence of screening completed for recent hires before access was granted",
      "Process for re-screening when employees move to higher-trust roles",
    ],
    reviewFrequencyDays: 365,
    weight: 1.0,
    questionText:
      "What pre-employment screening do you perform, and does it scale with the sensitivity of the role?",
    questionContext:
      "A.6.1 mitigates insider risk starting at the hiring stage.",
    followUpTemplates: [
      "Are screening requirements defined differently for roles with access to sensitive data?",
      "How do you handle candidates from jurisdictions where background checks are limited?",
      "Is re-screening performed when employees move into higher-privilege roles?",
    ],
  },
  {
    controlId: "A.6.2",
    groupId: "compliance_legal",
    controlName: "Terms and conditions of employment",
    description:
      "Include information security responsibilities in employment contractual agreements, stating employees' and the organisation's obligations.",
    requirements: [
      "Employment contracts or agreements that include information security clauses",
      "Signed acknowledgement of acceptable use and confidentiality obligations",
      "Security responsibilities documented for contractors and temporary staff",
    ],
    reviewFrequencyDays: 365,
    weight: 1.0,
    questionText:
      "Do your employment contracts clearly set out information security responsibilities, and do contractors get the same treatment?",
    questionContext:
      "A.6.2 makes security obligations legally binding from day one.",
    followUpTemplates: [
      "Are security clauses in employment contracts reviewed by legal periodically?",
      "Do contractors and temporary staff sign equivalent security agreements?",
      "How do you handle employees who refuse to sign updated security terms?",
    ],
  },
  {
    controlId: "A.6.3",
    groupId: "org_context",
    controlName: "Information security awareness, education and training",
    description:
      "Provide regular information security awareness education and training to all personnel, tailored to their role and responsibilities.",
    requirements: [
      "Annual security awareness training programme with completion tracking",
      "Role-specific training for high-risk roles (e.g. developers, administrators, executives)",
      "Phishing simulation or practical exercises to measure awareness effectiveness",
    ],
    reviewFrequencyDays: 365,
    weight: 1.0,
    questionText:
      "What does your security awareness programme look like, and how do you measure whether it's actually changing behaviour?",
    questionContext:
      "A.6.3 goes beyond checkbox training — it should meaningfully reduce human risk.",
    followUpTemplates: [
      "What is your training completion rate, and how do you chase non-completers?",
      "Do you run phishing simulations, and what are the click-through rates trending?",
      "Is training content updated to reflect current threats (e.g. AI-powered social engineering)?",
    ],
  },
  {
    controlId: "A.6.4",
    groupId: "compliance_legal",
    controlName: "Disciplinary process",
    description:
      "Maintain a formal disciplinary process for taking action against personnel who have committed an information security policy violation.",
    requirements: [
      "Disciplinary policy that covers information security violations",
      "Defined escalation levels (verbal warning, written warning, termination) for different severities",
      "Evidence that the process has been communicated to all employees",
    ],
    reviewFrequencyDays: 365,
    weight: 1.0,
    questionText:
      "What happens when someone violates your information security policies — is there a clear and fair disciplinary process?",
    questionContext:
      "A.6.4 provides the enforcement teeth behind security policies.",
    followUpTemplates: [
      "Are disciplinary consequences proportionate to the severity and intent of the violation?",
      "How do you ensure the process is applied consistently across the organisation?",
      "Is the disciplinary process communicated during onboarding so expectations are clear?",
    ],
  },
  {
    controlId: "A.6.5",
    groupId: "org_context",
    controlName: "Responsibilities after termination or change of employment",
    description:
      "Define, communicate, and enforce information security responsibilities that remain valid after termination or change of employment.",
    requirements: [
      "Offboarding procedure that communicates ongoing confidentiality obligations",
      "Post-employment NDA or confidentiality reminder issued at exit",
      "Process for revoking access and returning assets on or before the last working day",
    ],
    reviewFrequencyDays: 365,
    weight: 1.0,
    questionText:
      "When someone leaves or changes role, how do you make sure they understand their ongoing security obligations?",
    questionContext:
      "A.6.5 extends the security relationship beyond the last day of employment.",
    followUpTemplates: [
      "Do departing employees receive a formal reminder of their confidentiality obligations?",
      "How quickly are access rights revoked when someone leaves — same day, or is there a gap?",
      "How do you handle knowledge transfer of security-relevant information during offboarding?",
    ],
  },
  {
    controlId: "A.6.6",
    groupId: "compliance_legal",
    controlName: "Confidentiality or non-disclosure agreements",
    description:
      "Identify, regularly review, and document requirements for confidentiality or non-disclosure agreements reflecting the organisation's needs for information protection.",
    requirements: [
      "Standard NDA template reviewed and approved by legal",
      "NDAs in place for all personnel and third parties with access to confidential information",
      "Register tracking NDA coverage and renewal dates",
    ],
    reviewFrequencyDays: 365,
    weight: 1.0,
    questionText:
      "How do you ensure NDAs are in place for everyone who has access to your confidential information?",
    questionContext:
      "A.6.6 provides legal protection for information shared within trust relationships.",
    followUpTemplates: [
      "Do you track NDA coverage and identify gaps for contractors or partners?",
      "Are NDA terms reviewed periodically to reflect changes in the business or legal landscape?",
      "How do you handle situations where a third party is reluctant to sign your NDA?",
    ],
  },
  {
    controlId: "A.6.7",
    groupId: "physical_security",
    controlName: "Remote working",
    description:
      "Implement security measures when personnel are working remotely to protect information accessed, processed, or stored outside organisational premises.",
    requirements: [
      "Remote working policy covering home networks, device security, and physical workspace",
      "Technical controls for remote access (VPN or ZTNA, endpoint protection, MFA)",
      "Guidance on secure handling of sensitive information outside the office",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "How do you secure the remote working environment — home networks, personal devices, physical workspace?",
    questionContext:
      "A.6.7 addresses the expanded attack surface of hybrid and remote work.",
    followUpTemplates: [
      "Is remote access to corporate systems secured with VPN or zero-trust network access?",
      "How do you address the physical security of sensitive information in home offices?",
      "Are there restrictions on which data or systems can be accessed from remote locations?",
    ],
  },
  {
    controlId: "A.6.8",
    groupId: "incident_mgmt",
    controlName: "Information security event reporting",
    description:
      "Provide a mechanism for personnel to report observed or suspected information security events through appropriate channels in a timely manner.",
    requirements: [
      "Clear reporting channel (email, portal, hotline) communicated to all staff",
      "Defined expectation for reporting timelines and what constitutes a reportable event",
      "Evidence that reports are acknowledged and triaged promptly",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "How easy is it for anyone in your organisation to report a suspected security event, and do people actually use the process?",
    questionContext:
      "A.6.8 relies on human sensors — detection fails if people don't know how or are afraid to report.",
    followUpTemplates: [
      "What channels exist for reporting security events (email, portal, Slack, phone)?",
      "Is there a no-blame culture for reporting, even if the reporter made the mistake?",
      "How quickly are reported events acknowledged and triaged?",
    ],
  },
];

// ---------------------------------------------------------------------------
// A.7 — Physical Controls (A.7.1 – A.7.14)
// ---------------------------------------------------------------------------

const ANNEX_A7: IsoControl[] = [
  {
    controlId: "A.7.1",
    groupId: "physical_security",
    controlName: "Physical security perimeters",
    description:
      "Define and use security perimeters to protect areas containing sensitive information and information processing facilities.",
    requirements: [
      "Defined physical security zones with documented perimeter boundaries",
      "Access restrictions at each perimeter (walls, locked doors, reception areas)",
      "Periodic physical security assessment of perimeter effectiveness",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "How are your physical security zones defined, and what controls protect each perimeter boundary?",
    questionContext:
      "A.7.1 establishes the physical boundaries that protect sensitive areas.",
    followUpTemplates: [
      "Do you have multiple security zones (e.g. public, restricted, secure) with increasing controls?",
      "How are perimeter breaches detected — alarms, cameras, motion sensors?",
      "When was the last physical security assessment of your perimeters?",
    ],
  },
  {
    controlId: "A.7.2",
    groupId: "physical_security",
    controlName: "Physical entry",
    description:
      "Secure areas shall be protected by appropriate entry controls to ensure only authorised personnel are allowed access.",
    requirements: [
      "Entry control mechanisms (badge readers, biometrics, reception sign-in) at secure areas",
      "Visitor management process including escort requirements and visitor logs",
      "Periodic review of physical access rights and badge holder lists",
    ],
    reviewFrequencyDays: 90,
    weight: 1.0,
    questionText:
      "How do you control physical entry to your facilities, and how are visitors managed?",
    questionContext:
      "A.7.2 controls who physically enters your secure areas.",
    followUpTemplates: [
      "Are all physical access events logged (badge swipes, visitor sign-ins)?",
      "How frequently is the physical access list reviewed for accuracy?",
      "What is the process for granting and revoking physical access for employees and contractors?",
    ],
  },
  {
    controlId: "A.7.3",
    groupId: "physical_security",
    controlName: "Securing offices, rooms and facilities",
    description:
      "Design and apply physical security for offices, rooms, and facilities to prevent unauthorised physical access, damage, and interference.",
    requirements: [
      "Server rooms and sensitive areas secured with additional locks or restricted access",
      "Clean-room or sensitive discussion areas protected from eavesdropping",
      "Physical security measures proportionate to the sensitivity of the area",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "Beyond perimeter access, how are individual offices, server rooms, and sensitive rooms secured?",
    questionContext:
      "A.7.3 provides layered physical defence within the perimeter.",
    followUpTemplates: [
      "Are server rooms or network closets under separate access control from general office areas?",
      "How do you prevent tailgating into restricted rooms?",
      "Are meeting rooms for sensitive discussions protected from eavesdropping (acoustic, visual)?",
    ],
  },
  {
    controlId: "A.7.4",
    groupId: "physical_security",
    controlName: "Physical security monitoring",
    description:
      "Continuously monitor premises for unauthorised physical access using surveillance tools such as CCTV, guards, or intrusion detection systems.",
    requirements: [
      "CCTV or surveillance coverage of entry points and sensitive areas",
      "Monitoring process (guards, central monitoring station, or automated alerts)",
      "Retention policy for surveillance footage meeting legal requirements",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "How do you monitor your premises for unauthorised physical access — cameras, guards, alarms?",
    questionContext:
      "A.7.4 is new in 2022 — it explicitly requires ongoing physical monitoring, not just barriers.",
    followUpTemplates: [
      "Is CCTV footage reviewed proactively or only after incidents?",
      "How long is surveillance footage retained, and does this meet regulatory requirements?",
      "Are after-hours intrusion detection systems in place for sensitive areas?",
    ],
  },
  {
    controlId: "A.7.5",
    groupId: "physical_security",
    controlName: "Protecting against physical and environmental threats",
    description:
      "Design and implement protection against physical and environmental threats such as natural disasters, malicious attack, or accidents.",
    requirements: [
      "Risk assessment for environmental threats (fire, flood, earthquake, power failure) at each site",
      "Protection measures in place (fire suppression, flood barriers, UPS, generators)",
      "Maintenance records for environmental protection systems",
    ],
    reviewFrequencyDays: 365,
    weight: 1.0,
    questionText:
      "What protections are in place against environmental threats — fire, flooding, power loss, extreme weather?",
    questionContext:
      "A.7.5 addresses threats that come from nature or infrastructure failure rather than adversaries.",
    followUpTemplates: [
      "Do you have fire suppression systems in server rooms, and when were they last tested?",
      "Are critical facilities protected against flooding (raised floors, water sensors)?",
      "What is your UPS and generator backup capacity for critical systems?",
    ],
  },
  {
    controlId: "A.7.6",
    groupId: "physical_security",
    controlName: "Working in secure areas",
    description:
      "Design and implement procedures for working in secure areas to prevent unauthorised observation, interference, or tampering.",
    requirements: [
      "Rules for working in secure areas (no phones, no lone working, supervised access for visitors)",
      "Sign-in/sign-out requirements for secure area access",
      "Prohibition on recording devices in classified zones",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "What additional rules apply when working in your most secure areas — server rooms, vaults, SCIFs?",
    questionContext:
      "A.7.6 adds procedural controls on top of the physical barriers.",
    followUpTemplates: [
      "Are personal electronic devices restricted in sensitive areas?",
      "Is lone working in secure areas prohibited or subject to additional controls?",
      "How are violations of secure area rules detected and enforced?",
    ],
  },
  {
    controlId: "A.7.7",
    groupId: "physical_security",
    controlName: "Clear desk and clear screen",
    description:
      "Define and enforce rules for clear desks for papers and removable storage media, and clear screens for information processing facilities.",
    requirements: [
      "Clear desk and clear screen policy communicated to all staff",
      "Auto-lock configuration on workstations (e.g. 5-minute inactivity timeout)",
      "Periodic walkthroughs or spot checks to verify compliance",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "Do you enforce a clear desk and clear screen policy, and how do you check that people follow it?",
    questionContext:
      "A.7.7 reduces the risk of information exposure from unattended workspaces.",
    followUpTemplates: [
      "Is auto-lock enforced on all workstations via policy (e.g. GPO, MDM)?",
      "Do you conduct clean-desk audits or spot checks?",
      "Are secure storage facilities (lockable drawers, cabinets) available for sensitive documents?",
    ],
  },
  {
    controlId: "A.7.8",
    groupId: "physical_security",
    controlName: "Equipment siting and protection",
    description:
      "Site and protect equipment to reduce risks from environmental threats and hazards, and opportunities for unauthorised access.",
    requirements: [
      "Critical equipment (servers, network gear) located in controlled environments",
      "Environmental controls (temperature, humidity monitoring) for server rooms",
      "Physical protection of equipment from accidental damage or theft",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "Where is your critical IT equipment physically located, and what protects it from environmental and physical risks?",
    questionContext:
      "A.7.8 ensures hardware is housed in appropriate conditions.",
    followUpTemplates: [
      "Are server rooms temperature and humidity monitored with automated alerts?",
      "How is critical equipment protected from accidental damage (e.g. water pipes above servers)?",
      "Is there redundancy in environmental controls (backup cooling, dual power feeds)?",
    ],
  },
  {
    controlId: "A.7.9",
    groupId: "physical_security",
    controlName: "Security of assets off-premises",
    description:
      "Apply security controls to off-premises assets, taking into account the different risks of working outside the organisation's premises.",
    requirements: [
      "Policy covering security of laptops, mobile devices, and media taken off-site",
      "Encryption required for all portable devices and removable media",
      "Process for reporting lost or stolen off-premises assets",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "How do you protect assets — laptops, phones, portable media — when they leave your premises?",
    questionContext:
      "A.7.9 extends physical protection to equipment used outside the office.",
    followUpTemplates: [
      "Is full-disk encryption enforced on all laptops and portable storage?",
      "What is the process when a device is reported lost or stolen?",
      "Are there restrictions on what data can be stored on portable devices?",
    ],
  },
  {
    controlId: "A.7.10",
    groupId: "physical_security",
    controlName: "Storage media",
    description:
      "Manage storage media through their lifecycle including acquisition, use, transportation, and disposal to prevent unauthorised disclosure, modification, removal, or destruction of information.",
    requirements: [
      "Storage media management policy covering handling, transportation, and disposal",
      "Secure erasure or destruction procedures for media containing sensitive data",
      "Tracking of removable storage media containing classified information",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "How do you manage storage media through its lifecycle — especially when it's being transported or disposed of?",
    questionContext:
      "A.7.10 covers the physical handling of media that stores your data.",
    followUpTemplates: [
      "What method do you use for secure destruction of storage media (degaussing, shredding, crypto-erase)?",
      "Are certificates of destruction obtained for securely disposed media?",
      "How is removable storage media tracked when it contains sensitive information?",
    ],
  },
  {
    controlId: "A.7.11",
    groupId: "physical_security",
    controlName: "Supporting utilities",
    description:
      "Protect information processing facilities from power failures and other disruptions caused by failures in supporting utilities (power, cooling, water, telecommunications).",
    requirements: [
      "UPS and/or backup generator provision for critical systems",
      "Redundant telecommunications connections for critical facilities",
      "Regular testing and maintenance records for utility backup systems",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "How resilient are your supporting utilities — power, cooling, network — against failure?",
    questionContext:
      "A.7.11 ensures the infrastructure supporting your systems is itself reliable.",
    followUpTemplates: [
      "How long can your UPS systems sustain critical operations, and do generators auto-start?",
      "Do you have redundant internet or telecommunications connections?",
      "When were backup power and cooling systems last tested under load?",
    ],
  },
  {
    controlId: "A.7.12",
    groupId: "physical_security",
    controlName: "Cabling security",
    description:
      "Protect power and telecommunications cabling carrying data or supporting information services from interception, interference, or damage.",
    requirements: [
      "Network and power cabling in secure conduits or protected routes",
      "Separation of power and data cabling to prevent interference",
      "Patch panels and network ports in locked cabinets with restricted access",
    ],
    reviewFrequencyDays: 365,
    weight: 1.0,
    questionText:
      "How do you protect network and power cabling from tampering, damage, or interception?",
    questionContext:
      "A.7.12 addresses the often-overlooked physical layer of network security.",
    followUpTemplates: [
      "Are network cables run through secure conduits, or are they exposed and accessible?",
      "Are unused network ports in public areas disabled?",
      "Is there separation between power and data cabling to prevent interference?",
    ],
  },
  {
    controlId: "A.7.13",
    groupId: "physical_security",
    controlName: "Equipment maintenance",
    description:
      "Maintain equipment correctly to ensure availability, integrity, and continued compliance with security requirements.",
    requirements: [
      "Maintenance schedule for critical equipment (servers, network, environmental controls)",
      "Maintenance records with details of work performed and by whom",
      "Controls on maintenance personnel (clearance, supervision, data sanitisation before repair)",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "How do you ensure critical equipment is maintained on schedule, and what controls apply to maintenance personnel?",
    questionContext:
      "A.7.13 keeps equipment reliable and prevents maintenance visits from becoming attack vectors.",
    followUpTemplates: [
      "Are maintenance personnel vetted and supervised when working on sensitive equipment?",
      "Is data sanitised from equipment before it's sent for external repair?",
      "Do you track maintenance activities for all critical infrastructure components?",
    ],
  },
  {
    controlId: "A.7.14",
    groupId: "physical_security",
    controlName: "Secure disposal or re-use of equipment",
    description:
      "Verify that all items of equipment containing storage media are securely wiped or physically destroyed before disposal or re-use.",
    requirements: [
      "Secure disposal procedure for equipment containing storage media",
      "Certificates of destruction for disposed equipment and media",
      "Verification that data has been irretrievably removed before equipment re-use",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "Before equipment is disposed of or re-used, how do you ensure all data is irretrievably removed?",
    questionContext:
      "A.7.14 prevents data breaches through improperly disposed or recycled hardware.",
    followUpTemplates: [
      "Do you use certified data destruction methods and retain certificates of destruction?",
      "Is there a difference in disposal procedures for equipment that held classified vs. general data?",
      "How do you handle disposal of leased equipment that must be returned to a vendor?",
    ],
  },
];

// ---------------------------------------------------------------------------
// A.8 — Technological Controls (A.8.1 – A.8.34)
// ---------------------------------------------------------------------------

const ANNEX_A8: IsoControl[] = [
  {
    controlId: "A.8.1",
    groupId: "access_identity",
    controlName: "User endpoint devices",
    description:
      "Protect information stored on, processed by, or accessible via user endpoint devices (laptops, mobiles, tablets).",
    requirements: [
      "Endpoint protection policy covering device encryption, patching, and security software",
      "Mobile device management (MDM) or endpoint detection and response (EDR) deployed",
      "Configuration baselines enforced on managed endpoints",
    ],
    reviewFrequencyDays: 90,
    weight: 1.0,
    questionText:
      "How do you secure and manage user endpoint devices — laptops, phones, tablets — across your workforce?",
    questionContext:
      "A.8.1 covers the devices where people interact with your data every day.",
    followUpTemplates: [
      "Is endpoint detection and response (EDR) deployed on all managed devices?",
      "How do you enforce device security baselines (encryption, patching, anti-malware)?",
      "Are unmanaged or BYOD devices permitted, and if so what controls apply?",
    ],
  },
  {
    controlId: "A.8.2",
    groupId: "access_identity",
    controlName: "Privileged access rights",
    description:
      "Restrict and manage the allocation and use of privileged access rights, including administrative accounts and elevated permissions.",
    requirements: [
      "Inventory of privileged accounts with assigned owners",
      "Privileged access management (PAM) solution or equivalent controls (just-in-time, session recording)",
      "Regular review of privileged access rights with evidence of removal of unnecessary privileges",
    ],
    reviewFrequencyDays: 90,
    weight: 1.0,
    questionText:
      "How do you manage privileged access — admin accounts, root, service accounts with elevated permissions?",
    questionContext:
      "A.8.2 targets the keys to the kingdom. Compromised privileged accounts cause the worst breaches.",
    followUpTemplates: [
      "Do you use a privileged access management (PAM) tool with session recording?",
      "Are privileged accounts separate from daily-use accounts (no standing admin)?",
      "How often are privileged access rights reviewed and recertified?",
    ],
  },
  {
    controlId: "A.8.3",
    groupId: "access_identity",
    controlName: "Information access restriction",
    description:
      "Restrict access to information and other associated assets in accordance with the established access control policy.",
    requirements: [
      "Access restrictions implemented at application, database, and file system levels",
      "Role-based access control (RBAC) or equivalent enforced in applications",
      "Evidence that users can only access information appropriate to their role",
    ],
    reviewFrequencyDays: 90,
    weight: 1.0,
    questionText:
      "How do you technically enforce that people can only access the information they need for their role?",
    questionContext:
      "A.8.3 is the technical implementation of need-to-know and least-privilege principles.",
    followUpTemplates: [
      "Are access restrictions enforced at the application, database, and file system layers?",
      "How do you test that access restrictions actually work as intended?",
      "Can users share or delegate their access, and if so how is that controlled?",
    ],
  },
  {
    controlId: "A.8.4",
    groupId: "access_identity",
    controlName: "Access to source code",
    description:
      "Manage access to source code, development tools, and software libraries to prevent the introduction of unauthorised functionality and maintain intellectual property protection.",
    requirements: [
      "Source code repositories with access control (branch protection, role-based permissions)",
      "Audit trail of code changes (commits, merge requests) linked to authenticated identities",
      "Restricted access to production deployment pipelines",
    ],
    reviewFrequencyDays: 90,
    weight: 1.0,
    questionText:
      "How do you control who can access, modify, and deploy source code?",
    questionContext:
      "A.8.4 protects both intellectual property and the integrity of your software.",
    followUpTemplates: [
      "Are code repositories secured with branch protection rules and mandatory code review?",
      "Is access to production deployment pipelines restricted to authorised personnel?",
      "How do you prevent secrets or credentials from being committed into source code?",
    ],
  },
  {
    controlId: "A.8.5",
    groupId: "access_identity",
    controlName: "Secure authentication",
    description:
      "Implement secure authentication technologies and procedures based on information access restrictions and the access control policy.",
    requirements: [
      "Multi-factor authentication (MFA) enforced for remote access, cloud services, and administrative functions",
      "Authentication mechanisms resistant to common attacks (credential stuffing, phishing)",
      "Monitoring and alerting on authentication anomalies (impossible travel, brute force)",
    ],
    reviewFrequencyDays: 90,
    weight: 1.0,
    questionText:
      "How robust is your authentication — where is MFA enforced, and how do you detect credential-based attacks?",
    questionContext:
      "A.8.5 is new in 2022 — it elevates authentication from a sub-control to a standalone requirement.",
    followUpTemplates: [
      "What percentage of your systems enforce MFA for all users?",
      "Are you using phishing-resistant MFA (e.g. FIDO2/WebAuthn) or SMS/OTP?",
      "How do you detect and respond to brute force or credential stuffing attacks?",
    ],
  },
  {
    controlId: "A.8.6",
    groupId: "tech_controls",
    controlName: "Capacity management",
    description:
      "Monitor and adjust the use of resources to ensure required system performance, and project future capacity requirements.",
    requirements: [
      "Capacity monitoring for critical systems (CPU, memory, storage, bandwidth)",
      "Alerting thresholds configured for capacity approaching limits",
      "Capacity planning process that considers growth and seasonal demand",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "How do you monitor system capacity and plan ahead so you don't run out of resources at the worst time?",
    questionContext:
      "A.8.6 prevents availability incidents caused by capacity exhaustion.",
    followUpTemplates: [
      "Are there automated alerts when systems approach capacity thresholds?",
      "Do you perform capacity planning exercises for anticipated growth or seasonal peaks?",
      "Has a capacity issue ever led to a service outage, and what was done to prevent recurrence?",
    ],
  },
  {
    controlId: "A.8.7",
    groupId: "tech_controls",
    controlName: "Protection against malware",
    description:
      "Implement detection, prevention, and recovery controls to protect against malware, combined with appropriate user awareness.",
    requirements: [
      "Anti-malware/EDR deployed on all endpoints and servers with current signatures or heuristics",
      "Email and web gateway filtering to block malicious content",
      "Procedures for responding to malware detection events",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "What layers of malware protection do you have in place across endpoints, email, and web traffic?",
    questionContext:
      "A.8.7 addresses the most common technical attack vector: malicious software.",
    followUpTemplates: [
      "Is anti-malware protection deployed on all endpoints including servers and mobile devices?",
      "Do you use email attachment sandboxing or link scanning?",
      "How quickly are malware detections investigated and resolved?",
    ],
  },
  {
    controlId: "A.8.8",
    groupId: "tech_controls",
    controlName: "Management of technical vulnerabilities",
    description:
      "Obtain timely information about technical vulnerabilities of information systems, evaluate exposure, and take appropriate remediation measures.",
    requirements: [
      "Vulnerability scanning programme (internal and external) at defined frequency",
      "Patch management process with defined SLAs based on vulnerability severity",
      "Evidence of vulnerability remediation tracking and exception management",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "How do you find and fix technical vulnerabilities across your infrastructure and applications?",
    questionContext:
      "A.8.8 is about staying ahead of the vulnerability curve before attackers exploit gaps.",
    followUpTemplates: [
      "What are your patch SLAs — how quickly must critical vulnerabilities be remediated?",
      "Do you perform both authenticated and unauthenticated vulnerability scans?",
      "How do you handle vulnerabilities that can't be patched immediately (compensating controls)?",
    ],
  },
  {
    controlId: "A.8.9",
    groupId: "tech_controls",
    controlName: "Configuration management",
    description:
      "Establish, document, implement, monitor, and review security configurations of hardware, software, services, and networks.",
    requirements: [
      "Security configuration baselines (hardening standards) for key platforms (OS, database, cloud)",
      "Automated configuration compliance scanning or drift detection",
      "Change management process for configuration changes with approval workflow",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "Do you maintain security configuration baselines for your systems, and how do you detect drift from those baselines?",
    questionContext:
      "A.8.9 is new in 2022 — it formalises what was previously scattered across multiple controls.",
    followUpTemplates: [
      "What hardening standards do you follow (CIS Benchmarks, vendor guidelines, custom)?",
      "Is configuration compliance monitored continuously or at periodic intervals?",
      "How are configuration changes authorised and tracked?",
    ],
  },
  {
    controlId: "A.8.10",
    groupId: "tech_controls",
    controlName: "Information deletion",
    description:
      "Delete information stored in information systems, devices, or any other storage media when no longer required, in compliance with legal and policy requirements.",
    requirements: [
      "Data retention and deletion policy aligned with legal and business requirements",
      "Automated or scheduled deletion processes for data past retention periods",
      "Evidence that deletion has been performed (deletion logs, audit records)",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "How do you ensure data is deleted when it's no longer needed — and that it's actually gone, not just forgotten?",
    questionContext:
      "A.8.10 is new in 2022 — it addresses the risk of retaining data beyond its useful or legal life.",
    followUpTemplates: [
      "Is data deletion automated based on retention schedules, or is it manual?",
      "How do you verify that data has been irretrievably deleted from all locations (including backups)?",
      "How do you handle deletion obligations when data spans multiple systems or cloud services?",
    ],
  },
  {
    controlId: "A.8.11",
    groupId: "tech_controls",
    controlName: "Data masking",
    description:
      "Use data masking in accordance with the organisation's access control policy and business requirements to limit exposure of sensitive data, including PII.",
    requirements: [
      "Data masking or anonymisation applied in non-production environments",
      "Policy defining which data types require masking and in which contexts",
      "Verification that masked data cannot be reversed without authorisation",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "Do you mask or anonymise sensitive data in non-production environments like dev, test, and analytics?",
    questionContext:
      "A.8.11 is new in 2022 — it addresses the common risk of real data in test environments.",
    followUpTemplates: [
      "Are production databases copied to dev/test environments — and if so is the data masked?",
      "What masking techniques do you use (tokenisation, pseudonymisation, synthetic data)?",
      "How do you ensure masked data is sufficient for testing while preventing re-identification?",
    ],
  },
  {
    controlId: "A.8.12",
    groupId: "tech_controls",
    controlName: "Data leakage prevention",
    description:
      "Apply data leakage prevention measures to systems, networks, and any other devices that process, store, or transmit sensitive information.",
    requirements: [
      "DLP controls monitoring sensitive data flows (email, web, endpoints, cloud storage)",
      "DLP policies aligned with information classification scheme",
      "Incident workflow for DLP alerts including investigation and remediation",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "How do you detect and prevent sensitive data from leaving the organisation through unauthorised channels?",
    questionContext:
      "A.8.12 is new in 2022 — it formalises DLP as a standalone requirement.",
    followUpTemplates: [
      "Where are DLP controls deployed — email, web gateway, endpoints, cloud apps?",
      "How are DLP policies aligned with your information classification scheme?",
      "What happens when a DLP rule is triggered — block, alert, or both?",
    ],
  },
  {
    controlId: "A.8.13",
    groupId: "business_continuity",
    controlName: "Information backup",
    description:
      "Maintain and regularly test backup copies of information, software, and system images in accordance with the agreed backup policy.",
    requirements: [
      "Backup policy defining scope, frequency, retention, and offsite/offline requirements",
      "Automated backup processes with monitoring for failures",
      "Regular restore testing with documented results confirming backup integrity",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "What is your backup strategy, and when did you last successfully restore from a backup to prove it works?",
    questionContext:
      "A.8.13 is your safety net — untested backups are just wishful thinking.",
    followUpTemplates: [
      "Are backups stored offsite or in a separate cloud region from production?",
      "How frequently are restore tests performed, and do they cover full system recovery?",
      "Are backup copies protected from ransomware (immutable storage, air-gapped copies)?",
    ],
  },
  {
    controlId: "A.8.14",
    groupId: "business_continuity",
    controlName: "Redundancy of information processing facilities",
    description:
      "Implement information processing facilities with sufficient redundancy to meet availability requirements.",
    requirements: [
      "High-availability architecture for critical systems (clustering, load balancing, failover)",
      "Redundant infrastructure components (power, networking, storage)",
      "Failover testing with documented results",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "What redundancy do you have for critical information processing systems — can they survive a component failure?",
    questionContext:
      "A.8.14 ensures single points of failure don't bring down critical services.",
    followUpTemplates: [
      "Are critical systems deployed in a high-availability or active-active configuration?",
      "When did you last test failover, and what was the actual recovery time?",
      "Are there single points of failure in your architecture that you've accepted as risks?",
    ],
  },
  {
    controlId: "A.8.15",
    groupId: "tech_controls",
    controlName: "Logging",
    description:
      "Produce, store, protect, and analyse logs that record activities, exceptions, faults, and other relevant events.",
    requirements: [
      "Logging enabled on critical systems capturing authentication, authorisation, and change events",
      "Centralised log management (SIEM or log aggregation) with tamper protection",
      "Log retention aligned with legal, regulatory, and forensic requirements",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "What events do you log, where are logs stored, and how do you protect them from tampering?",
    questionContext:
      "A.8.15 provides the evidentiary foundation for detection, investigation, and compliance.",
    followUpTemplates: [
      "Are logs centralised in a SIEM or log management platform?",
      "How long are logs retained, and does retention meet regulatory requirements?",
      "Are logs protected from modification or deletion, including by administrators?",
    ],
  },
  {
    controlId: "A.8.16",
    groupId: "tech_controls",
    controlName: "Monitoring activities",
    description:
      "Monitor networks, systems, and applications for anomalous behaviour and take appropriate action to evaluate potential information security incidents.",
    requirements: [
      "Security monitoring covering networks, endpoints, and cloud environments",
      "Defined use cases or detection rules for known attack patterns",
      "24/7 monitoring capability (internal SOC or managed service) with defined response times",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "How do you actively monitor for suspicious or anomalous activity across your environment?",
    questionContext:
      "A.8.16 is new in 2022 — it elevates monitoring from a logging sub-task to a first-class control.",
    followUpTemplates: [
      "Do you have a SOC (in-house or outsourced) providing continuous monitoring?",
      "What detection use cases or rules are you running, and how are they tuned?",
      "How quickly are alerts triaged and escalated when they warrant investigation?",
    ],
  },
  {
    controlId: "A.8.17",
    groupId: "tech_controls",
    controlName: "Clock synchronization",
    description:
      "Synchronise clocks of information processing systems to approved time sources to support accurate timestamps in logs and evidence.",
    requirements: [
      "All systems synchronised to an authoritative time source (NTP/PTP)",
      "Monitoring or alerting for clock drift beyond acceptable thresholds",
      "Consistent timezone configuration or UTC normalisation across log sources",
    ],
    reviewFrequencyDays: 365,
    weight: 1.0,
    questionText:
      "Are all your systems synchronised to a common time source, and how do you ensure log timestamps are reliable?",
    questionContext:
      "A.8.17 seems minor but is critical for forensic correlation — mismatched timestamps derail investigations.",
    followUpTemplates: [
      "What NTP sources are your systems configured to use?",
      "Is clock synchronisation monitored, and are drift alerts configured?",
      "Do all log sources use a consistent timezone or UTC normalisation?",
    ],
  },
  {
    controlId: "A.8.18",
    groupId: "tech_controls",
    controlName: "Use of privileged utility programs",
    description:
      "Restrict and tightly control the use of utility programs that can override system and application controls.",
    requirements: [
      "Inventory of privileged utility programs available on systems",
      "Access to privileged utilities restricted to authorised personnel only",
      "Logging and monitoring of privileged utility usage",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "How do you control access to powerful utility programs that could bypass normal system controls?",
    questionContext:
      "A.8.18 prevents misuse of tools like database admin utilities, disk editors, or debugging tools.",
    followUpTemplates: [
      "Are system utility programs restricted to authorised administrators?",
      "Is the use of privileged utilities logged and subject to review?",
      "Are unnecessary utility programs removed from production systems?",
    ],
  },
  {
    controlId: "A.8.19",
    groupId: "tech_controls",
    controlName: "Installation of software on operational systems",
    description:
      "Implement procedures and controls to manage the installation of software on operational systems.",
    requirements: [
      "Policy restricting software installation to authorised and approved applications",
      "Technical controls preventing unauthorised software installation (application whitelisting or admin restrictions)",
      "Process for requesting and approving new software installations",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "How do you control what software gets installed on production and operational systems?",
    questionContext:
      "A.8.19 prevents unauthorised, unlicensed, or malicious software from being installed.",
    followUpTemplates: [
      "Do you use application whitelisting or software restriction policies?",
      "Can end users install software, or is local admin access removed?",
      "How is software approved for use within the organisation?",
    ],
  },
  {
    controlId: "A.8.20",
    groupId: "tech_controls",
    controlName: "Networks security",
    description:
      "Secure and manage networks and network devices to protect information in systems and applications.",
    requirements: [
      "Network security architecture documented with security zones and trust boundaries",
      "Firewalls, IDS/IPS, and network access controls in place at zone boundaries",
      "Network security baselines defined and monitored for compliance",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "How is your network architected from a security perspective — zones, segmentation, perimeter controls?",
    questionContext:
      "A.8.20 is the foundation of network-level defence.",
    followUpTemplates: [
      "Is your network segmented into zones with appropriate controls between them?",
      "Are firewall rules reviewed periodically and stale rules removed?",
      "Do you use intrusion detection or prevention systems (IDS/IPS)?",
    ],
  },
  {
    controlId: "A.8.21",
    groupId: "tech_controls",
    controlName: "Security of network services",
    description:
      "Identify, implement, and monitor security mechanisms, service levels, and management requirements of network services, whether provided internally or outsourced.",
    requirements: [
      "SLAs for network services that include security requirements",
      "Security features of network services identified and enabled (encryption, authentication)",
      "Monitoring of network service performance and security posture",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "How do you ensure the security of network services — whether you run them yourself or outsource them?",
    questionContext:
      "A.8.21 addresses the security of the network services your systems depend on.",
    followUpTemplates: [
      "Are SLAs with network service providers aligned with your security requirements?",
      "How do you verify that network services are configured securely (encryption, access control)?",
      "Are managed network services monitored for security incidents?",
    ],
  },
  {
    controlId: "A.8.22",
    groupId: "tech_controls",
    controlName: "Segregation of networks",
    description:
      "Segregate groups of information services, users, and information systems within the organisation's networks.",
    requirements: [
      "Network segmentation implemented (VLANs, subnets, microsegmentation) between trust zones",
      "Segmentation policy defining which systems and users are in which zones",
      "Testing or validation that segmentation is effective and cannot be trivially bypassed",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "How do you segment your networks so that a compromise in one area doesn't give access to everything?",
    questionContext:
      "A.8.22 limits blast radius by separating different trust levels.",
    followUpTemplates: [
      "Is production traffic separated from development/test and corporate networks?",
      "Do you use microsegmentation or zero-trust principles between workloads?",
      "How do you validate that network segmentation is effective (e.g. penetration testing)?",
    ],
  },
  {
    controlId: "A.8.23",
    groupId: "tech_controls",
    controlName: "Web filtering",
    description:
      "Manage access to external websites to reduce exposure to malicious content.",
    requirements: [
      "Web filtering or proxy controlling access to external websites by category",
      "Blocking of known malicious URLs and domains",
      "Policy defining acceptable web usage categories and exceptions process",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "Do you filter web access to block malicious or inappropriate sites, and how is the policy configured?",
    questionContext:
      "A.8.23 is new in 2022 — it formalises web filtering as a standalone control.",
    followUpTemplates: [
      "Are web filtering categories reviewed and updated regularly?",
      "Is web filtering applied to both on-premises and remote users?",
      "How are exceptions to web filtering handled and approved?",
    ],
  },
  {
    controlId: "A.8.24",
    groupId: "tech_controls",
    controlName: "Use of cryptography",
    description:
      "Define and implement rules for the effective use of cryptography, including cryptographic key management.",
    requirements: [
      "Cryptography policy defining approved algorithms, key lengths, and usage contexts",
      "Key management procedures covering generation, distribution, storage, rotation, and destruction",
      "TLS/encryption enforced for data in transit and at rest for sensitive information",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "What is your approach to cryptography — approved algorithms, key management, and where encryption is required?",
    questionContext:
      "A.8.24 ensures cryptography is used correctly, not just used.",
    followUpTemplates: [
      "Do you have a cryptography policy specifying approved algorithms and minimum key lengths?",
      "How are cryptographic keys managed through their lifecycle (generation, rotation, destruction)?",
      "Is encryption enforced for all sensitive data at rest and in transit?",
    ],
  },
  {
    controlId: "A.8.25",
    groupId: "tech_controls",
    controlName: "Secure development life cycle",
    description:
      "Establish and apply rules for the secure development of software and systems throughout the development lifecycle.",
    requirements: [
      "Secure SDLC methodology documented and integrated into development processes",
      "Security requirements defined at the design phase of development projects",
      "Mandatory security testing (SAST, DAST, dependency scanning) in the CI/CD pipeline",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "How is security integrated into your software development lifecycle — from design through to deployment?",
    questionContext:
      "A.8.25 shifts security left — preventing vulnerabilities is cheaper than fixing them.",
    followUpTemplates: [
      "Are security requirements captured during the design phase of new features?",
      "What automated security testing runs in your CI/CD pipeline (SAST, DAST, SCA)?",
      "Do developers receive secure coding training?",
    ],
  },
  {
    controlId: "A.8.26",
    groupId: "tech_controls",
    controlName: "Application security requirements",
    description:
      "Identify, specify, and approve information security requirements when developing or acquiring applications.",
    requirements: [
      "Security requirements defined for applications (authentication, authorisation, input validation, audit logging)",
      "Requirements validated through design review or threat modelling",
      "Acceptance criteria for application security verified before go-live",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "How do you define and verify security requirements for new applications before they go live?",
    questionContext:
      "A.8.26 ensures security isn't an afterthought in application development.",
    followUpTemplates: [
      "Do you perform threat modelling as part of the requirements or design phase?",
      "Are security acceptance criteria defined and tested before production deployment?",
      "How do you handle security requirements for off-the-shelf or SaaS applications?",
    ],
  },
  {
    controlId: "A.8.27",
    groupId: "tech_controls",
    controlName: "Secure system architecture and engineering principles",
    description:
      "Establish, document, maintain, and apply secure system engineering principles for any information system development activity.",
    requirements: [
      "Documented secure architecture principles (defence-in-depth, least privilege, fail-safe defaults)",
      "Architecture review process that evaluates security of system designs",
      "Reference architectures or patterns for common deployment scenarios",
    ],
    reviewFrequencyDays: 365,
    weight: 1.0,
    questionText:
      "What secure architecture and engineering principles guide how you design and build systems?",
    questionContext:
      "A.8.27 provides the blueprint-level security standards for all system design.",
    followUpTemplates: [
      "Are secure architecture principles documented and accessible to all engineers?",
      "Is there a formal architecture review process that includes security evaluation?",
      "Do you maintain reference architectures for common deployment patterns?",
    ],
  },
  {
    controlId: "A.8.28",
    groupId: "tech_controls",
    controlName: "Secure coding",
    description:
      "Apply secure coding principles to software development to prevent vulnerabilities such as injection, XSS, and buffer overflows.",
    requirements: [
      "Secure coding standards documented and communicated to developers",
      "Code review process that includes security-focused review",
      "Static analysis tools integrated into the development workflow",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "What secure coding practices do your developers follow, and how do you verify code quality from a security perspective?",
    questionContext:
      "A.8.28 is new in 2022 — it makes secure coding a dedicated control rather than a sub-item.",
    followUpTemplates: [
      "Do you have documented secure coding standards (e.g. OWASP guidelines)?",
      "Are code reviews mandatory, and do reviewers check for security issues?",
      "What static analysis tools are integrated into your development workflow?",
    ],
  },
  {
    controlId: "A.8.29",
    groupId: "tech_controls",
    controlName: "Security testing in development and acceptance",
    description:
      "Define and implement security testing processes in the development lifecycle, including acceptance testing before deployment.",
    requirements: [
      "Security testing (SAST, DAST, penetration testing) performed at defined lifecycle stages",
      "Acceptance criteria requiring resolution of critical and high security findings before release",
      "Evidence of security testing results and remediation tracking",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "What security testing do you perform before code reaches production, and what findings would block a release?",
    questionContext:
      "A.8.29 provides the quality gate that stops insecure code from reaching production.",
    followUpTemplates: [
      "Do you perform penetration testing on new features or significant changes?",
      "What severity of security finding blocks a release from going live?",
      "How are security testing findings tracked through to remediation?",
    ],
  },
  {
    controlId: "A.8.30",
    groupId: "tech_controls",
    controlName: "Outsourced development",
    description:
      "Direct, monitor, and review activities related to outsourced system development to ensure security requirements are met.",
    requirements: [
      "Security requirements included in outsourced development contracts",
      "Code review or security testing of externally developed code before acceptance",
      "Oversight process for monitoring outsourced development security practices",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "When development is outsourced, how do you ensure the external team follows your security standards?",
    questionContext:
      "A.8.30 extends your secure development expectations to third-party developers.",
    followUpTemplates: [
      "Are security requirements contractually binding for outsourced developers?",
      "Do you review or test externally developed code before accepting it?",
      "How do you monitor the security practices of outsourced development teams?",
    ],
  },
  {
    controlId: "A.8.31",
    groupId: "tech_controls",
    controlName: "Separation of development, test and production environments",
    description:
      "Separate and secure development, testing, and production environments to reduce the risk of unauthorised access or changes to the production environment.",
    requirements: [
      "Distinct environments for development, testing, and production with separate access controls",
      "Prohibition or strict control of production data in non-production environments",
      "Change promotion process requiring approval before code moves between environments",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "How cleanly are your development, test, and production environments separated?",
    questionContext:
      "A.8.31 prevents developers from accidentally or intentionally impacting production.",
    followUpTemplates: [
      "Can developers access production systems or data directly?",
      "Is production data ever used in dev/test, and if so is it masked?",
      "What approval process governs promoting changes from test to production?",
    ],
  },
  {
    controlId: "A.8.32",
    groupId: "tech_controls",
    controlName: "Change management",
    description:
      "Control changes to information processing facilities and information systems through a formal change management process.",
    requirements: [
      "Change management process with documented request, assessment, approval, and implementation steps",
      "Risk and impact assessment performed for changes to production systems",
      "Rollback plans and post-implementation verification for significant changes",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "Walk me through your change management process for production systems — request, approval, implementation, verification.",
    questionContext:
      "A.8.32 prevents unauthorised or poorly tested changes from causing outages or breaches.",
    followUpTemplates: [
      "Are emergency changes subject to the same rigour, or is there a fast-track process?",
      "Do all production changes require risk assessment and explicit approval?",
      "How do you verify that a change was implemented correctly and didn't break anything?",
    ],
  },
  {
    controlId: "A.8.33",
    groupId: "tech_controls",
    controlName: "Test information",
    description:
      "Protect test information appropriately, selecting it carefully and controlling its use, especially when using production data for testing.",
    requirements: [
      "Policy restricting use of production data in test environments without masking",
      "Data masking or synthetic data generation for test environments",
      "Controls ensuring test data is deleted after testing is complete",
    ],
    reviewFrequencyDays: 180,
    weight: 1.0,
    questionText:
      "How do you handle test data — is real production data used, and if so how is it protected?",
    questionContext:
      "A.8.33 prevents the common mistake of exposing real data through poorly controlled test environments.",
    followUpTemplates: [
      "Is production data ever copied into test environments without masking or anonymisation?",
      "Do you generate synthetic test data for development and testing?",
      "Is test data deleted or securely destroyed after testing is complete?",
    ],
  },
  {
    controlId: "A.8.34",
    groupId: "tech_controls",
    controlName: "Protection of information systems during audit testing",
    description:
      "Plan and agree audit tests and other assurance activities involving assessment of operational systems to minimise disruptions to business processes.",
    requirements: [
      "Audit testing schedule agreed in advance with system owners",
      "Scope and methodology of audit tests reviewed to prevent unintended service impact",
      "Audit access restricted to read-only or controlled environments where possible",
    ],
    reviewFrequencyDays: 365,
    weight: 1.0,
    questionText:
      "How do you ensure that audit testing and security assessments don't accidentally disrupt your production systems?",
    questionContext:
      "A.8.34 protects operations from well-intentioned but disruptive audit activities.",
    followUpTemplates: [
      "Are audit tests scheduled and scoped in advance with system owners?",
      "Do you limit audit tool access to prevent accidental data modification?",
      "How do you handle situations where audit testing reveals a critical vulnerability requiring immediate action?",
    ],
  },
];

// ---------------------------------------------------------------------------
// Combined export — 8 mandatory clauses + 93 Annex A controls = 101 total
// ---------------------------------------------------------------------------

export const ISO27001_CONTROLS: IsoControl[] = [
  ...MANDATORY_CLAUSES,
  ...ANNEX_A5,
  ...ANNEX_A6,
  ...ANNEX_A7,
  ...ANNEX_A8,
];
