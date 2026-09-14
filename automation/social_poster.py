#!/usr/bin/env python3
"""
Autonomous 2x Daily Social Media Posting Engine for Academic Wizard.
Publishes to Instagram, Facebook, and Twitter (X) via the Buffer API.

Features:
- Slot 1 (Morning 09:00 UTC / 2:30 PM IST): Free Tools & Academic Weapon Cheat Sheets
- Slot 2 (Evening 18:00 UTC / 11:30 PM IST): Commercial Services & Late-Night Emergency Triage
- Gemini Pro API for fresh platform-tailored copy (IG, TW, FB)
- Imagen 3 for photorealistic visual generation
- Pillow dark-academia infographic card generator (works offline & in CI)
- Dual Buffer API client (Modern GraphQL + REST fallback)
- Automatic WhatsApp CTA links (+91 95098 93638)
"""

import argparse
import base64
import datetime as dt
import io
import json
import os
import re
import sys
import time
import urllib.parse
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import requests
from PIL import Image, ImageDraw, ImageFont

# ==============================================================================
# Configuration & Constants
# ==============================================================================
SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent
PUBLIC_SOCIAL_DIR = PROJECT_ROOT / "public" / "social"
PUBLIC_SOCIAL_DIR.mkdir(parents=True, exist_ok=True)

LOGO_NAV_PATH = PROJECT_ROOT / "public" / "academic-wizard-logo-nav.webp"
if not LOGO_NAV_PATH.exists():
    LOGO_NAV_PATH = PROJECT_ROOT / "src" / "assets" / "academic-wizard-logo-nav.webp"

BUFFER_ACCESS_TOKEN = os.getenv("BUFFER_ACCESS_TOKEN", "").strip()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip() or os.getenv("BACKLINK_GEMINI_API_KEY", "").strip()
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash").strip()

SITE_URL = os.getenv("SITE_URL", "https://academicwizard.online").rstrip("/")
GITHUB_REPO = os.getenv("GITHUB_REPOSITORY", "suurrya7/Academic-Wizard")
GITHUB_BRANCH = os.getenv("GITHUB_REF_NAME", "main")
RAW_GITHUB_BASE = f"https://raw.githubusercontent.com/{GITHUB_REPO}/{GITHUB_BRANCH}"

WHATSAPP_NUMBER = "919509893638"
WHATSAPP_DISPLAY = "+91 95098 93638"


def generate_whatsapp_link(message: str) -> str:
    """Create a pre-filled WhatsApp click-to-chat URL."""
    encoded = urllib.parse.quote(message)
    return f"https://wa.me/{WHATSAPP_NUMBER}?text={encoded}"


