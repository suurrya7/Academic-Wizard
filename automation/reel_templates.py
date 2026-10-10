import os
import random
from pathlib import Path
from typing import Dict, Any, Optional
from PIL import Image, ImageDraw, ImageFilter

try:
    from automation.infographic_engine import (
        get_font, draw_branding_header, draw_whatsapp_badge,
        draw_vector_check, draw_vector_cross, draw_vector_star, load_student,
        COLOR_NAVY, COLOR_GOLD, COLOR_WHITE, COLOR_EMERALD, COLOR_GRAY_TEXT
    )
except ImportError:
    from infographic_engine import (
        get_font, draw_branding_header, draw_whatsapp_badge,
        draw_vector_check, draw_vector_cross, draw_vector_star, load_student,
        COLOR_NAVY, COLOR_GOLD, COLOR_WHITE, COLOR_EMERALD, COLOR_GRAY_TEXT
    )

SCRIPT_DIR = Path(__file__).resolve().parent

# Color Palettes
COLOR_DARK_BG = "#0B0F19"
COLOR_SLATE_BG = "#1E293B"
COLOR_CREAM = "#FAF8F5"
COLOR_CORAL = "#EF4444"
COLOR_AMBER = "#F59E0B"
COLOR_CYAN = "#0EA5E9"

def wrap_text(draw, text, font, max_width):
    words = text.split()
    lines = []
    curr = []
    for w in words:
        test = " ".join(curr + [w])
        bbox = draw.textbbox((0, 0), test, font=font)
        if bbox[2] - bbox[0] <= max_width:
            curr.append(w)
        else:
            if curr:
                lines.append(" ".join(curr))
            curr = [w]
    if curr:
        lines.append(" ".join(curr))
    return lines

# ==============================================================================
# REEL TEMPLATE 01: macOS Word Document Live Audit (Current Viral Classic)
# ==============================================================================
def render_reel_template_01(recipe: Dict[str, Any], student_id: Optional[int] = None, output_path: str = "reel_01.png") -> str:
    try:
        from automation.social_poster import render_reel_frame
    except ImportError:
        from social_poster import render_reel_frame
    render_reel_frame(recipe, Path(output_path))
    return output_path

