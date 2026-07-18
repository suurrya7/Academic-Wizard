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
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "").strip() or "gemini-2.0-flash-lite-preview-02-05"

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

CATEGORY_TO_SERVICE = {
    "assignment-help": "assignment-help",
    "essay-writing": "essay-help",
    "literature-review": "literature-review",
    "dissertation": "dissertation-help",
    "research": "research-paper-help",
    "editing": "editing-proofreading",
    "study-guidance": "study-guidance",
}

COUNTRY_TO_SLUG = {
    "UK": "uk",
    "USA": "usa",
    "Australia": "australia",
    "Canada": "canada",
    "India": "india",
    "Singapore": "singapore",
    "Ireland": "ireland",
    "Germany": "germany",
}

AUTHORS = [
    {
        "id": "dr-sarah-evans",
        "name": "Dr. Sarah Evans",
        "credentials": "PhD in Education, University of Oxford",
        "bio": "Dr. Sarah Evans is an academic writing coach with over 10 years of experience guiding undergraduate and postgraduate students through complex UK university essays and assignments.",
        "countries": ["UK", "Ireland"]
    },
    {
        "id": "dr-amit-sharma",
        "name": "Dr. Amit Sharma",
        "credentials": "PhD in Computer Science, IIT Delhi",
        "bio": "Dr. Amit Sharma is a computer science professor and research mentor specializing in STEM methodology, academic research design, and data analysis support in India.",
        "countries": ["India", "Singapore"]
    },
    {
        "id": "prof-james-henderson",
        "name": "Prof. James Henderson",
        "credentials": "PhD in English Literature, Harvard University",
        "bio": "Prof. James Henderson has taught rhetorical composition and academic writing at the Ivy League level for two decades, helping US college students refine their argumentation.",
        "countries": ["USA", "Canada"]
    },
    {
        "id": "dr-emily-chen",
        "name": "Dr. Emily Chen",
        "credentials": "PhD in Psychology, University of Toronto",
        "bio": "Dr. Emily Chen is a clinical psychologist and research methodologist who guides Canadian and US students through qualitative research design and thesis development.",
        "countries": ["Canada", "USA"]
    },
    {
        "id": "dr-hans-mueller",
        "name": "Dr. Hans Müller",
        "credentials": "PhD in Economics, LMU Munich",
        "bio": "Dr. Hans Müller specializes in quantitative economics, financial modeling, and guiding European students through academic proofreading and data-heavy dissertations.",
        "countries": ["Germany", "Ireland"]
    },
    {
        "id": "dr-fiona-gallagher",
        "name": "Dr. Fiona Gallagher",
        "credentials": "PhD in Sociology, Trinity College Dublin",
        "bio": "Dr. Fiona Gallagher is a social scientist who provides thesis support and essay writing coaching with a focus on Irish and European university grading systems.",
        "countries": ["Ireland", "UK"]
    },
    {
        "id": "dr-cheryl-tan",
        "name": "Dr. Cheryl Tan",
        "credentials": "PhD in Linguistics, National University of Singapore (NUS)",
        "bio": "Dr. Cheryl Tan is an ESL specialist and academic editor, helping international students in Singapore and Australia polish their prose and meet strict academic standards.",
        "countries": ["Singapore", "Australia"]
    },
    {
        "id": "dr-robert-oconnor",
        "name": "Dr. Robert O'Connor",
        "credentials": "PhD in History, University of Cambridge",
        "bio": "Dr. Robert O'Connor is a humanities editor and dissertation advisor, expert in OSCOLA, Harvard, and Chicago formatting rules across UK universities.",
        "countries": ["UK"]
    },
    {
        "id": "dr-priya-patel",
        "name": "Dr. Priya Patel",
        "credentials": "PhD in Biotechnology, IISc Bangalore",
        "bio": "Dr. Priya Patel is a scientific editor and researcher with a focus on biological sciences, assisting students in India and Singapore with journal publication formatting.",
        "countries": ["India", "Singapore"]
    },
    {
        "id": "dr-marcus-vance",
        "name": "Dr. Marcus Vance",
        "credentials": "PhD in Political Science, Yale University",
        "bio": "Dr. Marcus Vance provides expert guidance on thesis statement construction, policy analysis papers, and legal research support for college students in the USA.",
        "countries": ["USA"]
    },
    {
        "id": "dr-alistair-macleod",
        "name": "Dr. Alistair Macleod",
        "credentials": "PhD in Philosophy, University of Edinburgh",
        "bio": "Dr. Alistair Macleod is a logical analysis coach who helps students structure critical literature reviews and resolve theoretical arguments in their essays.",
        "countries": ["UK", "Canada"]
    },
    {
        "id": "dr-chloe-desjardins",
        "name": "Dr. Chloe Desjardins",
        "credentials": "PhD in Nursing, McGill University",
        "bio": "Dr. Chloe Desjardins specializes in health sciences and nursing curricula, helping Canadian and US students format complex medical literature reviews and case reports.",
        "countries": ["Canada", "USA"]
    },
    {
        "id": "dr-vikram-rao",
        "name": "Dr. Vikram Rao",
        "credentials": "PhD in Statistics, Indian Statistical Institute (ISI)",
        "bio": "Dr. Vikram Rao is an applied statistician who provides dissertation support for statistical modeling, quantitative analysis, SPSS, and R coding in India.",
        "countries": ["India"]
    },
    {
        "id": "dr-eleanor-wright",
        "name": "Dr. Eleanor Wright",
        "credentials": "PhD in English, King's College London",
        "bio": "Dr. Eleanor Wright is a professional editor with expertise in structural proofreading, citation correction, and academic tone adjustment for UK essays.",
        "countries": ["UK"]
    },
    {
        "id": "dr-arthur-pendleton",
        "name": "Dr. Arthur Pendleton",
        "credentials": "PhD in Physics, Massachusetts Institute of Technology (MIT)",
        "bio": "Dr. Arthur Pendleton is a STEM editor and technical writing consultant helping US and Canadian students with engineering lab reports and math research papers.",
        "countries": ["USA", "Canada"]
    },
    {
        "id": "dr-dieter-koch",
        "name": "Dr. Dieter Koch",
        "credentials": "PhD in Philosophy, Heidelberg University",
        "bio": "Dr. Dieter Koch is a critical theory specialist who helps European students refine their methodology chapters and structure academic thesis drafts.",
        "countries": ["Germany"]
    },
    {
        "id": "dr-niamh-brennan",
        "name": "Dr. Niamh Brennan",
        "credentials": "PhD in Medicine, University College Dublin",
        "bio": "Dr. Niamh Brennan is a medical writer and editor who supports biomedical and healthcare students with systematic reviews and research proposals in Ireland.",
        "countries": ["Ireland"]
    },
    {
        "id": "dr-david-johnston",
        "name": "Dr. David Johnston",
        "credentials": "PhD in Environmental Science, University of British Columbia",
        "bio": "Dr. David Johnston is a science writer and editor guiding Canadian and Australian students through scientific papers, case studies, and research planning.",
        "countries": ["Canada", "Australia"]
    },
    {
        "id": "dr-sarah-lim",
        "name": "Dr. Sarah Lim",
        "credentials": "PhD in Business Administration, Nanyang Technological University (NTU)",
        "bio": "Dr. Sarah Lim is a business strategist who helps university students in Singapore and Australia with case analysis, marketing plans, and MBA research guidance.",
        "countries": ["Singapore", "Australia"]
    },
    {
        "id": "dr-jessica-carter",
        "name": "Dr. Jessica Carter",
        "credentials": "PhD in Chemistry, Columbia University",
        "bio": "Dr. Jessica Carter is a chemical researcher and scientific proofreader supporting STEM students in the USA and UK with complex thesis structuring and citations.",
        "countries": ["USA", "UK"]
    }
]

