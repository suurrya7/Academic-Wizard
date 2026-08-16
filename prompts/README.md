# Audit & QA Protocols

This directory contains standardized audit prompts for QA and security readiness in Google Antigravity.

## Protocols

1. [`1-functionality-testing-prompt.md`](./1-functionality-testing-prompt.md)
   - **Focus:** Complete functional verification, UI/route inventory, input edge-case handling, cross-environment compatibility, and observability/rollback readiness.
   - **Execution Sequence:** Run **FIRST**.
   - **Persistent Output:** `AUDIT_REPORTS/functionality-report-<YYYY-MM-DD>.md`

2. [`2-security-audit-prompt.md`](./2-security-audit-prompt.md)
   - **Focus:** Adversarial security audit, data layer (SQL/NoSQL/ORM injection, IDOR), session & auth security, business logic & race conditions, SSRF, backend access control, repo hygiene & secret detection, payments/transactions, and launch compliance flags.
   - **Execution Sequence:** Run **SECOND** (consumes the "Handoff to Security Audit" from Prompt 1).
   - **Persistent Output:** `AUDIT_REPORTS/security-report-<YYYY-MM-DD>.md`

## Safety Protocol
Both prompts strictly adhere to the **Environment Safety Rule**:
- READ & REPORT permissions by default.
- Never test against live/production endpoints without explicit confirmation.
- Zero silent destructive edits.
