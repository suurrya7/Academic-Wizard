import os
import re
import random

BASE_DIR = "/Users/surya/Desktop/Academic Wizard Latest./public/blog/posts"

# Content blocks
COUNTRIES = {
    "usa": {
        "name": "USA",
        "system": "GPA system and credit hours",
        "details": "Ivy League standards and state university requirements",
        "grading": "strict grading rubrics focusing on critical thinking",
        "links": ['<a href="https://apastyle.apa.org/">APA Style Guidelines</a>', '<a href="https://owl.purdue.edu/">Purdue OWL</a>'],
        "h2_1": "Navigating the USA Higher Education Landscape",
        "h2_2": "Mastering the GPA System",
        "h2_3": "Ivy League vs. State Universities"
    },
    "australia": {
        "name": "Australia",
        "system": "AQF (Australian Qualifications Framework)",
        "details": "Group of Eight (Go8) expectations and Australian English nuances",
        "grading": "High Distinction (HD), Distinction (D), and Credit (C) bands",
        "links": ['<a href="https://www.teqsa.gov.au/">TEQSA Standards</a>', '<a href="https://www.studyaustralia.gov.au/">Study Australia</a>'],
        "h2_1": "Excelling in the Australian AQF System",
        "h2_2": "Aiming for High Distinctions (HD)",
        "h2_3": "Go8 University Standards"
    },
    "canada": {
        "name": "Canada",
        "system": "Tri-Agency policies and academic integrity",
        "details": "bilingual considerations and diverse institutional frameworks",
        "grading": "letter grades and percentage conversions",
        "links": ['<a href="https://www.univcan.ca/">Universities Canada</a>', '<a href="https://apastyle.apa.org/">APA Guidelines</a>'],
        "h2_1": "Canadian Academic Integrity and Policies",
        "h2_2": "Navigating Letter Grades and Percentages",
        "h2_3": "Bilingual Contexts in Higher Ed"
    },
    "india": {
        "name": "India",
        "system": "UGC guidelines and Choice Based Credit System (CBCS)",
        "details": "IIT/IIM rigorous patterns and semester schedules",
        "grading": "CGPA and semester-end comprehensive examinations",
        "links": ['<a href="https://www.ugc.ac.in/">UGC Guidelines</a>', '<a href="https://www.aicte-india.org/">AICTE Standards</a>'],
        "h2_1": "Understanding UGC and CBCS Guidelines",
        "h2_2": "Surviving the IIT and IIM Rigor",
        "h2_3": "Maximizing Your CGPA"
    },
    "ireland": {
        "name": "Ireland",
        "system": "NFQ (National Framework of Qualifications)",
        "details": "TCD and UCD research expectations",
        "grading": "first-class honours grading scales",
        "links": ['<a href="https://www.nfq.ie/">NFQ Framework</a>', '<a href="https://www.qqi.ie/">QQI Standards</a>'],
        "h2_1": "The Irish NFQ Framework Explained",
        "h2_2": "Research Expectations at TCD and UCD",
        "h2_3": "Achieving First-Class Honours"
    },
    "singapore": {
        "name": "Singapore",
        "system": "modular system and Cumulative Average Point (CAP)",
        "details": "NUS and NTU high academic rigor",
        "grading": "bell-curve grading and intense peer competition",
        "links": ['<a href="https://www.moe.gov.sg/">Ministry of Education Singapore</a>', '<a href="https://apastyle.apa.org/">APA Citation Guide</a>'],
        "h2_1": "Thriving in Singapore's Modular System",
        "h2_2": "Understanding the CAP System",
        "h2_3": "Navigating the Bell-Curve Grading"
    },
    "germany": {
        "name": "Germany",
        "system": "Bologna Process and ECTS credits",
        "details": "Wissenschaftliches Arbeiten (scientific work)",
        "grading": "Hausarbeit (term papers) vs Seminararbeit",
        "links": ['<a href="https://www.hrk.de/">German Rectors Conference</a>', '<a href="https://www.daad.de/">DAAD Academic Standards</a>'],
        "h2_1": "The Bologna Process and ECTS Credits",
        "h2_2": "Hausarbeit vs. Seminararbeit",
        "h2_3": "Mastering Wissenschaftliches Arbeiten"
    }
}

