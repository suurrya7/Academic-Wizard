"""
Academic Wizard B-Roll & Kinetic Subtitle Engine
100% Free, Automated, Self-Hosted Video Compositor:
- Pexels Free Video API Integration (fetches real 1080x1920 study & research clips)
- Local B-roll caching (zero redundant network requests)
- Kinetic Word-by-Word Subtitle Generator (.ass karaoke styling with Academic Wizard Gold highlights)
- Dark Academic Cinematic Color Grading (#0F172A overlay)
- Multi-track Audio Muxer (British Neural Voiceover + Ducked Lo-fi Beat)
"""

import os
import re
import json
import random
import urllib.request
import subprocess
from pathlib import Path
from typing import Dict, Any, List, Optional, Tuple
import imageio_ffmpeg

SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent
PUBLIC_SOCIAL_DIR = PROJECT_ROOT / "public" / "social"
BROLL_CACHE_DIR = SCRIPT_DIR / "broll_cache"
BROLL_CACHE_DIR.mkdir(parents=True, exist_ok=True)
LOFI_DIR = SCRIPT_DIR / "lofi_beats"
LOGO_PATH = PROJECT_ROOT / "public" / "academic-wizard-logo-nav.webp"

FFMPEG_EXE = imageio_ffmpeg.get_ffmpeg_exe()

# Academic Wizard Palette (ASS format: &HAABBGGRR)
# Gold #F5A623 -> BGR: 23 A6 F5 -> &H0023A6F5
ASS_GOLD = "&H0023A6F5"
ASS_WHITE = "&H00FFFFFF"
ASS_MUTED = "&H00A0AEB4"
ASS_DARK = "&H002A170F"

def get_pexels_api_key() -> Optional[str]:
    """Retrieve Pexels API key from environment or .env file."""
    key = os.getenv("PEXELS_API_KEY")
    if key:
        return key.strip()
    env_file = PROJECT_ROOT / ".env"
    if env_file.exists():
        for line in env_file.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if line.startswith("PEXELS_API_KEY="):
                return line.split("=", 1)[1].strip().strip('"').strip("'")
    return None

def fetch_pexels_vertical_clips(query: str, count: int = 3) -> List[Path]:
    """
    Search and download free 1080x1920 vertical video clips from Pexels API.
    Cached locally in automation/broll_cache/ to minimize bandwidth.
    """
    api_key = get_pexels_api_key()
    if not api_key:
        return []

    # Sanitize query for filenames
    safe_q = re.sub(r"[^a-zA-Z0-9]+", "_", query).lower()
    existing = list(BROLL_CACHE_DIR.glob(f"{safe_q}_*.mp4"))
    if len(existing) >= count:
        return existing[:count]

    url = f"https://api.pexels.com/videos/search?query={urllib.parse.quote(query)}&orientation=portrait&per_page=15"
    headers = {
        "Authorization": api_key,
        "User-Agent": "AcademicWizardVideoEngine/2.0"
    }

    downloaded = []
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=12) as response:
            data = json.loads(response.read().decode("utf-8"))
            videos = data.get("videos", [])

        for idx, vid in enumerate(videos):
            if len(downloaded) >= count:
                break
            # Find vertical file (~1080x1920 or portrait aspect)
            vfiles = vid.get("video_files", [])
            # Sort by resolution, favoring portrait
            portrait_files = [vf for vf in vfiles if vf.get("height", 0) > vf.get("width", 0)]
            if not portrait_files:
                continue
            
            chosen_file = portrait_files[0]
            link = chosen_file.get("link")
            if not link:
                continue

            target_path = BROLL_CACHE_DIR / f"{safe_q}_{vid['id']}.mp4"
            if not target_path.exists():
                print(f"  📥 Downloading free 4K/HD B-Roll clip from Pexels ({safe_q} #{idx+1})...")
                urllib.request.urlretrieve(link, target_path)
            
            if target_path.exists() and target_path.stat().st_size > 100000:
                downloaded.append(target_path)
    except Exception as e:
        print(f"  ⚠️ Pexels API notice: {e}")

    return downloaded