# ==============================================================================
# 14-Recipe Rotation Matrix (7 Days x 2 Slots)
# ==============================================================================
ROTATION_MATRIX = {
    "morning": [
        # Day 0 (Monday): Citation Machine
        {
            "day": "Monday",
            "topic": "Citation Cheat Sheet: APA 7th vs Harvard vs OSCOLA",
            "badge": "✦ FREE ACADEMIC TOOL SPOTLIGHT ✦",
            "headline": "Never Lose Marks on In-Text Citations Again",
            "key_points": [
                "APA 7th: (Author, Year, p. 45) for quotes; only (Author, Year) for paraphrase.",
                "Harvard: Requires colon for pages (Author Year: 45) and italics for titles.",
                "OSCOLA: Footnote citations with zero full stops in abbreviations (UK Law).",
                "Instant fix: Use our 100% free multi-style citation generator.",
            ],
            "tool_url": f"{SITE_URL}/tools/",
            "cta": "Generate 100% accurate APA, Harvard, and OSCOLA bibliographies in seconds.",
            "whatsapp_msg": "Hi Academic Wizard, I need help formatting my citations and references for my paper.",
            "imagen_prompt": (
                "Dark academia aesthetic, high-resolution photography of an Oxford library desk. "
                "Stack of antique law and philosophy textbooks, open reference guide, brass reading lamp "
                "casting warm amber light, neat handwritten citation notes, cup of black coffee, "
                "laptop screen displaying a citation management dashboard, 8k, realistic."
            ),
        },
        # Day 1 (Tuesday): Academic Research Databases
        {
            "day": "Tuesday",
            "topic": "5 Free Academic Search Engines Beyond Google Scholar",
            "badge": "✦ ACADEMIC RESEARCH BLUEPRINT ✦",
            "headline": "Find Peer-Reviewed Sources from the Last 5 Years",
            "key_points": [
                "CORE: World's largest aggregator of open access research papers.",
                "BASE (Bielefeld): Over 400M academic documents indexed globally.",
                "Semantic Scholar: AI-powered citation influence & literature mapping.",
                "DOAJ: 100% peer-reviewed open access journals without paywalls.",
            ],
            "tool_url": f"{SITE_URL}/tools/",
            "cta": "Stuck behind paywalls or can't find empirical sources? Explore our free academic guides.",
            "whatsapp_msg": "Hi Academic Wizard, I need help finding peer-reviewed empirical papers for my assignment.",
            "imagen_prompt": (
                "Atmospheric university library study room, cinematic lighting. Polished dark wood desk, "
                "open laptop with data science graphs and research papers, glowing table lamp, neat stationery, "
                "high bookshelves in the soft-focus background, ultra-detailed photorealistic."
            ),
        },
        # Day 2 (Wednesday): Word Count to Pages & Spacing
        {
            "day": "Wednesday",
            "topic": "The 10-80-10 Rule: How to Structure Any University Essay",
            "badge": "✦ ESSAY WRITING PROTOCOL ✦",
            "headline": "Structure a First-Class 2,500-Word Essay Without Fluff",
            "key_points": [
                "Introduction (250 words): Hook + Context + Thesis statement + Signposting.",
                "Body Sections (2,000 words): 4 thematic sections of 500 words using P-E-E-L.",
                "Conclusion (250 words): Synthesize arguments, answer question, zero new evidence.",
                "Standard conversion: 2,500 words = ~10 pages double-spaced or ~5 pages single-spaced.",
            ],
            "tool_url": f"{SITE_URL}/tools/",
            "cta": "Calculate exact word counts, paragraph targets, and page margins with our free tools.",
            "whatsapp_msg": "Hi Academic Wizard, I need help structuring and outlining my 2,500-word essay.",
            "imagen_prompt": (
                "Top-down flat-lay view of an organized student study desk. Modern laptop with structured essay draft, "
                "fountain pen, moleskine planner with neat bullet points, golden hour sunlight streaming across mahogany desk, "
                "steam rising from ceramic mug, dark academia tones."
            ),
        },
        # Day 3 (Thursday): Thesis Topic Builder
        {
            "day": "Thursday",
            "topic": "How to Formulate a Bulletproof Thesis Statement",
            "badge": "✦ DISSERTATION & THESIS TOOLKIT ✦",
            "headline": "Turn a Broad Topic into a First-Class Thesis Statement",
            "key_points": [
                "Rule 1: Must be debatable (not an indisputable statement of fact).",
                "Rule 2: Must be narrow (focused on a specific cohort, timeframe, or jurisdiction).",
                "Rule 3: Must justify 'So What?' (why the empirical gap matters).",
                "Winning Formula: 'While [counter-perspective], this paper argues [claim] because [evidence 1, 2, 3].'",
            ],
            "tool_url": f"{SITE_URL}/dissertation-help/",
            "cta": "Refine your dissertation proposal or research methodology with our PhD consulting team.",
            "whatsapp_msg": "Hi Academic Wizard, could you review my thesis topic and research question?",
            "imagen_prompt": (
                "Grand Victorian library with towering bookshelves and rolling ladders. A scholar working at a carved "
                "mahogany table, leather-bound thesis draft, warm tungsten lighting, shallow depth of field, 8k realistic."
            ),
        },
        # Day 4 (Friday): Turnitin & Similarity Survival Guide
        {
            "day": "Friday",
            "topic": "How Turnitin Similarity Scores Actually Work",
            "badge": "✦ TURNITIN SURVIVAL GUIDE ✦",
            "headline": "What Your Similarity Percentage Means Before Submission",
            "key_points": [
                "Blue (0%) & Green (1-24%): Standard quotes, references, and template rubrics.",
                "Yellow (25-49%): Critical warning — requires immediate substantive paraphrasing.",
                "Orange/Red (50%+): Immediate plagiarism flag by university examiners.",
                "Golden Rule: Always check with non-repository access so your paper isn't stored in Turnitin.",
            ],
            "tool_url": SITE_URL,
            "cta": "Get an official Turnitin similarity report with non-repository guarantee before you submit.",
            "whatsapp_msg": "Hi Academic Wizard, I want to scan my assignment through non-repository Turnitin.",
            "imagen_prompt": (
                "Modern dark-themed student desk setup. Glowing laptop showing a clean academic report with colored "
                "highlighted metrics, glasses resting on a notebook, cup of espresso, warm moody lighting, photorealistic."
            ),
        },
        # Day 5 (Saturday): Global GPA & Grade Converter
        {
            "day": "Saturday",
            "topic": "UK First Class (70%+) vs US 4.0 GPA vs Australian HD",
            "badge": "✦ GLOBAL GRADING BLUEPRINT ✦",
            "headline": "How University Marks Translate Across UK, US & Australia",
            "key_points": [
                "UK 70%+ (First Class): Equivalent to US 4.0 GPA / Grade A, Australian 85%+ High Distinction.",
                "UK 60-69% (2:1 Upper Second): Equivalent to US 3.3-3.7 GPA / Grade B+, Australian 75-84% Distinction.",
                "Key difference: UK examiners rarely award above 78% due to strict analytical benchmarking.",
                "Target First Class: Deep critical evaluation rather than descriptive summaries.",
            ],
            "tool_url": f"{SITE_URL}/tools/",
            "cta": "Convert your grades and check assessment rubrics with our free international grade calculator.",
            "whatsapp_msg": "Hi Academic Wizard, I want expert tutoring to score a First Class on my next paper.",
            "imagen_prompt": (
                "Cozy university dormitory desk overlooking a rainy London campus. Open academic journal, laptop with "
                "rubric spreadsheet, steaming tea mug, ambient desk lamp, ultra-realistic photography."
            ),
        },
        # Day 6 (Sunday): Weekly Deadline Survival & Study Matrix
        {
            "day": "Sunday",
            "topic": "The 3-Deadline Sunday Triage Protocol",
            "badge": "✦ DEADLINE TRIAGE MATRIX ✦",
            "headline": "Have 3 Assignments Due This Week? Here's How to Survive",
            "key_points": [
                "Sort by module weight: Prioritize 40-credit dissertation modules over 10-credit coursework.",
                "Draft before polish: Write complete ugly drafts in 90-minute Pomodoro blocks.",
                "Delegate formatting: Outsource citation checks and proofreading to save 6+ hours.",
                "24/7 Backup: Our subject specialists are online 24/7 for urgent turnaround.",
            ],
            "tool_url": f"{SITE_URL}/tools/",
            "cta": "Overwhelmed by back-to-back university deadlines? Our academic writers are online 24/7.",
            "whatsapp_msg": "Hi Academic Wizard, I have multiple assignments due this week and need urgent assistance.",
            "imagen_prompt": (
                "Night-time study session in a university library. Warm glowing banker's lamp, notebook with "
                "time-management matrix and highlighted deadlines, laptop open with academic paper, dark academia aesthetic."
            ),
        },
    ],
    "evening": [
        # Day 0 (Monday): Law Assignment Help
        {
            "day": "Monday",
            "topic": "Stuck on a Law Problem Question? The IRAC Masterclass",
            "badge": "✦ LAW ASSIGNMENT SPECIALISTS ✦",
            "headline": "Score a First Class in Contract, Tort & Criminal Law",
            "key_points": [
                "Issue: Isolate the precise legal dispute in 1-2 sharp sentences.",
                "Rule: Cite binding statutory provisions and leading common law precedents.",
                "Analysis: Apply legal principles to the specific facts with counter-arguments.",
                "Conclusion: Deliver a decisive judicial outcome with OSCOLA footnote precision.",
            ],
            "tool_url": f"{SITE_URL}/services/law-assignment-help/",
            "cta": "Get custom law essays, problem questions, and OSCOLA citations written by qualified LLB/LLM experts.",
            "whatsapp_msg": "Hi Academic Wizard, I need urgent Law assignment help with IRAC methodology and OSCOLA.",
            "imagen_prompt": (
                "Prestigious law library with tall oak shelves filled with leather-bound law reports. "
                "Supreme Court precedent volume open on green felt desk, brass scales of justice in background, "
                "glowing banker's lamp, dark academia, ultra-photorealistic."
            ),
        },
        # Day 1 (Tuesday): Nursing & Healthcare Case Studies
        {
            "day": "Tuesday",
            "topic": "Nursing Care Plans, Gibbs Cycle & Evidence-Based Practice",
            "badge": "✦ NURSING & HEALTHCARE EXPERTS ✦",
            "headline": "Evidence-Based Nursing Case Studies & Gibbs Reflections",
            "key_points": [
                "Gibbs Cycle: Description ➔ Feelings ➔ Evaluation ➔ Analysis ➔ Conclusion ➔ Action Plan.",
                "PICO Framework: Population, Intervention, Comparison, Outcome for clinical rigor.",
                "Evidence Hierarchy: Prioritizing Level 1 Systematic Reviews (Cochrane, CINAHL, PubMed).",
                "APA / Harvard referencing aligned with UK NMC and Australian NMBA standards.",
            ],
            "tool_url": f"{SITE_URL}/services/nursing-assignment-help/",
            "cta": "Connect directly with practicing healthcare & clinical nursing writers on WhatsApp.",
            "whatsapp_msg": "Hi Academic Wizard, I need assistance with a Nursing reflective case study and care plan.",
            "imagen_prompt": (
                "Modern medical student study desk. Stethoscope resting on nursing textbook, laptop showing "
                "clinical trial data and patient care pathway, warm lighting, notebook with neat medical notes, 8k realistic."
            ),
        },
        # Day 2 (Wednesday): MBA & Strategic Management
        {
            "day": "Wednesday",
            "topic": "Mastering MBA Reports: Porter's, SWOT & Financial Ratios",
            "badge": "✦ MBA & BUSINESS MANAGEMENT ✦",
            "headline": "Executive Reports with Strategic Frameworks & Financial Modeling",
            "key_points": [
                "Move beyond definitions: Analyze strategic tension and competitive moats.",
                "Porter's Five Forces: Quantify buyer bargaining power against industry margins.",
                "PESTLE & VRIO: Connect macro-environmental risks to internal core competencies.",
                "Executive Summary: Deliver 3 actionable, budgeted recommendations with timeline.",
            ],
            "tool_url": f"{SITE_URL}/services/assignment-help/",
            "cta": "Get high-distinction MBA case studies, business proposals, and financial analysis drafted by postgrads.",
            "whatsapp_msg": "Hi Academic Wizard, I need expert help with my MBA Strategic Management assignment.",
            "imagen_prompt": (
                "High-rise executive office suite at dusk with city lights glowing outside. Modern glass desk, "
                "open MacBook with McKinsey-style slide deck and financial charts, Montblanc pen, espresso cup, cinematic."
            ),
        },
        # Day 3 (Thursday): Dissertation & Thesis Comprehensive Support
        {
            "day": "Thursday",
            "topic": "Dissertation Deadlines Approaching? Master the Literature Review Matrix",
            "badge": "✦ PH.D. & MASTER'S THESIS WRITERS ✦",
            "headline": "Synthesize 40+ Papers into a First-Class Literature Review",
            "key_points": [
                "Avoid summaries: Group studies by thematic debates and methodological divides.",
                "Expose the gap: Demonstrate why current research fails to answer your research question.",
                "Methodology design: Justify qualitative vs quantitative or mixed-methods sampling.",
                "SPSS, R & Python data analysis with full statistical interpretation write-ups.",
            ],
            "tool_url": f"{SITE_URL}/dissertation-help/",
            "cta": "From chapter-by-chapter drafting to full thesis proofreading, our PhD supervisors guide you.",
            "whatsapp_msg": "Hi Academic Wizard, I need help with my Master's Dissertation literature review & methodology.",
            "imagen_prompt": (
                "Historic university archive room. Long oak seminar table, stacks of research manuscripts, "
                "laptop displaying qualitative coding and thematic nodes, warm chandelier glow, dark academia aesthetic."
            ),
        },
        # Day 4 (Friday): 12-Hour Urgent Emergency Assignment Turnaround
        {
            "day": "Friday",
            "topic": "Assignment Due Tomorrow Morning and Haven't Started?",
            "badge": "✦ 12-HOUR URGENT ASSIGNMENT RESCUE ✦",
            "headline": "Don't Panic: 12-Hour Express Turnaround Available Right Now",
            "key_points": [
                "100% human-written academic work drafted by subject-matter postgraduates.",
                "Turnitin similarity report included with zero repository submission guarantee.",
                "All academic formats supported: Essays, reports, presentations, and code files.",
                "Instant WhatsApp response: Share your brief and get writers allocated in 15 minutes.",
            ],
            "tool_url": SITE_URL,
            "cta": "Midnight deadline panic? Our night-shift writers are online right now on WhatsApp.",
            "whatsapp_msg": "Hi Academic Wizard, I have an URGENT assignment due in 12-24 hours. Can you help?",
            "imagen_prompt": (
                "Dramatic late-night study desk. Glowing laptop screen illuminating student notes in a dark room, "
                "clock showing midnight, coffee mug, highlighter pens, intense academic focus, photorealistic."
            ),
        },
        # Day 5 (Saturday): Substantive Academic Proofreading & Editing
        {
            "day": "Saturday",
            "topic": "Why Grammarly Isn't Enough: Substantive Academic Proofreading",
            "badge": "✦ ACADEMIC EDITING & PROOFREADING ✦",
            "headline": "Turn a 2:2 into a First Class: Elevate Your Academic Tone",
            "key_points": [
                "Beyond typos: We refine academic register, argument flow, and transitional logic.",
                "Signposting: Ensuring paragraphs guide the marker directly through your thesis.",
                "Rubric alignment: Reviewing against your university's exact assessment criteria.",
                "Citation verification: Cross-checking in-text references against the bibliography.",
            ],
            "tool_url": f"{SITE_URL}/services/academic-editing/",
            "cta": "Send your draft via WhatsApp for substantive academic editing and rubric alignment.",
            "whatsapp_msg": "Hi Academic Wizard, I want to get my paper proofread and substantively edited.",
            "imagen_prompt": (
                "Editor's desk with red-pen annotations on printed manuscript pages. Laptop running Track Changes, "
                "reading glasses on mahogany table, soft ambient lighting, clean aesthetic, realistic."
            ),
        },
        # Day 6 (Sunday): Computer Science, Tech & Statistics Help
        {
            "day": "Sunday",
            "topic": "Stuck on Big-O Complexity, Python Code, or SPSS Analysis?",
            "badge": "✦ COMPUTER SCIENCE & DATA ANALYSIS ✦",
            "headline": "Clean Code, Algorithmic Analysis & Statistical Reports",
            "key_points": [
                "Code documentation: Detailed comments and architectural flowcharts included.",
                "Complexity analysis: Formal Big-O time and space complexity proofs.",
                "Quantitative statistics: SPSS, R, Python, and STATA regression analysis.",
                "Comprehensive write-up: Translating statistical outputs into APA-formatted findings.",
            ],
            "tool_url": f"{SITE_URL}/services/assignment-help/",
            "cta": "Message our computer science and quantitative analysis specialists on WhatsApp now.",
            "whatsapp_msg": "Hi Academic Wizard, I need help with my Coding / Statistics assignment.",
            "imagen_prompt": (
                "Dual-monitor developer workstation at night. Dark mode IDE with clean Python code, "
                "data visualization dashboard, mechanical keyboard with amber backlight, coffee mug, crisp modern tech."
            ),
        },
    ],
}


