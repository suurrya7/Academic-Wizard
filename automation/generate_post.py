#!/usr/bin/env python3
import argparse
import datetime as dt
import html
import json
import os
import re
import sys
from pathlib import Path

from site_config import SITE_NAME, absolute_url


SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent
POSTS_DIR = PROJECT_ROOT / "blog" / "posts"
DATA_DIR = PROJECT_ROOT / "data"
POSTS_JSON = DATA_DIR / "posts.json"
TEMPLATE_FILE = SCRIPT_DIR / "blog_post_template.html"
POSTS_PER_RUN = int(os.getenv("POSTS_PER_RUN", "4"))
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")

CATEGORIES = {
    "assignment-help": "Assignment Help",
    "essay-writing": "Essay Writing",
    "literature-review": "Literature Review",
    "dissertation": "Dissertation",
    "research": "Research Support",
    "editing": "Editing and Proofreading",
    "study-guidance": "Study Guidance",
}

NICHE_KEYWORDS = [
    "assignment help",
    "academic help",
    "assignment writing support",
    "essay writing guidance",
    "literature review writing",
    "dissertation help",
    "research paper support",
    "academic editing",
    "proofreading for students",
    "university study guidance",
]


def slugify(value: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    return slug[:90].strip("-") or "academic-guide"


def load_posts() -> list[dict]:
    if not POSTS_JSON.exists():
        return []
    try:
        data = json.loads(POSTS_JSON.read_text(encoding="utf-8"))
        return data if isinstance(data, list) else []
    except json.JSONDecodeError:
        return []


def save_posts(posts: list[dict]) -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    POSTS_JSON.write_text(json.dumps(posts, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def configure_model():
    if not GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY is required unless --dry-run is used.")
    import google.generativeai as genai

    genai.configure(api_key=GEMINI_API_KEY)
    return genai.GenerativeModel(GEMINI_MODEL)


def parse_json_response(text: str):
    cleaned = text.strip()
    if cleaned.startswith("```json"):
        cleaned = cleaned[7:]
    elif cleaned.startswith("```"):
        cleaned = cleaned[3:]
    if cleaned.endswith("```"):
        cleaned = cleaned[:-3]
    return json.loads(cleaned.strip())


def generate_keyword_briefs(model, existing_posts: list[dict], count: int) -> list[dict]:
    used_titles = [post.get("title", "") for post in existing_posts]
    used_slugs = [post.get("slug", "") for post in existing_posts]
    today = dt.datetime.now(dt.timezone.utc).strftime("%Y-%m-%d")

    prompt = f"""
You are planning daily SEO content for {SITE_NAME}, an ethical academic support service.
Create {count} fresh long-tail blog keyword briefs for {today}.

Core niches to rotate:
{", ".join(NICHE_KEYWORDS)}

Avoid these existing titles:
{json.dumps(used_titles[-200:], ensure_ascii=False)}

Avoid these existing slugs:
{json.dumps(used_slugs[-200:], ensure_ascii=False)}

Return only valid JSON as an array of objects. Each object must have:
- title: practical blog title, 50-75 characters
- primaryKeyword: long-tail keyword
- secondaryKeywords: array of 4 related keywords
- category: one of {list(CATEGORIES.keys())}
- searchIntent: one sentence describing the reader need
- excerpt: 130-155 character meta description

Rules:
- Focus on ethical guidance, editing, research support, planning, and study help.
- Do not promise guaranteed grades.
- Do not frame content as contract cheating or submitting purchased work.
- Prefer topics useful to UK, USA, Australia, Ireland, Canada, and India students.
"""
    response = model.generate_content(prompt)
    briefs = parse_json_response(response.text)
    if not isinstance(briefs, list):
        raise ValueError("Gemini keyword brief response was not a JSON array.")
    return briefs[:count]


def dry_run_briefs(existing_posts: list[dict], count: int) -> list[dict]:
    today = dt.datetime.now(dt.timezone.utc).strftime("%Y %B")
    candidates = [
        {
            "title": f"How to Plan Assignment Writing Support in {today}",
            "primaryKeyword": "assignment writing support for university students",
            "secondaryKeywords": ["assignment help", "academic planning", "university writing", "study support"],
            "category": "assignment-help",
            "searchIntent": "Students need a practical way to plan assignment support ethically.",
            "excerpt": "Learn how to plan ethical assignment writing support with clear research, structure, editing, and deadline steps.",
        },
        {
            "title": "Literature Review Writing Guide for Better Research",
            "primaryKeyword": "literature review writing help",
            "secondaryKeywords": ["literature review", "research gaps", "source synthesis", "academic research"],
            "category": "literature-review",
            "searchIntent": "Students need help turning sources into a structured literature review.",
            "excerpt": "Use this literature review writing guide to organize sources, compare evidence, and build a stronger research argument.",
        },
        {
            "title": "Essay Writing Help: From Question Analysis to Editing",
            "primaryKeyword": "essay writing help for students",
            "secondaryKeywords": ["essay planning", "academic writing", "essay editing", "thesis statement"],
            "category": "essay-writing",
            "searchIntent": "Students want a full essay process from prompt analysis to final edit.",
            "excerpt": "Improve essay writing with a clear workflow for question analysis, outlining, paragraphs, citations, and final editing.",
        },
        {
            "title": "Research Paper Support for Clearer Academic Arguments",
            "primaryKeyword": "research paper support",
            "secondaryKeywords": ["research paper help", "academic argument", "citation support", "research structure"],
            "category": "research",
            "searchIntent": "Students need support making a research paper more focused and evidence based.",
            "excerpt": "Build clearer research papers with practical support for topic focus, evidence, argument flow, citations, and revision.",
        },
    ]
    used = {post.get("slug") for post in existing_posts}
    result = []
    for item in candidates:
        if slugify(item["title"]) not in used:
            result.append(item)
        if len(result) == count:
            break
    return result


def generate_article_content(model, brief: dict) -> str:
    prompt = f"""
You are an expert academic writing coach and SEO editor for {SITE_NAME}.
Write a helpful, ethical, SEO-optimized blog article for this brief:
{json.dumps(brief, ensure_ascii=False)}

Output rules:
- Return only inner HTML for an <article>; no markdown, no <html>, no <head>, no <body>.
- Start with an introductory paragraph, not a title.
- Use <h2>, <h3>, <p>, <ul>, <li>, and <strong>.
- Length: 1100-1500 words.
- Include practical steps students can apply themselves.
- Mention {SITE_NAME} naturally once near the end as 24/7 academic guidance, editing, and research support.
- Keep the content ethical: do not encourage plagiarism, contract cheating, or submitting work the student did not author.
"""
    response = model.generate_content(prompt)
    content = response.text.strip()
    if content.startswith("```html"):
        content = content[7:]
    elif content.startswith("```"):
        content = content[3:]
    if content.endswith("```"):
        content = content[:-3]
    return content.strip()


def dry_run_content(brief: dict) -> str:
    keyword = html.escape(brief["primaryKeyword"])
    return f"""
<p>This draft preview shows how a full article would target <strong>{keyword}</strong> while keeping the advice practical, ethical, and student-focused.</p>
<h2>Understand the task before writing</h2>
<p>Students should begin by reading the brief carefully, identifying the assessment criteria, and breaking the work into research, planning, writing, editing, and referencing stages.</p>
<h2>Build an evidence-led structure</h2>
<ul><li>Clarify the question.</li><li>Group sources by theme.</li><li>Plan paragraphs around evidence and analysis.</li><li>Leave time for proofreading.</li></ul>
<h2>Use support ethically</h2>
<p>Academic support works best when it improves confidence, research quality, clarity, and editing while preserving the student's own learning and authorship.</p>
""".strip()


def build_meta(brief: dict) -> dict:
    now = dt.datetime.now(dt.timezone.utc)
    title = str(brief["title"]).strip()
    slug = slugify(title)
    keywords = [brief.get("primaryKeyword", ""), *brief.get("secondaryKeywords", [])]
    keywords = [str(keyword).strip() for keyword in keywords if str(keyword).strip()]
    category = brief.get("category") if brief.get("category") in CATEGORIES else "assignment-help"
    excerpt = str(brief.get("excerpt", "")).strip()[:170]
    if not excerpt:
        excerpt = f"Practical academic guidance for {brief.get('primaryKeyword', title)}."

    return {
        "title": title,
        "slug": slug,
        "excerpt": excerpt,
        "keywords": keywords,
        "primaryKeyword": brief.get("primaryKeyword", ""),
        "category": category,
        "categoryLabel": CATEGORIES[category],
        "date": now.isoformat(),
        "readingTime": 7,
        "url": f"blog/posts/{slug}.html",
    }


def uniquify_meta(meta: dict, existing_posts: list[dict], created_slugs: set[str]) -> dict:
    used_slugs = {post.get("slug") for post in existing_posts} | created_slugs
    used_urls = {post.get("url") for post in existing_posts}
    base_slug = meta["slug"]
    slug = base_slug
    suffix = 2
    while slug in used_slugs or f"blog/posts/{slug}.html" in used_urls:
        slug = f"{base_slug}-{suffix}"
        suffix += 1
    meta["slug"] = slug
    meta["url"] = f"blog/posts/{slug}.html"
    created_slugs.add(slug)
    return meta


def generate_json_ld(meta: dict) -> str:
    payload = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": meta["title"],
        "description": meta["excerpt"],
        "author": {"@type": "Organization", "name": SITE_NAME},
        "publisher": {
            "@type": "Organization",
            "name": SITE_NAME,
            "logo": {"@type": "ImageObject", "url": absolute_url("favicon.svg")},
        },
        "datePublished": meta["date"],
        "dateModified": meta["date"],
        "mainEntityOfPage": {"@type": "WebPage", "@id": absolute_url(meta["url"])},
    }
    return '<script type="application/ld+json">\n' + json.dumps(payload, indent=2) + "\n</script>"


def render_post(meta: dict, content: str) -> str:
    template = TEMPLATE_FILE.read_text(encoding="utf-8")
    display_date = dt.datetime.fromisoformat(meta["date"]).strftime("%B %d, %Y")
    keywords = ", ".join(meta.get("keywords", []))
    replacements = {
        "{{TITLE}}": meta["title"],
        "{{DESCRIPTION}}": meta["excerpt"],
        "{{KEYWORDS}}": keywords,
        "{{SLUG}}": meta["slug"],
        "{{DATE}}": display_date,
        "{{READING_TIME}}": str(meta["readingTime"]),
        "{{JSON_LD}}": generate_json_ld(meta),
        "{{CONTENT}}": content,
        "{{CANONICAL_URL}}": absolute_url(meta["url"]),
        "{{SITE_URL}}": absolute_url(""),
        "{{BLOG_URL}}": absolute_url("blog/"),
        "{{SERVICES_URL}}": absolute_url("services"),
        "{{CONTACT_URL}}": absolute_url("contact"),
    }
    rendered = template
    for token, value in replacements.items():
        rendered = rendered.replace(token, value)
    return rendered


def generate_posts(count: int, dry_run: bool = False) -> list[dict]:
    POSTS_DIR.mkdir(parents=True, exist_ok=True)
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    existing_posts = load_posts()
    model = None if dry_run else configure_model()
    briefs = dry_run_briefs(existing_posts, count) if dry_run else generate_keyword_briefs(model, existing_posts, count)
    created = []
    created_slugs = set()

    for brief in briefs:
        meta = uniquify_meta(build_meta(brief), existing_posts, created_slugs)
        content = dry_run_content(brief) if dry_run else generate_article_content(model, brief)
        if dry_run:
            print(f"[dry-run] would create {meta['url']} for keyword: {meta.get('primaryKeyword')}")
            created.append(meta)
            continue

        post_path = POSTS_DIR / f"{meta['slug']}.html"
        post_path.write_text(render_post(meta, content), encoding="utf-8")
        created.append(meta)
        print(f"Created {post_path.relative_to(PROJECT_ROOT)}")

    if not dry_run and created:
        save_posts(created + existing_posts)
        print(f"Updated {POSTS_JSON.relative_to(PROJECT_ROOT)} with {len(created)} new posts.")

    return created


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate daily Academic Wizard blog posts.")
    parser.add_argument("--count", type=int, default=POSTS_PER_RUN, help="Number of posts to generate.")
    parser.add_argument("--dry-run", action="store_true", help="Validate generation flow without writing files or calling Gemini.")
    args = parser.parse_args()

    try:
        created = generate_posts(max(1, args.count), dry_run=args.dry_run)
    except Exception as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 1

    if not created:
        print("No new posts were generated.")
        return 0

    print(f"Generated {len(created)} post plan(s)." if args.dry_run else f"Generated {len(created)} post(s).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