# ==============================================================================
# REEL TEMPLATE 02: Cinematic Dark Obsidian POV Studio
# ==============================================================================
def render_reel_template_02(recipe: Dict[str, Any], student_id: Optional[int] = None, output_path: str = "reel_02.png") -> str:
    W, H = 1080, 1920
    img = Image.new("RGB", (W, H), color=COLOR_DARK_BG)
    draw = ImageDraw.Draw(img)
    
    # Ambient top glow
    draw.ellipse([100, -100, 980, 400], fill="#1E1B4B")
    
    # 1. Branding Header
    draw_branding_header(img, draw, x=60, y=70, light_mode=False)
    
    # Top Distinction Pill
    draw.rounded_rectangle([W - 270, 75, W - 60, 125], radius=16, fill="#065F46", outline="#10B981", width=2)
    draw.text((W - 245, 87), "DISTINCTION HACK", fill="#34D399", font=get_font('helvetica', 18, bold=True))
    
    # 2. iOS Push Notification Banner (The Hook)
    ny = 160
    draw.rounded_rectangle([50, ny, W - 50, ny + 170], radius=24, fill="#1E293B", outline="#334155", width=2)
    draw.ellipse([80, ny + 25, 115, ny + 60], fill=COLOR_GOLD)
    draw.text((130, ny + 25), "CANVAS • GRADE ALERT", fill="#94A3B8", font=get_font('helvetica', 18, bold=True))
    draw.text((W - 130, ny + 25), "now", fill="#64748B", font=get_font('helvetica', 16))
    
    headline = recipe.get("hook_headline", "Supervisor Wrote 'Lacks Critical Voice'")
    hook_lines = wrap_text(draw, f'"{headline}"', get_font('impact', 38), W - 140)
    for idx, hl in enumerate(hook_lines[:2]):
        draw.text((80, ny + 70 + idx * 46), hl, fill=COLOR_WHITE, font=get_font('impact', 38))
        
    # 3. The 54% Trap Card
    ty = ny + 205
    draw.rounded_rectangle([50, ty, W - 50, ty + 240], radius=20, fill="#2A1215", outline="#7F1D1D", width=2)
    draw_vector_cross(draw, 85, ty + 35, size=20, color="#EF4444", width=4)
    draw.text((115, ty + 22), "THE COMMON 54% 2:2 MISTAKE", fill="#F87171", font=get_font('helvetica', 24, bold=True))
    
    trap_text = recipe.get("comparison", {}).get("trap_text", "Merely summarizing literature without comparing methodologies.")
    trap_lines = wrap_text(draw, trap_text, get_font('helvetica', 22), W - 150)
    for idx, tl in enumerate(trap_lines[:4]):
        draw.text((85, ty + 75 + idx * 36), tl, fill="#FECACA", font=get_font('helvetica', 22))
        
    # 4. The 78%+ First-Class Blueprint Card
    fy = ty + 270
    draw.rounded_rectangle([50, fy, W - 50, fy + 480], radius=24, fill="#064E3B", outline="#10B981", width=3)
    draw_vector_check(draw, 85, fy + 40, size=24, color="#34D399", width=4)
    draw.text((120, fy + 26), "THE 78%+ FIRST-CLASS PROTOCOL", fill="#34D399", font=get_font('helvetica', 26, bold=True))
    draw.line([85, fy + 75, W - 85, fy + 75], fill="#047857", width=2)
    
    # 3-Step Formula
    formula = recipe.get("formula", {})
    steps = formula.get("steps", [
        {"label": "Direct Quotes", "desc": "Author (Year, p. 45) with verbatim quotes"},
        {"label": "Paraphrase", "desc": "(Author, Year) without forced page pinpoints"},
        {"label": "3+ Authors", "desc": "Use (FirstAuthor et al., Year) immediately"}
    ])
    
    sy = fy + 100
    for idx, stp in enumerate(steps[:3], 1):
        draw.ellipse([85, sy + 5, 125, sy + 45], fill=COLOR_GOLD)
        draw.text((95, sy + 12), f"0{idx}", fill=COLOR_NAVY, font=get_font('helvetica', 20, bold=True))
        lbl = stp.get("label", f"Rule {idx}")
        desc = stp.get("desc", "")
        draw.text((145, sy), lbl, fill=COLOR_WHITE, font=get_font('helvetica', 24, bold=True))
        desc_lines = wrap_text(draw, desc, get_font('helvetica', 19), W - 230)
        if desc_lines:
            draw.text((145, sy + 32), desc_lines[0], fill="#A7F3D0", font=get_font('helvetica', 19))
        sy += 115
        
    # Student cutout in bottom corner
    student_res = load_student(student_id, target_height=650)
    if student_res:
        student, s_name = student_res
        img.paste(student, (W - student.width + 30, H - 650), student)
        
    # 5. Bottom WhatsApp Conversion Pill
    wy = H - 250
    draw.rounded_rectangle([50, wy, 600, wy + 160], radius=24, fill=COLOR_GOLD)
    draw.text((75, wy + 20), "NEED 1-ON-1 POSTGRADUATE HELP?", fill=COLOR_NAVY, font=get_font('impact', 28))
    draw.text((75, wy + 62), "Fast 24-Hour Turnaround On WhatsApp", fill=COLOR_NAVY, font=get_font('helvetica', 20, bold=True))
    draw.ellipse([75, wy + 105, 105, wy + 135], fill=COLOR_EMERALD)
    draw.text((115, wy + 102), "+91 95098 93638 (Online 24/7)", fill=COLOR_NAVY, font=get_font('helvetica', 22, bold=True))
    
    img.save(output_path, quality=95)
    return output_path