# ==============================================================================
# Helper Functions: Image & Copy Generation
# ==============================================================================
def pick_daily_recipe(slot: str, topic_idx: Optional[int] = None) -> Dict[str, Any]:
    """Select the appropriate content recipe based on day of week or manual index."""
    slot_recipes = ROTATION_MATRIX.get(slot, ROTATION_MATRIX["morning"])
    if topic_idx is not None and 0 <= topic_idx < len(slot_recipes):
        recipe = slot_recipes[topic_idx]
    else:
        # Default to day of week: Monday=0, Sunday=6
        day_idx = dt.datetime.now(dt.timezone.utc).weekday()
        recipe = slot_recipes[day_idx % len(slot_recipes)]
    return recipe


def get_system_font(size: int, bold: bool = False) -> ImageFont.ImageFont:
    """Load the best available TrueType font, falling back to default."""
    candidates = [
        # macOS
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
        "/System/Library/Fonts/SFNS.ttf",
        "/Library/Fonts/Arial.ttf",
        # Ubuntu / Linux
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
        "/usr/share/fonts/truetype/freefont/FreeSansBold.ttf" if bold else "/usr/share/fonts/truetype/freefont/FreeSans.ttf",
    ]
    for path in candidates:
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size=size)
            except Exception:
                continue
    try:
        return ImageFont.load_default(size=size)
    except Exception:
        return ImageFont.load_default()


