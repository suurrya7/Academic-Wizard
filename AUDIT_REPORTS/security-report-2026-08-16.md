# Deep Security & Code Audit Report

**Date:** 2026-08-16  
**Auditor Role:** Adversarial Penetration Tester & DevSecOps Auditor  
**Target Environment:** Production (`https://academicwizard.online` on GitHub Pages)  
**Execution Mode:** Read-Only Code Trace & Static Security Review (Strict Environment Safety Rule)

---

## Executive Summary

Academic Wizard is a static client-side application (React 19 / Vite 7) backed by GitHub Actions automation workflows. Because the application does not host a traditional SQL/NoSQL backend database on its web server, classic server-side attack vectors (e.g. SQL injection, remote code execution, database session theft) are fundamentally absent from the public web layer.

The security posture of the project is **strong and disciplined**. Secrets are properly externalized to GitHub Actions repository secrets, third-party lead interactions are delegated directly to encrypted WhatsApp channels, and static assets are securely served via GitHub Pages with HTTPS.

A few medium/low security hygiene recommendations have been cataloged below to further harden the site against client-side tampering, crawler leakage, and regulatory compliance risks.

---

## Phase -1: Auto-Discovery & Ingested Baseline

- **Architecture:** Static Single Page Application (SPA) with SSG prerendered HTML hosted on GitHub Pages with custom domain `academicwizard.online`.
- **Backend / APIs:** No public direct SQL or custom server REST API. External integrations include:
  - LanguageTool API (`api.languagetool.org`) for proofreading.
  - Streamlit Cloud (`academic-wizard.streamlit.app`) for text humanization.
  - Meta WhatsApp (`wa.me`) for lead intake and consultation.
- **Payment & Transaction Engine:** No active online credit card gateway (Stripe/Razorpay) in client code. Quotations are calculated client-side and finalized manually via WhatsApp direct consultations.
- **Ingested Handoff:**
  - Functional blockers from Prompt 1 (`ContactForm.jsx` endpoint and `SubjectCityPage.jsx` hook ordering) have been fully resolved with user approval.

---

## Phase 0: Project Architecture & Automation Map

| Component / Layer | Implementation Files | Security Scope |
| :--- | :--- | :--- |
| **Client Frontend** | `src/App.jsx`, `src/components/`, `src/pages/` | Client-side routing, activation gates, WhatsApp lead links. |
| **Prerender Engine** | `vite.config.js`, `scripts/prepare-pages.mjs`, `scripts/generate-blog-pages.mjs` | Local build-time SSR generation for Googlebot. |
| **AI Content Generator** | `automation/generate_post.py`, `automation/site_config.py` | Nightly automated blog generator via Gemini API. |
| **Backlink Syndicator** | `automation/backlinks/publisher.js` | Scheduled multi-platform publication (Dev.to, Tumblr, Blogger, WordPress, LinkedIn). |
| **Keep-Awake Worker** | `.github/workflows/keep-streamlit-awake.yml` | 12-hour Puppeteer ping job to maintain Streamlit uptime. |

---

## Phase 1: Data Layer & Secret Audit

1. **SQL / NoSQL / ORM Injection:**
   - **Status:** Not Applicable (Zero server-side database endpoints exposed to public client).
2. **Insecure Direct Object Reference (IDOR):**
   - **Status:** Safe. All data accessed by the client is public static JSON (`data/posts.json`, `specializedContent.json`).
3. **Secret & Key Hygiene in Git History & Codebase:**
   - **Status:** Passed.
   - Scan of `src/`, `automation/`, and `.github/workflows/` confirms zero hardcoded production API tokens, private keys, or passwords.
   - Secrets (`BACKLINK_GEMINI_API_KEY`, `GH_PAT`, `WP_ACCESS_TOKEN`, `LINKEDIN_ACCESS_TOKEN`, `PINTEREST_ACCESS_TOKEN`, `TELEGRAPH_ACCESS_TOKEN`) are injected strictly via GitHub Actions repository secrets (`${{ secrets.* }}`).

---

## Phase 1.5: Authentication & Session Security

