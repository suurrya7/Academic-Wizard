import urllib.request
import json
import os
import ssl

ssl._create_default_https_context = ssl._create_unverified_context
key = "AIzaSyD2BYnmU2i-D0_-YWbvevwbiCpaK4ITheY"
models = ["gemini-1.5-flash", "gemini-3.5-flash-lite", "gemini-2.5-flash"]

for m in models:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{m}:generateContent?key={key}"
    headers = {'Content-Type': 'application/json'}
    data = {"contents":[{"parts":[{"text":"Hello"}]}]}
    req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers=headers)
    try:
        with urllib.request.urlopen(req) as res:
            print(f"{m}: Success")
    except urllib.error.HTTPError as e:
        print(f"{m}: HTTP {e.code}")
    except Exception as e:
        print(f"{m}: Error {e}")
