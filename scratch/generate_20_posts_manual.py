import json
import os
import re
import datetime as dt
import random
from pathlib import Path

PROJECT_ROOT = Path("/Users/surya/Desktop/Academic Wizard Latest.")
POSTS_DIR = PROJECT_ROOT / "public" / "blog" / "posts"
DATA_DIR = PROJECT_ROOT / "public" / "data"
POSTS_JSON = DATA_DIR / "posts.json"

CATEGORIES = {
    "assignment-help": "Assignment Help",
    "essay-writing": "Essay Writing",
    "study-guidance": "Study Guidance",
    "research": "Research Support",
}

GAPS = [
    ("assignment-help", "USA"), ("assignment-help", "Australia"), ("assignment-help", "Canada"),
    ("assignment-help", "India"), ("assignment-help", "Ireland"), ("assignment-help", "Singapore"),
    ("assignment-help", "Germany"),
    ("essay-writing", "India"), ("essay-writing", "Ireland"), ("essay-writing", "Singapore"),
    ("essay-writing", "Germany"),
    ("study-guidance", "Australia"), ("study-guidance", "India"), ("study-guidance", "Ireland"),
    ("study-guidance", "Singapore"), ("study-guidance", "Germany"),
    ("research", "India"), ("research", "Ireland"), ("research", "Singapore"),
    ("research", "Germany")
]

AUTHORS = [
    {"name": "Dr. Sarah Evans", "credentials": "PhD in Education, University of Oxford", "countries": ["UK", "Ireland"]},
    {"name": "Dr. Amit Sharma", "credentials": "PhD in Computer Science, IIT Delhi", "countries": ["India", "Singapore"]},
    {"name": "Prof. James Henderson", "credentials": "PhD in English Literature, Harvard University", "countries": ["USA", "Canada"]},
    {"name": "Dr. Hans Müller", "credentials": "PhD in Economics, LMU Munich", "countries": ["Germany", "Ireland"]},
    {"name": "Dr. David Johnston", "credentials": "PhD in Environmental Science, University of British Columbia", "countries": ["Canada", "Australia"]}
]

def select_author(country):
    matching = [a for a in AUTHORS if country in a["countries"]]
    if not matching:
        matching = AUTHORS
    return random.choice(matching)

def slugify(value):
    slug = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    return slug[:90].strip("-")

def generate_json_ld(meta, faqs):
    SITE_NAME = "Academic Wizard"
    absolute_url = f"https://academicwizard.online/{meta['url']}"
    
    author_schema = {
        "@type": "Person",
        "name": meta["author"]["name"],
        "jobTitle": "Academic Coach & Editor",
        "worksFor": {"@type": "Organization", "name": SITE_NAME}
    }
    
    payload = [{
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": meta["title"],
        "description": meta["excerpt"],
        "author": author_schema,
        "publisher": {
            "@type": "Organization",
            "name": SITE_NAME,
            "logo": {"@type": "ImageObject", "url": "https://academicwizard.online/academic-wizard-favicon.webp"}
        },
        "datePublished": meta["date"],
        "dateModified": meta["date"],
        "mainEntityOfPage": {"@type": "WebPage", "@id": absolute_url},
    }]
    
    faq_schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {"@type": "Question", "name": f["question"], "acceptedAnswer": {"@type": "Answer", "text": f["answer"]}}
            for f in faqs
        ]
    }
    payload.append(faq_schema)
    return '<script type="application/ld+json">\n' + json.dumps(payload, indent=2) + "\n</script>"

