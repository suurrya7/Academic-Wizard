# Comprehensive Technical SEO & Search Quality Audit Plan (Phase 0)

**Target Property:** `https://academicwizard.online`  
**Lead Auditor:** Principal Technical SEO Consultant & Search Quality Analyst  
**Date of Execution:** October 17, 2026  
**Status:** In Progress — Phase 0 Planning Approved  

---

## 1. Audit Inputs & Baseline Parameters

* **Website Domain:** `https://academicwizard.online`
* **Target Geographies & Language:** International (United Kingdom, United States, Australia, Canada, India, Singapore, Ireland, Germany) / Language: English (`en`)
* **Business Model & Conversion Goals:** 
  * Business Model: Academic writing assistance, dissertation consulting, research paper advisory, editing/proofreading, citation generation, and student productivity tools.
  * Primary Conversion Goal: High-intent student leads via WhatsApp chat (`wa.me/919509893638`) and direct quote/inquiry forms.
* **CMS & Technology Stack:**
  * Client: React 18 SPA bundled via Vite 5 (`react-router-dom`, `react-helmet-async`, `framer-motion`, `lucide-react`).
  * Hybrid Rendering Engine: Static Site Generation (SSG) pipeline generating pre-rendered static HTML (`scripts/generate-blog-pages.mjs` and Vite pre-render scripts).
  * Hosting & CDN: GitHub Pages with custom domain DNS and HTTPS enforcement.
* **Target Keyword Clusters:**
  1. Core Commercial Hubs: *assignment help, dissertation help, essay writing help, research paper help, literature review help, editing and proofreading services*.
  2. Geo-Targeted Commercial Hubs: *assignment help UK, dissertation help Australia, nursing assignment help UK, law dissertation help, MBA assignment writing*.
  3. Informational & Utility: *APA 7 citation generator, AI detector for students, AI humanizer, academic grammar checker, academic writing guides*.
* **Identified Organic Competitors:**
  * Commercial: *MyAssignmentHelp, IvyPanda, PaperHelp, EssayPro, TotalAssignmentHelp*.
  * Informational & Utility: *Scribbr, QuillBot, CitationMachine, ZeroGPT*.
* **Local Source Code:** Available at `/Users/surya/Desktop/Academic Wizard Latest.`  
  *(CRITICAL SECURITY RULE: `src/components/ActivationGate.jsx` is strictly isolated and will NOT be accessed or read).*
* **Live Integration & Performance Data Sources:**
  * Google Search Console Live API (`gsc` / `gsc-ro` MCP).
  * Chrome DevTools & Lighthouse MCP (`chrome-devtools-mcp`).
  * Live HTTP Web Fetching (`read_url_content`, Python `requests`).
  * Real-time Google Search Index & SERP scraping (`search_web`).

---

## 2. Phase-by-Phase Execution Plan

### Phase 0: Planning & Self-Critique
* **Sub-tasks:**
  0.1 Define project boundaries, constraints, and audit input parameters.
  0.2 Formulate detailed sub-tasks, methods, tools, and output targets for Phases 1–10.
  0.3 Conduct an adversarial self-critique identifying at least 5 potential failure modes or omissions.
  0.4 Formulate specific remediations for identified risks.
* **Tools / Methods:** Antigravity execution planning, markdown authoring.
* **Output File:** `/seo-audit/00_plan.md`
* **Risks & Limitations:** Scope creep due to programmatic page count (~1,285 indexable URLs).
* **Checkpoint:** Self-critique completed and verified before starting Phase 1.

### Phase 1: Discovery & URL Inventory
* **Sub-tasks:**
  1.1 Fetch and audit `/robots.txt` for disallow rules, crawl delays, and sitemap directives.
  1.2 Parse live XML sitemaps (`/sitemap.xml`) and extract all declared URLs, `<lastmod>`, and priority.
  1.3 Crawl website using a specialized Python script (`requests` / `BeautifulSoup`) tracking internal links, depth, status codes, and redirect chains.
  1.4 Inspect local source code routing (`src/App.jsx`, `src/data/services.js`, `public/data/posts.json`) to enumerate every declared route.
  1.5 Compile `02_url_inventory.csv` recording: URL, discovery source, status code, final URL, redirect hops, Content-Type, latency, meta robots, canonical URL, indexability status, depth, inbound link count, in-sitemap flag, orphan flag, page type.
  1.6 Reconcile inventory counts: Sitemap vs. Crawl vs. Indexable vs. Orphan vs. Non-200.
* **Tools / Methods:** Python crawl script, `curl -I`, `read_url_content`, local JSON/JS parsing.
* **Output File:** `/seo-audit/02_url_inventory.csv`
* **Risks & Limitations:** Single-Page Application client-side routing masking orphan routes; rate-limiting by host.
* **Gate Check 1:** 100% URL discovery reconciliation with written metrics.

