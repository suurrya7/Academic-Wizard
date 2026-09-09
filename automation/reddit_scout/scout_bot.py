#!/usr/bin/env python3
"""
Academic Wizard — Unified Streamlit Keep-Alive & Reddit Commercial Scout Bot
1. Pings Streamlit AI Humanizer app to maintain 24/7 uptime on free tier.
2. Scouts Reddit for ALL commercial services & tools, posting contextual backlinks.
"""

import os
import sys
import json
import time
import argparse
from datetime import datetime, timezone
import requests
try:
    import praw
except ImportError:
    praw = None

try:
    from persona_prompts import get_commercial_prompt
except ImportError:
    from automation.reddit_scout.persona_prompts import get_commercial_prompt

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
INTENTS_PATH = os.path.join(SCRIPT_DIR, "commercial_intents.json")
HISTORY_PATH = os.path.join(SCRIPT_DIR, "scout_history.json")

STREAMLIT_URL = "https://academic-wizard.streamlit.app/"

def ping_streamlit_app(url: str = STREAMLIT_URL):
    """Pings Streamlit app to prevent free-tier container sleep."""
    print(f"💓 [Keep-Alive] Checking Streamlit container at {url}...")
    try:
        resp = requests.get(url, timeout=20, headers={"User-Agent": "AcademicWizardUptime/1.0"})
        if resp.status_code in [200, 304]:
            print(f"   ✅ Streamlit app is ACTIVE and warm (HTTP {resp.status_code})")
        else:
            print(f"   ⏳ Ping sent (HTTP {resp.status_code}) — container waking up.")
        return True
    except Exception as e:
        print(f"   ⚠️ Streamlit ping notice: {e}")
        return False

def load_intents():
    with open(INTENTS_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def load_history():
    if os.path.exists(HISTORY_PATH):
        try:
            with open(HISTORY_PATH, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return {
        "last_run": None,
        "daily_count": {"date": None, "count": 0},
        "replied_post_ids": [],
        "history": []
    }

def save_history(history):
    history["last_run"] = datetime.now(timezone.utc).isoformat()
    with open(HISTORY_PATH, "w", encoding="utf-8") as f:
        json.dump(history, f, indent=2)

def match_query_intent(title: str, body: str, intents_data: dict):
    combined = f"{title} {body}".lower()
    
    # Priority 1: Check specialized commercial services
    for cat_key, cat_data in intents_data.get("services", {}).items():
        for kw in cat_data["keywords"]:
            if kw in combined:
                return ("service", cat_key, cat_data)

    # Priority 2: Check tools
    for tool_key, tool_data in intents_data.get("tools", {}).items():
        for kw in tool_data["keywords"]:
            if kw in combined:
                return ("tool", tool_key, tool_data)

    return None

def generate_humanized_reply(cat_data: dict, title: str, body: str, api_key: str) -> str:
    prompt = get_commercial_prompt(cat_data, title, body)
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}"
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.75,
            "maxOutputTokens": 450
        }
    }
    
    response = requests.post(url, json=payload, headers={"Content-Type": "application/json"}, timeout=30)
    if response.status_code != 200:
        raise RuntimeError(f"Gemini API error {response.status_code}: {response.text}")
        
    data = response.json()
    reply_text = data["candidates"][0]["content"]["parts"][0]["text"].strip()
    return reply_text

