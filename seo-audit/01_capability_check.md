# Tool Capability & Environment Baseline Verification (Phase 0)

**Target Property:** `https://academicwizard.online`  
**Execution Timestamp:** 2026-10-17T16:29:22+05:30  
**Status:** Verified & Operational  

---

## 1. Capability Matrix

| Capability / Tool | Test Executed | Verified Status | Result & Notes |
| :--- | :--- | :--- | :--- |
| **Python 3.13 Runtime** | `python3 -c "import sys, requests, bs4"` | **VERIFIED OPERATIONAL** | Python 3.13.2 with `requests` & `beautifulsoup4` ready for crawler and inventory scripts. |
| **Live HTTP Fetching** | `requests.get('https://academicwizard.online/robots.txt')` | **VERIFIED OPERATIONAL** | HTTP 200 OK, 941 bytes received directly from GitHub Pages CDN. |
| **Google Search Console API** | `gsc:site_snapshot` (28 days) | **VERIFIED OPERATIONAL** | Direct live API access. 28-day data: 48 clicks, 1,322 impressions, 3.63% CTR, avg position 15.6. |
| **Chrome DevTools Headless Browser** | `chrome-devtools-mcp:new_page` | **VERIFIED OPERATIONAL** | Tab ID 2 opened `https://academicwizard.online/` and selected successfully. |
| **Rendered DOM Evaluation** | `chrome-devtools-mcp:evaluate_script` | **VERIFIED OPERATIONAL** | Extracted rendered `<title>`, `<link rel="canonical">`, and `<h1>` from live DOM. |
| **Lighthouse Engine** | `chrome-devtools-mcp:lighthouse_audit` | **VERIFIED OPERATIONAL** | Executed desktop snapshot on live homepage: Best Practices 100, Accessibility 83, SEO 83. |
| **SERP & Competitive Intelligence** | `search_web` & `read_url_content` | **VERIFIED OPERATIONAL** | Live web search and URL content fetching operational. |
| **Source Code Inspection** | Local filesystem access via Antigravity tools | **VERIFIED OPERATIONAL** | Full workspace access. *Strict constraint enforced: `src/components/ActivationGate.jsx` isolated and untouched.* |
| **Third-Party Backlink Databases (Ahrefs/Semrush API)** | Direct API queries | **NOT CONNECTED / NOT VERIFIED** | No active API tokens for Semrush/Ahrefs backlink indexes. Off-page backlink metrics will be labeled NOT VERIFIED unless observable via live SERPs or public profiles. |
| **Third-Party Exact Search Volume Database** | Keyword Planner API | **NOT CONNECTED / NOT VERIFIED** | Google Keyword Planner paid API is not directly connected. Search volumes will rely on real Google Search Console query impressions and relative SERP signals, with third-party estimates marked NOT VERIFIED. |

---

## 2. Operating Adaptation Protocol

1. **Rendering Parity Testing:** Because Chrome DevTools MCP is fully operational, we will run automated rendering parity checks comparing the raw pre-rendered HTML response against the client-side hydrated DOM.
2. **Search Performance Ground Truth:** Google Search Console live data (`gsc` MCP) will serve as the sole ground truth for impressions, clicks, CTR, and search queries. Zero invented metrics.
3. **Core Web Vitals & Auditing:** Real Lighthouse snapshots from Chrome DevTools MCP will be used for performance, accessibility, best practices, and technical SEO evaluations.