def generate_infographic_card(recipe: Dict[str, Any], output_path: Path) -> Path:
    """
    Generate a 1080x1080 dark-academia infographic card using Pillow.
    Guaranteed to run in CI, offline, and without external API dependencies.
    """
    width, height = 1080, 1080
    image = Image.new("RGBA", (width, height), (11, 19, 43, 255))
    draw = ImageDraw.Draw(image)

    # 1. Background Gradient Simulation
    for y in range(height):
        ratio = y / height
        r = int(11 + (18 - 11) * ratio)
        g = int(19 + (30 - 19) * ratio)
        b = int(43 + (68 - 43) * ratio)
        draw.line([(0, y), (width, y)], fill=(r, g, b, 255))

    # 2. Gold Luxury Double Border
    gold = (212, 175, 55, 255)
    light_gold = (245, 230, 170, 255)
    draw.rectangle([30, 30, width - 30, height - 30], outline=gold, width=3)
    draw.rectangle([38, 38, width - 38, height - 38], outline=light_gold, width=1)

    # 3. Top Category Badge (Pill button with vector gold diamonds)
    badge_text = recipe.get("badge", "ACADEMIC WIZARD").replace("✦", "").replace("★", "").strip()
    font_badge = get_system_font(21, bold=True)
    bbox = draw.textbbox((0, 0), badge_text, font=font_badge)
    badge_w = bbox[2] - bbox[0]
    badge_h = bbox[3] - bbox[1]
    pill_x1 = (width - badge_w) // 2 - 45
    pill_y1 = 65
    pill_x2 = pill_x1 + badge_w + 90
    pill_y2 = pill_y1 + badge_h + 20
    draw.rounded_rectangle([pill_x1, pill_y1, pill_x2, pill_y2], radius=15, fill=(20, 35, 75, 230), outline=gold, width=2)
    # Left & right vector gold diamonds
    mid_y = pill_y1 + (pill_y2 - pill_y1) // 2
    d_pill = 6
    draw.polygon([(pill_x1 + 25, mid_y - d_pill), (pill_x1 + 25 + d_pill, mid_y), (pill_x1 + 25, mid_y + d_pill), (pill_x1 + 25 - d_pill, mid_y)], fill=gold)
    draw.text((pill_x1 + 45, pill_y1 + 8), badge_text, fill=light_gold, font=font_badge)
    draw.polygon([(pill_x2 - 25, mid_y - d_pill), (pill_x2 - 25 + d_pill, mid_y), (pill_x2 - 25, mid_y + d_pill), (pill_x2 - 25 - d_pill, mid_y)], fill=gold)

    # 4. Main Headline (Multi-line wrapping)
    headline = recipe.get("headline", "Ace Your University Assignments")
    font_headline = get_system_font(42, bold=True)

    words = headline.split()
    headline_lines = []
    curr_line = []
    for w in words:
        test_line = " ".join(curr_line + [w])
        tb = draw.textbbox((0, 0), test_line, font=font_headline)
        if (tb[2] - tb[0]) <= 940:
            curr_line.append(w)
        else:
            if curr_line:
                headline_lines.append(" ".join(curr_line))
            curr_line = [w]
    if curr_line:
        headline_lines.append(" ".join(curr_line))

    y_head = 145
    for line in headline_lines[:2]:
        tb = draw.textbbox((0, 0), line, font=font_headline)
        lx = (width - (tb[2] - tb[0])) // 2
        # Drop shadow
        draw.text((lx + 2, y_head + 2), line, fill=(0, 0, 0, 180), font=font_headline)
        draw.text((lx, y_head), line, fill=(255, 255, 255, 255), font=font_headline)
        y_head += 54

    # 5. Feature Card Box (Glassmorphic Container)
    box_x1, box_y1 = 70, y_head + 30
    box_x2, box_y2 = width - 70, height - 175
    draw.rounded_rectangle([box_x1, box_y1, box_x2, box_y2], radius=20, fill=(15, 25, 55, 235), outline=(55, 80, 140, 200), width=2)

    # Left accent gold ribbon inside the card
    draw.line([(box_x1 + 6, box_y1 + 12), (box_x1 + 6, box_y2 - 12)], fill=gold, width=4)

    # 6. Key Bullet Points with Vector Diamonds & Wrapping
    key_points = recipe.get("key_points", [])
    font_bullet = get_system_font(25, bold=False)
    font_bullet_bold = get_system_font(26, bold=True)
    bullet_y = box_y1 + 35
    max_text_w = box_x2 - box_x1 - 100

    for idx, pt in enumerate(key_points[:4]):
        # Draw crisp vector diamond bullet
        diamond_cx = box_x1 + 45
        diamond_cy = bullet_y + 14
        d_size = 7
        draw.polygon(
            [
                (diamond_cx, diamond_cy - d_size),
                (diamond_cx + d_size, diamond_cy),
                (diamond_cx, diamond_cy + d_size),
                (diamond_cx - d_size, diamond_cy),
            ],
            fill=gold,
        )

        if ":" in pt:
            lead, rest = pt.split(":", 1)
            lead_text = lead.strip() + ": "
            tb_lead = draw.textbbox((0, 0), lead_text, font=font_bullet_bold)
            lead_w = tb_lead[2] - tb_lead[0]
            draw.text((box_x1 + 70, bullet_y), lead_text, fill=light_gold, font=font_bullet_bold)

            # Wrap rest of the text if needed
            words_rest = rest.strip().split()
            lines = []
            c_line = []
            first_line = True
            for w in words_rest:
                avail_w = max_text_w - lead_w if first_line else max_text_w
                test = " ".join(c_line + [w])
                tb_test = draw.textbbox((0, 0), test, font=font_bullet)
                if (tb_test[2] - tb_test[0]) <= avail_w:
                    c_line.append(w)
                else:
                    if c_line:
                        lines.append(" ".join(c_line))
                    c_line = [w]
                    first_line = False
            if c_line:
                lines.append(" ".join(c_line))

            if lines:
                draw.text((box_x1 + 70 + lead_w, bullet_y), lines[0], fill=(235, 240, 250, 255), font=font_bullet)
                sub_y = bullet_y + 34
                for sub_line in lines[1:2]:
                    draw.text((box_x1 + 70, sub_y), sub_line, fill=(235, 240, 250, 255), font=font_bullet)
                    sub_y += 34
                bullet_y += 38 + (len(lines) - 1) * 34
            else:
                bullet_y += 75
        else:
            draw.text((box_x1 + 70, bullet_y), pt, fill=(235, 240, 250, 255), font=font_bullet)
            bullet_y += 75

        bullet_y += 18

    # 7. Bottom Branding & WhatsApp CTA Bar
    bottom_y = height - 145
    draw.line([(60, bottom_y), (width - 60, bottom_y)], fill=(50, 75, 120, 180), width=1)

    logo_w = 0
    if LOGO_NAV_PATH.exists():
        try:
            with Image.open(LOGO_NAV_PATH) as logo_img:
                logo_resized = logo_img.convert("RGBA").resize((70, 70), Image.Resampling.LANCZOS)
                image.paste(logo_resized, (75, bottom_y + 20), logo_resized)
                logo_w = 85
        except Exception as e:
            print(f"  ⚠️ Logo overlay skipped: {e}")

    font_brand = get_system_font(30, bold=True)
    draw.text((75 + logo_w, bottom_y + 35), "academicwizard.online", fill=(255, 255, 255, 255), font=font_brand)

    font_wa = get_system_font(23, bold=True)
    wa_text = f"WhatsApp: {WHATSAPP_DISPLAY}"
    tb_wa = draw.textbbox((0, 0), wa_text, font=font_wa)
    wa_w = tb_wa[2] - tb_wa[0]
    wa_box_x1 = width - wa_w - 90
    wa_box_y1 = bottom_y + 22
    wa_box_x2 = width - 65
    wa_box_y2 = wa_box_y1 + 55
    draw.rounded_rectangle([wa_box_x1, wa_box_y1, wa_box_x2, wa_box_y2], radius=12, fill=(37, 211, 102, 240))
    draw.text((wa_box_x1 + 16, wa_box_y1 + 13), wa_text, fill=(255, 255, 255, 255), font=font_wa)

    rgb_image = image.convert("RGB")
    rgb_image.save(output_path, "PNG", quality=95)
    print(f"  ✅ High-design infographic card saved: {output_path}")
    return output_path