def fetch_pixabay_vertical_clips(query: str, count: int = 2) -> List[Path]:
    """Search and download free stock video clips from Pixabay API (PIXABAY_API_KEY)."""
    api_key = os.getenv("PIXABAY_API_KEY")
    if not api_key:
        env_file = PROJECT_ROOT / ".env"
        if env_file.exists():
            for line in env_file.read_text(encoding="utf-8").splitlines():
                if line.strip().startswith("PIXABAY_API_KEY="):
                    api_key = line.split("=", 1)[1].strip().strip('"').strip("'")
    if not api_key:
        return []

    safe_q = re.sub(r"[^a-zA-Z0-9]+", "_", query).lower()
    url = f"https://pixabay.com/api/videos/?key={api_key}&q={urllib.parse.quote(query)}&per_page=10"
    downloaded = []
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "AcademicWizard/2.0"})
        with urllib.request.urlopen(req, timeout=10) as res:
            data = json.loads(res.read().decode("utf-8"))
            for hit in data.get("hits", [])[:count]:
                v_url = hit.get("videos", {}).get("medium", {}).get("url") or hit.get("videos", {}).get("large", {}).get("url")
                if v_url:
                    out_f = BROLL_CACHE_DIR / f"pixabay_{safe_q}_{hit['id']}.mp4"
                    if not out_f.exists():
                        urllib.request.urlretrieve(v_url, out_f)
                    if out_f.exists() and out_f.stat().st_size > 100000:
                        downloaded.append(out_f)
    except Exception as e:
        print(f"  ⚠️ Pixabay API notice: {e}")
    return downloaded

def generate_kinetic_ass_subtitles(spoken_script: str, total_duration: float, output_ass_path: Path):
    """
    Generate an Advanced SubStation Alpha (.ass) subtitle file with:
    - Kinetic word-by-word karaoke highlighting (Active word in Gold &H0023A6F5, inactive in White)
    - High-contrast text outline and shadow for 100% mobile readability
    - Placement at the mobile eye-level (MarginV=380)
    """
    # Clean and split into sentences / phrases
    clean_text = spoken_script.replace("\n", " ").strip()
    words = clean_text.split()
    total_words = len(words)
    if total_words == 0:
        return

    word_dur = total_duration / max(1, total_words)

    # Chunk into 4-6 word readable lines
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
Style: KineticSub,Arial,48,{ASS_WHITE},{ASS_GOLD},&H00000000,&H80000000,-1,0,0,0,100,100,0,0,1,3.5,2,2,60,60,420,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""

    events = []
    for c in chunks:
        c_words = c["words"]
        n_words = len(c_words)
        c_dur = c["end"] - c["start"]
        per_w = c_dur / max(1, n_words)

        # For each word in the chunk, create a sub-event where that word is active/highlighted in Gold
        for w_idx in range(n_words):
            w_start = c["start"] + w_idx * per_w
            w_end = w_start + per_w
            
            # Build line text with active word popping in Gold
            line_parts = []
            for j, w in enumerate(c_words):
                if j == w_idx:
                    # Active word: Gold color + slight pop scale
                    line_parts.append(r"{\c" + ASS_GOLD + r"\fscx112\fscy112}" + w.upper() + r"{\r\c" + ASS_WHITE + r"}")
                else:
                    line_parts.append(w)
            
            line_str = " ".join(line_parts)
            events.append(f"Dialogue: 0,{format_ass_time(w_start)},{format_ass_time(w_end)},KineticSub,,0,0,0,,{line_str}")

    ass_text = header + "\n".join(events) + "\n"
    output_ass_path.write_text(ass_text, encoding="utf-8")