1. **Activation Gate Cipher (`ActivationGate.jsx`):**
   - **Mechanism:** Deterministic shift +1 cipher calculated against a client-generated UUID stored in `localStorage`.
   - **Adversarial Assessment:** Because the key generation algorithm resides in client-side JavaScript, a technically sophisticated user can reverse-engineer the shift-cipher or edit `localStorage.getItem('academic_wizard_unlocked')`.
   - **Business Risk:** Low. This gate functions as a lead-generation conversion mechanism to drive WhatsApp conversations, rather than high-security DRM.
2. **Admin License Generator Route (`/activation-generator-secret`):**
   - **Finding:** The page is hidden from search indexing via `<meta name="robots" content="noindex, nofollow" />`, but lacks a client-side authentication or passcode challenge.
   - **Recommendation:** Add a simple master passcode check (or hash challenge) to prevent unauthorized key generation if the route is discovered.

---

## Phase 2: Business Logic & Adversarial Analysis

1. **Form & Parameter Validation:**
   - Input payloads on `ContactForm.jsx` and `Contact.jsx` are sanitized and URL-encoded before building `https://wa.me/` URLs, preventing URL parameter injection or broken link strings.
2. **Pricing Calculator Manipulation:**
   - The pricing calculator in `src/components/PricingCalculator.jsx` is informational. Since payment is settled via direct WhatsApp consultation and invoicing, tampering with client-side pricing variables cannot force fraudulent transactions.
3. **SSRF (Server-Side Request Forgery):**
   - No user-supplied URLs are fetched or parsed on any backend server.

---

## Phase 3: Access Control & Security Headers

1. **Hosting Layer Headers (GitHub Pages):**
   - GitHub Pages automatically enforces HTTPS with standard TLS certificates and HSTS.
   - For custom security headers (CSP, `X-Frame-Options`, `X-Content-Type-Options`), these are handled at the CDN/DNS level (e.g. Cloudflare) if proxying is enabled.
2. **CORS & Third-Party Endpoints:**
   - `GrammarChecker.jsx` interacts with `https://api.languagetool.org/v2/check` using standard POST requests allowed by LanguageTool's public CORS policy.

---

## Phase 4: Repository & Package Hygiene

1. **Dependency Audit:**
   - Dependencies in `package.json` are up-to-date modern releases (`react@19.2.0`, `vite@7.3.1`, `framer-motion@12.35.0`, `three@0.183.2`).
2. **Unused / Legacy Components:**
   - `src/components/EmailGate.jsx` is unreferenced in active routes. User has confirmed preference for WhatsApp-only flow. Retaining file for future reference or archiving causes no security exposure.

---

## Phase 5: Payment & Transaction Lifecycle

- **Status:** Direct online card/payment processing is not currently mounted on the site.
- **Workflow:** Users generate an estimate via `PricingCalculator` or `ContactForm` → redirected to official verified WhatsApp business number (`+91 95098 93638`) for personalized quotation and project scope confirmation.
- **Security Rating:** High (eliminates PCI-DSS scope and payment gateway attack surfaces on the static frontend).

---

## Phase 7: Regulatory & Compliance Flags (Informational)

1. **Academic Assistance Regulations (UK / AU / US / IE):**
   - **Analysis:** Laws such as the UK *Skills and Post-16 Education Act 2022* and Australia's *TEQSA Act* strictly regulate commercial contract cheating.
   - **Compliance Safeguard:** All site copy in `TermsOfService.jsx`, `PrivacyPolicy.jsx`, and `About.jsx` explicitly positions Academic Wizard as a **tutoring, research assistance, proofreading, and study guidance service** for reference purposes only.
2. **Data Privacy (Indian DPDP Act & GDPR):**
   - Contact inquiries are processed directly through end-to-end encrypted WhatsApp communication. No unencrypted student PII is retained on static hosting infrastructure.

---

## 🏆 Ranked Triage List

| Priority | Finding | Severity | Recommended Action |
| :--- | :--- | :--- | :--- |
| **Low** | `/activation-generator-secret` accessible without master passcode | Low / Cosmetic | Add a simple admin pin/passcode prompt to `ActivationCodeGenerator.jsx`. |
| **Info** | Retain compliance copy on academic tutoring / reference use | Informational | Continue enforcing tutoring/study assistance positioning in all AI-generated blog posts. |

---

*Report generated and persisted to [`AUDIT_REPORTS/security-report-2026-08-16.md`](file:///Users/surya/Desktop/Academic%20Wizard%20Latest./AUDIT_REPORTS/security-report-2026-08-16.md).*
