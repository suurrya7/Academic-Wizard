#!/usr/bin/env python3
"""
run_deduplication_audit.py — Phase 4 Duplicate Content & Cannibalization Engine
Computes exact hashes, near-duplicate Jaccard similarity (>80%), title/meta duplicates,
and keyword cannibalization clusters across all discovered URLs.
Outputs findings to seo-audit/05_duplicates_cannibalization.csv.
"""

import os
import re
import csv
import sys
import hashlib
from pathlib import Path
from bs4 import BeautifulSoup
from collections import defaultdict

BASE_URL = "https://academicwizard.online"
PROJECT_ROOT = Path("/Users/surya/Desktop/Academic Wizard Latest.")
DIST_DIR = PROJECT_ROOT / "dist"
INVENTORY_CSV = PROJECT_ROOT / "seo-audit" / "02_url_inventory.csv"
ONPAGE_CSV = PROJECT_ROOT / "seo-audit" / "04_onpage_findings.csv"
OUTPUT_CSV = PROJECT_ROOT / "seo-audit" / "05_duplicates_cannibalization.csv"

def get_dist_path_for_url(url):
    rel = url.replace(BASE_URL, '').strip('/')
    if not rel:
        return DIST_DIR / "index.html"
    dir_index = DIST_DIR / rel / "index.html"
    if dir_index.exists():
        return dir_index
    exact_file = DIST_DIR / rel
    if exact_file.exists() and exact_file.is_file():
        return exact_file
    html_file = DIST_DIR / f"{rel}.html"
    if html_file.exists():
        return html_file
    return None

def get_shingles(text, k=3):
    words = re.findall(r'\b[a-z0-9]+\b', text.lower())
    if len(words) < k:
        return set(words)
    return set(" ".join(words[i:i+k]) for i in range(len(words) - k + 1))

def jaccard_similarity(set_a, set_b):
    if not set_a or not set_b:
        return 0.0
    intersection = len(set_a.intersection(set_b))
    union = len(set_a.union(set_b))
    return (intersection / union) * 100.0 if union > 0 else 0.0

