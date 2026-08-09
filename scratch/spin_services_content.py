import re
import random

FILE_PATH = "/Users/surya/Desktop/Academic Wizard Latest./src/data/services.js"

# Unique variations for guarantees
GUARANTEES_POOL = [
    [
        "Zero Plagiarism Guarantee — Full Turnitin report provided",
        "Unlimited Iterations — We revise until you are happy",
        "Deadline Security — 100% refund if late",
        "Absolute Privacy — Your information is encrypted",
        "Punctual Delivery — 99% success rate on deadlines"
    ],
    [
        "Original Content Only — Guaranteed by Turnitin checks",
        "Free Amendments — Revisions at no extra cost",
        "Money-Back Assurance — If we miss the deadline, you don't pay",
        "Strict Confidentiality — We never share your data",
        "Timely Submission — Consistently meeting tight deadlines"
    ],
    [
        "100% Originality — Checked via advanced anti-plagiarism tools",
        "Complimentary Revisions — Ensuring your complete satisfaction",
        "Refund Policy — Secure deadlines with our money-back promise",
        "Data Protection — Bank-grade security for your details",
        "Always on Time — We respect your academic schedule"
    ],
    [
        "Plagiarism-Free Work — Authentic research every time",
        "Iterative Refinement — Free revisions included",
        "On-Time or It's Free — strict adherence to your timelines",
        "Discreet Service — Total anonymity maintained",
        "Rapid Turnaround — Delivering quality work promptly"
    ]
]

# Unique variations for case studies
def generate_case_study(country):
    subjects = ["Law", "Nursing", "Business Management", "Computer Science", "Engineering", "Economics"]
    improvements = ["jumped a full grade boundary", "achieved top marks", "secured a distinction", "passed with flying colors"]
    subject = random.choice(subjects)
    improvement = random.choice(improvements)
    
    templates = [
        f'A {country} student was facing difficulties with a complex {subject} module. We provided targeted structural guidance and comprehensive proofreading, resulting in the student having {improvement}.',
        f'Facing a tight deadline, a {subject} major from {country} reached out. Our expert team helped them refine their core arguments and format the paper flawlessly. The outcome? They {improvement}.',
        f'We assisted a {country}-based {subject} student who needed help synthesizing extensive research. By streamlining their literature review and strengthening their thesis, they {improvement}.',
        f'A university student in {country} struggled with the rigorous grading of their {subject} course. Through our detailed feedback and editing support, their submission {improvement}.'
    ]
    title = f'"{subject} Success Story in {country}"'
    content = f'"{random.choice(templates)}"'
    return f'[{{"title": {title}, "content": {content}}}]'


def main():
    with open(FILE_PATH, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Fix Pricing Strings across all locations to reflect $6 base rate
    # Regex to find the pricing property in countries
    content = re.sub(
        r'pricing:\s*"[^"]*",',
        'pricing: "Pricing starts from just $6 per page (250 words). Contact us for a personalized quote.",',
        content
    )

    # 2. Spin Guarantees
    def spin_guarantees(match):
        chosen = random.choice(GUARANTEES_POOL)
        guarantees_str = ", ".join([f'"{g}"' for g in chosen])
        return f'guarantees: [{guarantees_str}],'
    
    content = re.sub(r'guarantees:\s*\[.*?\],', spin_guarantees, content)

    # 3. Spin Case Studies
    def spin_case_studies(match):
        # We need the country name. Let's do a broader replacement later or just inject country-agnostic ones here if we can't get it easily.
        # Actually, since caseStudies is near universities/faqs, let's just use generic variations.
        subjects = ["Law", "Nursing", "Business Management", "Computer Science", "Engineering", "Economics"]
        improvements = ["jumped a full grade boundary", "achieved top marks", "secured a distinction", "passed with flying colors"]
        subject = random.choice(subjects)
        improvement = random.choice(improvements)
        templates = [
            f'A student was facing difficulties with a complex {subject} module. We provided targeted structural guidance and comprehensive proofreading, resulting in the student having {improvement}.',
            f'Facing a tight deadline, a {subject} major reached out. Our expert team helped them refine their core arguments and format the paper flawlessly. The outcome? They {improvement}.',
            f'We assisted a {subject} student who needed help synthesizing extensive research. By streamlining their literature review and strengthening their thesis, they {improvement}.',
            f'A university student struggled with the rigorous grading of their {subject} course. Through our detailed feedback and editing support, their submission {improvement}.'
        ]
        title = f'"{subject} Success Story"'
        content_text = f'"{random.choice(templates)}"'
        return f'caseStudies: [{{"title": {title}, "content": {content_text}}}],'

    content = re.sub(r'caseStudies:\s*\[.*?\],', spin_case_studies, content)

    # Save the updated file
    with open(FILE_PATH, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print("Successfully spun duplicated boilerplate arrays and updated pricing to $6.")

if __name__ == "__main__":
    main()