def stamp_logo_and_watermark(image_path: Path, output_path: Path) -> Path:
    """Overlay Academic Wizard logo & watermark on an AI-generated photo."""
    with Image.open(image_path) as base_img:
        base_img = base_img.convert("RGBA")
        width, height = base_img.size

        overlay = Image.new("RGBA", (width, height), (0, 0, 0, 0))
        draw = ImageDraw.Draw(overlay)

        banner_h = 130
        for y in range(height - banner_h, height):
            alpha = int(220 * ((y - (height - banner_h)) / banner_h))
            draw.line([(0, y), (width, y)], fill=(10, 15, 30, alpha))

        logo_w = 0
        if LOGO_NAV_PATH.exists():
            try:
                with Image.open(LOGO_NAV_PATH) as logo_img:
                    logo_resized = logo_img.convert("RGBA").resize((75, 75), Image.Resampling.LANCZOS)
                    overlay.paste(logo_resized, (60, height - 105), logo_resized)
                    logo_w = 90
            except Exception as e:
                print(f"  ⚠️ Watermark logo skipped: {e}")

        font_brand = get_system_font(30, bold=True)
        draw.text((60 + logo_w, height - 85), "academicwizard.online", fill=(255, 255, 255, 255), font=font_brand)

        font_wa = get_system_font(24, bold=True)
        wa_text = f"WhatsApp: {WHATSAPP_DISPLAY}"
        tb = draw.textbbox((0, 0), wa_text, font=font_wa)
        wa_w = tb[2] - tb[0]
        wa_x1 = width - wa_w - 90
        wa_y1 = height - 95
        draw.rounded_rectangle([wa_x1, wa_y1, width - 50, wa_y1 + 52], radius=10, fill=(37, 211, 102, 230))
        draw.text((wa_x1 + 18, wa_y1 + 10), wa_text, fill=(255, 255, 255, 255), font=font_wa)

        combined = Image.alpha_composite(base_img, overlay)
        combined.convert("RGB").save(output_path, "PNG", quality=95)
        print(f"  ✅ Stamped branded watermark on AI image: {output_path}")
        return output_path


