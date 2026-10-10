"""
Dynamic Multi-Scene 9:16 Video Reel Renderer for Academic Wizard
Renders a complete, professional MP4 video reel with:
- Multi-scene dynamic visual story (Hook -> Diagnostic Trap vs Fix -> Framework Blueprint -> Outro CTA)
- Subtle cinematic camera motion (Ken Burns zoompan) on each scene
- Spoken British academic mentor neural voiceover (offline high-res via macOS Daniel / fallback)
- Lo-fi study background beat mixing
- High quality H.264 / AAC 1080x1920 vertical format for Instagram Reels, TikTok & Shorts
"""

import os
import sys
import subprocess
from pathlib import Path
from typing import Dict, Any, List, Optional
from PIL import Image, ImageDraw, ImageFont
import imageio_ffmpeg

SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent
PUBLIC_SOCIAL_DIR = PROJECT_ROOT / "public" / "social"
PUBLIC_SOCIAL_DIR.mkdir(parents=True, exist_ok=True)
LOGO_PATH = PROJECT_ROOT / "public" / "academic-wizard-logo-nav.webp"
STUDENTS_DIR = SCRIPT_DIR / "students_cutouts"
LOFI_DIR = SCRIPT_DIR / "lofi_beats"

FFMPEG_EXE = imageio_ffmpeg.get_ffmpeg_exe()

# Palettes
BG_DARK = (15, 23, 42)
CARD_DARK = (24, 34, 58)
BORDER_SUBTLE = (38, 52, 84)
WHITE = (255, 255, 255)
MUTED = (160, 174, 192)
GOLD = (245, 166, 35)
EMERALD = (16, 185, 129)
ROSE = (239, 68, 68)
CYAN = (6, 182, 212)

def get_font(size: int, bold: bool = False) -> ImageFont.ImageFont:
    candidates = []
    if bold:
        candidates = [
            "/System/Library/Fonts/SFPro-Bold.ttf",
            "/System/Library/Fonts/SFNS-Bold.ttf",
            "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
            "/System/Library/Fonts/Helvetica.ttc",
        ]
    else:
        candidates = [
            "/System/Library/Fonts/SFPro-Regular.ttf",
            "/System/Library/Fonts/SFNS.ttf",
            "/System/Library/Fonts/Supplemental/Arial.ttf",
            "/System/Library/Fonts/Helvetica.ttc",
        ]
    for p in candidates:
        if Path(p).exists():
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                pass
    return ImageFont.load_default()

def wrap_text(draw: ImageDraw.Draw, text: str, font: ImageFont.ImageFont, max_width: int) -> List[str]:
    if not text:
        return []
    words = text.split()
    lines, curr = [], []
    for w in words:
        curr.append(w)
        bbox = draw.textbbox((0, 0), " ".join(curr), font=font)
        if (bbox[2] - bbox[0]) > max_width:
            if len(curr) == 1:
                lines.append(curr.pop())
            else:
                curr.pop()
                lines.append(" ".join(curr))
                curr = [w]
    if curr:
        lines.append(" ".join(curr))
    return lines

def get_cropped_logo(target_height: int = 50) -> Optional[Image.Image]:
    if not LOGO_PATH.exists():
        return None
    try:
        logo = Image.open(LOGO_PATH).convert("RGBA")
        bbox = logo.getbbox()
        if bbox:
            logo = logo.crop(bbox)
        aspect = logo.width / max(1, logo.height)
        return logo.resize((int(target_height * aspect), target_height), Image.Resampling.LANCZOS)
    except Exception:
        return None

def load_student_model(student_id: int = 3, target_h: int = 800) -> Optional[Image.Image]:
    p = STUDENTS_DIR / f"student_{student_id:02d}.png"
    if not p.exists():
        # Fallback to any available student
        files = list(STUDENTS_DIR.glob("*.png"))
        if not files:
            return None
        p = files[0]
    try:
        img = Image.open(p).convert("RGBA")
        aspect = img.width / max(1, img.height)
        return img.resize((int(target_h * aspect), target_h), Image.Resampling.LANCZOS)
    except Exception:
        return None

