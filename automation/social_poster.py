#!/usr/bin/env python3
"""
Autonomous 2x Daily Social Media Carousel & Content Engine for Academic Wizard.
Publishes 4-slide infographic carousels to Instagram, Facebook, and Twitter (X) via Buffer.

Features:
- 4-Slide Editorial Infographic Carousels per post:
    * Slide 1: High-Impact Hook & Problem Cover Card
    * Slide 2: The Core Comparison (❌ 2:2 Trap vs. ✅ 1st Class Blueprint)
    * Slide 3: The Exact Step-by-Step Formula & Real Academic Example
    * Slide 4: Rubric Pre-Submission Checklist & Dual WhatsApp/Tool CTA
- Real high-utility academic IP across 14 weekly recipes (7 Morning Tools + 7 Evening Services)
- Platform-tailored copy generation:
    * Instagram: Carousel outline, slide cues, save reminders, 18 targeted hashtags
    * Twitter: Punchy thread-starter (< 280 chars) with 4-card preview
    * Facebook: Full community study guide with formatted subheadings
- Dual Buffer API dispatcher (GraphQL assets array + REST extra_media fallback)
"""

import argparse
import base64
import datetime as dt
import io
import json
import os
import re
import random
import sys
import time
import urllib.parse
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import requests
from PIL import Image, ImageDraw, ImageFont, ImageFilter

# ==============================================================================
# Configuration & Constants
# ==============================================================================
SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent
PUBLIC_SOCIAL_DIR = PROJECT_ROOT / "public" / "social"
PUBLIC_SOCIAL_DIR.mkdir(parents=True, exist_ok=True)

LOGO_HIGHRES_PATH = PROJECT_ROOT / "src" / "assets" / "academic-wizard-logo.webp"
LOGO_NAV_PATH = PROJECT_ROOT / "public" / "academic-wizard-logo-nav.webp"

# Modern Minimal Light Theme Palette
BG_LIGHT      = (248, 249, 250)       # Clean off-white background
BG_WHITE      = (255, 255, 255)       # Pure white card background
BG_WARM       = (254, 252, 248)       # Warm cream background for reels
CHARCOAL      = (26, 26, 46)          # Primary dark typography
SLATE         = (71, 85, 105)         # Secondary body text
MUTED         = (148, 163, 184)       # Captions & subtitles
GOLD          = (212, 175, 55)        # Brand gold accent
GOLD_LIGHT    = (251, 243, 219)       # Soft gold tint
EMERALD       = (16, 185, 129)        # Success / 1st-class checkmarks
EMERALD_LIGHT = (236, 253, 245)       # Soft emerald tint
CORAL         = (239, 68, 68)         # Common trap / mistake coral
CORAL_LIGHT   = (254, 242, 242)       # Soft coral tint
AMBER         = (245, 158, 11)        # Kinetic subtitle active highlight
BRAND_NAVY    = (15, 23, 42)          # Deep contrast navy
WA_GREEN      = (37, 211, 102)        # WhatsApp official green

BUFFER_ACCESS_TOKEN = os.getenv("BUFFER_ACCESS_TOKEN", "").strip()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip() or os.getenv("BACKLINK_GEMINI_API_KEY", "").strip()
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash").strip()

SITE_URL = os.getenv("SITE_URL", "https://academicwizard.online").rstrip("/")
GITHUB_REPO = os.getenv("GITHUB_REPOSITORY", "suurrya7/Academic-Wizard")
GITHUB_BRANCH = os.getenv("GITHUB_REF_NAME", "main")
RAW_GITHUB_BASE = f"https://raw.githubusercontent.com/{GITHUB_REPO}/{GITHUB_BRANCH}"

WHATSAPP_NUMBER = "919509893638"
WHATSAPP_DISPLAY = "+91 95098 93638"


def get_cropped_logo() -> Optional[Image.Image]:
    """Load authentic Academic Wizard logo and crop to bounding box."""
    target = LOGO_HIGHRES_PATH if LOGO_HIGHRES_PATH.exists() else LOGO_NAV_PATH
    if not target.exists():
        return None
    try:
        with Image.open(target) as raw:
            rgba = raw.convert("RGBA")
            bbox = rgba.getbbox()
            return rgba.crop(bbox) if bbox else rgba
    except Exception as e:
        print(f"  ⚠️ Logo loading error: {e}")
        return None


def generate_whatsapp_link(message: str) -> str:
    """Create a pre-filled WhatsApp click-to-chat URL."""
    encoded = urllib.parse.quote(message)
    return f"https://wa.me/{WHATSAPP_NUMBER}?text={encoded}"


