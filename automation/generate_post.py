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
POSTS_DIR = PROJECT_ROOT / "public" / "blog" / "posts"
DATA_DIR = PROJECT_ROOT / "public" / "data"
POSTS_JSON = DATA_DIR / "posts.json"
POSTS_PER_RUN = int(os.getenv("POSTS_PER_RUN", "4"))
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "").strip() or "gemini-2.5-flash"

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

TARGET_COUNTRIES = [
    "UK", "USA", "Australia", "Canada", "India", "Singapore", "Ireland", "Germany"
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
    from google import genai

    return genai.Client(api_key=GEMINI_API_KEY)


def parse_json_response(text: str):
    """Extract a JSON object from Gemini's response.
    Handles cases where the model wraps the JSON in markdown fences or adds extra text.
    """
    cleaned = text.strip()
    # Remove markdown code fences if present
    if cleaned.startswith("```json"):
        cleaned = cleaned[7:]
    elif cleaned.startswith("```"):
        cleaned = cleaned[3:]
    if cleaned.endswith("```"):
        cleaned = cleaned[:-3]
    # Find the first '{' and the matching closing '}'
    start = cleaned.find('{')
    end = cleaned.rfind('}')
    if start != -1 and end != -1 and end > start:
        json_str = cleaned[start:end+1]
    else:
        json_str = cleaned  # fallback to the whole cleaned string
    return json.loads(json_str)



def generate_keyword_briefs(model, existing_posts: list[dict], count: int) -> list[dict]:
    used_titles = [post.get("title", "") for post in existing_posts]
    used_slugs = [post.get("slug", "") for post in existing_posts]
    today = dt.datetime.now(dt.timezone.utc).strftime("%Y-%m-%d")

    prompt = f"""
You are planning daily SEO content for {SITE_NAME}, an ethical academic support service.
Create {count} fresh long-tail blog keyword briefs for {today}.

Crucially, you must assign a TARGET COUNTRY to each brief by rotating through these options: {", ".join(TARGET_COUNTRIES)}. Focus the keyword intent specifically on that region's academic market (e.g. "university assignment help UK", "essay editing Australia").

Core niches to rotate:
{", ".join(NICHE_KEYWORDS)}

Avoid these existing titles:
{json.dumps(used_titles[-200:], ensure_ascii=False)}

Avoid these existing slugs:
{json.dumps(used_slugs[-200:], ensure_ascii=False)}

Return only valid JSON as an array of objects. Each object must have:
- title: practical blog title, 50-75 characters
- primaryKeyword: long-tail keyword containing the target country context if appropriate
- secondaryKeywords: array of 4 related keywords
- category: one of {list(CATEGORIES.keys())}
- searchIntent: one sentence describing the reader need in the target country
- excerpt: 130-155 character meta description
- targetCountry: the country this brief targets (from the list provided)

Rules:
- Focus on ethical guidance, editing, research support, planning, and study help.
- Do not promise guaranteed grades.
- Do not frame content as contract cheating or submitting purchased work.
"""
    response = model.models.generate_content(
        model=GEMINI_MODEL, 
        contents=prompt,
        config={"response_mime_type": "application/json"}
    )
    briefs = parse_json_response(response.text)
    if not isinstance(briefs, list):
        raise ValueError("Gemini keyword brief response was not a JSON array.")
    return briefs[:count]


def dry_run_briefs(existing_posts: list[dict], count: int) -> list[dict]:
    today = dt.datetime.now(dt.timezone.utc).strftime("%Y %B")
    candidates = [
        {
            "title": f"How to Plan Assignment Writing Support in the UK",
            "primaryKeyword": "assignment writing support for university students uk",
            "secondaryKeywords": ["assignment help uk", "academic planning", "university writing london", "study support"],
            "category": "assignment-help",
            "searchIntent": "UK students need a practical way to plan assignment support ethically.",
            "excerpt": "Learn how to plan ethical assignment writing support in the UK with clear research, structure, editing, and deadline steps.",
            "targetCountry": "UK"
        },
        {
            "title": "Literature Review Writing Guide for Australian Students",
            "primaryKeyword": "literature review writing help australia",
            "secondaryKeywords": ["literature review", "research gaps sydney", "source synthesis", "academic research au"],
            "category": "literature-review",
            "searchIntent": "Australian students need help turning sources into a structured literature review.",
            "excerpt": "Use this literature review writing guide to organize sources, compare evidence, and build a stronger research argument in Australia.",
            "targetCountry": "Australia"
        },
        {
            "title": "US College Essay Writing Help: From Question Analysis to Editing",
            "primaryKeyword": "essay writing help for college students us",
            "secondaryKeywords": ["essay planning", "academic writing", "essay editing usa", "thesis statement"],
            "category": "essay-writing",
            "searchIntent": "US students want a full essay process from prompt analysis to final edit.",
            "excerpt": "Improve essay writing with a clear workflow for question analysis, outlining, paragraphs, citations, and final editing for US colleges.",
            "targetCountry": "USA"
        },
        {
            "title": "Research Paper Support in India: Clearer Academic Arguments",
            "primaryKeyword": "research paper support india",
            "secondaryKeywords": ["research paper help", "academic argument", "citation support", "research structure in"],
            "category": "research",
            "searchIntent": "Indian students need support making a research paper more focused and evidence based.",
            "excerpt": "Build clearer research papers with practical support for topic focus, evidence, argument flow, citations, and revision in India.",
            "targetCountry": "India"
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


def generate_article_content(model, brief: dict, existing_posts: list[dict]) -> tuple[str, list]:
    # Select a few random existing posts to interlink
    interlink_candidates = [{"title": p["title"], "slug": p["slug"]} for p in existing_posts[:15]]
    
    prompt = f"""
You are an expert academic writing coach and SEO editor for {SITE_NAME}.
Write a helpful, ethical, SEO-optimized blog article for this brief:
{json.dumps(brief, ensure_ascii=False)}

Target Country/Region: {brief.get("targetCountry", "Global")}
Adapt spelling and terminology appropriately for this region.

Internal Linking Strategy:
You must organically include HTML anchor links (<a href="/blog/their-slug">Their Title</a>) to at least 2 of these existing articles:
{json.dumps(interlink_candidates, ensure_ascii=False)}

Generative Engine Optimization (GEO) & AEO Requirements:
- Use specific "What is..." and "How to..." H2 headings.
- Keep paragraphs short (under 60 words).
- Use high-density bullet points and numbered lists where appropriate to increase citation likelihood by AI.
- Include a dedicated "Frequently Asked Questions (FAQs)" section at the bottom with 3-5 relevant questions and concise answers.

Output rules:
You must output exactly two sections, separated by a specific marker `===FAQS_JSON===`.
Do not output a JSON object.

1. First, output the raw HTML string of the article (use <h2>, <h3>, <p>, <ul>, <li>, <strong>, <a>). Do not include <html>, <head>, or <body> tags. Do not wrap in markdown code blocks.
Length of HTML: 1100-1500 words. Mention {SITE_NAME} naturally once near the end.

2. Then, output the exact string `===FAQS_JSON===` on its own line.

3. Finally, output a JSON array of objects for the FAQs, each with "question" and "answer" fields.

Keep the content ethical: no contract cheating.
"""
    response = model.models.generate_content(
        model=GEMINI_MODEL, 
        contents=prompt
    )
    
    text = response.text.strip()
    if "===FAQS_JSON===" in text:
        html_part, faqs_part = text.split("===FAQS_JSON===", 1)
        html_content = html_part.strip()
        # Remove markdown fences from HTML if present
        if html_content.startswith("```html"):
            html_content = html_content[7:]
        if html_content.endswith("```"):
            html_content = html_content[:-3]
            
        try:
            faqs = parse_json_response(faqs_part)
            if not isinstance(faqs, list):
                faqs = []
        except Exception:
            faqs = []
    else:
        # Fallback if model ignored instructions
        html_content = text
        faqs = []
        
    return html_content.strip(), faqs


def dry_run_content(brief: dict) -> tuple[str, list]:
    keyword = html.escape(brief["primaryKeyword"])
    return f"""
<p>This draft preview shows how a full article would target <strong>{keyword}</strong> in {brief.get('targetCountry', 'Global')}.</p>
<h2>How to understand the task before writing</h2>
<p>Students should begin by reading the brief carefully, identifying the assessment criteria, and breaking the work into research, planning, writing, editing, and referencing stages.</p>
<h2>What is an evidence-led structure?</h2>
<ul><li>Clarify the question.</li><li>Group sources by theme.</li><li>Plan paragraphs around evidence and analysis.</li><li>Leave time for proofreading.</li></ul>
<p>Learn more about <a href="/blog/ensuring-originality-ethical-self-editing-for-academic-papers">ethical self-editing</a>.</p>
<h2>Frequently Asked Questions (FAQs)</h2>
<div class="faqs">
  <h3>What is ethical academic support?</h3>
  <p>Ethical academic support helps you improve your own writing, research, and editing skills without writing the paper for you.</p>
</div>
""".strip(), [{"question": "What is ethical academic support?", "answer": "Ethical academic support helps you improve your own writing, research, and editing skills without writing the paper for you."}]


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
        "targetCountry": brief.get("targetCountry", "Global"),
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


def generate_json_ld(meta: dict, faqs: list) -> str:
    payload = [
        {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": meta["title"],
            "description": meta["excerpt"],
            "author": {"@type": "Organization", "name": SITE_NAME},
            "publisher": {
                "@type": "Organization",
                "name": SITE_NAME,
                "logo": {"@type": "ImageObject", "url": absolute_url("academic-wizard-favicon.png")},
            },
            "datePublished": meta["date"],
            "dateModified": meta["date"],
            "mainEntityOfPage": {"@type": "WebPage", "@id": absolute_url(meta["url"])},
        }
    ]
    
    if faqs:
        faq_schema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": faq["question"],
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": faq["answer"]
                    }
                } for faq in faqs
            ]
        }
        payload.append(faq_schema)
        
    return '<script type="application/ld+json">\n' + json.dumps(payload, indent=2) + "\n</script>"


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
        content, faqs = dry_run_content(brief) if dry_run else generate_article_content(model, brief, existing_posts)
        if dry_run:
            print(f"[dry-run] would create {meta['url']} for keyword: {meta.get('primaryKeyword')}")
            created.append(meta)
            continue

        # Output raw HTML fragment + JSON-LD (No full HTML wrapper)
        
        # Build Related Blogs Section (4 random posts from existing)
        import random
        related_blogs = ""
        if existing_posts:
            sample_size = min(4, len(existing_posts))
            related_samples = random.sample(existing_posts, sample_size)
            related_blogs += '\n<section class="related-blogs" style="margin-top: 3rem; padding-top: 2rem; border-top: 1px solid #e5e7eb;">\n'
            related_blogs += '  <h2 style="margin-bottom: 1.5rem;">Related Articles</h2>\n'
            related_blogs += '  <div class="related-blogs-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem;">\n'
            for rel in related_samples:
                rel_url = f"/blog/{rel['slug']}"
                related_blogs += f'    <div class="related-blog-card" style="padding: 1rem; border: 1px solid #e5e7eb; border-radius: 8px;">\n'
                related_blogs += f'      <h3 style="font-size: 1.1rem; margin-top: 0;"><a href="{rel_url}" style="text-decoration: none; color: #1f2937;">{rel["title"]}</a></h3>\n'
                related_blogs += f'      <p style="font-size: 0.9rem; color: #4b5563; margin-bottom: 0;">{rel.get("excerpt", "")[:100]}...</p>\n'
                related_blogs += f'    </div>\n'
            related_blogs += '  </div>\n'
            related_blogs += '</section>\n'
            
        final_html = content + "\n\n" + related_blogs + "\n\n" + generate_json_ld(meta, faqs)
        
        post_path = POSTS_DIR / f"{meta['slug']}.html"
        post_path.write_text(final_html, encoding="utf-8")
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
