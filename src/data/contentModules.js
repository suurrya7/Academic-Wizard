// Master content modules aggregator
// Combines all subject, country, city, and service content modules
// Used by SubjectCityPage.jsx to render 800-1200 words of unique content per page

import { nursing, law, psychology, education, sociology, history } from './contentModules_subjects_group1';
import { mba, business, accounting, finance, marketing, economics } from './contentModules_subjects_group2';
import { computerScience, engineering, dataScience, englishLiterature, healthcare } from './contentModules_subjects_group3';
import { countryModules, serviceModules } from './contentModules_countries';
import { cityModules } from './contentModules_cities';

// Map subject slugs (from URL) to their content modules
export const subjectModules = {
    'nursing': nursing,
    'law': law,
    'psychology': psychology,
    'education': education,
    'sociology': sociology,
    'history': history,
    'mba': mba,
    'business': business,
    'accounting': accounting,
    'finance': finance,
    'marketing': marketing,
    'economics': economics,
    'computer-science': computerScience,
    'engineering': engineering,
    'data-science': dataScience,
    'english-literature': englishLiterature,
    'healthcare': healthcare,
};

export { countryModules, serviceModules, cityModules };

/**
 * Assembles unique content sections for a SubjectCityPage.
 * Combines subject-specific, service-specific, country-specific, and city-specific modules
 * to produce 800-1200 words of genuinely unique, academically valuable content.
 *
 * @param {string} subjectSlug - The subject slug (e.g., 'nursing', 'computer-science')
 * @param {string} serviceSlug - The service slug (e.g., 'assignment-help', 'dissertation-help')
 * @param {string} countrySlug - The country slug (e.g., 'uk', 'usa')
 * @param {string} citySlug - The city/region slug (e.g., 'london', 'sydney') or null if subject page
 * @param {string} pageType - 'subject' or 'city'
 * @param {string} cleanSubjectName - Display name of the subject/city
 * @returns {Array<{heading: string, content: string, icon: string}>} Array of content sections
 */
export function assembleUniqueContent(subjectSlug, serviceSlug, countrySlug, citySlug, pageType, cleanSubjectName) {
    const subject = subjectModules[subjectSlug] || subjectModules[citySlug];
    const country = countryModules[countrySlug];
    const service = serviceModules[serviceSlug];
    const city = cityModules[citySlug];

    const sections = [];

    if (pageType === 'subject' && subject) {
        // Section 1: Subject Academic Landscape (from subject.core)
        if (subject.core) {
            sections.push({
                heading: `Understanding ${cleanSubjectName} in Academic Context`,
                content: subject.core,
                icon: 'BookOpen'
            });
        }

        // Section 2: Service-specific methodology (from subject.byService)
        const serviceContent = subject.byService?.[serviceSlug];
        if (serviceContent) {
            const serviceLabel = service ? serviceSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Academic Support';
            sections.push({
                heading: `How Our ${serviceLabel} Works for ${cleanSubjectName}`,
                content: serviceContent,
                icon: 'FileText'
            });
        }

        // Section 3: Country-specific academic standards
        if (country?.standards) {
            sections.push({
                heading: `${cleanSubjectName} Academic Standards in ${countrySlug.toUpperCase() === 'UK' ? 'the UK' : countrySlug.toUpperCase() === 'USA' ? 'the USA' : country.grading ? countrySlug.charAt(0).toUpperCase() + countrySlug.slice(1) : countrySlug.toUpperCase()}`,
                content: country.standards + (country.grading ? '\n\n' + country.grading : ''),
                icon: 'GraduationCap'
            });
        }

        // Section 4: Why students struggle (from subject.challenges)
        if (subject.challenges) {
            sections.push({
                heading: `Common Challenges in ${cleanSubjectName} Coursework`,
                content: subject.challenges,
                icon: 'Zap'
            });
        }

        // Section 5: Service process and guarantees
        if (service?.methodology) {
            sections.push({
                heading: `Our Quality Assurance Process`,
                content: service.methodology + (service.guarantees ? '\n\n' + service.guarantees : ''),
                icon: 'ShieldCheck'
            });
        }

        // Section 6: Key frameworks (rendered as bullet points in the component)
        if (subject.frameworks?.length > 0 || subject.keyTheories?.length > 0) {
            const frameworkList = (subject.frameworks || []).join(', ');
            const theoryList = (subject.keyTheories || []).join(', ');
            let content = '';
            if (frameworkList) content += `Key academic frameworks our specialists apply: ${frameworkList}.`;
            if (theoryList) content += `${content ? ' ' : ''}Foundational theories covered: ${theoryList}.`;
            if (subject.assessmentTypes?.length > 0) {
                content += ` Common assessment formats we support: ${subject.assessmentTypes.join(', ')}.`;
            }
            sections.push({
                heading: `Academic Frameworks & Assessment Support`,
                content: content,
                icon: 'Layers'
            });
        }
    } else if (pageType === 'city' && city) {
        // City pages get city context + country standards + service info
        if (city.context) {
            sections.push({
                heading: `Studying in ${cleanSubjectName}: Academic Landscape`,
                content: city.context,
                icon: 'MapPin'
            });
        }

        if (city.universities?.length > 0) {
            sections.push({
                heading: `Universities We Support in ${cleanSubjectName}`,
                content: `Our academic specialists provide expert support for students at leading institutions in ${cleanSubjectName}, including ${city.universities.join(', ')}. Each university has unique assessment criteria, marking rubrics, and citation preferences that our team is fully equipped to handle.`,
                icon: 'GraduationCap'
            });
        }

        if (country?.standards) {
            sections.push({
                heading: `Academic Standards & Grading System`,
                content: country.standards + (country.grading ? '\n\n' + country.grading : ''),
                icon: 'Award'
            });
        }

        if (service?.methodology) {
            sections.push({
                heading: `Our Quality Assurance Process`,
                content: service.methodology + (service.guarantees ? '\n\n' + service.guarantees : ''),
                icon: 'ShieldCheck'
            });
        }
    }

    return sections;
}