def render_scene_1_hook(recipe: Dict[str, Any], output_path: Path):
    """Scene 1: The Hook (0 - 5.5s) - Dark Obsidian Studio with Canvas 54% Grade Alert."""
    W, H = 1080, 1920
    img = Image.new("RGBA", (W, H), BG_DARK)
    draw = ImageDraw.Draw(img)

    # Ambient Glow
    for rad in range(500, 0, -20):
        draw.ellipse([540 - rad, 450 - rad, 540 + rad, 450 + rad], fill=(245, 166, 35, int(10 * (rad / 500))))

    # Top Brand Bar
    logo = get_cropped_logo(50)
    if logo:
        img.paste(logo, (60, 150), logo)

    draw.rounded_rectangle([W - 320, 150, W - 60, 200], radius=10, fill=GOLD)
    draw.text((W - 300, 162), "ACADEMIC WEAPON", fill=BG_DARK, font=get_font(18, bold=True))

    # Canvas Grade Alert Pill
    draw.rounded_rectangle([60, 260, W - 60, 360], radius=20, fill=(45, 20, 24), outline=ROSE, width=3)
    draw.text((100, 285), "⚠️  CANVAS GRADE ALERT: 54% CAP", fill=ROSE, font=get_font(24, bold=True))
    draw.text((100, 320), "Tutor Feedback: 'Reads like a descriptive summary. Lacks critical depth.'", fill=(240, 200, 205), font=get_font(18))

    # Hook Headline
    headline = recipe.get("hook_headline", "10 Critical Analysis Sentence Starters")
    font_head = get_font(48, bold=True)
    lines = wrap_text(draw, headline, font_head, 960)
    hy = 420
    for l in lines:
        draw.text((60, hy), l, fill=WHITE, font=font_head)
        hy += 62

    sub = recipe.get("hook_sub", "Stop writing 'This shows that...'. Use these exact sentence frames to hit 78%+.")
    font_sub = get_font(24)
    sub_lines = wrap_text(draw, sub, font_sub, 960)
    for l in sub_lines:
        draw.text((60, hy + 15), l, fill=MUTED, font=font_sub)
        hy += 34

    # Student Cutout
    student = load_student_model(student_id=3, target_h=900)
    if student:
        # Paste student on lower right with soft fade
        img.paste(student, (W - student.width + 50, H - student.height + 20), student)

    # Lower Left floating card
    draw.rounded_rectangle([60, H - 420, 560, H - 240], radius=18, fill=(24, 34, 58, 240), outline=GOLD, width=2)
    draw.text((85, H - 395), "💡 THE PROFESSOR'S SECRET", fill=GOLD, font=get_font(18, bold=True))
    draw.text((85, H - 355), "Tutors reward critique of methodology,", fill=WHITE, font=get_font(18))
    draw.text((85, H - 325), "not re-explaining the study's facts.", fill=WHITE, font=get_font(18))

    # Bottom Safety Warning
    draw.text((60, H - 180), "SWIPE OR WATCH TILL END FOR FULL SCRIPT ⤵", fill=MUTED, font=get_font(16, bold=True))

    img.convert("RGB").save(str(output_path), quality=95)