def select_author(target_country: str) -> dict:
    import random
    # Filter authors that match the target country
    matching = [a for a in AUTHORS if target_country in a["countries"]]
    if not matching:
        # Fallback to any author
        matching = AUTHORS
    
    selected = random.choice(matching)
    return {
        "id": selected["id"],
        "name": selected["name"],
        "credentials": selected["credentials"],
        "bio": selected["bio"]
    }

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
    """Extract a JSON object or array from Gemini's response."""
    cleaned = text.strip()
    # Remove markdown code fences if present
    if cleaned.startswith("```json"):
        cleaned = cleaned[7:]
    elif cleaned.startswith("```"):
        cleaned = cleaned[3:]
    if cleaned.endswith("```"):
        cleaned = cleaned[:-3]
        
    cleaned = cleaned.strip()
    first_char = cleaned[0] if cleaned else ''
    
    if first_char == '[':
        start = cleaned.find('[')
        end = cleaned.rfind(']')
    else:
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
        config={
            "system_instruction": "You are a daily SEO content planner. Return ONLY valid JSON representing the array of objects as requested. Do not wrap it in markdown.",
            "response_mime_type": "application/json"
        }
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
    
    category = brief.get("category", "assignment-help")
    service_slug = CATEGORY_TO_SERVICE.get(category, "assignment-help")
    country = brief.get("targetCountry")
    country_slug = COUNTRY_TO_SLUG.get(country)
    
    if country_slug:
        service_link = f"/services/{service_slug}/{country_slug}"
        service_anchor_text = f"{CATEGORIES[category]} in {country}"
    else:
        service_link = f"/services/{service_slug}"
        service_anchor_text = f"{CATEGORIES[category]}"
        
    prompt = f"""
You are an expert academic writing coach and SEO editor for {SITE_NAME}.
Write a helpful, ethical, SEO-optimized blog article for this brief:
{json.dumps(brief, ensure_ascii=False)}

Target Country/Region: {brief.get("targetCountry", "Global")}
Adapt spelling and terminology appropriately for this region.

Internal Linking Strategy:
1. You must organically include HTML anchor links (<a href="/blog/their-slug">Their Title</a>) to at least 2 of these existing articles:
{json.dumps(interlink_candidates, ensure_ascii=False)}

2. You MUST organically include exactly one prominent link back to our commercial service page:
Link URL: {service_link}
Anchor Text: Integrate this link naturally using keyword-rich anchor text related to "{service_anchor_text}". For example, "Looking for ethical {service_anchor_text.lower()}? Let our experts guide you..." or similar. Place this link near the end of the article, but before the FAQs.

3. You MUST organically include at least one link to our free academic tools suite where contextually appropriate:
Choose the most relevant tool depending on the article's topic:
- Citation Generator: <a href="/tools/citation-generator">APA/MLA Citation Generator</a> (Discussing references, bibliography, formatting, APA, MLA, Harvard, Chicago, Vancouver style).
- Grammar & Spell Checker: <a href="/tools/grammar-checker">Academic Grammar & Spell Checker</a> (Discussing proofreading, editing, essays, writing styles, punctuation).
- Linguistic AI Detector: <a href="/tools/ai-detector">Linguistic AI Essay Detector</a> (Discussing AI writing, plagiarism detection, ChatGPT, Claude, academic integrity).
- AI Text Humanizer: <a href="/tools/ai-humanizer">AI Essay Humanizer</a> (Discussing Turnitin AI bypass, text rewriting, bypassing AI detection, natural phrasing).
Anchor Text: Integrate this link naturally using descriptive, keyword-rich anchor text.

Generative Engine Optimization (GEO) & AEO Requirements:
- Use specific "What is..." and "How to..." H2 headings.
- Keep paragraphs short (under 60 words).
- Use high-density bullet points and numbered lists where appropriate to increase citation likelihood by AI.
- Include a dedicated "Frequently Asked Questions (FAQs)" section at the bottom with 3-5 relevant questions and concise answers.

Output rules:
You must output exactly two sections, separated by a specific marker `===FAQS_JSON===`.
Do not output a JSON object.

1. First, output the raw HTML string of the article (use <h2>, <h3>, <p>, <ul>, <li>, <strong>, <a>). Do NOT include <h1> tags — the page template already renders the title. Start your content directly with the first <h2> or <p>. Do not include <html>, <head>, or <body> tags. Do not wrap in markdown code blocks.
Length of HTML: 1100-1500 words. Mention {SITE_NAME} naturally once near the end.

2. Then, output the exact string `===FAQS_JSON===` on its own line.

3. Finally, output a JSON array of objects for the FAQs, each with "question" and "answer" fields.

Keep the content ethical: no contract cheating.
"""
    response = model.models.generate_content(
        model=GEMINI_MODEL,
        contents=prompt,
        config={
            "system_instruction": "You are an expert academic writing coach and SEO editor. Follow all formatting instructions perfectly."
        }
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

    target_country = brief.get("targetCountry", "Global")
    author = select_author(target_country)

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
        "targetCountry": target_country,
        "author": author,
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
    author_meta = meta.get("author")
    if author_meta:
        author_schema = {
            "@type": "Person",
            "name": author_meta["name"],
            "jobTitle": "Academic Coach & Editor",
            "worksFor": {
                "@type": "Organization",
                "name": SITE_NAME
            }
        }
    else:
        author_schema = {"@type": "Organization", "name": SITE_NAME}

    payload = [
        {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": meta["title"],
            "description": meta["excerpt"],
            "author": author_schema,
            "publisher": {
                "@type": "Organization",
                "name": SITE_NAME,
                "logo": {"@type": "ImageObject", "url": absolute_url("academic-wizard-favicon.webp")},
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
        
        # Build Related Blogs Section (3 random posts from existing)
        import random
        related_blogs = ""
        if existing_posts:
            sample_size = min(3, len(existing_posts))
            related_samples = random.sample(existing_posts, sample_size)
            related_blogs += '\n<section class="related-blogs" style="margin-top: 4rem; padding-top: 2rem; border-top: 1px solid rgba(255,255,255,0.1);">\n'
            related_blogs += '  <h2 class="premium-gradient-text" style="margin-top: 0; margin-bottom: 2rem; font-size: 1.5rem; font-family: \'Orbitron\', sans-serif; letter-spacing: 0.1em; text-transform: uppercase;">Related Articles</h2>\n'
            related_blogs += '  <div class="related-blogs-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem;">\n'
            for rel in related_samples:
                rel_url = f"/blog/{rel['slug']}"
                related_blogs += f'    <a href="{rel_url}" class="glass-card" style="padding: 1.5rem; display: block; text-decoration: none; border-radius: 16px;">\n'
                related_blogs += f'      <h3 style="font-size: 1.15rem; margin-top: 0; line-height: 1.4; color: #FFFFFF; font-weight: 600;">{rel["title"]}</h3>\n'
                related_blogs += f'      <p style="font-size: 0.95rem; color: #A0A0A0; margin-bottom: 0; line-height: 1.5;">{rel.get("excerpt", "")[:100]}...</p>\n'
                related_blogs += f'    </a>\n'
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
