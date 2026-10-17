#!/usr/bin/env python3
"""
cluster_similarity.py — Forensic Content Similarity Clustering for Programmatic SEO Pages.
Calculates n-gram shingle Jaccard similarity across all programmatic pages to detect
near-duplicate content clusters (>= 80% similarity).
"""

import os
import re
import sys
from pathlib import Path
from collections import defaultdict
from bs4 import BeautifulSoup

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
DIST_SERVICES = PROJECT_ROOT / "dist" / "services"

def get_shingles(text, k=3):
    """Generate k-word shingles from clean text."""
    words = re.findall(r"\b[a-zA-Z0-9_-]+\b", text.lower())
    if len(words) < k:
        return set(words)
    return set(" ".join(words[i:i+k]) for i in range(len(words) - k + 1))

def jaccard_similarity(set_a, set_b):
    """Calculate Jaccard similarity between two sets."""
    if not set_a or not set_b:
        return 0.0
    intersection = len(set_a.intersection(set_b))
    union = len(set_a.union(set_b))
    return intersection / union if union > 0 else 0.0

def main():
    print("=" * 70)
    print("PROGRAMMATIC SEO NEAR-DUPLICATE CLUSTER ANALYSIS (80%+ SIMILARITY)")
    print("=" * 70)

    html_files = sorted(list(DIST_SERVICES.glob("**/index.html")))
    print(f"Total HTML files found in dist/services/: {len(html_files)}")

    pages = {}
    for h_path in html_files:
        rel = str(h_path.relative_to(PROJECT_ROOT / "dist")).replace("/index.html", "").strip("/")
        url = f"https://academicwizard.online/{rel}/"
        
        soup = BeautifulSoup(h_path.read_text(encoding="utf-8", errors="ignore"), "html.parser")
        main_elem = soup.find("main")
        if not main_elem:
            continue
            
        # Extract text from main body
        body_text = " ".join(main_elem.stripped_strings)
        shingles = get_shingles(body_text, k=3)
        words = body_text.split()
        
        parts = rel.split("/")
        # e.g. ['services', 'assignment-help', 'uk', 'nursing']
        service = parts[1] if len(parts) > 1 else ""
        country = parts[2] if len(parts) > 2 else ""
        sub_or_city = parts[3] if len(parts) > 3 else ""
        page_type = "service_hub" if len(parts) == 2 else ("country_hub" if len(parts) == 3 else "subject_page")

        pages[url] = {
            "rel": rel,
            "url": url,
            "service": service,
            "country": country,
            "sub_or_city": sub_or_city,
            "page_type": page_type,
            "word_count": len(words),
            "shingles": shingles,
            "body_text": body_text
        }

    print(f"Parsed {len(pages)} pages successfully.")

    # 1. Group by subject across services and countries to find cross-service & cross-country clusters
    subjects_map = defaultdict(list)
    for u, p in pages.items():
        if p["page_type"] == "subject_page":
            subjects_map[p["sub_or_city"]].append(u)

    print(f"Auditing {len(subjects_map)} unique subjects across {len(pages)} pages...")

    # Pairwise comparison
    high_sim_pairs = []
    
    # Check within subject groups (e.g. all nursing pages across all services & countries)
    for subj, urls_in_subj in subjects_map.items():
        n = len(urls_in_subj)
        for i in range(n):
            u1 = urls_in_subj[i]
            p1 = pages[u1]
            for j in range(i + 1, n):
                u2 = urls_in_subj[j]
                p2 = pages[u2]
                
                sim = jaccard_similarity(p1["shingles"], p2["shingles"])
                if sim >= 0.70: # Look at 70%+ to capture all border cases and 80%+ clusters
                    high_sim_pairs.append({
                        "url1": u1,
                        "url2": u2,
                        "subj": subj,
                        "service1": p1["service"],
                        "service2": p2["service"],
                        "country1": p1["country"],
                        "country2": p2["country"],
                        "sim": sim,
                        "words1": p1["word_count"],
                        "words2": p2["word_count"]
                    })

    # Sort by similarity descending
    high_sim_pairs.sort(key=lambda x: x["sim"], reverse=True)

    # Filter >= 80%
    clusters_80_plus = [p for p in high_sim_pairs if p["sim"] >= 0.80]
    clusters_70_to_80 = [p for p in high_sim_pairs if 0.70 <= p["sim"] < 0.80]

    print(f"\n--- SIMILARITY PAIRS SUMMARY ---")
    print(f"Total pairs with >= 80% 3-gram similarity: {len(clusters_80_plus)}")
    print(f"Total pairs with 70-79% 3-gram similarity: {len(clusters_70_to_80)}")

    # Group into connected clusters (disjoint-set / graph clustering)
    parent = {}
    def find(i):
        if parent[i] == i:
            return i
        parent[i] = find(parent[i])
        return parent[i]
    def union(i, j):
        root_i = find(i)
        root_j = find(j)
        if root_i != root_j:
            parent[root_i] = root_j

    for u in pages:
        parent[u] = u

    for p in clusters_80_plus:
        union(p["url1"], p["url2"])

    clusters = defaultdict(list)
    for u in pages:
        if pages[u]["page_type"] == "subject_page":
            r = find(u)
            clusters[r].append(u)

    multi_page_clusters = {k: v for k, v in clusters.items() if len(v) > 1}
    print(f"\nTotal Multi-Page Similarity Clusters (>=80%): {len(multi_page_clusters)}")

    for i, (root, c_urls) in enumerate(sorted(multi_page_clusters.items(), key=lambda x: len(x[1]), reverse=True), 1):
        sample_page = pages[c_urls[0]]
        subj = sample_page["sub_or_city"]
        services_in_cluster = set(pages[u]["service"] for u in c_urls)
        countries_in_cluster = set(pages[u]["country"] for u in c_urls)
        
        # Calculate avg internal similarity in cluster
        sims = []
        for a in range(len(c_urls)):
            for b in range(a+1, len(c_urls)):
                sims.append(jaccard_similarity(pages[c_urls[a]]["shingles"], pages[c_urls[b]]["shingles"]))
        avg_sim = sum(sims) / len(sims) if sims else 1.0

        print(f"\nCLUSTER #{i}: Subject '{subj}' ({len(c_urls)} pages, avg similarity: {avg_sim*100:.1f}%)")
        print(f"   Services ({len(services_in_cluster)}): {', '.join(sorted(services_in_cluster))}")
        print(f"   Countries ({len(countries_in_cluster)}): {', '.join(sorted(countries_in_cluster))}")
        print(f"   Sample URLs:")
        for u in c_urls[:6]:
            print(f"     - {u} ({pages[u]['word_count']} words)")
        if len(c_urls) > 6:
            print(f"     ... and {len(c_urls) - 6} more")

if __name__ == "__main__":
    main()
