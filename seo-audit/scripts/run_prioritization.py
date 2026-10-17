#!/usr/bin/env python3
"""
run_prioritization.py — Phase 9 Prioritization & Action Roadmap Engine
Calculates Impact (1-5), Effort (1-5), Confidence (1-5), and Priority = Impact * Confidence / Effort.
Outputs findings to seo-audit/10_prioritized_roadmap.csv.
"""

import os
import csv
import sys
from pathlib import Path

PROJECT_ROOT = Path("/Users/surya/Desktop/Academic Wizard Latest.")
OUTPUT_CSV = PROJECT_ROOT / "seo-audit" / "10_prioritized_roadmap.csv"

def main():
    print("=== Phase 9: Prioritization & Implementation Roadmap Starting ===")

    roadmap = [
        # P0 Critical (0-7 Days)
        {
            "task_id": "ROADMAP-01",
            "priority_tier": "P0 Critical (0-7 days)",
            "initiative_name": "Synchronize SSG Pre-Render Pipeline for New Posts",
            "affected_area": "Blog Engine (394 Posts)",
            "impact": 5, "effort": 1, "confidence": 5,
            "owner_type": "Developer",
            "action_description": "Ensure dist/data/posts.json is synced from public/data/posts.json before running scripts/generate-blog-pages.mjs during build so 100% of newly published posts exist as pre-rendered HTML.",
            "expected_outcome": "Zero 404s or client fallbacks for Googlebot; immediate indexation of new daily blog content."
        },
        {
            "task_id": "ROADMAP-02",
            "priority_tier": "P0 Critical (0-7 days)",
            "initiative_name": "Maintain Anti-Doorway Pruning on 441 City Pages",
            "affected_area": "Programmatic City Pages",
            "impact": 5, "effort": 1, "confidence": 5,
            "owner_type": "SEO Specialist",
            "action_description": "Keep noindex, follow and sitemap exclusion on 441 thin city pages. Protects domain from Google Doorway Abuse / Scaled Content penalties.",
            "expected_outcome": "Elimination of low-quality doorway signals; domain health restoration under Google Helpful Content System."
        },
        {
            "task_id": "ROADMAP-03",
            "priority_tier": "P0 Critical (0-7 days)",
            "initiative_name": "Request GSC Priority Re-Crawl of Dissertation & Research Paper Hubs",
            "affected_area": "Commercial Hubs",
            "impact": 5, "effort": 1, "confidence": 5,
            "owner_type": "SEO Specialist",
            "action_description": "Inspect and submit /services/dissertation-help/ and /services/research-paper-help/ via Google Search Console URL Inspection API to force re-indexing.",
            "expected_outcome": "Recovery of core high-ticket commercial rankings and organic student quote inquiries."
        },

        # P1 High Impact (8-30 Days)
        {
            "task_id": "ROADMAP-04",
            "priority_tier": "P1 High (8-30 days)",
            "initiative_name": "Capture GSC Quick Wins (Push Pos 4-15 to Top 3)",
            "affected_area": "Accounting & Nursing Hubs",
            "impact": 5, "effort": 2, "confidence": 5,
            "owner_type": "Content / SEO",
            "action_description": "Optimize titles and H2s for accounting assignment help australia (Pos 7.5), nursing assignment help australia (Pos 8.9), and APA 7 sync guides.",
            "expected_outcome": "+20-40 organic clicks/month and direct high-value assignment inquiries."
        },
        {
            "task_id": "ROADMAP-05",
            "priority_tier": "P1 High (8-30 days)",
            "initiative_name": "Deploy Downloadable Subject PDF Sample Papers",
            "affected_area": "Top 5 Subject Hubs (Nursing, Law, MBA)",
            "impact": 4, "effort": 2, "confidence": 5,
            "owner_type": "Content / Developer",
            "action_description": "Embed watermark-protected 1st Class sample PDF papers (Care Plans, IRAC Law briefs, MBA Case Studies) on subject pages.",
            "expected_outcome": "Matches market leader benchmark (The Academic Papers UK / Scribbr); +35% on-page dwell time."
        },
        {
            "task_id": "ROADMAP-06",
            "priority_tier": "P1 High (8-30 days)",
            "initiative_name": "Establish Academic Persona Byline Profiles (E-E-A-T)",
            "affected_area": "About.jsx & BlogPost.jsx",
            "impact": 4, "effort": 2, "confidence": 4,
            "owner_type": "Content / Developer",
            "action_description": "Create named academic reviewer profiles (e.g., Dr. Eleanor Vance, PhD Nursing; Marcus Sterling, LLM Oxford) in About.jsx and link Article author schemas.",
            "expected_outcome": "Satisfies Google Search Quality Rater E-E-A-T guidelines for YMYL academic content."
        },

        # P2 Medium Impact (31-60 Days)
        {
            "task_id": "ROADMAP-07",
            "priority_tier": "P2 Medium (31-60 days)",
            "initiative_name": "Title Tag Character Length Normalization",
            "affected_area": "742 Programmatic Subject Pages",
            "impact": 3, "effort": 2, "confidence": 4,
            "owner_type": "Developer",
            "action_description": "Trim long location and university strings in SubjectCityPage.jsx title generation to guarantee titles stay under 60 characters / 600 pixels.",
            "expected_outcome": "Eliminates ellipsis truncation (...) in Google desktop and mobile SERPs."
        },
        {
            "task_id": "ROADMAP-08",
            "priority_tier": "P2 Medium (31-60 days)",
            "initiative_name": "Publish High-Intent Content Gap Guides",
            "affected_area": "Blog Section",
            "impact": 4, "effort": 3, "confidence": 4,
            "owner_type": "Content",
            "action_description": "Publish 6 high-value content gap guides (UK Viva Voce Preparation, Undergraduate vs Masters Dissertation, Gibbs Reflective Cycle Example).",
            "expected_outcome": "Captures top-of-funnel student search volume and funnels traffic to commercial hubs."
        },
        {
            "task_id": "ROADMAP-09",
            "priority_tier": "P2 Medium (31-60 days)",
            "initiative_name": "Expand FAQ Schemas with Real Student PAA Questions",
            "affected_area": "Commercial Hubs & Tools",
            "impact": 3, "effort": 2, "confidence": 4,
            "owner_type": "Content / SEO",
            "action_description": "Enrich FAQ sections with exact questions asked by UK and international students (supervision hours, Turnitin similarity thresholds, viva defense).",
            "expected_outcome": "Eligibility for Google FAQ rich snippet accordions in search results."
        },

        # P3 Low Impact / Maintenance (61-90+ Days)
        {
            "task_id": "ROADMAP-10",
            "priority_tier": "P3 Low (61-90+ days)",
            "initiative_name": "Archive 390 Legacy .html Blog Fragments",
            "affected_area": "public/blog/posts/*.html",
            "impact": 2, "effort": 2, "confidence": 4,
            "owner_type": "Developer",
            "action_description": "Once search console logs confirm 100% of organic bot traffic visits /blog/:slug/, remove legacy static .html fragment files from the repository.",
            "expected_outcome": "Cleaner codebase repository; eliminates 390 orphan URL warnings."
        },
        {
            "task_id": "ROADMAP-11",
            "priority_tier": "P3 Low (61-90+ days)",
            "initiative_name": "Add Dissertation Chapter Breakdown to Pricing Calculator",
            "affected_area": "PricingCalculator.jsx",
            "impact": 3, "effort": 3, "confidence": 3,
            "owner_type": "Developer",
            "action_description": "Introduce an interactive chapter slider (Literature Review 30%, Methodology 15%, Data Analysis 25%) into the pricing calculator.",
            "expected_outcome": "Higher engagement and larger average order value for full dissertation inquiries."
        }
    ]

    for item in roadmap:
        item["priority_score"] = round((item["impact"] * item["confidence"]) / item["effort"], 2)

    fieldnames = [
        "task_id", "priority_tier", "priority_score", "initiative_name",
        "affected_area", "impact", "effort", "confidence", "owner_type",
        "action_description", "expected_outcome"
    ]

    with open(OUTPUT_CSV, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(roadmap)

    print(f"\nSuccessfully wrote {len(roadmap)} prioritized roadmap initiatives to {OUTPUT_CSV}")
    print("\n=== PRIORITIZED ROADMAP SUMMARY ===")
    for item in roadmap:
        print(f"[{item['priority_tier']}] Score: {item['priority_score']} | {item['initiative_name']} (Owner: {item['owner_type']})")
    print("===================================\n")

if __name__ == "__main__":
    main()