def render_scene_2_trap_vs_fix(recipe: Dict[str, Any], output_path: Path):
    """Scene 2: Diagnostic Trap vs First-Class Fix (5.5 - 14.5s)."""
    W, H = 1080, 1920
    img = Image.new("RGBA", (W, H), BG_DARK)
    draw = ImageDraw.Draw(img)

    # Header
    logo = get_cropped_logo(45)
    if logo:
        img.paste(logo, (60, 140), logo)
    draw.text((W - 350, 145), "DIAGNOSTIC AUDIT", fill=CYAN, font=get_font(20, bold=True))

    draw.text((60, 230), "THE DIFFERENCE BETWEEN 54% AND 78%", fill=WHITE, font=get_font(38, bold=True))
    draw.text((60, 285), "Look at what happens when you rewrite basic summary into critique:", fill=MUTED, font=get_font(22))

    comparison = recipe.get("comparison", {})
    trap_text = comparison.get("trap_text", "Smith (2021) asserts that variables are correlated. Jones (2022) also agrees. This proves that the intervention works.")
    fix_text = comparison.get("fix_text", "Whilst Smith (2021) attributes outcomes to environmental factors, their qualitative sample (n=18) overlooks institutional constraints.")

    # Top Card: Red Trap (54%)
    draw.rounded_rectangle([60, 360, W - 60, 840], radius=24, fill=(45, 20, 24), outline=ROSE, width=3)
    draw.rounded_rectangle([90, 395, 340, 445], radius=10, fill=ROSE)
    draw.text((110, 408), "❌  THE 54% TRAP", fill=WHITE, font=get_font(20, bold=True))
    draw.text((370, 410), "Mere Summary / Descriptive", fill=(240, 180, 185), font=get_font(18))

    font_body = get_font(24)
    tlines = wrap_text(draw, f'"{trap_text}"', font_body, 880)
    ty = 485
    for l in tlines:
        draw.text((100, ty), l, fill=(255, 210, 215), font=font_body)
        ty += 38

    # Red diagnostic callout
    draw.rounded_rectangle([90, 720, W - 90, 805], radius=12, fill=(30, 12, 16))
    draw.text((115, 735), "⚠️ Penalty Reason: States facts without evaluating validity or bias.", fill=ROSE, font=get_font(18, bold=True))
    draw.text((115, 765), "Grade impact: Capped at Lower Second (2:2).", fill=WHITE, font=get_font(16))

    # Bottom Card: Green First-Class Fix (78%+)
    draw.rounded_rectangle([60, 880, W - 60, 1420], radius=24, fill=(14, 42, 33), outline=EMERALD, width=3)
    draw.rounded_rectangle([90, 915, 360, 965], radius=10, fill=EMERALD)
    draw.text((110, 928), "✓  THE 78% REWRITE", fill=BG_DARK, font=get_font(20, bold=True))
    draw.text((390, 930), "Critical Synthesis / High Distinction", fill=(180, 245, 215), font=get_font(18))

    flines = wrap_text(draw, f'"{fix_text}"', font_body, 880)
    fy = 1010
    for l in flines:
        draw.text((100, fy), l, fill=(220, 255, 235), font=font_body)
        fy += 38

    # Green distinction callout
    draw.rounded_rectangle([90, 1290, W - 90, 1385], radius=12, fill=(8, 28, 22))
    draw.text((115, 1310), "🌟 Distinction Factor: Identifies sample size constraint (n=18).", fill=EMERALD, font=get_font(18, bold=True))
    draw.text((115, 1342), "Demonstrates independent doctoral-level analysis.", fill=WHITE, font=get_font(16))

    # Bottom bar
    draw.rounded_rectangle([60, 1470, W - 60, 1600], radius=16, fill=CARD_DARK, outline=BORDER_SUBTLE, width=2)
    draw.text((100, 1500), "Formula: [Acknowledge] + [Critique Methodology] + [State Limitation]", fill=GOLD, font=get_font(20, bold=True))
    draw.text((100, 1540), "Next slide: The exact 3-step formula you can follow.", fill=MUTED, font=get_font(18))

    img.convert("RGB").save(str(output_path), quality=95)

