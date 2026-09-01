import os


SITE_NAME = "Academic Wizard"
SITE_URL = os.getenv("SITE_URL", "https://academicwizard.online").rstrip("/")
BASE_PATH = os.getenv("BASE_PATH", "/").strip()

if not BASE_PATH.startswith("/"):
    BASE_PATH = f"/{BASE_PATH}"
if not BASE_PATH.endswith("/"):
    BASE_PATH = f"{BASE_PATH}/"


def absolute_url(path: str = "") -> str:
    clean_path = path.strip("/")
    if not clean_path:
        return SITE_URL
    last_segment = clean_path.split("/")[-1]
    if "." in last_segment:
        return f"{SITE_URL}/{clean_path}"
    return f"{SITE_URL}/{clean_path}/"
