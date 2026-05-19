Day 1 tasks:
  Tasks for Claude: 
  Fix Risk View Stage 1 No-button bug (RiskWorkspace.tsx:22)
Fix INDUSTRY_METRICS_V2 leftover label
Fix footer routes (/legal/* → /terms, /privacy, drop /cookies)
Delete /api/v1/auth/dev-confirm + /api/v1/auth/dev-set-password
Re-enable email verification gate in /api/v1/auth/login
Create assessment_questions table + seed migration scaffolding
Replace AssessmentQuestionFlow.tsx (44-line stub) with real question reader
Wire /api/v1/assessment/answer to real Supabase persistence
Generate first-pass 6 questions × 3 starter domains

  Notes from Claude Code 
    Notes for follow-up work (unsolicited but flagging):                                                                  
  - ContactUsModal.tsx:205 uses text-error but the token isn't in tailwind.config.ts (only danger is). I worked around
  this in AssessmentQuestionFlow but Contact modal will need either the token added to Tailwind or the class swapped to 
  text-danger.                                                                                                         
  - The Risk View answer endpoint (/api/v1/risks/answer) is still TBD — I left a // PLACEHOLDER comment in              
  recordAndAdvance so it's discoverable.                                                                  
  - Three-domain seed is NIST CSF 2.0 only (GV/ID/PR). ISO 27001:2022 and APRA aren't seeded yet; the UI shows a clean  
  empty state for those frameworks.

