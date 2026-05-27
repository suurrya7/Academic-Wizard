import os
import json
import re
import datetime
import random
import google.generativeai as genai

# Configuration
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
POSTS_DIR = os.path.join('blog', 'posts')
DATA_DIR = 'data'
POSTS_JSON = os.path.join(DATA_DIR, 'posts.json')
TEMPLATE_FILE = os.path.join('automation', 'blog_post_template.html')

# Ensure directories exist
os.makedirs(POSTS_DIR, exist_ok=True)
os.makedirs(DATA_DIR, exist_ok=True)

# Extended topic list (SEO focused)
TOPICS = [
    "10 Proven Tips for Writing a Flawless University Essay",
    "How to Structure a Winning Research Paper in 2024",
    "The Ultimate Guide to Time Management for College Students",
    "Mastering the Art of Thesis Writing: A Step-by-Step Guide",
    "Top 5 Common Mistakes in Academic Writing and How to Avoid Them",
    "How to Cite Sources Correctly: APA, MLA, and Chicago Styles Explained",
    "Strategies for Beating Procrastination on Heavy Assignments",
    "Why Expert Assignment Help Can Boost Your Academic Performance",
    "How to Write an Engaging Essay Introduction that Hooks the Reader",
    "A Comprehensive Guide to Writing a Literature Review",
    "Effective Note-Taking Strategies for Research Papers",
    "The Role of Critical Thinking in University Assignments",
    "How to Edit and Proofread Your Own Academic Work",
    "Balancing Part-Time Work and Full-Time Studies: Success Strategies",
    "How to Tackle Complex Nursing Assignments with Confidence",
    "Programming Assignment Help: Debugging Tips for Beginners",
    "MBA Assignments: Structuring a Professional Case Study",
    "Law Assignment Guide: How to Brief a Case Effectively",
    "Engineering Homework: Problem-Solving Techniques that Work",
    "Accounting and Finance Assignments: Avoiding Common Pitfalls",
    "Statistics Homework Help: Understanding Standard Deviation and Variance",
    "How to Write a Powerful Conclusion for Your Dissertation",
    "The Benefits of Online Tutoring for Difficult Subjects",
    "How to Use Academic Databases Effectively for Research",
    "Plagiarism in Academic Writing: What It Is and How to Prevent It",
    "How to Analyze Data for Your Research Project",
    "Writing a Personal Statement for Grad School: What Committees Look For",
    "Overcoming Writer's Block When Facing a Blank Page",
    "How to Prepare for College Final Exams Efficiently",
    "The Importance of Peer Review in Academic Publishing"
]

def load_existing_posts():
    if os.path.exists(POSTS_JSON):
        with open(POSTS_JSON, 'r', encoding='utf-8') as f:
            try:
                return json.load(f)
            except json.JSONDecodeError:
                return []
    return []

def save_posts(posts):
    with open(POSTS_JSON, 'w', encoding='utf-8') as f:
        json.dump(posts, f, indent=2)

def generate_article_content(topic):
    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY environment variable is not set. Cannot call API.")
    
    genai.configure(api_key=GEMINI_API_KEY)
    
    gemini_model_name = os.getenv('GEMINI_MODEL', 'gemini-1.5-flash')
    model = genai.GenerativeModel(gemini_model_name)
    
    prompt = f"""
    You are an expert academic writer and SEO specialist writing for 'Academic Wizard', a premium assignment help service.
    Write a highly engaging, SEO-optimized blog post (1200-1500 words) about: "{topic}"
    
    The HTML output MUST:
    1. Only contain the INNER HTML content for the <article> tag (no <html>, <head>, or <body> tags).
    2. Start directly with an engaging introductory paragraph (no title, I will provide the H1).
    3. Use rich formatting: <h2> and <h3> tags for subheadings, <ul>/<li> for lists, <strong> for emphasis.
    4. Provide highly practical, actionable advice for university students.
    5. Include a brief, natural call-to-action (CTA) near the end, mentioning that "Academic Wizard's experts are available 24/7 to help you achieve top grades."
    6. Not include Markdown formatting (like ```html), output raw HTML only.
    
    Return the HTML content directly.
    """
    
    response = model.generate_content(prompt)
    content = response.text
    
    # Clean up potential markdown formatting from API response
    if content.startswith('```html'):
        content = content[7:]
    if content.endswith('```'):
        content = content[:-3]
        
    return content.strip()

