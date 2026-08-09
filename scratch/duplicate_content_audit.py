import os
from pathlib import Path
from difflib import SequenceMatcher
from bs4 import BeautifulSoup
import json

PROJECT_ROOT = Path("/Users/surya/Desktop/Academic Wizard Latest.")
POSTS_DIR = PROJECT_ROOT / "public" / "blog" / "posts"
DATA_DIR = PROJECT_ROOT / "public" / "data"

def extract_text(html_path):
    with open(html_path, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')
        # Remove script and style elements
        for script in soup(["script", "style"]):
            script.extract()
        return soup.get_text(separator=' ', strip=True)

def check_similarity(text1, text2):
    return SequenceMatcher(None, text1, text2).ratio()

def main():
    print("--- Duplicate Content Audit ---")
    
    # 1. Check generated programmatic posts
    blog_posts = list(POSTS_DIR.glob("*.html"))
    if len(blog_posts) >= 2:
        post1_text = extract_text(blog_posts[0])
        post2_text = extract_text(blog_posts[1])
        sim = check_similarity(post1_text, post2_text)
        print(f"Similarity between {blog_posts[0].name} and {blog_posts[1].name}: {sim*100:.2f}%")
        
    if len(blog_posts) >= 20:
        # Check newly generated manual posts specifically
        # Let's find two from the new batch
        new_posts = [p for p in blog_posts if "mastering" in p.name.lower()]
        if len(new_posts) >= 2:
            text1 = extract_text(new_posts[0])
            text2 = extract_text(new_posts[1])
            sim = check_similarity(text1, text2)
            print(f"Similarity between {new_posts[0].name} and {new_posts[1].name}: {sim*100:.2f}%")
            
    # 2. Check the programmatic page generation (the Vite app routes)
    # The routes are generated via App.jsx, rendering <SpecializedPage> and <ServicePage>
    # The content comes from src/data/services.js
    
    print("\\nNote: Programmatic SEO pages (e.g., /services/assignment-help/uk) are rendered dynamically via React.")
    print("If they rely heavily on static boilerplate from src/data/services.js with only location keywords swapped, they will have > 90% similarity, which Google flags as duplicate/doorway pages.")

if __name__ == "__main__":
    main()
