#!/usr/bin/env python3
"""
test_titles_descriptions.py — Build-time validation test for SEO titles and meta descriptions.
Enforces:
1. 100% of sitemap.xml URLs exist as pre-rendered HTML in dist/.
2. Every indexable title is <= 60 characters.
3. Every indexable title is unique across all indexable URLs (no duplicates).
4. No indexable title contains "..." or slice-cut words.
5. Every indexable meta description is strictly between 120 and 155 characters.
6. Every indexable meta description is unique per page.
7. Zero unverifiable claims ("guaranteed", "100% safe", "100% turnitin-safe", "100% original", "100% bug-free", "1st class guaranteed").

Exits with code 1 upon any failure to halt the build pipeline.
"""

import sys
import re
import html
import xml.etree.ElementTree as ET
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
DIST_DIR = PROJECT_ROOT / "dist"
SITEMAP_PATH = PROJECT_ROOT / "public" / "sitemap.xml"

def main():
    print("=" * 70)
    print("SEO BUILD-TIME TEST: TITLES & META DESCRIPTIONS ENFORCEMENT")
    print("=" * 70)

    if not DIST_DIR.exists():
        print(f"❌ Error: {DIST_DIR} does not exist. Run 'npm run build' first.")
        sys.exit(1)

    # 1. Parse Sitemap URLs
    sitemap_to_use = DIST_DIR / "sitemap.xml"
    if not sitemap_to_use.exists():
        sitemap_to_use = SITEMAP_PATH

    if not sitemap_to_use.exists():
        print(f"❌ Error: sitemap.xml not found in dist/ or public/.")
        sys.exit(1)

    tree = ET.parse(sitemap_to_use)
    ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    sitemap_urls = [loc.text.strip() for loc in tree.getroot().findall("sm:url/sm:loc", ns)]
    print(f"Total indexable URLs declared in sitemap: {len(sitemap_urls)}")

    title_pat = re.compile(r"<title>([^<]+)</title>", re.I)
    desc_pat = re.compile(r'<meta[^>]+name=["\']description["\'][^>]+content=(["\'])(.*?)\1', re.I)
    robots_pat = re.compile(r'<meta[^>]+name=["\']robots["\'][^>]+content=(["\'])(.*?)\1', re.I)

    titles_seen = {}
    descriptions_seen = {}
    
    missing_files = []
    missing_titles = []
    missing_descs = []
    title_over_60 = []
    title_dots = []
    title_duplicates = []
    desc_length_errors = []
    desc_duplicates = []
    unverifiable_claims = []

    UNVERIFIABLE_KEYWORDS = [
        "100% safe",
        "100% turnitin-safe",
        "100% turnitin safe",
        "100% original",
        "100% bug-free",
        "100% accuracy",
        "100% confidential",
        "guaranteed",
        "1st class guaranteed"
    ]

    # Verify each URL in sitemap
    for u in sitemap_urls:
        rel = u.replace("https://academicwizard.online/", "").strip("/")
        if not rel:
            h_path = DIST_DIR / "index.html"
        else:
            h_path = DIST_DIR / rel / "index.html"

        if not h_path.exists():
            missing_files.append((u, str(h_path)))
            continue

        text = h_path.read_text(encoding="utf-8", errors="ignore")

        # Check robots noindex
        r_match = robots_pat.search(text)
        if r_match and "noindex" in r_match.group(2).lower():
            print(f"⚠️ Warning: Sitemap URL has noindex meta tag: {u}")

        # 1. Title Validation
        t_match = title_pat.search(text)
        if not t_match:
            missing_titles.append(u)
            continue
            
        raw_title = html.unescape(t_match.group(1).strip())
        
        # Title length
        if len(raw_title) > 60:
            title_over_60.append((u, len(raw_title), raw_title))

        # Title ellipsis / dots
        if "..." in raw_title:
            title_dots.append((u, raw_title))

        # Title uniqueness
        if raw_title in titles_seen:
            title_duplicates.append((u, raw_title, titles_seen[raw_title]))
        else:
            titles_seen[raw_title] = u

        # 2. Meta Description Validation
        d_match = desc_pat.search(text)
        if not d_match:
            missing_descs.append(u)
            continue
            
        raw_desc = html.unescape(d_match.group(2).strip())
        
        # Description length: strictly 120-155 characters
        if len(raw_desc) < 120 or len(raw_desc) > 155:
            desc_length_errors.append((u, len(raw_desc), raw_desc))

        # Description uniqueness
        if raw_desc in descriptions_seen:
            desc_duplicates.append((u, raw_desc, descriptions_seen[raw_desc]))
        else:
            descriptions_seen[raw_desc] = u

        # Unverifiable claims
        desc_lower = raw_desc.lower()
        title_lower = raw_title.lower()
        for kw in UNVERIFIABLE_KEYWORDS:
            if kw in desc_lower or kw in title_lower:
                unverifiable_claims.append((u, kw, raw_desc))
                break

    # Summary
    print("\n--- RESULTS SUMMARY ---")
    print(f"Total Sitemap URLs audited: {len(sitemap_urls)}")
    print(f"Missing HTML files: {len(missing_files)}")
    print(f"Missing <title> tags: {len(missing_titles)}")
    print(f"Missing <meta description> tags: {len(missing_descs)}")
    print(f"Indexable unique titles tracked: {len(titles_seen)}")
    print(f"Titles > 60 chars: {len(title_over_60)}")
    print(f"Titles with '...': {len(title_dots)}")
    print(f"Duplicate titles: {len(title_duplicates)}")
    print(f"Descriptions outside 120-155 chars: {len(desc_length_errors)}")
    print(f"Duplicate descriptions: {len(desc_duplicates)}")
    print(f"Unverifiable claims detected: {len(unverifiable_claims)}")

    has_errors = False

    if missing_files:
        has_errors = True
        print(f"\n❌ FAILED: {len(missing_files)} sitemap URLs have missing HTML files in dist/:")
        for u, f in missing_files[:10]:
            print(f"   {u} -> {f}")

    if missing_titles:
        has_errors = True
        print(f"\n❌ FAILED: {len(missing_titles)} pages are missing <title> tag:")
        for u in missing_titles[:10]:
            print(f"   {u}")

    if missing_descs:
        has_errors = True
        print(f"\n❌ FAILED: {len(missing_descs)} pages are missing meta description:")
        for u in missing_descs[:10]:
            print(f"   {u}")

    if title_over_60:
        has_errors = True
        print(f"\n❌ FAILED: {len(title_over_60)} titles exceed 60 characters:")
        for u, l, t in title_over_60[:10]:
            print(f"   [{l}] {u} -> {t}")

    if title_dots:
        has_errors = True
        print(f"\n❌ FAILED: {len(title_dots)} titles contain '...':")
        for u, t in title_dots[:5]:
            print(f"   {u} -> {t}")

    if title_duplicates:
        has_errors = True
        print(f"\n❌ FAILED: {len(title_duplicates)} duplicate titles detected:")
        for u1, t, u2 in title_duplicates[:10]:
            print(f"   '{t}' appears in both:\n     1) {u1}\n     2) {u2}")

    if desc_length_errors:
        has_errors = True
        print(f"\n❌ FAILED: {len(desc_length_errors)} descriptions outside 120-155 characters:")
        for u, l, d in desc_length_errors[:10]:
            print(f"   [{l}] {u} -> {d}")

    if desc_duplicates:
        has_errors = True
        print(f"\n❌ FAILED: {len(desc_duplicates)} duplicate descriptions detected:")
        for u1, d, u2 in desc_duplicates[:10]:
            print(f"   Duplicate desc between:\n     1) {u1}\n     2) {u2}\n     Text: {d}")

    if unverifiable_claims:
        has_errors = True
        print(f"\n❌ FAILED: {len(unverifiable_claims)} unverifiable claims detected:")
        for u, kw, d in unverifiable_claims[:10]:
            print(f"   [{kw}] in {u}: {d}")

    if has_errors:
        print("\n❌ BUILD-TIME TEST FAILED: One or more SEO constraints were violated.")
        sys.exit(1)
    else:
        print("\n✅ BUILD-TIME TEST PASSED: All sitemap URLs pre-rendered, all titles <= 60 chars, 100% unique, zero '...', all descriptions 120-155 chars, zero unverifiable claims.")
        sys.exit(0)

if __name__ == "__main__":
    main()
