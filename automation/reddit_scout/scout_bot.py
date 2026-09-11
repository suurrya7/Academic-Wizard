#!/usr/bin/env python3
"""
Academic Wizard — Unified Streamlit Keep-Alive & Reddit Commercial Scout Bot
1. Pings Streamlit AI Humanizer app to maintain 24/7 uptime on free tier.
2. Scouts Reddit for ALL commercial services & tools, posting contextual backlinks.
3. Supports Reddit Session Cookie authentication (bypassing the closed Reddit API).
"""

import os
import sys
import json
import time
import html
import re
import argparse
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
import requests

try:
    import praw
except ImportError:
    praw = None

try:
    from persona_prompts import get_commercial_prompt, inject_human_quirks, get_karma_prompt
except ImportError:
    from automation.reddit_scout.persona_prompts import get_commercial_prompt, inject_human_quirks, get_karma_prompt

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
INTENTS_PATH = os.path.join(SCRIPT_DIR, "commercial_intents.json")
HISTORY_PATH = os.path.join(SCRIPT_DIR, "scout_history.json")

STREAMLIT_URL = "https://academic-wizard.streamlit.app/"

def ping_streamlit_app(url: str = STREAMLIT_URL):
    """Lightweight ping for Streamlit app (full browser keep-awake handled by keep-streamlit-awake.yml)."""
    print(f"💓 [Keep-Alive] Checking Streamlit container at {url}...")
    try:
        resp = requests.get(url, timeout=15, allow_redirects=False, headers={"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"})
        if resp.status_code in [200, 302, 303, 304]:
            print(f"   ✅ Streamlit edge proxy responded (HTTP {resp.status_code})")
        else:
            print(f"   ⏳ Ping sent (HTTP {resp.status_code})")
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
        "last_comment_posted_at": None,
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

def generate_humanized_reply(cat_data: dict, title: str, body: str, api_key: str, model_name: str = "gemini-2.0-flash", include_link: bool = True) -> str:
    prompt = get_commercial_prompt(cat_data, title, body, include_link=include_link)
    
    # Priority list of models to try
    models_to_try = []
    for m in [model_name, "gemini-2.0-flash", "gemini-2.5-flash", "gemini-1.5-flash"]:
        if m:
            clean = m.replace("models/", "").strip()
            if clean and clean not in models_to_try:
                models_to_try.append(clean)

    last_error = None
    for m in models_to_try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{m}:generateContent?key={api_key}"
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {
                "temperature": 0.75,
                "maxOutputTokens": 450
            }
        }
        try:
            response = requests.post(url, json=payload, headers={"Content-Type": "application/json"}, timeout=30)
            if response.status_code == 200:
                data = response.json()
                reply_text = data["candidates"][0]["content"]["parts"][0]["text"].strip()
                print(f"   ✨ Generated response using model: {m}")
                return reply_text
            else:
                last_error = f"HTTP {response.status_code}: {response.text[:200]}"
        except Exception as e:
            last_error = str(e)
            
    raise RuntimeError(f"Gemini API error with all attempted models {models_to_try}. Last error: {last_error}")

KARMA_SUBREDDITS = ["AskReddit", "NoStupidQuestions", "CasualConversation", "college", "Advice"]

def generate_karma_reply(title: str, body: str, subreddit: str, api_key: str, model_name: str = "gemini-2.0-flash") -> str:
    """Generates an authentic, witty, high-upvote answer with ZERO promotional content or links."""
    prompt = get_karma_prompt(title, body, subreddit)
    
    models_to_try = []
    for m in [model_name, "gemini-2.0-flash", "gemini-2.5-flash", "gemini-1.5-flash"]:
        if m:
            clean = m.replace("models/", "").strip()
            if clean and clean not in models_to_try:
                models_to_try.append(clean)

    last_error = None
    for m in models_to_try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{m}:generateContent?key={api_key}"
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {
                "temperature": 0.85,
                "maxOutputTokens": 200
            }
        }
        try:
            response = requests.post(url, json=payload, headers={"Content-Type": "application/json"}, timeout=30)
            if response.status_code == 200:
                data = response.json()
                reply_text = data["candidates"][0]["content"]["parts"][0]["text"].strip()
                # Defensive anti-promo filter: guarantee NO URLs or markdown links appear in karma comments
                reply_text = re.sub(r'https?://\S+', '', reply_text)
                reply_text = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', reply_text)
                print(f"   ✨ Generated karma response using model: {m}")
                return reply_text
            else:
                last_error = f"HTTP {response.status_code}: {response.text[:200]}"
        except Exception as e:
            last_error = str(e)
            
    raise RuntimeError(f"Gemini API error with all attempted models {models_to_try}. Last error: {last_error}")

