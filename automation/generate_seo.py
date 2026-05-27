#!/usr/bin/env python3
"""
generate_seo.py — Academic Wizard SEO Automation

This script:
1. Scans all HTML files in blog/posts/ and injects SEO meta tags + JSON-LD
2. Dynamically generates public/sitemap.xml
3. Dynamically generates public/robots.txt
4. Updates data/posts.json with any newly discovered posts
"""

import os
import re
import json
import logging
from datetime import datetime, timezone
from pathlib import Path
from bs4 import BeautifulSoup

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
DOMAIN = "https://www.academicwizard.online"
SITE_NAME = "Academic Wizard"
AUTHOR_NAME = "Academic Wizard"
DEFAULT_IMAGE = f"{DOMAIN}/favicon.svg"

# Resolve project root — works both locally and in CI
SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent

BLOG_POSTS_DIR = PROJECT_ROOT / "blog" / "posts"
PUBLIC_DIR = PROJECT_ROOT / "public"
DATA_DIR = PROJECT_ROOT / "data"
SITEMAP_PATH = PUBLIC_DIR / "sitemap.xml"
ROBOTS_PATH = PUBLIC_DIR / "robots.txt"
POSTS_JSON_PATH = DATA_DIR / "posts.json"

# Static pages with their SEO attributes
STATIC_PAGES = [
    {"path": "/", "changefreq": "weekly", "priority": "1.0"},
    {"path": "/services", "changefreq": "weekly", "priority": "0.9"},
    {"path": "/about", "changefreq": "monthly", "priority": "0.8"},
    {"path": "/faq", "changefreq": "monthly", "priority": "0.7"},
    {"path": "/contact", "changefreq": "monthly", "priority": "0.8"},
    {"path": "/blog/", "changefreq": "daily", "priority": "0.9"},
]

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger("generate_seo")

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _get_file_mod_date(filepath: Path) -> str:
    """Return the file's last-modified date as YYYY-MM-DD."""
    try:
        mtime = filepath.stat().st_mtime
        return datetime.fromtimestamp(mtime, tz=timezone.utc).strftime("%Y-%m-%d")
    except OSError:
        return datetime.now(tz=timezone.utc).strftime("%Y-%m-%d")


def _extract_first_paragraph(soup: BeautifulSoup) -> str:
    """Extract the first meaningful paragraph from the HTML body."""
    body = soup.find("body")
    if not body:
        return ""
    for p in body.find_all("p"):
        text = p.get_text(strip=True)
        if len(text) > 20:  # skip very short / decorative paragraphs
            return text[:300]  # cap at 300 chars for meta description
    # Fallback: grab first 300 chars of body text
    body_text = body.get_text(strip=True)
    return body_text[:300] if body_text else ""


def _extract_keywords(title: str, description: str) -> str:
    """Generate basic keywords from the title and description."""
    # Combine title + description, extract meaningful words
    combined = f"{title} {description}"
    # Remove punctuation and lowercase
    words = re.findall(r"[a-zA-Z]{3,}", combined.lower())
    # Deduplicate while preserving order
    seen = set()
    unique = []
    for w in words:
        if w not in seen and w not in {"the", "and", "for", "that", "this", "with", "are", "was", "has", "its"}:
            seen.add(w)
            unique.append(w)
    # Add domain-specific keywords
    base_keywords = ["academic wizard", "assignment help", "essay writing", "academic help"]
    keywords = base_keywords + unique[:10]
    return ", ".join(keywords)


def _ensure_meta(soup: BeautifulSoup, head, name: str = None, property: str = None, content: str = ""):
    """Insert a <meta> tag if it doesn't already exist."""
    attrs = {}
    if name:
        attrs["name"] = name
        existing = head.find("meta", attrs={"name": name})
    elif property:
        attrs["property"] = property
        existing = head.find("meta", attrs={"property": property})
    else:
        return

    if existing:
        existing["content"] = content  # update content in case it changed
        return

    tag = soup.new_tag("meta", **attrs, content=content)
    head.append(tag)
    head.append("\n")


# ---------------------------------------------------------------------------
# 1. SEO Meta-Tag & JSON-LD Injection
# ---------------------------------------------------------------------------

