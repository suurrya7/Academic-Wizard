import re
import os

file_path = '/Users/surya/Desktop/Academic Wizard Latest./src/data/services.js'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
current_service = None
current_country = None
in_faqs = False
in_keywords = False
in_case_studies = False
bracket_depth = 0

country_names = {
    'uk': 'UK', 'usa': 'USA', 'australia': 'Australia',
    'canada': 'Canada', 'india': 'India', 'ireland': 'Ireland',
    'singapore': 'Singapore', 'germany': 'Germany'
}

service_names = {
    'assignment-help': 'Assignment Help',
    'essay-help': 'Essay Help',
    'dissertation-help': 'Dissertation Help',
    'literature-review': 'Literature Review',
    'research-paper-help': 'Research Paper Help',
    'editing-proofreading': 'Editing & Proofreading',
    'study-guidance': 'Study Guidance'
}

def generate_faqs(service, country):
    service_name = service_names.get(service, 'Assignment Help')
    country_name = country_names.get(country, 'UK')
    currency = '£' if country == 'uk' else '$'
    if country == 'india': currency = '₹'
    if country == 'germany': currency = '€'
    
    return f"""                faqs: [
                    {{ q: "How much does {service_name.lower()} cost in {country_name}?", a: "Our pricing for {service_name.lower()} is flexible and depends on the complexity of the task, starting around {currency}10-{currency}20." }},
                    {{ q: "Is {service_name.lower()} legal in {country_name}?", a: "Yes, our {service_name.lower()} services act as model answers and research aids, strictly adhering to academic integrity guidelines in {country_name}." }},
                    {{ q: "Are the writers from {country_name}?", a: "We work with top academic experts, many of whom have degrees from leading universities in {country_name}." }},
                    {{ q: "How do you ensure plagiarism-free work?", a: "Every piece of work goes through rigorous quality checks, including advanced plagiarism scanning software." }},
                    {{ q: "Can I communicate with my expert?", a: "Yes, our platform allows you to message your assigned academic expert directly for updates and clarifications." }},
                    {{ q: "What if I need revisions?", a: "We offer free unlimited revisions within the scope of your original requirements to ensure complete satisfaction." }},
                    {{ q: "Do you guarantee a specific grade?", a: "While we cannot guarantee a specific grade due to university policies, our work is crafted to meet high academic standards." }},
                    {{ q: "How fast can you deliver?", a: "Depending on the service, we can handle urgent deadlines as short as 24-48 hours." }},
                    {{ q: "Are my details kept confidential?", a: "Absolutely. We adhere to strict data protection laws and never share your personal information." }},
                    {{ q: "What subjects do you cover for {service_name.lower()}?", a: "We cover a vast array of subjects from Nursing and Law to Business and Computer Science." }}
                ],
"""

def generate_case_studies(service, country):
    service_name = service_names.get(service, 'Assignment Help')
    country_name = country_names.get(country, 'UK')
    
    return f"""                caseStudies: [
                    {{
                        title: "University Student in {country_name}",
                        challenge: "Struggling with a complex {service_name.lower()} deadline and unclear requirements.",
                        solution: "Our expert provided structured guidance and a model answer tailored to the university's rubric.",
                        result: "The student achieved a high distinction and improved their own writing skills."
                    }},
                    {{
                        title: "Postgraduate Student in {country_name}",
                        challenge: "Needed advanced support for their {service_name.lower()} with deep research.",
                        solution: "Matched with a PhD-level expert who helped refine the methodology and structure.",
                        result: "Successfully submitted on time with excellent feedback from the supervisor."
                    }}
                ],
"""

def generate_keywords(service, country):
    service_name = service_names.get(service, 'Assignment Help')
    country_name = country_names.get(country, 'UK')
    return f"""                keywords: ["{service_name.lower()} {country_name}", "best {service_name.lower()} {country_name}", "online {service_name.lower()} {country_name}", "buy {service_name.lower()} {country_name}"],
"""

i = 0
while i < len(lines):
    line = lines[i]
    
    # Track service slug
    service_match = re.search(r"slug:\s*['\"](assignment-help|essay-help|dissertation-help|literature-review|research-paper-help|editing-proofreading|study-guidance)['\"]", line)
    if service_match and bracket_depth == 2:
        current_service = service_match.group(1)
        
    # Track country slug
    country_match = re.search(r"slug:\s*['\"](uk|usa|australia|canada|india|ireland|singapore|germany)['\"]", line)
    if country_match and bracket_depth >= 4:
        current_country = country_match.group(1)
        new_lines.append(line)
        
        # Inject metaTitle right after the country slug
        service_name = service_names.get(current_service, 'Assignment Help')
        country_name = country_names.get(current_country, 'UK')
        props = {
            'assignment-help': 'Expert Writers | From £8/page',
            'essay-help': 'Native Writers | A+ Guarantee',
            'dissertation-help': 'PhD Experts | Free Revisions',
            'literature-review': 'Top Researchers | Plagiarism-Free',
            'research-paper-help': 'HD-Grade Support | Affordable Rates',
            'editing-proofreading': 'Flawless Editing | Fast Turnaround',
            'study-guidance': 'Top Tutors | 24/7 Support'
        }
        val_prop = props.get(current_service, 'Expert Writers | A+ Guarantee')
        meta_title = f"{service_name} {country_name} — {val_prop} | Academic Wizard"
        new_lines.append(f"                metaTitle: \"{meta_title}\",\n")
        
        i += 1
        continue

    # Remove existing metaTitle if it exists so we don't duplicate
    if "metaTitle:" in line and current_country:
        i += 1
        continue

    # Handle arrays (faqs, keywords, caseStudies)
    if current_country:
        if "faqs: [" in line:
            in_faqs = True
            new_lines.append(generate_faqs(current_service, current_country))
            i += 1
            continue
        elif "keywords: [" in line:
            in_keywords = True
            new_lines.append(generate_keywords(current_service, current_country))
            i += 1
            continue
        elif "caseStudies: [" in line:
            in_case_studies = True
            new_lines.append(generate_case_studies(current_service, current_country))
            i += 1
            continue
            
        if in_faqs or in_keywords or in_case_studies:
            if "]," in line or "]" in line:
                if in_faqs and "]" in line: in_faqs = False
                if in_keywords and "]" in line: in_keywords = False
                if in_case_studies and "]" in line: in_case_studies = False
            i += 1
            continue

    # Track brackets for depth
    bracket_depth += line.count('{') - line.count('}')
    if bracket_depth < 4:
        current_country = None
        
    new_lines.append(line)
    i += 1

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("services.js rewritten successfully.")
