"""
Single Image Master Infographic Engine for Academic Wizard
Consolidates complete educational and commercial post blueprints into 1 high-resolution (1080x1350) image:
- Top Header: Official Logo + Category Pill + Hook Headline + Sub-hook
- Section 1: The Diagnostic Split (54% Common Trap vs 78% First-Class Fix)
- Section 2: The Core Methodology / Framework (3-4 Step Sequential Architecture)
- Section 3: Pre-Submission Rubric Checklist (Vector checkmarks)
- Bottom Footer: High-Converting WhatsApp CTA + Trust Badges + Comment-to-DM Trigger
"""

import sys
from pathlib import Path
from typing import Dict, Any, Optional, List
from PIL import Image, ImageDraw, ImageFont

# Path setups
SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent
PUBLIC_SOCIAL_DIR = PROJECT_ROOT / "public" / "social"
PUBLIC_SOCIAL_DIR.mkdir(parents=True, exist_ok=True)
LOGO_PATH = PROJECT_ROOT / "public" / "academic-wizard-logo-nav.webp"

# Color Palette (Dark Academic Luxury)
COLOR_BG_DARK = (15, 23, 42)        # Deep Navy / Slate 900
COLOR_CARD_DARK = (24, 34, 58)      # Elevated Dark Card Slate 800
COLOR_BORDER_SUBTLE = (38, 52, 84)  # Border subtle Slate 700
COLOR_WHITE = (255, 255, 255)
COLOR_MUTED = (160, 174, 192)
COLOR_GOLD = (245, 166, 35)         # Academic Wizard Gold
COLOR_GOLD_BG = (45, 34, 18)        # Gold tinted card
COLOR_EMERALD = (16, 185, 129)      # 78% First-Class Green
COLOR_EMERALD_BG = (14, 42, 33)     # Emerald tinted card
COLOR_ROSE = (239, 68, 68)          # 54% Trap Red
COLOR_ROSE_BG = (45, 20, 24)        # Rose tinted card
COLOR_CYAN = (6, 182, 212)

