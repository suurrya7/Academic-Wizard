#!/usr/bin/env python3
"""
ping_google.py — Notify Google that our sitemap has been updated.

This script pings Google's official sitemap submission endpoint after every build,
telling their crawler to re-process our sitemap and discover new/updated pages.

Usage:
    python3 automation/ping_google.py

This is run automatically as part of the build pipeline in package.json.
"""

import logging
import ssl
import urllib.request
import urllib.error

from site_config import SITE_URL

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("ping_google")

SITEMAP_URL = f"{SITE_URL}/sitemap.xml"

PING_ENDPOINTS = [
    f"https://www.google.com/ping?sitemap={SITEMAP_URL}",
    f"https://www.bing.com/ping?sitemap={SITEMAP_URL}",
]


def ping_search_engines() -> None:
    """Send sitemap ping to Google and Bing."""
    for endpoint in PING_ENDPOINTS:
        engine = "Google" if "google" in endpoint else "Bing"
        try:
            req = urllib.request.Request(endpoint, method="GET")
            req.add_header("User-Agent", "AcademicWizard-SEO/1.0")
            # Use unverified SSL context to work around macOS Python CA cert issues
            ctx = ssl.create_default_context()
            ctx.check_hostname = False
            ctx.verify_mode = ssl.CERT_NONE
            with urllib.request.urlopen(req, timeout=15, context=ctx) as resp:
                status = resp.status
                if status == 200:
                    logger.info("✅ Pinged %s successfully (HTTP %d)", engine, status)
                else:
                    logger.warning("⚠️  %s responded with HTTP %d", engine, status)
        except urllib.error.URLError as e:
            logger.warning("⚠️  Could not ping %s: %s (non-fatal, continuing)", engine, e)
        except Exception as e:
            logger.warning("⚠️  Unexpected error pinging %s: %s (non-fatal)", engine, e)


def main() -> None:
    logger.info("🔔 Pinging search engines with sitemap: %s", SITEMAP_URL)
    ping_search_engines()


if __name__ == "__main__":
    main()
