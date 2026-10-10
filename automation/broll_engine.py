"""
Academic Wizard Master B-Roll & Kinetic Subtitle Engine
100% Free, Automated, Self-Hosted Video Compositor:
- Pixabay Video API Integration (fetches real 1080x1920 / 4K university study & research clips)
- Local B-roll caching in automation/broll_cache/ (zero redundant downloads)
- Large, high-contrast, mobile-optimized typography overlays (Top hook + Middle diagnostic + Bottom WhatsApp)
- Kinetic Word-by-Word Subtitle Generator (.ass karaoke styling with Academic Wizard Gold highlights at 52px)
- Dark Academic Cinematic Color Grading (#0F172A overlay at 42% opacity)
- Multi-track Audio Muxer (Human British Neural Voiceover en-GB-RyanNeural + Ducked Lo-fi Beat)
"""

import os
import re
import json
import random
import asyncio
import subprocess
from pathlib import Path
from typing import Dict, Any, List, Optional, Tuple

import requests
import certifi
from PIL import Image, ImageDraw, ImageFont
import imageio_ffmpeg

# Set SSL cert path for asyncio / aiohttp / edge-tts on macOS & Linux
os.environ["SSL_CERT_FILE"] = certifi.where()

SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent
PUBLIC_SOCIAL_DIR = PROJECT_ROOT / "public" / "social"
PUBLIC_SOCIAL_DIR.mkdir(parents=True, exist_ok=True)
BROLL_CACHE_DIR = SCRIPT_DIR / "broll_cache"
BROLL_CACHE_DIR.mkdir(parents=True, exist_ok=True)
BROLL_BANK_DIR = SCRIPT_DIR / "broll_bank"
BROLL_BANK_DIR.mkdir(parents=True, exist_ok=True)
LOFI_DIR = SCRIPT_DIR / "lofi_beats"
LOGO_PATH = PROJECT_ROOT / "public" / "academic-wizard-logo-nav.webp"

FFMPEG_EXE = imageio_ffmpeg.get_ffmpeg_exe()

# Academic Wizard Colors
ASS_GOLD = "&H0023A6F5"   # Gold #F5A623 in BGR ASS format
ASS_WHITE = "&H00FFFFFF"
ASS_DARK = "&H002A170F"


def get_system_font(size: int, bold: bool = False) -> ImageFont.ImageFont:
    """Robust font loader across macOS, Ubuntu, and container runners."""
    candidates = [
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
        "/System/Library/Fonts/SFPro-Bold.ttf" if bold else "/System/Library/Fonts/SFPro-Regular.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
        "/usr/share/fonts/truetype/freefont/FreeSansBold.ttf" if bold else "/usr/share/fonts/truetype/freefont/FreeSans.ttf",
    ]
    for p in candidates:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                pass
    return ImageFont.load_default()


def wrap_text(draw: ImageDraw.Draw, text: str, font: ImageFont.ImageFont, max_width: int) -> List[str]:
    """Break text cleanly across lines based on pixel width."""
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


def get_pixabay_api_key() -> Optional[str]:
    """Retrieve Pixabay API key from environment or .env file."""
    key = os.getenv("PIXABAY_API_KEY")
    if key:
        return key.strip()
    env_file = PROJECT_ROOT / ".env"
    if env_file.exists():
        for line in env_file.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if line.startswith("PIXABAY_API_KEY="):
                return line.split("=", 1)[1].strip().strip('"').strip("'")
    return None


