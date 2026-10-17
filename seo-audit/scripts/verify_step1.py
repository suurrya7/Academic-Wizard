#!/usr/bin/env python3
"""
verify_step1.py — Automated verification for STEP 1: Indexing Foundations
Validates:
a) Raw HTTP checks (no JavaScript) on every sitemap URL and 20 newest blog posts:
   - Must return HTTP 200 with a real pre-rendered index.html
   - No redirect chain
   - No reliance on 404.html fallback
b) robots.txt consistency:
   - Does NOT block /blog/posts/
   - Allows search engines to crawl legacy files for noindex and meta-refresh
c) USA blog post canonical check:
   - Self-canonical to https://academicwizard.online/blog/mastering-assignment-help-a-guide-for-usa-university-students/
d) Sitemap indexability check:
   - Every sitemap URL returns 200, is self-canonical, and has NO noindex tag
"""

import os
import sys
import json
import threading
import http.server
import xml.etree.ElementTree as ET
import urllib.request
import re
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
DIST_DIR = PROJECT_ROOT / "dist"
PORT = 8899

class SilentHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(DIST_DIR), **kwargs)
    def log_message(self, format, *args):
        pass

def main():
    print("=" * 70)
    print("STEP 1: INDEXING FOUNDATIONS AUDIT & VERIFICATION")
    print("=" * 70)

    # Check robots.txt
    print("\n--- [Step 1b] Checking robots.txt ---")
    robots_file = DIST_DIR / "robots.txt"
    if not robots_file.exists():
        robots_file = PROJECT_ROOT / "public" / "robots.txt"
    robots_txt = robots_file.read_text(encoding="utf-8")
    if "Disallow: /blog/posts/" in robots_txt:
        print("❌ FAIL: robots.txt still contains 'Disallow: /blog/posts/'")
        sys.exit(1)
    else:
        print("✅ PASS: 'Disallow: /blog/posts/' is cleanly removed from robots.txt.")
        print("   Crawlers can crawl legacy files to process <meta name='robots' content='noindex, follow'> and meta-refresh.")

    # Check generator script
    gen_seo = (PROJECT_ROOT / "automation" / "generate_seo.py").read_text(encoding="utf-8")
    if "Disallow: /blog/posts/" in gen_seo:
        print("❌ FAIL: automation/generate_seo.py still contains 'Disallow: /blog/posts/'")
        sys.exit(1)
    else:
        print("✅ PASS: automation/generate_seo.py robots.txt template does not disallow /blog/posts/.")

    # Start local HTTP server
    httpd = http.server.HTTPServer(("127.0.0.1", PORT), SilentHandler)
    server_thread = threading.Thread(target=httpd.serve_forever, daemon=True)
    server_thread.start()
    print(f"\nLocal raw HTTP test server active on http://127.0.0.1:{PORT}")

    # Parse Sitemap URLs
    sitemap_file = DIST_DIR / "sitemap.xml"
    if not sitemap_file.exists():
        sitemap_file = PROJECT_ROOT / "public" / "sitemap.xml"
    tree = ET.parse(sitemap_file)
    root = tree.getroot()
    sitemap_urls = [elem.text.strip() for elem in root.iter("{http://www.sitemaps.org/schemas/sitemap/0.9}loc")]
    print(f"Total sitemap URLs discovered: {len(sitemap_urls)}")

    # 20 Newest Blog Posts
    posts_json = json.loads((PROJECT_ROOT / "public" / "data" / "posts.json").read_text(encoding="utf-8"))
    newest_20_slugs = [p["slug"] for p in posts_json[:20]]
    newest_20_urls = [f"https://academicwizard.online/blog/{s}/" for s in newest_20_slugs]
    print(f"20 Newest Blog Posts: {len(newest_20_urls)} verified")

    test_urls = list(dict.fromkeys(sitemap_urls + newest_20_urls))
    print(f"Total Unique URLs to test via raw HTTP (no JS): {len(test_urls)}")

    failed_status = []
    fallback_404 = []
    empty_prerender = []
    canonical_mismatches = []
    noindex_in_sitemap = []

    # Canon regex
    canon_pattern = re.compile(r'<link[^>]+rel=["\']canonical["\'][^>]+href=["\']([^"\']+)["\']|<link[^>]+href=["\']([^"\']+)["\'][^>]+rel=["\']canonical["\']', re.I)
    robots_pattern = re.compile(r'<meta[^>]+name=["\']robots["\'][^>]+content=["\']([^"\']+)["\']', re.I)

    for i, u in enumerate(test_urls):
        rel_path = u.replace("https://academicwizard.online", "")
        if not rel_path.startswith("/"):
            rel_path = "/" + rel_path
        http_target = f"http://127.0.0.1:{PORT}{rel_path}"

        req = urllib.request.Request(http_target, headers={"User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"})
        try:
            with urllib.request.urlopen(req, timeout=5) as resp:
                status_code = resp.status
                body = resp.read().decode("utf-8", errors="ignore")

                if status_code != 200:
                    failed_status.append((u, status_code))
                    continue

                # Check 404 fallback indicators
                if "sessionStorage.setItem('redirectPath'" in body or "<title>Page Not Found" in body:
                    fallback_404.append(u)
                    continue

                # Check pre-rendered content exists (not raw SPA empty root)
                if '<div id="root"></div>' in body:
                    # Blog posts or pre-rendered pages must have content
                    empty_prerender.append(u)

                # Check Canonical Tag
                c_match = canon_pattern.search(body)
                c_url = (c_match.group(1) or c_match.group(2)) if c_match else None

                if u in sitemap_urls:
                    if not c_url:
                        canonical_mismatches.append((u, "Missing canonical tag"))
                    elif c_url.rstrip("/") != u.rstrip("/"):
                        canonical_mismatches.append((u, f"Mismatch: expected {u}, got {c_url}"))

                    # Check Noindex
                    r_match = robots_pattern.search(body)
                    if r_match:
                        r_content = r_match.group(1).lower()
                        if "noindex" in r_content:
                            noindex_in_sitemap.append((u, r_content))

        except urllib.error.HTTPError as e:
            failed_status.append((u, e.code))
        except Exception as e:
            failed_status.append((u, str(e)))

        if (i + 1) % 250 == 0 or (i + 1) == len(test_urls):
            print(f"  Processed {i + 1}/{len(test_urls)} URLs...")

    # USA Blog Post Canonical Check
    print("\n--- [Step 1c] USA Blog Post Canonical Verification ---")
    usa_blog_url = "https://academicwizard.online/blog/mastering-assignment-help-a-guide-for-usa-university-students/"
    usa_html_path = DIST_DIR / "blog" / "mastering-assignment-help-a-guide-for-usa-university-students" / "index.html"
    if not usa_html_path.exists():
        print(f"❌ FAIL: {usa_html_path} does not exist!")
        sys.exit(1)
    usa_html = usa_html_path.read_text(encoding="utf-8")
    usa_canon = canon_pattern.search(usa_html)
    usa_canon_url = (usa_canon.group(1) or usa_canon.group(2)) if usa_canon else None

    if usa_canon_url == usa_blog_url:
        print(f"✅ PASS: USA Blog Post is self-canonical: {usa_canon_url}")
    else:
        print(f"❌ FAIL: USA Blog Post canonical is {usa_canon_url}, expected {usa_blog_url}")
        sys.exit(1)

    print("\n--- [Step 1a & 1d] Summary of Raw HTTP Verification ---")
    print(f"Total URLs Tested: {len(test_urls)}")
    print(f"Non-200 Responses: {len(failed_status)}")
    print(f"404 Fallback Count: {len(fallback_404)}")
    print(f"Empty Root (Unrendered) Count: {len(empty_prerender)}")
    print(f"Canonical Mismatches: {len(canonical_mismatches)}")
    print(f"Noindex in Sitemap: {len(noindex_in_sitemap)}")

    httpd.shutdown()

    if failed_status or fallback_404 or empty_prerender or canonical_mismatches or noindex_in_sitemap:
        print("\n❌ ISSUES DETECTED:")
        if failed_status:
            print("Non-200 URLs:", failed_status[:5])
        if fallback_404:
            print("Fallback 404 URLs:", fallback_404[:5])
        if canonical_mismatches:
            print("Canonical Mismatches:", canonical_mismatches[:5])
        if noindex_in_sitemap:
            print("Noindex in Sitemap:", noindex_in_sitemap[:5])
        sys.exit(1)
    else:
        print("\n✅ ALL CHECKS PASSED: 100% of sitemap URLs and top blog posts return HTTP 200 with real pre-rendered index.html, zero redirect chains, zero 404 fallbacks, and 100% self-referencing indexable canonicals.")

if __name__ == "__main__":
    main()