### Phase 2: Technical SEO Audit (Every Discovered URL)
* **Sub-tasks:**
  2.1 Crawlability & Indexability: Check HTTP status codes, detect redirect chains, test canonical validity (self-referential, trailing slash consistency, absolute URL).
  2.2 Rendering Parity Analysis: Compare raw pre-rendered HTML against rendered DOM using Chrome DevTools/Lighthouse MCP to detect JS-dependent text, links, or metadata.
  2.3 Structured Data Extraction & Validation: Extract all JSON-LD blocks (`Product`, `BreadcrumbList`, `Article`, `SoftwareApplication`, `EducationalOrganization`, `FAQPage`) and check against Google Search Central technical documentation.
  2.4 Internationalization & Hreflang: Validate bidirectional hreflang tags across country variants (`uk`, `usa`, `australia`, `canada`, `india`, `singapore`, `ireland`, `germany`) and verify `x-default`.
  2.5 Mobile & Performance: Execute Lighthouse audits via Chrome DevTools MCP on representative page templates; check Core Web Vitals indicators (LCP, CLS, INP, TTFB).
  2.6 Security & Protocol Integrity: Check HTTPS enforcement, mixed-content occurrences, HSTS headers, CSP, and X-Content-Type-Options.
  2.7 Internal Linking Topology: Calculate click depth, identify orphaned pages, measure inbound internal links, and analyze anchor text distribution.
* **Tools / Methods:** Python audit scripts, Chrome DevTools MCP, Google Rich Results criteria, `read_url_content`.
* **Output File:** `/seo-audit/03_technical_findings.csv`
* **Risks & Limitations:** Headless browser overhead; Lighthouse timeouts on low-latency connections.
* **Gate Check 2:** Complete technical findings log with zero unclassified URLs.

