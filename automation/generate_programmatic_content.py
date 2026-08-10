import json
import os
import random
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent
SPECIALIZED_JSON_PATH = SCRIPT_DIR / "specialized.json"
OUTPUT_JSON_PATH = PROJECT_ROOT / "src" / "data" / "specializedContent.json"

TEMPLATES = [
    """
    <h2>Expert Academic Support for {title} in {region}</h2>
    <p>Navigating the rigorous demands of university education in {region} requires not only exceptional subject knowledge but also a profound understanding of specialized academic conventions. Our dedicated service for <strong>{title}</strong> is meticulously designed to provide students with the highest caliber of localized academic guidance, research assistance, and comprehensive proofreading. We understand that the academic landscape here demands critical analysis, original thought, and flawless presentation. Therefore, our team of PhD and Master's-qualified specialists offers tailored coaching to help you meet and exceed these stringent university standards.</p>
    
    <h3>Comprehensive Methodological Guidance</h3>
    <p>A critical component of academic success in {region} is demonstrating robust methodological rigor. Whether you are dealing with qualitative paradigms like thematic analysis or complex quantitative statistical modeling, our experts provide step-by-step guidance. We assist you in framing your research questions, selecting appropriate data collection instruments, and ethically analyzing your findings. This hands-on approach ensures that your academic submissions are not merely descriptive, but deeply analytical and grounded in sound research philosophy, significantly elevating your potential grades.</p>
    
    <h3>Strict Adherence to Local Referencing Standards</h3>
    <p>We recognize that universities in {region} enforce strict policies regarding academic integrity and referencing conventions (such as APA, Harvard, OSCOLA, or MHRA). A single formatting error can severely impact your overall grade. Our dedicated proofreading and editing service meticulously reviews every citation and bibliography entry in your work. We provide critical feedback on how to integrate literature seamlessly, avoiding accidental plagiarism while demonstrating a sophisticated synthesis of peer-reviewed sources relevant to <em>{keyword}</em>.</p>
    
    <h3>Bespoke Academic Coaching and Skill Development</h3>
    <p>Beyond immediate assignment support, our overarching goal is to foster your independent academic development. Our coaching sessions focus on essential study skills tailored to the expectations of {region}'s academic institutions. We teach advanced time-management strategies, deep-reading techniques, and structured academic writing methods. By partnering with us for {title}, you are not just ensuring the quality of your current project; you are investing in a sustainable skill set that will benefit you throughout your entire academic journey and into your professional career.</p>
    
    <h3>Ethical, High-Quality Research Support</h3>
    <p>Academic Wizard strictly adheres to all academic integrity policies. We do not engage in contract cheating. Instead, we empower you by providing model answers, detailed structural frameworks, and comprehensive developmental editing. Our approach is entirely collaborative. We serve as your academic mentors, helping you to refine your arguments, clarify your writing, and present your original research with the utmost confidence and scholarly authority. Let our expertise in {keyword} guide you toward academic excellence in {region}.</p>
    """,
    """
    <h2>Elevate Your Grades with {title} in {region}</h2>
    <p>The academic environment in {region} is highly competitive, and achieving distinction requires a nuanced approach to study and research. Our specialized <strong>{title}</strong> service is specifically designed to support students navigating these complex requirements. We bridge the gap between theoretical understanding and practical academic application, providing you with the targeted support necessary to excel. Our local academic experts understand the specific grading rubrics and expectations of institutions in {region}, ensuring that the guidance you receive is directly relevant and highly actionable.</p>
    
    <h3>Targeted Support for Complex Academic Challenges</h3>
    <p>Whether you are struggling with a complex literature review, a data-heavy research methodology, or a highly theoretical essay, our {title} service provides the clarity you need. We break down daunting academic tasks into manageable, structured steps. Our advisors provide comprehensive feedback on your drafts, highlighting areas where your critical analysis can be deepened, your arguments strengthened, and your overall academic narrative made more compelling. This structured support is vital for mastering the intricacies of <em>{keyword}</em>.</p>
    
    <h3>Mastering Academic Tone and Style</h3>
    <p>A frequent challenge for students in {region} is mastering the formal academic tone required for top-tier grades. Our professional editing team works closely with you to elevate your writing style. We focus on enhancing vocabulary, ensuring logical flow between paragraphs, and eliminating colloquialisms. We help you project a confident, authoritative academic voice that demonstrates a profound understanding of your subject matter, ensuring your work reads professionally and academically.</p>
    
    <h3>Robust Formatting and Citation Checks</h3>
    <p>Accurate referencing is the bedrock of academic integrity in {region}. Our comprehensive service includes exhaustive checks of your citations against the required style guide (e.g., APA 7th ed., Chicago, Harvard). We help you navigate the complexities of citing diverse sources, from peer-reviewed journal articles and edited books to digital media and primary data. This meticulous attention to detail ensures your work is structurally flawless and academically sound, protecting you from unintentional plagiarism.</p>
    
    <h3>Empowering Your Academic Journey</h3>
    <p>Our commitment is to your long-term academic empowerment. The support we provide for {title} is designed to be highly educational. We provide detailed explanatory notes alongside our edits, ensuring you understand exactly why a change was suggested and how you can apply that principle to your future writing. Academic Wizard is your trusted partner for academic success in {region}, providing ethical, comprehensive, and deeply localized support to help you achieve your full potential.</p>
    """
]

def main():
    with open(SPECIALIZED_JSON_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    country_subjects = data.get("countrySubjects", {})
    country_cities = data.get("countryCities", {})

    generated_content = {}
    total = 0

    # Generate for Subjects
    for country, subjects in country_subjects.items():
        for subject in subjects:
            key = f"{country}-{subject['slug']}"
            template = random.choice(TEMPLATES)
            
            # Format the template with specific variables
            content = template.format(
                title=subject.get('title', ''),
                region=country.upper(),
                keyword=subject.get('targetKeyword', '')
            )
            generated_content[key] = content.strip()
            total += 1

    # Generate for Cities
    for country, cities in country_cities.items():
        for city in cities:
            key = f"{country}-{city['slug']}"
            template = random.choice(TEMPLATES)
            
            content = template.format(
                title=city.get('title', ''),
                region=f"{city.get('name', '')}, {country.upper()}",
                keyword=city.get('targetKeyword', '')
            )
            generated_content[key] = content.strip()
            total += 1

    with open(OUTPUT_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(generated_content, f, indent=2)

    print(f"Programmatic generation complete. {total} specialized content blocks generated.")

if __name__ == "__main__":
    main()
