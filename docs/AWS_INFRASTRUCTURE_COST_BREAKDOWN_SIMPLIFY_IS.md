# AWS Infrastructure Cost Breakdown for Simplify.is

**Document Version:** 1.0
**Last Updated:** 19 May 2026
**Region:** AWS Asia Pacific (Sydney) — `ap-southeast-2`
**Product:** Simplify.is (Compliance & Risk Assessment Platform)
**Hosting Strategy:** AWS-native stack, Australia-region only (Sydney for MVP, Melbourne `ap-southeast-4` as future failover/expansion option)

---

## Executive Summary

This document outlines the projected monthly infrastructure costs for Simplify.is across five distinct growth stages on AWS, hosted exclusively in the Sydney region for data sovereignty and Australian customer latency.

All pricing is in **USD** as billed by AWS (AWS bills in USD globally, with currency conversion applied by the credit card or invoice). Australian regional pricing carries approximately a **25–30% premium** over US East (N. Virginia / Ohio) baseline rates.

### Architecture Stack

| Layer | Service | Replacing |
|---|---|---|
| Database | AWS RDS PostgreSQL (Single-AZ) | Supabase Postgres |
| Application Hosting | AWS ECS Fargate | Vercel / Next.js runtime |
| Authentication | AWS Cognito | Supabase Auth |
| Email | AWS SES | Resend |
| AI/LLM | Direct Anthropic Claude API | Direct Anthropic Claude API (unchanged) |
| Monitoring | AWS CloudWatch | Sentry / structured logs |
| DNS | AWS Route 53 | (existing) |
| Networking | VPC + NAT Gateway | (new) |

### Key Decisions Locked In

- **Region:** Sydney (`ap-southeast-2`) only for MVP
- **Database HA:** Single-AZ with automated daily backups (35-day retention). Cross-region replication NOT enabled.
- **Compute:** Fargate (serverless, no instance management)
- **Claude API:** Direct Anthropic API (not Bedrock — saves ~33% on token costs)
- **PDF Exports:** Deferred — S3 + CloudFront NOT included in MVP
- **Email Provider:** SES (replaces Resend, free tier covers MVP)
- **Auth Provider:** Cognito (replaces Supabase Auth, free tier covers MVP)

---

## Cost Assumptions

### Sydney Regional Premium

Sydney pricing runs approximately 25–30% higher than US East baseline. Indicative rates used in this document:

| Resource | US East | Sydney (estimated) |
|---|---|---|
| RDS db.t3.small (PostgreSQL, single-AZ) | $0.034/hr | $0.045/hr |
| RDS db.t3.medium (PostgreSQL, single-AZ) | $0.068/hr | $0.090/hr |
| Fargate vCPU/hour | $0.0405/hr | $0.0506/hr |
| Fargate GB-memory/hour | $0.00445/hr | $0.00553/hr |
| NAT Gateway hour | $0.045/hr | $0.059/hr |
| NAT Gateway data | $0.045/GB | $0.059/GB |
| Data transfer out (egress) | $0.09/GB | $0.114/GB (first 10 TB) |