def generate_ai_image(prompt: str, output_path: Path) -> Optional[Path]:
    """Attempt image generation via Imagen 3 (google-genai SDK or REST API)."""
    if not GEMINI_API_KEY:
        print("  ℹ️ GEMINI_API_KEY not configured. Skipping Imagen 3 API call.")
        return None

    # Method 1: Attempt google-genai SDK
    try:
        from google import genai
        client = genai.Client(api_key=GEMINI_API_KEY)
        result = client.models.generate_images(
            model="imagen-3.0-generate-002",
            prompt=prompt,
            config=dict(
                number_of_images=1,
                output_mime_type="image/jpeg",
                aspect_ratio="1:1",
            ),
        )
        if result.generated_images:
            raw_bytes = result.generated_images[0].image.image_bytes
            temp_path = output_path.with_suffix(".tmp.jpg")
            with open(temp_path, "wb") as f:
                f.write(raw_bytes)
            stamp_logo_and_watermark(temp_path, output_path)
            temp_path.unlink(missing_ok=True)
            print("  ✨ Successfully generated image via Imagen 3 SDK!")
            return output_path
    except Exception as exc:
        print(f"  ⚠️ Imagen 3 SDK generation failed or unavailable ({exc}). Trying REST endpoint...")

    # Method 2: Attempt REST API endpoint
    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key={GEMINI_API_KEY}"
        payload = {
            "instances": [{"prompt": prompt}],
            "parameters": {
                "sampleCount": 1,
                "aspectRatio": "1:1",
                "outputOptions": {"mimeType": "image/jpeg"},
            },
        }
        res = requests.post(url, json=payload, timeout=30)
        if res.status_code == 200:
            data = res.json()
            preds = data.get("predictions", [])
            if preds and "bytesBase64Encoded" in preds[0]:
                raw_bytes = base64.b64decode(preds[0]["bytesBase64Encoded"])
                temp_path = output_path.with_suffix(".tmp.jpg")
                with open(temp_path, "wb") as f:
                    f.write(raw_bytes)
                stamp_logo_and_watermark(temp_path, output_path)
                temp_path.unlink(missing_ok=True)
                print("  ✨ Successfully generated image via Imagen 3 REST API!")
                return output_path
    except Exception as exc:
        print(f"  ⚠️ Imagen 3 REST fallback failed: {exc}")

    return None


def generate_copy_with_gemini(recipe: Dict[str, Any], slot: str) -> Dict[str, str]:
    """Generate platform-adapted copy (Instagram, Twitter, Facebook) using Gemini Pro."""
    wa_url = generate_whatsapp_link(recipe["whatsapp_msg"])
    tool_url = recipe["tool_url"]

    fallback_copy = {
        "instagram": (
            f"📌 {recipe['headline']}\n\n"
            + "\n".join(f"• {pt}" for pt in recipe["key_points"])
            + f"\n\n🔗 100% Free Tools & Guides: {tool_url}\n"
            + f"💬 24/7 Assignment Support: WhatsApp {WHATSAPP_DISPLAY}\n\n"
            + "#academicwizard #assignmenthelp #universitylife #studygram #collegelife "
            + "#studenttips #dissertation #academicwriting #essayhelp #ukstudents"
        ),
        "twitter": (
            f"🎯 {recipe['headline']}\n\n"
            + f"• {recipe['key_points'][0]}\n"
            + f"• {recipe['key_points'][1]}\n\n"
            + f"Free student tools & guides: {tool_url}\n"
            + f"Need 12h urgent help? WhatsApp: {WHATSAPP_DISPLAY}\n"
            + "#AssignmentHelp #StudyTips"
        ),
        "facebook": (
            f"🎓 {recipe['headline']}\n\n"
            + "Whether you're writing a coursework essay, case study, or master's dissertation, keep these key standards in mind:\n\n"
            + "\n".join(f"✔ {pt}" for pt in recipe["key_points"])
            + f"\n\n🛠 Explore our free academic tools and citation generators: {tool_url}\n\n"
            + f"🚨 Under a tight deadline? Our qualified academic writers and subject specialists are available 24/7.\n"
            + f"Chat directly with our team on WhatsApp: {wa_url}\n\n"
            + "Save this post for your next assignment!"
        ),
    }

    if not GEMINI_API_KEY:
        return fallback_copy

    system_prompt = (
        "You are an elite academic social media marketing copywriter for Academic Wizard (academicwizard.online). "
        "Your audience consists of international university students in the UK, USA, Australia, Canada, and Singapore. "
        "Your tone is empowering, authoritative, practical, and highly engaging (dark-academia student vibe).\n\n"
        "Generate 3 distinct copy variations in strict JSON format:\n"
        "1. 'instagram': High-engagement format. Engaging opening hook line, bulleted actionable breakdown with emojis, "
        "clear call-to-action mentioning free tools and WhatsApp consultation, and 15-18 targeted hashtags.\n"
        "2. 'twitter': Punchy post under 270 characters including tool URL and 2-3 hashtags.\n"
        "3. 'facebook': Community post format with story/context, formatted takeaways, clear links to tools and WhatsApp.\n\n"
        "Output ONLY valid JSON."
    )

    user_prompt = f"""
Slot: {slot.upper()}
Topic: {recipe['topic']}
Headline: {recipe['headline']}
Key Points: {json.dumps(recipe['key_points'])}
Tool URL: {tool_url}
WhatsApp CTA URL: {wa_url}
WhatsApp Number: {WHATSAPP_DISPLAY}
"""

    try:
        api_url = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={GEMINI_API_KEY}"
        payload = {
            "contents": [{"parts": [{"text": f"{system_prompt}\n\n{user_prompt}"}]}],
            "generationConfig": {"temperature": 0.7, "maxOutputTokens": 1000},
        }
        res = requests.post(api_url, json=payload, timeout=25)
        if res.status_code == 200:
            data = res.json()
            raw_text = data["candidates"][0]["content"]["parts"][0]["text"].strip()
            if raw_text.startswith("```json"):
                raw_text = raw_text[7:]
            elif raw_text.startswith("```"):
                raw_text = raw_text[3:]
            if raw_text.endswith("```"):
                raw_text = raw_text[:-3]

            parsed = json.loads(raw_text.strip())
            if "instagram" in parsed and "twitter" in parsed and "facebook" in parsed:
                print("  ✨ Gemini Pro successfully synthesized platform copy!")
                return parsed
    except Exception as exc:
        print(f"  ⚠️ Gemini copy generation fallback: {exc}")

    return fallback_copy