SERVICES = {
    "assignment-help": {
        "title": "Assignment Help",
        "focus": "understanding complex grading rubrics and assignment briefs",
        "action": "structuring your responses and addressing prompt requirements",
        "cta": "/services/assignment-help"
    },
    "essay-writing": {
        "title": "Essay Writing",
        "focus": "formulating strong thesis statements and structuring arguments",
        "action": "conducting literature reviews and building coherent narratives",
        "cta": "/services/essay-writing"
    },
    "study-guidance": {
        "title": "Study Guidance",
        "focus": "effective exam preparation and time management",
        "action": "synthesizing lecture notes and creating revision strategies",
        "cta": "/services/study-guidance"
    },
    "research-support": {
        "title": "Research Support",
        "focus": "methodology design, primary research, and data analysis",
        "action": "evaluating empirical evidence and constructing frameworks",
        "cta": "/services/research-support"
    }
}

FILLER_PARAGRAPHS = [
    "One of the most critical aspects of higher education is the ability to maintain consistency. When students first arrive on campus, they are often overwhelmed by the sheer volume of reading materials and the complexity of the tasks assigned to them. Developing a steady routine early in the semester can mitigate these pressures.",
    "Academic success is rarely the result of last-minute cramming. Instead, it stems from deliberate, incremental progress. By breaking down large tasks into manageable milestones, students can ensure that they are not just passively absorbing information, but actively engaging with the material.",
    "Furthermore, communication with faculty members is paramount. Many students hesitate to attend office hours, viewing them as intimidating. However, professors are usually eager to clarify concepts and provide direction, which can significantly enhance the quality of your submitted work.",
    "Another vital component is peer collaboration. Forming study groups allows students to exchange perspectives, debate theories, and catch errors that they might have overlooked in their own independent review. This collaborative environment mimics the professional world.",
    "It is also essential to leverage university resources. Most institutions offer writing centers, libraries with dedicated subject librarians, and tutoring services. These resources are designed to bridge the gap between secondary education habits and university-level expectations.",
    "Time management often dictates the difference between an average grade and an exceptional one. Employing tools like digital calendars, task tracking software, or even a simple physical planner can help students visualize their deadlines and allocate their time efficiently.",
    "Finally, mental health and well-being should never be sacrificed for academic pursuits. Burnout is a genuine risk, and recognizing when to take a step back, rest, and recharge is a skill that will serve students well beyond their university years."
]

def generate_content(country_key, service_key):
    c = COUNTRIES[country_key]
    s = SERVICES[service_key]
    
    # Select random fillers
    fillers = random.sample(FILLER_PARAGRAPHS, 6)
    
    content = f"""
<p>Navigating the academic landscape in {c['name']} requires dedication, focus, and a solid understanding of university expectations. When it comes to <strong>{s['title']}</strong>, many students find themselves challenged by the {c['system']}. This comprehensive guide is designed to help you excel.</p>

<h2>{c['h2_1']}</h2>
<p>Universities in {c['name']} are known for their rigorous academic standards. Whether you are dealing with {c['details']}, the key to success lies in understanding the institutional frameworks. Specifically, mastering {s['focus']} is essential.</p>
<p>{fillers[0]}</p>
<p>For more detailed institutional guidelines, students often consult the {c['links'][0]}, which provides authoritative insights into expected standards.</p>

<h2>{c['h2_2']}</h2>
<p>A major component of your academic journey will involve the local grading structures, such as {c['grading']}. To achieve top marks, you must focus on {s['action']}.</p>
<p>{fillers[1]}</p>
<p>{fillers[2]}</p>
<p>Ensuring formatting correctness is also critical. Always refer to resources like {c['links'][1]} to avoid common formatting and citation errors that could cost you valuable points.</p>

<h2>{c['h2_3']}</h2>
<p>Every educational system has its unique flavor. In {c['name']}, adapting to {c['details']} means you need to be proactive. {fillers[3]}</p>
<p>{fillers[4]}</p>

<h2>Optimizing Your {s['title']} Strategy</h2>
<p>{fillers[5]}</p>
<p>In addition to time management, always ensure that your work aligns with the core principles of {s['focus']}. Understanding what your professors are looking for—whether it’s {c['grading']} or adherence to {c['system']}—will make a significant difference.</p>
<p style="margin-top: 2rem;"><strong>Need expert assistance?</strong> Explore our professional <a href="{s['cta']}/{country_key}">{s['title']} in {c['name']}</a> services for personalized guidance and support tailored to your academic needs.</p>
"""
    return content

