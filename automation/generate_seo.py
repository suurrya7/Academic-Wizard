#!/usr/bin/env python3
"""
generate_seo.py — Academic Wizard SEO Automation (React version)

This script:
1. Dynamically generates public/sitemap.xml based on posts.json
2. Dynamically generates public/robots.txt
"""

import json
import logging
from datetime import datetime, timezone
from pathlib import Path

from site_config import SITE_NAME, absolute_url

SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent
PUBLIC_DIR = PROJECT_ROOT / "public"
DATA_DIR = PUBLIC_DIR / "data"
SITEMAP_PATH = PUBLIC_DIR / "sitemap.xml"
ROBOTS_PATH = PUBLIC_DIR / "robots.txt"
POSTS_JSON_PATH = DATA_DIR / "posts.json"

STATIC_PAGES = [
    {"path": "", "changefreq": "weekly", "priority": "1.0"},
    {"path": "services", "changefreq": "weekly", "priority": "0.9"},
    {"path": "about", "changefreq": "monthly", "priority": "0.8"},
    {"path": "faq", "changefreq": "monthly", "priority": "0.7"},
    {"path": "contact", "changefreq": "monthly", "priority": "0.8"},
    {"path": "blog", "changefreq": "daily", "priority": "0.9"},
    {"path": "privacy-policy", "changefreq": "yearly", "priority": "0.3"},
    {"path": "terms-of-service", "changefreq": "yearly", "priority": "0.3"},
]

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("generate_seo")

def generate_sitemap() -> None:
    PUBLIC_DIR.mkdir(parents=True, exist_ok=True)
    today = datetime.now(tz=timezone.utc).strftime("%Y-%m-%d")
    urls = []

    for page in STATIC_PAGES:
        loc = absolute_url(page["path"])
        urls.append(
            f"  <url>\n"
            f"    <loc>{loc}</loc>\n"
            f"    <lastmod>{today}</lastmod>\n"
            f"    <changefreq>{page['changefreq']}</changefreq>\n"
            f"    <priority>{page['priority']}</priority>\n"
            f"  </url>"
        )

    if POSTS_JSON_PATH.exists():
        try:
            posts = json.loads(POSTS_JSON_PATH.read_text(encoding="utf-8"))
            for post in posts:
                # the URL is now a react route: /blog/slug
                loc = absolute_url(f"blog/{post['slug']}")
                lastmod = post.get("date", today).split("T")[0]
                urls.append(
                    f"  <url>\n"
                    f"    <loc>{loc}</loc>\n"
                    f"    <lastmod>{lastmod}</lastmod>\n"
                    f"    <changefreq>weekly</changefreq>\n"
                    f"    <priority>0.7</priority>\n"
                    f"  </url>"
                )
        except Exception as exc:
            logger.error("Failed to read posts.json for sitemap: %s", exc)

    sitemap_xml = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + "\n".join(urls) + "\n"
        "</urlset>\n"
    )

    try:
        SITEMAP_PATH.write_text(sitemap_xml, encoding="utf-8")
        logger.info("✅ Generated sitemap.xml with %d URL(s)", len(urls))
    except Exception as exc:
        logger.error("Failed to write sitemap.xml: %s", exc)

def generate_robots_txt() -> None:
    PUBLIC_DIR.mkdir(parents=True, exist_ok=True)
    robots_content = (
        "User-agent: *\n"
        "Allow: /\n"
        "Disallow: /automation/\n"
        "Disallow: /.github/\n"
        "Allow: /blog/\n"
        "\n"
        "User-agent: GPTBot\n"
        "Allow: /\n"
        "\n"
        "User-agent: ClaudeBot\n"
        "Allow: /\n"
        "\n"
        "User-agent: PerplexityBot\n"
        "Allow: /\n"
        "\n"
        f"Sitemap: {absolute_url('sitemap.xml')}\n"
    )
    try:
        ROBOTS_PATH.write_text(robots_content, encoding="utf-8")
        logger.info("✅ Generated robots.txt")
    except Exception as exc:
        logger.error("Failed to write robots.txt: %s", exc)

def main() -> None:
    generate_sitemap()
    generate_robots_txt()

if __name__ == "__main__":
    main()