def render_scene_3_framework(recipe: Dict[str, Any], output_path: Path):
    """Scene 3: The Actionable Framework Blueprint (14.5 - 23.5s)."""
    W, H = 1080, 1920
    img = Image.new("RGBA", (W, H), BG_DARK)
    draw = ImageDraw.Draw(img)

    # Header
    logo = get_cropped_logo(45)
    if logo:
        img.paste(logo, (60, 140), logo)
    draw.text((W - 320, 145), "THE 3-STEP SYSTEM", fill=GOLD, font=get_font(20, bold=True))

    draw.text((60, 230), "THE FIRST-CLASS ANALYSIS FORMULA", fill=WHITE, font=get_font(38, bold=True))
    draw.text((60, 285), "Follow this exact sequence in every analytical body paragraph:", fill=MUTED, font=get_font(22))

    formula = recipe.get("formula", {})
    steps = formula.get("steps", [
        {"num": "01", "label": "IDENTIFY", "desc": "Pinpoint the author's core premise and foundational claim."},
        {"num": "02", "label": "CRITIQUE", "desc": "Scrutinize methodology, sample cohort (n), or theoretical assumptions."},
        {"num": "03", "label": "SYNTHESIZE", "desc": "Deliver your own justified academic synthesis answering the prompt."}
    ])

    sy = 360
    card_colors = [(245, 166, 35), (6, 182, 212), (16, 185, 129)]
    for idx, step in enumerate(steps[:3]):
        col = card_colors[idx % len(card_colors)]
        draw.rounded_rectangle([60, sy, W - 60, sy + 250], radius=20, fill=CARD_DARK, outline=col, width=2)
        
        # Step number badge
        draw.rounded_rectangle([90, sy + 30, 170, sy + 90], radius=12, fill=col)
        draw.text((108, sy + 42), step.get("num", f"0{idx+1}"), fill=BG_DARK, font=get_font(28, bold=True))

        # Step Title
        draw.text((195, sy + 42), step.get("label", f"STEP {idx+1}"), fill=WHITE, font=get_font(30, bold=True))

        # Description
        font_d = get_font(22)
        dlines = wrap_text(draw, step.get("desc", ""), font_d, 850)
        dy = sy + 115
        for l in dlines:
            draw.text((100, dy), l, fill=MUTED, font=font_d)
            dy += 32

        sy += 280

    # Pro Exemplar Card
    draw.rounded_rectangle([60, 1230, W - 60, 1530], radius=22, fill=(28, 38, 64), outline=CYAN, width=2)
    draw.rounded_rectangle([90, 1260, 320, 1305], radius=10, fill=CYAN)
    draw.text((110, 1272), "PRO EXEMPLAR STEM", fill=BG_DARK, font=get_font(18, bold=True))

    ex_text = recipe.get("comparison", {}).get("fix_text", "Whilst Smith (2021) attributes outcomes to environmental factors, their qualitative sample (n=18) overlooks institutional constraints.")
    font_ex = get_font(22)
    ex_lines = wrap_text(draw, f'"{ex_text}"', font_ex, 880)
    ey = 1335
    for l in ex_lines:
        draw.text((100, ey), l, fill=WHITE, font=font_ex)
        ey += 34

    # Bottom indicator
    draw.text((60, 1580), "SCREENSHOT THIS CARD FOR YOUR ESSAY DRAFT 📸", fill=GOLD, font=get_font(20, bold=True))

    img.convert("RGB").save(str(output_path), quality=95)

