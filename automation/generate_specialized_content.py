#!/usr/bin/env python3
import json
import os
import sys
import time
import urllib.request
import urllib.error
import ssl
from pathlib import Path

# Fix macOS Python SSL certificate issues
ssl._create_default_https_context = ssl._create_unverified_context

SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent
SPECIALIZED_JSON_PATH = SCRIPT_DIR / "specialized.json"
OUTPUT_JSON_PATH = PROJECT_ROOT / "src" / "data" / "specializedContent.json"

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Using a reliable model
MODEL_NAME = os.getenv("GEMINI_MODEL", "gemini-3.5-flash-lite")

def call_gemini(prompt: str) -> str:
    if not GEMINI_API_KEY:
        return f"<p>This is a placeholder for the generated SEO content. When run with a valid <code>GEMINI_API_KEY</code>, this will be replaced with 500+ words of rich, localized content.</p><h2>Local Academic Support</h2><p>Our experts understand the specific academic guidelines and standards in this region.</p>"

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL_NAME}:generateContent?key={GEMINI_API_KEY}"
    headers = {'Content-Type': 'application/json'}
    data = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"temperature": 0.7}
    }
    
    for attempt in range(3):
        try:
            req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers=headers)
            with urllib.request.urlopen(req) as response:
                result = json.loads(response.read().decode('utf-8'))
                text = result['candidates'][0]['content']['parts'][0]['text'].strip()
                # Remove markdown html formatting if present
                if text.startswith("```html"):
                    text = text[7:]
                if text.startswith("```"):
                    text = text[3:]
                if text.endswith("```"):
                    text = text[:-3]
                return text.strip()
        except Exception as e:
            print(f"Error calling Gemini: {e}. Retrying in {2 ** attempt} seconds...")
            time.sleep(2 ** attempt)
    return ""

def main():
    if not SPECIALIZED_JSON_PATH.exists():
        print(f"Error: {SPECIALIZED_JSON_PATH} not found.")
        sys.exit(1)

    with open(SPECIALIZED_JSON_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Load existing to avoid re-generating
    existing_content = {}
    if OUTPUT_JSON_PATH.exists():
        try:
            with open(OUTPUT_JSON_PATH, "r", encoding="utf-8") as f:
                existing_content = json.load(f)
        except json.JSONDecodeError:
            pass

    country_subjects = data.get("countrySubjects", {})
    country_cities = data.get("countryCities", {})

    total_generated = 0
    
    # 1. Generate for Subjects
    for country, subjects in country_subjects.items():
        for subject in subjects:
            key = f"{country}-{subject['slug']}"
            if key in existing_content and len(existing_content[key]) > 100:
                continue
                
            print(f"Generating content for Subject: {key}")
            prompt = f"""
You are an expert academic SEO copywriter. Write a 500+ word localized, engaging, and highly informative SEO content block for our academic support service.
Service: {subject.get('title')}
Country: {country.upper()}
Description: {subject.get('desc')}
Target Keywords: {subject.get('targetKeyword')}

The content should be formatted as clean HTML (just paragraphs, h2/h3 tags, ul/li). NO markdown wrappers like ```html. Do not include <html> or <body> tags.
Focus on how Academic Wizard helps students in {country.upper()} specifically with {subject.get('title')}. Include local academic context (e.g. university standards in {country.upper()}, referencing styles). 
Crucially, do NOT offer illegal services (like contract cheating or writing essays for them). Instead, focus strictly on "academic guidance", "editing", "proofreading", "research support", "model answers", and "methodology coaching".
            """
            content = call_gemini(prompt)
            if content:
                existing_content[key] = content
                total_generated += 1
                
                # Save incrementally
                with open(OUTPUT_JSON_PATH, "w", encoding="utf-8") as f:
                    json.dump(existing_content, f, indent=2)
                
                time.sleep(4.2) # strict 15 RPM free tier rate limit protection
                
            # Removed early termination for full run

    # 2. Generate for Cities
    for country, cities in country_cities.items():
        for city in cities:
            key = f"{country}-{city['slug']}"
            if key in existing_content and len(existing_content[key]) > 100:
                continue
                
            print(f"Generating content for City: {key}")
            prompt = f"""
You are an expert academic SEO copywriter. Write a 500+ word localized, engaging, and highly informative SEO content block for our academic support service.
City/Region: {city.get('name')}
Country: {country.upper()}
Target Keywords: {city.get('targetKeyword')}

The content should be formatted as clean HTML (just paragraphs, h2/h3 tags, ul/li). NO markdown wrappers like ```html. Do not include <html> or <body> tags.
Focus on how Academic Wizard helps students in {city.get('name')} specifically. Mention local university culture and rigorous academic standards in {city.get('name')}.
Crucially, do NOT offer illegal services (like contract cheating or writing essays for them). Instead, focus strictly on "academic guidance", "editing", "proofreading", "research support", "model answers", and "methodology coaching".
            """
            content = call_gemini(prompt)
            if content:
                existing_content[key] = content
                total_generated += 1
                
                # Save incrementally
                with open(OUTPUT_JSON_PATH, "w", encoding="utf-8") as f:
                    json.dump(existing_content, f, indent=2)
                
                time.sleep(4.2) # strict 15 RPM free tier rate limit protection

    print(f"Finished. Generated {total_generated} new content blocks.")
    print(f"Saved to {OUTPUT_JSON_PATH}")

if __name__ == "__main__":
    main()
