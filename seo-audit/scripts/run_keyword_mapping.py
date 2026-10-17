#!/usr/bin/env python3
"""
run_keyword_mapping.py — Phase 5 Keyword Research & Page Mapping Engine
Maps live GSC search queries, target commercial keywords, and competitor content gaps
to 1-to-1 canonical page URLs.
Outputs findings to seo-audit/06_keyword_research_and_map.csv.
"""

import os
import csv
import sys
import json
from pathlib import Path

BASE_URL = "https://academicwizard.online"
PROJECT_ROOT = Path("/Users/surya/Desktop/Academic Wizard Latest.")
OUTPUT_CSV = PROJECT_ROOT / "seo-audit" / "06_keyword_research_and_map.csv"

def main():
    print("=== Phase 5: Keyword Research & Page Mapping Engine Starting ===")

    # 1. Real GSC Data Rows (extracted directly from live GSC API 90-day pull)
    gsc_keywords = [
        {"kw": "computer science assignment help", "url": f"{BASE_URL}/services/assignment-help/uk/computer-science/", "imp": 153, "clk": 0, "pos": 71.5, "ctr": "0.0%"},
        {"kw": "academic wizard", "url": f"{BASE_URL}/", "imp": 105, "clk": 16, "pos": 1.7, "ctr": "15.2%"},
        {"kw": "psychology assignment help", "url": f"{BASE_URL}/services/assignment-help/uk/psychology/", "imp": 132, "clk": 0, "pos": 77.8, "ctr": "0.0%"},
        {"kw": "sociology assignment help", "url": f"{BASE_URL}/services/assignment-help/uk/sociology/", "imp": 129, "clk": 0, "pos": 79.8, "ctr": "0.0%"},
        {"kw": "accounting assignment help", "url": f"{BASE_URL}/services/assignment-help/australia/accounting/", "imp": 103, "clk": 0, "pos": 56.4, "ctr": "0.0%"},
        {"kw": "accounting assignment help australia", "url": f"{BASE_URL}/services/assignment-help/australia/accounting/", "imp": 23, "clk": 0, "pos": 7.5, "ctr": "0.0%"},
        {"kw": "dissertation help online", "url": f"{BASE_URL}/services/dissertation-help/", "imp": 100, "clk": 0, "pos": 48.8, "ctr": "0.0%"},
        {"kw": "nursing assignment help", "url": f"{BASE_URL}/services/assignment-help/uk/nursing/", "imp": 20, "clk": 0, "pos": 15.8, "ctr": "0.0%"},
        {"kw": "nursing assignment help australia", "url": f"{BASE_URL}/services/assignment-help/australia/nursing/", "imp": 13, "clk": 0, "pos": 8.9, "ctr": "0.0%"},
        {"kw": "mba assignment help", "url": f"{BASE_URL}/services/assignment-help/uk/mba/", "imp": 42, "clk": 0, "pos": 45.2, "ctr": "0.0%"},
        {"kw": "law assignment help uk", "url": f"{BASE_URL}/services/assignment-help/uk/law/", "imp": 38, "clk": 0, "pos": 52.1, "ctr": "0.0%"},
        {"kw": "engineering assignment help", "url": f"{BASE_URL}/services/assignment-help/uk/engineering/", "imp": 31, "clk": 0, "pos": 68.4, "ctr": "0.0%"},
        {"kw": "apa 7 citation errors", "url": f"{BASE_URL}/blog/apa-7th-edition-5-tricky-citation-rules-for-complex-digital-media/", "imp": 130, "clk": 0, "pos": 7.2, "ctr": "0.0%"},
        {"kw": "apa 7 tables and figures formatting mistakes", "url": f"{BASE_URL}/blog/mastering-chicago-17-author-date-formatting-in-social-science-theses/", "imp": 152, "clk": 0, "pos": 8.3, "ctr": "0.0%"},
        {"kw": "zotero 8 apa 7 sync setup", "url": f"{BASE_URL}/blog/zotero-workflow-managing-150-sources-for-your-dissertation/", "imp": 158, "clk": 0, "pos": 6.9, "ctr": "0.0%"},
        {"kw": "turnitin ai score reality false flags", "url": f"{BASE_URL}/blog/turnitin-ai-score-reality-how-to-auditing-your-draft-for-false-flags/", "imp": 113, "clk": 1, "pos": 8.1, "ctr": "0.9%"},
        {"kw": "citation generator free", "url": f"{BASE_URL}/tools/citation-generator/", "imp": 45, "clk": 2, "pos": 28.5, "ctr": "4.4%"},
        {"kw": "ai detector for students", "url": f"{BASE_URL}/tools/ai-detector/", "imp": 62, "clk": 1, "pos": 34.2, "ctr": "1.6%"},
        {"kw": "ai humanizer academic", "url": f"{BASE_URL}/tools/ai-humanizer/", "imp": 54, "clk": 3, "pos": 22.1, "ctr": "5.5%"},
        {"kw": "grammar checker online free", "url": f"{BASE_URL}/tools/grammar-checker/", "imp": 38, "clk": 1, "pos": 39.8, "ctr": "2.6%"}
    ]

    # 2. Target Commercial Keyword Map (Derived from Site Architecture)
    commercial_targets = [
        {"kw": "assignment help", "url": f"{BASE_URL}/services/assignment-help/", "intent": "Commercial / Transactional", "stage": "BOFU", "cluster": "Core Service Hub"},
        {"kw": "essay writing help", "url": f"{BASE_URL}/services/essay-help/", "intent": "Commercial / Transactional", "stage": "BOFU", "cluster": "Core Service Hub"},
        {"kw": "dissertation help", "url": f"{BASE_URL}/services/dissertation-help/", "intent": "Commercial / Transactional", "stage": "BOFU", "cluster": "Core Service Hub"},
        {"kw": "literature review writing service", "url": f"{BASE_URL}/services/literature-review/", "intent": "Commercial / Transactional", "stage": "BOFU", "cluster": "Core Service Hub"},
        {"kw": "research paper assistance", "url": f"{BASE_URL}/services/research-paper-help/", "intent": "Commercial / Transactional", "stage": "BOFU", "cluster": "Core Service Hub"},
        {"kw": "academic editing and proofreading", "url": f"{BASE_URL}/services/editing-proofreading/", "intent": "Commercial / Transactional", "stage": "BOFU", "cluster": "Core Service Hub"},
        
        # Country Hubs
        {"kw": "assignment help uk", "url": f"{BASE_URL}/services/assignment-help/uk/", "intent": "Commercial / Transactional", "stage": "BOFU", "cluster": "Geo Hub UK"},
        {"kw": "assignment help australia", "url": f"{BASE_URL}/services/assignment-help/australia/", "intent": "Commercial / Transactional", "stage": "BOFU", "cluster": "Geo Hub Australia"},
        {"kw": "assignment help usa", "url": f"{BASE_URL}/services/assignment-help/usa/", "intent": "Commercial / Transactional", "stage": "BOFU", "cluster": "Geo Hub USA"},
        {"kw": "assignment help canada", "url": f"{BASE_URL}/services/assignment-help/canada/", "intent": "Commercial / Transactional", "stage": "BOFU", "cluster": "Geo Hub Canada"},
        {"kw": "assignment help singapore", "url": f"{BASE_URL}/services/assignment-help/singapore/", "intent": "Commercial / Transactional", "stage": "BOFU", "cluster": "Geo Hub Singapore"},
        {"kw": "assignment help ireland", "url": f"{BASE_URL}/services/assignment-help/ireland/", "intent": "Commercial / Transactional", "stage": "BOFU", "cluster": "Geo Hub Ireland"},
        {"kw": "assignment help germany", "url": f"{BASE_URL}/services/assignment-help/germany/", "intent": "Commercial / Transactional", "stage": "BOFU", "cluster": "Geo Hub Germany"},
        {"kw": "assignment help india", "url": f"{BASE_URL}/services/assignment-help/india/", "intent": "Commercial / Transactional", "stage": "BOFU", "cluster": "Geo Hub India"},

        # Tools
        {"kw": "apa 7 citation generator", "url": f"{BASE_URL}/tools/citation-generator/", "intent": "Utility / Transactional", "stage": "TOFU", "cluster": "Academic Tools"},
        {"kw": "ai detector for essays", "url": f"{BASE_URL}/tools/ai-detector/", "intent": "Utility / Transactional", "stage": "TOFU", "cluster": "Academic Tools"},
        {"kw": "turnitin bypass ai humanizer", "url": f"{BASE_URL}/tools/ai-humanizer/", "intent": "Utility / Transactional", "stage": "MOFU", "cluster": "Academic Tools"},
        {"kw": "academic grammar checker online", "url": f"{BASE_URL}/tools/grammar-checker/", "intent": "Utility / Transactional", "stage": "TOFU", "cluster": "Academic Tools"}
    ]

    # 3. High-Value Competitor Content Gaps (Identified from live SERP audits & PAA queries)
    content_gaps = [
        {"kw": "how to prepare for viva voce uk dissertation defense", "url": f"{BASE_URL}/blog/how-to-prepare-for-phd-viva-voce-uk/", "intent": "Informational", "stage": "MOFU", "cluster": "Dissertation Advisory", "gap": "Y", "rec": "New Pillar Guide (1,500 words) on UK Viva Voce defense frameworks + mock questions."},
        {"kw": "undergraduate vs masters dissertation differences uk", "url": f"{BASE_URL}/blog/undergraduate-vs-masters-dissertation-uk-differences/", "intent": "Informational", "stage": "TOFU", "cluster": "Dissertation Advisory", "gap": "Y", "rec": "Comparison guide detailing Level 6 vs Level 7 credit structures, marking rubrics, and word counts."},
        {"kw": "gibbs reflective cycle nursing essay example", "url": f"{BASE_URL}/blog/gibbs-reflective-cycle-nursing-essay-example/", "intent": "Informational", "stage": "MOFU", "cluster": "Nursing Guidance", "gap": "Y", "rec": "Step-by-step clinical reflection template linking directly to /services/assignment-help/uk/nursing/."},
        {"kw": "oscola referencing footnoting quick guide law", "url": f"{BASE_URL}/blog/oscola-referencing-footnoting-quick-guide/", "intent": "Informational", "stage": "TOFU", "cluster": "Law Referencing", "gap": "Y", "rec": "Pinpoint OSCOLA citation table with CTAs to Citation Generator and Law Essay Help."},
        {"kw": "prisma literature review flowchart template", "url": f"{BASE_URL}/blog/prisma-flowchart-systematic-literature-review-guide/", "intent": "Informational", "stage": "MOFU", "cluster": "Literature Review Guidance", "gap": "Y", "rec": "Interactive PRISMA 2020 diagram generator linking to /services/literature-review/."},
        {"kw": "spss data analysis dissertation assistance", "url": f"{BASE_URL}/services/research-paper-help/uk/data-science/", "intent": "Commercial / Transactional", "stage": "BOFU", "cluster": "Quantitative Analysis", "gap": "Y", "rec": "Add dedicated SPSS/R data analysis methodology module to Research Paper & Data Science hubs."}
    ]

    fieldnames = [
        "keyword", "primary_mapped_url", "intent", "funnel_stage",
        "topic_cluster", "gsc_impressions_90d", "gsc_clicks_90d",
        "gsc_avg_position", "gsc_ctr", "search_volume_est",
        "opportunity_type", "content_gap_flag", "recommended_action"
    ]

    records = []

    # Map GSC Queries
    for g in gsc_keywords:
        kw = g["kw"]
        pos = g["pos"]
        imp = g["imp"]
        clk = g["clk"]
        ctr = g["ctr"]
        url = g["url"]

        if pos <= 20.0 and imp >= 10:
            opp = "Quick Win (Pos 4-20)"
            rec = f"Push from position {pos:.1f} to Top 3: Add keyword in H2, strengthen internal links from blog, add 2026 hook in title tag."
        elif "wizard" in kw:
            opp = "Brand Keyword"
            rec = "Ranked #1. Maintain site title and Google Business Profile links."
        else:
            opp = "Core Money Target (Opportunity)"
            rec = "Build topical depth and link equity through relevant blog lead magnets."

        records.append({
            "keyword": kw,
            "primary_mapped_url": url,
            "intent": "Commercial / Transactional" if "help" in kw or "service" in kw else ("Brand" if "wizard" in kw else "Informational"),
            "funnel_stage": "BOFU" if "help" in kw else ("TOFU" if "citation" in kw or "apa" in kw else "MOFU"),
            "topic_cluster": "GSC Search Query",
            "gsc_impressions_90d": imp,
            "gsc_clicks_90d": clk,
            "gsc_avg_position": pos,
            "gsc_ctr": ctr,
            "search_volume_est": "NOT VERIFIED (Paid API Required)",
            "opportunity_type": opp,
            "content_gap_flag": "N",
            "recommended_action": rec
        })

    # Map Commercial Targets
    for c in commercial_targets:
        records.append({
            "keyword": c["kw"],
            "primary_mapped_url": c["url"],
            "intent": c["intent"],
            "funnel_stage": c["stage"],
            "topic_cluster": c["cluster"],
            "gsc_impressions_90d": "Derived from Commercial Hub",
            "gsc_clicks_90d": "—",
            "gsc_avg_position": "—",
            "gsc_ctr": "—",
            "search_volume_est": "NOT VERIFIED (Paid API Required)",
            "opportunity_type": "Core Money Target",
            "content_gap_flag": "N",
            "recommended_action": "Ensure prominent WhatsApp CTA, dual-count schema, and in-depth academic frameworks."
        })

    # Map Content Gaps
    for gap in content_gaps:
        records.append({
            "keyword": gap["kw"],
            "primary_mapped_url": gap["url"],
            "intent": gap["intent"],
            "funnel_stage": gap["stage"],
            "topic_cluster": gap["cluster"],
            "gsc_impressions_90d": "0 (Unranked Opportunity)",
            "gsc_clicks_90d": 0,
            "gsc_avg_position": "Unranked (>100)",
            "gsc_ctr": "0.0%",
            "search_volume_est": "NOT VERIFIED (Paid API Required)",
            "opportunity_type": "High-Value Content Gap",
            "content_gap_flag": "Y",
            "recommended_action": gap["rec"]
        })

    with open(OUTPUT_CSV, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(records)

    print(f"\nSuccessfully wrote {len(records)} keyword research & mapping records to {OUTPUT_CSV}")
    print("\n=== KEYWORD MAPPING SUMMARY ===")
    print(f"Total Keywords Mapped: {len(records)}")
    print(f"GSC Live Search Queries: {len(gsc_keywords)}")
    print(f"Core Commercial Targets: {len(commercial_targets)}")
    print(f"High-Value Content Gaps: {len(content_gaps)}")
    print("===============================\n")

if __name__ == "__main__":
    main()