def render_scene_4_outro_cta(recipe: Dict[str, Any], output_path: Path):
    """Scene 4: Distinction Checklist & Lead Capture Outro (23.5 - 30.0s)."""
    W, H = 1080, 1920
    img = Image.new("RGBA", (W, H), BG_DARK)
    draw = ImageDraw.Draw(img)

    # Center Brand Header
    logo = get_cropped_logo(70)
    if logo:
        img.paste(logo, ((W - logo.width) // 2, 160), logo)
    else:
        draw.text((320, 170), "ACADEMIC WIZARD", fill=WHITE, font=get_font(36, bold=True))

    draw.text((160, 270), "GRADE PROTECTION GUARANTEE", fill=GOLD, font=get_font(24, bold=True))

    # Pre-submission checklist card
    draw.rounded_rectangle([60, 350, W - 60, 830], radius=24, fill=CARD_DARK, outline=BORDER_SUBTLE, width=2)
    draw.text((100, 390), "BEFORE YOU HIT SUBMIT, VERIFY:", fill=WHITE, font=get_font(28, bold=True))

    checklist = recipe.get("checklist", [
        "Used analytical verbs (e.g., contradicts, illuminates, substantiates).",
        "Avoided mere chronological summary of empirical facts.",
        "Turnitin similarity confirmed under 5% with non-repository scan."
    ])

    cy = 470
    for item in checklist[:3]:
        # Green check circle
        draw.ellipse([100, cy, 140, cy + 40], fill=EMERALD)
        # Vector checkmark
        draw.line([(112, cy + 20), (118, cy + 28)], fill=BG_DARK, width=3)
        draw.line([(118, cy + 28), (132, cy + 12)], fill=BG_DARK, width=3)
        
        font_c = get_font(22)
        clines = wrap_text(draw, item, font_c, 780)
        iy = cy + 4
        for l in clines:
            draw.text((165, iy), l, fill=WHITE, font=font_c)
            iy += 30
        cy += 115

    # Direct Lead Generation Hero Card
    draw.rounded_rectangle([60, 880, W - 60, 1480], radius=26, fill=(16, 185, 129), outline=WHITE, width=2)
    draw.text((100, 930), "NEED YOUR DRAFT PROFESSIONALLY REVIEWED?", fill=BG_DARK, font=get_font(32, bold=True))
    draw.text((100, 980), "Our Oxbridge & Russell Group mentors will polish your analysis,", fill=(10, 30, 20), font=get_font(22))
    draw.text((100, 1015), "eliminate descriptive traps, and guarantee Turnitin safety.", fill=(10, 30, 20), font=get_font(22))

    # WhatsApp CTA Box
    draw.rounded_rectangle([100, 1080, W - 100, 1260], radius=20, fill=BG_DARK)
    draw.text((140, 1120), "💬 CHAT ON WHATSAPP: +91 95098 93638", fill=WHITE, font=get_font(28, bold=True))
    draw.text((140, 1175), "Instant 24/7 Response • Confidential • 12-Hour Urgent Turnaround", fill=GOLD, font=get_font(18))
    draw.text((140, 1210), "Tap the Link in Bio or DM Us Right Now", fill=MUTED, font=get_font(16))

    # Comment-to-DM Callout
    comment_kw = recipe.get("comment_kw", "STARTER").upper()
    draw.rounded_rectangle([100, 1310, W - 100, 1420], radius=16, fill=(10, 80, 55))
    draw.text((140, 1345), f"📥 Comment \"{comment_kw}\" below for the free 1-page PDF cheatsheet!", fill=WHITE, font=get_font(22, bold=True))

    # Bottom Safety & Website
    draw.text((360, 1540), "academicwizard.online", fill=MUTED, font=get_font(22))
    draw.text((300, 1580), "SAVE THIS REEL FOR YOUR DEADLINE 📌", fill=GOLD, font=get_font(20, bold=True))

    img.convert("RGB").save(str(output_path), quality=95)

def get_duration_from_probe(audio_path: Path) -> float:
    try:
        p = subprocess.run([FFMPEG_EXE, "-i", str(audio_path)], stderr=subprocess.PIPE, stdout=subprocess.PIPE, text=True)
        import re
        m = re.search(r"Duration:\s*(\d+):(\d+):(\d+\.\d+)", p.stderr)
        if m:
            h, mi, s = m.groups()
            return int(h) * 3600 + int(mi) * 60 + float(s)
    except Exception:
        pass
    return 24.0

def synthesize_narration(script_text: str, output_mp3: Path, voice: str = "en-GB-RyanNeural") -> float:
    """Synthesize ultra-realistic human neural voiceover using Microsoft Azure Edge-TTS or ElevenLabs."""
    clean_text = script_text.replace("'", "'").replace('"', "").replace("\n", " ")

    # 1. Check for ElevenLabs API Key in .env (if user provided)
    eleven_key = os.getenv("ELEVENLABS_API_KEY")
    if not eleven_key:
        env_file = PROJECT_ROOT / ".env"
        if env_file.exists():
            for line in env_file.read_text().splitlines():
                if line.startswith("ELEVENLABS_API_KEY="):
                    eleven_key = line.split("=", 1)[1].strip().strip('"').strip("'")

    if eleven_key:
        try:
            import requests
            url = "https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM"
            headers = {"xi-api-key": eleven_key, "Content-Type": "application/json"}
            payload = {"text": clean_text, "model_id": "eleven_multilingual_v2"}
            res = requests.post(url, json=payload, headers=headers, timeout=20)
            if res.status_code == 200:
                output_mp3.write_bytes(res.content)
                print("  🎙️ Generated hyper-realistic voiceover via ElevenLabs!")
                return get_duration_from_probe(output_mp3)
        except Exception as e:
            print(f"  ⚠️ ElevenLabs fallback: {e}")

    # 2. Microsoft Azure Neural Voice (100% Free, Studio Quality)
    try:
        import asyncio
        import edge_tts
        import certifi
        os.environ["SSL_CERT_FILE"] = certifi.where()

        async def _run_edge():
            comm = edge_tts.Communicate(clean_text, voice=voice, rate="-2%")
            await comm.save(str(output_mp3))

        asyncio.run(_run_edge())
        if output_mp3.exists() and output_mp3.stat().st_size > 1000:
            print(f"  🎙️ Synthesized human British neural voiceover via {voice}!")
            return get_duration_from_probe(output_mp3)
    except Exception as e:
        print(f"  ⚠️ Edge-TTS error ({e}), falling back to offline macOS say...")

    # 3. Offline macOS TTS fallback only if network unavailable
    aiff_tmp = output_mp3.with_suffix(".aiff")
    subprocess.run(["say", "-v", "Daniel", "-o", str(aiff_tmp), clean_text], check=True)
    subprocess.run([FFMPEG_EXE, "-y", "-i", str(aiff_tmp), "-b:a", "192k", str(output_mp3)], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    if aiff_tmp.exists():
        aiff_tmp.unlink()
    return get_duration_from_probe(output_mp3)

def render_dynamic_video_reel(recipe: Dict[str, Any], output_mp4: Path) -> Path:
    """
    Renders a complete, professional MP4 video reel.
    Delegates to the Master Pixabay B-Roll & kinetic subtitle engine.
    """
    try:
        try:
            from automation.broll_engine import render_broll_master_reel
        except ImportError:
            from broll_engine import render_broll_master_reel
        return render_broll_master_reel(recipe, output_mp4)
    except Exception as e:
        print(f"  ⚠️ Master B-Roll engine fallback ({e}), generating dynamic multi-scene fallback...")

    work_dir = output_mp4.parent / "reel_render_temp"
    work_dir.mkdir(parents=True, exist_ok=True)

    s1_png = work_dir / "s1_hook.png"
    s2_png = work_dir / "s2_trap_fix.png"
    s3_png = work_dir / "s3_framework.png"
    s4_png = work_dir / "s4_outro.png"

    print("  🎨 Rendering Scene 1: Hook...")
    render_scene_1_hook(recipe, s1_png)

    print("  🎨 Rendering Scene 2: Diagnostic Trap vs Fix...")
    render_scene_2_trap_vs_fix(recipe, s2_png)

    print("  🎨 Rendering Scene 3: Actionable Framework...")
    render_scene_3_framework(recipe, s3_framework := s3_png)

    print("  🎨 Rendering Scene 4: Outro & WhatsApp Lead Capture...")
    render_scene_4_outro_cta(recipe, s4_png)

    # Voiceover
    spoken_script = recipe.get("spoken_script", (
        "Stop losing marks on your essays for weak critical analysis. "
        "If your supervisor wrote that your draft reads like a descriptive book report, here is the secret. "
        "Most students just summarize what authors said, capping their grade at fifty-four percent. "
        "The first-class fix: Never just summarize. Critique the author's methodology, highlight the limitation, and state your own academic verdict. "
        "Save this reel for your next deadline, and WhatsApp Academic Wizard for one-on-one postgraduate mentoring."
    ))
    audio_mp3 = work_dir / "narration.mp3"
    print("  🎙️ Synthesizing British academic mentor voiceover...")
    audio_dur = synthesize_narration(spoken_script, audio_mp3)
    print(f"  ✅ Voiceover duration: {audio_dur:.1f}s")

    # Calculate scene timings proportionally to fill total duration
    total_dur = max(24.0, round(audio_dur + 2.0, 1))
    d1 = 5.0
    d2 = (total_dur - 11.0) / 2.0
    d3 = (total_dur - 11.0) / 2.0
    d4 = 6.0
    print(f"  ⏱️ Scene timings: Hook={d1:.1f}s | TrapFix={d2:.1f}s | Blueprint={d3:.1f}s | Outro={d4:.1f}s | Total={total_dur:.1f}s")

    # Render video clips with subtle zoom motion for dynamic movement
    clips = []
    scenes = [
        (s1_png, d1, "s1.mp4", "zoom_in"),
        (s2_png, d2, "s2.mp4", "pan_down"),
        (s3_png, d3, "s3.mp4", "zoom_in"),
        (s4_png, d4, "s4.mp4", "still"),
    ]

    for png, dur, out_name, motion in scenes:
        clip_path = work_dir / out_name
        frames = int(dur * 30)
        
        if motion == "zoom_in":
            # Subtle zoom-in: 1.0 to 1.05
            vf = f"scale=1080:1920,zoompan=z='min(zoom+0.0004,1.05)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={frames}:s=1080x1920:fps=30"
        elif motion == "pan_down":
            vf = f"scale=1080:1920,zoompan=z=1.04:x='iw/2-(iw/zoom/2)':y='min(ih/zoom/2+in*0.4,ih/2)':d={frames}:s=1080x1920:fps=30"
        else:
            vf = "scale=1080:1920,fps=30"

        cmd = [
            FFMPEG_EXE, "-y",
            "-loop", "1", "-i", str(png),
            "-t", f"{dur:.2f}",
            "-vf", vf,
            "-c:v", "libx264",
            "-pix_fmt", "yuv420p",
            "-r", "30",
            str(clip_path)
        ]
        subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        clips.append(clip_path)

    # Concat clips into video stream
    concat_txt = work_dir / "concat.txt"
    with open(concat_txt, "w") as f:
        for c in clips:
            f.write(f"file '{c.resolve()}'\n")

    video_only = work_dir / "video_merged.mp4"
    cmd_concat = [
        FFMPEG_EXE, "-y",
        "-f", "concat", "-safe", "0",
        "-i", str(concat_txt),
        "-c", "copy",
        str(video_only)
    ]
    subprocess.run(cmd_concat, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    # Mix audio: Voiceover + Lofi background beat
    lofi_beats = list(LOFI_DIR.glob("*.wav")) + list(LOFI_DIR.glob("*.mp3"))
    lofi_path = lofi_beats[0] if lofi_beats else None

    cmd_mux = [
        FFMPEG_EXE, "-y",
        "-i", str(video_only),
        "-i", str(audio_mp3),
    ]

    if lofi_path:
        cmd_mux.extend([
            "-stream_loop", "-1", "-i", str(lofi_path),
            "-filter_complex",
            "[1:a]apad=pad_dur=2[v_pad];[2:a]volume=0.12[bg];[v_pad][bg]amix=inputs=2:duration=first[a_mix]",
            "-map", "0:v",
            "-map", "[a_mix]",
        ])
    else:
        cmd_mux.extend([
            "-filter_complex", "[1:a]apad=pad_dur=2[a_pad]",
            "-map", "0:v",
            "-map", "[a_pad]",
        ])

    cmd_mux.extend([
        "-c:v", "copy",
        "-c:a", "aac",
        "-b:a", "192k",
        "-t", f"{total_dur:.2f}",
        "-movflags", "+faststart",
        str(output_mp4)
    ])
    subprocess.run(cmd_mux, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print(f"  🎬 Successfully rendered Master Video Reel: {output_mp4} ({output_mp4.stat().st_size / 1024 / 1024:.2f} MB)")
    return output_mp4

if __name__ == "__main__":
    import json
    plan_path = SCRIPT_DIR / "weekly_social_plan.json"
    with open(plan_path) as f:
        plan = json.load(f)
    recipe = plan["schedule"]["Monday"]["afternoon"]
    recipe["comment_kw"] = "STARTER"
    out_file = PUBLIC_SOCIAL_DIR / "master_complete_rendered_reel.mp4"
    render_dynamic_video_reel(recipe, out_file)
