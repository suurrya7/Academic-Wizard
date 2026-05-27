import os
import json
import requests
from datetime import datetime

# Load Gemini API key from .env
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')

def generate_content(topic):
    # Placeholder: replace with real Gemini API call
    # Example request (pseudo):
    # response = requests.post('https://generativeai.googleapis.com/v1beta/models/gemini-pro:generateContent', json={...}, headers={'Authorization': f'Bearer {GEMINI_API_KEY}'})
    # return response.json()['candidates'][0]['content']['parts'][0]['text']
    return f"# {topic}\n\nThis is a generated article about {topic}. It includes assignment‑help tips and SEO‑optimized content."

def main():
    # Define topics (could be dynamic or based on a list)
    topics = ["Effective Essay Writing", "Research Paper Tips", "Thesis Structure Guide", "Assignment Planning"]
    posts_dir = os.path.join('blog', 'posts')
    os.makedirs(posts_dir, exist_ok=True)
    posts_meta = []
    for topic in topics:
        content = generate_content(topic)
        slug = topic.lower().replace(' ', '-').replace('—', '-').replace('–', '-')
        filename = f"{slug}.html"
        filepath = os.path.join(posts_dir, filename)
        with open(filepath, 'w') as f:
            f.write(f"<html><head><title>{topic}</title></head><body>{content}</body></html>")
        posts_meta.append({
            "title": topic,
            "url": f"posts/{filename}",
            "date": datetime.utcnow().isoformat(),
            "excerpt": f"Brief summary of {topic}."
        })
    # Update posts.json
    with open('data/posts.json', 'w') as f:
        json.dump(posts_meta, f, indent=2)

if __name__ == '__main__':
    main()
