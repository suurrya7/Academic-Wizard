#!/usr/bin/env python3
"""
Google Business Profile (GBP) Manager for Academic Wizard
Handles OAuth2 authentication, account & location retrieval, performance metrics, and profile updates.
"""

import os
import sys
import json
import subprocess
from pathlib import Path

os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request, AuthorizedSession

SCOPES = [
    "https://www.googleapis.com/auth/business.manage"
]

SECRETS_FILE = Path("/Users/surya/.gemini/antigravity/scratch/gsc-oauth-secrets.json")
TOKEN_FILE = Path("/Users/surya/.gemini/antigravity/scratch/gbp-token.json")


def get_gbp_credentials():
    """Authenticates and returns valid OAuth2 credentials for Google Business Profile."""
    creds = None
    if TOKEN_FILE.exists():
        try:
            creds = Credentials.from_authorized_user_file(str(TOKEN_FILE), SCOPES)
        except Exception as e:
            print(f"Failed to load cached credentials: {e}", flush=True)
            creds = None

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            print("Refreshing expired GBP OAuth token...", flush=True)
            creds.refresh(Request())
            with open(TOKEN_FILE, "w") as f:
                f.write(creds.to_json())
        else:
            if not SECRETS_FILE.exists():
                raise FileNotFoundError(f"OAuth secrets file not found at {SECRETS_FILE}")
            
            print("Initiating new OAuth2 login flow for Google Business Profile...", flush=True)
            flow = InstalledAppFlow.from_client_secrets_file(str(SECRETS_FILE), SCOPES)
            port = 8085
            flow.redirect_uri = f"http://localhost:{port}/"
            
            auth_url, _ = flow.authorization_url(prompt="consent", access_type="offline")
            
            print("\n" + "="*70, flush=True)
            print("👉 GBP_AUTH_URL:", flush=True)
            print(auth_url, flush=True)
            print("="*70 + "\n", flush=True)

            try:
                subprocess.Popen(["open", auth_url])
            except Exception as e:
                print(f"Could not auto-open browser: {e}", flush=True)

            from http.server import HTTPServer, BaseHTTPRequestHandler
            import urllib.parse

            class OAuthCallbackHandler(BaseHTTPRequestHandler):
                def log_message(self, format, *args):
                    pass

                def do_GET(self):
                    parsed = urllib.parse.urlparse(self.path)
                    if parsed.path == "/favicon.ico":
                        self.send_response(204)
                        self.end_headers()
                        return

                    query_params = urllib.parse.parse_qs(parsed.query)
                    self.server.query_params = query_params
                    self.server.full_request_path = self.path

                    if "code" in query_params:
                        self.send_response(200)
                        self.send_header("Content-Type", "text/html; charset=utf-8")
                        self.end_headers()
                        self.wfile.write(b"""
                        <html>
                        <body style="font-family:system-ui,sans-serif;text-align:center;padding:50px;background:#f0fdf4;color:#166534;">
                            <h1 style="font-size:28px;">&#x2705; Academic Wizard Connected!</h1>
                            <p style="font-size:16px;">Google Business Profile authorization completed successfully.</p>
                            <p style="color:#6b7280;">You can close this tab and return to Antigravity.</p>
                        </body>
                        </html>
                        """)
                    elif "error" in query_params:
                        err = query_params.get("error", ["unknown"])[0]
                        desc = query_params.get("error_description", [""])[0]
                        self.send_response(400)
                        self.send_header("Content-Type", "text/html; charset=utf-8")
                        self.end_headers()
                        self.wfile.write(f"""
                        <html>
                        <body style="font-family:system-ui,sans-serif;text-align:center;padding:50px;background:#fef2f2;color:#991b1b;">
                            <h1 style="font-size:28px;">&#x26a0;&#xfe0f; Authorization Error: {err}</h1>
                            <p>{desc}</p>
                        </body>
                        </html>
                        """.encode("utf-8"))
                    else:
                        self.send_response(200)
                        self.send_header("Content-Type", "text/plain")
                        self.end_headers()
                        self.wfile.write(b"Waiting for Google OAuth callback...")

            httpd = HTTPServer(("localhost", port), OAuthCallbackHandler)
            httpd.query_params = None
            httpd.full_request_path = None

            print(f"Waiting for authorization callback on port {port}...", flush=True)
            while not httpd.query_params or ("code" not in httpd.query_params and "error" not in httpd.query_params):
                httpd.handle_request()

            httpd.server_close()

            if "error" in httpd.query_params:
                err = httpd.query_params["error"][0]
                desc = httpd.query_params.get("error_description", [""])[0]
                raise RuntimeError(f"Google OAuth rejected: {err} ({desc})")

            auth_response_url = f"http://localhost:{port}{httpd.full_request_path}"
            flow.fetch_token(authorization_response=auth_response_url)
            creds = flow.credentials

            with open(TOKEN_FILE, "w") as f:
                f.write(creds.to_json())
            print(f"✅ GBP Token successfully saved to {TOKEN_FILE}", flush=True)

    return creds


def get_session():
    """Returns an authorized requests session for GBP API calls."""
    creds = get_gbp_credentials()
    return AuthorizedSession(creds)


def list_accounts():
    """Lists all Google Business accounts accessible to the authenticated user."""
    session = get_session()
    url = "https://mybusinessaccountmanagement.googleapis.com/v1/accounts"
    resp = session.get(url)
    if resp.status_code != 200:
        print(f"Error fetching accounts ({resp.status_code}): {resp.text}", flush=True)
        return []
    
    data = resp.json()
    accounts = data.get("accounts", [])
    return accounts


