#!/usr/bin/env python3
"""
Generate royalty-free ambient lo-fi study beats using pure Python.
These are 100% algorithmically generated — zero copyright risk.
Each clip is a calm, warm ambient pad suitable for Instagram/TikTok/Facebook Reels.

Output: 4 WAV files (~15 seconds each) in automation/lofi_beats/
"""

import math
import os
import random
import struct
import wave
from pathlib import Path

BEATS_DIR = Path(__file__).resolve().parent / "lofi_beats"
BEATS_DIR.mkdir(parents=True, exist_ok=True)

SAMPLE_RATE = 44100
DURATION = 16  # seconds
CHANNELS = 2  # stereo
SAMPLE_WIDTH = 2  # 16-bit


def generate_sine(freq: float, duration: float, volume: float = 0.3, sr: int = SAMPLE_RATE) -> list:
    """Generate a sine wave at given frequency."""
    samples = []
    num = int(sr * duration)
    for i in range(num):
        t = i / sr
        val = volume * math.sin(2 * math.pi * freq * t)
        samples.append(val)
    return samples


def apply_envelope(samples: list, attack: float = 2.0, release: float = 2.0, sr: int = SAMPLE_RATE) -> list:
    """Apply fade-in and fade-out envelope."""
    attack_samples = int(attack * sr)
    release_samples = int(release * sr)
    total = len(samples)
    result = []
    for i, s in enumerate(samples):
        if i < attack_samples:
            s *= i / attack_samples
        elif i > total - release_samples:
            s *= (total - i) / release_samples
        result.append(s)
    return result


def mix_tracks(*tracks) -> list:
    """Mix multiple sample lists together."""
    length = max(len(t) for t in tracks)
    result = [0.0] * length
    for track in tracks:
        for i, s in enumerate(track):
            result[i] += s
    # Normalize
    peak = max(abs(s) for s in result) or 1.0
    if peak > 0.95:
        result = [s * 0.9 / peak for s in result]
    return result


def add_warmth(samples: list, sr: int = SAMPLE_RATE) -> list:
    """Add subtle warm low-pass filtering effect via simple moving average."""
    window = 8
    result = list(samples)
    for i in range(window, len(result)):
        avg = sum(result[i - window:i]) / window
        result[i] = result[i] * 0.4 + avg * 0.6
    return result


def write_wav(filepath: Path, samples: list, sr: int = SAMPLE_RATE):
    """Write stereo 16-bit WAV file."""
    with wave.open(str(filepath), 'w') as wf:
        wf.setnchannels(CHANNELS)
        wf.setsampwidth(SAMPLE_WIDTH)
        wf.setframerate(sr)
        for s in samples:
            val = max(-1.0, min(1.0, s))
            int_val = int(val * 32767)
            # Stereo: write same value to both channels
            frame = struct.pack('<hh', int_val, int_val)
            wf.writeframes(frame)


def generate_ambient_pad_1():
    """Warm C major ambient pad — calm study vibe."""
    # C3 + E3 + G3 chord with gentle detuning
    c3 = generate_sine(130.81, DURATION, 0.20)
    e3 = generate_sine(164.81, DURATION, 0.15)
    g3 = generate_sine(196.00, DURATION, 0.15)
    # Sub-bass hum
    sub = generate_sine(65.41, DURATION, 0.10)
    # High shimmer
    shimmer = generate_sine(523.25, DURATION, 0.05)
    
    mixed = mix_tracks(c3, e3, g3, sub, shimmer)
    mixed = apply_envelope(mixed, attack=3.0, release=3.0)
    mixed = add_warmth(mixed)
    return mixed


def generate_ambient_pad_2():
    """Am7 dreamy pad — melancholic lo-fi feel."""
    a2 = generate_sine(110.00, DURATION, 0.18)
    c3 = generate_sine(130.81, DURATION, 0.15)
    e3 = generate_sine(164.81, DURATION, 0.14)
    g3 = generate_sine(196.00, DURATION, 0.12)
    # Octave shimmer
    a4 = generate_sine(440.00, DURATION, 0.04)
    
    mixed = mix_tracks(a2, c3, e3, g3, a4)
    mixed = apply_envelope(mixed, attack=2.5, release=3.5)
    mixed = add_warmth(mixed)
    return mixed


def generate_ambient_pad_3():
    """Dm9 jazzy pad — coffee shop lo-fi."""
    d2 = generate_sine(73.42, DURATION, 0.16)
    f3 = generate_sine(174.61, DURATION, 0.14)
    a3 = generate_sine(220.00, DURATION, 0.13)
    c4 = generate_sine(261.63, DURATION, 0.11)
    e4 = generate_sine(329.63, DURATION, 0.06)
    
    mixed = mix_tracks(d2, f3, a3, c4, e4)
    mixed = apply_envelope(mixed, attack=2.0, release=4.0)
    mixed = add_warmth(mixed)
    return mixed


def generate_ambient_pad_4():
    """Fmaj7 ethereal pad — dreamy night study."""
    f2 = generate_sine(87.31, DURATION, 0.17)
    a2 = generate_sine(110.00, DURATION, 0.14)
    c3 = generate_sine(130.81, DURATION, 0.13)
    e3 = generate_sine(164.81, DURATION, 0.12)
    # High ethereal overtone
    f5 = generate_sine(698.46, DURATION, 0.03)
    
    mixed = mix_tracks(f2, a2, c3, e3, f5)
    mixed = apply_envelope(mixed, attack=3.5, release=3.0)
    mixed = add_warmth(mixed)
    return mixed


def main():
    generators = [
        ("lofi_study_calm.wav", generate_ambient_pad_1),
        ("lofi_study_dreamy.wav", generate_ambient_pad_2),
        ("lofi_study_coffee.wav", generate_ambient_pad_3),
        ("lofi_study_night.wav", generate_ambient_pad_4),
    ]
    
    for filename, gen_func in generators:
        filepath = BEATS_DIR / filename
        print(f"🎵 Generating {filename}...")
        samples = gen_func()
        write_wav(filepath, samples)
        size_kb = os.path.getsize(filepath) / 1024
        print(f"   ✅ Saved: {filepath} ({size_kb:.0f} KB, {DURATION}s)")
    
    print(f"\n🎶 Generated {len(generators)} lo-fi study beats in {BEATS_DIR}/")


if __name__ == "__main__":
    main()