def is_good_karma_question(title: str) -> bool:
    """Verifies that the post is an engaging, open-ended question suitable for witty/relatable replies."""
    t = title.strip().lower()
    if t.endswith("?"):
        return True
    question_starters = (
        "what", "why", "how", "who", "when", "where", "which",
        "is it", "does anyone", "do you", "has anyone", "can someone",
        "would you", "what's", "whats", "reddit,"
    )
    return any(t.startswith(q) for q in question_starters)

def find_best_karma_post(session_client, praw_reddit, replied_ids: list, recent_subs: set) -> dict:
    """
    Finds the highest-potential fresh rising question to comment on for maximum upvotes.
    """
    candidates = []
    
    for sub in KARMA_SUBREDDITS:
        if sub in recent_subs:
            continue
            
        posts = []
        if session_client:
            posts = session_client.fetch_posts(sub, limit=15, sort="rising")
            if not posts:
                posts = session_client.fetch_posts(sub, limit=15, sort="new")
        elif praw_reddit:
            try:
                sub_obj = praw_reddit.subreddit(sub)
                for p in list(sub_obj.rising(limit=10)) or list(sub_obj.new(limit=10)):
                    posts.append({
                        "id": p.id,
                        "title": p.title,
                        "body": p.selftext,
                        "permalink": p.permalink,
                        "created_utc": float(getattr(p, "created_utc", 0.0)),
                        "num_comments": int(getattr(p, "num_comments", 0)),
                        "over_18": bool(getattr(p, "over_18", False)),
                        "subreddit": sub
                    })
            except Exception:
                pass

        now_ts = datetime.now(timezone.utc).timestamp()
        for p in posts:
            if p["id"] in replied_ids:
                continue
            if p.get("over_18"):
                continue
            if not is_good_karma_question(p["title"]):
                continue

            created = p.get("created_utc", 0.0)
            if created > 0:
                age_hours = (now_ts - created) / 3600
                # Must be between 10 mins and 6.0 hours old (ideal window for rising questions)
                if age_hours < 0.15 or age_hours > 6.0:
                    continue
                p["age_hours"] = age_hours
            else:
                p["age_hours"] = 1.0

            candidates.append(p)

    if not candidates:
        return None

    # Pick candidate closest to ~1.2 hours old (ideal momentum before thread gets saturated)
    candidates.sort(key=lambda x: abs(x.get("age_hours", 1.5) - 1.2))
    return candidates[0]