# ==============================================================================
# REEL TEMPLATE 03: The Turnitin Radar & Scanner Audit
# ==============================================================================
def render_reel_template_03(recipe: Dict[str, Any], student_id: Optional[int] = None, output_path: str = "reel_03.png") -> str:
    W, H = 1080, 1920
    img = Image.new("RGB", (W, H), color="#090D16")
    draw = ImageDraw.Draw(img)
    
    draw_branding_header(img, draw, x=60, y=70, light_mode=False)
    
    # Header Title
    draw.text((60, 170), "ACADEMIC INTEGRITY AUDIT", fill="#38BDF8", font=get_font('helvetica', 22, bold=True))
    draw.text((60, 215), "WILL YOUR PAPER PASS TURNITIN?", fill=COLOR_WHITE, font=get_font('impact', 52))
    
    # Split Radar Scanner Card
    sy = 320
    # Left Box: AI Flagged
    draw.rounded_rectangle([50, sy, 520, sy + 380], radius=20, fill="#1F1315", outline="#DC2626", width=3)
    draw.rounded_rectangle([80, sy + 25, 260, sy + 65], radius=10, fill="#7F1D1D")
    draw.text((95, sy + 32), "FLAGGED DRAFT", fill="#FCA5A5", font=get_font('helvetica', 18, bold=True))
    draw.text((80, sy + 85), "42% AI / SIMILARITY", fill="#EF4444", font=get_font('impact', 44))
    
    bad_reasons = [
        "Repetitive generative tone",
        "Hallucinated citations",
        "Descriptive fluff sentences",
        "Risk of academic penalty"
    ]
    ry = sy + 160
    for br in bad_reasons:
        draw_vector_cross(draw, 95, ry + 10, size=14, color="#EF4444", width=3)
        draw.text((120, ry), br, fill="#FCA5A5", font=get_font('helvetica', 20))
        ry += 48
        
    # Right Box: Academic Wizard Verified
    draw.rounded_rectangle([560, sy, 1030, sy + 380], radius=20, fill="#0A2218", outline="#10B981", width=3)
    draw.rounded_rectangle([590, sy + 25, 800, sy + 65], radius=10, fill="#065F46")
    draw.text((605, sy + 32), "WIZARD VERIFIED", fill="#6EE7B7", font=get_font('helvetica', 18, bold=True))
    draw.text((590, sy + 85), "0% AI • 100% HUMAN", fill="#10B981", font=get_font('impact', 44))
    
    good_reasons = [
        "Primary peer-reviewed research",
        "Exact OSCOLA/APA footnotes",
        "Critical synthesis register",
        "Official report included"
    ]
    ry = sy + 160
    for gr in good_reasons:
        draw_vector_check(draw, 605, ry + 10, size=14, color="#10B981", width=3)
        draw.text((630, ry), gr, fill="#A7F3D0", font=get_font('helvetica', 20))
        ry += 48

    # Scanner Beam Graphic in center
    draw.line([50, sy + 430, W - 50, sy + 430], fill="#38BDF8", width=4)
    draw.text((60, sy + 450), "SCANNER PROTOCOL: NON-REPOSITORY VERIFICATION", fill="#38BDF8", font=get_font('helvetica', 18, bold=True))
    
    # 5-Step Integrity Checklist Card
    cy = sy + 510
    draw.rounded_rectangle([50, cy, W - 50, cy + 480], radius=24, fill="#111827", outline="#1E293B", width=2)
    draw.text((80, cy + 30), "PRE-SUBMISSION VERIFICATION CHECKLIST:", fill=COLOR_WHITE, font=get_font('helvetica', 24, bold=True))
    
    checks = [
        "Scanned via institutional non-repository Turnitin",
        "Zero AI probability score flagged across all chapters",
        "All secondary quotes traced back to primary publications",
        "Bibliography cross-referenced with exact in-text pinpoints"
    ]
    chy = cy + 95
    for chk in checks:
        draw.ellipse([80, chy + 2, 110, chy + 32], fill="#047857")
        draw_vector_check(draw, 95, chy + 17, size=14, color=COLOR_WHITE, width=2)
        draw.text((125, chy + 4), chk, fill="#E2E8F0", font=get_font('helvetica', 21))
        chy += 85
        
    # Student Model in lower section
    student_res = load_student(student_id, target_height=520)
    if student_res:
        student, s_name = student_res
        img.paste(student, (W - student.width, H - 520), student)
        
    # Bottom WhatsApp Button
    wy = H - 240
    draw.rounded_rectangle([50, wy, 600, wy + 150], radius=20, fill="#10B981")
    draw.text((80, wy + 25), "GET YOUR TURNITIN AUDIT NOW", fill=COLOR_NAVY, font=get_font('impact', 28))
    draw.text((80, wy + 72), "WhatsApp: +91 95098 93638 (24/7 Desk)", fill=COLOR_NAVY, font=get_font('helvetica', 22, bold=True))
    
    img.save(output_path, quality=95)
    return output_path