# ==============================================================================
# Buffer API Client (GraphQL + REST Fallback)
# ==============================================================================
class BufferClient:
    """Client for publishing social media updates via Buffer (GraphQL + REST)."""

    def __init__(self, access_token: str, dry_run: bool = False):
        self.token = access_token
        self.dry_run = dry_run
        self.graphql_url = "https://api.buffer.com"
        self.rest_base = "https://api.bufferapp.com/1"
        self.headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json",
        }

    def get_channels_graphql(self) -> List[Dict[str, Any]]:
        """Fetch connected channels using GraphQL."""
        query_orgs = """
        query GetOrgs {
          account {
            id
            organizations {
              id
              name
            }
          }
        }
        """
        try:
            res = requests.post(self.graphql_url, headers=self.headers, json={"query": query_orgs}, timeout=15)
            if res.status_code != 200:
                return []

            data = res.json().get("data", {})
            orgs = data.get("account", {}).get("organizations", [])
            if not orgs:
                return []

            org_id = orgs[0]["id"]

            query_channels = """
            query GetChannels($orgId: ID!) {
              channels(input: { organizationId: $orgId }) {
                id
                name
                service
              }
            }
            """
            res = requests.post(
                self.graphql_url,
                headers=self.headers,
                json={"query": query_channels, "variables": {"orgId": org_id}},
                timeout=15,
            )
            if res.status_code != 200:
                return []

            channels = res.json().get("data", {}).get("channels", [])
            return channels
        except Exception as e:
            print(f"  ⚠️ Buffer GraphQL channel query error: {e}")
            return []

    def get_profiles_rest(self) -> List[Dict[str, Any]]:
        """Fetch profiles via legacy REST API as fallback."""
        url = f"{self.rest_base}/profiles.json?access_token={self.token}"
        try:
            res = requests.get(url, timeout=15)
            if res.status_code == 200:
                profiles = res.json()
                return [
                    {"id": p.get("id"), "name": p.get("formatted_username", p.get("service_username", "")), "service": p.get("service")}
                    for p in profiles
                ]
        except Exception as e:
            print(f"  ⚠️ Buffer REST profiles query failed: {e}")
        return []

    def get_all_profiles(self) -> List[Dict[str, Any]]:
        """Discover all connected profiles through GraphQL, with REST fallback."""
        if self.dry_run or not self.token:
            return [
                {"id": "simulated_ig_1", "name": "academicwizard (IG)", "service": "instagram"},
                {"id": "simulated_fb_1", "name": "Academic Wizard (FB)", "service": "facebook"},
                {"id": "simulated_tw_1", "name": "AcademicWizardX (Twitter)", "service": "twitter"},
            ]

        channels = self.get_channels_graphql()
        if channels:
            print(f"  ✅ Retrieved {len(channels)} channels via Buffer GraphQL API.")
            return channels

        profiles = self.get_profiles_rest()
        if profiles:
            print(f"  ✅ Retrieved {len(profiles)} profiles via Buffer REST API.")
            return profiles

        return []

    def create_post_graphql(self, channel_id: str, text: str, image_url: Optional[str], force_publish: bool) -> bool:
        """Publish or schedule post via Buffer GraphQL API."""
        mode = "shareNow" if force_publish else "addToQueue"

        mutation = """
        mutation CreatePost($input: CreatePostInput!) {
          createPost(input: $input) {
            ... on PostActionSuccess {
              post {
                id
                text
              }
            }
            ... on MutationError {
              message
            }
          }
        }
        """

        input_payload: Dict[str, Any] = {
            "channelId": channel_id,
            "text": text,
            "schedulingType": "automatic",
            "mode": mode,
        }

        if image_url:
            input_payload["assets"] = [{"image": {"url": image_url}}]

        try:
            res = requests.post(
                self.graphql_url,
                headers=self.headers,
                json={"query": mutation, "variables": {"input": input_payload}},
                timeout=20,
            )
            if res.status_code == 200:
                data = res.json().get("data", {}).get("createPost", {})
                if "post" in data:
                    post_id = data["post"].get("id")
                    print(f"    🎉 Success! Buffer Post ID: {post_id} (mode={mode})")
                    return True
                elif "message" in data:
                    print(f"    ⚠️ Buffer GraphQL MutationError: {data['message']}")
            else:
                print(f"    ⚠️ Buffer GraphQL HTTP {res.status_code}: {res.text}")
        except Exception as e:
            print(f"    ⚠️ Buffer GraphQL request error: {e}")

        return False

    def create_post_rest(self, profile_id: str, text: str, image_url: Optional[str], force_publish: bool) -> bool:
        """Publish or schedule post via legacy REST API as fallback."""
        url = f"{self.rest_base}/updates/create.json"
        data: Dict[str, Any] = {
            "access_token": self.token,
            "profile_ids[]": [profile_id],
            "text": text,
            "now": "true" if force_publish else "false",
        }
        if image_url:
            data["media[photo]"] = image_url

        try:
            res = requests.post(url, data=data, timeout=20)
            if res.status_code == 200:
                print(f"    🎉 Success via REST API!")
                return True
            else:
                print(f"    ⚠️ Buffer REST HTTP {res.status_code}: {res.text}")
        except Exception as e:
            print(f"    ⚠️ Buffer REST request error: {e}")

        return False

    def dispatch(self, channel: Dict[str, Any], text: str, image_url: Optional[str], force_publish: bool) -> bool:
        """Send post to a channel, handling dry-run and dual API dispatch."""
        ch_id = channel["id"]
        ch_name = channel.get("name", ch_id)
        ch_service = channel.get("service", "unknown")

        if self.dry_run or not self.token:
            print(f"    [DRY-RUN] Simulating Buffer post to {ch_service} ('{ch_name}')...")
            print(f"    Image URL: {image_url}")
            print(f"    Text Preview: {text[:140]}...")
            return True

        success = self.create_post_graphql(ch_id, text, image_url, force_publish)
        if not success:
            print(f"    Attempting REST fallback for profile {ch_name}...")
            success = self.create_post_rest(ch_id, text, image_url, force_publish)

        return success