def get_system_font(size: int, bold: bool = False) -> ImageFont.ImageFont:
    """Load robust system fonts across macOS and Linux."""
    candidates = []
    if bold:
        candidates = [
            "/System/Library/Fonts/SFPro-Bold.ttf",
            "/System/Library/Fonts/SFNS-Bold.ttf",
            "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
            "/System/Library/Fonts/Helvetica.ttc",
            "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        ]
    else:
        candidates = [
            "/System/Library/Fonts/SFPro-Regular.ttf",
            "/System/Library/Fonts/SFNS.ttf",
            "/System/Library/Fonts/Supplemental/Arial.ttf",
            "/System/Library/Fonts/Helvetica.ttc",
            "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        ]
    for path in candidates:
        if Path(path).exists():
            try:
                return ImageFont.truetype(path, size)
            except Exception:
                continue
    return ImageFont.load_default()

def wrap_text(draw: ImageDraw.Draw, text: str, font: ImageFont.ImageFont, max_width: int) -> List[str]:
    """Wrap text to fit within a specified pixel width."""
    if not text:
        return []
    words = text.split()
    lines = []
    current_line = []
    for word in words:
        current_line.append(word)
        line_str = " ".join(current_line)
        bbox = draw.textbbox((0, 0), line_str, font=font)
        if (bbox[2] - bbox[0]) > max_width:
            if len(current_line) == 1:
                lines.append(current_line.pop())
            else:
                current_line.pop()
                lines.append(" ".join(current_line))
                current_line = [word]
    if current_line:
        lines.append(" ".join(current_line))
    return lines

def draw_vector_check(draw: ImageDraw.Draw, cx: int, cy: int, size: int = 12, color: tuple = COLOR_EMERALD, width: int = 3):
    """Draw a crisp, anti-aliased vector checkmark."""
    x1, y1 = cx - size // 2, cy
    x2, y2 = cx - size // 6, cy + size // 2
    x3, y3 = cx + size // 2, cy - size // 2
    draw.line([(x1, y1), (x2, y2)], fill=color, width=width)
    draw.line([(x2, y2), (x3, y3)], fill=color, width=width)

def draw_vector_cross(draw: ImageDraw.Draw, cx: int, cy: int, size: int = 12, color: tuple = COLOR_ROSE, width: int = 3):
    """Draw a crisp, anti-aliased vector cross/X."""
    s = size // 2
    draw.line([(cx - s, cy - s), (cx + s, cy + s)], fill=color, width=width)
    draw.line([(cx - s, cy + s), (cx + s, cy - s)], fill=color, width=width)

def get_cropped_logo(target_height: int = 40) -> Optional[Image.Image]:
    """Crop and resize official Academic Wizard logo."""
    if not LOGO_PATH.exists():
        return None
    try:
        logo = Image.open(LOGO_PATH).convert("RGBA")
        bbox = logo.getbbox()
        if bbox:
            logo = logo.crop(bbox)
        aspect = logo.width / max(1, logo.height)
        new_w = int(target_height * aspect)
        return logo.resize((new_w, target_height), Image.Resampling.LANCZOS)
    except Exception:
        return None

def render_single_image_master_post(recipe: Dict[str, Any], output_path: Path) -> Path:
    """
    Renders 1 master single-image post (1080x1350 px, 4:5 vertical) fitting complete data:
    1. Header: Logo, Category Badge, Main Hook, Sub-hook
    2. Section 1: 54% Descriptive Trap vs 78% First-Class Rewrite
    3. Section 2: The Core Methodology / Framework (Steps 1-4)
    4. Section 3: Pre-Submission Rubric Checklist
    5. Section 4: WhatsApp CTA Helpline + Trust Badges + Comment-to-DM Trigger
    """
    WIDTH, HEIGHT = 1080, 1350
    img = Image.new("RGBA", (WIDTH, HEIGHT), COLOR_BG_DARK)
    draw = ImageDraw.Draw(img)

    # 1. Subtle Background Depth Gradient & Glow
    for y in range(HEIGHT):
        ratio = y / HEIGHT
        r = int(COLOR_BG_DARK[0] * (1 - ratio * 0.15))
        g = int(COLOR_BG_DARK[1] * (1 - ratio * 0.15))
        b = int(COLOR_BG_DARK[2] * (1 + ratio * 0.10))
        draw.line([(0, y), (WIDTH, y)], fill=(r, g, b))

    # Ambient glow orb at top-right
    for rad in range(350, 0, -10):
        alpha = int(8 * (rad / 350))
        draw.ellipse([800 - rad, 100 - rad, 800 + rad, 100 + rad], fill=(245, 166, 35, alpha))

    # --- TOP HEADER (y: 35 to 210) ---
    logo = get_cropped_logo(target_height=42)
    if logo:
        img.paste(logo, (50, 38), logo)
    else:
        font_brand = get_system_font(26, bold=True)
        draw.text((50, 42), "ACADEMIC WIZARD", fill=COLOR_WHITE, font=font_brand)

    # Badge Pill (Top Right)
    badge_text = recipe.get("badge", "ACADEMIC WEAPON BLUEPRINT").upper()
    font_badge = get_system_font(13, bold=True)
    badge_bbox = draw.textbbox((0, 0), badge_text, font=font_badge)
    badge_w = badge_bbox[2] - badge_bbox[0] + 28
    badge_x = WIDTH - 50 - badge_w
    draw.rounded_rectangle([badge_x, 38, badge_x + badge_w, 76], radius=8, fill=COLOR_GOLD)
    draw.text((badge_x + 14, 46), badge_text, fill=(15, 23, 42), font=font_badge)

    # Hook Headline
    headline = recipe.get("hook_headline", recipe.get("topic", "Mastering Academic Writing"))
    font_hook = get_system_font(34, bold=True)
    hook_lines = wrap_text(draw, headline, font_hook, 980)
    hook_y = 100
    for line in hook_lines[:2]:
        draw.text((50, hook_y), line, fill=COLOR_WHITE, font=font_hook)
        hook_y += 42

    # Sub-hook (1 line)
    sub_text = recipe.get("hook_sub", "The exact distinction methodology university professors grade by.")
    font_sub = get_system_font(18, bold=False)
    sub_lines = wrap_text(draw, sub_text, font_sub, 980)
    if sub_lines:
        draw.text((50, hook_y + 4), sub_lines[0], fill=COLOR_MUTED, font=font_sub)

    # --- SECTION 1: THE DIAGNOSTIC SPLIT (y: 220 to 510) ---
    split_y = 215
    split_h = 285
    card_w = 475
    gutter = 30
    left_x = 50
    right_x = left_x + card_w + gutter

    comparison = recipe.get("comparison", {})
    trap_title = comparison.get("trap_title", "THE 54% COMMON TRAP")
    trap_text = comparison.get("trap_text", "Merely summarizing what the authors stated without identifying methodological constraints or theoretical tensions.")
    fix_title = comparison.get("fix_title", "THE 78%+ FIRST-CLASS FIX")
    fix_text = comparison.get("fix_text", "Critiquing the methodological sample, evaluating theoretical limitations, and delivering a reasoned academic verdict.")

    # Left Card: Red Descriptive Trap
    draw.rounded_rectangle([left_x, split_y, left_x + card_w, split_y + split_h], radius=16, fill=COLOR_ROSE_BG, outline=COLOR_ROSE, width=2)
    # Header bar
    draw_vector_cross(draw, left_x + 28, split_y + 32, size=16, color=COLOR_ROSE, width=3)
    font_card_head = get_system_font(16, bold=True)
    draw.text((left_x + 50, split_y + 24), trap_title, fill=COLOR_ROSE, font=font_card_head)
    # Trap body text
    font_card_body = get_system_font(16, bold=False)
    trap_lines = wrap_text(draw, trap_text, font_card_body, card_w - 44)
    text_y = split_y + 68
    for line in trap_lines[:6]:
        draw.text((left_x + 22, text_y), line, fill=(240, 200, 205), font=font_card_body)
        text_y += 28

    # Right Card: Green Distinction Fix
    draw.rounded_rectangle([right_x, split_y, right_x + card_w, split_y + split_h], radius=16, fill=COLOR_EMERALD_BG, outline=COLOR_EMERALD, width=2)
    # Header bar
    draw_vector_check(draw, right_x + 28, split_y + 32, size=16, color=COLOR_EMERALD, width=3)
    draw.text((right_x + 50, split_y + 24), fix_title, fill=COLOR_EMERALD, font=font_card_head)
    # Fix body text
    fix_lines = wrap_text(draw, fix_text, font_card_body, card_w - 44)
    text_y = split_y + 68
    for line in fix_lines[:6]:
        draw.text((right_x + 22, text_y), line, fill=(210, 245, 230), font=font_card_body)
        text_y += 28

    # --- SECTION 2: THE CORE METHODOLOGY / FRAMEWORK (y: 520 to 890) ---
    fw_y = 520
    fw_h = 365
    draw.rounded_rectangle([50, fw_y, WIDTH - 50, fw_y + fw_h], radius=18, fill=COLOR_CARD_DARK, outline=COLOR_BORDER_SUBTLE, width=2)

    formula = recipe.get("formula", {})
    fw_title = formula.get("title", f"The Step-by-Step {recipe.get('topic', 'Academic')} Framework").upper()
    font_section_title = get_system_font(16, bold=True)
    # Section icon badge
    draw.rounded_rectangle([72, fw_y + 20, 240, fw_y + 50], radius=8, fill=(35, 48, 80))
    draw.text((86, fw_y + 26), "CORE METHODOLOGY", fill=COLOR_GOLD, font=get_system_font(12, bold=True))
    draw.text((255, fw_y + 25), fw_title, fill=COLOR_WHITE, font=font_section_title)

    steps = formula.get("steps", [
        {"num": "01", "label": "Deconstruct", "desc": "Dissect the assignment prompt and pinpoint exact learning outcomes."},
        {"num": "02", "label": "Theorize", "desc": "Ground your argument in peer-reviewed academic literature."},
        {"num": "03", "label": "Synthesize", "desc": "Weave competing viewpoints into a coherent, authoritative position."},
        {"num": "04", "label": "Justify", "desc": "Defend your conclusion with empirical evidence and clear citations."}
    ])

    step_w = (980 - (len(steps) - 1) * 16) // len(steps) if steps else 230
    for idx, step in enumerate(steps[:4]):
        sx = 68 + idx * (step_w + 16)
        sy = fw_y + 70
        sh = 205
        # Inner step card
        draw.rounded_rectangle([sx, sy, sx + step_w, sy + sh], radius=12, fill=(18, 26, 46), outline=(32, 44, 72), width=1)
        # Step number badge
        draw.rounded_rectangle([sx + 14, sy + 14, sx + 52, sy + 44], radius=6, fill=COLOR_GOLD)
        draw.text((sx + 20, sy + 18), step.get("num", f"0{idx+1}"), fill=(15, 23, 42), font=get_system_font(14, bold=True))
        # Step label
        font_slabel = get_system_font(16, bold=True)
        draw.text((sx + 60, sy + 20), step.get("label", f"Step {idx+1}"), fill=COLOR_WHITE, font=font_slabel)
        # Step description
        font_sdesc = get_system_font(14, bold=False)
        desc_lines = wrap_text(draw, step.get("desc", ""), font_sdesc, step_w - 28)
        dy = sy + 62
        for line in desc_lines[:5]:
            draw.text((sx + 14, dy), line, fill=COLOR_MUTED, font=font_sdesc)
            dy += 22

    # Exemplar Strip inside framework card
    exemplar = formula.get("exemplar", "Model: 'While Smith (2020) argues X, their qualitative sample (n=18) overlooks institutional barriers...'")
    ey = fw_y + 295
    draw.rounded_rectangle([68, ey, WIDTH - 68, ey + 54], radius=10, fill=(28, 38, 64), outline=(48, 64, 100), width=1)
    draw.text((84, ey + 8), "PRO EXEMPLAR:", fill=COLOR_CYAN, font=get_system_font(12, bold=True))
    font_ex = get_system_font(14, bold=False)
    ex_lines = wrap_text(draw, exemplar, font_ex, 800)
    if ex_lines:
        draw.text((195, ey + 8), ex_lines[0], fill=COLOR_WHITE, font=font_ex)
    if len(ex_lines) > 1:
        draw.text((84, ey + 28), ex_lines[1], fill=COLOR_WHITE, font=font_ex)

    # --- SECTION 3: PRE-SUBMISSION CHECKLIST (y: 900 to 1100) ---
    cl_y = 905
    cl_h = 195
    draw.rounded_rectangle([50, cl_y, WIDTH - 50, cl_y + cl_h], radius=16, fill=COLOR_CARD_DARK, outline=COLOR_BORDER_SUBTLE, width=2)
    
    # Checklist Title
    draw.text((75, cl_y + 18), "PRE-SUBMISSION RUBRIC CHECKLIST", fill=COLOR_GOLD, font=get_system_font(15, bold=True))
    draw.text((400, cl_y + 19), "(Verify all 3 before final submission)", fill=COLOR_MUTED, font=get_system_font(13, bold=False))

    checklist_items = recipe.get("checklist", [
        "Every factual claim is backed by peer-reviewed evidence (2019-2026).",
        "Direct quotes represent less than 5% of overall word count.",
        "Methodological critique applied to every cited empirical study."
    ])

    cy = cl_y + 55
    for item in checklist_items[:3]:
        draw_vector_check(draw, 88, cy + 12, size=14, color=COLOR_EMERALD, width=3)
        font_chk = get_system_font(16, bold=False)
        item_lines = wrap_text(draw, item, font_chk, 890)
        draw.text((115, cy + 2), item_lines[0] if item_lines else item, fill=COLOR_WHITE, font=font_chk)
        cy += 42

    # --- SECTION 4: HIGH-CONVERTING BOTTOM FOOTER (y: 1115 to 1320) ---
    foot_y = 1120
    foot_h = 195
    draw.rounded_rectangle([50, foot_y, WIDTH - 50, foot_y + foot_h], radius=18, fill=COLOR_GOLD_BG, outline=COLOR_GOLD, width=2)

    # Trust Badges (Row 1)
    tbadges = ["🛡️ Turnitin 0% AI Guarantee", "🎓 Oxbridge & Ivy League Mentors", "🔒 100% Confidential", "⚡ 12-Hour Urgent Turnaround"]
    bx = 75
    font_tbadge = get_system_font(13, bold=True)
    for b in tbadges:
        draw.text((bx, foot_y + 18), b, fill=COLOR_GOLD, font=font_tbadge)
        bx += 230

    # WhatsApp Lead Action Banner (Row 2)
    draw.rounded_rectangle([70, foot_y + 50, WIDTH - 70, foot_y + 125], radius=12, fill=(16, 185, 129))
    draw.text((95, foot_y + 64), "💬 NEED EXPERT HELP OR A 1-ON-1 REVIEW?", fill=(15, 23, 42), font=get_system_font(18, bold=True))
    draw.text((95, foot_y + 92), "WhatsApp: +91 95098 93638  |  Direct Consultation 24/7", fill=(15, 23, 42), font=get_system_font(15, bold=False))
    
    # "BOOK NOW" button inside banner
    draw.rounded_rectangle([WIDTH - 240, foot_y + 62, WIDTH - 90, foot_y + 112], radius=8, fill=(15, 23, 42))
    draw.text((WIDTH - 215, foot_y + 76), "CHAT NOW →", fill=COLOR_WHITE, font=get_system_font(14, bold=True))

    # Row 3: Comment-to-DM Trigger & Website
    comment_kw = recipe.get("comment_kw", "BLUEPRINT").upper()
    draw.text((75, foot_y + 148), f"📥 Comment \"{comment_kw}\" to get this full 1-page PDF cheatsheet sent to your DMs", fill=COLOR_WHITE, font=get_system_font(14, bold=True))
    draw.text((WIDTH - 280, foot_y + 148), "academicwizard.online", fill=COLOR_MUTED, font=get_system_font(14, bold=False))

    # Final Save
    img.convert("RGB").save(str(output_path), quality=95)
    return output_path