# ==============================================================================
# 14-Recipe High-Utility Academic Curriculum (7 Days x 2 Slots)
# ==============================================================================
ROTATION_MATRIX = {
    "morning": [
        # Monday (Day 0): In-Text Citations
        {
            "day": "Monday",
            "format": "comparison",
            "topic": "In-Text Citations: APA 7th vs Harvard vs OSCOLA",
            "badge": "ACADEMIC WEAPON: CITATION MATRIX",
            "hook_headline": "Never Lose Marks on In-Text Citations Again",
            "hook_sub": "Up to 15% of university marks are penalized purely for inconsistent referencing, missing page pinpoints, and improper author syntax.",
            "hook_bullets": [
                "Direct quotes always require exact page numbers; paraphrasing does not.",
                "UK Law dissertations penalize full stops inside OSCOLA footnotes.",
            ],
            "comparison": {
                "trap_title": "THE COMMON 2:2 TRAP",
                "trap_text": "Using (Smith, 2020) everywhere without page numbers, mixing Harvard colon formats with APA comma rules, and putting full stops inside OSCOLA abbreviations.",
                "fix_title": "THE 1ST CLASS BLUEPRINT",
                "fix_text": "APA 7th: (Smith, 2020, p. 45) for quotes. Harvard: (Smith 2020: 45). OSCOLA: Put citation in numerical footnotes without brackets or punctuation.",
            },
            "formula": {
                "title": "The Exact Referencing Architecture",
                "steps": [
                    {"num": "01", "label": "Direct Quotes", "desc": "Author (Year, p. 45) + verbatim quotation enclosed in speech marks."},
                    {"num": "02", "label": "Paraphrase", "desc": "(Author, Year) — zero page number needed unless pinpointing a concept."},
                    {"num": "03", "label": "3+ Authors", "desc": "Use (FirstAuthor et al., Year) right from the first citation in APA 7th."},
                ],
                "exemplar": "Example: According to Davis (2024, p. 112), 'empirical rigor requires precise attribution.'",
            },
            "checklist": [
                "Every in-text citation has a corresponding match in your bibliography.",
                "Direct quotations include specific page (p. 45) or paragraph pinpoints.",
                "OSCOLA footnotes are numbered consecutively without parentheses.",
                "Sources published in the last 5 years account for 70%+ of citations.",
            ],
            "tool_url": f"{SITE_URL}/tools/",
            "cta_text": "Generate accurate APA, Harvard, and OSCOLA citations instantly with our free tools.",
            "whatsapp_msg": "Hi Academic Wizard, I need help formatting my citations and references for my paper.",
        },
        # Tuesday (Day 1): Academic Research & Boolean Search
        {
            "day": "Tuesday",
            "format": "comparison",
            "topic": "5 Free Academic Search Engines & Boolean Strings",
            "badge": "RESEARCH STRATEGY: LITERATURE SEARCH",
            "hook_headline": "Stop Relying Solely on Google Scholar",
            "hook_sub": "Most students search with single keywords and hit paywalls. First-Class researchers use specialized open-access databases and Boolean operators.",
            "hook_bullets": [
                "Google Scholar indexes low-quality predatory journals alongside reputable papers.",
                "Boolean search strings instantly filter 10,000 irrelevant results down to 20 peer-reviewed gems.",
            ],
            "comparison": {
                "trap_title": "THE COMMON 2:2 TRAP",
                "trap_text": "Typing 'nursing care elderly' into Google Scholar and citing blogs, outdated 2011 textbooks, or paywalled abstracts without reading the methodology.",
                "fix_title": "THE 1ST CLASS BLUEPRINT",
                "fix_text": "Using CORE, BASE, and Semantic Scholar with precise Boolean strings: (\"nursing care\" OR \"geriatric\") AND (\"interventions\") AND (\"2022\"..\"2026\").",
            },
            "formula": {
                "title": "The Boolean Search Operator Blueprint",
                "steps": [
                    {"num": "01", "label": "Quotation Marks", "desc": "Use \"nursing interventions\" to search exact multi-word phrases."},
                    {"num": "02", "label": "OR Operator", "desc": "Group synonyms: (dementia OR Alzheimer's) to capture all related literature."},
                    {"num": "03", "label": "AND Operator", "desc": "Connect core themes: (\"clinical trial\" AND \"outcomes\") to filter results."},
                ],
                "exemplar": "Query: (\"digital marketing\" OR \"e-commerce\") AND (\"consumer behavior\") AND (\"SMEs\")",
            },
            "checklist": [
                "Searched CORE or Semantic Scholar for unpaywalled full-text PDFs.",
                "Filtered publication date to the last 3-5 years (2021-2026).",
                "Verified journals are indexed in Scopus, Web of Science, or PubMed.",
                "Saved DOIs and persistent URLs for reference management.",
            ],
            "tool_url": f"{SITE_URL}/tools/",
            "cta_text": "Explore free research guides, topic databases, and word count calculators at Academic Wizard.",
            "whatsapp_msg": "Hi Academic Wizard, I need help finding peer-reviewed sources for my literature review.",
        },
        # Wednesday (Day 2): Essay Structure & The P-E-E-L+E Formula
        {
            "day": "Wednesday",
            "format": "comparison",
            "topic": "The 10-80-10 Rule & P-E-E-L+E Essay Blueprint",
            "badge": "ESSAY ARCHITECTURE: FIRST CLASS FORMULA",
            "hook_headline": "Structure Any 2,500-Word Essay Without Fluff",
            "hook_sub": "Tutors grade essay structure in the first 60 seconds. A meandering introduction or descriptive body paragraphs will lock your paper at 58%.",
            "hook_bullets": [
                "Descriptive writing tells the marker WHAT happened (capped at 2:2).",
                "Critical writing analyzes WHY it matters and HOW evidence conflicts (70%+).",
            ],
            "comparison": {
                "trap_title": "THE COMMON 2:2 TRAP",
                "trap_text": "Writing long storytelling paragraphs with no clear topic sentence, quoting huge blocks of text, and introducing new arguments in the conclusion.",
                "fix_title": "THE 1ST CLASS BLUEPRINT",
                "fix_text": "Apply the 10-80-10 distribution: 250w Intro + 4 thematic sections of 500w using P-E-E-L+E + 250w synthesis Conclusion with zero new evidence.",
            },
            "formula": {
                "title": "The P-E-E-L+E First-Class Paragraph Engine",
                "steps": [
                    {"num": "01", "label": "Point & Evidence", "desc": "Bold claim linked to thesis statement + empirical citation."},
                    {"num": "02", "label": "Explanation", "desc": "Critical breakdown of theoretical mechanisms and methodology."},
                    {"num": "03", "label": "Link & Evaluation", "desc": "Contrast with counter-arguments and link directly to the assignment prompt."},
                ],
                "exemplar": "Formula: Point (20%) + Evidence (25%) + Analysis (35%) + Evaluation/Link (20%).",
            },
            "checklist": [
                "Introduction contains a definitive thesis statement and signposting.",
                "Each body paragraph begins with a clear analytical topic sentence.",
                "Every major paragraph includes critical evaluation of limitations.",
                "Conclusion answers the assignment question without adding new citations.",
            ],
            "tool_url": f"{SITE_URL}/tools/",
            "cta_text": "Plan your essay word counts, paragraph targets, and margins with our free calculators.",
            "whatsapp_msg": "Hi Academic Wizard, I need help structuring and outlining my university essay.",
        },
        # Thursday (Day 3): Dissertation Thesis & Hypotheses
        {
            "day": "Thursday",
            "format": "comparison",
            "topic": "Turning Broad Topics into First-Class Hypotheses",
            "badge": "DISSERTATION TOOLKIT: RESEARCH QUESTIONS",
            "hook_headline": "How to Formulate a Bulletproof Thesis Statement",
            "hook_sub": "A weak thesis is the #1 reason dissertation proposals get rejected. Your thesis cannot be an obvious fact — it must be an arguable empirical claim.",
            "hook_bullets": [
                "A topic is just a subject area; a thesis is a debatable stance on that subject.",
                "High-scoring questions focus on specific cohorts, jurisdictions, or datasets.",
            ],
            "comparison": {
                "trap_title": "THE COMMON 2:2 TRAP",
                "trap_text": "\"This paper will discuss the impact of social media on mental health.\" (Descriptive, broad, unmeasurable, and lacks an arguable academic stance).",
                "fix_title": "THE 1ST CLASS BLUEPRINT",
                "fix_text": "\"While passive social media use correlates with depressive symptoms in adolescents, algorithmic recommendation feeds act as the primary moderating variable.\"",
            },
            "formula": {
                "title": "The 3-Part Thesis Formulation Formula",
                "steps": [
                    {"num": "01", "label": "The Concession", "desc": "Acknowledge the existing consensus: \"While [counter-perspective]...\""},
                    {"num": "02", "label": "The Core Claim", "desc": "Deliver your specific argument: \"...this study demonstrates that [X]...\""},
                    {"num": "03", "label": "The Mechanism", "desc": "State the empirical reason: \"...due to the mediating role of [Y and Z].\""},
                ],
                "exemplar": "Formula: Although [X is widely assumed], this dissertation proves [Y], because [Z].",
            },
            "checklist": [
                "Thesis is debatable and could be challenged by another scholar.",
                "Variables and target demographic are tightly defined.",
                "Feasible within your word count (10,000 - 15,000 words).",
                "Ethical approval considerations have been mapped out.",
            ],
            "tool_url": f"{SITE_URL}/dissertation-help/",
            "cta_text": "Refine your dissertation proposal or research methodology with our PhD consulting team.",
            "whatsapp_msg": "Hi Academic Wizard, can you review my dissertation thesis topic and research question?",
        },
        # Friday (Day 4): Turnitin & Similarity Survival
        {
            "day": "Friday",
            "format": "comparison",
            "topic": "Turnitin Deconstructed: What The Colors Mean",
            "badge": "ACADEMIC INTEGRITY: TURNITIN GUIDE",
            "hook_headline": "What Your Turnitin Score Actually Means",
            "hook_sub": "Many students panic when they see a 18% similarity score, while others get flagged with 8%. Here is how university examiners evaluate Turnitin reports.",
            "hook_bullets": [
                "Turnitin does NOT detect plagiarism; it detects matching text strings.",
                "A paper can have 5% similarity and still fail for contract cheating or bad paraphrasing.",
            ],
            "comparison": {
                "trap_title": "THE COMMON 2:2 TRAP",
                "trap_text": "Using automated synonym swappers or spinners (which ruins academic register) and testing papers on free online tools that save your work into public repositories.",
                "fix_title": "THE 1ST CLASS BLUEPRINT",
                "fix_text": "Substantive paraphrasing by grasping theoretical concepts, using non-repository portals, and configuring reference and template exclusions.",
            },
            "formula": {
                "title": "Turnitin Percentage Band Protocol",
                "steps": [
                    {"num": "01", "label": "Blue / Green (0-24%)", "desc": "Healthy baseline: citations, bibliography, and standard course terminology."},
                    {"num": "02", "label": "Yellow (25-49%)", "desc": "Warning zone: excessive direct quoting, needs aggressive paraphrasing."},
                    {"num": "03", "label": "Orange / Red (50%+)", "desc": "Academic misconduct audit: requires complete structural overhaul."},
                ],
                "exemplar": "Rule: Exclude bibliographies and quotes < 5 words to see your real core similarity.",
            },
            "checklist": [
                "Examine the similarity breakdown source list, not just the total %.",
                "Ensure no single external source accounts for more than 3% match.",
                "Verify common assignment templates have been filtered out.",
                "Always check via non-repository accounts before final university upload.",
            ],
            "tool_url": SITE_URL,
            "cta_text": "Get an official Turnitin similarity report with non-repository guarantee before submission.",
            "whatsapp_msg": "Hi Academic Wizard, I want to scan my assignment through non-repository Turnitin.",
        },
        # Saturday (Day 5): Global Grading & Rubric Conversion
        {
            "day": "Saturday",
            "format": "comparison",
            "topic": "UK First Class (70%+) vs US 4.0 vs Australian HD",
            "badge": "GRADING STANDARDS: GLOBAL RUBRICS",
            "hook_headline": "How University Marks Translate Across UK, US & Aus",
            "hook_sub": "International students often panic when receiving a 65% in the UK, not realizing it is a strong 2:1 Upper Second. Here is how grading rubrics actually work.",
            "hook_bullets": [
                "In the UK, marks above 75% are exceptionally rare and denote publishable quality.",
                "US GPA systems reward volume and exams; UK systems reward critical evaluation.",
            ],
            "comparison": {
                "trap_title": "THE COMMON 2:2 TRAP",
                "trap_text": "Expecting an 85% by writing a comprehensive summary. UK markers penalize descriptive writing heavily, capping uncritical papers at 55-58%.",
                "fix_title": "THE 1ST CLASS BLUEPRINT",
                "fix_text": "Targeting 70%+ by interrogating theoretical assumptions, demonstrating methodological limitations, and comparing conflicting peer-reviewed viewpoints.",
            },
            "formula": {
                "title": "International Grade Conversion Matrix",
                "steps": [
                    {"num": "01", "label": "UK 70%+ (1st Class)", "desc": "Equivalent to US 4.0 GPA (Grade A) & Australian High Distinction (85%+)."},
                    {"num": "02", "label": "UK 60-69% (2:1)", "desc": "Equivalent to US 3.3-3.7 GPA (Grade B+) & Australian Distinction (75-84%)."},
                    {"num": "03", "label": "UK 50-59% (2:2)", "desc": "Equivalent to US 2.7-3.0 GPA (Grade B/C) & Australian Credit (65-74%)."},
                ],
                "exemplar": "Rubric standard for First Class: Synthesis of opposing literature + critical insight.",
            },
            "checklist": [
                "Downloaded and annotated your module's specific assessment rubric.",
                "Included counter-arguments in at least 3 body paragraphs.",
                "Checked if your department uses anonymous double-blind grading.",
                "Ensured formatting strictly adheres to font, spacing, and margin rules.",
            ],
            "tool_url": f"{SITE_URL}/tools/",
            "cta_text": "Convert your grades and check assessment rubrics with our free international grade calculator.",
            "whatsapp_msg": "Hi Academic Wizard, I want expert tutoring to score a First Class on my next paper.",
        },
        # Sunday (Day 6): Weekly Deadline Survival
        {
            "day": "Sunday",
            "format": "comparison",
            "topic": "The 3-Deadline Sunday Triage Protocol",
            "badge": "STUDY STRATEGY: DEADLINE TRIAGE",
            "hook_headline": "Have 3 Assignments Due This Week? Here's the Protocol",
            "hook_sub": "When multiple deadlines hit at once, working chronologically leads to burnout and missed submissions. You must triage by credit weighting.",
            "hook_bullets": [
                "A 5% late penalty on a 40-credit module damages your degree 4x more than a 10-credit coursework.",
                "Writing a zero draft fast beats spending 5 hours perfecting an introduction.",
            ],
            "comparison": {
                "trap_title": "THE COMMON 2:2 TRAP",
                "trap_text": "Spending all weekend tweaking citations on a 10% quiz while a 50% weighted research project sits unwritten.",
                "fix_title": "THE 1ST CLASS BLUEPRINT",
                "fix_text": "Triage by module weighting: lock in 90-minute Pomodoro sprints for raw drafts, and delegate formatting and proofreading to save 8+ hours.",
            },
            "formula": {
                "title": "The 3-Step Sunday Emergency Protocol",
                "steps": [
                    {"num": "01", "label": "Credit Weight Sort", "desc": "Prioritize projects by academic degree weighting, not deadline order."},
                    {"num": "02", "label": "90-Min Zero Drafts", "desc": "Write continuous unedited drafts to establish complete structure."},
                    {"num": "03", "label": "Outsource Polishing", "desc": "Delegate referencing formatting, Turnitin checks, and final edits."},
                ],
                "exemplar": "Rule: A completed 62% paper submitted on time beats a perfect 75% paper with a late penalty.",
            },
            "checklist": [
                "Calculated exact grade weightings for all pending assignments.",
                "Scheduled 3 uninterrupted 90-minute writing blocks for tomorrow.",
                "Verified extension and extenuating circumstances deadlines.",
                "Connected with 24/7 academic support for urgent emergency turnaround.",
            ],
            "tool_url": f"{SITE_URL}/tools/",
            "cta_text": "Overwhelmed by back-to-back university deadlines? Our academic writers are online 24/7.",
            "whatsapp_msg": "Hi Academic Wizard, I have multiple assignments due this week and need urgent assistance.",
        },
    ],
    "evening": [
        # Monday (Day 0): Law Assignment Help
        {
            "day": "Monday",
            "format": "comparison",
            "topic": "Law Problem Questions: The IRAC Masterclass",
            "badge": "CORE SERVICE: LAW ASSIGNMENT HELP",
            "hook_headline": "Score a First Class in Contract, Tort & Criminal Law",
            "hook_sub": "Law tutors grade problem questions with mathematical precision. If you skip a single step in the IRAC formula, your mark drops from a First to a 2:2.",
            "hook_bullets": [
                "Citing cases without stating the ratio decidendi loses judicial analysis marks.",
                "OSCOLA requires precise pinpointing to law reports (e.g. [1893] 1 QB 256).",
            ],
            "comparison": {
                "trap_title": "THE COMMON 2:2 TRAP",
                "trap_text": "Writing long essays telling the story of the parties without isolating the specific legal cause of action, and failing to raise obvious legal defenses.",
                "fix_title": "THE 1ST CLASS BLUEPRINT",
                "fix_text": "Systematic IRAC execution: Isolate legal dispute, cite statutory provisions and landmark precedents, apply principles to facts, and deliver a decisive conclusion.",
            },
            "formula": {
                "title": "The IRAC Legal Analysis Architecture",
                "steps": [
                    {"num": "01", "label": "Issue (10%)", "desc": "Identify whether a valid contract formed or duty of care was breached."},
                    {"num": "02", "label": "Rule (25%)", "desc": "Cite governing statutes (e.g. CRA 2015) and binding precedents (Donoghue)."},
                    {"num": "03", "label": "Application (50%)", "desc": "Weigh facts against legal tests with counter-arguments and defenses."},
                ],
                "exemplar": "Conclusion: Advise client on likelihood of summary judgment or damages under OSCOLA.",
            },
            "checklist": [
                "Every legal proposition is supported by a primary statute or case precedent.",
                "OSCOLA footnote citations include exact paragraph and page pinpoints.",
                "Both claimant and defendant arguments have been rigorously evaluated.",
                "Delivered clear legal advice on remedies and judicial likelihood.",
            ],
            "tool_url": f"{SITE_URL}/services/law-assignment-help/",
            "cta_text": "Get custom law essays, problem questions, and OSCOLA citations written by qualified LLB/LLM experts.",
            "whatsapp_msg": "Hi Academic Wizard, I need urgent Law assignment help with IRAC methodology and OSCOLA.",
        },
        # Tuesday (Day 1): Nursing & Healthcare Case Studies
        {
            "day": "Tuesday",
            "format": "comparison",
            "topic": "Nursing Care Plans & Gibbs Reflective Cycle",
            "badge": "CORE SERVICE: NURSING & HEALTHCARE",
            "hook_headline": "Evidence-Based Practice & Gibbs Reflective Mastery",
            "hook_sub": "Nursing case studies require balancing empathetic reflection with rigorous clinical evidence. Gibbs reflective cycle without Level 1 evidence fails the rubric.",
            "hook_bullets": [
                "Examiners mark heavily for adherence to UK NMC and Australian NMBA codes.",
                "Every nursing intervention must link to peer-reviewed RCTs or clinical guidelines (NICE).",
            ],
            "comparison": {
                "trap_title": "THE COMMON 2:2 TRAP",
                "trap_text": "Writing purely emotional diary entries (\"I felt sad for the patient\") without clinical analysis or theoretical grounding in nursing models.",
                "fix_title": "THE 1ST CLASS BLUEPRINT",
                "fix_text": "Structured Gibbs progression with PICO frameworks: Linking clinical interventions directly to Cochrane reviews, NICE guidelines, and NMC standards.",
            },
            "formula": {
                "title": "The Gibbs 6-Stage Reflective Framework",
                "steps": [
                    {"num": "01", "label": "Description & Feelings", "desc": "Objective clinical overview followed by emotional self-awareness."},
                    {"num": "02", "label": "Evaluation & Analysis", "desc": "Critique what went well vs challenges using evidence-based literature."},
                    {"num": "03", "label": "Conclusion & Action", "desc": "Concrete SMART clinical action plan for future clinical practice."},
                ],
                "exemplar": "Evidence Standard: Cite CINAHL, PubMed, and NICE guidelines published within 5 years.",
            },
            "checklist": [
                "Follows all 6 stages of Gibbs Reflective Cycle with clear subheadings.",
                "Patient confidentiality preserved in strict compliance with NMC Code.",
                "Clinical interventions justified with Level 1 systematic reviews.",
                "PICO question formulated for evidence-based practice sections.",
            ],
            "tool_url": f"{SITE_URL}/services/nursing-assignment-help/",
            "cta_text": "Connect directly with practicing healthcare & clinical nursing writers on WhatsApp.",
            "whatsapp_msg": "Hi Academic Wizard, I need assistance with a Nursing reflective case study and care plan.",
        },
        # Wednesday (Day 2): MBA & Business Management
        {
            "day": "Wednesday",
            "format": "comparison",
            "topic": "MBA Reports: Porter's, SWOT & Financial Ratios",
            "badge": "CORE SERVICE: MBA & MANAGEMENT",
            "hook_headline": "Mastering Executive Reports & Strategic Frameworks",
            "hook_sub": "MBA professors penalize students who simply define textbooks frameworks. Executive reports require analyzing strategic friction and budgeting recommendations.",
            "hook_bullets": [
                "Describing Porter's Five Forces is undergraduate level; analyzing margin erosion is MBA level.",
                "Executive summaries must provide actionable, budgeted solutions with timelines.",
            ],
            "comparison": {
                "trap_title": "THE COMMON 2:2 TRAP",
                "trap_text": "Listing bullet points in a SWOT table without cross-analyzing internal capabilities against external threats, and giving vague non-budgeted advice.",
                "fix_title": "THE 1ST CLASS BLUEPRINT",
                "fix_text": "Integrating VRIO core competencies with PESTLE macro-risks, supported by financial ratio analysis (ROIC, EBITDA) and a budgeted implementation roadmap.",
            },
            "formula": {
                "title": "The Strategic MBA Analysis Blueprint",
                "steps": [
                    {"num": "01", "label": "Internal & External", "desc": "Cross-reference internal VRIO moats against Porter's competitive forces."},
                    {"num": "02", "label": "Financial Modeling", "desc": "Quantify strategic claims with profitability and liquidity metrics."},
                    {"num": "03", "label": "Actionable Roadmap", "desc": "Deliver 3 prioritized recommendations with CAPEX budget and KPI metrics."},
                ],
                "exemplar": "Executive standard: Recommendations must state estimated ROI and implementation risk.",
            },
            "checklist": [
                "Executive summary functions as a standalone decision-making document.",
                "Strategic frameworks analyze tension rather than textbook definitions.",
                "Financial statements and ratios accurately calculated and interpreted.",
                "Recommendations include risk mitigation matrices and timelines.",
            ],
            "tool_url": f"{SITE_URL}/services/assignment-help/",
            "cta_text": "Get high-distinction MBA case studies, business proposals, and financial analysis drafted by postgrads.",
            "whatsapp_msg": "Hi Academic Wizard, I need expert help with my MBA Strategic Management assignment.",
        },
        # Thursday (Day 3): Master's Dissertation Support
        {
            "day": "Thursday",
            "format": "comparison",
            "topic": "Dissertation Literature Review: The Synthesis Matrix",
            "badge": "CORE SERVICE: PH.D. & MASTER'S THESIS",
            "hook_headline": "Synthesize 40+ Papers into a First-Class Literature Review",
            "hook_sub": "Chronological literature reviews ('Author A said X, Author B said Y') guarantee a 2:2 mark. A Master's thesis must construct a thematic synthesis matrix.",
            "hook_bullets": [
                "Tutors look for methodological divides: qualitative vs quantitative conflicts.",
                "Your literature review exists solely to justify why your study must be conducted.",
            ],
            "comparison": {
                "trap_title": "THE COMMON 2:2 TRAP",
                "trap_text": "Writing chapter sections organized by individual authors or years, providing descriptive book reports with zero critical comparison of methodologies.",
                "fix_title": "THE 1ST CLASS BLUEPRINT",
                "fix_text": "Thematic coding: Organizing chapters by theoretical debates, comparing sampling limitations across studies, and clearly highlighting the empirical knowledge gap.",
            },
            "formula": {
                "title": "The Literature Review Synthesis Matrix",
                "steps": [
                    {"num": "01", "label": "Thematic Coding", "desc": "Group papers by core arguments, theoretical schools, and debates."},
                    {"num": "02", "label": "Methodological Audit", "desc": "Expose sampling biases, regional limitations, and statistical weaknesses."},
                    {"num": "03", "label": "The Knowledge Gap", "desc": "Formally demonstrate how your dissertation addresses the unstudied gap."},
                ],
                "exemplar": "Syntax: 'While Jones (2022) established X, their qualitative sample (n=12) failed to account for Y.'",
            },
            "checklist": [
                "Literature review organized by thematic headings, not author by author.",
                "Identified at least 2 major theoretical or methodological disagreements.",
                "Explicitly stated how the literature gap justifies your methodology.",
                "Includes recent empirical studies from 2022-2026 across top journals.",
            ],
            "tool_url": f"{SITE_URL}/dissertation-help/",
            "cta_text": "From chapter drafting to SPSS data analysis, our PhD supervisors guide your entire thesis.",
            "whatsapp_msg": "Hi Academic Wizard, I need help with my Master's Dissertation literature review & methodology.",
        },
        # Friday (Day 4): 12-Hour Urgent Emergency Help
        {
            "day": "Friday",
            "format": "comparison",
            "topic": "Midnight Panic? The 12-Hour Urgent Rescue Protocol",
            "badge": "CORE SERVICE: 12-HOUR URGENT RESCUE",
            "hook_headline": "Assignment Due Tomorrow Morning and Haven't Started?",
            "hook_sub": "Midnight panic is real. University penalties can cost you an entire grade boundary per day. Our specialized emergency writers work around the clock.",
            "hook_bullets": [
                "100% human-written academic work drafted by subject-matter postgraduates.",
                "Every urgent project includes a complimentary Turnitin non-repository report.",
            ],
            "comparison": {
                "trap_title": "THE COMMON 2:2 TRAP",
                "trap_text": "Copy-pasting AI summaries at 3 AM that hallucinate citations, or hiring unverified freelancers who miss deadlines and leave you empty-handed.",
                "fix_title": "THE 1ST CLASS BLUEPRINT",
                "fix_text": "Allocating your rubric to verified master's/PhD writers on WhatsApp, delivering fully referenced drafts with verified peer-reviewed sources in 12 hours.",
            },
            "formula": {
                "title": "The 12-Hour Express Allocation Protocol",
                "steps": [
                    {"num": "01", "label": "Brief Audit (15 min)", "desc": "Share your assignment prompt, rubric, and word count on WhatsApp."},
                    {"num": "02", "label": "Writer Mobilization", "desc": "Dedicated subject specialist assigned immediately to draft your paper."},
                    {"num": "03", "label": "Quality & Turnitin", "desc": "Senior editor review + Turnitin similarity scan before delivery."},
                ],
                "exemplar": "Speed Guarantee: Complete human-written essays delivered in as little as 12 hours.",
            },
            "checklist": [
                "Full adherence to university prompt, word count, and citation style.",
                "Verified peer-reviewed sources from 2021-2026.",
                "Complimentary Turnitin non-repository similarity report included.",
                "Direct communication with academic coordinators on WhatsApp.",
            ],
            "tool_url": SITE_URL,
            "cta_text": "Midnight deadline panic? Our night-shift writers are online right now on WhatsApp.",
            "whatsapp_msg": "Hi Academic Wizard, I have an URGENT assignment due in 12-24 hours. Can you help?",
        },
        # Saturday (Day 5): Substantive Academic Proofreading & Editing
        {
            "day": "Saturday",
            "format": "comparison",
            "topic": "Substantive Academic Editing vs. Surface Proofreading",
            "badge": "CORE SERVICE: ACADEMIC POLISHING",
            "hook_headline": "Turn a 2:2 into a First Class: Elevate Academic Register",
            "hook_sub": "Grammarly and spellcheckers only fix superficial typos. Tutors grade for scholarly tone, argument flow, signposting, and assessment rubric alignment.",
            "hook_bullets": [
                "Informal colloquialisms and passive voice confusion drop grades from a 2:1 to a 2:2.",
                "Substantive editing restructures arguments so your thesis flows seamlessly.",
            ],
            "comparison": {
                "trap_title": "THE COMMON 2:2 TRAP",
                "trap_text": "Relying purely on basic grammar checkers that overlook weak topic sentences, contradictory claims, and unformatted citation pinpoints.",
                "fix_title": "THE 1ST CLASS BLUEPRINT",
                "fix_text": "Substantive developmental editing: Line-by-line academic register refinement, restructuring weak paragraphs, and aligning with university rubrics.",
            },
            "formula": {
                "title": "The 3-Tier Academic Editing Protocol",
                "steps": [
                    {"num": "01", "label": "Surface Level", "desc": "Grammar, syntax, punctuation, spelling, and tense consistency."},
                    {"num": "02", "label": "Scholarly Register", "desc": "Eliminating colloquialisms, passive voice, and weak signposting."},
                    {"num": "03", "label": "Structural Polish", "desc": "Ensuring logical transitions, argument coherence, and rubric compliance."},
                ],
                "exemplar": "Transform: 'People think X is bad' ➔ 'Empirical scholars argue X exerts adverse effects.'",
            },
            "checklist": [
                "Academic tone is formal, objective, and scholarly throughout.",
                "Topic sentences and transitional signposting connect all sections.",
                "In-text citations cross-checked against bibliography for 100% match.",
                "Word count precisely aligned with university +/- 10% margins.",
            ],
            "tool_url": f"{SITE_URL}/services/academic-editing/",
            "cta_text": "Send your draft via WhatsApp for substantive academic editing and rubric alignment.",
            "whatsapp_msg": "Hi Academic Wizard, I want to get my paper proofread and substantively edited.",
        },
        # Sunday (Day 6): Computer Science, Tech & Statistics Help
        {
            "day": "Sunday",
            "format": "comparison",
            "topic": "Computer Science & Quantitative Stats (Python, R, SPSS)",
            "badge": "CORE SERVICE: TECH & STATISTICS HELP",
            "hook_headline": "Clean Code, Algorithmic Analysis & Statistical Reports",
            "hook_sub": "Writing functional code is only 50% of your grade. Computer science and data modules require formal Big-O proofs, documentation, and APA reporting.",
            "hook_bullets": [
                "Uncommented code and unhandled edge cases immediately cost 20% of marks.",
                "SPSS and R outputs must be translated into APA 7th statistical narratives.",
            ],
            "comparison": {
                "trap_title": "THE COMMON 2:2 TRAP",
                "trap_text": "Submitting raw code with zero comments, or pasting raw SPSS output tables into a dissertation without reporting degrees of freedom, p-values, or effect sizes.",
                "fix_title": "THE 1ST CLASS BLUEPRINT",
                "fix_text": "Production-grade code with modular architecture and Big-O proofs, combined with professional APA 7th statistical write-ups of regression models.",
            },
            "formula": {
                "title": "The Quantitative Reporting Standard (APA 7th)",
                "steps": [
                    {"num": "01", "label": "Statistical Output", "desc": "Report test statistic: F(df1, df2) = X.XX, p = .XXX, ηp² = .XX."},
                    {"num": "02", "label": "Plain Narrative", "desc": "Translate statistics into meaningful real-world business/clinical findings."},
                    {"num": "03", "label": "Algorithmic Complexity", "desc": "Provide formal time and space Big-O bounds: O(n log n)."},
                ],
                "exemplar": "Syntax: 'A multiple regression revealed a significant model, F(3, 142) = 14.28, p < .001, R² = .23.'",
            },
            "checklist": [
                "Code files include comprehensive docstrings and unit test cases.",
                "Time and space complexity rigorously proven with Big-O notation.",
                "Regression and ANOVA models report effect sizes (Cohen's d / R²).",
                "Visual charts (histograms, scatterplots) formatted with clean labels.",
            ],
            "tool_url": f"{SITE_URL}/services/assignment-help/",
            "cta_text": "Message our computer science and quantitative analysis specialists on WhatsApp now.",
            "whatsapp_msg": "Hi Academic Wizard, I need help with my Coding / Statistics assignment.",
        },
    ],
    "afternoon": [
        {
            "day": "Monday",
            "format": "cheatsheet",
            "topic": "Sentence Starters",
            "badge": "ACADEMIC CHEAT-SHEET",
            "hook_headline": "10 Critical Analysis Sentence Starters You Can Copy-Paste",
            "hook_sub": "Stop writing 'This shows that...'. Use these exact sentence frames to instantly elevate your critical analysis and hit top marks.",
            "hook_bullets": [
                "Boost your critical evaluation score.",
                "Demonstrate deep engagement with literature."
            ],
            "comparison": {
                "trap_title": "THE COMMON TRAP",
                "trap_text": "Using basic descriptive phrases that just summarize the source.",
                "fix_title": "THE UPGRADE",
                "fix_text": "Using analytical phrases that evaluate methodology and implications."
            },
            "formula": {
                "title": "The Analysis Framework",
                "steps": [
                    {"num": "01", "label": "Identify", "desc": "Identify the author's core argument."},
                    {"num": "02", "label": "Critique", "desc": "Highlight a limitation or counter-perspective."},
                    {"num": "03", "label": "Synthesize", "desc": "Merge with your own overarching thesis."}
                ],
                "exemplar": "While Smith (2020) argues X, this fails to account for Y, suggesting..."
            },
            "checklist": [
                "Used analytical verbs (e.g., contradicts, illuminates).",
                "Avoided mere summary.",
                "Explicitly linked source to assignment question."
            ],
            "tool_url": f"{SITE_URL}/tools/",
            "cta_text": "Need more sentence frames? Try our free paraphraser.",
            "whatsapp_msg": "Hi, I need help writing critically."
        },
        {
            "day": "Tuesday",
            "format": "mythbuster",
            "topic": "Academic Writing Myths",
            "badge": "MYTH-BUSTER",
            "hook_headline": "5 Academic Writing Myths Your Professor Wishes You'd Stop Believing",
            "hook_sub": "You are losing marks by following outdated high school writing advice. Here is what university graders actually look for.",
            "hook_bullets": [
                "Complex vocabulary does NOT equal better grades.",
                "First-person pronouns are sometimes required."
            ],
            "comparison": {
                "trap_title": "THE MYTH",
                "trap_text": "Using a thesaurus to replace every simple word with a complicated one.",
                "fix_title": "THE REALITY",
                "fix_text": "Clarity and precision outscore complex but misused vocabulary every time."
            },
            "formula": {
                "title": "The Clarity Protocol",
                "steps": [
                    {"num": "01", "label": "Simplicity", "desc": "Choose the clearest word, not the longest."},
                    {"num": "02", "label": "Signposting", "desc": "Use clear transition words to guide the reader."},
                    {"num": "03", "label": "Precision", "desc": "Define key terms early and use them consistently."}
                ],
                "exemplar": "Instead of 'utilize', just use 'use'. Keep it direct."
            },
            "checklist": [
                "Removed unnecessary jargon.",
                "Sentences are under 25 words on average.",
                "Argument flows logically."
            ],
            "tool_url": f"{SITE_URL}/tools/",
            "cta_text": "Check your essay's readability with our free tools.",
            "whatsapp_msg": "Hi, I want someone to review my essay for clarity."
        },
        {
            "day": "Wednesday",
            "format": "cheatsheet",
            "topic": "Paraphrasing Toolkit",
            "badge": "ACADEMIC CHEAT-SHEET",
            "hook_headline": "The Complete Paraphrasing Toolkit: 8 Formulas That Avoid Turnitin Flags",
            "hook_sub": "Just changing a few words is plagiarism. Learn how to genuinely restructure ideas to pass Turnitin and show true understanding.",
            "hook_bullets": [
                "Avoid accidental plagiarism.",
                "Integrate sources seamlessly."
            ],
            "comparison": {
                "trap_title": "POOR PARAPHRASING",
                "trap_text": "Swapping synonyms while keeping the exact same sentence structure (patchwriting).",
                "fix_title": "PROPER PARAPHRASING",
                "fix_text": "Reading the source, hiding it, and writing the concept from scratch in your own voice."
            },
            "formula": {
                "title": "The 4-Step Paraphrase",
                "steps": [
                    {"num": "01", "label": "Read", "desc": "Understand the full meaning of the passage."},
                    {"num": "02", "label": "Hide", "desc": "Put the original text out of sight."},
                    {"num": "03", "label": "Draft", "desc": "Write the idea from memory."},
                    {"num": "04", "label": "Check", "desc": "Compare with original and add citation."}
                ],
                "exemplar": "Original: 'The data indicates...' -> Paraphrase: 'Based on the findings, it is evident...'"
            },
            "checklist": [
                "Sentence structure is fundamentally different.",
                "Meaning remains entirely accurate.",
                "In-text citation is included."
            ],
            "tool_url": f"{SITE_URL}/tools/",
            "cta_text": "Try our AI paraphraser to get past writer's block.",
            "whatsapp_msg": "Hi, I need help reducing my Turnitin similarity score."
        },
        {
            "day": "Thursday",
            "format": "scenario",
            "topic": "Case Study Transformation",
            "badge": "STUDENT STORY",
            "hook_headline": "From 42% to 78%: How a Singapore MBA Student Transformed Their Case Study Grade",
            "hook_sub": "See the exact structural changes that turned a failing business case study into a distinction-level analysis.",
            "hook_bullets": [
                "Stop summarizing the case facts.",
                "Start applying frameworks correctly."
            ],
            "comparison": {
                "trap_title": "THE 42% DRAFT",
                "trap_text": "Repeating the background information given in the case brief.",
                "fix_title": "THE 78% REVISION",
                "fix_text": "Applying PESTLE and SWOT to evaluate strategic options."
            },
            "formula": {
                "title": "Case Study Framework",
                "steps": [
                    {"num": "01", "label": "Diagnose", "desc": "Identify the core problem, not just symptoms."},
                    {"num": "02", "label": "Analyze", "desc": "Apply theoretical frameworks to the evidence."},
                    {"num": "03", "label": "Recommend", "desc": "Propose actionable, justified solutions."}
                ],
                "exemplar": "Instead of 'The company lost money', write 'Due to X (Theory Y), revenue declined by Z%'."
            },
            "checklist": [
                "No space wasted on case summary.",
                "Theories applied directly to evidence.",
                "Recommendations are realistic and supported."
            ],
            "tool_url": f"{SITE_URL}/services/assignment-help/",
            "cta_text": "Struggling with a case study? Get expert help on WhatsApp.",
            "whatsapp_msg": "Hi, I need assistance with a business case study."
        },
        {
            "day": "Friday",
            "format": "cheatsheet",
            "topic": "Literature Review Matrix",
            "badge": "ACADEMIC CHEAT-SHEET",
            "hook_headline": "The Literature Review Matrix: Copy This Exact Template for 40+ Sources",
            "hook_sub": "Overwhelmed by reading? Use this spreadsheet framework to organize themes, methods, and gaps before you write a single word.",
            "hook_bullets": [
                "Never lose track of a citation again.",
                "Easily spot research gaps."
            ],
            "comparison": {
                "trap_title": "THE CHAOTIC METHOD",
                "trap_text": "Writing linear summaries of one paper after another.",
                "fix_title": "THE MATRIX METHOD",
                "fix_text": "Synthesizing literature by theme across multiple papers simultaneously."
            },
            "formula": {
                "title": "Matrix Construction",
                "steps": [
                    {"num": "01", "label": "Columns", "desc": "Set up: Author/Year, Methodology, Key Findings, Limitations."},
                    {"num": "02", "label": "Themes", "desc": "Add custom columns for specific themes relevant to your RQ."},
                    {"num": "03", "label": "Synthesize", "desc": "Read down the columns to write thematic paragraphs."}
                ],
                "exemplar": "Authors A, B, and C all utilized qualitative methods, but found different results regarding X."
            },
            "checklist": [
                "Every source logged in the matrix.",
                "Themes identified before drafting.",
                "Paragraphs grouped by concept, not by author."
            ],
            "tool_url": f"{SITE_URL}/tools/",
            "cta_text": "Need help organizing your literature review? Message us.",
            "whatsapp_msg": "Hi, I am stuck on my literature review chapter."
        },
        {
            "day": "Saturday",
            "format": "mythbuster",
            "topic": "Original Ideas Myth",
            "badge": "MYTH-BUSTER",
            "hook_headline": "Your Professor Doesn't Want 'Original Ideas' — Here's What They Actually Mark",
            "hook_sub": "Stop trying to invent a new theory in your undergrad essay. Here is what 'critical thinking' actually means to a grader.",
            "hook_bullets": [
                "Synthesis beats invention.",
                "Evidence-backed evaluation is key."
            ],
            "comparison": {
                "trap_title": "THE STRESS TRAP",
                "trap_text": "Struggling to come up with completely novel theories for a standard essay.",
                "fix_title": "THE GRADE WINNER",
                "fix_text": "Evaluating and synthesizing existing literature in a logical, structured way."
            },
            "formula": {
                "title": "Critical Synthesis",
                "steps": [
                    {"num": "01", "label": "Compare", "desc": "How do different authors agree or disagree?"},
                    {"num": "02", "label": "Evaluate", "desc": "Which methodology is stronger?"},
                    {"num": "03", "label": "Position", "desc": "Where does your argument sit within this debate?"}
                ],
                "exemplar": "While Smith (2021) provides robust quantitative data, Jones (2022) offers crucial qualitative context."
            },
            "checklist": [
                "Claims are supported by evidence.",
                "Alternative viewpoints are acknowledged.",
                "Conclusion logically follows the analysis."
            ],
            "tool_url": f"{SITE_URL}/services/academic-editing/",
            "cta_text": "Want us to check your essay's argument structure? WhatsApp us.",
            "whatsapp_msg": "Hi, can you review my essay's structure?"
        },
        {
            "day": "Sunday",
            "format": "urgentcta",
            "topic": "Live Delivery Proof",
            "badge": "LIVE DELIVERY PROOF",
            "hook_headline": "Just Delivered: 3,500-Word Nursing Care Plan for NUS Student in 14 Hours",
            "hook_sub": "When deadlines are impossible, our specialized academic writers step in. See how we handled an overnight nursing crisis.",
            "hook_bullets": [
                "Fully referenced APA 7th.",
                "Zero AI, passing Turnitin perfectly."
            ],
            "comparison": {
                "trap_title": "PANIC MODE",
                "trap_text": "Using ChatGPT and risking academic misconduct when time runs out.",
                "fix_title": "EXPERT HELP",
                "fix_text": "Hiring a subject-matter expert to deliver a model answer overnight."
            },
            "formula": {
                "title": "Our Urgent Process",
                "steps": [
                    {"num": "01", "label": "Brief", "desc": "Send us your prompt, rubric, and deadline."},
                    {"num": "02", "label": "Match", "desc": "We assign a specialized expert in your field."},
                    {"num": "03", "label": "Deliver", "desc": "Receive a high-quality, plagiarism-free paper on time."}
                ],
                "exemplar": "Delivered: A complete, evidence-based care plan scored at Distinction level."
            },
            "checklist": [
                "Requirements fully met.",
                "Quality assured by an editor.",
                "Delivered before the deadline."
            ],
            "tool_url": f"{SITE_URL}/services/assignment-help/",
            "cta_text": "Got an impossible deadline? Message our emergency team now.",
            "whatsapp_msg": "URGENT: I need help with an assignment due very soon!"
        }
    ]
}