class RedditSessionClient:
    """Authenticates and posts to Reddit using the standard web login session cookie."""
    def __init__(self, session_cookie: str):
        cookie_val = session_cookie.strip()
        if "reddit_session=" in cookie_val:
            cookie_val = cookie_val.split("reddit_session=")[1].split(";")[0].strip()

        self.session = requests.Session()
        self.session.headers.update({
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            "Accept-Language": "en-US,en;q=0.9"
        })
        self.session.cookies.set("reddit_session", cookie_val, domain=".reddit.com")
        self.modhash = None
        self.username = None
        self.comment_karma = 0
        self.link_karma = 0

    def authenticate(self) -> bool:
        """Verifies session cookie and retrieves the modhash CSRF token and account karma."""
        try:
            resp = self.session.get("https://old.reddit.com/api/me.json", timeout=15)
            if resp.status_code == 200:
                data = resp.json()
                if "data" in data and "modhash" in data["data"]:
                    self.modhash = data["data"]["modhash"]
                    self.username = data["data"].get("name", "User")
                    self.comment_karma = int(data["data"].get("comment_karma", 0))
                    self.link_karma = int(data["data"].get("link_karma", 0))
                    print(f"✅ Authenticated via Reddit Session Cookie as /u/{self.username} (Comment Karma: {self.comment_karma}, Link Karma: {self.link_karma})")
                    return True
            print(f"⚠️ Reddit session check failed (HTTP {resp.status_code}). Cookie might be expired.")
            return False
        except Exception as e:
            print(f"⚠️ Error verifying Reddit session: {e}")
            return False

    def fetch_posts(self, sub_name: str, limit: int = 15, sort: str = "new") -> list:
        """Fetches latest posts from a subreddit using authenticated session or RSS."""
        posts = []
        # Attempt 1: Authenticated .json feed
        try:
            url = f"https://old.reddit.com/r/{sub_name}/{sort}.json?limit={limit}"
            resp = self.session.get(url, timeout=12)
            if resp.status_code == 200:
                data = resp.json()
                children = data.get("data", {}).get("children", [])
                for c in children:
                    pdata = c.get("data", {})
                    if pdata.get("id"):
                        posts.append({
                            "id": pdata["id"],
                            "title": pdata.get("title", ""),
                            "body": pdata.get("selftext", ""),
                            "permalink": pdata.get("permalink", f"/r/{sub_name}/comments/{pdata['id']}"),
                            "created_utc": float(pdata.get("created_utc", 0.0)),
                            "num_comments": int(pdata.get("num_comments", 0)),
                            "score": int(pdata.get("score", 0)),
                            "over_18": bool(pdata.get("over_18", False)),
                            "subreddit": sub_name
                        })
                if posts:
                    return posts
        except Exception:
            pass

        # Attempt 2: www.reddit / old.reddit RSS feeds
        for feed_host in ["https://www.reddit.com", "https://old.reddit.com"]:
            try:
                rss_url = f"{feed_host}/r/{sub_name}/{sort}.rss"
                resp = self.session.get(rss_url, timeout=12)
                if resp.status_code == 200 and "<feed" in resp.text:
                    root = ET.fromstring(resp.text)
                    ns = {"atom": "http://www.w3.org/2005/Atom"}
                    for entry in root.findall("atom:entry", ns)[:limit]:
                        id_elem = entry.find("atom:id", ns)
                        if id_elem is None or not id_elem.text:
                            continue
                        post_id = id_elem.text.strip().replace("t3_", "")
                        title = (entry.find("atom:title", ns).text or "").strip()
                        content_elem = entry.find("atom:content", ns)
                        content_raw = content_elem.text if content_elem is not None else ""
                        clean_body = re.sub(r"<[^<]+?>", " ", html.unescape(content_raw)).strip()
                        link_elem = entry.find("atom:link", ns)
                        link = link_elem.get("href") if link_elem is not None else f"https://reddit.com/r/{sub_name}/comments/{post_id}"
                        permalink = link.replace("https://www.reddit.com", "").replace("https://old.reddit.com", "")
                        
                        created_utc = 0.0
                        date_elem = entry.find("atom:updated", ns)
                        if date_elem is None:
                            date_elem = entry.find("atom:published", ns)
                        if date_elem is not None and date_elem.text:
                            try:
                                clean_iso = date_elem.text.strip().replace("Z", "+00:00")
                                dt = datetime.fromisoformat(clean_iso)
                                created_utc = dt.timestamp()
                            except Exception:
                                pass

                        posts.append({
                            "id": post_id,
                            "title": title,
                            "body": clean_body,
                            "permalink": permalink,
                            "created_utc": created_utc,
                            "num_comments": 0,
                            "score": 0,
                            "over_18": False,
                            "subreddit": sub_name
                        })
                    if posts:
                        return posts
            except Exception:
                pass

        return posts

    def post_comment(self, post_id: str, text: str) -> str:
        """Posts a comment to a Reddit post using the session cookie and modhash."""
        if not self.modhash:
            if not self.authenticate():
                raise RuntimeError("Cannot post comment: Reddit session is not authenticated.")

        thing_id = post_id if post_id.startswith("t3_") else f"t3_{post_id}"
        url = "https://old.reddit.com/api/comment"
        headers = {
            "Origin": "https://old.reddit.com",
            "Referer": f"https://old.reddit.com/comments/{post_id.replace('t3_', '')}",
            "X-Requested-With": "XMLHttpRequest"
        }
        data = {
            "api_type": "json",
            "thing_id": thing_id,
            "text": text,
            "uh": self.modhash
        }
        resp = self.session.post(url, data=data, headers=headers, timeout=20)
        if resp.status_code != 200:
            raise RuntimeError(f"Reddit comment submission failed (HTTP {resp.status_code}): {resp.text[:200]}")

        res_json = resp.json()
        errors = res_json.get("json", {}).get("errors", [])
        if errors:
            raise RuntimeError(f"Reddit returned errors: {errors}")

        things = res_json.get("json", {}).get("data", {}).get("things", [])
        return things[0]["data"]["id"] if things else "posted"