def inject_seo_tags(filepath: Path) -> bool:
    """
    Parse an HTML file, inject/update SEO meta tags and JSON-LD.
    Returns True if the file was modified.
    """
    try:
        raw_html = filepath.read_text(encoding="utf-8")
    except Exception as exc:
        logger.error("Failed to read %s: %s", filepath, exc)
        return False

    soup = BeautifulSoup(raw_html, "lxml")

    # Ensure <head> exists
    head = soup.find("head")
    if not head:
        html_tag = soup.find("html")
        if not html_tag:
            html_tag = soup.new_tag("html")
            soup.append(html_tag)
        head = soup.new_tag("head")
        html_tag.insert(0, head)

    # --- Extract title & description ---
    title_tag = soup.find("title")
    title = title_tag.get_text(strip=True) if title_tag else filepath.stem.replace("-", " ").title()
    description = _extract_first_paragraph(soup)
    if not description:
        description = f"{title} — expert tips and guidance from {SITE_NAME}."
    keywords = _extract_keywords(title, description)

    # Build the canonical URL
    post_filename = filepath.name
    canonical_url = f"{DOMAIN}/blog/posts/{post_filename}"

    # --- Inject meta tags ---
    _ensure_meta(soup, head, name="description", content=description)
    _ensure_meta(soup, head, name="keywords", content=keywords)

    # Open Graph tags
    _ensure_meta(soup, head, property="og:title", content=title)
    _ensure_meta(soup, head, property="og:description", content=description)
    _ensure_meta(soup, head, property="og:url", content=canonical_url)
    _ensure_meta(soup, head, property="og:type", content="article")
    _ensure_meta(soup, head, property="og:image", content=DEFAULT_IMAGE)

    # Twitter Card tags
    _ensure_meta(soup, head, name="twitter:card", content="summary_large_image")
    _ensure_meta(soup, head, name="twitter:title", content=title)
    _ensure_meta(soup, head, name="twitter:description", content=description)

    # Canonical URL
    if not head.find("link", attrs={"rel": "canonical"}):
        canonical_tag = soup.new_tag("link", rel="canonical", href=canonical_url)
        head.append(canonical_tag)
        head.append("\n")

    # --- Inject JSON-LD (Article schema) ---
    mod_date = _get_file_mod_date(filepath)
    jsonld_data = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title,
        "description": description,
        "author": {
            "@type": "Organization",
            "name": AUTHOR_NAME,
        },
        "publisher": {
            "@type": "Organization",
            "name": SITE_NAME,
            "logo": {
                "@type": "ImageObject",
                "url": DEFAULT_IMAGE,
            },
        },
        "datePublished": mod_date,
        "dateModified": mod_date,
        "url": canonical_url,
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": canonical_url,
        },
    }

    # Check if JSON-LD already exists
    existing_jsonld = head.find("script", attrs={"type": "application/ld+json"})
    jsonld_string = json.dumps(jsonld_data, indent=2, ensure_ascii=False)
    if existing_jsonld:
        existing_jsonld.string = jsonld_string
    else:
        script_tag = soup.new_tag("script", type="application/ld+json")
        script_tag.string = jsonld_string
        head.append(script_tag)
        head.append("\n")

    # --- Write the updated HTML ---
    new_html = str(soup)
    if new_html.strip() != raw_html.strip():
        try:
            filepath.write_text(str(soup), encoding="utf-8")
            logger.info("✅ Injected SEO tags into %s", filepath.name)
            return True
        except Exception as exc:
            logger.error("Failed to write %s: %s", filepath, exc)
            return False
    else:
        logger.info("⏭️  No SEO changes needed for %s", filepath.name)
        return False


def process_all_posts() -> list[Path]:
    """Scan blog/posts/ and inject SEO tags into every HTML file."""
    if not BLOG_POSTS_DIR.exists():
        logger.warning("Blog posts directory not found: %s", BLOG_POSTS_DIR)
        BLOG_POSTS_DIR.mkdir(parents=True, exist_ok=True)
        return []

    html_files = sorted(BLOG_POSTS_DIR.glob("*.html"))
    if not html_files:
        logger.info("No HTML files found in %s", BLOG_POSTS_DIR)
        return []

    logger.info("Found %d HTML file(s) in blog/posts/", len(html_files))
    modified = []
    for html_file in html_files:
        if inject_seo_tags(html_file):
            modified.append(html_file)

    return modified


# ---------------------------------------------------------------------------
# 2. Dynamic Sitemap Generation
# ---------------------------------------------------------------------------

def generate_sitemap() -> None:
    """Generate public/sitemap.xml from static pages + discovered blog posts."""
    PUBLIC_DIR.mkdir(parents=True, exist_ok=True)
    today = datetime.now(tz=timezone.utc).strftime("%Y-%m-%d")

    urls: list[str] = []

    # Static pages
    for page in STATIC_PAGES:
        loc = f"{DOMAIN}{page['path']}"
        urls.append(
            f"  <url>\n"
            f"    <loc>{loc}</loc>\n"
            f"    <lastmod>{today}</lastmod>\n"
            f"    <changefreq>{page['changefreq']}</changefreq>\n"
            f"    <priority>{page['priority']}</priority>\n"
            f"  </url>"
        )

    # Blog posts
    if BLOG_POSTS_DIR.exists():
        for html_file in sorted(BLOG_POSTS_DIR.glob("*.html")):
            loc = f"{DOMAIN}/blog/posts/{html_file.name}"
            lastmod = _get_file_mod_date(html_file)
            urls.append(
                f"  <url>\n"
                f"    <loc>{loc}</loc>\n"
                f"    <lastmod>{lastmod}</lastmod>\n"
                f"    <changefreq>weekly</changefreq>\n"
                f"    <priority>0.7</priority>\n"
                f"  </url>"
            )

    sitemap_xml = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + "\n".join(urls) + "\n"
        "</urlset>\n"
    )

    try:
        SITEMAP_PATH.write_text(sitemap_xml, encoding="utf-8")
        total_urls = len(urls)
        logger.info("✅ Generated sitemap.xml with %d URL(s)", total_urls)
    except Exception as exc:
        logger.error("Failed to write sitemap.xml: %s", exc)