def main():
    parser = argparse.ArgumentParser(description="Academic Wizard — Streamlit Keeper & Reddit Scout")
    parser.add_argument("--dry-run", action="store_true", help="Run without posting to Reddit")
    parser.add_argument("--skip-ping", action="store_true", help="Skip Streamlit keep-alive ping")
    parser.add_argument("--max-posts", type=int, default=1, help="Max comments to post in this run")
    args = parser.parse_args()

    print("========================================================")
    print("⚡ ACADEMIC WIZARD — STREAMLIT KEEPER & REDDIT SCOUT")
    print("========================================================\n")

    # 1. Keep Streamlit Alive
    if not args.skip_ping:
        ping_streamlit_app()
        print("")

    # 2. Reddit Scout Setup
    gemini_key = os.getenv("GEMINI_API_KEY")
    if not gemini_key:
        print("❌ Error: GEMINI_API_KEY environment variable is required.")
        sys.exit(1)

    reddit_client_id = os.getenv("REDDIT_CLIENT_ID")
    reddit_client_secret = os.getenv("REDDIT_CLIENT_SECRET")
    reddit_username = os.getenv("REDDIT_USERNAME")
    reddit_password = os.getenv("REDDIT_PASSWORD")

    if not args.dry_run and not (reddit_client_id and reddit_client_secret and reddit_username and reddit_password):
        print("❌ Error: Reddit OAuth credentials required (REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET, REDDIT_USERNAME, REDDIT_PASSWORD).")
        print("   Run with --dry-run to test simulation without credentials.")
        sys.exit(1)

    intents_data = load_intents()
    history = load_history()
    today_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    if history["daily_count"].get("date") != today_str:
        history["daily_count"] = {"date": today_str, "count": 0}

    # Safety Guardrail: Maximum 3 comments per day across the entire account
    if history["daily_count"]["count"] >= 3 and not args.dry_run:
        print(f"🛡️ Safety Guardrail Active: Daily comment quota (3/3) reached for {today_str}.")
        print("   Skipping Reddit posting to protect account karma and prevent spam flags.")
        return

    # Build unique list of subreddits to monitor
    subreddits_to_scan = set()
    for cat in intents_data.get("services", {}).values():
        subreddits_to_scan.update(cat.get("subreddits", []))
    for cat in intents_data.get("tools", {}).values():
        subreddits_to_scan.update(cat.get("subreddits", []))

    # Initialize Reddit connection
    if praw is None:
        print("⚠️ Warning: 'praw' package is not installed in local environment.")
        print("   (It will be automatically installed by GitHub Actions from requirements.txt during cron runs.)")
        if not args.dry_run:
            sys.exit(1)
        print("   Skipping Reddit scan in dry run due to missing praw.")
        return

    reddit = None
    if not args.dry_run:
        reddit = praw.Reddit(
            client_id=reddit_client_id,
            client_secret=reddit_client_secret,
            username=reddit_username,
            password=reddit_password,
            user_agent=f"AcademicWizardScout:v1.0 (by /u/{reddit_username})"
        )
        print(f"✅ Authenticated to Reddit API as /u/{reddit_username}")
    else:
        # Praw read-only mode requires client_id and user_agent
        reddit = praw.Reddit(
            client_id=reddit_client_id or "dummy_id",
            client_secret=reddit_client_secret or "dummy_secret",
            user_agent="AcademicWizardScoutDryRun:v1.0"
        )
        print("🔍 Running in DRY-RUN mode (Read-only Reddit connection).")

    print(f"📡 Monitoring {len(subreddits_to_scan)} academic subreddits across all services & tools:\n")
    print(", ".join(sorted(subreddits_to_scan)) + "\n")

    replied_in_this_run = 0

    for sub_name in sorted(subreddits_to_scan):
        if replied_in_this_run >= args.max_posts:
            break

        try:
            sub = reddit.subreddit(sub_name)
            for post in sub.new(limit=15):
                if replied_in_this_run >= args.max_posts:
                    break

                if post.id in history["replied_post_ids"]:
                    continue

                matched = match_query_intent(post.title, post.selftext, intents_data)
                if not matched:
                    continue

                scope_type, cat_key, cat_data = matched

                print(f"🎯 [MATCH FOUND] in r/{sub_name}!")
                print(f"   Category:   {cat_data['name']} ({scope_type.upper()})")
                print(f"   Target URL: {cat_data['target_url']}")
                print(f"   Post Title: {post.title}")
                print(f"   Reddit URL: https://reddit.com{post.permalink}")

                try:
                    print("   🤖 Drafting contextual, humanized reply via Gemini...")
                    reply_text = generate_humanized_reply(cat_data, post.title, post.selftext, gemini_key)
                    
                    print("\n--- GENERATED DRAFT REPLY ---")
                    print(reply_text)
                    print("-----------------------------\n")

                    if not args.dry_run:
                        print("   🚀 Submitting comment to Reddit...")
                        submission = reddit.submission(id=post.id)
                        comment = submission.reply(reply_text)
                        print(f"   ✅ Comment successfully posted! (Comment ID: {comment.id})")
                    else:
                        print("   [DRY RUN] Would submit comment with backlink.")

                    # Record history
                    history["replied_post_ids"].append(post.id)
                    history["daily_count"]["count"] += 1
                    history["history"].append({
                        "post_id": post.id,
                        "subreddit": sub_name,
                        "category": cat_data["name"],
                        "target_url": cat_data["target_url"],
                        "title": post.title,
                        "posted_at": datetime.now(timezone.utc).isoformat(),
                        "url": f"https://reddit.com{post.permalink}"
                    })
                    save_history(history)

                    replied_in_this_run += 1
                    print(f"   💾 Saved post ID (Daily Count: {history['daily_count']['count']}/3)\n")

                except Exception as e:
                    print(f"   ⚠️ Error processing post {post.id}: {e}\n")

        except Exception as e:
            # Subreddit might be private or restricted, continue scanning others
            pass

    print("========================================================")
    print(f"✅ Run complete. Streamlit pinged: Yes | Comments posted: {replied_in_this_run}")
    print("========================================================\n")

if __name__ == "__main__":
    main()
