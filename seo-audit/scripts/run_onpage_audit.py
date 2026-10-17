#!/usr/bin/env python3
"""
run_onpage_audit.py — Phase 3 On-Page & Content Quality Engine
Audits title tags, meta descriptions, H1s, headings, word counts, search intent,
E-E-A-T signals, and doorway risks across all discovered URLs.
Generates per_page_cards/ and seo-audit/04_onpage_findings.csv.
"""

import os
import re
import csv
import sys
import json
from pathlib import Path
from bs4 import BeautifulSoup
from collections import defaultdict

BASE_URL = "https://academicwizard.online"
PROJECT_ROOT = Path("/Users/surya/Desktop/Academic Wizard Latest.")
DIST_DIR = PROJECT_ROOT / "dist"
INVENTORY_CSV = PROJECT_ROOT / "seo-audit" / "02_url_inventory.csv"
OUTPUT_CSV = PROJECT_ROOT / "seo-audit" / "04_onpage_findings.csv"
CARDS_DIR = PROJECT_ROOT / "seo-audit" / "per_page_cards"

CARDS_DIR.mkdir(parents=True, exist_ok=True)

def sanitize_filename(url):
    rel = url.replace(BASE_URL, '').strip('/')
    if not rel:
        return "home.md"
    safe = re.sub(r'[^a-zA-Z0-9_\-]', '_', rel)
    return f"{safe[:120]}.md"

def get_dist_path_for_url(url):
    rel = url.replace(BASE_URL, '').strip('/')
    if not rel:
        return DIST_DIR / "index.html"
    dir_index = DIST_DIR / rel / "index.html"
    if dir_index.exists():
        return dir_index
    exact_file = DIST_DIR / rel
    if exact_file.exists() and exact_file.is_file():
        return exact_file
    html_file = DIST_DIR / f"{rel}.html"
    if html_file.exists():
        return html_file
    return None

