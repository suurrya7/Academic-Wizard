#!/usr/bin/env python3
"""
update_services_data.py — Optimizes metaTitles and metaDescriptions in src/data/services.js
"""

import re
from pathlib import Path

PROJECT_ROOT = Path("/Users/surya/Desktop/Academic Wizard Latest.")
SERVICES_JS = PROJECT_ROOT / "src" / "data" / "services.js"

content = SERVICES_JS.read_text(encoding="utf-8")

# 1. Update 7 Service Hubs metaTitles & metaDescriptions
service_updates = {
    "essay-help": {
        "metaTitle": "Professional Essay Help & Writing Support | 1st Class",
        "metaDescription": "Expert essay help for university students. Strengthen thesis development, argumentation, evidence integration, and academic referencing across all subjects."
    },
    "dissertation-help": {
        "metaTitle": "Dissertation Help & Coaching | PhD Thesis Guidance",
        "metaDescription": "Comprehensive dissertation help for postgraduate students. Expert guidance on topic selection, research methodology, literature review, and data analysis."
    },
    "research-paper-help": {
        "metaTitle": "Research Paper Help | Academic Paper Writing Support",
        "metaDescription": "Professional assistance with university research papers. Academic support with methodology design, empirical data collection, data analysis, and report drafting."
    },
    "editing-proofreading": {
        "metaTitle": "Academic Editing & Proofreading Services | 1st Class",
        "metaDescription": "Professional editing for academic papers, theses, and essays. Improve grammar, sentence flow, academic register, and citation formatting across all major styles."
    },
    "study-guidance": {
        "metaTitle": "Study Guidance & Academic Coaching | University Prep",
        "metaDescription": "Personalised study planning, revision strategies, and time management coaching for university students. Master coursework planning and effective exam preparation."
    }
}

for s_slug, vals in service_updates.items():
    # Replace metaTitle and metaDescription within that service block
    pattern = rf"(slug:\s*['\"]{s_slug}['\"][\s\S]*?metaTitle:\s*['\"])([^'\"]+)(['\"][\s\S]*?metaDescription:\s*['\"])([^'\"]+)(['\"])"
    match = re.search(pattern, content)
    if match:
        content = (
            content[:match.start(2)]
            + vals["metaTitle"]
            + content[match.end(2):match.start(4)]
            + vals["metaDescription"]
            + content[match.end(4):]
        )

# 2. Shorten all country metaTitles in services.js
def clean_meta_title(t):
    if len(t) <= 60:
        return t
    cand = t.replace(" | Academic Wizard", "").strip()
    if len(cand) <= 60:
        return cand
    cand = cand.replace(" — ", " | ")
    if len(cand) <= 60:
        return cand
        
    cand_no_price = re.sub(r"\s*[·\|]\s*From\s+[^\|]+$", "", cand).strip()
    if len(cand_no_price) <= 60 and len(cand_no_price) >= 25:
        return cand_no_price
        
    cand_clean = cand_no_price.replace("Comprehensive & Rigorous", "Rigorous Synthesis")
    cand_clean = cand_clean.replace("Honours & PhD Support", "PhD Thesis Support")
    cand_clean = cand_clean.replace("Thesis & Research Support", "Thesis Support")
    cand_clean = cand_clean.replace("NUS & NTU PhD Support", "NUS & NTU Support")
    cand_clean = cand_clean.replace("Doktorarbeit & Abschlussarbeit", "Doktorarbeit Support")
    cand_clean = cand_clean.replace("Systematic & Thematic Reviews", "Systematic Reviews")
    cand_clean = cand_clean.replace("Comprehensive Research Support", "Research Support")
    cand_clean = cand_clean.replace("Evidence-Based Reviews", "Evidence Reviews")
    cand_clean = cand_clean.replace("Integrative & Systematic", "Systematic Reviews")
    cand_clean = cand_clean.replace("Forschungsstand & Theorie", "Forschungsstand Support")
    cand_clean = cand_clean.replace("Professional Proofreading & Editing", "Proofreading & Editing")
    cand_clean = cand_clean.replace("Leaving Cert to University", "University Coaching")
    cand_clean = cand_clean.replace("Professional Dissertation Help Online | PhD Thesis Writers & Coaches", "Dissertation Help & Coaching | PhD Guidance")
    if len(cand_clean) <= 60:
        return cand_clean

    return cand_clean

for m in re.finditer(r"metaTitle:\s*[\x27\"]([^\x27\"]+)[\x27\"]", content):
    orig = m.group(1)
    cleaned = clean_meta_title(orig)
    if cleaned != orig:
        content = content.replace(f'metaTitle: "{orig}"', f'metaTitle: "{cleaned}"').replace(f"metaTitle: '{orig}'", f'metaTitle: "{cleaned}"')

SERVICES_JS.write_text(content, encoding="utf-8")
print("✅ Successfully updated services.js")
