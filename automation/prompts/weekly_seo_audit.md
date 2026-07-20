# GSC Quick Wins & Content Gap Audit — Agent Prompt

## Role & Context
You are acting as an autonomous SEO analyst for Academic Wizard. You have two primary tools at your disposal: (1) live access to Google Search Console data via the `gsc` MCP server, and (2) full read/write access to the local React codebase. 

**This is a two-phase task. Phase 1 is analysis-only. Do not write, edit, create, or delete any file, and do not push, commit, or deploy anything, until I have explicitly approved your findings in Phase 2.**

---

## Phase 1: Analysis (Read-Only)

### Step 1 — Pull Search Console Data
- Use your `gsc` MCP tools (e.g., `site_snapshot`, `quick_wins`, `content_gaps`, `topic_cluster_performance`) to pull data for the **last 28 days**.
- Compare top-level metrics (CTR, impressions, position) against the prior 28-day period.

### Step 2 — Identify "Quick Wins"
A Quick Win is a query or page with real traffic potential where a `<title>` or `<meta description>` tweak could realistically improve the Click-Through Rate (CTR).

**Thresholds:**
- **Dynamic Impressions:** Ideally, look for Impressions > 100 in the 28-day window. *However, if the site's total traffic is low, dynamically lower this threshold to analyze the top 20% of the site's most popular queries.*
- **Position:** Average position between 4 and 20 (high enough to be findable, low enough that a small push moves it meaningfully).
- **CTR:** Meaningfully below the expected CTR for that position.

For each Quick Win, report: query/page, impressions, clicks, CTR, position, estimated recoverable clicks, and a one-line diagnosis of *why* CTR is underperforming (e.g., generic title, no differentiator, truncated in SERP).

### Step 3 — Identify "Content Gaps"
A Content Gap is a topic the audience is searching for (proven via GSC impressions) that lacks a dedicated landing page, OR a cluster of queries currently landing on an irrelevant or general page (e.g., "dissertation help" queries landing on the Homepage).

- Group related queries into topics/themes.
- Use your knowledge of the business to judge relevance — flag but deprioritize low-intent noise.
- Clearly state your judgment calls on branded vs. non-branded queries.

### Step 4 — Verify Against the Codebase (CRITICAL)
- Before listing something as a "gap," use your codebase search tools (`grep_search`, `list_dir`) to confirm the page genuinely doesn't already exist.
- Remember: This is a custom React routing setup. Pages are dynamically routed in `src/App.jsx` and `src/pages/ServicePage.jsx` using data from `src/data/services.js`. Check the data files before concluding a page doesn't exist!
- If the page *does* exist in the codebase but GSC flagged it as a gap, assume it is an indexing issue. Flag it as an "Indexing Opportunity" rather than a Content Gap.

---

## Phase 2: Present Findings & Wait for Approval

Present your findings in a structured Artifact containing:
1. **Summary:** Headline numbers (total impressions/clicks/CTR, overall trend vs. prior 28 days).
2. **Quick Wins Table:** Ranked by estimated recoverable clicks.
3. **Content Gaps / Indexing Opportunities Table:** Grouped by topic, with codebase-verification status.
4. **Judgment Calls:** Note any threshold adjustments or ambiguous codebase routing cases.

**STOP.** Do not propose specific rewritten titles or draft new pages yet. Do not make any code changes. Set `RequestFeedback: true` on the artifact and wait for my explicit approval before executing any fixes.
