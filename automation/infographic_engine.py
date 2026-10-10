"""
Academic Wizard - Master Infographic Generation Engine (V2 - Ultra Polished)
Provides 15 distinct layout templates and 20 randomized photorealistic student cutouts.
Enforces strict safe-zone bounding boxes and clean vector glyphs (zero tofu boxes).
"""

import os
import random
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STUDENTS_DIR = os.path.join(BASE_DIR, 'assets', 'students')
LOGO_PATH = os.path.normpath(os.path.join(BASE_DIR, '..', 'public', 'academic-wizard-logo-nav.webp'))

# Color Palette
COLOR_NAVY = '#0F172A'
COLOR_DEEP_BLUE = '#1E3A8A'
COLOR_GOLD = '#F5A623'
COLOR_AMBER = '#D97706'
COLOR_EMERALD = '#10B981'
COLOR_ROSE = '#E11D48'
COLOR_CREAM = '#FAF8F5'
COLOR_WHITE = '#FFFFFF'
COLOR_GRAY_LIGHT = '#F1F5F9'
COLOR_GRAY_BORDER = '#CBD5E1'
COLOR_GRAY_TEXT = '#64748B'

def get_font(family='helvetica', size=24, bold=False):
    """Robust font loader with macOS system fonts and fallbacks."""
    candidates = []
    if family == 'impact':
        candidates = ['/System/Library/Fonts/Supplemental/Impact.ttf']
    elif family == 'serif':
        candidates = ['/System/Library/Fonts/Supplemental/Georgia Bold.ttf' if bold else '/System/Library/Fonts/Supplemental/Georgia.ttf']
    elif family == 'mono':
        candidates = ['/System/Library/Fonts/Monaco.ttf', '/System/Library/Fonts/Courier.dfont']
    else:
        if bold:
            candidates = [
                '/System/Library/Fonts/Supplemental/Arial Bold.ttf',
                '/System/Library/Fonts/Supplemental/Arial Black.ttf',
                '/System/Library/Fonts/HelveticaNeue.ttc',
                '/System/Library/Fonts/Helvetica.ttc'
            ]
        else:
            candidates = [
                '/System/Library/Fonts/Supplemental/Arial.ttf',
                '/System/Library/Fonts/HelveticaNeue.ttc',
                '/System/Library/Fonts/Helvetica.ttc'
            ]
    for path in candidates:
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except Exception:
                continue
    return ImageFont.load_default()