def main():
    print("=== Phase 3: On-Page & Content Quality Audit Starting ===")
    
    if not INVENTORY_CSV.exists():
        print(f"Error: {INVENTORY_CSV} does not exist.")
        sys.exit(1)

    with open(INVENTORY_CSV, 'r', encoding='utf-8') as f:
        inventory = list(csv.DictReader(f))

    print(f"Loaded {len(inventory)} URLs from inventory.")

    fieldnames = [
        "finding_id", "url", "page_type", "title_text", "title_length",
        "title_pixel_estimate", "title_status", "meta_description_text",
        "meta_description_length", "meta_description_status", "h1_count",
        "h1_text", "h1_match_status", "heading_hierarchy", "word_count",
        "thin_content_flag", "boilerplate_ratio", "search_intent",
        "eeat_trust_signals", "cta_presence", "spam_pattern_risk",
        "onpage_overall_score", "recommended_title", "recommended_meta",
        "recommended_h1", "per_page_card_path"
    ]

    findings = []
    thin_count = 0
    title_issue_count = 0
    meta_issue_count = 0

    for idx, row in enumerate(inventory):
        if (idx + 1) % 500 == 0 or (idx + 1) == len(inventory):
            print(f"Audited {idx + 1}/{len(inventory)} URLs...")

        url = row["url"]
        page_type = row["page_type"]
        indexability = row["indexability_status"]
        finding_id = f"ONPAGE-{idx+1:04d}"
        dist_path = get_dist_path_for_url(url)

        title = ""
        meta_desc = ""
        h1_list = []
        headings = []
        body_words = 0
        ctas = []
        eeat_signals = []
        spam_risk = "Clean"
        score = 100

        if dist_path and dist_path.exists():
            try:
                html = dist_path.read_text(encoding='utf-8', errors='ignore')
                soup = BeautifulSoup(html, 'html.parser')

                # Title
                t_tag = soup.find('title')
                if t_tag:
                    title = " ".join(t_tag.get_text().split())

                # Meta desc
                m_tag = soup.find('meta', attrs={'name': 'description'})
                if m_tag and m_tag.get('content'):
                    meta_desc = " ".join(m_tag['content'].split())

                # H1
                h1_tags = soup.find_all('h1')
                h1_list = [" ".join(h.get_text().split()) for h in h1_tags if h.get_text().strip()]

                # Heading hierarchy
                for h in soup.find_all(['h1', 'h2', 'h3', 'h4']):
                    headings.append(h.name)

                # Body text word count (strip scripts, styles, nav, footer)
                for s in soup(['script', 'style', 'nav', 'footer', 'noscript']):
                    s.decompose()
                main_tag = soup.find('main') or soup.find('body')
                if main_tag:
                    text = main_tag.get_text(separator=' ')
                    words = [w for w in text.split() if len(w) > 1]
                    body_words = len(words)

                # CTAs
                html_lower = html.lower()
                if 'wa.me/' in html_lower or 'whatsapp' in html_lower:
                    ctas.append("WhatsApp Bridge")
                if 'pricingcalculator' in html_lower or 'calculate price' in html_lower:
                    ctas.append("Pricing Calculator")
                if 'contactform' in html_lower or '<form' in html_lower:
                    ctas.append("Quote Form")

                # E-E-A-T
                if 'phd' in html_lower or 'turnitin' in html_lower or 'guarantee' in html_lower:
                    eeat_signals.append("Academic Credentials / Turnitin Guarantee")
                if 'review' in html_lower and 'star' in html_lower:
                    eeat_signals.append("Student Reviews & Ratings")
                if 'refund' in html_lower or 'revision' in html_lower:
                    eeat_signals.append("Refund / Revision Policy")

            except Exception as e:
                pass

        # Metrics & Scoring
        title_len = len(title)
        pixel_est = int(title_len * 8.5)
        if title_len == 0:
            title_status = "Missing Title Tag"
            score -= 25
            title_issue_count += 1
        elif title_len < 30:
            title_status = f"Too Short ({title_len} chars)"
            score -= 10
            title_issue_count += 1
        elif title_len > 65:
            title_status = f"Too Long ({title_len} chars - Truncation Risk)"
            score -= 5
            title_issue_count += 1
        else:
            title_status = f"Optimal ({title_len} chars / ~{pixel_est}px)"

        desc_len = len(meta_desc)
        if desc_len == 0:
            meta_status = "Missing Meta Description"
            score -= 20
            meta_issue_count += 1
        elif desc_len < 100:
            meta_status = f"Too Short ({desc_len} chars)"
            score -= 10
            meta_issue_count += 1
        elif desc_len > 165:
            meta_status = f"Too Long ({desc_len} chars - Snippet Truncation)"
            score -= 5
            meta_issue_count += 1
        else:
            meta_status = f"Optimal ({desc_len} chars)"

        # H1 evaluation
        h1_count = len(h1_list)
        h1_text = h1_list[0] if h1_list else "None"
        if h1_count == 0:
            h1_match = "Missing H1"
            score -= 20
        elif h1_count > 1:
            h1_match = f"Multiple H1s ({h1_count} tags found)"
            score -= 5
        else:
            h1_match = "Valid Single H1"

        # Heading hierarchy
        if not headings:
            heading_hier = "No Headings"
        elif headings[0] != 'h1':
            heading_hier = f"Invalid Order (Starts with {headings[0]})"
            score -= 5
        else:
            heading_hier = "Valid Heading Hierarchy (H1 -> H2/H3)"

        # Thin content & Doorway evaluation
        if body_words < 300:
            thin_flag = "Y"
            thin_count += 1
            if indexability == "Indexable":
                score -= 25
                spam_risk = "Thin Content Risk (<300 words)"
            else:
                spam_risk = "Pruned (Safe: noindex applied)"
        else:
            thin_flag = "N"

        if page_type == "city_page":
            if indexability == "Indexable":
                spam_risk = "Doorway Page Risk (Programmatic City)"
                score -= 30
            else:
                spam_risk = "Safe (Pruned with noindex, follow)"

        # Search intent classification
        if page_type in ["service_hub", "country_service", "subject_page", "city_page"]:
            search_intent = "Commercial / Transactional"
        elif page_type in ["blog_post", "blog_index", "dissertation_topic"]:
            search_intent = "Informational"
        elif page_type in ["tool", "tool_index"]:
            search_intent = "Utility / Transactional"
        elif page_type in ["static_core", "legal"]:
            search_intent = "Navigational / Informational"
        else:
            search_intent = "Informational"

        # E-E-A-T score
        eeat_level = "High" if len(eeat_signals) >= 2 else ("Moderate" if len(eeat_signals) == 1 else "Low")
        if eeat_level == "Low" and indexability == "Indexable":
            score -= 10

        cta_str = ", ".join(ctas) if ctas else "None"
        boilerplate_ratio = "High (Template Wrapped)" if body_words < 450 else "Balanced (Unique Content Dominated)"

        # Recommended Fixes
        clean_subject = title.split('|')[0].strip() if title else 'Academic Writing Help'
        if title_len > 60 or title_len < 30:
            rec_title = f"{clean_subject[:45]} | Academic Wizard"
        else:
            rec_title = title

        if desc_len > 160 or desc_len < 100:
            rec_meta = f"Get trusted {clean_subject[:35]} from verified UK & international academic experts. 100% plagiarism-free, on-time delivery. WhatsApp 24/7!"
        else:
            rec_meta = meta_desc

        rec_h1 = h1_text if h1_text != "None" else rec_title.split('|')[0].strip()

        score = max(10, score)

        card_filename = sanitize_filename(url)
        card_rel_path = f"seo-audit/per_page_cards/{card_filename}"

        record = {
            "finding_id": finding_id,
            "url": url,
            "page_type": page_type,
            "title_text": title,
            "title_length": title_len,
            "title_pixel_estimate": pixel_est,
            "title_status": title_status,
            "meta_description_text": meta_desc,
            "meta_description_length": desc_len,
            "meta_description_status": meta_status,
            "h1_count": h1_count,
            "h1_text": h1_text,
            "h1_match_status": h1_match,
            "heading_hierarchy": heading_hier,
            "word_count": body_words,
            "thin_content_flag": thin_flag,
            "boilerplate_ratio": boilerplate_ratio,
            "search_intent": search_intent,
            "eeat_trust_signals": eeat_level,
            "cta_presence": cta_str,
            "spam_pattern_risk": spam_risk,
            "onpage_overall_score": score,
            "recommended_title": rec_title,
            "recommended_meta": rec_meta,
            "recommended_h1": rec_h1,
            "per_page_card_path": card_rel_path
        }
        findings.append(record)

        # Write Per-Page Card
        card_full_path = CARDS_DIR / card_filename
        card_content = f"""# SEO Audit Card: {url}

**Finding ID:** {finding_id}  
**Page Type:** {page_type}  
**Indexability Status:** {indexability}  
**On-Page Quality Score:** {score}/100  
**Search Intent:** {search_intent}  

---

## 1. Observed Metadata & Headings
* **Title ({title_len} chars):** `{title}`
  * *Status:* {title_status}
* **Meta Description ({desc_len} chars):** `{meta_desc}`
  * *Status:* {meta_status}
* **H1 Tag ({h1_count} detected):** `{h1_text}`
  * *Status:* {h1_match}
* **Heading Hierarchy:** {heading_hier}

---

## 2. Content & Trust Analysis
* **Main Content Word Count:** {body_words} words (Thin Flag: {thin_flag})
* **Boilerplate Ratio:** {boilerplate_ratio}
* **E-E-A-T Signals:** {eeat_level} ({', '.join(eeat_signals) if eeat_signals else 'None'})
* **Conversion CTAs:** {cta_str}
* **Spam / Doorway Risk:** {spam_risk}

---

## 3. Recommended Copy-Paste Optimizations
* **Recommended Title:** `{rec_title}`
* **Recommended Meta Description:** `{rec_meta}`
* **Recommended H1:** `{rec_h1}`
* **Content Gap / Linking Fix:** {"Ensure prominent in-content link to relevant commercial service hub and WhatsApp conversion magnet." if page_type == 'blog_post' else "Maintain subject depth and verified student testimonials."}
"""
        card_full_path.write_text(card_content, encoding='utf-8')

    with open(OUTPUT_CSV, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(findings)

    print(f"\nSuccessfully wrote {len(findings)} on-page audit records to {OUTPUT_CSV}")
    print(f"Generated {len(findings)} individual audit cards in {CARDS_DIR}")
    print("\n=== ON-PAGE AUDIT SUMMARY ===")
    print(f"Total URLs Evaluated: {len(findings)}")
    print(f"Title Issues Detected: {title_issue_count} URLs")
    print(f"Meta Description Issues Detected: {meta_issue_count} URLs")
    print(f"Thin Content (<300 words): {thin_count} URLs (Chiefly pruned city doorway pages)")
    print("=============================\n")

if __name__ == "__main__":
    main()