# ---------------------------------------------------------------------------
# 3. Dynamic robots.txt Generation
# ---------------------------------------------------------------------------

def generate_robots_txt() -> None:
    """Generate public/robots.txt with proper directives."""
    PUBLIC_DIR.mkdir(parents=True, exist_ok=True)

    robots_content = (
        "User-agent: *\n"
        "Allow: /\n"
        "Disallow: /automation/\n"
        "Disallow: /.github/\n"
        "\n"
        f"Sitemap: {DOMAIN}/sitemap.xml\n"
    )

    try:
        ROBOTS_PATH.write_text(robots_content, encoding="utf-8")
        logger.info("✅ Generated robots.txt")
    except Exception as exc:
        logger.error("Failed to write robots.txt: %s", exc)


# ---------------------------------------------------------------------------
# 4. Update data/posts.json
# ---------------------------------------------------------------------------

def update_posts_json() -> None:
    """
    Scan blog/posts/ for HTML files and ensure every post is listed in
    data/posts.json. Existing entries are preserved; new ones are appended.
    """
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    # Load existing posts
    existing_posts: list[dict] = []
    if POSTS_JSON_PATH.exists():
        try:
            existing_posts = json.loads(POSTS_JSON_PATH.read_text(encoding="utf-8"))
            if not isinstance(existing_posts, list):
                logger.warning("posts.json is not a list — resetting.")
                existing_posts = []
        except (json.JSONDecodeError, Exception) as exc:
            logger.warning("Could not parse posts.json, starting fresh: %s", exc)
            existing_posts = []

    # Build a set of already-known URLs for fast lookup
    known_urls = {p.get("url", "") for p in existing_posts}

    # Discover posts from the filesystem
    if not BLOG_POSTS_DIR.exists():
        logger.info("No blog/posts/ directory — skipping posts.json update.")
        return

    new_count = 0
    for html_file in sorted(BLOG_POSTS_DIR.glob("*.html")):
        relative_url = f"posts/{html_file.name}"
        if relative_url in known_urls:
            continue

        # Extract metadata from the file
        try:
            soup = BeautifulSoup(html_file.read_text(encoding="utf-8"), "lxml")
        except Exception:
            continue

        title_tag = soup.find("title")
        title = title_tag.get_text(strip=True) if title_tag else html_file.stem.replace("-", " ").title()
        excerpt = _extract_first_paragraph(soup) or f"Read our article on {title}."
        mod_date = _get_file_mod_date(html_file)

        existing_posts.append({
            "title": title,
            "url": relative_url,
            "date": mod_date,
            "excerpt": excerpt[:200],
        })
        new_count += 1

    # Write back
    try:
        POSTS_JSON_PATH.write_text(
            json.dumps(existing_posts, indent=2, ensure_ascii=False) + "\n",
            encoding="utf-8",
        )
        if new_count:
            logger.info("✅ Added %d new post(s) to posts.json (total: %d)", new_count, len(existing_posts))
        else:
            logger.info("⏭️  posts.json is up-to-date (%d post(s))", len(existing_posts))
    except Exception as exc:
        logger.error("Failed to write posts.json: %s", exc)


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    logger.info("=" * 60)
    logger.info("Academic Wizard — SEO Automation Starting")
    logger.info("=" * 60)
    logger.info("Project root: %s", PROJECT_ROOT)

    # Step 1: Inject SEO meta tags + JSON-LD into all blog posts
    logger.info("-" * 40)
    logger.info("Step 1: Injecting SEO meta tags & JSON-LD")
    modified_files = process_all_posts()
    logger.info("Modified %d file(s)", len(modified_files))

    # Step 2: Generate sitemap.xml
    logger.info("-" * 40)
    logger.info("Step 2: Generating sitemap.xml")
    generate_sitemap()

    # Step 3: Generate robots.txt
    logger.info("-" * 40)
    logger.info("Step 3: Generating robots.txt")
    generate_robots_txt()

    # Step 4: Update posts.json
    logger.info("-" * 40)
    logger.info("Step 4: Updating data/posts.json")
    update_posts_json()

    logger.info("=" * 60)
    logger.info("SEO Automation Complete ✅")
    logger.info("=" * 60)


if __name__ == "__main__":
    main()