def list_locations(account_name):
    """Lists all business locations for a given account name."""
    session = get_session()
    # Read mask includes core fields
    read_mask = "name,title,storefrontAddress,websiteUri,phoneNumbers,categories,serviceArea,regularHours"
    url = f"https://mybusinessbusinessinformation.googleapis.com/v1/{account_name}/locations?readMask={read_mask}"
    resp = session.get(url)
    if resp.status_code != 200:
        print(f"Error fetching locations for {account_name} ({resp.status_code}): {resp.text}", flush=True)
        return []
    
    data = resp.json()
    locations = data.get("locations", [])
    return locations


def check_status():
    """Checks the approval status and quota of the Google Business Profile APIs."""
    print("\n🔍 Checking Google Business Profile API Access Status...", flush=True)
    session = get_session()
    url = "https://mybusinessaccountmanagement.googleapis.com/v1/accounts"
    resp = session.get(url)
    
    if resp.status_code == 200:
        data = resp.json()
        accounts = data.get("accounts", [])
        print(f"🎉 APPROVED! Quota is active (300 QPM). Found {len(accounts)} account(s).", flush=True)
        return True, accounts
    
    if resp.status_code == 429:
        print("\n" + "="*70, flush=True)
        print("⏳ STATUS: PENDING BASIC API ACCESS APPROVAL (Quota = 0 QPM)", flush=True)
        print("="*70, flush=True)
        print("Your OAuth authentication is 100% SUCCESSFUL and the permanent token is saved!")
        print("However, Google requires submitting a 1-minute 'Basic API Access' request")
        print("before they unlock the 300 requests/minute quota for project asymmetric-ray-502319-u6.")
        print("\n👉 Fill this 1-minute form to unlock access:")
        print("   https://support.google.com/business/contact/api_default")
        print("\n📋 Exact info to enter in the form:")
        print("   • Application Type: Application for Basic API Access")
        print("   • Google Cloud Project Number: 190412520910")
        print("   • Google Cloud Project ID: asymmetric-ray-502319-u6")
        print("   • Company / Organization Name: Academic Wizard")
        print("   • Website: https://academicwizard.online")
        print("   • Intended Use: Automating business updates/posts, review management, and performance reporting.")
        print("="*70 + "\n", flush=True)
        return False, []
    
    print(f"⚠️ Unexpected status ({resp.status_code}): {resp.text}", flush=True)
    return False, []


def generate_weekly_posts():
    """Generates ready-to-publish Google Business Profile updates with CTAs."""
    posts = [
        {
            "headline": "📚 Struggling with Assignment Deadlines? Get 20% OFF!",
            "content": (
                "Mid-semester deadlines piling up? Don't stress! 🎓 Academic Wizard offers 24/7 "
                "personalized academic writing support, proofreading, and dissertation guidance across "
                "the UK, USA, Australia, and Canada.\n\n"
                "✨ 100% Human, AI-Free Guarantee with Turnitin report\n"
                "⚡ On-time delivery even for urgent 12h deadlines\n"
                "🎁 Use code WIZARD20 on WhatsApp for 20% off your order!"
            ),
            "cta_type": "ORDER",
            "cta_url": "https://academicwizard.online/contact?coupon=WIZARD20"
        },
        {
            "headline": "🩺 Nursing & Healthcare Case Study Help — Written by Subject Specialists",
            "content": (
                "Writing a clinical reflection or nursing care plan? Our healthcare specialists assist "
                "with evidence-based practice, NMBI/NMC guidelines, and APA referencing.\n\n"
                "⭐ Rated 5.0/5 by over 1,200+ healthcare and university students.\n"
                "👉 Chat with an academic advisor today: https://academicwizard.online"
            ),
            "cta_type": "LEARN_MORE",
            "cta_url": "https://academicwizard.online/nursing-assignment-help"
        },
        {
            "headline": "⚖️ Law & Legal Essays (OSCOLA Referencing Perfected)",
            "content": (
                "Confused by OSCOLA footnoting, IRAC methodology, or complex case law analysis? "
                "Get expert guidance from LLM & PhD legal scholars.\n\n"
                "✓ Thorough primary and secondary source legal research\n"
                "✓ Flawless OSCOLA citations and bibliography\n"
                "✓ Direct 1-on-1 support via WhatsApp"
            ),
            "cta_type": "CALL",
            "cta_url": "https://academicwizard.online/law-assignment-help"
        }
    ]
    return posts


def main():
    if len(sys.argv) > 1 and sys.argv[1] == "posts":
        print("Generating weekly Google Business Profile posts...\n")
        posts = generate_weekly_posts()
        for i, p in enumerate(posts, 1):
            print(f"--- POST #{i}: {p['headline']} ---")
            print(p['content'])
            print(f"Button: {p['cta_type']} -> {p['cta_url']}\n")
        return

    print("Connecting to Google Business Profile API...", flush=True)
    try:
        creds = get_gbp_credentials()
        print("✅ OAuth Authentication Succeeded!", flush=True)
        approved, accounts = check_status()
        
        if approved:
            for acc in accounts:
                acc_name = acc.get("name")
                acc_title = acc.get("accountName", "Unnamed")
                print(f"  • Account: {acc_title} ({acc_name})")
                locations = list_locations(acc_name)
                print(f"    Locations: {len(locations)}")
                for loc in locations:
                    print(f"      📍 {loc.get('title')} ({loc.get('name')})")
        else:
            print("💡 In the meantime, you can run 'python3 automation/gbp_manager.py posts' to get pre-written posts ready to paste into your Google Business Profile!")
                
    except Exception as e:
        print(f"❌ Error during Google Business Profile operation: {e}", flush=True)
        sys.exit(1)


if __name__ == "__main__":
    main()
