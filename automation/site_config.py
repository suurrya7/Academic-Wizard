import os


SITE_NAME = "Academic Wizard"
SITE_URL = os.getenv("SITE_URL", "https://academicwizard.online").rstrip("/")
BASE_PATH = os.getenv("BASE_PATH", "/").strip()

if not BASE_PATH.startswith("/"):
    BASE_PATH = f"/{BASE_PATH}"
if not BASE_PATH.endswith("/"):
    BASE_PATH = f"{BASE_PATH}/"


def absolute_url(path: str = "") -> str:
    clean_path = path.lstrip("/")
    if not clean_path:
        return f"{SITE_URL}/"
    
    # Don't append trailing slash to files
    if any(clean_path.endswith(ext) for ext in ['.xml', '.txt', '.html', '.webp', '.png', '.jpg', '.css', '.js']):
        return f"{SITE_URL}/{clean_path}"
        
    if not clean_path.endswith("/"):
        clean_path = f"{clean_path}/"
    return f"{SITE_URL}/{clean_path}"
