# Phase 1 Gate Check: Discovery & URL Inventory

**Target Property:** `https://academicwizard.online`  
**Execution Timestamp:** 2026-10-17T16:33:30+05:30  
**Gate Status:** **PASSED (100% Reconciliation)**  

---

## 1. URL Inventory & Census Reconciliation

| Metric Category | Count | % of Discovered | Status & Reconciliation Explanation |
| :--- | :--- | :--- | :--- |
| **Total Discovered URLs** | **2,258** | **100.0%** | Full enumeration across sitemap.xml, filesystem pre-render builds, routing, and data assets. |
| **Total in Sitemap (`sitemap.xml`)** | **1,289** | **57.09%** | All commercial hubs, country hubs, commercial subject hubs, blog posts, tools, and static pages. |
| **Total Indexable Candidate URLs** | **1,289** | **57.09%** | Exactly matches sitemap count (1,289). 100% correlation between declared sitemap and indexable HTML. |
| **Total Noindexed URLs** | **968** | **42.87%** | Pruned intentionally: 441 thin city pages (`noindex, follow`), 136 study-guidance cannibalization pages (`noindex, follow`), and 391 legacy `.html` blog files (`noindex, follow`). |
| **Total Blocked in `robots.txt`** | **1** | **0.04%** | `/activation-generator-secret/` intentionally blocked via `Disallow: /activation-generator-secret`. |
| **Total Orphan URLs** | **418** | **18.51%** | 391 legacy static blog `.html` files + 27 isolated utility fragments (zero inbound links from main navigation). |

**Mathematical Proof of Reconciliation:**
$$\text{Total Discovered (2,258)} = \text{Indexable (1,289)} + \text{Noindexed (968)} + \text{Blocked (1)} = 2,258$$
$$\text{Difference between Sitemap and Indexable} = 1,289 - 1,289 = \mathbf{0}$$

---

## 2. Inbound Click Depth Distribution (BFS Traversal from Homepage)

* **Depth 0 (Homepage):** 1 URL
* **Depth 1 (Direct Nav / Footer / Directory):** 28 URLs (`/services/`, `/services/directory/`, `/tools/`, `/blog/`, `/about/`, `/contact/`, core service hubs)
* **Depth 2 (Country Hubs & Primary Tool Pages):** 64 URLs (`/services/:service/:country/`, tool generators)
* **Depth 3 (Commercial Subject Hubs & Featured Blogs):** 860 URLs (`/services/:service/:country/:subject/`, linked blog posts)
* **Depth 4 (Deep Programmatic Pages & Paginated Archives):** 887 URLs
* **Unreachable / Orphaned (Depth > 5 or Inbound = 0):** 418 URLs (chiefly legacy `.html` files)

---

## 3. Unresolved Items & Observations for Phase 2

1. **Legacy HTML File Cleanup:** 391 files in `public/blog/posts/*.html` are currently serving as 0-second meta-refresh redirects. While safe, they represent legacy baggage that should eventually be archived.
2. **Orphan Ratio in Indexable Set:** In the 1,289 *indexable* URL pool, exactly 0 orphan pages exist; all 1,289 indexable URLs are reachable via BFS traversal within 4 clicks of the homepage.
3. **Robots Meta Tag Redundancy:** Root HTML sets `<meta name="robots" content="max-image-preview:large">` while page templates append `<meta name="robots" content="noindex, follow">`. Google Search Central confirms Google merges these without conflict, but consolidating into a single directive is recommended for cleaner DOM.

**Gate 1 is officially PASSED. Proceeding to Phase 2: Technical SEO Audit.**