### Phase 3: On-Page & Content Quality Audit (Every URL)
* **Sub-tasks:**
  3.1 Meta Tag Analysis: Check Title tag length (character & pixel bounds), unique branding, hook urgency, and Primary Keyword placement. Check Meta Descriptions for CTA and character bounds (120–155 chars).
  3.2 Heading Hierarchy: Check single H1 rule, H2/H3 logical nestings, and keyword congruence.
  3.3 Content Depth & Word Count: Measure body text word count, evaluate boilerplate vs. unique content ratio, and flag thin pages (<300 unique words).
  3.4 E-E-A-T & Trust Auditing: Inspect author attribution, academic credentials, academic framework citations (IRAC, Bloom's, Gibbs), refund/revision policy links, and verifiable student reviews.
  3.5 Search Intent Alignment: Classify intent (Commercial, Informational, Navigational, Transactional) and flag mismatched content formats.
  3.6 Per-Page Card Generation: Generate individualized markdown cards for all discovered page URLs in `/seo-audit/per_page_cards/`.
* **Tools / Methods:** Python text-parsing scripts, BeautifulSoup, GSC Search Analytics.
* **Output File:** `/seo-audit/04_onpage_findings.csv`, `/seo-audit/per_page_cards/*.md`
* **Risks & Limitations:** Large volume of programmatic pages requiring batched script execution.
* **Gate Check 3:** 100% coverage of page cards and on-page scoring matrix.

### Phase 4: Duplicate Content & Cannibalization
* **Sub-tasks:**
  4.1 Exact Duplication: MD5/SHA256 content hashing of normalized body text to find identical pages.
  4.2 Near-Duplicate Clustering: Compute Jaccard/SimHash similarity across programmatic city and subject pages to flag pages exceeding 80% content similarity.
  4.3 Keyword Cannibalization: Cross-reference live GSC query rankings to identify multiple internal URLs competing for the same search term.
  4.4 URL Variant Analysis: Audit trailing slash vs. non-trailing slash, protocol variants, and casing issues.
  4.5 Resolution Action Mapping: Assign exact remedial actions (`merge`, `301-redirect`, `canonicalize`, `noindex-follow`, `differentiate`) with specified keeper URLs.
* **Tools / Methods:** Python similarity algorithms, GSC MCP `advanced_search_analytics`.
* **Output File:** `/seo-audit/05_duplicates_cannibalization.csv`
* **Risks & Limitations:** False positives on programmatic templates sharing site-wide UI wrappers.
* **Gate Check 4:** Deduplication matrix signed off with explicit consolidation targets.

### Phase 5: Keyword Research & Page Mapping
* **Sub-tasks:**
  5.1 Extract live queries from GSC (historical impressions, clicks, CTR, and average positions).
  5.2 Expand keyword clusters using live Google Autocomplete, People Also Ask, and SERP scraping via `search_web`.
  5.3 Categorize keywords by Search Intent, Buyer Funnel Stage (TOFU, MOFU, BOFU), and Topic Cluster.
  5.4 Formulate 1-to-1 Keyword-to-Page Mapping (one primary keyword + supporting LSI secondary terms per page).
  5.5 Identify Content Gaps: Unranked high-intent keywords where competitors win and Academic Wizard lacks dedicated URLs.
  5.6 Identify "Quick Win" Opportunities: Queries ranking positions 4–20 with >100 impressions and sub-2% CTR.
* **Tools / Methods:** GSC API (`advanced_search_analytics`, `quick_wins`, `content_gaps`), live SERP scraping.
* **Output File:** `/seo-audit/06_keyword_research_and_map.csv`
* **Risks & Limitations:** Third-party exact search volume tools require paid API subscriptions; non-GSC volumes will be verified via relative SERP competition or labeled "NOT VERIFIED".
* **Gate Check 5:** Complete keyword-to-page map with zero unmapped commercial pages.

### Phase 6: Competitor Analysis & SERP Benchmarking
* **Sub-tasks:**
  6.1 Extract top-ranking organic competitors across commercial keyword clusters (*assignment help, dissertation help, literature review writing*).
  6.2 Compare page architecture, word counts, content formats (calculators, sample papers, video), and pricing transparency against top 3 competitors (*MyAssignmentHelp, Scribbr, IvyPanda*).
  6.3 Compare schema implementation, review signals, and E-E-A-T badges.
  6.4 Evaluate competitor backlink acquisition hooks (free tools, citation makers, academic resources).
  6.5 Compile comprehensive Gap Matrix detailing structural advantages held by market leaders.
* **Tools / Methods:** Live search queries, HTTP fetching of competitor pages, schema extraction.
* **Output File:** `/seo-audit/07_competitor_analysis.md`
* **Risks & Limitations:** Third-party backlink tools (Ahrefs/Semrush) not natively connected; off-page authority metrics must be marked NOT VERIFIED unless observable on live sites.
* **Gate Check 6:** Competitor matrix established with evidence-backed gap definitions.

### Phase 7: Google Guideline Compliance Check
* **Sub-tasks:**
  7.1 Fetch and verify current Google documentation from `developers.google.com/search`.
  7.2 Check compliance with **Google Search Essentials**:
      * Technical crawlability requirements.
      * Spam Policies: Scaled content abuse, doorway pages, cloaking, sneaky redirects.
      * Helpful Content System (People-First Content vs. Search-Engine-First programmatic pages).
  7.3 Check compliance with **Structured Data Policies**: Self-serving review guidelines, Product schema pricing/offer requirements.
  7.4 Check compliance with **AI Content Guidelines**: Disclosure, human editorial oversight, transparency.
  7.5 Categorize every check as `Pass`, `At Risk`, `Violation`, or `NOT VERIFIED`, citing official Google URLs.
* **Tools / Methods:** `read_url_content` fetching official Google documentation, regex codebase inspection.
* **Output File:** `/seo-audit/08_google_compliance_check.md`
* **Risks & Limitations:** Algorithmic systems (e.g. Helpful Content Classifier) operate as machine-learned aggregate classifiers rather than discrete boolean checks.
* **Gate Check 7:** Complete policy compliance matrix with verbatim official Google citations.

### Phase 8: Cross-Validation & Quality Assurance
* **Sub-tasks:**
  8.1 Two-Method Rule: Every Critical (P0) or High (P1) finding confirmed via two independent methods (e.g., raw HTML curl + DOM rendering; header check + browser check).
  8.2 Re-Fetch Verification: Randomly sample 10% of URLs (minimum 20 URLs) to verify stored data fidelity.
  8.3 Count Reconciliation: Ensure numbers in CSV inventories match counts in narrative reports exactly.
  8.4 Contradiction Scan: Ensure no conflicting recommendations exist (e.g. recommending both noindex and canonical consolidation on the same target).
  8.5 Red-Team Senior Auditor Pass: Conduct skeptical review challenging all assumptions, downgrading unsupported claims, and removing false positives.
* **Tools / Methods:** Automated Python consistency verification script, manual auditor review.
* **Output File:** `/seo-audit/09_cross_validation_log.md`
* **Risks & Limitations:** Human fatigue; mitigated by automated cross-check scripts.
* **Gate Check 8:** Zero unresolved contradictions and verified data integrity across all deliverables.

### Phase 9: Prioritization & Implementation Roadmap
* **Sub-tasks:**
  9.1 Score each finding by Impact (1–5), Confidence (1–5), and Effort (1–5).
  9.2 Calculate Priority Score: $\text{Priority} = \frac{\text{Impact} \times \text{Confidence}}{\text{Effort}}$.
  9.3 Bucket findings into actionable sprint horizons:
      * **P0: Immediate Critical Fixes (Week 1 / 0–7 days)**
      * **P1: High Impact (Month 1 / 8–30 days)**
      * **P2: Medium Impact (Month 2 / 31–60 days)**
      * **P3: Low Impact / Maintenance (Month 3+ / 61–90 days)**
  9.4 Assign task owner type (Engineering / Content / SEO Analyst) and expected ranking potential.
* **Tools / Methods:** Quantitative prioritization model in Python.
* **Output File:** `/seo-audit/10_prioritized_roadmap.csv`
* **Risks & Limitations:** Engineering constraints on GitHub Pages static deployment.
* **Gate Check 9:** Fully sequenced implementation matrix ready for stakeholder execution.

### Phase 10: Final Executive & Technical Report Delivery
* **Sub-tasks:**
  10.1 Synthesize all findings into the master audit document `FINAL_SEO_AUDIT_REPORT.md`.
  10.2 Calculate overall SEO Health Score based on a transparent, weighted formula:
       $$\text{Health Score} = 100 - \sum (\text{Critical} \times 15 + \text{High} \times 8 + \text{Medium} \times 3 + \text{Low} \times 1)$$
  10.3 Produce a standalone, beautifully styled HTML executive report `FINAL_SEO_AUDIT_REPORT.html`.
  10.4 Include verbatim copy-paste code snippets for all recommended fixes.
* **Tools / Methods:** Markdown compiler, HTML styling templates.
* **Output File:** `/seo-audit/FINAL_SEO_AUDIT_REPORT.md` & `/seo-audit/FINAL_SEO_AUDIT_REPORT.html`
* **Risks & Limitations:** Information overload for non-technical stakeholders; mitigated by clear Executive Summary tables.
* **Gate Check 10:** Comprehensive, peer-reviewed, client-ready technical deliverable.

---

## 3. Adversarial Self-Critique (5 Critical Things We Might Be Forgetting)

To ensure maximum rigor, the audit plan was subjected to adversarial critique. Below are 5 critical blind spots identified and integrated into the execution steps:

1. **GitHub Pages Static Server-Side Redirect Blind Spot:**
   * *Omission Risk:* Assuming `.htaccess` 301 redirects work on GitHub Pages. GitHub Pages ignores Apache configurations entirely.
   * *Remediation Added to Phase 1 & 2:* Specifically inspect `404.html` client-side session routing, JS `replaceState` redirections, and static pre-rendered directory structures (`/service/index.html`) to verify how bots receive non-trailing-slash requests without server 301s.

2. **Programmatic Template "Near-Duplicate" Masking:**
   * *Omission Risk:* Auditing only one subject page (e.g. Nursing) and assuming all other 17 subject pages behave identically across 8 countries.
   * *Remediation Added to Phase 3 & 4:* Programmatic content comparison script will calculate unique text percentages across *all* programmatic subjects and cities, testing whether Google perceives them as "doorway pages" under the Spam Policies.

3. **Client-Side vs. Pre-Rendered Meta Tag Discrepancies:**
   * *Omission Risk:* Auditing only what `react-helmet-async` generates in a headless browser, ignoring what raw Googlebot crawls in the initial HTTP response before executing JavaScript.
   * *Remediation Added to Phase 2.2:* Compare raw curl output against Chrome DevTools DOM dump for critical tags (`<link rel="canonical">`, `<meta name="robots">`, `<title>`, and JSON-LD).

4. **YMYL / Academic Integrity Policy Scrutiny:**
   * *Omission Risk:* Treating Academic Wizard like a generic SaaS or e-commerce store, overlooking Google's aggressive quality rater guidelines regarding "contract cheating" vs. ethical tutoring/guidance.
   * *Remediation Added to Phase 7:* Specifically evaluate ethical disclaimers, academic integrity policy statements, and terms of service to safeguard against search quality manual actions or algorithmic devaluation.

5. **Disavow & Phantom Impression Pruning:**
   * *Omission Risk:* Confusing a Google Helpful Content or Spam algorithmic pruning with a technical crawl blockage.
   * *Remediation Added to Phase 5 & 7:* Correlate historical GSC performance drops (e.g. the late September cliff) against Google core and spam algorithm update dates to pinpoint the exact algorithmic mechanism.

---

## 4. Capability Baseline & Tool Protocol

Before running discovery, Phase 0 mandates verifying tool execution capabilities and documenting them in `01_capability_check.md`.

*Execution of Phase 1 will commence immediately upon saving this plan and logging capability checks.*