*Note: These are working estimates. Always verify against the [AWS Pricing Calculator](https://calculator.aws/) before procurement decisions.*

### Application Workload Assumptions (at 20 active users)

- **Assessment volume:** 9,000–10,000 questions answered per month
- **Form vs. Cypher split:** 70% form-based (minimal Claude tokens), 30% Cypher conversational (token-heavy)
- **Cypher interactions:** ~9,000 per month (15/user/day × 20 users × 30 days)
- **Daily 2 AM batch refresh:** Threat readiness, monthly summaries, dashboard synthesis — runs once per day for all active orgs
- **Additional Claude work:** Milestone generation, win surfacing, dashboard narratives

### Claude API Token Estimate (at 20 active users)

| Workload | Tokens/month |
|---|---|
| Form-based answer scoring (light Claude) | ~3.5M |
| Cypher conversational interactions | ~5.4M |
| Daily 2 AM threat/dashboard refresh | ~18M |
| Milestones, wins, summaries, ancillary | ~2M |
| **Total** | **~29M tokens/month** |

**Pricing applied (Claude 3.5 Sonnet, direct Anthropic API):**
- Input: $3 per 1M tokens
- Output: $15 per 1M tokens
- Assumed 60% input / 40% output split

---

## Stage 1 — Pre-User / Build Phase

**Scenario:** You alone, building and testing the platform. No live customers, no beta testers yet.
**Claude usage:** Effectively zero (occasional smoke tests only).

| Service | Configuration | Monthly Cost (USD) |
|---|---|---|
| RDS PostgreSQL (db.t3.small, Single-AZ) | 2 vCPU, 2 GB RAM | $33.00 |
| RDS Storage (20 GB gp3) | Baseline IOPS | $3.00 |
| RDS Automated Backups | Included up to DB size | $0.00 |
| ECS Fargate (1 task, 0.25 vCPU, 0.5 GB) | ~50% uptime during dev | $5.50 |
| VPC NAT Gateway | 1 NAT × 730 hours | $43.00 |
| NAT Gateway Data Processing | ~2 GB/month | $0.50 |
| Application Load Balancer (ALB) | Always-on | $22.00 |
| Cognito | Free tier (under 50K MAU) | $0.00 |
| SES | Free tier (under 62K emails) | $0.00 |
| CloudWatch (logs, metrics, alarms) | Light usage | $5.00 |
| Route 53 (hosted zone + queries) | 1 zone, low query volume | $1.00 |
| Data Transfer Out | ~5 GB/month | $0.60 |
| Claude API | ~50K tokens (smoke tests) | $0.40 |
| **Stage 1 Total** | | **~$114/month USD** |

**AUD estimate** (at 0.65 USD/AUD): **~$175 AUD/month**

---

## Stage 2 — Build + 3 Beta Testers

**Scenario:** You plus 3 beta testers actively poking at the product. Light real usage, more Claude calls than Stage 1 but still tiny.
**Claude usage:** ~2M tokens/month (testers running through partial assessments and Cypher conversations).

| Service | Configuration | Monthly Cost (USD) |
|---|---|---|
| RDS PostgreSQL (db.t3.small, Single-AZ) | 2 vCPU, 2 GB RAM | $33.00 |
| RDS Storage (20 GB gp3) | | $3.00 |
| ECS Fargate (1 task, 0.25 vCPU, 0.5 GB) | ~70% uptime | $7.50 |
| VPC NAT Gateway | 1 NAT × 730 hours | $43.00 |
| NAT Gateway Data Processing | ~5 GB/month | $1.20 |
| Application Load Balancer | Always-on | $22.00 |
| Cognito | Free tier | $0.00 |
| SES | Free tier | $0.00 |
| CloudWatch | | $7.00 |
| Route 53 | | $1.00 |
| Data Transfer Out | ~15 GB/month | $1.70 |
| Claude API | ~2M tokens (60/40 split) | $15.60 |
| **Stage 2 Total** | | **~$135/month USD** |

**AUD estimate:** **~$208 AUD/month**

---

## Stage 3 — 5 Live Customers

**Scenario:** First 5 paying customers, each completing on average 2 frameworks (~350 questions × 5 users), with ~15 Cypher interactions per user per day.
**Claude usage:** ~7M tokens/month (proportional scaling from 20-user baseline of 29M tokens).

| Service | Configuration | Monthly Cost (USD) |
|---|---|---|
| RDS PostgreSQL (db.t3.small, Single-AZ) | 2 vCPU, 2 GB RAM | $33.00 |
| RDS Storage (20 GB gp3, expanding) | ~5 GB used | $3.00 |
| ECS Fargate (1–2 tasks, 0.25 vCPU, 0.5 GB) | Average 1.3 tasks | $11.00 |
| VPC NAT Gateway | 1 NAT × 730 hours | $43.00 |
| NAT Gateway Data Processing | ~15 GB/month | $3.50 |
| Application Load Balancer | Always-on | $22.00 |
| Cognito | Free tier | $0.00 |
| SES | Free tier (~200 emails) | $0.00 |
| CloudWatch | | $10.00 |
| Route 53 | | $1.00 |
| Data Transfer Out | ~40 GB/month | $4.60 |
| Claude API | ~7M tokens (60/40 split) | $55.00 |
| **Stage 3 Total** | | **~$186/month USD** |

**AUD estimate:** **~$286 AUD/month**

**Per-customer cost:** ~$37 USD/customer/month (~$57 AUD/customer/month). Of this, $11 USD is Claude API, $26 USD is fixed infrastructure split 5 ways.

---

## Stage 4 — 20 Live Customers

**Scenario:** 20 active customers, each completing 2 frameworks on average (~9,000–10,000 questions/month total). Daily 2 AM refresh runs for all. Cypher used heavily.
**Claude usage:** ~29M tokens/month (the baseline scenario we calculated together).

| Service | Configuration | Monthly Cost (USD) |
|---|---|---|
| RDS PostgreSQL (db.t3.small, Single-AZ) | 2 vCPU, 2 GB RAM | $33.00 |
| RDS Storage (50 GB gp3) | Growing dataset | $7.50 |
| ECS Fargate (2 tasks, 0.5 vCPU, 1 GB avg) | 24/7 + peak scaling | $40.00 |
| VPC NAT Gateway | 1 NAT × 730 hours | $43.00 |
| NAT Gateway Data Processing | ~50 GB/month | $11.00 |
| Application Load Balancer | Always-on | $22.00 |
| Cognito | Free tier (20 of 50K MAU) | $0.00 |
| SES | ~1,000 emails, free tier | $0.00 |
| CloudWatch | Logs + alarms grown | $20.00 |
| Route 53 | | $1.00 |
| Data Transfer Out | ~150 GB/month | $17.10 |
| Claude API | ~29M tokens (60/40 split) | **$226.00** |
| **Stage 4 Total** | | **~$420/month USD** |

**AUD estimate:** **~$646 AUD/month**

**Per-customer cost:** ~$21 USD/customer/month (~$32 AUD). Notice infrastructure efficiency: at 20 customers, fixed costs amortise well.

**Claude cost share:** $226 / $420 = **54% of total**. The bigger you get, the more this dominates — which is why direct Anthropic API (vs. Bedrock at +33%) matters.

---

## Stage 5 — 100 Live Customers

**Scenario:** 100 active customers. Compute and database scale up. Claude tokens scale roughly linearly.
**Claude usage:** ~145M tokens/month (5× the 20-user baseline).

| Service | Configuration | Monthly Cost (USD) |
|---|---|---|
| RDS PostgreSQL (db.t3.medium, Single-AZ) | 2 vCPU, 4 GB RAM | $66.00 |
| RDS Storage (200 GB gp3) | Growing dataset | $30.00 |
| RDS Backup Storage (beyond DB size) | ~50 GB | $5.00 |
| ECS Fargate (3–4 tasks, 0.5 vCPU, 1 GB avg) | 24/7 + peak | $90.00 |
| VPC NAT Gateway | 1 NAT × 730 hours | $43.00 |
| NAT Gateway Data Processing | ~250 GB/month | $55.00 |
| Application Load Balancer | Always-on + higher LCU | $30.00 |
| Cognito | Free tier (100 of 50K MAU) | $0.00 |
| SES | ~5,000 emails, free tier | $0.00 |
| CloudWatch | Heavier log volume | $40.00 |
| Route 53 | | $1.00 |
| Data Transfer Out | ~750 GB/month | $85.00 |
| Claude API | ~145M tokens (60/40 split) | **$1,131.00** |
| **Stage 5 Total** | | **~$1,576/month USD** |

**AUD estimate:** **~$2,425 AUD/month**

**Per-customer cost:** ~$16 USD/customer/month (~$24 AUD). Strong unit economics. **Claude is now 72% of cost** — at this point start seriously planning Bedrock vs. Anthropic, prompt optimisation, caching layers, and tier-based throttling.

---

## Summary Comparison Table

| Stage | Scenario | Infra Cost (USD) | Claude Cost (USD) | Total (USD) | Total (AUD est.) | Per-Customer (USD) |
|---|---|---|---|---|---|---|
| 1 | Build only (you) | $114 | $0 | **$114** | ~$175 | n/a |
| 2 | Build + 3 beta testers | $120 | $16 | **$135** | ~$208 | n/a |
| 3 | 5 paying customers | $131 | $55 | **$186** | ~$286 | ~$37 |
| 4 | 20 paying customers | $194 | $226 | **$420** | ~$646 | ~$21 |
| 5 | 100 paying customers | $445 | $1,131 | **$1,576** | ~$2,425 | ~$16 |

---

## Important Caveats and Hidden Costs

### 1. AWS Activate Credits

If you haven't applied yet, **AWS Activate offers $1,000–$100,000 in free credits** for startups (eligibility depends on accelerator/incubator association, funding stage). For Simplify.is, you could reasonably target **$5,000–$10,000** of AWS credits which would cover Stages 1–4 entirely for months. Apply at [aws.amazon.com/activate](https://aws.amazon.com/activate/).

### 2. Anthropic Startup Credits

Anthropic also occasionally offers startup credits via partners. Worth asking. Even modest credits (~$2,500) could offset 5–10 months of Stage 3 Claude spend.

### 3. NAT Gateway Is Expensive

The NAT Gateway is a fixed ~$43/month hit no matter what. It's required if Fargate tasks in private subnets need outbound internet (to call Anthropic API, SES, etc.). Future optimisation: use **VPC endpoints** for AWS services to avoid NAT data charges on internal AWS traffic.

### 4. Data Transfer Out Is the Sneaky Cost

Sydney egress at $0.114/GB adds up at scale. By Stage 5, that's ~$85/month and growing. Mitigations: aggressive client-side caching, CloudFront for static assets (when added), and avoiding unnecessary payload bloat in API responses.

### 5. Reserved Instances / Savings Plans

Once you confirm steady state at Stage 4+, **1-year Reserved Instances for RDS save 25–35%** and **Compute Savings Plans for Fargate save 20–50%**. These are worth $50–150/month at Stage 4–5. Don't commit until your stack is stable for 30–60 days.

### 6. Disaster Recovery Not Included

These figures assume single-AZ RDS with automated backups in the same region. If you later need:
- **Multi-AZ RDS:** ~+50–60% on RDS line
- **Cross-region backups (e.g., Melbourne):** ~+$20–30/month at Stage 4
- **PITR beyond 35 days:** Additional snapshot storage cost

### 7. PDF Exports (Deferred)

If/when PDF export is reintroduced post-MVP, expect:
- S3 storage: ~$0.025/GB/month
- CloudFront (CDN): ~$0.114/GB egress (Sydney rate)
- Lambda or Fargate PDF generation: ~$5–20/month at Stage 4 volume

### 8. Monitoring Beyond CloudWatch

The figures assume CloudWatch only. If you later add **Sentry** (richer error grouping), budget +$29/month at Team tier.

### 9. SSL Certificates

**AWS Certificate Manager (ACM) is free** for certificates used with AWS services (ALB, CloudFront). No line item needed.

---

## Comparison: Current Supabase + Resend Stack vs. AWS

| Component | Current (Supabase + Resend) | AWS (Sydney) Stage 4 |
|---|---|---|
| Database + Auth + Storage | Supabase Pro: ~$25 USD/mo + usage | RDS + Cognito: $33–40 USD/mo |
| Email | Resend: ~$20 USD/mo | SES: $0 (free tier) |
| Hosting (Vercel Pro) | ~$20 USD/mo + usage | Fargate + ALB + NAT: ~$105 USD/mo |
| Claude API | $226 USD/mo | $226 USD/mo (same) |
| Monitoring | Sentry: $29 USD/mo | CloudWatch: $20 USD/mo |
| **Total (at 20 users)** | **~$320 USD/mo** | **~$420 USD/mo** |

**Honest take:** At MVP scale (20 users), AWS is **slightly more expensive** than the current Supabase + Resend + Vercel stack — primarily because of NAT Gateway and ALB fixed costs. The benefit isn't immediate cost savings; it's:

1. **Data sovereignty** — all data in Sydney, owned by you
2. **Consolidated billing** — one AWS account, one bill, one support relationship
3. **Infrastructure as Code via CloudFormation** — fully reproducible environments
4. **Compliance posture** — Australian customers care about AWS-Sydney for procurement
5. **Scaling headroom** — at 100+ users, AWS unit economics start beating PaaS stacks
6. **No vendor lock-in beyond AWS** — full control over your infrastructure

---

## Recommended Next Steps

1. **Apply for AWS Activate credits immediately** — even at low tier, $1,000–$5,000 credits effectively make Stages 1–3 free for 6–12 months.
2. **Run code audit** on existing Simplify.is codebase to map every Supabase / Resend touchpoint that needs migration.
3. **Author CloudFormation template** (Claude Code can generate this) covering: VPC, RDS, Fargate cluster, Cognito user pool, SES domain identity, CloudWatch log groups, IAM roles, ALB.
4. **Build migration scripts** for Supabase → RDS Postgres (pg_dump/restore, RLS policy translation, auth.users → Cognito user pool import).
5. **Stand up dev environment first** — deploy CloudFormation stack to `ap-southeast-2`, run smoke tests, validate auth + database + Claude API calls end-to-end before touching production.
6. **Cut over staging, then production** — DNS swap via Route 53, with rollback plan.

---

## CloudFormation Feasibility (Quick Reference)

Building all the above infrastructure via CloudFormation with Claude Code is **~7/10 difficulty**:

- ✅ Declarative YAML, version-controlled, repeatable
- ✅ One command to deploy or tear down entire stack
- ✅ Claude Code can generate the full template in one pass
- ⚠️ IAM trust relationships and VPC security group dependencies have quirks
- ⚠️ Errors in CloudFormation events require some AWS knowledge to interpret
- ⚠️ First deployment will need iteration; subsequent deploys are clean

**Verdict:** Highly doable with Claude Code as co-pilot. Plan for 2–3 days of iteration to get the stack stable, then it's reusable forever.

---

## Document Status

This document represents the **planning baseline** as of 19 May 2026. All figures are estimates derived from publicly available AWS pricing and the workload assumptions documented above. Actual costs will vary based on real usage patterns, optimisations applied, and AWS pricing changes.

**Next document to author:** `AWS_MIGRATION_AUDIT_AND_PLAN.md` — produced after running a full audit of the current Supabase/Resend integrations in the codebase.

---

END OF DOCUMENT