def get_metadata(topic):
    # Determine slug
    slug = re.sub(r'[^a-z0-9]+', '-', topic.lower()).strip('-')
    
    # Excerpt
    excerpt = f"Discover expert tips and strategies on {topic.lower()}. Learn how to improve your academic performance with our comprehensive guide."
    
    # Keywords
    base_keywords = "assignment help, university tips, academic writing"
    specific_keywords = ", ".join([w for w in topic.lower().split() if len(w) > 4])
    keywords = f"{base_keywords}, {specific_keywords}"
    
    # Date
    now = datetime.datetime.now(datetime.timezone.utc)
    date_str = now.isoformat()
    
    # Reading time estimate (based on ~1200 words)
    reading_time = random.randint(5, 8)
    
    return {
        "title": topic,
        "slug": slug,
        "excerpt": excerpt,
        "keywords": keywords,
        "date": date_str,
        "readingTime": reading_time,
        "url": f"blog/posts/{slug}.html"
    }

def generate_json_ld(meta):
    return f"""
    <script type="application/ld+json">
    {{
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "{meta['title']}",
      "description": "{meta['excerpt']}",
      "author": {{
        "@type": "Organization",
        "name": "Academic Wizard"
      }},
      "publisher": {{
        "@type": "Organization",
        "name": "Academic Wizard",
        "logo": {{
          "@type": "ImageObject",
          "url": "https://www.academicwizard.online/hero-bg.png"
        }}
      }},
      "datePublished": "{meta['date']}",
      "mainEntityOfPage": {{
        "@type": "WebPage",
        "@id": "https://www.academicwizard.online/{meta['url']}"
      }}
    }}
    </script>
    """

def main():
    print("Starting Academic Wizard Blog Automation...")
    
    existing_posts = load_existing_posts()
    used_titles = [post.get('title') for post in existing_posts]
    
    # Find an unused topic
    available_topics = [t for t in TOPICS if t not in used_titles]
    
    if not available_topics:
        print("All topics have been used! Add more topics to the TOPICS list.")
        return
        
    topic = random.choice(available_topics)
    print(f"Selected Topic: {topic}")
    
    try:
        # Generate Metadata
        meta = get_metadata(topic)
        
        # Generate Content via API
        print("Calling Gemini API...")
        html_content = generate_article_content(topic)
        print("Content generated successfully.")
        
        # Read Template
        with open(TEMPLATE_FILE, 'r', encoding='utf-8') as f:
            template = f.read()
            
        # Inject Data
        json_ld = generate_json_ld(meta)
        
        # Format Date for display
        display_date = datetime.datetime.fromisoformat(meta['date']).strftime('%B %d, %Y')
        
        final_html = template.replace('{{TITLE}}', meta['title'])
        final_html = final_html.replace('{{DESCRIPTION}}', meta['excerpt'])
        final_html = final_html.replace('{{KEYWORDS}}', meta['keywords'])
        final_html = final_html.replace('{{SLUG}}', meta['slug'])
        final_html = final_html.replace('{{DATE}}', display_date)
        final_html = final_html.replace('{{READING_TIME}}', str(meta['readingTime']))
        final_html = final_html.replace('{{JSON_LD}}', json_ld)
        final_html = final_html.replace('{{CONTENT}}', html_content)
        
        # Save HTML File
        post_path = os.path.join(POSTS_DIR, f"{meta['slug']}.html")
        with open(post_path, 'w', encoding='utf-8') as f:
            f.write(final_html)
            
        print(f"Saved post HTML to: {post_path}")
        
        # Update posts.json
        existing_posts.insert(0, meta)
        save_posts(existing_posts)
        print("Updated data/posts.json")
        
        print("Automation complete! Post generated successfully.")
        
    except Exception as e:
        print(f"Error during generation: {str(e)}")
        # Exit with error code so GitHub Actions knows it failed
        exit(1)

if __name__ == "__main__":
    main()