def draw_vector_check(draw, cx, cy, size=14, color=COLOR_EMERALD, width=3):
    """Draws a crisp anti-aliased checkmark vector without relying on emoji fonts."""
    p1 = (cx - size // 2, cy)
    p2 = (cx - size // 6, cy + size // 2)
    p3 = (cx + size // 2, cy - size // 2)
    draw.line([p1, p2], fill=color, width=width)
    draw.line([p2, p3], fill=color, width=width)

def draw_vector_cross(draw, cx, cy, size=14, color=COLOR_ROSE, width=3):
    """Draws a crisp anti-aliased X cross vector."""
    d = size // 2
    draw.line([(cx - d, cy - d), (cx + d, cy + d)], fill=color, width=width)
    draw.line([(cx - d, cy + d), (cx + d, cy - d)], fill=color, width=width)

def draw_vector_star(draw, cx, cy, r=10, color=COLOR_GOLD):
    """Draws a filled 5-point star vector."""
    points = []
    for i in range(10):
        radius = r if i % 2 == 0 else r * 0.45
        angle = i * np.pi / 5 - np.pi / 2
        points.append((cx + radius * np.cos(angle), cy + radius * np.sin(angle)))
    draw.polygon(points, fill=color)

def load_student(student_id=None, target_height=800):
    """Loads and crops a student cutout from assets."""
    if not os.path.exists(STUDENTS_DIR):
        return None
    available = [f for f in os.listdir(STUDENTS_DIR) if f.startswith('student_') and f.endswith('.png')]
    if not available:
        return None
    
    if student_id is not None:
        filename = f"student_{int(student_id):02d}.png"
        if filename not in available:
            filename = random.choice(available)
    else:
        filename = random.choice(available)
        
    path = os.path.join(STUDENTS_DIR, filename)
    img = Image.open(path).convert('RGBA')
    arr = np.array(img)
    alpha = arr[:, :, 3]
    ys, xs = np.where(alpha > 40)
    if len(ys) > 0 and len(xs) > 0:
        img = img.crop((xs.min(), ys.min(), xs.max(), ys.max()))
        
    aspect = img.width / img.height
    target_width = int(target_height * aspect)
    return img.resize((target_width, target_height), Image.Resampling.LANCZOS), filename

def draw_branding_header(img, draw, x=50, y=40, light_mode=True):
    """Draws official logo and brand typography."""
    if os.path.exists(LOGO_PATH):
        try:
            logo = Image.open(LOGO_PATH).convert('RGBA')
            logo = logo.resize((66, 66), Image.Resampling.LANCZOS)
            img.paste(logo, (x, y), logo)
        except Exception:
            pass
            
    brand_font = get_font('helvetica', 32, bold=True)
    tag_font = get_font('helvetica', 15, bold=False)
    
    title_color = COLOR_NAVY if light_mode else COLOR_WHITE
    tag_color = COLOR_GRAY_TEXT if light_mode else '#94A3B8'
    
    draw.text((x + 78, y + 4), "Academic Wizard", fill=title_color, font=brand_font)
    draw.text((x + 80, y + 38), "Top Grades Guaranteed • 100% Original", fill=tag_color, font=tag_font)

def draw_whatsapp_badge(draw, x=620, y=920, w=410, h=60, light_mode=True):
    """Draws verified WhatsApp CTA pill."""
    bg_color = COLOR_WHITE if light_mode else '#1E293B'
    border_color = COLOR_GRAY_BORDER if light_mode else '#334155'
    text_color = COLOR_NAVY if light_mode else COLOR_WHITE
    
    draw.rounded_rectangle([x, y, x + w, y + h], radius=h//2, fill=bg_color, outline=border_color, width=2)
    # Green WhatsApp dot
    draw.ellipse([x + 20, y + 20, x + 40, y + 40], fill=COLOR_EMERALD)
    font_badge = get_font('helvetica', 22, bold=True)
    draw.text((x + 50, y + 17), "WhatsApp: +91 95098 93638", fill=text_color, font=font_badge)

# ==============================================================================
# TEMPLATE 01: Numbered Capsules (User Reference 2 Style)
# ==============================================================================
def render_template_01(student_id=None, content=None, output_path='template_01.png'):
    W, H = 1080, 1080
    img = Image.new('RGB', (W, H), color=COLOR_CREAM)
    draw = ImageDraw.Draw(img)
    
    draw.ellipse([70, -70, 690, 530], fill='#FCEBD9')
    draw.chord([-80, 930, 1160, 1220], start=0, end=180, fill='#E2F0F7')
    
    draw_branding_header(img, draw, x=50, y=40, light_mode=True)
    
    title_1 = content.get('title_1', 'TOP COURSES IN UK') if content else 'TOP COURSES IN UK'
    title_2 = content.get('title_2', 'ASSISTED BY EXPERTS') if content else 'ASSISTED BY EXPERTS'
    items = content.get('items', [
        ("1.", "Nursing & Healthcare"),
        ("2.", "Business & MBA Studies"),
        ("3.", "Law & Legal Research"),
        ("4.", "Computer Science & AI"),
        ("5.", "Engineering & Data Analysis")
    ]) if content else [
        ("1.", "Nursing & Healthcare"),
        ("2.", "Business & MBA Studies"),
        ("3.", "Law & Legal Research"),
        ("4.", "Computer Science & AI"),
        ("5.", "Engineering & Data Analysis")
    ]
    
    font_head1 = get_font('impact', 58)
    font_head2 = get_font('impact', 42)
    title_x = 520
    draw.text((title_x, 120), title_1, fill=COLOR_NAVY, font=font_head1)
    draw.text((title_x, 185), title_2, fill=COLOR_AMBER, font=font_head2)
    
    student_res = load_student(student_id, target_height=825)
    if student_res:
        student, s_name = student_res
        img.paste(student, (5, H - 825), student)
        
    font_num = get_font('impact', 50)
    font_text = get_font('helvetica', 25, bold=True)
    start_y = 265
    cap_h = 94
    cap_gap = 22
    for i, (num_str, text_str) in enumerate(items[:5]):
        y1 = start_y + i * (cap_h + cap_gap)
        y2 = y1 + cap_h
        draw.rounded_rectangle([520, y1, 1030, y2], radius=47, fill=COLOR_GOLD)
        draw.text((552, y1 + 20), num_str, fill=COLOR_NAVY, font=font_num)
        draw.text((615, y1 + 32), text_str, fill=COLOR_NAVY, font=font_text)
        
    draw_whatsapp_badge(draw, x=610, y=920, w=420, h=60, light_mode=True)
    img.save(output_path, quality=95)
    return output_path

# ==============================================================================
# TEMPLATE 02: Diagonal Split Card (User Reference 1 Style)
# ==============================================================================
def render_template_02(student_id=None, content=None, output_path='template_02.png'):
    W, H = 1080, 1080
    img = Image.new('RGB', (W, H), color='#FFFFFF')
    draw = ImageDraw.Draw(img)
    
    draw.rectangle([0, 0, W, H], fill='#F8FAFC')
    draw.ellipse([450, 100, 1150, 800], fill='#EFF6FF')
    
    polygon = [(0, 0), (600, 0), (470, H), (0, H)]
    draw.polygon(polygon, fill=COLOR_DEEP_BLUE)
    
    draw_branding_header(img, draw, x=45, y=40, light_mode=False)
    
    if content and 'title_1' in content and 'title_2' in content:
        title = f"{content['title_1']}\n{content['title_2']}"
    elif content and 'title' in content:
        title = content['title']
    else:
        title = 'Assignment Writing\nSERVICES'
        
    if content and 'items' in content and content['items']:
        items = [f"{itm[1]}" if isinstance(itm, (list, tuple)) else str(itm) for itm in content['items']]
    else:
        items = [
            "Essay Writing & Dissertations",
            "Healthcare & Nursing Reports",
            "Business & MBA Case Studies",
            "IT Programming & AI Coding",
            "Law, Economics & Statistics",
            "100% Original Work Guaranteed",
            "Direct One-on-One Expert Chat"
        ]
    
    font_title = get_font('serif', 50, bold=True)
    draw.text((50, 140), title, fill=COLOR_WHITE, font=font_title)
    
    draw.rounded_rectangle([50, 260, 320, 305], radius=8, fill=COLOR_GOLD)
    draw.text((65, 270), "TOP RATED WRITERS", fill=COLOR_NAVY, font=get_font('helvetica', 22, bold=True))
    
    font_bullet = get_font('helvetica', 23, bold=True)
    by = 340
    for itm in items[:7]:
        draw.ellipse([50, by + 4, 66, by + 20], fill=COLOR_GOLD)
        draw.text((78, by), itm, fill=COLOR_WHITE, font=font_bullet)
        by += 54
        
    student_res = load_student(student_id, target_height=880)
    if student_res:
        student, s_name = student_res
        img.paste(student, (W - student.width - 20, H - 880), student)
        
    draw.rounded_rectangle([40, 880, 440, 990], radius=16, fill=COLOR_GOLD)
    draw.text((60, 895), "Get Your Free Quote:", fill=COLOR_NAVY, font=get_font('helvetica', 20, bold=True))
    draw.text((60, 930), "WhatsApp: +91 95098 93638", fill=COLOR_NAVY, font=get_font('helvetica', 24, bold=True))
    
    img.save(output_path, quality=95)
    return output_path

# ==============================================================================
# TEMPLATE 03: Spiral Notebook Page (User Reference 3 Style)
# ==============================================================================
def render_template_03(student_id=None, content=None, output_path='template_03.png'):
    W, H = 1080, 1080
    img = Image.new('RGB', (W, H), color='#0F172A')
    draw = ImageDraw.Draw(img)
    
    draw_branding_header(img, draw, x=45, y=35, light_mode=False)
    
    # Left Hero Text (Properly sized and wrapped)
    font_hero1 = get_font('impact', 48)
    font_hero2 = get_font('impact', 48)
    t1 = content.get('title_1', "LET US WRITE YOUR")[:24] if content else "LET US WRITE YOUR"
    t2 = content.get('title_2', "ASSIGNMENT FOR YOU")[:24] if content else "ASSIGNMENT FOR YOU"
    draw.text((45, 130), t1, fill=COLOR_WHITE, font=font_hero1)
    draw.text((45, 185), t2, fill=COLOR_GOLD, font=font_hero2)
    
    if content and 'items' in content and content['items']:
        badges = [(itm[1][:22], f"Rule {itm[0]}: Academic Standard") for itm in content['items'][:4]]
    else:
        badges = [
            ("PRECISE & CLEAR", "Marking Rubric Followed"),
            ("ON-TIME DELIVERY", "Never Miss Deadlines"),
            ("QUALITY ASSURED", "Turnitin Report Included"),
            ("FREE REVISIONS", "100% Satisfaction")
        ]
    font_b_title = get_font('helvetica', 21, bold=True)
    font_b_sub = get_font('helvetica', 16, bold=False)
    
    by = 280
    for b_title, b_sub in badges:
        draw.ellipse([45, by, 95, by + 50], fill=COLOR_GOLD)
        draw_vector_check(draw, 70, by + 25, size=18, color=COLOR_NAVY, width=3)
        draw.text((110, by + 5), b_title, fill=COLOR_WHITE, font=font_b_title)
        draw.text((110, by + 30), b_sub, fill=COLOR_GRAY_TEXT, font=font_b_sub)
        by += 78
        
    # Notebook Sheet on Right
    nx1, ny1, nx2, ny2 = 470, 120, 1040, 870
    draw.rounded_rectangle([nx1, ny1, nx2, ny2], radius=24, fill='#FFFFFF')
    
    for hy in range(ny1 + 40, ny2 - 30, 48):
        draw.ellipse([nx1 + 18, hy, nx1 + 38, hy + 20], fill='#0F172A')
        draw.line([nx1 + 8, hy + 10, nx1 + 42, hy + 10], fill='#CBD5E1', width=4)
        
    draw.text((nx1 + 60, ny1 + 40), "WHY STUDENTS TRUST US:", fill=COLOR_DEEP_BLUE, font=get_font('helvetica', 28, bold=True))
    draw.line([nx1 + 60, ny1 + 85, nx2 - 50, ny1 + 85], fill='#E2E8F0', width=2)
    
    sections = [
        ("TOP UK & GLOBAL WRITERS", "PhD specialists across 50+ subjects deconstruct every brief."),
        ("100% TURNITIN ORIGINALITY", "Zero AI generation, strict human research with reports."),
        ("GUARANTEED FIRST-CLASS (2:1)", "Strict adherence to academic conventions & rubrics."),
        ("24/7 WHATSAPP TRIAGE", "Instant updates and file sharing up to final submission.")
    ]
    
    sy = ny1 + 115
    for s_title, s_desc in sections:
        draw.ellipse([nx1 + 60, sy + 3, nx1 + 88, sy + 31], fill=COLOR_EMERALD)
        draw_vector_check(draw, nx1 + 74, sy + 17, size=14, color=COLOR_WHITE, width=2)
        draw.text((nx1 + 100, sy), s_title, fill=COLOR_NAVY, font=get_font('helvetica', 22, bold=True))
        
        words = s_desc.split()
        line1 = " ".join(words[:7])
        line2 = " ".join(words[7:])
        draw.text((nx1 + 100, sy + 30), line1, fill=COLOR_GRAY_TEXT, font=get_font('helvetica', 18))
        if line2:
            draw.text((nx1 + 100, sy + 55), line2, fill=COLOR_GRAY_TEXT, font=get_font('helvetica', 18))
        sy += 115
        
    student_res = load_student(student_id, target_height=430)
    if student_res:
        student, s_name = student_res
        img.paste(student, (45, H - 430), student)
        
    draw.rounded_rectangle([470, 905, 1040, 995], radius=20, fill=COLOR_GOLD)
    draw.text((510, 925), "Book On WhatsApp: +91 95098 93638", fill=COLOR_NAVY, font=get_font('helvetica', 28, bold=True))
    draw.text((510, 962), "Fast 24-Hour Turnaround Available", fill=COLOR_NAVY, font=get_font('helvetica', 18))
    
    img.save(output_path, quality=95)
    return output_path

# ==============================================================================
# TEMPLATE 04: "Alone vs Academic Wizard" Comparison Card
# ==============================================================================
def render_template_04(student_id=None, content=None, output_path='template_04.png'):
    W, H = 1080, 1080
    img = Image.new('RGB', (W, H), color=COLOR_CREAM)
    draw = ImageDraw.Draw(img)
    
    draw_branding_header(img, draw, x=50, y=35, light_mode=True)
    
    t1 = content.get('title_1', "DOING ASSIGNMENTS ALONE vs WITH US")[:34] if content else "DOING ASSIGNMENTS ALONE vs WITH US"
    t2 = content.get('title_2', "Why 50,000+ university students choose Academic Wizard")[:55] if content else "Why 50,000+ university students choose Academic Wizard"
    draw.text((50, 120), t1, fill=COLOR_NAVY, font=get_font('impact', 52))
    draw.text((50, 185), t2, fill=COLOR_AMBER, font=get_font('helvetica', 22, bold=True))
    
    # Left Column: Stressed Alone
    draw.rounded_rectangle([50, 240, 520, 870], radius=24, fill='#FEE2E2', outline='#FCA5A5', width=2)
    draw_vector_cross(draw, 80, 285, size=22, color='#991B1B', width=4)
    draw.text((105, 265), "Doing It Alone", fill='#991B1B', font=get_font('helvetica', 30, bold=True))
    draw.line([80, 315, 490, 315], fill='#FCA5A5', width=2)
    
    if content and 'items' in content and len(content['items']) >= 4:
        alone_points = [
            f"Vague {content['items'][0][1][:26]}",
            f"Descriptive {content['items'][1][1][:24]}",
            "Missing page pinpoints & citations",
            "Turnitin similarity warning flags",
            "Panic over tight deadlines",
            "Risk of 2:2 or failing grade"
        ]
        wizard_points = [
            f"Rigorous {content['items'][0][1][:24]}",
            f"Critical {content['items'][1][1][:24]}",
            f"Flawless {content['items'][2][1][:24] if len(content['items']) > 2 else 'Citations'}",
            "100% Human Turnitin report",
            "Targeting 1st Class / 2:1 grades",
            "Peace of mind & 24/7 WhatsApp help"
        ]
    else:
        alone_points = [
            "Unclear grading rubrics",
            "Panic over tight deadlines",
            "Turnitin AI detection fears",
            "Hours lost on citations & formatting",
            "Risk of 2:2 or failing marks",
            "High stress and sleepless nights"
        ]
        wizard_points = [
            "Deconstructed rubric criteria",
            "Guaranteed on-time submission",
            "100% human-written Turnitin report",
            "Flawless APA, Harvard & OSCOLA",
            "Targeting 1st Class / 2:1 grades",
            "Peace of mind & 24/7 WhatsApp help"
        ]
    py = 350
    for pt in alone_points:
        draw_vector_cross(draw, 75, py + 12, size=16, color='#DC2626', width=3)
        draw.text((98, py), pt, fill='#7F1D1D', font=get_font('helvetica', 21, bold=True))
        py += 80
        
    # Right Column: With Academic Wizard
    draw.rounded_rectangle([550, 240, 1030, 870], radius=24, fill='#DCFCE7', outline='#86EFAC', width=2)
    draw_vector_check(draw, 580, 285, size=22, color='#166534', width=4)
    draw.text((605, 265), "With Academic Wizard", fill='#166534', font=get_font('helvetica', 30, bold=True))
    draw.line([580, 315, 1000, 315], fill='#86EFAC', width=2)
    py = 350
    for pt in wizard_points:
        draw_vector_check(draw, 575, py + 12, size=16, color='#15803D', width=3)
        draw.text((598, py), pt, fill='#14532D', font=get_font('helvetica', 21, bold=True))
        py += 80
        
    draw.rounded_rectangle([50, 905, 1030, 995], radius=20, fill=COLOR_DEEP_BLUE)
    draw.text((100, 925), "Secure Your Top Grade Today • WhatsApp: +91 95098 93638", fill=COLOR_WHITE, font=get_font('helvetica', 26, bold=True))
    draw.text((100, 960), "1-on-1 Academic Consultation • Fast 24-Hour Turnaround Available", fill=COLOR_GOLD, font=get_font('helvetica', 18))
    
    img.save(output_path, quality=95)
    return output_path

# ==============================================================================
# TEMPLATE 05: 4-Quadrant Subject Grid Matrix
# ==============================================================================
def render_template_05(student_id=None, content=None, output_path='template_05.png'):
    W, H = 1080, 1080
    img = Image.new('RGB', (W, H), color='#F8FAFC')
    draw = ImageDraw.Draw(img)
    
    draw_branding_header(img, draw, x=50, y=40, light_mode=True)
    
    t1 = content.get('title_1', "EXPERT ASSISTANCE ACROSS ALL MAJORS")[:34] if content else "EXPERT ASSISTANCE ACROSS ALL MAJORS"
    t2 = content.get('title_2', "Select your degree field to connect with a subject-matter specialist")[:60] if content else "Select your degree field to connect with a subject-matter specialist"
    draw.text((50, 125), t1, fill=COLOR_NAVY, font=get_font('impact', 52))
    draw.text((50, 190), t2, fill=COLOR_AMBER, font=get_font('helvetica', 22, bold=True))
    
    if content and 'items' in content and len(content['items']) >= 4:
        c_items = content['items']
        cards = [
            (c_items[0][1][:20].upper(), f"Framework {c_items[0][0]}: Rigorous academic execution", '#EFF6FF', '#3B82F6', 50, 245),
            (c_items[1][1][:20].upper(), f"Methodology {c_items[1][0]}: Deep literature synthesis", '#FEF3C7', '#D97706', 550, 245),
            (c_items[2][1][:20].upper(), f"Analysis {c_items[2][0]}: Critical evidence & evaluation", '#F3E8FF', '#8B5CF6', 50, 550),
            (c_items[3][1][:20].upper(), f"Outcome {c_items[3][0]}: Verified First-Class standard", '#ECFDF5', '#10B981', 550, 550)
        ]
    else:
        cards = [
            ("NURSING & HEALTHCARE", "Care Plans, Clinical Reflections, Gibbs Cycles & OSCEs", '#EFF6FF', '#3B82F6', 50, 245),
            ("BUSINESS & MBA", "Marketing Strategy, Financial Models, PESTEL & SWOT", '#FEF3C7', '#D97706', 550, 245),
            ("LAW & CRIMINOLOGY", "Case Analysis, IRAC Method, OSCOLA & Statutory Law", '#F3E8FF', '#8B5CF6', 50, 550),
            ("COMPUTER SCIENCE & AI", "Python, Java, React, Machine Learning & Database Design", '#ECFDF5', '#10B981', 550, 550)
        ]
    
    for c_title, c_desc, bg, border, cx, cy in cards:
        draw.rounded_rectangle([cx, cy, cx + 470, cy + 270], radius=20, fill=bg, outline=border, width=3)
        draw_vector_star(draw, cx + 50, cy + 50, r=16, color=border)
        draw.text((cx + 80, cy + 38), c_title, fill=COLOR_NAVY, font=get_font('helvetica', 24, bold=True))
        
        words = c_desc.split()
        line1 = " ".join(words[:5])
        line2 = " ".join(words[5:])
        draw.text((cx + 30, cy + 105), line1, fill=COLOR_NAVY, font=get_font('helvetica', 21, bold=True))
        draw.text((cx + 30, cy + 140), line2, fill=COLOR_GRAY_TEXT, font=get_font('helvetica', 19))
        
        draw.text((cx + 30, cy + 205), "Chat with Specialist →", fill=border, font=get_font('helvetica', 20, bold=True))
        
    draw_whatsapp_badge(draw, x=340, y=890, w=410, h=60, light_mode=True)
    img.save(output_path, quality=95)
    return output_path

# ==============================================================================
# TEMPLATE 06: Vertical Roadmap / Step-by-Step Success Path
# ==============================================================================
def render_template_06(student_id=None, content=None, output_path='template_06.png'):
    W, H = 1080, 1080
    img = Image.new('RGB', (W, H), color=COLOR_CREAM)
    draw = ImageDraw.Draw(img)
    
    draw_branding_header(img, draw, x=50, y=40, light_mode=True)
    
    t1 = content.get('title_1', "YOUR 4-STEP PATH")[:26] if content else "YOUR 4-STEP PATH"
    t2 = content.get('title_2', "TO A 1ST CLASS GRADE")[:26] if content else "TO A 1ST CLASS GRADE"
    draw.text((510, 120), t1, fill=COLOR_NAVY, font=get_font('impact', 54))
    draw.text((510, 185), t2, fill=COLOR_AMBER, font=get_font('impact', 44))
    
    student_res = load_student(student_id, target_height=825)
    if student_res:
        student, s_name = student_res
        img.paste(student, (10, H - 825), student)
        
    draw.line([550, 280, 550, 840], fill=COLOR_GRAY_BORDER, width=4)
    
    if content and 'items' in content and len(content['items']) >= 4:
        steps = [(f"0{i}", itm[1][:22], "Strict adherence to rubric criteria & guidelines.") for i, itm in enumerate(content['items'][:4], 1)]
    else:
        steps = [
            ("01", "Send Your Rubric & Brief", "Share your deadline, guidelines & university requirements."),
            ("02", "Expert Writer Assigned", "Matched with a UK/global PhD specialist in your exact field."),
            ("03", "Drafting & Turnitin Check", "Written from scratch with strict plagiarism & AI audit."),
            ("04", "On-Time Delivery & A+ Grade", "Download your polished paper ready for full submission.")
        ]
    
    sy = 260
    for num, stitle, sdesc in steps:
        draw.ellipse([525, sy, 575, sy + 50], fill=COLOR_GOLD)
        draw.text((535, sy + 12), num, fill=COLOR_NAVY, font=get_font('helvetica', 20, bold=True))
        
        draw.rounded_rectangle([600, sy - 10, 1030, sy + 95], radius=16, fill='#FFFFFF', outline=COLOR_GRAY_BORDER, width=2)
        draw.text((620, sy + 8), stitle, fill=COLOR_NAVY, font=get_font('helvetica', 23, bold=True))
        draw.text((620, sy + 42), sdesc, fill=COLOR_GRAY_TEXT, font=get_font('helvetica', 17))
        sy += 145
        
    draw_whatsapp_badge(draw, x=610, y=915, w=420, h=60, light_mode=True)
    img.save(output_path, quality=95)
    return output_path

# ==============================================================================
# TEMPLATE 07: Trust & Proof Metric Showcase
# ==============================================================================
def render_template_07(student_id=None, content=None, output_path='template_07.png'):
    W, H = 1080, 1080
    img = Image.new('RGB', (W, H), color='#0F172A')
    draw = ImageDraw.Draw(img)
    
    draw_branding_header(img, draw, x=50, y=40, light_mode=False)
    
    t1 = content.get('title_1', "THE ACADEMIC STANDARD YOU CAN TRUST")[:34] if content else "THE ACADEMIC STANDARD YOU CAN TRUST"
    t2 = content.get('title_2', "Helping UK and global university students achieve excellence since 2018")[:65] if content else "Helping UK and global university students achieve excellence since 2018"
    draw.text((50, 130), t1, fill=COLOR_WHITE, font=get_font('impact', 52))
    draw.text((50, 195), t2, fill=COLOR_GOLD, font=get_font('helvetica', 21, bold=True))
    
    draw.rounded_rectangle([50, 250, 1030, 480], radius=24, fill='#1E293B', outline=COLOR_GOLD, width=3)
    draw.text((90, 275), "98.4% PASS RATE", fill=COLOR_GOLD, font=get_font('impact', 86))
    draw.text((90, 380), "First-Class (1st) & Upper Second-Class (2:1) Submissions", fill=COLOR_WHITE, font=get_font('helvetica', 28, bold=True))
    draw.text((90, 425), "Audited with official Turnitin originality and AI similarity reports.", fill=COLOR_GRAY_TEXT, font=get_font('helvetica', 20))
    
    stats = [
        ("50,000+", "Completed Assignments", 50),
        ("500+", "PhD Qualified Experts", 380),
        ("4.9 / 5", "Student Trust Rating", 710)
    ]
    for sval, slbl, sx in stats:
        draw.rounded_rectangle([sx, 515, sx + 320, 680], radius=20, fill='#1E293B', outline='#334155', width=2)
        draw.text((sx + 30, 545), sval, fill=COLOR_WHITE, font=get_font('impact', 48))
        draw.text((sx + 30, 615), slbl, fill=COLOR_GOLD, font=get_font('helvetica', 20, bold=True))
        
    student_res = load_student(student_id, target_height=420)
    if student_res:
        student, s_name = student_res
        img.paste(student, (50, H - 420), student)
        
    draw.rounded_rectangle([420, 750, 1030, 960], radius=24, fill=COLOR_GOLD)
    draw.text((460, 785), "Get Confidential Assignment Help", fill=COLOR_NAVY, font=get_font('impact', 38))
    draw.text((460, 840), "Chat directly with our academic team on WhatsApp.", fill=COLOR_NAVY, font=get_font('helvetica', 21, bold=True))
    draw.ellipse([460, 890, 488, 918], fill=COLOR_EMERALD)
    draw.text((500, 885), "WhatsApp: +91 95098 93638", fill='#000000', font=get_font('helvetica', 28, bold=True))
    
    img.save(output_path, quality=95)
    return output_path

# ==============================================================================
# TEMPLATE 08: Student Assignment Checklist
# ==============================================================================
def render_template_08(student_id=None, content=None, output_path='template_08.png'):
    W, H = 1080, 1080
    img = Image.new('RGB', (W, H), color=COLOR_CREAM)
    draw = ImageDraw.Draw(img)
    
    draw_branding_header(img, draw, x=50, y=40, light_mode=True)
    
    t1 = content.get('title_1', "FINAL SUBMISSION CHECKLIST")[:34] if content else "FINAL SUBMISSION CHECKLIST"
    t2 = content.get('title_2', "Every paper delivered by Academic Wizard meets all 5 standards:")[:62] if content else "Every paper delivered by Academic Wizard meets all 5 standards:"
    draw.text((50, 125), t1, fill=COLOR_NAVY, font=get_font('impact', 54))
    draw.text((50, 190), t2, fill=COLOR_AMBER, font=get_font('helvetica', 22, bold=True))
    
    draw.rounded_rectangle([50, 245, 510, 860], radius=20, fill='#FFFFFF', outline=COLOR_GRAY_BORDER, width=2)
    
    if content and 'items' in content and len(content['items']) >= 5:
        checks = [(itm[1][:22], f"Checklist {itm[0]} verified before delivery") for itm in content['items'][:5]]
    else:
        checks = [
            ("Rubric Deconstruction", "Every learning objective explicitly addressed"),
            ("Peer-Reviewed Sources", "Recent articles from high-impact journals"),
            ("Zero AI & Plagiarism", "100% human prose verified via Turnitin"),
            ("Academic Register", "Critical analysis, synthesis & clear thesis"),
            ("Accurate Referencing", "OSCOLA, Harvard, APA 7th, IEEE or Chicago")
        ]
    
    cy = 275
    for c_title, c_sub in checks:
        draw.rounded_rectangle([80, cy + 5, 120, cy + 45], radius=8, fill='#DCFCE7', outline='#16A34A', width=2)
        draw_vector_check(draw, 100, cy + 25, size=16, color='#16A34A', width=3)
        draw.text((140, cy + 3), c_title, fill=COLOR_NAVY, font=get_font('helvetica', 24, bold=True))
        draw.text((140, cy + 38), c_sub, fill=COLOR_GRAY_TEXT, font=get_font('helvetica', 18))
        cy += 115
        
    student_res = load_student(student_id, target_height=800)
    if student_res:
        student, s_name = student_res
        img.paste(student, (W - student.width - 20, H - 800), student)
        
    draw_whatsapp_badge(draw, x=50, y=910, w=540, h=65, light_mode=True)
    img.save(output_path, quality=95)
    return output_path

# ==============================================================================
# TEMPLATE 09: Minimalist Editorial Magazine Layout
# ==============================================================================
def render_template_09(student_id=None, content=None, output_path='template_09.png'):
    W, H = 1080, 1080
    img = Image.new('RGB', (W, H), color='#FFFFFF')
    draw = ImageDraw.Draw(img)
    
    draw.rectangle([30, 30, W - 30, H - 30], outline=COLOR_NAVY, width=2)
    draw_branding_header(img, draw, x=60, y=50, light_mode=True)
    
    t1 = content.get('title_1', "THE ACADEMIC ADVISOR")[:30] if content else "THE ACADEMIC ADVISOR"
    t2 = content.get('title_2', "SPECIAL REPORT: ESSAY & DISSERTATION MASTERY")[:45] if content else "SPECIAL REPORT: ESSAY & DISSERTATION MASTERY"
    draw.text((60, 140), t1, fill=COLOR_NAVY, font=get_font('serif', 52, bold=True))
    draw.line([60, 210, 520, 210], fill=COLOR_GOLD, width=3)
    draw.text((60, 225), t2, fill=COLOR_AMBER, font=get_font('helvetica', 18, bold=True))
    
    if content and 'items' in content and len(content['items']) >= 4:
        points = [(f"0{i}.", itm[1][:38]) for i, itm in enumerate(content['items'][:4], 1)]
    else:
        points = [
            ("I. Rubric Alignment", "Deconstructing criteria to target mark bands above 70%."),
            ("II. Critical Synthesis", "Moving beyond simple description to deep critical evaluation."),
            ("III. Methodological Rigour", "Sound quantitative and qualitative frameworks."),
            ("IV. Plagiarism Defense", "Complete referencing and bibliography audit.")
        ]
    ey = 280
    for num, desc in points:
        draw.text((60, ey), num, fill=COLOR_NAVY, font=get_font('serif', 26, bold=True))
        draw.text((60, ey + 38), desc, fill=COLOR_GRAY_TEXT, font=get_font('helvetica', 18))
        ey += 105
        
    student_res = load_student(student_id, target_height=840)
    if student_res:
        student, s_name = student_res
        img.paste(student, (W - student.width - 40, H - 840), student)
        
    draw.rounded_rectangle([60, 780, 520, 960], radius=16, fill='#F8FAFC', outline=COLOR_GRAY_BORDER, width=2)
    draw.text((80, 800), "“Quality is never an accident; it is always", fill=COLOR_NAVY, font=get_font('serif', 20, bold=False))
    draw.text((80, 830), "the result of intelligent effort.”", fill=COLOR_NAVY, font=get_font('serif', 20, bold=True))
    draw.text((80, 880), "Consult an Academic Wizard Editor Today:", fill=COLOR_AMBER, font=get_font('helvetica', 16, bold=True))
    draw.text((80, 910), "WhatsApp: +91 95098 93638", fill=COLOR_DEEP_BLUE, font=get_font('helvetica', 22, bold=True))
    
    img.save(output_path, quality=95)
    return output_path

# ==============================================================================
# TEMPLATE 10: FAQ / Student Pain Points Card Stack
# ==============================================================================
def render_template_10(student_id=None, content=None, output_path='template_10.png'):
    W, H = 1080, 1080
    img = Image.new('RGB', (W, H), color=COLOR_CREAM)
    draw = ImageDraw.Draw(img)
    
    draw_branding_header(img, draw, x=50, y=40, light_mode=True)
    
    t1 = content.get('title_1', "FREQUENTLY ASKED")[:24] if content else "FREQUENTLY ASKED"
    t2 = content.get('title_2', "STUDENT QUESTIONS")[:24] if content else "STUDENT QUESTIONS"
    draw.text((500, 120), t1, fill=COLOR_NAVY, font=get_font('impact', 54))
    draw.text((500, 185), t2, fill=COLOR_AMBER, font=get_font('impact', 44))
    
    student_res = load_student(student_id, target_height=825)
    if student_res:
        student, s_name = student_res
        img.paste(student, (10, H - 825), student)
        
    if content and 'items' in content and len(content['items']) >= 3:
        faqs = [
            (f"Q: How do you handle {content['items'][0][1][:18]}?", "A: Deconstructed by subject specialists with zero AI generation and full citations."),
            (f"Q: What about {content['items'][1][1][:18]}?", "A: Adheres strictly to university rubric standards with official Turnitin audit report."),
            (f"Q: Can I get revisions on {content['items'][2][1][:18]}?", "A: Unlimited free revisions until your tutor approves and marks your paper.")
        ]
    else:
        faqs = [
            ("Q: Is my assignment 100% confidential?", "A: Yes. Your personal details and university information are strictly encrypted and never shared."),
            ("Q: Will it pass Turnitin AI detection?", "A: Guaranteed. Every paper is written by human academics from scratch with zero AI tools."),
            ("Q: What if my tutor requests changes?", "A: Free unlimited revisions until your paper is approved and graded.")
        ]
    
    fy = 265
    for q_text, a_text in faqs:
        draw.rounded_rectangle([510, fy, 1030, fy + 160], radius=20, fill='#FFFFFF', outline=COLOR_GRAY_BORDER, width=2)
        draw.text((535, fy + 18), q_text, fill=COLOR_DEEP_BLUE, font=get_font('helvetica', 22, bold=True))
        
        words = a_text.split()
        l1 = " ".join(words[:8])
        l2 = " ".join(words[8:])
        draw.text((535, fy + 65), l1, fill=COLOR_NAVY, font=get_font('helvetica', 19))
        draw.text((535, fy + 98), l2, fill=COLOR_GRAY_TEXT, font=get_font('helvetica', 19))
        fy += 195
        
    draw_whatsapp_badge(draw, x=610, y=915, w=420, h=60, light_mode=True)
    img.save(output_path, quality=95)
    return output_path

# ==============================================================================
# TEMPLATE 11: Top 5 Assignment Mistakes to Avoid (Red Flags)
# ==============================================================================
def render_template_11(student_id=None, content=None, output_path='template_11.png'):
    W, H = 1080, 1080
    img = Image.new('RGB', (W, H), color='#FEF2F2')
    draw = ImageDraw.Draw(img)
    
    draw_branding_header(img, draw, x=50, y=40, light_mode=True)
    
    t1 = content.get('title_1', "5 ESSENTIAL GUIDELINES")[:30] if content else "5 ASSIGNMENT MISTAKES"
    t2 = content.get('title_2', "TO BOOST YOUR GRADE TO A FIRST CLASS")[:45] if content else "THAT LOWER YOUR GRADES TO A 2:2 OR THIRD"
    draw.text((50, 125), t1, fill='#991B1B', font=get_font('impact', 54))
    draw.text((50, 190), t2, fill=COLOR_NAVY, font=get_font('helvetica', 22, bold=True))
    
    if content and 'items' in content and len(content['items']) >= 5:
        mistakes = [(f"{itm[0]} {itm[1][:22]}", "Crucial criteria for high-scoring university submissions.") for itm in content['items'][:5]]
    else:
        mistakes = [
            ("1. Descriptive Writing", "Failing to critically evaluate academic sources"),
            ("2. Outdated Referencing", "Using sources older than 5-10 years"),
            ("3. Ignored Marking Rubric", "Writing well, but not answering the core question"),
            ("4. AI-Generated Fluff", "Submitting flagged AI text that triggers Turnitin"),
            ("5. Poor Structure & Flow", "Lacking cohesive topic sentences and signposting")
        ]
    
    my = 260
    for m_title, m_desc in mistakes:
        draw.rounded_rectangle([50, my, 510, my + 95], radius=16, fill='#FFFFFF', outline='#F87171', width=2)
        draw.text((75, my + 15), m_title, fill='#DC2626', font=get_font('helvetica', 22, bold=True))
        draw.text((75, my + 50), m_desc, fill=COLOR_NAVY, font=get_font('helvetica', 17))
        my += 118
        
    student_res = load_student(student_id, target_height=820)
    if student_res:
        student, s_name = student_res
        img.paste(student, (W - student.width - 20, H - 820), student)
        
    draw_whatsapp_badge(draw, x=50, y=915, w=530, h=60, light_mode=True)
    img.save(output_path, quality=95)
    return output_path

# ==============================================================================
# TEMPLATE 12: Circular Hub & Spoke Services
# ==============================================================================
def render_template_12(student_id=None, content=None, output_path='template_12.png'):
    W, H = 1080, 1080
    img = Image.new('RGB', (W, H), color='#F8FAFC')
    draw = ImageDraw.Draw(img)
    
    draw_branding_header(img, draw, x=50, y=40, light_mode=True)
    
    t1 = content.get('title_1', "COMPREHENSIVE ACADEMIC SUPPORT")[:34] if content else "COMPREHENSIVE ACADEMIC SUPPORT"
    t2 = content.get('title_2', "End-to-end guidance from research proposal to final viva defense")[:65] if content else "End-to-end guidance from research proposal to final viva defense"
    draw.text((50, 125), t1, fill=COLOR_NAVY, font=get_font('impact', 52))
    draw.text((50, 190), t2, fill=COLOR_AMBER, font=get_font('helvetica', 22, bold=True))
    
    if content and 'items' in content and len(content['items']) >= 5:
        colors = ['#3B82F6', '#F59E0B', '#10B981', '#8B5CF6', '#EC4899']
        services = [(itm[1][:22], "Detailed analysis & rigorous academic standards", colors[i]) for i, itm in enumerate(content['items'][:5])]
    else:
        services = [
            ("Dissertation & Thesis", "Full proposals, methodology & data chapters", '#3B82F6'),
            ("Essays & Case Studies", "Argumentative, reflective & comparative analysis", '#F59E0B'),
            ("Literature Reviews", "Systematic reviews, PRISMA & thematic synthesis", '#10B981'),
            ("Proofreading & Editing", "Grammar, academic register & reference audit", '#8B5CF6'),
            ("Statistical Data Analysis", "SPSS, R, Python, NVivo & econometric models", '#EC4899')
        ]
    
    sy = 250
    for s_name, s_detail, s_color in services:
        draw.rounded_rectangle([50, sy, 510, sy + 105], radius=18, fill='#FFFFFF', outline=s_color, width=2)
        draw.ellipse([75, sy + 25, 115, sy + 65], fill=s_color)
        draw_vector_star(draw, 95, sy + 45, r=12, color=COLOR_WHITE)
        
        draw.text((135, sy + 18), s_name, fill=COLOR_NAVY, font=get_font('helvetica', 24, bold=True))
        draw.text((135, sy + 58), s_detail, fill=COLOR_GRAY_TEXT, font=get_font('helvetica', 17))
        sy += 125
        
    student_res = load_student(student_id, target_height=820)
    if student_res:
        student, s_name = student_res
        img.paste(student, (W - student.width - 20, H - 820), student)
        
    draw_whatsapp_badge(draw, x=50, y=915, w=530, h=60, light_mode=True)
    img.save(output_path, quality=95)
    return output_path

# ==============================================================================
# TEMPLATE 13: Dark Mode Tech / High-Performance Infographic
# ==============================================================================
def render_template_13(student_id=None, content=None, output_path='template_13.png'):
    W, H = 1080, 1080
    img = Image.new('RGB', (W, H), color='#090D16')
    draw = ImageDraw.Draw(img)
    
    draw_branding_header(img, draw, x=50, y=40, light_mode=False)
    
    t1 = content.get('title_1', "STEM, CS & DATA ASSIGNMENTS")[:32] if content else "STEM, CS & DATA ASSIGNMENTS"
    t2 = content.get('title_2', "Complex coding, mathematical proofs, and technical reports solved.")[:65] if content else "Complex coding, mathematical proofs, and technical reports solved."
    draw.text((50, 130), t1, fill=COLOR_WHITE, font=get_font('impact', 54))
    draw.text((50, 195), t2, fill='#38BDF8', font=get_font('helvetica', 21, bold=True))
    
    if content and 'items' in content and len(content['items']) >= 4:
        c_items = content['items']
        tech_cards = [
            (c_items[0][1][:20], "Clean code, unit tests & documentation", 50, 260),
            (c_items[1][1][:20], "PyTorch, TensorFlow & data pipelines", 550, 260),
            (c_items[2][1][:20], "SQL, PostgreSQL, MongoDB & schemas", 50, 410),
            (c_items[3][1][:20], "MATLAB, CAD, FEA & control systems", 550, 410)
        ]
    else:
        tech_cards = [
            ("Python, Java & C++", "Clean code, unit tests & documentation", 50, 260),
            ("Machine Learning & AI", "PyTorch, TensorFlow & data pipelines", 550, 260),
            ("Database Architecture", "SQL, PostgreSQL, MongoDB & schemas", 50, 410),
            ("Engineering Reports", "MATLAB, CAD, FEA & control systems", 550, 410)
        ]
    
    for t_title, t_desc, tx, ty in tech_cards:
        draw.rounded_rectangle([tx, ty, tx + 470, ty + 120], radius=16, fill='#111827', outline='#1E293B', width=2)
        draw.text((tx + 30, ty + 25), t_title, fill='#38BDF8', font=get_font('helvetica', 24, bold=True))
        draw.text((tx + 30, ty + 65), t_desc, fill='#94A3B8', font=get_font('helvetica', 18))
        
    student_res = load_student(student_id, target_height=480)
    if student_res:
        student, s_name = student_res
        img.paste(student, (40, H - 480), student)
        
    draw.rounded_rectangle([480, 570, 1030, 960], radius=24, fill='#1E293B', outline='#38BDF8', width=2)
    draw.text((520, 610), "Need Code or Math Help?", fill=COLOR_WHITE, font=get_font('impact', 44))
    draw.text((520, 680), "Our technical team writes bug-free,", fill='#94A3B8', font=get_font('helvetica', 22))
    draw.text((520, 715), "fully commented, executable code.", fill='#94A3B8', font=get_font('helvetica', 22))
    
    draw.rounded_rectangle([520, 790, 990, 880], radius=16, fill='#38BDF8')
    draw.text((550, 818), "WhatsApp: +91 95098 93638", fill='#090D16', font=get_font('helvetica', 26, bold=True))
    draw.text((550, 905), "Fast delivery for pending code deadlines", fill='#38BDF8', font=get_font('helvetica', 18))
    
    img.save(output_path, quality=95)
    return output_path

# ==============================================================================
# TEMPLATE 14: Top 3 Secrets for Distinction Grades
# ==============================================================================
def render_template_14(student_id=None, content=None, output_path='template_14.png'):
    W, H = 1080, 1080
    img = Image.new('RGB', (W, H), color=COLOR_CREAM)
    draw = ImageDraw.Draw(img)
    
    draw_branding_header(img, draw, x=50, y=40, light_mode=True)
    
    t1 = content.get('title_1', "3 CORE PILLARS FOR")[:24] if content else "3 SECRETS TO GET"
    t2 = content.get('title_2', "A 1ST CLASS (70%+)")[:24] if content else "A 1ST CLASS (70%+)"
    draw.text((500, 120), t1, fill=COLOR_NAVY, font=get_font('impact', 54))
    draw.text((500, 185), t2, fill=COLOR_AMBER, font=get_font('impact', 48))
    
    student_res = load_student(student_id, target_height=825)
    if student_res:
        student, s_name = student_res
        img.paste(student, (10, H - 825), student)
        
    if content and 'items' in content and len(content['items']) >= 3:
        secrets = [(f"Pillar 0{i}", itm[1][:22], "Critical application of evidence and theoretical concepts.") for i, itm in enumerate(content['items'][:3], 1)]
    else:
        secrets = [
            ("Secret 01", "Deconstruct the Marking Rubric", "Every paragraph must earn marks from the rubric criteria directly."),
            ("Secret 02", "Synthesise, Never Just Summarise", "Compare author arguments to reveal tensions in current literature."),
            ("Secret 03", "Professional Academic Polish", "Ensure zero typographical, formatting or citation discrepancies.")
        ]
    
    sy = 265
    for s_num, s_title, s_desc in secrets:
        draw.rounded_rectangle([510, sy, 1030, sy + 185], radius=20, fill='#FFFFFF', outline=COLOR_GRAY_BORDER, width=2)
        draw.text((540, sy + 20), s_num, fill=COLOR_GOLD, font=get_font('impact', 32))
        draw.text((540, sy + 65), s_title, fill=COLOR_NAVY, font=get_font('helvetica', 23, bold=True))
        
        words = s_desc.split()
        l1 = " ".join(words[:7])
        l2 = " ".join(words[7:])
        draw.text((540, sy + 105), l1, fill=COLOR_GRAY_TEXT, font=get_font('helvetica', 18))
        draw.text((540, sy + 135), l2, fill=COLOR_GRAY_TEXT, font=get_font('helvetica', 18))
        sy += 210
        
    draw_whatsapp_badge(draw, x=610, y=920, w=420, h=60, light_mode=True)
    img.save(output_path, quality=95)
    return output_path

# ==============================================================================
# TEMPLATE 15: Urgent Deadline / Express 24-Hour Card
# ==============================================================================
def render_template_15(student_id=None, content=None, output_path='template_15.png'):
    W, H = 1080, 1080
    img = Image.new('RGB', (W, H), color='#FFFBEB')
    draw = ImageDraw.Draw(img)
    
    draw_branding_header(img, draw, x=50, y=40, light_mode=True)
    
    t1 = content.get('title_1', "EXPRESS SUBMISSION SERVICE")[:28] if content else "EXPRESS SUBMISSION SERVICE"
    t2 = content.get('title_2', "DUE IN 24 TO 48 HOURS?")[:28] if content else "DUE IN 24 TO 48 HOURS?"
    
    draw.rounded_rectangle([50, 120, 480, 175], radius=12, fill='#DC2626')
    draw.text((70, 132), t1, fill=COLOR_WHITE, font=get_font('helvetica', 24, bold=True))
    
    draw.text((50, 200), t2, fill=COLOR_NAVY, font=get_font('impact', 58))
    draw.text((50, 270), "Don't panic. Our emergency writing team is online 24/7.", fill=COLOR_AMBER, font=get_font('helvetica', 22, bold=True))
    
    if content and 'items' in content and len(content['items']) >= 4:
        blocks = [(itm[1][:22], "Dedicated research sprint and rigorous academic review.") for itm in content['items'][:4]]
    else:
        blocks = [
            ("Fast 12-24h Turnaround", "Dedicated writers sprint on urgent essays and case studies."),
            ("100% Original Turnitin Guarantee", "Zero shortcuts. Comprehensive originality check included."),
            ("All Citation Formats Ready", "Harvard, APA, MLA, Chicago, OSCOLA and IEEE ready."),
            ("Direct WhatsApp Desk", "Instant writer communication with live milestone updates.")
        ]
    
    by = 330
    for b_title, b_sub in blocks:
        draw.rounded_rectangle([50, by, 510, by + 105], radius=16, fill='#FFFFFF', outline='#FCD34D', width=2)
        draw_vector_check(draw, 75, by + 30, size=16, color='#15803D', width=3)
        draw.text((100, by + 18), b_title, fill=COLOR_NAVY, font=get_font('helvetica', 23, bold=True))
        words = b_sub.split()
        l1 = ' '.join(words[:5])
        l2 = ' '.join(words[5:])
        draw.text((75, by + 48), l1, fill=COLOR_GRAY_TEXT, font=get_font('helvetica', 16))
        if l2:
            draw.text((75, by + 70), l2, fill=COLOR_GRAY_TEXT, font=get_font('helvetica', 16))
        by += 128
        
    student_res = load_student(student_id, target_height=820)
    if student_res:
        student, s_name = student_res
        img.paste(student, (W - student.width - 20, H - 820), student)
        
    draw.rounded_rectangle([50, 885, 510, 995], radius=20, fill='#DC2626')
    draw.text((80, 908), "START YOUR EMERGENCY ORDER", fill=COLOR_WHITE, font=get_font('impact', 32))
    draw.ellipse([80, 955, 104, 979], fill='#FEF08A')
    draw.text((115, 948), "WhatsApp: +91 95098 93638", fill='#FEF08A', font=get_font('helvetica', 24, bold=True))
    
    img.save(output_path, quality=95)
    return output_path

TEMPLATES = [
    render_template_01,
    render_template_02,
    render_template_03,
    render_template_04,
    render_template_05,
    render_template_06,
    render_template_07,
    render_template_08,
    render_template_09,
    render_template_10,
    render_template_11,
    render_template_12,
    render_template_13,
    render_template_14,
    render_template_15
]

def generate_random_infographic(template_id=None, student_id=None, content=None, output_path=None):
    if template_id is None:
        t_idx = random.randint(1, 15)
    else:
        t_idx = max(1, min(15, int(template_id)))
        
    if student_id is None:
        s_idx = random.randint(1, 20)
    else:
        s_idx = max(1, min(20, int(student_id)))
        
    if output_path is None:
        output_path = f"infographic_t{t_idx:02d}_s{s_idx:02d}.png"
        
    render_fn = TEMPLATES[t_idx - 1]
    res_path = render_fn(student_id=s_idx, content=content, output_path=output_path)
    
    return {
        "output_path": res_path,
        "template_id": t_idx,
        "student_id": s_idx
    }

if __name__ == "__main__":
    print("Infographic engine initialized.")