def generate_content(service, country):
    service_names = {
        "assignment-help": "assignment assistance",
        "essay-writing": "essay writing",
        "study-guidance": "study strategies",
        "research": "research methodologies"
    }
    service_name = service_names[service]
    
    html = f"""<p>Navigating the academic landscape in {country} requires dedication, focus, and a solid understanding of university expectations. When it comes to <strong>{service_name}</strong>, many students find themselves overwhelmed by strict grading rubrics and tight deadlines.</p>
<h2>Understanding {country} University Standards</h2>
<p>Universities in {country} are known for their rigorous academic standards. Whether you are tackling complex theoretical concepts or conducting extensive primary research, the key to success lies in structured planning and ethical academic practices.</p>
<ul>
    <li>Always review your university's specific formatting guidelines.</li>
    <li>Ensure all claims are backed by credible, peer-reviewed sources.</li>
    <li>Utilize academic support resources to improve your writing clarity.</li>
</ul>
<h2>How to Structure Your Work Effectively</h2>
<p>A well-structured document is the foundation of high grades. Start with a clear outline that maps out your main arguments. In {country}, professors look for critical analysis rather than mere descriptive writing. Ensure your introduction clearly states your thesis, and let each subsequent paragraph build upon that central idea.</p>
<p>If you're struggling with citations, we highly recommend using a reliable <a href="/tools/citation-generator">APA/MLA Citation Generator</a> to ensure your bibliography meets institutional standards.</p>
<h2>Common Pitfalls and How to Avoid Them</h2>
<p>One of the most frequent mistakes students make is poor time management. Rushing through {service_name} often leads to structural errors and accidental plagiarism. Always leave at least two days for editing and proofreading before submission.</p>
<h2>Professional Support for {country} Students</h2>
<p>If you feel overwhelmed by your workload, remember that you don't have to navigate it alone. Seeking guidance can help you understand complex topics and improve your academic performance ethically.</p>
<p style="margin-top: 2rem;"><strong>Need expert assistance?</strong> Explore our professional <a href="/services/{service}/{country.lower()}">{CATEGORIES[service]} in {country}</a> services for personalized guidance and support tailored to your academic needs.</p>
"""
    
    faqs = [
        {"question": f"What are the main academic challenges for students in {country}?", "answer": f"Students in {country} often face challenges with critical analysis, strict citation formatting, and managing heavy workloads."},
        {"question": f"How can I improve my {service_name} skills?", "answer": "Practice consistent outlining, read peer-reviewed literature to understand academic tone, and always allocate time for thorough editing."},
        {"question": f"Is seeking {CATEGORIES[service].lower()} ethical?", "answer": "Yes, seeking ethical guidance and tutoring to improve your understanding and writing structure is a standard part of the academic learning process."}
    ]
    
    return html, faqs

def main():
    if not POSTS_JSON.exists():
        print("posts.json not found")
        return
        
    with open(POSTS_JSON, "r", encoding="utf-8") as f:
        posts = json.load(f)
        
    existing_slugs = {p.get("slug") for p in posts}
    
    new_posts_count = 0
    for service, country in GAPS:
        title = f"Mastering {CATEGORIES[service]}: A Guide for {country} University Students"
        slug = slugify(title)
        
        if slug in existing_slugs:
            slug = f"{slug}-{random.randint(100,999)}"
            
        author = select_author(country)
        date_str = dt.datetime.now(dt.timezone.utc).isoformat()
        
        meta = {
            "title": title,
            "slug": slug,
            "excerpt": f"Discover ethical {CATEGORIES[service].lower()} strategies tailored for university students in {country}. Learn how to structure your work, avoid common pitfalls, and achieve academic success.",
            "keywords": [f"{CATEGORIES[service].lower()} {country}", f"university {country}", "academic writing"],
            "primaryKeyword": f"{CATEGORIES[service].lower()} {country}",
            "category": service,
            "categoryLabel": CATEGORIES[service],
            "date": date_str,
            "readingTime": 5,
            "url": f"blog/posts/{slug}.html",
            "targetCountry": country,
            "author": author,
        }
        
        html_content, faqs = generate_content(service, country)
        
        # Build Related Blogs Section
        related_samples = random.sample(posts, min(3, len(posts)))
        related_blogs = '\n<section class="related-blogs" style="margin-top: 4rem; padding-top: 2rem; border-top: 1px solid rgba(255,255,255,0.1);">\n'
        related_blogs += '  <h2 class="premium-gradient-text" style="margin-top: 0; margin-bottom: 2rem; font-size: 1.5rem; font-family: \'Orbitron\', sans-serif; letter-spacing: 0.1em; text-transform: uppercase;">Related Articles</h2>\n'
        related_blogs += '  <div class="related-blogs-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem;">\n'
        for rel in related_samples:
            rel_url = f"/blog/{rel['slug']}"
            related_blogs += f'    <a href="{rel_url}" class="glass-card" style="padding: 1.5rem; display: block; text-decoration: none; border-radius: 16px;">\n'
            related_blogs += f'      <h3 style="font-size: 1.15rem; margin-top: 0; line-height: 1.4; color: #FFFFFF; font-weight: 600;">{rel["title"]}</h3>\n'
            related_blogs += f'      <p style="font-size: 0.95rem; color: #A0A0A0; margin-bottom: 0; line-height: 1.5;">{rel.get("excerpt", "")[:100]}...</p>\n'
            related_blogs += f'    </a>\n'
        related_blogs += '  </div>\n</section>\n'
        
        final_html = html_content + "\n\n" + related_blogs + "\n\n" + generate_json_ld(meta, faqs)
        
        post_path = POSTS_DIR / f"{slug}.html"
        with open(post_path, "w", encoding="utf-8") as f:
            f.write(final_html)
            
        posts.append(meta)
        existing_slugs.add(slug)
        new_posts_count += 1
        print(f"Generated {slug}.html")
        
    with open(POSTS_JSON, "w", encoding="utf-8") as f:
        json.dump(posts, f, indent=2, ensure_ascii=False)
        
    print(f"\\n✅ Successfully generated {new_posts_count} new blog posts to fill topical gaps.")

if __name__ == "__main__":
    main()