# ==============================================================================
# REEL TEMPLATE 04: Split-Screen Student Reaction & Solution Cards
# ==============================================================================
def render_reel_template_04(recipe: Dict[str, Any], student_id: Optional[int] = None, output_path: str = "reel_04.png") -> str:
    W, H = 1080, 1920
    img = Image.new("RGB", (W, H), color=COLOR_CREAM)
    draw = ImageDraw.Draw(img)
    
    draw_branding_header(img, draw, x=60, y=70, light_mode=True)
    
    # Top Quote Speech Bubble (Student Dilemma)
    qy = 170
    draw.rounded_rectangle([50, qy, W - 50, qy + 190], radius=24, fill=COLOR_NAVY)
    draw.text((80, qy + 25), "POV: YOUR PROFESSOR'S FEEDBACK SAYS:", fill=COLOR_GOLD, font=get_font('helvetica', 20, bold=True))
    
    headline = recipe.get("hook_headline", "Where is your critical analysis? Descriptive work caps at 54%")
    q_lines = wrap_text(draw, f'"{headline}"', get_font('impact', 36), W - 140)
    for idx, ql in enumerate(q_lines[:2]):
        draw.text((80, qy + 70 + idx * 45), ql, fill=COLOR_WHITE, font=get_font('impact', 36))
        
    # Top Half: Student Cutout Model Centered
    student_res = load_student(student_id, target_height=650)
    if student_res:
        student, s_name = student_res
        img.paste(student, ((W - student.width) // 2, 380), student)
        
    # Bottom Card Stack (The Solution)
    by = 1050
    draw.rounded_rectangle([50, by, W - 50, H - 120], radius=28, fill=COLOR_WHITE, outline="#CBD5E1", width=3)
    draw.text((85, by + 35), "THE 3-SENTENCE FIRST-CLASS REWRITE FORMULA", fill=COLOR_NAVY, font=get_font('helvetica', 24, bold=True))
    draw.line([85, by + 80, W - 85, by + 80], fill="#E2E8F0", width=2)
    
    steps = [
        ("01. The Author's Premise", "State the core claim directly with peer-reviewed evidence (Smith, 2022)."),
        ("02. The Methodological Critique", "Scrutinize their sample size, geographical bias, or statistical assumptions."),
        ("03. Your Justified Verdict", "Synthesize findings to answer the module learning outcome decisively.")
    ]
    
    sy = by + 105
    for s_title, s_desc in steps:
        draw.ellipse([85, sy + 3, 115, sy + 33], fill=COLOR_EMERALD)
        draw_vector_check(draw, 100, sy + 18, size=14, color=COLOR_WHITE, width=2)
        draw.text((130, sy), s_title, fill=COLOR_NAVY, font=get_font('helvetica', 23, bold=True))
        desc_lines = wrap_text(draw, s_desc, get_font('helvetica', 19), W - 230)
        if desc_lines:
            draw.text((130, sy + 35), desc_lines[0], fill=COLOR_GRAY_TEXT, font=get_font('helvetica', 19))
        sy += 115
        
    # Floating WhatsApp CTA
    wy = sy + 25
    draw.rounded_rectangle([85, wy, W - 85, wy + 110], radius=18, fill=COLOR_GOLD)
    draw.text((115, wy + 20), "Book Your 1-on-1 Academic Consultation", fill=COLOR_NAVY, font=get_font('impact', 26))
    draw.text((115, wy + 60), "WhatsApp: +91 95098 93638 • Online 24/7", fill=COLOR_NAVY, font=get_font('helvetica', 20, bold=True))
    
    img.save(output_path, quality=95)
    return output_path

# ==============================================================================
# REEL TEMPLATE 05: 12-Hour Urgent Midnight Deadline Sprint
# ==============================================================================
def render_reel_template_05(recipe: Dict[str, Any], student_id: Optional[int] = None, output_path: str = "reel_05.png") -> str:
    W, H = 1080, 1920
    img = Image.new("RGB", (W, H), color="#1E1B4B")  # Midnight indigo
    draw = ImageDraw.Draw(img)
    
    draw_branding_header(img, draw, x=60, y=70, light_mode=False)
    
    # Emergency Siren Badge
    ey = 160
    draw.rounded_rectangle([50, ey, 500, ey + 60], radius=12, fill="#DC2626")
    draw.text((70, ey + 15), "12-HOUR EMERGENCY PROTOCOL", fill=COLOR_WHITE, font=get_font('helvetica', 20, bold=True))
    
    # Big Bold Deadline Hook
    draw.text((50, ey + 90), "ASSIGNMENT DUE IN 12 HOURS", fill=COLOR_WHITE, font=get_font('impact', 54))
    draw.text((50, ey + 160), "AND HAVEN'T STARTED YET?", fill=COLOR_GOLD, font=get_font('impact', 54))
    
    # Countdown Clock Visual Card
    cy = ey + 250
    draw.rounded_rectangle([50, cy, W - 50, cy + 260], radius=24, fill="#312E81", outline="#6366F1", width=3)
    draw.text((85, cy + 30), "DON'T PANIC. OUR EMERGENCY WRITERS ARE ONLINE:", fill="#C7D2FE", font=get_font('helvetica', 20, bold=True))
    
    milestones = [
        ("15 MINS", "Brief Deconstructed & Rubric Analyzed"),
        ("30 MINS", "Postgraduate Subject Specialist Assigned"),
        ("12 HOURS", "Complete, Referenced Draft + Turnitin Report")
    ]
    my = cy + 85
    for m_time, m_text in milestones:
        draw.rounded_rectangle([85, my, 220, my + 45], radius=10, fill=COLOR_GOLD)
        draw.text((100, my + 10), m_time, fill=COLOR_NAVY, font=get_font('impact', 22))
        draw.text((240, my + 10), m_text, fill=COLOR_WHITE, font=get_font('helvetica', 22, bold=True))
        my += 58
        
    # The Core Subjects We Cover Tonight Card
    sy = cy + 290
    draw.rounded_rectangle([50, sy, W - 50, sy + 380], radius=24, fill="#111827", outline="#374151", width=2)
    draw.text((85, sy + 30), "EMERGENCY COVERAGE ACROSS ALL MAJORS:", fill=COLOR_GOLD, font=get_font('helvetica', 22, bold=True))
    
    majors = [
        ("Nursing & Health", "Care plans, reflections, drug calculations"),
        ("Law & Criminology", "IRAC case briefs, contract & tort essays"),
        ("Business & MBA", "PESTEL, Porter's 5 forces, financial reports"),
        ("Computer Science", "Clean code in Python, Java, bug-free scripts")
    ]
    jy = sy + 85
    for j_title, j_sub in majors:
        draw_vector_star(draw, 100, jy + 18, r=12, color=COLOR_GOLD)
        draw.text((130, jy), j_title, fill=COLOR_WHITE, font=get_font('helvetica', 22, bold=True))
        draw.text((130, jy + 32), j_sub, fill="#9CA3AF", font=get_font('helvetica', 18))
        jy += 70
        
    # Student Cutout
    student_res = load_student(student_id, target_height=560)
    if student_res:
        student, s_name = student_res
        img.paste(student, (W - student.width, H - 560), student)
        
    # High-Urgency Red WhatsApp CTA
    wy = H - 240
    draw.rounded_rectangle([50, wy, 600, wy + 150], radius=20, fill="#DC2626")
    draw.text((80, wy + 25), "START YOUR EMERGENCY ORDER", fill=COLOR_WHITE, font=get_font('impact', 28))
    draw.text((80, wy + 72), "WhatsApp: +91 95098 93638 (Online Now)", fill="#FEF08A", font=get_font('helvetica', 22, bold=True))
    
    img.save(output_path, quality=95)
    return output_path

# ==============================================================================
# REEL TEMPLATE 06: The Distinction Editorial Notebook / iPad Planner
# ==============================================================================
def render_reel_template_06(recipe: Dict[str, Any], student_id: Optional[int] = None, output_path: str = "reel_06.png") -> str:
    W, H = 1080, 1920
    img = Image.new("RGB", (W, H), color="#F1F5F9")  # Slate clean background
    draw = ImageDraw.Draw(img)
    
    draw_branding_header(img, draw, x=60, y=70, light_mode=True)
    
    # Notebook Sheet
    ny1, ny2 = 160, H - 150
    draw.rounded_rectangle([50, ny1, W - 50, ny2], radius=28, fill=COLOR_WHITE, outline="#CBD5E1", width=2)
    
    # Ring binder spirals on left edge
    for sy in range(ny1 + 45, ny2 - 30, 60):
        draw.ellipse([65, sy, 90, sy + 25], fill="#0F172A")
        draw.line([55, sy + 12, 95, sy + 12], fill="#94A3B8", width=5)
        
    # Notebook Title
    draw.text((120, ny1 + 40), "STUDY SMART CHECKLIST", fill=COLOR_GOLD, font=get_font('helvetica', 22, bold=True))
    draw.text((120, ny1 + 80), "HOW TO TURN A 2:2 INTO A 1ST CLASS", fill=COLOR_NAVY, font=get_font('impact', 44))
    draw.line([120, ny1 + 145, W - 80, ny1 + 145], fill="#E2E8F0", width=2)
    
    secrets = [
        ("1. DECONSTRUCT THE MARKING RUBRIC", "Every paragraph must address learning outcomes explicitly, not broadly."),
        ("2. SYNTHESISE, NEVER JUST SUMMARISE", "Highlight tensions between author methodologies rather than listing facts."),
        ("3. EXACT PINPOINT CITATIONS", "Include precise page numbers (p. 45) for quotes and statutory sections."),
        ("4. ELIMINATE CONVOLUTED THESAURUS JARGON", "Clarity and academic register outperform decorated word salads every time."),
        ("5. INDEPENDENT TURNITIN SCAN", "Audit your paper with a non-repository scanner before final submission.")
    ]
    
    py = ny1 + 175
    for s_title, s_desc in secrets:
        draw.ellipse([120, py + 2, 146, py + 28], fill=COLOR_EMERALD)
        draw_vector_check(draw, 133, py + 15, size=12, color=COLOR_WHITE, width=2)
        draw.text((160, py), s_title, fill=COLOR_NAVY, font=get_font('helvetica', 22, bold=True))
        desc_lines = wrap_text(draw, s_desc, get_font('helvetica', 18), W - 240)
        if desc_lines:
            draw.text((160, py + 32), desc_lines[0], fill=COLOR_GRAY_TEXT, font=get_font('helvetica', 18))
        py += 115
        
    # Student Model in lower right
    student_res = load_student(student_id, target_height=640)
    if student_res:
        student, s_name = student_res
        img.paste(student, (W - student.width + 20, H - 640), student)
        
    # Floating WhatsApp CTA Card in bottom left
    wy = H - 320
    draw.rounded_rectangle([90, wy, 620, wy + 140], radius=20, fill=COLOR_NAVY)
    draw.text((120, wy + 22), "TALK TO OUR POSTGRAD MENTORS", fill=COLOR_GOLD, font=get_font('impact', 24))
    draw.text((120, wy + 62), "WhatsApp: +91 95098 93638", fill=COLOR_WHITE, font=get_font('helvetica', 22, bold=True))
    draw.text((120, wy + 98), "Guaranteed Plagiarism-Free Submissions", fill="#94A3B8", font=get_font('helvetica', 16))
    
    img.save(output_path, quality=95)
    return output_path

REEL_TEMPLATES = [
    render_reel_template_01,
    render_reel_template_02,
    render_reel_template_03,
    render_reel_template_04,
    render_reel_template_05,
    render_reel_template_06,
]

def generate_random_reel_frame(recipe: Dict[str, Any], template_id: Optional[int] = None, student_id: Optional[int] = None, output_path: str = "daily_afternoon_reel_frame.png") -> Dict[str, Any]:
    if template_id is None:
        t_idx = random.randint(1, len(REEL_TEMPLATES))
    else:
        t_idx = max(1, min(len(REEL_TEMPLATES), int(template_id)))
        
    if student_id is None:
        s_idx = random.randint(1, 20)
    else:
        s_idx = max(1, min(20, int(student_id)))
        
    render_fn = REEL_TEMPLATES[t_idx - 1]
    res_path = render_fn(recipe=recipe, student_id=s_idx, output_path=output_path)
    
    return {
        "output_path": res_path,
        "template_id": t_idx,
        "student_id": s_idx
    }