# ==============================================================================
# Main Orchestrator
# ==============================================================================
def run(slot: str, dry_run: bool, force_publish: bool, topic_idx: Optional[int], skip_image: bool):
    print("=" * 70)
    print(f"🚀 Academic Wizard Social Media Automation Engine")
    print(f"📅 Slot: {slot.upper()} | UTC Time: {dt.datetime.now(dt.timezone.utc).strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"⚙️  Dry Run: {dry_run} | Force Publish: {force_publish}")
    print("=" * 70)

    recipe = pick_daily_recipe(slot, topic_idx)
    print(f"\n📋 Selected Topic: {recipe['topic']}")
    print(f"📌 Headline: {recipe['headline']}")

    date_str = dt.datetime.now(dt.timezone.utc).strftime("%Y%m%d")
    daily_slot_filename = f"daily_{slot}.png"
    daily_slot_path = PUBLIC_SOCIAL_DIR / daily_slot_filename
    archive_slot_path = PUBLIC_SOCIAL_DIR / f"{date_str}_{slot}.png"

    image_generated = False
    if not skip_image:
        print("\n🎨 Generating Social Visual Asset...")
        if GEMINI_API_KEY and not dry_run:
            ai_img = generate_ai_image(recipe["imagen_prompt"], daily_slot_path)
            if ai_img:
                image_generated = True

        if not image_generated:
            generate_infographic_card(recipe, daily_slot_path)
            image_generated = True

        if daily_slot_path.exists():
            with open(daily_slot_path, "rb") as f_in, open(archive_slot_path, "wb") as f_out:
                f_out.write(f_in.read())

    public_image_url = f"{RAW_GITHUB_BASE}/public/social/{daily_slot_filename}"
    print(f"\n🌐 Buffer Public Image URL: {public_image_url}")

    print("\n✍️ Generating Platform Copy (Instagram, Twitter, Facebook)...")
    copy_dict = generate_copy_with_gemini(recipe, slot)

    print("\n📡 Connecting to Buffer...")
    buffer_client = BufferClient(access_token=BUFFER_ACCESS_TOKEN, dry_run=dry_run)
    channels = buffer_client.get_all_profiles()

    if not channels:
        print("  ⚠️ No Buffer channels found. Please ensure BUFFER_ACCESS_TOKEN is configured in GitHub Secrets.")
        return

    print(f"  Found {len(channels)} connected channel(s): {[c.get('service') for c in channels]}")

    for channel in channels:
        service = channel.get("service", "").lower()
        print(f"\n  📤 Dispatching to channel: {channel.get('name')} ({service})...")

        if "twitter" in service or "x" in service:
            text = copy_dict.get("twitter", copy_dict.get("facebook"))
        elif "instagram" in service:
            text = copy_dict.get("instagram", copy_dict.get("facebook"))
        else:
            text = copy_dict.get("facebook", copy_dict.get("instagram"))

        buffer_client.dispatch(
            channel=channel,
            text=text,
            image_url=public_image_url if image_generated else None,
            force_publish=force_publish,
        )

    print("\n" + "=" * 70)
    print("✅ Social Automation Cycle Finished Successfully!")
    print("=" * 70)


def main():
    parser = argparse.ArgumentParser(description="Academic Wizard Autonomous Social Media Poster")
    parser.add_argument(
        "--slot",
        choices=["morning", "evening", "auto"],
        default="auto",
        help="Posting slot: morning (tools) or evening (services). 'auto' detects from current UTC hour.",
    )
    parser.add_argument("--dry-run", action="store_true", help="Simulate posting without calling Buffer API")
    parser.add_argument("--force-publish", action="store_true", help="Publish immediately rather than adding to queue")
    parser.add_argument("--topic-idx", type=int, default=None, help="Override recipe index (0-6)")
    parser.add_argument("--skip-image", action="store_true", help="Skip image generation for quick text tests")

    args = parser.parse_args()

    if args.slot == "auto":
        curr_utc_hour = dt.datetime.now(dt.timezone.utc).hour
        slot = "morning" if 6 <= curr_utc_hour < 14 else "evening"
    else:
        slot = args.slot

    run(
        slot=slot,
        dry_run=args.dry_run,
        force_publish=args.force_publish,
        topic_idx=args.topic_idx,
        skip_image=args.skip_image,
    )


if __name__ == "__main__":
    main()