def main():
    parser = argparse.ArgumentParser(description="Academic Wizard — Streamlit Keeper & Reddit Scout")
    parser.add_argument("--dry-run", action="store_true", help="Run without posting to Reddit")
    parser.add_argument("--skip-ping", action="store_true", help="Skip Streamlit keep-alive ping")
    parser.add_argument("--max-posts", type=int, default=1, help="Max comments to post in this run")
    parser.add_argument("--mode", choices=["auto", "karma", "commercial"], default="auto",
                        help="Operation mode: 'auto' (smart ratio), 'karma' (build karma), or 'commercial' (backlink scout)")
    args = parser.parse_args()

    print("========================================================")
    print("⚡ ACADEMIC WIZARD — STREAMLIT KEEPER & REDDIT SCOUT")
    print("========================================================\n")

    # 1. Keep Streamlit Alive
    if not args.skip_ping:
        ping_streamlit_app()
        print("")

    # 2. Reddit Scout & Gemini Setup
    gemini_key = os.getenv("BACKLINK_GEMINI_API_KEY") or os.getenv("GEMINI_API_KEY")
    gemini_model = os.getenv("GEMINI_MODEL", "gemini-2.0-flash").strip() or "gemini-2.0-flash"
    if not gemini_key:
        print("❌ Error: BACKLINK_GEMINI_API_KEY or GEMINI_API_KEY environment variable is required.")
        sys.exit(1)

    session_cookie = os.getenv("REDDIT_SESSION_COOKIE")
    reddit_client_id = os.getenv("REDDIT_CLIENT_ID")
    reddit_client_secret = os.getenv("REDDIT_CLIENT_SECRET")
    reddit_username = os.getenv("REDDIT_USERNAME")
    reddit_password = os.getenv("REDDIT_PASSWORD")

    mode = None
    if session_cookie:
        mode = "cookie"
    elif reddit_client_id and reddit_client_secret and reddit_username and reddit_password:
        mode = "oauth"
    elif args.dry_run:
        mode = "dry_run"
    else:
        print("❌ Error: Reddit credentials required.")
        print("   Please provide REDDIT_SESSION_COOKIE (recommended) in GitHub Secrets,")
        print("   or official OAuth credentials (REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET, REDDIT_USERNAME, REDDIT_PASSWORD).")
        print("   Run with --dry-run to test simulation without credentials.")
        sys.exit(1)

    intents_data = load_intents()
    history = load_history()
    today_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    if history["daily_count"].get("date") != today_str:
        history["daily_count"] = {"date": today_str, "count": 0}

    # Load configurable limits from environment/secrets (with safe defaults)
    try:
        max_daily = int(os.getenv("MAX_DAILY_COMMENTS") or os.getenv("REDDIT_DAILY_LIMIT") or 3)
    except ValueError:
        max_daily = 3

    try:
        cooldown_mins = int(os.getenv("MIN_COOLDOWN_MINUTES") or os.getenv("REDDIT_COOLDOWN_MINUTES") or 150)
    except ValueError:
        cooldown_mins = 150

    MIN_COOLDOWN_SECONDS = cooldown_mins * 60

    # Safety Guardrail 1: Daily comment quota across the entire account
    if history["daily_count"]["count"] >= max_daily and not args.dry_run:
        print(f"🛡️ Safety Guardrail Active: Daily comment quota ({history['daily_count']['count']}/{max_daily}) reached for {today_str}.")
        print("   Skipping Reddit posting to protect account karma and prevent spam flags.")
        return

    # Safety Guardrail 2: Minimum cooldown between comments
    last_posted_str = history.get("last_comment_posted_at")
    if last_posted_str and not args.dry_run:
        try:
            last_posted_dt = datetime.fromisoformat(last_posted_str)
            elapsed_seconds = (datetime.now(timezone.utc) - last_posted_dt).total_seconds()
            if elapsed_seconds < MIN_COOLDOWN_SECONDS:
                mins_left = int((MIN_COOLDOWN_SECONDS - elapsed_seconds) // 60)
                print(f"🛡️ Anti-Spam Guardrail: Last comment was posted {int(elapsed_seconds // 60)} mins ago.")
                print(f"   Cooldown active ({mins_left} mins remaining before next comment; target cooldown: {cooldown_mins}m).")
                print("   Skipping Reddit scan to maintain organic account pacing.")
                save_history(history)
                return
        except Exception:
            pass

    # Safety Guardrail 3: Subreddit Anti-Cluster (Never post in the same subreddit twice in 24 hours)
    recent_subs_24h = set()
    for h in history.get("history", []):
        try:
            posted_at = datetime.fromisoformat(h.get("posted_at", ""))
            if (datetime.now(timezone.utc) - posted_at).total_seconds() < 86400:
                recent_subs_24h.add(h.get("subreddit"))
        except Exception:
            pass

    # Build unique list of subreddits to monitor
    subreddits_to_scan = set()
    for cat in intents_data.get("services", {}).values():
        subreddits_to_scan.update(cat.get("subreddits", []))
    for cat in intents_data.get("tools", {}).values():
        subreddits_to_scan.update(cat.get("subreddits", []))

    # Initialize Client based on active mode
    session_client = None
    praw_reddit = None

    if mode == "cookie":
        session_client = RedditSessionClient(session_cookie)
        if not session_client.authenticate() and not args.dry_run:
            print("❌ Authentication failed with REDDIT_SESSION_COOKIE. Please check the secret.")
            sys.exit(1)
    elif mode == "oauth":
        if praw is None:
            print("⚠️ 'praw' is not installed. Installing via requirements.txt in GitHub Actions.")
            if not args.dry_run:
                sys.exit(1)
        else:
            praw_reddit = praw.Reddit(
                client_id=reddit_client_id,
                client_secret=reddit_client_secret,
                username=reddit_username,
                password=reddit_password,
                user_agent=f"AcademicWizardScout:v1.0 (by /u/{reddit_username})"
            )
            print(f"✅ Authenticated via OAuth as /u/{reddit_username}")
    else:
        print("🔍 Running in DRY-RUN mode.")
        session_client = RedditSessionClient("dry_run_dummy_cookie")

    print(f"📡 Monitoring {len(subreddits_to_scan)} academic subreddits across all services & tools:\n")
    print(", ".join(sorted(subreddits_to_scan)) + "\n")

    # Smart Account Warmup: Check Karma to prevent spam removal on fresh accounts
    user_comment_karma = getattr(session_client, "comment_karma", 0) if session_client else 0
    if praw_reddit:
        try:
            user_comment_karma = praw_reddit.user.me().comment_karma
        except Exception:
            pass

    force_links = os.getenv("FORCE_DIRECT_LINKS", "").lower() in ("true", "1", "yes")

    # If comment karma < 15, default to stealth brand mention mode (no raw hyperlinks) to avoid Reddit spam removal
    include_direct_link = True
    if user_comment_karma < 15 and not force_links:
        include_direct_link = False
        print(f"🛡️ Warm-up Safeguard: Account has {user_comment_karma} comment karma (< 15 threshold).")
        print("   Using natural brand mention mode (no raw hyperlinks) to protect account from Reddit automated spam removal.")
        print("   (Clickable markdown links will auto-enable once your account reaches 15+ karma, or set FORCE_DIRECT_LINKS=true).\n")
    else:
        print(f"🔗 Link Mode: Direct markdown backlinks ENABLED (Comment Karma: {user_comment_karma}).\n")

    try:
        max_post_age_hours = float(os.getenv("MAX_POST_AGE_HOURS") or 48.0)
    except ValueError:
        max_post_age_hours = 48.0

    # Determine Active Mode (Auto Karma Warmup vs Commercial Scout)
    active_mode = args.mode
    if active_mode == "auto":
        if user_comment_karma < 25:
            active_mode = "karma"
            print(f"🌱 [Karma Warmup Active] Account has {user_comment_karma} comment karma (< 25 threshold).")
            print("   Prioritizing high-upvote viral engagement on AskReddit/NoStupidQuestions to build authority & trust.\n")
        else:
            # Check recent history to maintain 2:1 organic ratio
            recent_posts = history.get("history", [])[-3:]
            recent_commercial = sum(1 for h in recent_posts if h.get("mode") == "commercial")
            if recent_commercial >= 1:
                active_mode = "karma"
                print(f"⚖️ [Ratio Balancing] Maintaining 2:1 organic ratio (Recent: {recent_commercial} commercial / {len(recent_posts)} total).")
                print("   Executing karma building post on r/AskReddit / r/NoStupidQuestions to protect account reputation.\n")
            else:
                active_mode = "commercial"
                print(f"🎯 [Commercial Scout Mode] Account karma is healthy ({user_comment_karma}).")
                print("   Executing commercial backlink scout across 72 academic subreddits.\n")

    replied_in_this_run = 0

    # -------------------------------------------------------------
    # HELPER: Post Karma Comment
    # -------------------------------------------------------------
    def try_post_karma_comment() -> bool:
        print(f"📡 Karma Engine: Scouting {len(KARMA_SUBREDDITS)} high-engagement subreddits ({', '.join(KARMA_SUBREDDITS)})...")
        karma_post = find_best_karma_post(session_client, praw_reddit, history.get("replied_post_ids", []), recent_subs_24h)
        if not karma_post:
            print("   ℹ️ No ideal fresh rising questions found at this moment. Will retry next cycle.\n")
            return False

        sub_name = karma_post["subreddit"]
        post_id = karma_post["id"]
        print(f"\n🎯 [KARMA QUESTION MATCH] in r/{sub_name}!")
        print(f"   Title: {karma_post['title']}")
        print(f"   Reddit URL: https://reddit.com{karma_post['permalink']}")

        try:
            print(f"   🤖 Drafting witty, authentic peer reply via Gemini ({gemini_model})...")
            raw_reply = generate_karma_reply(karma_post["title"], karma_post.get("body", ""), sub_name, gemini_key, model_name=gemini_model)
            reply_text = inject_human_quirks(raw_reply)

            print("\n--- GENERATED KARMA REPLY ---")
            print(reply_text)
            print("-----------------------------\n")

            if not args.dry_run:
                print("   🚀 Submitting comment to Reddit...")
                if session_client:
                    comment_id = session_client.post_comment(post_id, reply_text)
                else:
                    submission = praw_reddit.submission(id=post_id)
                    comment = submission.reply(reply_text)
                    comment_id = comment.id

                print(f"   ✅ Karma comment successfully posted! (Comment ID: {comment_id})")
                history["last_comment_posted_at"] = datetime.now(timezone.utc).isoformat()
            else:
                print("   [DRY RUN] Would submit karma comment.")

            # Record history
            history["replied_post_ids"].append(post_id)
            history["daily_count"]["count"] += 1
            history["history"].append({
                "post_id": post_id,
                "subreddit": sub_name,
                "mode": "karma",
                "title": karma_post["title"],
                "posted_at": datetime.now(timezone.utc).isoformat(),
                "url": f"https://reddit.com{karma_post['permalink']}"
            })
            save_history(history)
            print(f"   💾 Saved karma post ID (Daily Count: {history['daily_count']['count']}/{max_daily})\n")
            return True
        except Exception as e:
            print(f"   ⚠️ Error posting karma comment for {post_id}: {e}\n")
            return False

    # -------------------------------------------------------------
    # EXECUTION: Branch on Active Mode
    # -------------------------------------------------------------
    if active_mode == "karma":
        if try_post_karma_comment():
            replied_in_this_run = 1

    elif active_mode == "commercial":
        for sub_name in sorted(subreddits_to_scan):
            if replied_in_this_run >= args.max_posts:
                break

            if not args.dry_run and sub_name in recent_subs_24h:
                continue

            try:
                posts_to_inspect = []
                if session_client:
                    posts_to_inspect = session_client.fetch_posts(sub_name, limit=15)
                elif praw_reddit:
                    sub = praw_reddit.subreddit(sub_name)
                    for p in sub.new(limit=15):
                        posts_to_inspect.append({
                            "id": p.id,
                            "title": p.title,
                            "body": p.selftext,
                            "permalink": p.permalink,
                            "created_utc": float(getattr(p, "created_utc", 0.0))
                        })

                for post in posts_to_inspect:
                    if replied_in_this_run >= args.max_posts:
                        break

                    post_id = post["id"]
                    if post_id in history["replied_post_ids"]:
                        continue

                    # Freshness Guard: Skip dead / archived / necro threads (> 48 hours old)
                    created_utc = post.get("created_utc", 0.0)
                    if created_utc > 0:
                        age_hours = (datetime.now(timezone.utc).timestamp() - created_utc) / 3600
                        if age_hours > max_post_age_hours:
                            continue

                    matched = match_query_intent(post["title"], post["body"], intents_data)
                    if not matched:
                        continue

                    scope_type, cat_key, cat_data = matched

                    print(f"🎯 [COMMERCIAL MATCH FOUND] in r/{sub_name}!")
                    print(f"   Category:   {cat_data['name']} ({scope_type.upper()})")
                    print(f"   Target URL: {cat_data['target_url']}")
                    print(f"   Post Title: {post['title']}")
                    print(f"   Reddit URL: https://reddit.com{post['permalink']}")

                    try:
                        print(f"   🤖 Drafting contextual, humanized reply via Gemini ({gemini_model})...")
                        raw_reply = generate_humanized_reply(cat_data, post["title"], post["body"], gemini_key, model_name=gemini_model, include_link=include_direct_link)
                        reply_text = inject_human_quirks(raw_reply)
                        
                        print("\n--- GENERATED DRAFT REPLY ---")
                        print(reply_text)
                        print("-----------------------------\n")

                        if not args.dry_run:
                            print("   🚀 Submitting comment to Reddit...")
                            if session_client:
                                comment_id = session_client.post_comment(post_id, reply_text)
                            else:
                                submission = praw_reddit.submission(id=post_id)
                                comment = submission.reply(reply_text)
                                comment_id = comment.id

                            print(f"   ✅ Comment successfully posted! (Comment ID: {comment_id})")
                            history["last_comment_posted_at"] = datetime.now(timezone.utc).isoformat()
                        else:
                            print("   [DRY RUN] Would submit comment with backlink.")

                        # Record history
                        history["replied_post_ids"].append(post_id)
                        history["daily_count"]["count"] += 1
                        history["history"].append({
                            "post_id": post_id,
                            "subreddit": sub_name,
                            "mode": "commercial",
                            "category": cat_data["name"],
                            "target_url": cat_data["target_url"],
                            "title": post["title"],
                            "posted_at": datetime.now(timezone.utc).isoformat(),
                            "url": f"https://reddit.com{post['permalink']}"
                        })
                        save_history(history)

                        replied_in_this_run += 1
                        print(f"   💾 Saved post ID (Daily Count: {history['daily_count']['count']}/{max_daily})\n")

                    except Exception as e:
                        print(f"   ⚠️ Error processing post {post_id}: {e}\n")

            except Exception as e:
                pass

        # Intelligent Fallback: If no commercial intent was found, keep the account active with a karma post!
        if replied_in_this_run == 0 and not args.dry_run:
            print("ℹ️ No active commercial student queries found in this scan.")
            print("🌱 Falling back to Karma Builder to keep account warm and growing...")
            if try_post_karma_comment():
                replied_in_this_run = 1

    print("========================================================")
    print(f"✅ Run complete. Streamlit pinged: Yes | Comments posted: {replied_in_this_run}")
    print("========================================================\n")

if __name__ == "__main__":
    main()