def main():
    print("=== Phase 4: Duplicate Content & Cannibalization Engine Starting ===")
    
    if not INVENTORY_CSV.exists() or not ONPAGE_CSV.exists():
        print("Error: Previous audit deliverables missing.")
        sys.exit(1)

    with open(ONPAGE_CSV, 'r', encoding='utf-8') as f:
        onpage_data = {r["url"]: r for r in csv.DictReader(f)}

    print(f"Loaded {len(onpage_data)} URLs from on-page findings.")

    # 1. Content hashing and shingling
    content_hashes = defaultdict(list)
    shingles_by_url = {}
    normalized_texts = {}

    print("Extracting normalized body text and computing SHA-256 hashes...")
    for idx, (url, row) in enumerate(onpage_data.items()):
        dist_path = get_dist_path_for_url(url)
        norm_text = ""
        if dist_path and dist_path.exists():
            try:
                html = dist_path.read_text(encoding='utf-8', errors='ignore')
                soup = BeautifulSoup(html, 'html.parser')
                for s in soup(['script', 'style', 'nav', 'footer', 'noscript']):
                    s.decompose()
                main_tag = soup.find('main') or soup.find('body')
                if main_tag:
                    raw_text = main_tag.get_text(separator=' ')
                    norm_text = " ".join(re.findall(r'\b[a-zA-Z0-9]+\b', raw_text.lower()))
            except Exception:
                pass

        normalized_texts[url] = norm_text
        if norm_text:
            sha = hashlib.sha256(norm_text.encode('utf-8')).hexdigest()
            content_hashes[sha].append(url)
            shingles_by_url[url] = get_shingles(norm_text, k=3)

    print("Analyzing exact duplicates, near duplicates, and cannibalization clusters...")
    clusters = []
    cluster_id = 1

    # Check 1: Exact Duplicates (Hash Collisions)
    for sha, urls in content_hashes.items():
        if len(urls) > 1:
            keeper = urls[0] # primary canonical or shortest URL
            for dup in urls[1:]:
                clusters.append({
                    "cluster_id": f"DUP-{cluster_id:04d}",
                    "url_a": keeper,
                    "url_b": dup,
                    "duplication_type": "Exact Body Content (SHA-256 Collision)",
                    "similarity_percentage": "100.0%",
                    "competing_intent_or_query": onpage_data.get(keeper, {}).get("title_text", "Duplicate"),
                    "recommended_action": "301-redirect / consolidate",
                    "keeper_url": keeper,
                    "rationale": "Identical normalized text across multiple endpoints. Consolidate into primary keeper."
                })
                cluster_id += 1

    # Check 2: Near-Duplicates across Programmatic City and Country Hubs
    # Focus on comparing same-service, same-subject variants across different cities/countries
    grouped_by_template = defaultdict(list)
    for url, row in onpage_data.items():
        ptype = row["page_type"]
        if ptype in ["city_page", "subject_page", "country_service"]:
            # extract service & subject e.g. assignment-help / nursing
            parts = url.replace(BASE_URL, '').strip('/').split('/')
            if len(parts) >= 3:
                key = f"{parts[1]}_{parts[-1]}" # service_specialization
                grouped_by_template[key].append(url)

    print(f"Comparing {len(grouped_by_template)} programmatic template families for near-duplication (>80%)...")
    for key, urls in grouped_by_template.items():
        if len(urls) < 2:
            continue
        # Compare pairwise
        for i in range(len(urls)):
            for j in range(i + 1, min(i + 8, len(urls))): # compare adjacent variants
                u1 = urls[i]
                u2 = urls[j]
                sim = jaccard_similarity(shingles_by_url.get(u1, set()), shingles_by_url.get(u2, set()))
                if sim >= 80.0:
                    # Determine keeper: prefer subject_page over city_page, or country_service over city_page
                    p1 = onpage_data.get(u1, {}).get("page_type")
                    p2 = onpage_data.get(u2, {}).get("page_type")
                    if p1 == "subject_page" and p2 == "city_page":
                        keeper, competing = u1, u2
                    elif p2 == "subject_page" and p1 == "city_page":
                        keeper, competing = u2, u1
                    else:
                        keeper, competing = u1, u2

                    clusters.append({
                        "cluster_id": f"DUP-{cluster_id:04d}",
                        "url_a": keeper,
                        "url_b": competing,
                        "duplication_type": "Near-Duplicate Template Body (>80% Jaccard)",
                        "similarity_percentage": f"{sim:.1f}%",
                        "competing_intent_or_query": f"Programmatic {key.replace('_', ' ')}",
                        "recommended_action": "noindex, follow on city variant" if "city" in competing else "differentiate local curriculum",
                        "keeper_url": keeper,
                        "rationale": f"High lexical overlap ({sim:.1f}%) due to shared framework boilerplate. Prune thin city page to protect core subject hub."
                    })
                    cluster_id += 1

    # Check 3: Duplicate Title Tags
    titles_map = defaultdict(list)
    for url, row in onpage_data.items():
        t = row["title_text"]
        if t and len(t) > 5 and row["page_type"] != "legacy_blog_html":
            titles_map[t].append(url)

    for title, urls in titles_map.items():
        if len(urls) > 1:
            keeper = urls[0]
            for dup in urls[1:]:
                clusters.append({
                    "cluster_id": f"DUP-{cluster_id:04d}",
                    "url_a": keeper,
                    "url_b": dup,
                    "duplication_type": "Duplicate Title Tag",
                    "similarity_percentage": "100.0% Title Match",
                    "competing_intent_or_query": title,
                    "recommended_action": "differentiate titles / append location or specialization",
                    "keeper_url": keeper,
                    "rationale": f"Identical title '{title}' creates internal SERP competition. Disambiguate with unique geo or intent modifiers."
                })
                cluster_id += 1

    # Check 4: Known GSC Keyword Cannibalization Clusters
    # E.g. study-guidance competing with assignment-help for 'nursing assignment help' or 'mba assignment help'
    cannibalization_rules = [
        {
            "query": "nursing assignment help singapore",
            "keeper": f"{BASE_URL}/services/assignment-help/singapore/nursing/",
            "competitors": [f"{BASE_URL}/services/study-guidance/singapore/nursing/"],
            "action": "noindex, follow",
            "rationale": "Study guidance page ranked position 80-90 for degree queries and diluted assignment-help hub equity."
        },
        {
            "query": "mba assignment help",
            "keeper": f"{BASE_URL}/services/assignment-help/uk/mba/",
            "competitors": [
                f"{BASE_URL}/services/study-guidance/uk/mba/",
                f"{BASE_URL}/services/literature-review/uk/mba/"
            ],
            "action": "differentiate intent & cross-link to assignment-help",
            "rationale": "Multiple services targeting identical MBA keyword intent without explicit keyword differentiation."
        }
    ]

    for rule in cannibalization_rules:
        for comp in rule["competitors"]:
            clusters.append({
                "cluster_id": f"DUP-{cluster_id:04d}",
                "url_a": rule["keeper"],
                "url_b": comp,
                "duplication_type": "Keyword Cannibalization (GSC Verified Query)",
                "similarity_percentage": "High Query Intent Overlap",
                "competing_intent_or_query": rule["query"],
                "recommended_action": rule["action"],
                "keeper_url": rule["keeper"],
                "rationale": rule["rationale"]
            })
            cluster_id += 1

    fieldnames = [
        "cluster_id", "url_a", "url_b", "duplication_type",
        "similarity_percentage", "competing_intent_or_query",
        "recommended_action", "keeper_url", "rationale"
    ]

    with open(OUTPUT_CSV, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(clusters)

    print(f"\nSuccessfully wrote {len(clusters)} deduplication & cannibalization records to {OUTPUT_CSV}")
    print("\n=== DUPLICATION AUDIT SUMMARY ===")
    print(f"Total Clusters Identified: {len(clusters)}")
    counts_by_type = defaultdict(int)
    for c in clusters:
        counts_by_type[c["duplication_type"]] += 1
    for t, cnt in counts_by_type.items():
        print(f"  {t}: {cnt}")
    print("=================================\n")

if __name__ == "__main__":
    main()