def fetch_pixabay_vertical_clips(query: str, count: int = 2) -> List[Path]:
    """
    Search and download free stock video clips from Pixabay API using requests.
    Cached locally in automation/broll_cache/ to prevent duplicate network hits.
    """
    api_key = get_pixabay_api_key()
    if not api_key:
        return []

    safe_q = re.sub(r"[^a-zA-Z0-9]+", "_", query).lower()
    existing = list(BROLL_CACHE_DIR.glob(f"pixabay_{safe_q}_*.mp4"))
    if len(existing) >= count:
        return existing[:count]

    url = f"https://pixabay.com/api/videos/?key={api_key}&q={requests.utils.quote(query)}&per_page=10"
    downloaded = []
    try:
        res = requests.get(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}, timeout=15)
        if res.status_code == 200:
            data = res.json()
            hits = data.get("hits", [])
            for hit in hits:
                if len(downloaded) >= count:
                    break
                v_dict = hit.get("videos", {})
                # Prefer medium (720p/1080p) or large
                v_url = v_dict.get("medium", {}).get("url") or v_dict.get("large", {}).get("url")
                if not v_url:
                    continue

                out_f = BROLL_CACHE_DIR / f"pixabay_{safe_q}_{hit['id']}.mp4"
                if not out_f.exists():
                    print(f"  📥 Downloading free HD B-Roll from Pixabay ({safe_q} #{hit['id']})...")
                    r_vid = requests.get(v_url, stream=True, timeout=25)
                    with open(out_f, "wb") as f:
                        for chunk in r_vid.iter_content(chunk_size=1024 * 1024):
                            if chunk:
                                f.write(chunk)
                if out_f.exists() and out_f.stat().st_size > 100000:
                    downloaded.append(out_f)
    except Exception as e:
        print(f"  ⚠️ Pixabay API notice: {e}")

    return downloaded


def fetch_broll_clips_for_reel(recipe: Dict[str, Any]) -> List[Path]:
    """Gather 3-4 diverse video clips for the 4 scenes of the reel."""
    selected_clips: List[Path] = []

    # 1. Check local Curated B-Roll Bank
    local_bank_clips = list(BROLL_BANK_DIR.glob("*.mp4")) + list(BROLL_BANK_DIR.glob("*.mov"))
    if local_bank_clips:
        random.shuffle(local_bank_clips)
        selected_clips.extend(local_bank_clips[:4])

    # 2. Check Pixabay API
    if len(selected_clips) < 4:
        search_queries = [
            "student library",
            "laptop typing keyboard",
            "study university notes",
            "student reading textbook"
        ]
        for q in search_queries:
            if len(selected_clips) >= 4:
                break
            clips = fetch_pixabay_vertical_clips(q, count=1)
            for c in clips:
                if c not in selected_clips:
                    selected_clips.append(c)
                if len(selected_clips) >= 4:
                    break

    # 3. Check cached B-Roll
    if len(selected_clips) < 4:
        cache_clips = list(BROLL_CACHE_DIR.glob("*.mp4"))
        for c in cache_clips:
            if c not in selected_clips:
                selected_clips.append(c)
            if len(selected_clips) >= 4:
                break

    return selected_clips


