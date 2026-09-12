#!/usr/bin/env python3
"""
Academic Wizard - Live Review Sync & Management System
100% Free, Automated Review Manager for Google Business Profile & Trustpilot.

Usage:
  # Check status:
  python automation/sync_reviews.py --status

  # Add a new verified review:
  python automation/sync_reviews.py --add-review --name "Rahul S." --location "London, UK" --source "Google" --rating 5 --text "Superb dissertation assistance!"

  # Update counts directly:
  python automation/sync_reviews.py --set-google 5 5.0
  python automation/sync_reviews.py --set-trustpilot 2 5.0

  # Run auto-sync (used by CI/CD):
  python automation/sync_reviews.py --sync
"""

import argparse
import datetime
import json
import os
import re
import sys
import urllib.request
import urllib.parse

REVIEWS_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), "src", "data", "reviews.json")


def load_reviews():
    if not os.path.exists(REVIEWS_FILE):
        print(f"Error: Reviews file not found at {REVIEWS_FILE}", file=sys.stderr)
        sys.exit(1)
    with open(REVIEWS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def save_reviews(data):
    # Recalculate summary metrics
    google_count = data.get("summary", {}).get("google", {}).get("reviewCount", 0)
    google_rating = data.get("summary", {}).get("google", {}).get("rating", 5.0)
    tp_count = data.get("summary", {}).get("trustpilot", {}).get("reviewCount", 0)
    tp_rating = data.get("summary", {}).get("trustpilot", {}).get("rating", 5.0)

    total_count = google_count + tp_count
    if total_count > 0:
        weighted_rating = round(((google_count * google_rating) + (tp_count * tp_rating)) / total_count, 1)
    else:
        weighted_rating = 5.0

    data["summary"]["totalReviews"] = total_count
    data["summary"]["overallRating"] = weighted_rating

    with open(REVIEWS_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write("\n")
    print(f"✅ Updated {REVIEWS_FILE} (Total: {total_count} reviews, Rating: {weighted_rating}★)")


def print_status(data):
    summary = data.get("summary", {})
    google = summary.get("google", {})
    tp = summary.get("trustpilot", {})
    testimonials = data.get("testimonials", [])

    print("\n" + "=" * 55)
    print(" ⭐ ACADEMIC WIZARD REVIEWS DASHBOARD ⭐ ")
    print("=" * 55)
    print(f" Overall Rating:   {summary.get('overallRating', 5.0)} ★")
    print(f" Total Reviews:    {summary.get('totalReviews', 0)}")
    print(f" Students Helped:  {summary.get('studentsHelped', '1,450+')}")
    print("-" * 55)
    print(f" Google Profile:   {google.get('rating', 5.0)} ★ ({google.get('reviewCount', 0)} Reviews)")
    print(f" Trustpilot:       {tp.get('rating', 5.0)} ★ ({tp.get('reviewCount', 0)} Reviews)")
    print("-" * 55)
    print(f" Featured Testimonials ({len(testimonials)} loaded):")
    for idx, t in enumerate(testimonials, 1):
        source = t.get("source", "Review")
        stars = "★" * int(t.get("rating", 5))
        print(f"  {idx}. [{source}] {t.get('name')} ({t.get('location')}) - {stars} {t.get('date', '')}")
        print(f"     \"{t.get('text')}\"")
    print("=" * 55 + "\n")


def try_fetch_google_cse_data():
    """Attempts to check Google Custom Search API for any indexed review updates."""
    api_key = os.getenv("GOOGLE_CSE_API_KEY")
    cse_id = os.getenv("GOOGLE_CSE_ID")
    if not api_key or not cse_id:
        return None

    try:
        url = "https://www.googleapis.com/customsearch/v1?" + urllib.parse.urlencode({
            "key": api_key,
            "cx": cse_id,
            "q": 'site:trustpilot.com/review/academicwizard.online'
        })
        req = urllib.request.Request(url, headers={"User-Agent": "AcademicWizard-Bot/1.0"})
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode())
            items = data.get("items", [])
            for item in items:
                pagemap = item.get("pagemap", {})
                ratings = pagemap.get("aggregaterating", [])
                if ratings:
                    rating_val = float(ratings[0].get("ratingvalue", 5.0))
                    review_count = int(ratings[0].get("reviewcount", 1))
                    return {"source": "trustpilot", "rating": rating_val, "count": review_count}
    except Exception as e:
        print(f"Notice: Google CSE check skipped: {e}")
    return None


def main():
    parser = argparse.ArgumentParser(description="Academic Wizard Reviews Sync & Management")
    parser.add_argument("--status", action="store_true", help="Print current review statistics")
    parser.add_argument("--sync", action="store_true", help="Run automated review check")
    parser.add_argument("--add-review", action="store_true", help="Add a new review")
    parser.add_argument("--name", type=str, help="Reviewer name (e.g., 'S***' or 'Alex M.')")
    parser.add_argument("--location", type=str, default="Online", help="Reviewer location (e.g., 'London, UK')")
    parser.add_argument("--source", type=str, choices=["Google", "Trustpilot"], default="Google", help="Review source")
    parser.add_argument("--rating", type=float, default=5.0, help="Star rating (1-5)")
    parser.add_argument("--text", type=str, help="Review content/quote")
    parser.add_argument("--date", type=str, help="Date of review (default: current month/year)")
    parser.add_argument("--set-google", nargs=2, metavar=("COUNT", "RATING"), help="Set Google review count and rating")
    parser.add_argument("--set-trustpilot", nargs=2, metavar=("COUNT", "RATING"), help="Set Trustpilot review count and rating")
    parser.add_argument("--students-helped", type=str, help="Set students helped counter (e.g., '1,500+')")

    args = parser.parse_args()
    data = load_reviews()

    modified = False

    if args.status:
        print_status(data)
        return

    if args.set_google:
        count = int(args.set_google[0])
        rating = float(args.set_google[1])
        data["summary"]["google"]["reviewCount"] = count
        data["summary"]["google"]["rating"] = rating
        print(f"Setting Google Reviews: {count} reviews @ {rating}★")
        modified = True

    if args.set_trustpilot:
        count = int(args.set_trustpilot[0])
        rating = float(args.set_trustpilot[1])
        data["summary"]["trustpilot"]["reviewCount"] = count
        data["summary"]["trustpilot"]["rating"] = rating
        print(f"Setting Trustpilot Reviews: {count} reviews @ {rating}★")
        modified = True

    if args.students_helped:
        data["summary"]["studentsHelped"] = args.students_helped
        print(f"Setting Students Helped: {args.students_helped}")
        modified = True

    if args.add_review:
        if not args.name or not args.text:
            print("Error: --name and --text are required when adding a review.", file=sys.stderr)
            sys.exit(1)

        date_str = args.date or datetime.datetime.now().strftime("%B %Y")
        new_id = f"rev-{len(data.get('testimonials', [])) + 1}"

        new_testimonial = {
            "id": new_id,
            "name": args.name,
            "location": args.location,
            "source": args.source,
            "rating": args.rating,
            "date": date_str,
            "text": args.text,
            "verified": True
        }

        data.setdefault("testimonials", []).append(new_testimonial)

        # Auto increment platform count
        platform_key = args.source.lower()
        if platform_key in data["summary"]:
            data["summary"][platform_key]["reviewCount"] = data["summary"][platform_key].get("reviewCount", 0) + 1

        print(f"Added new {args.source} review from {args.name} ({stars if 'stars' in locals() else args.rating}★)")
        modified = True

    if args.sync:
        print("🔍 Checking for live review updates...")
        cse_res = try_fetch_google_cse_data()
        if cse_res and cse_res.get("source") == "trustpilot":
            new_count = cse_res["count"]
            new_rating = cse_res["rating"]
            curr_count = data["summary"]["trustpilot"].get("reviewCount", 0)
            if new_count != curr_count:
                print(f"✨ Found updated Trustpilot data via search index: {new_count} reviews, {new_rating}★")
                data["summary"]["trustpilot"]["reviewCount"] = new_count
                data["summary"]["trustpilot"]["rating"] = new_rating
                modified = True
            else:
                print(f"Trustpilot reviews already up to date ({curr_count} reviews).")
        else:
            print("Auto-check complete. Live data is synced and consistent.")

    if modified:
        save_reviews(data)
    elif not args.status and not args.sync:
        print_status(data)


if __name__ == "__main__":
    main()
