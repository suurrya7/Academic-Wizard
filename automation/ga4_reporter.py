#!/usr/bin/env python3
"""
GA4 Reporting Client for Academic Wizard
Uses OAuth credentials from backlink.audit.pro.171@gmail.com
"""

import os
import sys
import json
import subprocess
from pathlib import Path
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build

SCOPES = ["https://www.googleapis.com/auth/analytics.readonly"]
SECRETS_FILE = Path("/Users/surya/.gemini/antigravity/scratch/gsc-oauth-secrets.json")
TOKEN_FILE = Path("/Users/surya/.gemini/antigravity/scratch/ga4-token.json")
PROPERTY_ID = "539522292"  # academicwizard.online GA4 property


def get_ga4_service():
    creds = None
    if TOKEN_FILE.exists():
        try:
            creds = Credentials.from_authorized_user_file(str(TOKEN_FILE), SCOPES)
        except Exception as e:
            print("Failed to load cached credentials:", e, flush=True)
            creds = None
        
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
            with open(TOKEN_FILE, "w") as f:
                f.write(creds.to_json())
        else:
            if not SECRETS_FILE.exists():
                raise FileNotFoundError(f"OAuth secrets file not found at {SECRETS_FILE}")
            flow = InstalledAppFlow.from_client_secrets_file(str(SECRETS_FILE), SCOPES)
            auth_url, _ = flow.authorization_url(prompt="consent", access_type="offline")
            print("\n========================================================", flush=True)
            print("AUTH_URL:", auth_url, flush=True)
            print("========================================================\n", flush=True)
            
            # Automatically launch browser on Mac
            try:
                subprocess.Popen(["open", auth_url])
            except Exception as e:
                print("Could not auto-launch browser:", e, flush=True)
                
            creds = flow.run_local_server(port=0, open_browser=False)
            with open(TOKEN_FILE, "w") as f:
                f.write(creds.to_json())
            print("✅ Token saved successfully to", TOKEN_FILE, flush=True)
                
    return build("analyticsdata", "v1beta", credentials=creds)


def get_realtime_data():
    service = get_ga4_service()
    request = {
        "dimensions": [{"name": "country"}, {"name": "unifiedScreenName"}],
        "metrics": [{"name": "activeUsers"}]
    }
    response = service.properties().runRealtimeReport(
        property=f"properties/{PROPERTY_ID}",
        body=request
    ).execute()
    return response


def get_traffic_acquisition(days=28):
    service = get_ga4_service()
    request = {
        "dateRanges": [{"startDate": f"{days}daysAgo", "endDate": "today"}],
        "dimensions": [{"name": "sessionDefaultChannelGroup"}],
        "metrics": [
            {"name": "sessions"},
            {"name": "totalUsers"},
            {"name": "engagedSessions"},
            {"name": "averageSessionDuration"}
        ]
    }
    response = service.properties().runReport(
        property=f"properties/{PROPERTY_ID}",
        body=request
    ).execute()
    return response


def get_top_pages(days=28, limit=15):
    service = get_ga4_service()
    request = {
        "dateRanges": [{"startDate": f"{days}daysAgo", "endDate": "today"}],
        "dimensions": [{"name": "pagePath"}],
        "metrics": [
            {"name": "screenPageViews"},
            {"name": "totalUsers"},
            {"name": "userEngagementDuration"}
        ],
        "limit": limit
    }
    response = service.properties().runReport(
        property=f"properties/{PROPERTY_ID}",
        body=request
    ).execute()
    return response


if __name__ == "__main__":
    action = sys.argv[1] if len(sys.argv) > 1 else "realtime"
    if action == "auth":
        svc = get_ga4_service()
        print("✅ GA4 Authentication successful!", flush=True)
    elif action == "realtime":
        print(json.dumps(get_realtime_data(), indent=2))
    elif action == "traffic":
        print(json.dumps(get_traffic_acquisition(), indent=2))
    elif action == "pages":
        print(json.dumps(get_top_pages(), indent=2))