def generate_ocr_commercial_overlay(recipe: Dict[str, Any], output_png: Path) -> Path:
    """
    Generate the master, crystal-clear 1080x1920 typography card overlay:
    - Top Card (y: 90 - 480): Service Badge pill + 52px Bold Hook Headline + 28px Subtitle
    - Middle Diagnostic Card (y: 1120 - 1490): High-contrast Red 54% Trap & Emerald 78% 1st Class Fix
    - Bottom WhatsApp Lead Bar (y: 1700 - 1860): 44px Emerald Green Helpline & Trust Bar
    """
    img = Image.new("RGBA", (1080, 1920), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    # 1. TOP CARD (OCR Commercial Hook)
    d.rounded_rectangle([50, 90, 1030, 520], radius=24, fill=(15, 23, 42, 245), outline=(245, 166, 35), width=3)

    # Dynamic Commercial Badge
    comm_badge = recipe.get("badge", "CORE SERVICE: ASSIGNMENT HELP UK").upper()
    if "SERVICE" not in comm_badge and "HELP" not in comm_badge and "GUIDE" not in comm_badge:
        comm_badge = f"CORE SERVICE: {comm_badge} HELP UK"

    b_font = get_system_font(28, bold=True)
    b_bbox = d.textbbox((0, 0), comm_badge, font=b_font)
    badge_w = max(420, (b_bbox[2] - b_bbox[0]) + 50)
    d.rounded_rectangle([80, 120, min(1000, 80 + badge_w), 185], radius=14, fill=(245, 166, 35))
    d.text((105, 133), comm_badge, fill=(15, 23, 42), font=b_font)

    # Hook Headline (44px Bold, up to 3 lines)
    hook_text = recipe.get("hook_headline", "Score 78%+ in Your University Modules")
    hook_lines = wrap_text(d, hook_text, get_system_font(44, bold=True), 880)
    curr_y = 205
    for hl in hook_lines[:3]:
        d.text((80, curr_y), hl, fill=(255, 255, 255), font=get_system_font(44, bold=True))
        curr_y += 54

    # Subtitle Context (26px)
    sub_text = recipe.get("hook_sub", "Stop losing marks on descriptive essays with our first-class blueprint.")
    sub_lines = wrap_text(d, sub_text, get_system_font(26, bold=False), 880)
    for sl in sub_lines[:2]:
        d.text((80, curr_y), sl, fill=(203, 213, 225), font=get_system_font(26, bold=False))
        curr_y += 34

    # 2. MIDDLE DIAGNOSTIC SPLIT CARD (54% Trap vs 78% First Class)
    d.rounded_rectangle([50, 1120, 1030, 1490], radius=24, fill=(15, 23, 42, 245), outline=(51, 65, 85), width=2)

    comp = recipe.get("comparison", {})
    trap_title = comp.get("trap_title", "54% TRAP: DESCRIPTIVE SUMMARY").upper()
    trap_text = comp.get("trap_text", "Trying to invent an unverified model from scratch without peer review.")
    fix_title = comp.get("fix_title", "78% FIRST CLASS BLUEPRINT").upper()
    fix_text = comp.get("fix_text", "Contrasting empirical studies, noting sample bias & justifying your thesis.")

    # Trap Row (Red outline)
    d.rounded_rectangle([80, 1150, 1000, 1290], radius=16, fill=(35, 20, 30), outline=(239, 68, 68), width=2)
    d.rounded_rectangle([105, 1165, 330, 1205], radius=8, fill=(239, 68, 68))
    d.text((118, 1172), "54% TRAP", fill=(255, 255, 255), font=get_system_font(24, bold=True))
    d.text((350, 1172), trap_title[:32], fill=(248, 113, 113), font=get_system_font(26, bold=True))
    trap_desc_lines = wrap_text(d, trap_text, get_system_font(26, bold=False), 860)
    if trap_desc_lines:
        d.text((108, 1222), trap_desc_lines[0], fill=(255, 255, 255), font=get_system_font(26, bold=False))

    # Fix Row (Emerald outline)
    d.rounded_rectangle([80, 1320, 1000, 1460], radius=16, fill=(15, 35, 30), outline=(16, 185, 129), width=2)
    d.rounded_rectangle([105, 1335, 410, 1375], radius=8, fill=(16, 185, 129))
    d.text((118, 1342), "78% 1ST CLASS", fill=(15, 23, 42), font=get_system_font(24, bold=True))
    d.text((430, 1342), fix_title[:30], fill=(52, 211, 153), font=get_system_font(26, bold=True))
    fix_desc_lines = wrap_text(d, fix_text, get_system_font(26, bold=False), 860)
    if fix_desc_lines:
        d.text((108, 1392), fix_desc_lines[0], fill=(255, 255, 255), font=get_system_font(26, bold=False))

    # 3. BOTTOM WHATSAPP LEAD BAR
    d.rounded_rectangle([50, 1700, 1030, 1860], radius=24, fill=(16, 185, 129), outline=(255, 255, 255), width=3)
    d.text((90, 1725), "WhatsApp Us: +91 95098 93638", fill=(15, 23, 42), font=get_system_font(44, bold=True))
    d.text((90, 1785), "Turnitin 0% AI Guarantee • 1-on-1 Academic Guidance", fill=(15, 23, 42), font=get_system_font(28, bold=True))

    output_png.parent.mkdir(parents=True, exist_ok=True)
    img.save(str(output_png))
    return output_png


def generate_kinetic_ass_subtitles(spoken_script: str, total_duration: float, output_ass_path: Path):
    """
    Generate an Advanced SubStation Alpha (.ass) subtitle file with:
    - Kinetic word-by-word karaoke highlighting (Active word in Gold &H0023A6F5, inactive in White)
    - 52px Bold typography with thick 4.5px black outline for 100% mobile readability
    - Placement at the mobile eye-level (MarginV=880) between top card and diagnostic card
    """
    clean_text = spoken_script.replace("\n", " ").strip()
    words = clean_text.split()
    total_words = len(words)
    if total_words == 0:
        return

    word_dur = total_duration / max(1, total_words)

    chunk_size = 5
    chunks = []
    for i in range(0, total_words, chunk_size):
        chunk_words = words[i:i + chunk_size]
        start_t = i * word_dur
        end_t = min(total_duration, (i + len(chunk_words)) * word_dur)
        chunks.append({
            "words": chunk_words,
            "start": start_t,
            "end": end_t,
            "start_idx": i
        })

    def format_ass_time(seconds: float) -> str:
        h = int(seconds // 3600)
        m = int((seconds % 3600) // 60)
        s = int(seconds % 60)
        cs = int((seconds - int(seconds)) * 100)
        return f"{h}:{m:02d}:{s:02d}.{cs:02d}"

    header = f"""[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: KineticSub,Arial,52,{ASS_WHITE},{ASS_GOLD},&H00000000,&H80000000,-1,0,0,0,100,100,0,0,1,4.5,2.5,2,60,60,880,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""

    events = []
    for c in chunks:
        c_words = c["words"]
        n_words = len(c_words)
        c_dur = c["end"] - c["start"]
        per_w = c_dur / max(1, n_words)

        for w_idx in range(n_words):
            w_start = c["start"] + w_idx * per_w
            w_end = w_start + per_w

            line_parts = []
            for j, w in enumerate(c_words):
                if j == w_idx:
                    line_parts.append(r"{\c" + ASS_GOLD + r"\fscx112\fscy112}" + w.upper() + r"{\r\c" + ASS_WHITE + r"}")
                else:
                    line_parts.append(w)

            line_str = " ".join(line_parts)
            events.append(f"Dialogue: 0,{format_ass_time(w_start)},{format_ass_time(w_end)},KineticSub,,0,0,0,,{line_str}")

    output_ass_path.parent.mkdir(parents=True, exist_ok=True)
    output_ass_path.write_text(header + "\n".join(events) + "\n", encoding="utf-8")


def get_audio_duration_seconds(audio_path: Path) -> float:
    """Measure exact audio duration via FFmpeg."""
    try:
        p = subprocess.run([FFMPEG_EXE, "-i", str(audio_path)], stderr=subprocess.PIPE, stdout=subprocess.PIPE, text=True)
        m = re.search(r"Duration:\s*(\d+):(\d+):(\d+\.\d+)", p.stderr)
        if m:
            h, mi, s = m.groups()
            return int(h) * 3600 + int(mi) * 60 + float(s)
    except Exception:
        pass
    return 24.0


def synthesize_human_voiceover(script_text: str, output_path: Path, voice: str = "en-GB-RyanNeural") -> Tuple[bool, float]:
    """Generate human-like British neural voiceover using Edge-TTS (en-GB-RyanNeural at -2% speed)."""
    clean_text = script_text.replace("'", "'").replace('"', "").replace("\n", " ").strip()
    output_path.parent.mkdir(parents=True, exist_ok=True)

    # 1. Edge-TTS Neural Voice (100% Free, High Quality)
    try:
        import edge_tts

        async def _speak():
            comm = edge_tts.Communicate(clean_text, voice, rate="-2%")
            await comm.save(str(output_path))

        asyncio.run(_speak())
        if output_path.exists() and output_path.stat().st_size > 1000:
            dur = get_audio_duration_seconds(output_path)
            print(f"  🎙️ Synthesized human British neural voiceover via {voice} ({dur:.1f}s)!")
            return True, dur
    except Exception as e:
        print(f"  ⚠️ Edge-TTS note ({e}), trying fallback voice...")

    # 2. macOS say fallback only if network completely down
    try:
        aiff_tmp = output_path.with_suffix(".aiff")
        subprocess.run(["say", "-v", "Daniel", "-o", str(aiff_tmp), clean_text], check=True)
        subprocess.run([FFMPEG_EXE, "-y", "-i", str(aiff_tmp), "-b:a", "192k", str(output_path)], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        if aiff_tmp.exists():
            aiff_tmp.unlink()
        dur = get_audio_duration_seconds(output_path)
        return True, dur
    except Exception:
        pass

    return False, 24.0


def render_broll_master_reel(recipe: Dict[str, Any], output_mp4: Path) -> Path:
    """
    Main Entrypoint: Renders a complete high-definition 9:16 vertical video reel
    using Pixabay B-roll footage, large high-contrast typography, kinetic subtitles, and human voiceover.
    """
    work_dir = output_mp4.parent / "broll_render_temp"
    work_dir.mkdir(parents=True, exist_ok=True)

    print(f"  🎬 Starting Master B-Roll Video Reel Generation for: {recipe.get('topic', 'Reel')}...")

    # 1. Synthesize Human Neural Voiceover
    spoken_script = recipe.get("spoken_script")
    if not spoken_script:
        comm_badge = recipe.get("badge", "CORE SERVICE: ASSIGNMENT HELP UK")
        spoken_script = (
            f"If you need {comm_badge.lower()} for your university coursework, stop losing marks on descriptive essays. "
            "Never just summarize what authors said without critical evaluation. "
            "The first-class fix: Critique their sample size, highlight the methodological limitation, and state your own academic position. "
            f"Save this reel, and WhatsApp Academic Wizard for 24/7 academic guidance."
        )

    audio_path = work_dir / "voiceover.mp3"
    voice_ok, audio_dur = synthesize_human_voiceover(spoken_script, audio_path)
    total_dur = max(22.0, round(audio_dur + 1.5, 1))
    print(f"  ⏱️ Audio duration: {audio_dur:.2f}s | Total reel duration: {total_dur:.2f}s")

    # 2. Fetch and select high-res vertical B-roll clips (from Pixabay or cache)
    selected_clips = fetch_broll_clips_for_reel(recipe)
    print(f"  🎥 Selected B-Roll video sources: {len(selected_clips)} clips found")

    # 3. Generate Large-Typography Commercial Card Overlay (OCR SEO)
    overlay_png = work_dir / "ocr_commercial_overlay.png"
    generate_ocr_commercial_overlay(recipe, overlay_png)

    # Also update the companion frame for the poster thumbnail
    frame_path = output_mp4.parent / f"{output_mp4.stem}_frame.png"
    try:
        # Create thumbnail by merging overlay on the first video frame or dark gradient
        img_thumb = Image.new("RGBA", (1080, 1920), (15, 23, 42, 255))
        overlay_img = Image.open(overlay_png).convert("RGBA")
        img_thumb.paste(overlay_img, (0, 0), overlay_img)
        img_thumb.save(str(frame_path))
        print(f"  📸 Generated high-res reel poster frame: {frame_path.name}")
    except Exception as e:
        print(f"  ⚠️ Poster frame warning: {e}")

    # 4. Generate Kinetic Subtitles (.ass)
    ass_path = work_dir / "kinetic_subtitles.ass"
    generate_kinetic_ass_subtitles(spoken_script, total_dur - 1.5, ass_path)

    # 5. Process B-roll clips into uniform 1080x1920 slices with dark navy cinematic grading
    scene_durations = [5.0, (total_dur - 11.0) / 2.0, (total_dur - 11.0) / 2.0, 6.0]
    processed_clips = []

    for idx, dur in enumerate(scene_durations):
        clip_src = selected_clips[idx % len(selected_clips)] if selected_clips else None
        out_clip = work_dir / f"scene_{idx+1}_graded.mp4"

        # Color grading filter: scale & crop to 1080x1920, add dark navy tint (#0F172A at 42% opacity)
        vf = (
            "scale=1080:1920:force_original_aspect_ratio=increase,"
            "crop=1080:1920,"
            "drawbox=x=0:y=0:w=1080:h=1920:color=0x0F172A@0.42:t=fill,"
            "fps=30"
        )

        if clip_src and clip_src.exists():
            cmd = [
                FFMPEG_EXE, "-y",
                "-stream_loop", "-1",
                "-i", str(clip_src),
                "-t", f"{dur:.2f}",
                "-vf", vf,
                "-c:v", "libx264",
                "-pix_fmt", "yuv420p",
                "-an",
                str(out_clip)
            ]
        else:
            # Fallback canvas
            cmd = [
                FFMPEG_EXE, "-y",
                "-f", "lavfi",
                "-i", f"color=c=0x0F172A:s=1080x1920:d={dur:.2f}:r=30",
                "-c:v", "libx264",
                "-pix_fmt", "yuv420p",
                "-an",
                str(out_clip)
            ]
        subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        processed_clips.append(out_clip)

    # 6. Concat processed scenes
    concat_txt = work_dir / "concat_broll.txt"
    with open(concat_txt, "w") as f:
        for pc in processed_clips:
            f.write(f"file '{pc.resolve()}'\n")

    broll_merged = work_dir / "broll_merged.mp4"
    cmd_cat = [
        FFMPEG_EXE, "-y",
        "-f", "concat", "-safe", "0",
        "-i", str(concat_txt),
        "-c", "copy",
        str(broll_merged)
    ]
    subprocess.run(cmd_cat, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    # 7. Final Composite: Video + OCR Card Overlay + Kinetic Subtitles + Voiceover + Lo-Fi Beat
    lofi_beats = list(LOFI_DIR.glob("*.wav")) + list(LOFI_DIR.glob("*.mp3"))
    lofi_path = lofi_beats[0] if lofi_beats else None

    cmd_final = [
        FFMPEG_EXE, "-y",
        "-i", str(broll_merged),
        "-i", str(overlay_png),
        "-i", str(audio_path),
    ]

    filter_chain = f"[0:v][1:v]overlay=0:0[v_branded];[v_branded]ass={ass_path}[v_sub]"

    if lofi_path:
        cmd_final.extend([
            "-stream_loop", "-1", "-i", str(lofi_path),
            "-filter_complex",
            f"{filter_chain};"
            f"[2:a]apad=pad_dur=2[v_pad];[3:a]volume=0.15[bg];[v_pad][bg]amix=inputs=2:duration=first[a_mix]",
            "-map", "[v_sub]",
            "-map", "[a_mix]",
        ])
    else:
        cmd_final.extend([
            "-filter_complex",
            f"{filter_chain};"
            f"[2:a]apad=pad_dur=2[a_pad]",
            "-map", "[v_sub]",
            "-map", "[a_pad]",
        ])

    output_mp4.parent.mkdir(parents=True, exist_ok=True)
    cmd_final.extend([
        "-c:v", "libx264",
        "-crf", "20",
        "-preset", "fast",
        "-pix_fmt", "yuv420p",
        "-c:a", "aac",
        "-b:a", "192k",
        "-t", f"{total_dur:.2f}",
        "-movflags", "+faststart",
        str(output_mp4)
    ])

    subprocess.run(cmd_final, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print(f"  🎉 Master B-Roll Video Reel Successfully Rendered: {output_mp4.name} ({output_mp4.stat().st_size / 1024 / 1024:.2f} MB)")
    return output_mp4


if __name__ == "__main__":
    test_recipe = {
        "topic": "The Original Ideas Myth",
        "badge": "CORE SERVICE: ESSAY WRITING HELP UK",
        "hook_headline": "Your Professor Doesn't Want 'Original Ideas' — Here's What They Mark",
        "hook_sub": "Stop trying to invent a new theory in your undergrad essay. Master critical synthesis.",
        "comparison": {
            "trap_title": "54% TRAP: OPINION ESSAY",
            "trap_text": "Trying to invent an unverified theoretical model from scratch without literature.",
            "fix_title": "78% FIRST CLASS BLUEPRINT",
            "fix_text": "Contrasting opposing empirical studies, critiquing sample bias & justifying your thesis."
        },
        "spoken_script": (
            "Your professor does not want you to invent a brand new theory in an undergraduate essay. "
            "That is the number one myth holding students back. "
            "What markers actually grade is synthesis: contrasting opposing empirical studies, critiquing their sampling limitations, "
            "and defending your own verdict. "
            "Save this reel, and WhatsApp Academic Wizard for one-on-one essay help and grade protection."
        )
    }
    out_test = PUBLIC_SOCIAL_DIR / "test_master_broll_reel.mp4"
    render_broll_master_reel(test_recipe, out_test)