def assemble_professional_broll_reel(
    recipe: Dict[str, Any],
    spoken_audio_path: Path,
    audio_duration: float,
    output_mp4_path: Path
) -> Path:
    """
    Assembles a complete, high-end vertical reel:
    1. Fetches/selects high-res vertical B-roll clips for 4 scenes
    2. Applies dark navy color grading (#0F172A at 38% opacity)
    3. Overlays graphic badges (Topic Hook, Canvas alert, IRAC formula, WhatsApp CTA)
    4. Burns in kinetic word-by-word karaoke subtitles (.ass)
    5. Mixes voiceover + ducked lo-fi background beat
    """
    work_dir = output_mp4_path.parent / "broll_render_temp"
    work_dir.mkdir(parents=True, exist_ok=True)

    topic = recipe.get("topic", "Academic Writing").lower()
    
    # 1. Check local Curated B-Roll Bank (automation/broll_bank/) FIRST
    BROLL_BANK_DIR = SCRIPT_DIR / "broll_bank"
    BROLL_BANK_DIR.mkdir(parents=True, exist_ok=True)
    local_bank_clips = list(BROLL_BANK_DIR.glob("*.mp4")) + list(BROLL_BANK_DIR.glob("*.mov"))
    
    selected_clips = []
    if local_bank_clips:
        random.shuffle(local_bank_clips)
        selected_clips.extend(local_bank_clips[:4])

    # 2. If more clips needed, try Pexels or Pixabay APIs
    if len(selected_clips) < 4:
        queries = [
            "student studying laptop library",
            "typing macbook keyboard notes",
            "writing notes textbook highlighter",
            "happy university student campus celebration"
        ]
        for q in queries:
            if len(selected_clips) >= 4:
                break
            clips = fetch_pexels_vertical_clips(q, count=1) or fetch_pixabay_vertical_clips(q, count=1)
            if clips:
                selected_clips.append(clips[0])

    # 3. Check cached B-Roll
    if len(selected_clips) < 4:
        cache_clips = list(BROLL_CACHE_DIR.glob("*.mp4"))
        for c in cache_clips:
            if c not in selected_clips:
                selected_clips.append(c)
            if len(selected_clips) >= 4:
                break

    # 4. Built-in dynamic multi-scene motion clips (guaranteed fallback)
    fallback_clips = [
        work_dir.parent / "reel_render_temp" / "s1.mp4",
        work_dir.parent / "reel_render_temp" / "s2.mp4",
        work_dir.parent / "reel_render_temp" / "s3.mp4",
        work_dir.parent / "reel_render_temp" / "s4.mp4",
    ]
    for fb in fallback_clips:
        if len(selected_clips) >= 4:
            break
        if fb.exists():
            selected_clips.append(fb)

    total_dur = max(24.0, round(audio_duration + 2.0, 1))

    # 2. Generate on-screen Commercial OCR SEO Overlay (Permanent Top Badge & Bottom CTA)
    ocr_overlay_png = work_dir / "ocr_commercial_overlay.png"
    from PIL import Image, ImageDraw, ImageFont
    
    def get_font_fallback(size: int, bold: bool = False):
        for p in ["/System/Library/Fonts/SFPro-Bold.ttf", "/System/Library/Fonts/Helvetica.ttc", "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"]:
            if Path(p).exists():
                try:
                    return ImageFont.truetype(p, size)
                except Exception:
                    pass
        return ImageFont.load_default()

    img_ocr = Image.new("RGBA", (1080, 1920), (0, 0, 0, 0))
    d_ocr = ImageDraw.Draw(img_ocr)

    comm_badge = recipe.get("badge", "CORE SERVICE: ASSIGNMENT HELP UK").upper()
    if "SERVICE" not in comm_badge and "HELP" not in comm_badge:
        comm_badge = f"CORE SERVICE: {comm_badge} HELP UK"

    # Top OCR Branded Card
    d_ocr.rounded_rectangle([50, 120, 1030, 260], radius=18, fill=(15, 23, 42, 230), outline=(245, 166, 35), width=2)
    # Gold Pill Badge
    d_ocr.rounded_rectangle([70, 136, 520, 182], radius=8, fill=(245, 166, 35))
    d_ocr.text((86, 146), comm_badge, fill=(15, 23, 42), font=get_font_fallback(15, bold=True))
    # Hook Headline
    comm_hook = recipe.get("hook_headline", "Score 78%+ in Your University Modules")
    d_ocr.text((75, 202), comm_hook[:48], fill=(255, 255, 255), font=get_font_fallback(24, bold=True))

    # Bottom Permanent WhatsApp Helpline & Trust Bar
    d_ocr.rounded_rectangle([50, 1730, 1030, 1830], radius=16, fill=(16, 185, 129), outline=(255, 255, 255), width=2)
    d_ocr.text((75, 1752), "💬 WhatsApp: +91 95098 93638  |  Turnitin 0% AI Guarantee", fill=(15, 23, 42), font=get_font_fallback(20, bold=True))
    d_ocr.text((75, 1785), "Instant 24/7 Response • Confidential • 12-Hour Urgent Turnaround", fill=(10, 40, 25), font=get_font_fallback(15, bold=False))
    img_ocr.save(str(ocr_overlay_png))

    # 3. Generate kinetic word-by-word subtitles with commercial keyword emphasis
    spoken_script = recipe.get("spoken_script")
    if not spoken_script:
        spoken_script = (
            f"If you need {comm_badge.lower()} for your university coursework, stop losing marks on weak analysis. "
            "Never just summarize what authors said. Critique the methodology, state the limitation, and deliver your verdict. "
            f"Save this reel, and WhatsApp Academic Wizard for one-on-one {comm_badge.lower()} and grade protection."
        )
    ass_path = work_dir / "kinetic_subtitles.ass"
    generate_kinetic_ass_subtitles(spoken_script, total_dur - 2.0, ass_path)

    # 4. Process video clips into uniform 1080x1920 slices with dark navy cinematic grading
    scene_durations = [5.0, (total_dur - 11.0) / 2.0, (total_dur - 11.0) / 2.0, 6.0]
    processed_clips = []

    for idx, dur in enumerate(scene_durations):
        clip_src = selected_clips[idx % len(selected_clips)] if selected_clips else None
        out_clip = work_dir / f"scene_{idx+1}_graded.mp4"

        # Color grading filter: scale & crop to 1080x1920, add dark navy tint (#0F172A at 38% opacity)
        vf = (
            "scale=1080:1920:force_original_aspect_ratio=increase,"
            "crop=1080:1920,"
            "drawbox=x=0:y=0:w=1080:h=1920:color=0x0F172A@0.38:t=fill,"
            f"fps=30"
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

    # Concat video clips
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

    # 5. Final Composite: Composite OCR Brand Overlay + Burn in kinetic subtitles + mix audio
    lofi_beats = list(LOFI_DIR.glob("*.wav")) + list(LOFI_DIR.glob("*.mp3"))
    lofi_path = lofi_beats[0] if lofi_beats else None

    cmd_final = [
        FFMPEG_EXE, "-y",
        "-i", str(broll_merged),
        "-i", str(ocr_overlay_png),
        "-i", str(spoken_audio_path),
    ]

    # Overlay OCR bar onto video, then burn ASS subtitles onto the result
    filter_chain = f"[0:v][1:v]overlay=0:0[v_branded];[v_branded]ass={ass_path}[v_sub]"

    if lofi_path:
        cmd_final.extend([
            "-stream_loop", "-1", "-i", str(lofi_path),
            "-filter_complex",
            f"{filter_chain};"
            f"[2:a]apad=pad_dur=2[v_pad];[3:a]volume=0.12[bg];[v_pad][bg]amix=inputs=2:duration=first[a_mix]",
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

    cmd_final.extend([
        "-c:v", "libx264",
        "-crf", "20",
        "-preset", "fast",
        "-pix_fmt", "yuv420p",
        "-c:a", "aac",
        "-b:a", "192k",
        "-t", f"{total_dur:.2f}",
        "-movflags", "+faststart",
        str(output_mp4_path)
    ])
    subprocess.run(cmd_final, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print(f"  🎬 Successfully rendered Master B-Roll Reel: {output_mp4_path} ({output_mp4_path.stat().st_size / 1024 / 1024:.2f} MB)")
    return output_mp4_path

def synthesize_human_voiceover(script_text: str, output_path: Path, voice: str = "en-GB-RyanNeural") -> Tuple[bool, float]:
    """Generate human-like British neural voiceover using Edge-TTS or ElevenLabs."""
    import certifi
    os.environ["SSL_CERT_FILE"] = certifi.where()

    clean_text = script_text.replace("'", "'").replace('"', "").replace("\n", " ")

    # 1. ElevenLabs API Check (if configured)
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
                output_path.write_bytes(res.content)
                dur = get_audio_duration_seconds(output_path)
                print(f"  🎙️ Generated ultra-realistic voiceover via ElevenLabs ({dur:.1f}s)!")
                return True, dur
        except Exception as e:
            print(f"  ⚠️ ElevenLabs fallback: {e}")

    # 2. Microsoft Azure Edge-TTS Neural Voice (100% Free, Studio Quality)
    try:
        import asyncio
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
        print(f"  ⚠️ Edge-TTS error ({e}), falling back...")

    # 3. macOS say fallback only if network completely down
    aiff_tmp = output_path.with_suffix(".aiff")
    subprocess.run(["say", "-v", "Daniel", "-o", str(aiff_tmp), clean_text], check=True)
    subprocess.run([FFMPEG_EXE, "-y", "-i", str(aiff_tmp), "-b:a", "192k", str(output_path)], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    if aiff_tmp.exists():
        aiff_tmp.unlink()
    dur = get_audio_duration_seconds(output_path)
    return True, dur

def get_audio_duration_seconds(audio_path: Path) -> float:
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

if __name__ == "__main__":
    plan_path = SCRIPT_DIR / "weekly_social_plan.json"
    with open(plan_path) as f:
        plan = json.load(f)
    recipe = plan["schedule"]["Monday"]["afternoon"]
    recipe["badge"] = "CORE SERVICE: LAW ASSIGNMENT HELP UK"
    recipe["hook_headline"] = "Score 78%+ in Contract, Tort & Criminal Law"
    
    spoken_text = (
        "If you need law assignment help for your university coursework, stop losing marks on weak critical analysis. "
        "Most students just summarize what authors said, capping their grade at fifty-four percent. "
        "The first-class fix: Never just summarize. Critique their sample size, highlight the limitation, and state your own academic verdict. "
        "Save this reel for your next deadline, and WhatsApp Academic Wizard for one-on-one law assignment help and grade protection."
    )
    recipe["spoken_script"] = spoken_text

    human_audio = PUBLIC_SOCIAL_DIR / "broll_render_temp" / "human_voiceover.mp3"
    ok, dur = synthesize_human_voiceover(spoken_text, human_audio)

    out_broll_reel = PUBLIC_SOCIAL_DIR / "master_broll_kinetic_reel.mp4"
    assemble_professional_broll_reel(recipe, human_audio, dur, out_broll_reel)
