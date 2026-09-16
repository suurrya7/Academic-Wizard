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
# 14-Recipe High-Utility Academic Curriculum (7 Days x 2 Slots)
# ==============================================================================
ROTATION_MATRIX = {
    "morning": [
        # Monday (Day 0): In-Text Citations
        {
            "day": "Monday",
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
}


# ==============================================================================
# Pillow Typography & Multi-Slide Layout Engine
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


def create_base_canvas(slide_num: int, total_slides: int, badge_text: str) -> Tuple[Image.Image, ImageDraw.Draw]:
    """Create a 1080x1080 base canvas with luxury borders, badge, and slide counter."""
    width, height = 1080, 1080
    image = Image.new("RGBA", (width, height), (10, 17, 40, 255))
    draw = ImageDraw.Draw(image)

    # 1. Gradient Background (Rich Navy to Midnight Slate)
    for y in range(height):
        ratio = y / height
        r = int(10 + (16 - 10) * ratio)
        g = int(17 + (26 - 17) * ratio)
        b = int(40 + (62 - 40) * ratio)
        draw.line([(0, y), (width, y)], fill=(r, g, b, 255))

    # 2. Gold Luxury Double Border
    gold = (212, 175, 55, 255)
    light_gold = (245, 230, 170, 255)
    draw.rectangle([25, 25, width - 25, height - 25], outline=gold, width=3)
    draw.rectangle([33, 33, width - 33, height - 33], outline=light_gold, width=1)

    # 3. Top Category Badge (Pill button with vector gold diamonds)
    clean_badge = badge_text.replace("✦", "").replace("★", "").strip()
    font_badge = get_system_font(20, bold=True)
    bbox = draw.textbbox((0, 0), clean_badge, font=font_badge)
    badge_w = bbox[2] - bbox[0]
    badge_h = bbox[3] - bbox[1]

    pill_x1 = 55
    pill_y1 = 55
    pill_x2 = pill_x1 + badge_w + 70
    pill_y2 = pill_y1 + badge_h + 18
    draw.rounded_rectangle([pill_x1, pill_y1, pill_x2, pill_y2], radius=12, fill=(20, 35, 75, 230), outline=gold, width=2)

    # Vector gold diamonds on badge
    mid_y = pill_y1 + (pill_y2 - pill_y1) // 2
    d_size = 5
    draw.polygon([(pill_x1 + 18, mid_y - d_size), (pill_x1 + 18 + d_size, mid_y), (pill_x1 + 18, mid_y + d_size), (pill_x1 + 18 - d_size, mid_y)], fill=gold)
    draw.text((pill_x1 + 32, pill_y1 + 8), clean_badge, fill=light_gold, font=font_badge)

    # 4. Slide Pagination Indicator (Top Right)
    font_slide = get_system_font(20, bold=True)
    slide_text = f"SLIDE {slide_num} OF {total_slides}"
    tb_slide = draw.textbbox((0, 0), slide_text, font=font_slide)
    slide_w = tb_slide[2] - tb_slide[0]
    slide_x1 = width - slide_w - 75
    slide_y1 = 55
    draw.rounded_rectangle([slide_x1, slide_y1, width - 55, slide_y1 + badge_h + 18], radius=12, fill=(15, 25, 55, 200), outline=(60, 85, 140, 200), width=1)
    draw.text((slide_x1 + 10, slide_y1 + 8), slide_text, fill=(200, 215, 245, 255), font=font_slide)

    return image, draw


def draw_vector_checkmark(draw: ImageDraw.Draw, cx: int, cy: int, size: int = 8, color=(255, 255, 255, 255), width: int = 3):
    """Draw a clean, crisp vector checkmark."""
    draw.line([(cx - size, cy), (cx - size // 3, cy + size), (cx + size, cy - size)], fill=color, width=width)


def draw_vector_cross(draw: ImageDraw.Draw, cx: int, cy: int, size: int = 7, color=(255, 255, 255, 255), width: int = 3):
    """Draw a clean, crisp vector X / cross."""
    draw.line([(cx - size, cy - size), (cx + size, cy + size)], fill=color, width=width)
    draw.line([(cx - size, cy + size), (cx + size, cy - size)], fill=color, width=width)


def stamp_bottom_bar(image: Image.Image, draw: ImageDraw.Draw, slide_num: int, total_slides: int):
    """Draw the standardized bottom branding and navigation bar."""
    width, height = 1080, 1080
    bottom_y = height - 120
    draw.line([(50, bottom_y), (width - 50, bottom_y)], fill=(50, 75, 120, 180), width=1)

    # Logo
    logo_w = 0
    if LOGO_NAV_PATH.exists():
        try:
            with Image.open(LOGO_NAV_PATH) as logo_img:
                logo_resized = logo_img.convert("RGBA").resize((60, 60), Image.Resampling.LANCZOS)
                image.paste(logo_resized, (60, bottom_y + 16), logo_resized)
                logo_w = 75
        except Exception as e:
            print(f"  ⚠️ Logo overlay skipped: {e}")

    # Brand text
    font_brand = get_system_font(26, bold=True)
    draw.text((60 + logo_w, bottom_y + 30), "academicwizard.online", fill=(255, 255, 255, 255), font=font_brand)

    # Right action indicator
    if slide_num < total_slides:
        # Swipe Cue Button
        font_swipe = get_system_font(22, bold=True)
        swipe_text = f"SWIPE NEXT >>  [{slide_num}/{total_slides}]"
        tb_swipe = draw.textbbox((0, 0), swipe_text, font=font_swipe)
        sw_w = tb_swipe[2] - tb_swipe[0]
        sw_x1 = width - sw_w - 90
        sw_y1 = bottom_y + 18
        draw.rounded_rectangle([sw_x1, sw_y1, width - 55, sw_y1 + 50], radius=12, fill=(212, 175, 55, 230))
        draw.text((sw_x1 + 18, sw_y1 + 12), swipe_text, fill=(10, 15, 30, 255), font=font_swipe)
    else:
        # Final Slide: WhatsApp Green Button
        font_wa = get_system_font(22, bold=True)
        wa_text = f"WhatsApp: {WHATSAPP_DISPLAY}"
        tb_wa = draw.textbbox((0, 0), wa_text, font=font_wa)
        wa_w = tb_wa[2] - tb_wa[0]
        wa_x1 = width - wa_w - 90
        wa_y1 = bottom_y + 18
        draw.rounded_rectangle([wa_x1, wa_y1, width - 55, sw_y1 if 'sw_y1' in locals() else wa_y1 + 50], radius=12, fill=(37, 211, 102, 240))
        draw.text((wa_x1 + 18, wa_y1 + 12), wa_text, fill=(255, 255, 255, 255), font=font_wa)


def wrap_text(draw: ImageDraw.Draw, text: str, font: ImageFont.ImageFont, max_width: int) -> List[str]:
    """Word-wrap text to fit inside max_width."""
    words = text.split()
    lines = []
    curr = []
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


# ==============================================================================
# Slide 1: Cover / Hook Card
# ==============================================================================
def render_slide_1_cover(recipe: Dict[str, Any], output_path: Path) -> Path:
    """Generate Slide 1: High-impact editorial cover with hook problem card."""
    image, draw = create_base_canvas(1, 4, recipe["badge"])
    gold = (212, 175, 55, 255)

    # 1. Main Headline
    headline = recipe["hook_headline"]
    font_head = get_system_font(44, bold=True)
    head_lines = wrap_text(draw, headline, font_head, 950)

    y_head = 140
    for line in head_lines[:2]:
        tb = draw.textbbox((0, 0), line, font=font_head)
        lx = (1080 - (tb[2] - tb[0])) // 2
        draw.text((lx + 2, y_head + 2), line, fill=(0, 0, 0, 180), font=font_head)
        draw.text((lx, y_head), line, fill=(255, 255, 255, 255), font=font_head)
        y_head += 56

    # 2. Problem/Hook Container Box
    box_x1, box_y1 = 65, y_head + 30
    box_x2, box_y2 = 1080 - 65, 800
    draw.rounded_rectangle([box_x1, box_y1, box_x2, box_y2], radius=20, fill=(15, 25, 55, 235), outline=(60, 90, 150, 200), width=2)
    # Gold vertical accent ribbon
    draw.line([(box_x1 + 7, box_y1 + 12), (box_x1 + 7, box_y2 - 12)], fill=gold, width=4)

    # Subtitle / Pain Point
    font_sub = get_system_font(26, bold=False)
    sub_lines = wrap_text(draw, recipe["hook_sub"], font_sub, box_x2 - box_x1 - 80)
    y_sub = box_y1 + 40
    for s_line in sub_lines[:3]:
        draw.text((box_x1 + 40, y_sub), s_line, fill=(245, 230, 170, 255), font=font_sub)
        y_sub += 36

    # Divider line inside box
    draw.line([(box_x1 + 35, y_sub + 15), (box_x2 - 35, y_sub + 15)], fill=(50, 75, 120, 150), width=1)
    y_sub += 35

    # Bullet questions / Hook points
    font_b = get_system_font(25, bold=False)
    for b_item in recipe.get("hook_bullets", [])[:2]:
        # Vector Diamond
        d_cx = box_x1 + 50
        d_cy = y_sub + 14
        draw.polygon([(d_cx, d_cy - 6), (d_cx + 6, d_cy), (d_cx, d_cy + 6), (d_cx - 6, d_cy)], fill=gold)

        b_lines = wrap_text(draw, b_item, font_b, box_x2 - box_x1 - 100)
        draw.text((box_x1 + 70, y_sub), b_lines[0], fill=(230, 238, 250, 255), font=font_b)
        y_sub += 34
        for sub_l in b_lines[1:2]:
            draw.text((box_x1 + 70, y_sub), sub_l, fill=(230, 238, 250, 255), font=font_b)
            y_sub += 34
        y_sub += 15

    # Big Glowing Swipe Button
    btn_x1, btn_y1 = (1080 - 680) // 2, 830
    btn_x2, btn_y2 = btn_x1 + 680, btn_y1 + 75
    draw.rounded_rectangle([btn_x1, btn_y1, btn_x2, btn_y2], radius=20, fill=(20, 40, 85, 240), outline=gold, width=2)
    font_cta = get_system_font(24, bold=True)
    btn_text = "SWIPE TO UNLOCK THE 1ST CLASS FORMULA  >>"
    tb_btn = draw.textbbox((0, 0), btn_text, font=font_cta)
    btn_w = tb_btn[2] - tb_btn[0]
    draw.text((btn_x1 + (680 - btn_w) // 2, btn_y1 + 22), btn_text, fill=(255, 235, 150, 255), font=font_cta)

    stamp_bottom_bar(image, draw, 1, 4)
    image.convert("RGB").save(output_path, "PNG", quality=95)
    return output_path


# ==============================================================================
# Slide 2: The Core Comparison (❌ 2:2 Trap vs. ✅ 1st Class Blueprint)
# ==============================================================================
def render_slide_2_comparison(recipe: Dict[str, Any], output_path: Path) -> Path:
    """Generate Slide 2: Side-by-side / stacked visual contrast cards."""
    image, draw = create_base_canvas(2, 4, recipe["badge"])
    cmp_data = recipe["comparison"]

    # Headline
    font_head = get_system_font(40, bold=True)
    head_text = "The Core Difference in Marking Criteria"
    tb = draw.textbbox((0, 0), head_text, font=font_head)
    lx = (1080 - (tb[2] - tb[0])) // 2
    draw.text((lx, 140), head_text, fill=(255, 255, 255, 255), font=font_head)

    # Sub-caption
    font_sub = get_system_font(24, bold=False)
    sub_text = "Why uncritical descriptive writing caps at 58% while critical evaluation scores 70%+"
    tb_s = draw.textbbox((0, 0), sub_text, font=font_sub)
    lx_s = (1080 - (tb_s[2] - tb_s[0])) // 2
    draw.text((lx_s, 195), sub_text, fill=(200, 215, 240, 255), font=font_sub)

    # --- CARD 1: THE COMMON 2:2 TRAP (Crimson Tint) ---
    c1_x1, c1_y1 = 65, 260
    c1_x2, c1_y2 = 1080 - 65, 530
    draw.rounded_rectangle([c1_x1, c1_y1, c1_x2, c1_y2], radius=16, fill=(45, 20, 28, 235), outline=(220, 53, 69, 200), width=2)
    # Header banner
    draw.rounded_rectangle([c1_x1, c1_y1, c1_x2, c1_y1 + 60], radius=16, fill=(80, 25, 38, 255))
    draw_vector_cross(draw, c1_x1 + 40, c1_y1 + 30, size=8, color=(255, 120, 130, 255), width=3)
    font_card_head = get_system_font(24, bold=True)
    draw.text((c1_x1 + 60, c1_y1 + 16), cmp_data["trap_title"], fill=(255, 180, 190, 255), font=font_card_head)

    font_body = get_system_font(25, bold=False)
    trap_lines = wrap_text(draw, cmp_data["trap_text"], font_body, c1_x2 - c1_x1 - 60)
    y_body = c1_y1 + 80
    for line in trap_lines[:4]:
        draw.text((c1_x1 + 30, y_body), line, fill=(245, 225, 230, 255), font=font_body)
        y_body += 38

    # --- CARD 2: THE 1ST CLASS BLUEPRINT (Emerald / Gold Tint) ---
    c2_x1, c2_y1 = 65, 570
    c2_x2, c2_y2 = 1080 - 65, 870
    draw.rounded_rectangle([c2_x1, c2_y1, c2_x2, c2_y2], radius=16, fill=(15, 42, 38, 235), outline=(42, 157, 143, 220), width=2)
    # Header banner
    draw.rounded_rectangle([c2_x1, c2_y1, c2_x2, c2_y1 + 60], radius=16, fill=(20, 65, 58, 255))
    draw_vector_checkmark(draw, c2_x1 + 40, c2_y1 + 28, size=8, color=(140, 255, 200, 255), width=3)
    draw.text((c2_x1 + 60, c2_y1 + 16), cmp_data["fix_title"], fill=(180, 250, 220, 255), font=font_card_head)

    fix_lines = wrap_text(draw, cmp_data["fix_text"], font_body, c2_x2 - c2_x1 - 60)
    y_body2 = c2_y1 + 80
    for line in fix_lines[:5]:
        draw.text((c2_x1 + 30, y_body2), line, fill=(225, 248, 240, 255), font=font_body)
        y_body2 += 38

    stamp_bottom_bar(image, draw, 2, 4)
    image.convert("RGB").save(output_path, "PNG", quality=95)
    return output_path


# ==============================================================================
# Slide 3: The Exact Step-by-Step Formula & Real Academic Example
# ==============================================================================
def render_slide_3_formula(recipe: Dict[str, Any], output_path: Path) -> Path:
    """Generate Slide 3: Sequential step cards (01, 02, 03) and academic exemplar box."""
    image, draw = create_base_canvas(3, 4, recipe["badge"])
    gold = (212, 175, 55, 255)
    formula_data = recipe["formula"]

    # Headline
    font_head = get_system_font(40, bold=True)
    head_text = formula_data["title"]
    head_lines = wrap_text(draw, head_text, font_head, 950)
    y_head = 140
    for h_l in head_lines[:1]:
        tb = draw.textbbox((0, 0), h_l, font=font_head)
        lx = (1080 - (tb[2] - tb[0])) // 2
        draw.text((lx, y_head), h_l, fill=(255, 255, 255, 255), font=font_head)
        y_head += 50

    # 3 Sequential Step Cards
    y_step = 215
    font_num = get_system_font(26, bold=True)
    font_lbl = get_system_font(26, bold=True)
    font_desc = get_system_font(24, bold=False)

    for step in formula_data["steps"][:3]:
        s_x1, s_y1 = 65, y_step
        s_x2, s_y2 = 1080 - 65, y_step + 125
        draw.rounded_rectangle([s_x1, s_y1, s_x2, s_y2], radius=15, fill=(15, 26, 56, 230), outline=(55, 80, 140, 200), width=2)

        # Number Badge (Gold circle/pill)
        draw.rounded_rectangle([s_x1 + 20, s_y1 + 25, s_x1 + 85, s_y1 + 100], radius=12, fill=(212, 175, 55, 240))
        draw.text((s_x1 + 32, s_y1 + 45), step["num"], fill=(10, 15, 30, 255), font=font_num)

        # Label
        draw.text((s_x1 + 110, s_y1 + 25), step["label"], fill=(245, 230, 170, 255), font=font_lbl)

        # Description wrapped
        desc_lines = wrap_text(draw, step["desc"], font_desc, s_x2 - s_x1 - 140)
        draw.text((s_x1 + 110, s_y1 + 65), desc_lines[0], fill=(230, 238, 250, 255), font=font_desc)
        if len(desc_lines) > 1:
            draw.text((s_x1 + 110, s_y1 + 95), desc_lines[1], fill=(230, 238, 250, 255), font=font_desc)

        y_step += 140

    # Exemplar Quote Box
    ex_x1, ex_y1 = 65, 680
    ex_x2, ex_y2 = 1080 - 65, 875
    draw.rounded_rectangle([ex_x1, ex_y1, ex_x2, ex_y2], radius=15, fill=(25, 35, 65, 240), outline=gold, width=2)

    # Exemplar header with vector gold diamonds
    font_ex_head = get_system_font(21, bold=True)
    ex_lbl = "ACADEMIC EXEMPLAR APPLIED"
    tb_ex = draw.textbbox((0, 0), ex_lbl, font=font_ex_head)
    lbl_w = tb_ex[2] - tb_ex[0]
    mid_ex_x = (1080 - lbl_w) // 2
    draw.polygon([(mid_ex_x - 20, ex_y1 + 28 - 5), (mid_ex_x - 15, ex_y1 + 28), (mid_ex_x - 20, ex_y1 + 28 + 5), (mid_ex_x - 25, ex_y1 + 28)], fill=gold)
    draw.text((mid_ex_x, ex_y1 + 18), ex_lbl, fill=(212, 175, 55, 255), font=font_ex_head)
    draw.polygon([(mid_ex_x + lbl_w + 20, ex_y1 + 28 - 5), (mid_ex_x + lbl_w + 25, ex_y1 + 28), (mid_ex_x + lbl_w + 20, ex_y1 + 28 + 5), (mid_ex_x + lbl_w + 15, ex_y1 + 28)], fill=gold)

    font_ex = get_system_font(24, bold=False)
    ex_lines = wrap_text(draw, formula_data["exemplar"], font_ex, ex_x2 - ex_x1 - 60)
    y_ex = ex_y1 + 60
    for ex_l in ex_lines[:4]:
        draw.text((ex_x1 + 30, y_ex), ex_l, fill=(245, 248, 255, 255), font=font_ex)
        y_ex += 35

    stamp_bottom_bar(image, draw, 3, 4)
    image.convert("RGB").save(output_path, "PNG", quality=95)
    return output_path


# ==============================================================================
# Slide 4: Rubric Pre-Submission Checklist & Dual CTA
# ==============================================================================
def render_slide_4_checklist_cta(recipe: Dict[str, Any], output_path: Path) -> Path:
    """Generate Slide 4: 4-item rubric checklist and dual Tool/WhatsApp CTA."""
    image, draw = create_base_canvas(4, 4, recipe["badge"])
    gold = (212, 175, 55, 255)

    # Headline
    font_head = get_system_font(40, bold=True)
    head_text = "Pre-Submission Rubric Checklist"
    tb = draw.textbbox((0, 0), head_text, font=font_head)
    lx = (1080 - (tb[2] - tb[0])) // 2
    draw.text((lx, 140), head_text, fill=(255, 255, 255, 255), font=font_head)

    # Checklist Container Box
    chk_x1, chk_y1 = 65, 210
    chk_x2, chk_y2 = 1080 - 65, 620
    draw.rounded_rectangle([chk_x1, chk_y1, chk_x2, chk_y2], radius=18, fill=(15, 26, 56, 235), outline=(55, 80, 140, 200), width=2)
    draw.line([(chk_x1 + 7, chk_y1 + 12), (chk_x1 + 7, chk_y2 - 12)], fill=gold, width=4)

    font_chk = get_system_font(24, bold=False)
    y_chk = chk_y1 + 30

    for item in recipe.get("checklist", [])[:4]:
        # Clean green checkbox with vector white checkmark
        box_cx = chk_x1 + 52
        box_cy = y_chk + 18
        draw.rounded_rectangle([chk_x1 + 35, y_chk + 2, chk_x1 + 70, y_chk + 37], radius=8, fill=(37, 211, 102, 230))
        draw_vector_checkmark(draw, box_cx, box_cy, size=6, color=(10, 25, 15, 255), width=3)

        lines = wrap_text(draw, item, font_chk, chk_x2 - chk_x1 - 120)
        draw.text((chk_x1 + 85, y_chk + 5), lines[0], fill=(240, 245, 255, 255), font=font_chk)
        y_chk += 36
        for sub_l in lines[1:2]:
            draw.text((chk_x1 + 85, y_chk + 5), sub_l, fill=(240, 245, 255, 255), font=font_chk)
            y_chk += 36
        y_chk += 22

    # --- DUAL CALL TO ACTION CONTAINERS ---
    # Box A: Free Tools
    cta1_x1, cta1_y1 = 65, 650
    cta1_x2, cta1_y2 = 1080 - 65, 755
    draw.rounded_rectangle([cta1_x1, cta1_y1, cta1_x2, cta1_y2], radius=15, fill=(20, 38, 75, 240), outline=(70, 105, 170, 200), width=2)
    font_cta_lbl = get_system_font(21, bold=True)
    draw.text((cta1_x1 + 25, cta1_y1 + 18), "[100% FREE TOOLS]  CITATION GENERATORS & ESSAY CALCULATORS", fill=(212, 175, 55, 255), font=font_cta_lbl)
    font_cta_url = get_system_font(24, bold=True)
    target_url = recipe.get('tool_url') or recipe.get('service_url') or f"{SITE_URL}/tools/"
    draw.text((cta1_x1 + 25, cta1_y1 + 55), f"Visit: {target_url}", fill=(255, 255, 255, 255), font=font_cta_url)

    # Box B: WhatsApp Urgent Triage
    cta2_x1, cta2_y1 = 65, 775
    cta2_x2, cta2_y2 = 1080 - 65, 880
    draw.rounded_rectangle([cta2_x1, cta2_y1, cta2_x2, cta2_y2], radius=15, fill=(18, 48, 38, 240), outline=(37, 211, 102, 220), width=2)
    draw.text((cta2_x1 + 25, cta2_y1 + 18), "[URGENT DEADLINE?]  12-HOUR ASSIGNMENT RESCUE & TURNITIN SCAN", fill=(180, 250, 220, 255), font=font_cta_lbl)
    draw.text((cta2_x1 + 25, cta2_y1 + 55), f"WhatsApp 24/7: {WHATSAPP_DISPLAY}", fill=(255, 255, 255, 255), font=font_cta_url)

    stamp_bottom_bar(image, draw, 4, 4)
    image.convert("RGB").save(output_path, "PNG", quality=95)
    return output_path


def generate_carousel_slides(recipe: Dict[str, Any], slot: str) -> List[Path]:
    """Generate the full 4-slide editorial infographic carousel."""
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
        # Duplicate to archive
        with open(daily_path, "rb") as f_in, open(archive_path, "wb") as f_out:
            f_out.write(f_in.read())

        slides.append(daily_path)
        print(f"  ✅ Slide {s_num}/4 synthesized: {daily_path.name}")

    return slides


# ==============================================================================
# Platform-Specific Copy Generator (Gemini Pro + Fallback)
# ==============================================================================
def generate_platform_copy(recipe: Dict[str, Any], slot: str) -> Dict[str, str]:
    """Synthesize 3 platform-tailored copy variations with slide cues and hashtags."""
    wa_msg = recipe.get("whatsapp_msg") or f"Hi Academic Wizard, I need help with {recipe.get('topic', 'my academic coursework')}."
    wa_url = generate_whatsapp_link(wa_msg)
    tool_url = recipe.get("tool_url") or recipe.get("service_url") or f"{SITE_URL}/tools/"

    # Pre-crafted high-converting fallback
    fallback_copy = {
        "instagram": (
            f"📌 {recipe['hook_headline']}\n\n"
            f"Up to 15% of university marks are lost not on knowledge, but on uncritical writing, bad citation syntax, and avoidable rubric errors.\n\n"
            f"👉 SWIPE THROUGH THE 4 SLIDES:\n"
            f"• Slide 1: The #1 grading trap causing 2:2 marks\n"
            f"• Slide 2: ❌ The 2:2 Trap vs ✅ The 1st Class Blueprint\n"
            f"• Slide 3: The exact step-by-step formula & exemplar\n"
            f"• Slide 4: Pre-submission rubric inspection checklist\n\n"
            f"🛠 Use our 100% Free Tools & Citation Generators: {tool_url}\n"
            f"💬 Need 1:1 human expert assignment triage? WhatsApp {WHATSAPP_DISPLAY} (Link in bio)\n\n"
            f"📌 Bookmark and save this post for your next assignment deadline!\n\n"
            f"#academicwizard #universitylife #assignmenthelp #studygram #collegelife "
            f"#studentlife #dissertationtips #academicwriting #essayhelp #ukuniversities "
            f"#nursingstudent #lawstudent #mbastudent #firstclassdegree #academicweapon "
            f"#studycommunity #graduateschool #collegetips"
        ),
        "twitter": (
            f"🎯 {recipe['hook_headline']}\n\n"
            f"Why uncritical writing caps at 58% (2:2) while critical synthesis hits 70%+ (First Class).\n\n"
            f"Swipe through the 4-slide blueprint attached 👇\n\n"
            f"🛠 100% Free Academic Tools: {tool_url}\n"
            f"🚨 12h Urgent Help WhatsApp: {WHATSAPP_DISPLAY}\n"
            f"#AssignmentHelp #AcademicWeapon #StudyTips"
        ),
        "facebook": (
            f"🎓 {recipe['hook_headline']}\n\n"
            f"Whether you are writing an undergraduate coursework essay, case study, or master's dissertation, tutors mark against strict analytical criteria:\n\n"
            f"❌ The Common Mistake:\n{recipe['comparison']['trap_text']}\n\n"
            f"✅ The First-Class Blueprint:\n{recipe['comparison']['fix_text']}\n\n"
            f"📋 Pre-Submission Checklist:\n"
            + "\n".join(f"✔ {chk}" for chk in recipe.get("checklist", []))
            + f"\n\n🛠 Access our free academic tools, citation makers, and grade calculators:\n{tool_url}\n\n"
            f"🚨 Under a tight deadline? Our qualified academic team provides 12-hour urgent assignment support with Turnitin similarity reports included.\n"
            f"💬 Connect directly with our coordinators on WhatsApp: {wa_url}\n\n"
            f"Save this guide and share it with your study group!"
        ),
    }

    if not GEMINI_API_KEY:
        return fallback_copy

    system_prompt = (
        "You are an elite academic social media marketing copywriter for Academic Wizard (academicwizard.online). "
        "Your audience consists of international university students in the UK, USA, Australia, Canada, and Singapore. "
        "Your tone is empowering, authoritative, practical, and highly engaging (dark-academia student vibe).\n\n"
        "Generate 3 distinct copy variations in strict JSON format:\n"
        "1. 'instagram': High-engagement carousel post. Engaging opening hook line, outline of what is inside Slides 1 to 4, "
        "clear call-to-action mentioning free tools and WhatsApp consultation, and exactly 18 targeted hashtags.\n"
        "2. 'twitter': Punchy thread-starter post under 270 characters including tool URL and 2-3 hashtags.\n"
        "3. 'facebook': Community post format with story/context, formatted takeaways matching the slides, clear links to tools and WhatsApp.\n\n"
        "Output ONLY valid JSON."
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
            "generationConfig": {"temperature": 0.7, "maxOutputTokens": 1200},
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

        input_payload: Dict[str, Any] = {
            "channelId": channel_id,
            "text": text,
            "schedulingType": "automatic",
            "mode": initial_mode,
        }

        if image_urls:
            # Respect platform limits: Twitter max 4 images
            limit = 4 if ("twitter" in service or "x" in service) else len(image_urls)
            input_payload["assets"] = [{"image": {"url": u}} for u in image_urls[:limit]]

        # Buffer GraphQL strictly requires channel-specific metadata for Facebook and Instagram
        if "facebook" in service:
            input_payload["metadata"] = {
                "facebook": {
                    "type": "post",
                }
            }
        elif "instagram" in service:
            input_payload["metadata"] = {
                "instagram": {
                    "type": "post",
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


def run(slot: str, dry_run: bool, force_publish: bool, topic_idx: Optional[int], skip_image: bool):
    print("=" * 75)
    print(f"🚀 Academic Wizard Multi-Slide Carousel & Social Engine")
    print(f"📅 Slot: {slot.upper()} | UTC Time: {dt.datetime.now(dt.timezone.utc).strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"⚙️  Dry Run: {dry_run} | Force Publish: {force_publish}")
    print("=" * 75)

    recipe = pick_daily_recipe(slot, topic_idx)
    print(f"\n📋 Selected Topic: {recipe['topic']}")
    print(f"📌 Hook Headline: {recipe['hook_headline']}")

    # 1. Generate 4-Slide Infographic Carousel
    image_urls = []
    if not skip_image:
        print("\n🎨 Generating 4-Slide Editorial Infographic Carousel...")
        slides = generate_carousel_slides(recipe, slot)
        image_urls = [
            f"{RAW_GITHUB_BASE}/public/social/daily_{slot}_slide_{i}.png"
            for i in range(1, 5)
        ]
        print(f"\n🌐 Public URLs for Buffer ({len(image_urls)} assets):")
        for u in image_urls:
            print(f"   • {u}")

    # 2. Generate Platform-Specific Copy
    print("\n✍️ Generating Platform Copy (Instagram, Twitter, Facebook)...")
    copy_dict = generate_platform_copy(recipe, slot)

    # 3. Dispatch to Buffer
    print("\n📡 Connecting to Buffer...")
    buffer_client = BufferClient(access_token=BUFFER_ACCESS_TOKEN, dry_run=dry_run)
    channels = buffer_client.get_all_profiles()

    if not channels:
        print("  ⚠️ No Buffer channels found. Please ensure BUFFER_ACCESS_TOKEN is configured in GitHub Secrets.")
        return

    print(f"  Found {len(channels)} connected channel(s): {[c.get('service') for c in channels]}")

    for channel in channels:
        service = channel.get("service", "").lower()
        print(f"\n  📤 Dispatching carousel to channel: {channel.get('name')} ({service})...")

        if "twitter" in service or "x" in service:
            text = copy_dict.get("twitter", copy_dict.get("facebook"))
            if len(text) > 280:
                print(f"    ℹ️ Truncating Twitter text ({len(text)} chars) to stay safely within 280-char limit.")
                text = text[:275].rstrip() + "..."
        elif "instagram" in service:
            text = copy_dict.get("instagram", copy_dict.get("facebook"))
        else:
            text = copy_dict.get("facebook", copy_dict.get("instagram"))

        buffer_client.dispatch(
            channel=channel,
            text=text,
            image_urls=image_urls,
            force_publish=force_publish,
        )

    print("\n" + "=" * 75)
    print("✅ Multi-Slide Carousel Social Cycle Finished Successfully!")
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
    parser.add_argument("--check-buffer", action="store_true", help="Run Buffer diagnostic connection check and exit")

    args = parser.parse_args()

    if args.check_buffer:
        check_buffer_connection()
        return

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