# TASK 1: Rewrite the 20 files
files = [f for f in os.listdir(BASE_DIR) if f.startswith("mastering-") and f.endswith(".html")]

for file in files:
    path = os.path.join(BASE_DIR, file)
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Split content to keep the bottom section
    parts = content.split('<section class="related-blogs"')
    if len(parts) < 2:
        print(f"Skipping {file} - missing related-blogs section")
        continue
        
    bottom_section = '<section class="related-blogs"' + parts[1]
    
    # Determine country and service
    country_key = None
    for k in COUNTRIES.keys():
        if k in file:
            country_key = k
            break
            
    service_key = None
    if "assignment-help" in file:
        service_key = "assignment-help"
    elif "essay-writing" in file:
        service_key = "essay-writing"
    elif "study-guidance" in file:
        service_key = "study-guidance"
    elif "research-support" in file:
        service_key = "research-support"
        
    if not country_key or not service_key:
        print(f"Could not determine country/service for {file}")
        continue
        
    new_body = generate_content(country_key, service_key)
    full_new_content = new_body + "\n\n" + bottom_section
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(full_new_content)
        
    print(f"Rewrote {file}")

# TASK 2: Fix fractured brand links
print("\nFixing fractured brand links...")
html_files = [f for f in os.listdir(BASE_DIR) if f.endswith(".html")]
domains_to_replace = [
    "https://academicwizard.com",
    "http://academicwizard.com",
    "https://academicwizard.co.uk",
    "http://academicwizard.co.uk",
    "https://academicwizard.com.au",
    "http://academicwizard.com.au",
    "https://academicwizard.ca",
    "http://academicwizard.ca",
    "https://www.academicwizard.com",
    "http://www.academicwizard.com"
]

for file in html_files:
    path = os.path.join(BASE_DIR, file)
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    modified = content
    for domain in domains_to_replace:
        modified = modified.replace(f'href="{domain}/', 'href="/')
        modified = modified.replace(f'href="{domain}"', 'href="/"')
        
    if modified != content:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(modified)
        print(f"Fixed links in {file}")

# TASK 3: Add outbound authority links to other posts
print("\nAdding outbound authority links to other posts...")
authority_links = [
    '<a href="https://apastyle.apa.org/">APA Style Guidelines</a>',
    '<a href="https://owl.purdue.edu/">Purdue OWL</a>',
    '<a href="https://www.qaa.ac.uk/">QAA Standards</a>'
]

for file in html_files:
    if file.startswith("mastering-"):
        continue
        
    path = os.path.join(BASE_DIR, file)
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Check if there are outbound links in the body (before related-blogs)
    parts = content.split('<section class="related-blogs"')
    if len(parts) < 2:
        continue
        
    body = parts[0]
    # Simple check for http/https not pointing to schema.org
    outbound_count = len(re.findall(r'href="http(?!s?://schema\.org)', body))
    
    if outbound_count == 0:
        # Add a couple of links randomly in the paragraphs
        link_str = " For further reading, consult " + random.choice(authority_links) + "."
        # Find a suitable paragraph to append to
        body = re.sub(r'</p>', r'</p>', body, count=1) # No wait, this doesn't insert.
        # Let's insert before the first </h2>
        pieces = body.split('</h2>', 1)
        if len(pieces) == 2:
            pieces[0] = pieces[0] + f"<p>Ensure you reference authoritative sources. {link_str}</p>"
            new_body = pieces[0] + "</h2>" + pieces[1]
            full_new_content = new_body + '<section class="related-blogs"' + parts[1]
            with open(path, 'w', encoding='utf-8') as f:
                f.write(full_new_content)
            print(f"Added authority links to {file}")

print("All tasks completed.")