# ==============================================================================
# Pillow Typography & Modern Minimal Layout Engine
# ==============================================================================
def get_system_font(size: int, bold: bool = False) -> ImageFont.ImageFont:
    """Load system font with robust cross-platform fallbacks."""
    candidates = [
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
        "/System/Library/Fonts/SFNS.ttf",
        "/Library/Fonts/Arial.ttf",
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


def wrap_text(draw: ImageDraw.Draw, text: str, font: ImageFont.ImageFont, max_width: int) -> List[str]:
    """Word-wrap text cleanly to fit inside max_width."""
    words = text.split()
    lines, curr = [], []
    for w in words:
        test = " ".join(curr + [w])
        bbox = draw.textbbox((0, 0), test, font=font)
        if (bbox[2] - bbox[0]) <= max_width:
            curr.append(w)
        else:
            if curr:
                lines.append(" ".join(curr))
            curr = [w]
    if curr:
        lines.append(" ".join(curr))
    return lines


def draw_rounded_shadow_card(
    img: Image.Image,
    draw: ImageDraw.Draw,
    x1: int,
    y1: int,
    x2: int,
    y2: int,
    radius: int = 20,
    bg: Tuple[int, int, int] = BG_WHITE,
    shadow_offset: int = 6,
    shadow_blur: int = 12,
    border_color: Optional[Tuple[int, int, int]] = None,
    border_width: int = 0,
) -> ImageDraw.Draw:
    """Draw a modern rounded card with a subtle gaussian drop shadow."""
    shadow = Image.new("RGBA", img.size, (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(shadow)
    sdraw.rounded_rectangle(
        [x1 + shadow_offset, y1 + shadow_offset, x2 + shadow_offset, y2 + shadow_offset],
        radius=radius,
        fill=(0, 0, 0, 32),
    )
    shadow = shadow.filter(ImageFilter.GaussianBlur(shadow_blur))
    img.paste(Image.alpha_composite(Image.new("RGBA", img.size, (0, 0, 0, 0)), shadow), (0, 0), shadow)

    draw_fresh = ImageDraw.Draw(img)
    draw_fresh.rounded_rectangle([x1, y1, x2, y2], radius=radius, fill=bg + (255,))
    if border_color and border_width:
        draw_fresh.rounded_rectangle([x1, y1, x2, y2], radius=radius, outline=border_color + (255,), width=border_width)
    return draw_fresh


def stamp_header(
    img: Image.Image,
    draw: ImageDraw.Draw,
    slide_num: Optional[int] = None,
    total_slides: Optional[int] = None,
    category: str = "Academic Strategy",
):
    """Render modern minimal header: top gold accent strip, logo medallion, brand name, and category pill."""
    w = img.width
    # Top 5px gold brand accent strip
    draw.rectangle([0, 0, w, 5], fill=GOLD + (255,))

    # Logo medallion
    logo = get_cropped_logo()
    logo_size = 52
    logo_x, logo_y = 60, 26
    draw.ellipse(
        [logo_x - 4, logo_y - 4, logo_x + logo_size + 4, logo_y + logo_size + 4],
        fill=GOLD_LIGHT + (255,),
        outline=GOLD + (180,),
        width=2,
    )
    if logo:
        thumb = logo.resize((logo_size, logo_size), Image.Resampling.LANCZOS)
        img.paste(thumb, (logo_x, logo_y), thumb)

    # Brand typography
    f_brand = get_system_font(22, bold=True)
    f_sub = get_system_font(15, bold=False)
    draw.text((logo_x + logo_size + 16, logo_y + 4), "Academic Wizard", fill=CHARCOAL, font=f_brand)
    draw.text((logo_x + logo_size + 16, logo_y + 28), "Your Academic Mentor", fill=MUTED, font=f_sub)

    # Category pill
    clean_cat = category.replace("✦", "").replace("★", "").replace("🎓", "").replace("⚡", "").strip()
    f_cat = get_system_font(14, bold=True)
    cat_bbox = draw.textbbox((0, 0), clean_cat, font=f_cat)
    cat_w = cat_bbox[2] - cat_bbox[0]
    cat_x = w - cat_w - 90
    cat_y = 36
    draw.rounded_rectangle([cat_x, cat_y, w - 60, cat_y + 32], radius=16, fill=GOLD_LIGHT + (255,), outline=GOLD + (120,), width=1)
    draw.text((cat_x + 14, cat_y + 7), clean_cat, fill=GOLD, font=f_cat)

    if slide_num and total_slides:
        f_cnt = get_system_font(13, bold=False)
        draw.text((w - 85, 78), f"{slide_num}/{total_slides}", fill=MUTED, font=f_cnt)


def stamp_footer(img: Image.Image, draw: ImageDraw.Draw, cta_type: str = "swipe"):
    """Render modern minimal footer: subtle separator, domain, WhatsApp number, and contextual button."""
    w, h = img.size
    footer_y = h - 95

    # Subtle separator line
    draw.line([(60, footer_y), (w - 60, footer_y)], fill=(*MUTED[:3], 60), width=1)

    # Brand domain & support
    f_dom = get_system_font(18, bold=True)
    f_wa = get_system_font(14, bold=False)
    draw.text((60, footer_y + 18), "academicwizard.online", fill=CHARCOAL, font=f_dom)
    draw.text((60, footer_y + 46), f"WhatsApp: {WHATSAPP_DISPLAY}", fill=MUTED, font=f_wa)

    # Contextual button
    if cta_type == "swipe":
        f_btn = get_system_font(16, bold=True)
        t = "Swipe for the fix  →"
        tb = draw.textbbox((0, 0), t, font=f_btn)
        bw = tb[2] - tb[0]
        bx = w - bw - 80
        draw.rounded_rectangle([bx, footer_y + 16, w - 60, footer_y + 54], radius=18, fill=CHARCOAL + (255,))
        draw.text((bx + 16, footer_y + 23), t, fill=BG_WHITE, font=f_btn)
    elif cta_type == "save":
        f_btn = get_system_font(16, bold=True)
        t = "Save this for later"
        tb = draw.textbbox((0, 0), t, font=f_btn)
        bw = tb[2] - tb[0]
        bx = w - bw - 80
        draw.rounded_rectangle([bx, footer_y + 16, w - 60, footer_y + 54], radius=18, fill=EMERALD + (255,))
        draw.text((bx + 18, footer_y + 23), t, fill=BG_WHITE, font=f_btn)
    elif cta_type == "whatsapp":
        f_btn = get_system_font(15, bold=True)
        t = "WhatsApp Expert Help"
        tb = draw.textbbox((0, 0), t, font=f_btn)
        bw = tb[2] - tb[0]
        bx = w - bw - 80
        draw.rounded_rectangle([bx, footer_y + 16, w - 60, footer_y + 54], radius=18, fill=WA_GREEN + (255,))
        draw.text((bx + 16, footer_y + 24), t, fill=BG_WHITE, font=f_btn)


# ==============================================================================
# Slide 1: Modern Minimal Hook & Feedback Cover
# ==============================================================================
def render_slide_1_cover(recipe: Dict[str, Any], output_path: Path) -> Path:
    """Generate Slide 1: High-impact hook with supervisor feedback card & stats bar."""
    W, H = 1080, 1080
    img = Image.new("RGBA", (W, H), BG_LIGHT + (255,))
    draw = ImageDraw.Draw(img)

    category = recipe.get("badge", "Study Hack")
    stamp_header(img, draw, slide_num=1, total_slides=4, category=category)

    # Big bold hook headline
    headline = recipe.get("hook_headline", "Supervisor Wrote 'Lacks Critical Depth'?")
    f_hook = get_system_font(46, bold=True)
    f_sub = get_system_font(23, bold=False)

    head_lines = wrap_text(draw, headline, f_hook, W - 140)
    y_h = 135
    for idx, hl in enumerate(head_lines[:2]):
        color = CORAL if idx == len(head_lines[:2]) - 1 else CHARCOAL
        draw.text((60, y_h), hl, fill=color, font=f_hook)
        y_h += 56

    # Subtext
    sub = recipe.get("hook_sub", "Here's why — and the 3-sentence formula to fix it before resubmission.")
    sub_lines = wrap_text(draw, sub, f_sub, W - 140)
    y_sub = y_h + 15
    for sl in sub_lines[:2]:
        draw.text((60, y_sub), sl, fill=SLATE, font=f_sub)
        y_sub += 34

    # Simulated supervisor feedback card
    card_y1 = max(y_sub + 25, 370)
    card_y2 = card_y1 + 310
    draw = draw_rounded_shadow_card(img, draw, 60, card_y1, W - 60, card_y2, radius=20, bg=BG_WHITE, border_color=CORAL, border_width=2)
    draw = ImageDraw.Draw(img)

    f_lbl = get_system_font(14, bold=True)
    draw.rounded_rectangle([85, card_y1 + 18, 260, card_y1 + 46], radius=10, fill=CORAL_LIGHT + (255,))
    draw.text((100, card_y1 + 23), "Supervisor Feedback", fill=CORAL, font=f_lbl)

    f_fb = get_system_font(20, bold=False)
    fb_text = recipe.get("comparison", {}).get("trap_text") or (
        "\"This section reads as a descriptive summary. You've listed what authors say, "
        "without evaluating their methodology. Where is YOUR critical voice?\""
    )
    fb_lines = wrap_text(draw, fb_text, f_fb, W - 180)
    for i, l in enumerate(fb_lines[:4]):
        draw.text((85, card_y1 + 68 + i * 32), l, fill=SLATE, font=f_fb)

    # Red underline annotation & tip
    f_annot = get_system_font(16, bold=True)
    draw.line([(85, card_y1 + 215), (W - 85, card_y1 + 215)], fill=CORAL + (180,), width=2)
    draw.text((85, card_y1 + 230), "This is the #1 reason students get capped at 54%.", fill=CORAL, font=f_annot)
    draw.text((85, card_y1 + 260), "Swipe right — I'll show you exactly how to fix it.", fill=EMERALD, font=f_annot)

    # High-contrast stats bar
    stat_y1 = card_y2 + 25
    stat_y2 = stat_y1 + 130
    draw = draw_rounded_shadow_card(img, draw, 60, stat_y1, W - 60, stat_y2, radius=20, bg=BRAND_NAVY)
    draw = ImageDraw.Draw(img)

    stats = [("54%", "Without this fix", CORAL), ("78%+", "With this fix", EMERALD), ("3", "Sentences needed", GOLD)]
    col_w = (W - 120) // 3
    f_num = get_system_font(40, bold=True)
    f_l = get_system_font(14, bold=False)
    for idx, (num, lbl, clr) in enumerate(stats):
        cx = 60 + col_w * idx + col_w // 2
        nb = draw.textbbox((0, 0), num, font=f_num)
        nw = nb[2] - nb[0]
        draw.text((cx - nw // 2, stat_y1 + 18), num, fill=clr + (255,), font=f_num)
        lb = draw.textbbox((0, 0), lbl, font=f_l)
        lw = lb[2] - lb[0]
        draw.text((cx - lw // 2, stat_y1 + 75), lbl, fill=(200, 210, 225, 255), font=f_l)
        if idx > 0:
            x_div = 60 + col_w * idx
            draw.line([(x_div, stat_y1 + 25), (x_div, stat_y1 + 105)], fill=(50, 65, 90, 200), width=1)

    stamp_footer(img, draw, cta_type="swipe")
    img.convert("RGB").save(output_path, "PNG", quality=95)
    return output_path


# ==============================================================================
# Slide 2: The Mistake (Word Doc Mockup + Annotations)
# ==============================================================================
def render_slide_2_comparison(recipe: Dict[str, Any], output_path: Path) -> Path:
    """Generate Slide 2: Word doc simulation showing the common mistake and why it fails."""
    W, H = 1080, 1080
    img = Image.new("RGBA", (W, H), BG_LIGHT + (255,))
    draw = ImageDraw.Draw(img)

    category = recipe.get("badge", "Study Hack")
    stamp_header(img, draw, slide_num=2, total_slides=4, category=category)

    # Section title
    f_sec = get_system_font(15, bold=True)
    draw.rounded_rectangle([60, 115, 230, 145], radius=12, fill=CORAL_LIGHT + (255,))
    draw.text((76, 120), "THE MISTAKE", fill=CORAL, font=f_sec)

    f_title = get_system_font(36, bold=True)
    draw.text((60, 160), "What 90% of students write", fill=CHARCOAL, font=f_title)
    f_sub = get_system_font(21, bold=False)
    draw.text((60, 208), "(and why markers cap it at 54%)", fill=SLATE, font=f_sub)

    # Word doc simulation card
    doc_y1, doc_y2 = 255, 610
    draw = draw_rounded_shadow_card(img, draw, 60, doc_y1, W - 60, doc_y2, radius=20, bg=BG_WHITE, border_color=(230, 230, 230), border_width=1)
    draw = ImageDraw.Draw(img)

    # Mac window titlebar
    draw.rounded_rectangle([60, doc_y1, W - 60, doc_y1 + 45], radius=20, fill=(245, 245, 248, 255))
    draw.rectangle([60, doc_y1 + 25, W - 60, doc_y1 + 45], fill=(245, 245, 248, 255))
    draw.ellipse([82, doc_y1 + 16, 96, doc_y1 + 30], fill=CORAL + (255,))
    draw.ellipse([106, doc_y1 + 16, 120, doc_y1 + 30], fill=AMBER + (255,))
    draw.ellipse([130, doc_y1 + 16, 144, doc_y1 + 30], fill=EMERALD + (255,))
    f_doc = get_system_font(13, bold=False)
    draw.text((156, doc_y1 + 16), "Coursework_Draft_Chapter.docx", fill=MUTED, font=f_doc)

    # Bad paragraph
    f_body = get_system_font(19, bold=False)
    trap_text = recipe.get("comparison", {}).get("trap_text", "")
    bad_lines = wrap_text(draw, trap_text, f_body, W - 220)
    for i, line in enumerate(bad_lines[:5]):
        draw.text((85, doc_y1 + 65 + i * 32), line, fill=SLATE, font=f_body)

    # Annotation box inside card
    draw.rounded_rectangle([W - 380, doc_y2 - 110, W - 80, doc_y2 - 20], radius=12, fill=CORAL_LIGHT + (255,), outline=CORAL + (100,), width=1)
    f_ann = get_system_font(14, bold=True)
    draw.text((W - 365, doc_y2 - 95), "• No evaluation.", fill=CORAL, font=f_ann)
    draw.text((W - 365, doc_y2 - 70), "• No method critique.", fill=CORAL, font=f_ann)
    draw.text((W - 365, doc_y2 - 45), "• Just passive summary.", fill=CORAL, font=f_ann)

    # Bottom verdict card
    verd_y1, verd_y2 = 645, 875
    draw = draw_rounded_shadow_card(img, draw, 60, verd_y1, W - 60, verd_y2, radius=20, bg=CORAL_LIGHT)
    draw = ImageDraw.Draw(img)

    f_vt = get_system_font(22, bold=True)
    f_vb = get_system_font(18, bold=False)
    draw.text((85, verd_y1 + 22), "Why this gets capped at 54%", fill=CORAL, font=f_vt)

    mistake_bullets = [
        "Lists what authors say — doesn't evaluate HOW they found it",
        "No comparison of sample sizes, methods, or regional scope",
        "Jumps to a conclusion without justified academic analysis",
    ]
    for i, p in enumerate(mistake_bullets):
        draw.ellipse([85, verd_y1 + 65 + i * 42, 95, verd_y1 + 75 + i * 42], fill=CORAL + (255,))
        draw.text((108, verd_y1 + 60 + i * 42), p, fill=SLATE, font=f_vb)

    stamp_footer(img, draw, cta_type="swipe")
    img.convert("RGB").save(output_path, "PNG", quality=95)
    return output_path


# ==============================================================================
# Slide 3: The Fix (Numbered 1-2-3 Step Cards)
# ==============================================================================
def render_slide_3_formula(recipe: Dict[str, Any], output_path: Path) -> Path:
    """Generate Slide 3: Numbered step cards (Compare -> Critique -> Conclude) + result."""
    W, H = 1080, 1080
    img = Image.new("RGBA", (W, H), BG_LIGHT + (255,))
    draw = ImageDraw.Draw(img)

    category = recipe.get("badge", "Study Hack")
    stamp_header(img, draw, slide_num=3, total_slides=4, category=category)

    # Section title
    f_sec = get_system_font(15, bold=True)
    draw.rounded_rectangle([60, 115, 200, 145], radius=12, fill=EMERALD_LIGHT + (255,))
    draw.text((76, 120), "THE FIX", fill=EMERALD, font=f_sec)

    f_title = get_system_font(36, bold=True)
    draw.text((60, 160), "The 3-sentence formula", fill=CHARCOAL, font=f_title)
    f_sub = get_system_font(21, bold=False)
    draw.text((60, 208), "that gets you 78%+ (every single time)", fill=SLATE, font=f_sub)

    # 3 Sequential Step Cards
    steps_data = recipe.get("formula", {}).get("steps", [])
    if len(steps_data) < 3:
        steps_data = [
            {"num": "1", "label": "Compare", "desc": "Start by acknowledging what author A posits."},
            {"num": "2", "label": "Critique", "desc": "Expose sample size, methodology, or jurisdiction limits."},
            {"num": "3", "label": "Conclude", "desc": "Deliver your justified verdict on the evidence."},
        ]

    step_colors = [GOLD, CORAL, EMERALD]
    y_start = 265
    card_h = 160

    f_num = get_system_font(24, bold=True)
    f_lbl = get_system_font(24, bold=True)
    f_desc = get_system_font(18, bold=False)
    f_sub_step = get_system_font(15, bold=False)

    for idx, step in enumerate(steps_data[:3]):
        cy = y_start + idx * (card_h + 16)
        color = step_colors[idx]
        draw = draw_rounded_shadow_card(img, draw, 60, cy, W - 60, cy + card_h, radius=18, bg=BG_WHITE, border_color=color, border_width=2)
        draw = ImageDraw.Draw(img)

        # Number circle
        draw.ellipse([82, cy + 18, 122, cy + 58], fill=color + (255,))
        nb = draw.textbbox((0, 0), str(step.get("num", idx + 1)), font=f_num)
        nw = nb[2] - nb[0]
        draw.text((102 - nw // 2, cy + 24), str(step.get("num", idx + 1)), fill=BG_WHITE, font=f_num)

        # Step label
        draw.text((140, cy + 22), step.get("label", ""), fill=CHARCOAL, font=f_lbl)

        # Step description wrapped
        d_lines = wrap_text(draw, step.get("desc", ""), f_desc, W - 220)
        for i, dl in enumerate(d_lines[:2]):
            draw.text((140, cy + 62 + i * 26), dl, fill=SLATE, font=f_desc)

        # Extra prompt hint
        hint = "Formula applied directly to your university rubric"
        draw.text((140, cy + card_h - 32), hint, fill=MUTED, font=f_sub_step)

    # Result banner
    res_y1 = y_start + 3 * (card_h + 16) + 5
    draw = draw_rounded_shadow_card(img, draw, 60, res_y1, W - 60, res_y1 + 75, radius=16, bg=EMERALD_LIGHT)
    draw = ImageDraw.Draw(img)
    f_res = get_system_font(20, bold=True)
    draw.text((85, res_y1 + 25), "Result: 78% — 82% (High First Class / Distinction)", fill=EMERALD, font=f_res)

    stamp_footer(img, draw, cta_type="save")
    img.convert("RGB").save(output_path, "PNG", quality=95)
    return output_path


# ==============================================================================
# Slide 4: The Cheat Sheet (Save-Worthy Checklist + WhatsApp CTA)
# ==============================================================================
def render_slide_4_checklist_cta(recipe: Dict[str, Any], output_path: Path) -> Path:
    """Generate Slide 4: 8-item pre-submission checklist & WhatsApp triage."""
    W, H = 1080, 1080
    img = Image.new("RGBA", (W, H), BG_LIGHT + (255,))
    draw = ImageDraw.Draw(img)

    category = "Save This"
    stamp_header(img, draw, slide_num=4, total_slides=4, category=category)

    # Section title
    f_sec = get_system_font(15, bold=True)
    draw.rounded_rectangle([60, 115, 215, 145], radius=12, fill=GOLD_LIGHT + (255,))
    draw.text((76, 120), "CHEAT SHEET", fill=GOLD, font=f_sec)

    f_title = get_system_font(34, bold=True)
    draw.text((60, 160), "Critical Writing Pre-Submit Checklist", fill=CHARCOAL, font=f_title)
    f_sub = get_system_font(19, bold=False)
    draw.text((60, 206), "Screenshot this before your next deadline", fill=MUTED, font=f_sub)

    # Checklist container card
    chk_y1, chk_y2 = 245, 815
    draw = draw_rounded_shadow_card(img, draw, 60, chk_y1, W - 60, chk_y2, radius=20, bg=BG_WHITE)
    draw = ImageDraw.Draw(img)

    checklist_items = recipe.get("checklist", [])
    if len(checklist_items) < 8:
        checklist_items = [
            "Every paragraph evaluates, not just describes",
            "You've critiqued at least one author's methodology",
            "Direct quotes include exact page pinpoints (p. 45)",
            "70%+ of your sources are published in the last 5 years",
            "Your conclusion answers the prompt with zero new citations",
            "You've used \"however\", \"crucially\", \"whilst\" — not \"also\"",
            "In-text citations match your reference bibliography 100%",
            "You've scanned the draft for AI and similarity flags",
        ]

    f_chk = get_system_font(18, bold=False)
    y_step = 68
    for i, item in enumerate(checklist_items[:8]):
        cy = chk_y1 + 25 + i * y_step
        box_x, box_y = 90, cy + 2

        # Emerald checkmark box
        draw.rounded_rectangle([box_x, box_y, box_x + 26, box_y + 26], radius=6, fill=EMERALD + (255,))
        draw.line([(box_x + 5, box_y + 13), (box_x + 10, box_y + 19), (box_x + 20, box_y + 7)], fill=BG_WHITE, width=3)

        lines = wrap_text(draw, item, f_chk, W - 210)
        draw.text((130, cy + 3), lines[0], fill=CHARCOAL, font=f_chk)
        if len(lines) > 1:
            draw.text((130, cy + 24), lines[1], fill=SLATE, font=f_chk)

        if i < len(checklist_items[:8]) - 1:
            draw.line([(90, cy + 48), (W - 90, cy + 48)], fill=(*MUTED[:3], 40), width=1)

    # Share nudge card
    draw = draw_rounded_shadow_card(img, draw, 60, 835, W - 60, 880, radius=12, bg=GOLD_LIGHT)
    draw = ImageDraw.Draw(img)
    f_nudge = get_system_font(16, bold=True)
    draw.text((85, 848), "Save this post  •  Share it with a friend who needs it", fill=GOLD, font=f_nudge)

    stamp_footer(img, draw, cta_type="whatsapp")
    img.convert("RGB").save(output_path, "PNG", quality=95)
    return output_path


def ensure_rich_academic_content(recipe: Dict[str, Any]) -> Dict[str, Any]:
    """Guarantees deep, realistic academic content on every slide with zero empty voids."""
    r = dict(recipe)
    topic = r.get("topic", "Academic Coursework")
    cmp = dict(r.get("comparison", {}))

    # 1. Ensure trap text is at least 2 full sentences of a realistic student draft
    trap = cmp.get("trap_text", "").strip()
    if len(trap) < 65:
        cmp["trap_text"] = (
            f"Smith (2021) asserts that key variables in {topic.lower()} are correlated. "
            f"Jones (2022) also observes similar patterns in recent evaluations. "
            f"Therefore, findings indicate that this intervention is generally effective."
        )

    # 2. Ensure fix text is a realistic 3-4 sentence First Class synthesis
    fix = cmp.get("fix_text", "").strip()
    if len(fix) < 85:
        cmp["fix_text"] = (
            f"Whilst Smith (2021) attributes outcomes in {topic.lower()} to broad environmental factors, "
            f"their qualitative sample (n=18) overlooks systemic institutional constraints. "
            f"Crucially, Jones' (2022) longitudinal cohort proves that intervention protocols directly moderate "
            f"efficacy — demonstrating that procedural rigor, not external context, governs total outcomes."
        )
    r["comparison"] = cmp

    # 3. Ensure checklist has 8 high-utility rubric checks
    chk = list(r.get("checklist", []))
    if len(chk) < 8:
        r["checklist"] = [
            "Every paragraph evaluates, not just describes",
            "You've critiqued at least one author's methodology",
            "Direct quotes include exact page pinpoints (p. 45)",
            "70%+ of your sources are published in the last 5 years",
            "Your conclusion answers the prompt with zero new citations",
            "You've used \"however\", \"crucially\", \"whilst\" — not \"also\"",
            "In-text citations match your reference bibliography 100%",
            "You've scanned the draft for AI and similarity flags",
        ]

    # 4. Ensure formula steps have rich labels and descriptions
    formula = dict(r.get("formula", {}))
    steps = formula.get("steps", [])
    if len(steps) < 3 or any(len(s.get("desc", "")) < 20 for s in steps):
        formula["steps"] = [
            {"num": "1", "label": "Compare", "desc": f"Acknowledge the core premise of primary authors in {topic.lower()}."},
            {"num": "2", "label": "Critique", "desc": "Scrutinize methodology, sample cohorts, or contextual limitations."},
            {"num": "3", "label": "Conclude", "desc": "Deliver your justified synthesis answering the marking criteria."},
        ]
    r["formula"] = formula

    return r


def generate_carousel_slides(recipe: Dict[str, Any], slot: str) -> List[Path]:
    """Generate the full 4-slide modern minimal editorial carousel."""
    recipe = ensure_rich_academic_content(recipe)
    date_str = dt.datetime.now(dt.timezone.utc).strftime("%Y%m%d")
    slides = []

    slide_configs = [
        (1, render_slide_1_cover),
        (2, render_slide_2_comparison),
        (3, render_slide_3_formula),
        (4, render_slide_4_checklist_cta),
    ]

    for s_num, renderer in slide_configs:
        daily_filename = f"daily_{slot}_slide_{s_num}.png"
        archive_filename = f"{date_str}_{slot}_slide_{s_num}.png"
        daily_path = PUBLIC_SOCIAL_DIR / daily_filename
        archive_path = PUBLIC_SOCIAL_DIR / archive_filename

        renderer(recipe, daily_path)
        with open(daily_path, "rb") as f_in, open(archive_path, "wb") as f_out:
            f_out.write(f_in.read())

        slides.append(daily_path)
        print(f"  ✅ Slide {s_num}/4 synthesized: {daily_path.name}")

    return slides


# ==============================================================================
# True 9:16 Vertical Video Reel Engine (Neural Voiceover + Lo-Fi + FFmpeg)
# ==============================================================================
def render_reel_frame(recipe: Dict[str, Any], output_path: Path) -> Path:
    """Render the high-retention 9:16 vertical video reel keyframe (1080x1920)."""
    recipe = ensure_rich_academic_content(recipe)
    W, H = 1080, 1920
    img = Image.new("RGBA", (W, H), BG_WARM + (255,))
    draw = ImageDraw.Draw(img)

    # Top gold accent strip
    draw.rectangle([0, 0, W, 5], fill=GOLD + (255,))

    # Top Header safe zone
    top_y = 80
    logo = get_cropped_logo()
    logo_size = 56
    logo_x = 55
    draw.ellipse([logo_x - 4, top_y - 4, logo_x + logo_size + 4, top_y + logo_size + 4],
                 fill=GOLD_LIGHT + (255,), outline=GOLD + (160,), width=2)
    if logo:
        thumb = logo.resize((logo_size, logo_size), Image.Resampling.LANCZOS)
        img.paste(thumb, (logo_x, top_y), thumb)

    f_brand = get_system_font(24, bold=True)
    f_sub_brand = get_system_font(16, bold=False)
    draw.text((logo_x + logo_size + 16, top_y + 4), "Academic Wizard", fill=CHARCOAL, font=f_brand)
    draw.text((logo_x + logo_size + 16, top_y + 30), "Your Academic Mentor", fill=MUTED, font=f_sub_brand)

    # Right: Study Tip pill
    f_pill = get_system_font(14, bold=True)
    draw.rounded_rectangle([W - 185, top_y + 10, W - 55, top_y + 42], radius=16, fill=EMERALD_LIGHT + (255,), outline=EMERALD + (100,), width=1)
    draw.text((W - 168, top_y + 16), "Study Tip", fill=EMERALD, font=f_pill)

    # 3-Second Pattern Interrupt Hook Card
    hook_y = 180
    draw = draw_rounded_shadow_card(img, draw, 45, hook_y, W - 45, hook_y + 200, radius=24, bg=CHARCOAL, shadow_offset=8, shadow_blur=16)
    draw = ImageDraw.Draw(img)

    f_pov = get_system_font(18, bold=True)
    f_hook_big = get_system_font(36, bold=True)
    draw.text((80, hook_y + 25), "POV: It's 2 AM. Your supervisor's email says:", fill=MUTED, font=f_pov)

    hook_quote = f"\"{recipe.get('hook_headline', 'This reads like a book report. Where is your critical voice?')}\""
    hook_lines = wrap_text(draw, hook_quote, f_hook_big, W - 160)
    for i, line in enumerate(hook_lines[:2]):
        draw.text((80, hook_y + 68 + i * 48), line, fill=BG_WHITE, font=f_hook_big)

    # Word Doc Simulation Card
    doc_y = 420
    doc_h = 720
    draw = draw_rounded_shadow_card(img, draw, 45, doc_y, W - 45, doc_y + doc_h, radius=20, bg=BG_WHITE, shadow_offset=8, shadow_blur=16)
    draw = ImageDraw.Draw(img)

    # Mac window bar
    draw.rounded_rectangle([45, doc_y, W - 45, doc_y + 48], radius=20, fill=(245, 245, 248, 255))
    draw.rectangle([45, doc_y + 28, W - 45, doc_y + 48], fill=(245, 245, 248, 255))
    draw.ellipse([68, doc_y + 14, 82, doc_y + 28], fill=CORAL + (255,))
    draw.ellipse([92, doc_y + 14, 106, doc_y + 28], fill=AMBER + (255,))
    draw.ellipse([116, doc_y + 14, 130, doc_y + 28], fill=EMERALD + (255,))
    f_doc = get_system_font(13, bold=False)
    draw.text((142, doc_y + 14), "Coursework_Draft_Chapter.docx", fill=MUTED, font=f_doc)

    # Section A: What you wrote (54%) with strikethrough
    f_sect = get_system_font(16, bold=True)
    f_body = get_system_font(18, bold=False)
    draw.rounded_rectangle([70, doc_y + 65, 310, doc_y + 92], radius=10, fill=CORAL_LIGHT + (255,))
    draw.text((85, doc_y + 69), "What you wrote (54%)", fill=CORAL, font=f_sect)

    trap_text = recipe.get("comparison", {}).get("trap_text", "")
    bad_lines = wrap_text(draw, trap_text, f_body, W - 200)
    for i, line in enumerate(bad_lines[:4]):
        ly = doc_y + 110 + i * 32
        draw.text((70, ly), line, fill=(*SLATE, 160), font=f_body)
        draw.line([(70, ly + 14), (min(70 + len(line) * 9, W - 80), ly + 14)], fill=CORAL + (150,), width=2)

    draw.line([(70, doc_y + 260), (W - 70, doc_y + 260)], fill=(*MUTED, 60), width=1)

    # Section B: The 78%+ Rewrite
    draw.rounded_rectangle([70, doc_y + 280, 310, doc_y + 307], radius=10, fill=EMERALD_LIGHT + (255,))
    draw.text((85, doc_y + 284), "The 78%+ rewrite", fill=EMERALD, font=f_sect)

    fix_text = recipe.get("comparison", {}).get("fix_text", "")
    good_lines = wrap_text(draw, fix_text, f_body, W - 200)
    for i, line in enumerate(good_lines[:6]):
        ly = doc_y + 325 + i * 32
        draw.text((70, ly), line, fill=CHARCOAL, font=f_body)

    # Golden Rule Box
    draw.rounded_rectangle([70, doc_y + 535, W - 70, doc_y + 610], radius=14, fill=EMERALD_LIGHT + (255,), outline=EMERALD + (80,), width=1)
    f_rule = get_system_font(17, bold=True)
    f_rule_sub = get_system_font(16, bold=False)
    draw.text((90, doc_y + 545), "The Golden Rule:", fill=EMERALD, font=f_rule)
    draw.text((90, doc_y + 575), "Compare → Critique the method → State YOUR verdict.", fill=CHARCOAL, font=f_rule_sub)

    # Grade jump pill
    draw.rounded_rectangle([70, doc_y + 635, W - 70, doc_y + 700], radius=14, fill=GOLD_LIGHT + (255,))
    f_grade = get_system_font(20, bold=True)
    draw.text((95, doc_y + 652), "Grade jump: 54%  →  78%+ (First Class)", fill=GOLD, font=f_grade)

    # Kinetic Subtitle Bar
    sub_y = 1185
    draw = draw_rounded_shadow_card(img, draw, 70, sub_y, W - 70, sub_y + 85, radius=16, bg=CHARCOAL, shadow_offset=4, shadow_blur=10)
    draw = ImageDraw.Draw(img)

    f_sub_spoken = get_system_font(25, bold=True)
    draw.text((100, sub_y + 14), "Never just summarize.", fill=BG_WHITE, font=f_sub_spoken)
    draw.text((100, sub_y + 46), "Always critique the method.", fill=AMBER + (255,), font=f_sub_spoken)

    # Bottom CTA card
    cta_y = 1310
    draw = draw_rounded_shadow_card(img, draw, 45, cta_y, W - 45, cta_y + 220, radius=24, bg=BG_WHITE, shadow_offset=8, shadow_blur=16)
    draw = ImageDraw.Draw(img)

    f_cta_h = get_system_font(26, bold=True)
    f_cta_s = get_system_font(18, bold=False)
    draw.text((80, cta_y + 28), "Stuck on your coursework or dissertation?", fill=CHARCOAL, font=f_cta_h)
    draw.text((80, cta_y + 68), "Get 1-on-1 expert help from real postgraduate mentors.", fill=SLATE, font=f_cta_s)
    draw.text((80, cta_y + 96), "Nursing • Law • MBA • CS • Engineering • Psychology", fill=MUTED, font=f_cta_s)

    # WhatsApp green button
    draw.rounded_rectangle([80, cta_y + 140, W - 80, cta_y + 195], radius=16, fill=WA_GREEN + (255,))
    f_btn_wa = get_system_font(22, bold=True)
    draw.text((120, cta_y + 152), f"WhatsApp: {WHATSAPP_DISPLAY}", fill=BG_WHITE, font=f_btn_wa)

    # Domain watermark
    f_wm = get_system_font(16, bold=False)
    wm_bbox = draw.textbbox((0, 0), "academicwizard.online", font=f_wm)
    wm_w = wm_bbox[2] - wm_bbox[0]
    draw.text((W // 2 - wm_w // 2, 1580), "academicwizard.online", fill=MUTED, font=f_wm)

    # Bottom gold strip
    draw.rectangle([0, H - 5, W, H], fill=GOLD + (255,))

    img.convert("RGB").save(output_path, "PNG", quality=95)
    return output_path


def synthesize_voiceover(script_text: str, output_audio: Path) -> bool:
    """Generate neural British voiceover audio using edge-tts."""
    try:
        import asyncio
        import edge_tts

        voice = "en-GB-RyanNeural"
        print(f"  🎙️ Synthesizing voiceover with {voice}...")

        async def _speak():
            comm = edge_tts.Communicate(script_text, voice)
            await comm.save(str(output_audio))

        asyncio.run(_speak())
        if output_audio.exists() and output_audio.stat().st_size > 500:
            print(f"  ✅ Voiceover audio generated: {output_audio.name} ({output_audio.stat().st_size // 1024} KB)")
            return True
    except Exception as e:
        print(f"  ⚠️ Voiceover synthesis error: {e}")
    return False


def generate_video_reel(recipe: Dict[str, Any], slot: str) -> Optional[Path]:
    """Convert recipe into an engaging 9:16 vertical MP4 video reel with neural audio & lo-fi beat."""
    import shutil
    import subprocess

    output_path = PUBLIC_SOCIAL_DIR / f"daily_{slot}_reel.mp4"
    frame_path = PUBLIC_SOCIAL_DIR / f"daily_{slot}_reel_frame.png"
    audio_path = PUBLIC_SOCIAL_DIR / f"daily_{slot}_reel_audio.mp3"

    # 1. Render high-res 9:16 frame
    render_reel_frame(recipe, frame_path)
    print(f"  ✅ 9:16 Reel frame generated: {frame_path.name}")

    # 2. Synthesize voiceover audio
    spoken_script = (
        f"Your supervisor wrote: {recipe.get('hook_headline', 'lacks critical depth')}? "
        "Here is why. When you only summarize what authors said without evaluating methodology, "
        "markers cap your grade at 54 percent. "
        "The first-class fix: Compare, critique the methodology, and state your own verdict. "
        "Save this reel and WhatsApp Academic Wizard for 1-on-1 mentor help."
    )
    voice_ok = synthesize_voiceover(spoken_script, audio_path)

    # 3. Check for FFmpeg
    if not shutil.which("ffmpeg"):
        print("  ℹ️ FFmpeg not installed on local host — reel frame and audio ready for GitHub runner compilation.")
        return None

    try:
        # Lo-fi background beat
        LOFI_DIR = SCRIPT_DIR / "lofi_beats"
        beats = list(LOFI_DIR.glob("*.wav")) + list(LOFI_DIR.glob("*.mp3"))
        lofi_path = random.choice(beats) if beats else None

        # FFmpeg assembly command (15-second 1080x1920 video at 30fps)
        cmd = [
            "ffmpeg", "-y",
            "-loop", "1", "-i", str(frame_path),
        ]

        if voice_ok and lofi_path:
            # Mix voiceover with soft lo-fi background music ducked at -18dB
            cmd.extend([
                "-i", str(audio_path),
                "-i", str(lofi_path),
                "-filter_complex",
                "[2:a]volume=0.15[bg];[1:a][bg]amix=inputs=2:duration=first[a]",
                "-map", "0:v",
                "-map", "[a]",
            ])
        elif voice_ok:
            cmd.extend(["-i", str(audio_path), "-map", "0:v", "-map", "1:a"])
        else:
            cmd.extend(["-t", "15", "-an"])

        cmd.extend([
            "-c:v", "libx264",
            "-t", "16",
            "-preset", "fast",
            "-crf", "22",
            "-pix_fmt", "yuv420p",
            "-r", "30",
            str(output_path),
        ])

        print("  🎬 Compiling 9:16 vertical reel with FFmpeg...")
        res = subprocess.run(cmd, capture_output=True, text=True, timeout=90)
        if res.returncode == 0 and output_path.exists():
            size_mb = output_path.stat().st_size / (1024 * 1024)
            print(f"  ✅ Broadcast 9:16 Video Reel generated: {output_path.name} ({size_mb:.1f} MB)")
            return output_path
        else:
            print(f"  ⚠️ FFmpeg failed (exit {res.returncode}): {res.stderr[-300:]}")
    except Exception as e:
        print(f"  ⚠️ Reel video compilation error: {e}")

    return None

# ==============================================================================
# Platform-Specific Copy Generator (Gemini Pro + Fallback)
# ==============================================================================
def format_copy_to_string(val: Any) -> str:
    """Ensure copy is a flat, clean single string ready for social publishing."""
    if isinstance(val, str):
        return val.strip()

    if isinstance(val, dict):
        # Case 1: Simple wrapper like {"post": "..."} or {"caption": "..."} or {"text": "..."}
        for k in ("post", "caption", "text", "content"):
            if k in val and isinstance(val[k], str):
                return val[k].strip()

        # Case 2: Structured object {hook, story, slides, takeaways, cta, hashtags}
        parts = []
        if "hook" in val and val["hook"]:
            parts.append(str(val["hook"]).strip())
        if "story" in val and val["story"]:
            parts.append(str(val["story"]).strip())
        if "slides" in val and val["slides"]:
            slides = val["slides"]
            if isinstance(slides, dict):
                parts.append("\n".join(f"• {v}" for v in slides.values() if v))
            elif isinstance(slides, list):
                parts.append("\n".join(f"• {v}" for v in slides if v))
        if "takeaways" in val and val["takeaways"]:
            takeaways = val["takeaways"]
            if isinstance(takeaways, list):
                parts.append("\n".join(f"✔ {t}" for t in takeaways if t))
            elif isinstance(takeaways, str):
                parts.append(takeaways.strip())
        if "cta" in val and val["cta"]:
            parts.append(str(val["cta"]).strip())
        if "hashtags" in val and val["hashtags"]:
            ht = val["hashtags"]
            if isinstance(ht, list):
                parts.append(" ".join(str(h) for h in ht))
            else:
                parts.append(str(ht).strip())

        if parts:
            return "\n\n".join(p for p in parts if p)

        # Fallback for unexpected dictionary keys
        return "\n\n".join(f"{k.capitalize()}: {v}" for k, v in val.items() if v)

    if isinstance(val, list):
        return "\n\n".join(str(item) for item in val if item)

    return str(val).strip() if val is not None else ""


def generate_platform_copy(recipe: Dict[str, Any], slot: str) -> Dict[str, str]:
    """Synthesize 3 platform-tailored copy variations with slide cues and hashtags."""
    wa_msg = recipe.get("whatsapp_msg") or f"Hi Academic Wizard, I need help with {recipe.get('topic', 'my academic coursework')}."
    wa_url = generate_whatsapp_link(wa_msg)
    tool_url = recipe.get("tool_url") or recipe.get("service_url") or f"{SITE_URL}/tools/"

    # Pre-crafted high-converting fallback
    fallback_copy = {
        "instagram": (
            f"📌 {recipe['hook_headline']}\n\n"
            f"Here is a brutal truth from university markers: up to 15% of your grade is lost purely on descriptive phrasing, missing page numbers, and avoidable rubric traps.\n\n"
            f"👉 SWIPE THROUGH TO SAVE YOUR GRADE:\n"
            f"• Slide 1: The supervisor comment that caps you at 54%\n"
            f"• Slide 2: The exact bad paragraph vs what examiners want\n"
            f"• Slide 3: The 3-sentence formula (Compare → Critique → Conclude)\n"
            f"• Slide 4: Screenshot-worthy pre-submission rubric checklist\n\n"
            f"🛠 100% Free academic tools & citation generators: link in bio\n"
            f"💬 Stuck at 2 AM? Our academic mentors are live 24/7 on WhatsApp: {WHATSAPP_DISPLAY}\n\n"
            f"📌 Save this post so you have the checklist ready for your next deadline!\n\n"
            f"#ukstudents #dissertationtips #academicwriting #essayhelp #studygram"
        ),
        "twitter": (
            f"Your marker circled your paragraph and wrote 'Where is YOUR critical voice?'\n\n"
            f"Here is why: You summarized what authors said without evaluating methodology. That caps your grade at 54%.\n\n"
            f"The 3-step fix:\n"
            f"1. Compare 2 authors\n"
            f"2. Critique sample size / method\n"
            f"3. State your justified verdict\n\n"
            f"Full guide & free tools linked in bio 👇"
        ),
        "facebook": (
            f"🎓 {recipe['hook_headline']}\n\n"
            f"Whether you are writing an undergraduate coursework essay, nursing care plan, law brief, or master's dissertation, tutors mark against strict analytical criteria:\n\n"
            f"❌ The Common Mistake (54% 2:2):\n{recipe['comparison']['trap_text']}\n\n"
            f"✅ The First-Class Blueprint (78%+):\n{recipe['comparison']['fix_text']}\n\n"
            f"📋 Pre-Submission Rubric Checklist:\n"
            + "\n".join(f"✔ {chk}" for chk in recipe.get("checklist", []))
            + f"\n\n🛠 Access our free academic tools, citation makers, and grade calculators at academicwizard.online\n\n"
            f"🚨 Under a tight deadline? Our postgraduate team provides 1-on-1 human guidance and Turnitin similarity checks.\n"
            f"💬 Connect directly with our coordinators on WhatsApp: {WHATSAPP_DISPLAY}\n\n"
            f"Save this guide and share it with a friend who is working on an assignment!"
        ),
    }

    if not GEMINI_API_KEY:
        return fallback_copy

    system_prompt = (
        "You are an elite academic mentor for Academic Wizard (academicwizard.online). "
        "Your voice: warm, friendly, authoritative, and deeply practical — like an older sibling who graduated "
        "with a First Class and is sharing real secrets with university students (UK, US, Australia, Canada, Singapore).\n\n"
        "CRITICAL RULES:\n"
        "1. NEVER sound like a corporate advertisement or an AI generator. Avoid generic phrases like 'academic weapon', "
        "'elevate your studies', or 'stop settling'.\n"
        "2. Write CONVERSATIONAL, HUMANIZED copy. Relate to real student pain points (late nights, cryptic feedback, Turnitin panic).\n"
        "3. INSTAGRAM: 120-180 words, engaging hook, slide-by-slide guide, save reminder, and EXACTLY 3 TO 5 TARGETED HASHTAGS "
        "(e.g., #ukstudents #dissertationtips #lawstudent #nursingstudent #essayhelp). NEVER use more than 5 hashtags.\n"
        "4. TWITTER: Punchy conversational thread hook under 250 characters. DO NOT include outbound URLs or links in the tweet "
        "(X algorithm heavily penalizes external links). Tell them 'Details in bio 👇' or ask an engaging question.\n"
        "5. FACEBOOK: Friendly community study guide (150-200 words) with clear bullet points and WhatsApp consultation CTA.\n\n"
        "Output ONLY valid JSON with keys 'instagram', 'twitter', 'facebook'."
    )

    user_prompt = f"""
Slot: {slot.upper()}
Topic: {recipe['topic']}
Headline: {recipe['hook_headline']}
Comparison: {json.dumps(recipe['comparison'])}
Tool URL: {tool_url}
WhatsApp CTA URL: {wa_url}
WhatsApp Number: {WHATSAPP_DISPLAY}
"""

    try:
        api_url = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={GEMINI_API_KEY}"
        payload = {
            "contents": [{"parts": [{"text": f"{system_prompt}\n\n{user_prompt}"}]}],
            "generationConfig": {"temperature": 0.7, "maxOutputTokens": 2500},
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
                return {
                    "instagram": format_copy_to_string(parsed["instagram"]),
                    "twitter": format_copy_to_string(parsed["twitter"]),
                    "facebook": format_copy_to_string(parsed["facebook"]),
                }
    except Exception as exc:
        print(f"  ⚠️ Gemini copy generation fallback: {exc}")

    return fallback_copy


# ==============================================================================
# Buffer API Client (Multi-Image Carousel Support)
# ==============================================================================
class BufferClient:
    """Client for publishing multi-image carousels via Buffer (GraphQL + REST)."""

    def __init__(self, access_token: str, dry_run: bool = False):
        clean_token = (access_token or "").strip().strip('"').strip("'")
        if clean_token.startswith("Bearer "):
            clean_token = clean_token[7:].strip()
        self.token = clean_token
        self.dry_run = dry_run
        self.graphql_url = "https://api.buffer.com"
        self.rest_base = "https://api.bufferapp.com/1"
        self.headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json",
        }

    def get_channels_graphql(self) -> List[Dict[str, Any]]:
        """Fetch connected channels using GraphQL."""
        if not self.token:
            return []

        query_orgs = """
        query GetOrgs {
          account {
            id
            email
            name
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
                print(f"  ❌ Buffer GraphQL HTTP {res.status_code}: {res.text[:300]}")
                return []

            data = res.json()
            if "errors" in data and not data.get("data"):
                print(f"  ❌ Buffer GraphQL Auth/Schema Error: {json.dumps(data.get('errors'))}")
                return []

            account = data.get("data", {}).get("account")
            if not account:
                print(f"  ❌ Buffer GraphQL: 'account' object missing in response: {data}")
                return []

            account_name = account.get("name") or account.get("email") or account.get("id")
            print(f"  👤 Buffer Authenticated Account: {account_name} (ID: {account.get('id')})")

            orgs = account.get("organizations", [])
            if not orgs:
                print(f"  ⚠️ Buffer account authenticated, but found 0 organizations.")
                return []

            all_channels = []
            for org in orgs:
                org_id = org.get("id")
                org_name = org.get("name", "Default Workspace")
                # Direct interpolation avoids GraphQL type scalar mismatch
                query_channels = f"""
                query {{
                  channels(input: {{ organizationId: "{org_id}" }}) {{
                    id
                    name
                    service
                    displayName
                  }}
                }}
                """
                c_res = requests.post(self.graphql_url, headers=self.headers, json={"query": query_channels}, timeout=15)
                if c_res.status_code != 200:
                    print(f"  ⚠️ Channels query failed for org '{org_name}' ({org_id}): HTTP {c_res.status_code} - {c_res.text[:200]}")
                    continue

                c_data = c_res.json()
                if "errors" in c_data and not c_data.get("data"):
                    print(f"  ⚠️ Buffer GraphQL channels error for org '{org_name}': {c_data['errors']}")
                    continue

                channels = c_data.get("data", {}).get("channels", [])
                if channels:
                    print(f"  ✅ Retrieved {len(channels)} channel(s) from organization '{org_name}': {[c.get('service') for c in channels]}")
                    for ch in channels:
                        ch["organizationId"] = org_id
                        ch["name"] = ch.get("displayName") or ch.get("name") or ch.get("service")
                    all_channels.extend(channels)
                else:
                    print(f"  ℹ️ Organization '{org_name}' ({org_id}) currently has 0 connected social channels.")

            return all_channels
        except Exception as e:
            print(f"  ⚠️ Buffer GraphQL query exception: {e}")
            return []

    def get_profiles_rest(self) -> List[Dict[str, Any]]:
        """Fetch profiles via legacy REST API as fallback."""
        if not self.token:
            return []
        url = f"{self.rest_base}/profiles.json?access_token={self.token}"
        try:
            res = requests.get(url, timeout=15)
            if res.status_code == 200:
                profiles = res.json()
                if isinstance(profiles, list):
                    return [
                        {"id": p.get("id"), "name": p.get("formatted_username", p.get("service_username", "")), "service": p.get("service")}
                        for p in profiles
                    ]
            else:
                print(f"  ⚠️ Buffer REST profiles query returned HTTP {res.status_code}: {res.text[:200]}")
        except Exception as e:
            print(f"  ⚠️ Buffer REST profiles query failed: {e}")
        return []

    def get_all_profiles(self) -> List[Dict[str, Any]]:
        """Discover all connected profiles through GraphQL, with REST fallback."""
        if not self.token:
            if self.dry_run:
                print("  ℹ️ No BUFFER_ACCESS_TOKEN provided in dry-run mode; using simulated channels.")
                return [
                    {"id": "simulated_ig_1", "name": "academicwizard (IG)", "service": "instagram"},
                    {"id": "simulated_fb_1", "name": "Academic Wizard (FB)", "service": "facebook"},
                    {"id": "simulated_tw_1", "name": "AcademicWizardX (Twitter)", "service": "twitter"},
                ]
            else:
                print("  ❌ BUFFER_ACCESS_TOKEN environment variable is EMPTY. Please check your GitHub Secrets.")
                return []

        masked_token = f"{self.token[:4]}...{self.token[-4:]}" if len(self.token) >= 10 else "***"
        print(f"  🔑 Connecting with Buffer Token: {masked_token} (length: {len(self.token)})")

        channels = self.get_channels_graphql()
        if channels:
            print(f"  ✅ Retrieved total {len(channels)} channel(s) via Buffer GraphQL API.")
            return channels

        profiles = self.get_profiles_rest()
        if profiles:
            print(f"  ✅ Retrieved total {len(profiles)} profile(s) via Buffer REST API fallback.")
            return profiles

        return []

    def _execute_create_post(self, input_payload: Dict[str, Any]) -> Tuple[bool, Optional[str], Optional[str]]:
        """Helper to send createPost GraphQL mutation and return (success, post_id_or_err, error_type)."""
        mutation = """
        mutation CreatePost($input: CreatePostInput!) {
          createPost(input: $input) {
            ... on PostActionSuccess {
              post {
                id
                text
                status
              }
            }
            ... on MutationError {
              message
            }
          }
        }
        """
        try:
            res = requests.post(
                self.graphql_url,
                headers=self.headers,
                json={"query": mutation, "variables": {"input": input_payload}},
                timeout=25,
            )
            if res.status_code != 200:
                print(f"    ❌ Buffer GraphQL HTTP {res.status_code}: {res.text[:300]}")
                return False, f"HTTP {res.status_code}", "http_error"

            raw = res.json()
            if "errors" in raw and raw["errors"]:
                error_msgs = [e.get("message", str(e)) for e in raw["errors"]]
                joined_err = "; ".join(error_msgs)
                print(f"    ❌ Buffer GraphQL Top-Level Error: {joined_err}")
                return False, joined_err, "graphql_error"

            data = (raw.get("data") or {}).get("createPost") or {}
            if "post" in data and data["post"]:
                post_id = data["post"].get("id")
                return True, post_id, None
            elif "message" in data:
                return False, data["message"], "mutation_error"
            else:
                return False, f"Unexpected response structure: {raw}", "unknown_error"
        except Exception as e:
            print(f"    ⚠️ Buffer GraphQL request exception: {e}")
            return False, str(e), "exception"

    def create_post_graphql(self, channel_id: str, text: str, image_urls: List[str], force_publish: bool, service: str) -> bool:
        """Publish or schedule multi-asset carousel via Buffer GraphQL API."""
        initial_mode = "shareNow" if force_publish else "addToQueue"
        clean_text = format_copy_to_string(text)

        input_payload: Dict[str, Any] = {
            "channelId": channel_id,
            "text": clean_text,
            "schedulingType": "automatic",
            "mode": initial_mode,
        }

        is_video = bool(image_urls and any(u.lower().endswith((".mp4", ".mov")) for u in image_urls))
        if image_urls:
            if is_video:
                video_url = next(u for u in image_urls if u.lower().endswith((".mp4", ".mov")))
                input_payload["assets"] = [{"video": {"url": video_url}}]
            else:
                # Respect platform limits: Twitter max 4 images
                limit = 4 if ("twitter" in service or "x" in service) else len(image_urls)
                input_payload["assets"] = [{"image": {"url": u}} for u in image_urls[:limit]]

        # Buffer GraphQL strictly requires channel-specific metadata for Facebook and Instagram
        if "facebook" in service:
            input_payload["metadata"] = {
                "facebook": {
                    "type": "reel" if is_video else "post",
                }
            }
        elif "instagram" in service:
            input_payload["metadata"] = {
                "instagram": {
                    "type": "reel" if is_video else "post",
                    "shouldShareToFeed": True,
                }
            }

        success, result_msg, err_type = self._execute_create_post(input_payload)
        if success:
            print(f"    🎉 Success! Buffer Carousel Post ID: {result_msg} (mode={initial_mode})")
            return True

        # If shareNow fails (e.g. channel doesn't support immediate direct publish), retry with addToQueue
        if initial_mode == "shareNow":
            print(f"    ⚠️ 'shareNow' returned: {result_msg}. Retrying with 'addToQueue'...")
            input_payload["mode"] = "addToQueue"
            q_success, q_result, _ = self._execute_create_post(input_payload)
            if q_success:
                print(f"    🎉 Success! Queued Buffer Post ID: {q_result} (mode=addToQueue)")
                return True
            else:
                print(f"    ❌ 'addToQueue' also failed: {q_result}")
        else:
            print(f"    ❌ Buffer GraphQL creation failed: {result_msg}")

        return False

    def create_post_rest(self, profile_id: str, text: str, image_urls: List[str], force_publish: bool) -> bool:
        """Publish or schedule post via legacy REST API as fallback."""
        url = f"{self.rest_base}/updates/create.json"
        data: Dict[str, Any] = {
            "access_token": self.token,
            "profile_ids[]": [profile_id],
            "text": text,
            "now": "true" if force_publish else "false",
        }
        if image_urls:
            data["media[photo]"] = image_urls[0]
            for idx, u in enumerate(image_urls[1:4]):
                data[f"extra_media[{idx}][photo]"] = u

        try:
            res = requests.post(url, data=data, timeout=25)
            if res.status_code == 200:
                print(f"    🎉 Success via REST API!")
                return True
            else:
                print(f"    ⚠️ Buffer REST HTTP {res.status_code}: {res.text}")
        except Exception as e:
            print(f"    ⚠️ Buffer REST request error: {e}")

        return False

    def dispatch(self, channel: Dict[str, Any], text: str, image_urls: List[str], force_publish: bool) -> bool:
        """Send carousel post to a channel, handling dry-run and dual API dispatch."""
        ch_id = channel["id"]
        ch_name = channel.get("name", ch_id)
        ch_service = channel.get("service", "unknown").lower()

        if self.dry_run or not self.token:
            print(f"    [DRY-RUN] Simulating Buffer carousel post to {ch_service} ('{ch_name}')...")
            print(f"    Attached Slides: {len(image_urls)} images:")
            for idx, u in enumerate(image_urls, 1):
                print(f"      • Slide {idx}: {u}")
            print(f"    Text Preview: {text[:140]}...")
            return True

        success = self.create_post_graphql(ch_id, text, image_urls, force_publish, ch_service)
        # Buffer Public API tokens cannot use legacy REST API (which returns HTTP 401).
        # Only attempt REST fallback if token is an OAuth token (starts with '1/').
        if not success and self.token.startswith("1/"):
            print(f"    Attempting legacy REST fallback for profile {ch_name}...")
            success = self.create_post_rest(ch_id, text, image_urls, force_publish)

        return success


# ==============================================================================
# Main Orchestrator
# ==============================================================================
def pick_daily_recipe(slot: str, topic_idx: Optional[int] = None) -> Dict[str, Any]:
    """Select the appropriate content recipe based on dynamic weekly plan or default rotation."""
    slot_recipes = ROTATION_MATRIX.get(slot, ROTATION_MATRIX["morning"])

    # 1. Manual override index takes precedence
    if topic_idx is not None and 0 <= topic_idx < len(slot_recipes):
        return slot_recipes[topic_idx]

    now_utc = dt.datetime.now(dt.timezone.utc)
    day_name = now_utc.strftime("%A")  # "Monday", "Tuesday", etc.
    date_str = now_utc.strftime("%Y-%m-%d")

    # 2. Check for AI-optimized weekly plan
    plan_file = SCRIPT_DIR / "weekly_social_plan.json"
    if plan_file.exists():
        try:
            with open(plan_file, "r", encoding="utf-8") as f:
                plan_data = json.load(f)

            schedule = plan_data.get("schedule", {})
            day_plan = schedule.get(date_str) or schedule.get(day_name)
            if day_plan and slot in day_plan:
                planned_recipe = day_plan[slot]
                required_keys = {"topic", "badge", "hook_headline", "hook_sub", "comparison", "formula", "checklist"}
                if required_keys.issubset(planned_recipe.keys()):
                    print(f"  🧠 [Adaptive AI Planner] Found active weekly plan for {day_name} ({slot.upper()})!")
                    if "tool_url" not in planned_recipe and "service_url" not in planned_recipe:
                        planned_recipe["tool_url"] = f"{SITE_URL}/tools/" if slot == "morning" else f"{SITE_URL}/services/assignment-help/"
                    if "whatsapp_msg" not in planned_recipe:
                        planned_recipe["whatsapp_msg"] = f"Hi Academic Wizard, I saw your post on {planned_recipe['topic']} and need assistance."
                    return planned_recipe
        except Exception as e:
            print(f"  ⚠️ Could not load weekly_social_plan.json: {e}")

    # 3. Fallback to standard weekly rotation matrix
    day_idx = now_utc.weekday()
    return slot_recipes[day_idx % len(slot_recipes)]


def run(
    slot: str,
    dry_run: bool = False,
    force_publish: bool = True,
    topic_idx: Optional[int] = None,
    skip_image: bool = False,
    generate_only: bool = False,
    dispatch_only: bool = False,
):
    print("=" * 75)
    print(f"🚀 Academic Wizard Modern Social & Reel Automation Engine")
    print(f"📅 Slot: {slot.upper()} | UTC Time: {dt.datetime.now(dt.timezone.utc).strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"⚙️  Generate Only: {generate_only} | Dispatch Only: {dispatch_only} | Dry Run: {dry_run}")
    print("=" * 75)

    pending_file = PUBLIC_SOCIAL_DIR / f"pending_post_{slot}.json"
    recipe = pick_daily_recipe(slot, topic_idx)

    # -------------------------------------------------------------------------
    # STAGE 1: ASSET & COPY GENERATION
    # -------------------------------------------------------------------------
    if not dispatch_only:
        print(f"\n📋 Selected Curriculum Topic: {recipe.get('topic')}")
        print(f"📌 Hook Headline: {recipe.get('hook_headline')}")

        image_urls = []
        reel_url = None

        if not skip_image:
            if slot == "afternoon":
                print("\n🎬 Slot is AFTERNOON: Generating 9:16 Vertical Video Reel...")
                reel_path = generate_video_reel(recipe, slot)
                reel_url = f"{RAW_GITHUB_BASE}/public/social/daily_{slot}_reel.mp4"
                print(f"🌐 Public Reel URL: {reel_url}")
                # Also generate frame fallback
                image_urls = [f"{RAW_GITHUB_BASE}/public/social/daily_{slot}_reel_frame.png"]
            else:
                print(f"\n🎨 Slot is {slot.upper()}: Generating 4-Slide Modern Minimal Carousel...")
                slides = generate_carousel_slides(recipe, slot)
                image_urls = [
                    f"{RAW_GITHUB_BASE}/public/social/daily_{slot}_slide_{i}.png"
                    for i in range(1, 5)
                ]
                print(f"🌐 Generated {len(image_urls)} Carousel Slide URLs:")
                for u in image_urls:
                    print(f"   • {u}")

        print("\n✍️ Generating Platform Copy (Instagram, Twitter, Facebook)...")
        copy_dict = generate_platform_copy(recipe, slot)

        payload = {
            "slot": slot,
            "topic": recipe.get("topic"),
            "image_urls": image_urls,
            "reel_url": reel_url if slot == "afternoon" else None,
            "copy": copy_dict,
            "generated_at": dt.datetime.now(dt.timezone.utc).isoformat(),
        }

        with open(pending_file, "w", encoding="utf-8") as f:
            json.dump(payload, f, indent=2)
        print(f"💾 Saved pending post metadata to {pending_file.name}")

        if generate_only:
            print("\n✅ Generation stage complete (--generate-only). Exiting before Buffer dispatch.")
            return

    # -------------------------------------------------------------------------
    # STAGE 2: BUFFER DISPATCH
    # -------------------------------------------------------------------------
    if pending_file.exists():
        try:
            with open(pending_file, "r", encoding="utf-8") as f:
                saved = json.load(f)
            image_urls = saved.get("image_urls", [])
            reel_url = saved.get("reel_url")
            copy_dict = saved.get("copy", {})
        except Exception as e:
            print(f"  ⚠️ Error loading {pending_file.name}: {e}")
            copy_dict = generate_platform_copy(recipe, slot)
    else:
        copy_dict = generate_platform_copy(recipe, slot)
        image_urls = [f"{RAW_GITHUB_BASE}/public/social/daily_{slot}_slide_{i}.png" for i in range(1, 5)]
        reel_url = f"{RAW_GITHUB_BASE}/public/social/daily_{slot}_reel.mp4" if slot == "afternoon" else None

    print("\n📡 Connecting to Buffer for Dispatch...")
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
            text = format_copy_to_string(copy_dict.get("twitter") or copy_dict.get("facebook", ""))
            if len(text) > 280:
                print(f"    ℹ️ Truncating Twitter text ({len(text)} chars) to fit 280-char limit.")
                text = text[:275].rstrip() + "..."
        elif "instagram" in service:
            text = format_copy_to_string(copy_dict.get("instagram") or copy_dict.get("facebook", ""))
        else:
            text = format_copy_to_string(copy_dict.get("facebook") or copy_dict.get("instagram", ""))

        dispatched = False
        # If afternoon slot and reel is present, dispatch video reel
        if slot == "afternoon" and reel_url:
            print(f"    🎬 Dispatching 9:16 Video Reel to {channel.get('name')}...")
            dispatched = buffer_client.dispatch(
                channel=channel,
                text=text,
                image_urls=[reel_url],
                force_publish=force_publish,
            )
            if not dispatched:
                print(f"    ⚠️ Reel video dispatch failed for {channel.get('name')}. Falling back to frame image...")

        if not dispatched and image_urls:
            buffer_client.dispatch(
                channel=channel,
                text=text,
                image_urls=image_urls,
                force_publish=force_publish,
            )

    print("\n" + "=" * 75)
    print("✅ Social Media Cycle Finished Successfully!")
    print("=" * 75)


def check_buffer_connection():
    print("=" * 75)
    print("🔍 Buffer API Diagnostic & Connectivity Check")
    print("=" * 75)
    if not BUFFER_ACCESS_TOKEN:
        print("❌ BUFFER_ACCESS_TOKEN is not set or empty in environment.")
        print("👉 Please add BUFFER_ACCESS_TOKEN in GitHub Repository Settings -> Secrets -> Actions.")
        return False

    masked = f"{BUFFER_ACCESS_TOKEN[:4]}...{BUFFER_ACCESS_TOKEN[-4:]}" if len(BUFFER_ACCESS_TOKEN) >= 10 else "***"
    print(f"🔑 Loaded Token: {masked} (length: {len(BUFFER_ACCESS_TOKEN)})")

    client = BufferClient(access_token=BUFFER_ACCESS_TOKEN, dry_run=False)
    channels = client.get_all_profiles()
    print("\n" + "=" * 75)
    if channels:
        print(f"🎉 SUCCESS: Found {len(channels)} connected channel(s):")
        for ch in channels:
            print(f"  • [{ch.get('service', '').upper()}] {ch.get('name')} (ID: {ch.get('id')})")
        print("=" * 75)
        return True
    else:
        print("⚠️ DIAGNOSIS SUMMARY:")
        print("1. If HTTP 401/403 appeared above: Your token is invalid, expired, or lacks permission.")
        print("2. If '0 connected social channels' appeared above: Your Buffer token is valid, but no channels are connected.")
        print("   👉 Go to https://publish.buffer.com, click 'Manage Channels', and connect your Twitter/X, Instagram, or Facebook account.")
        print("=" * 75)
        return False


def main():
    parser = argparse.ArgumentParser(description="Academic Wizard Autonomous Social Media & Reel Poster")
    parser.add_argument(
        "--slot",
        choices=["morning", "afternoon", "evening", "auto"],
        default="auto",
        help="Posting slot: morning (carousel), afternoon (9:16 reel), or evening (carousel). 'auto' detects from UTC hour.",
    )
    parser.add_argument("--dry-run", action="store_true", help="Simulate posting without calling Buffer API")
    parser.add_argument("--force-publish", action="store_true", help="Publish immediately rather than adding to queue")
    parser.add_argument("--topic-idx", type=int, default=None, help="Override recipe index (0-6)")
    parser.add_argument("--skip-image", action="store_true", help="Skip image generation for quick text tests")
    parser.add_argument("--check-buffer", action="store_true", help="Run Buffer diagnostic connection check and exit")
    parser.add_argument("--generate-only", action="store_true", help="Only generate visual and audio assets (stage 1)")
    parser.add_argument("--dispatch-only", action="store_true", help="Only dispatch pending assets to Buffer (stage 2)")

    args = parser.parse_args()

    if args.check_buffer:
        check_buffer_connection()
        return

    if args.slot == "auto":
        curr_utc_hour = dt.datetime.now(dt.timezone.utc).hour
        if 6 <= curr_utc_hour < 11:
            slot = "morning"
        elif 11 <= curr_utc_hour < 15:
            slot = "afternoon"
        else:
            slot = "evening"
    else:
        slot = args.slot

    run(
        slot=slot,
        dry_run=args.dry_run,
        force_publish=args.force_publish,
        topic_idx=args.topic_idx,
        skip_image=args.skip_image,
        generate_only=args.generate_only,
        dispatch_only=args.dispatch_only,
    )


if __name__ == "__main__":
    main()

