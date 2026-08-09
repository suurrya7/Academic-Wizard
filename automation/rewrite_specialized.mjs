const fs = require('fs');
const path = require('path');

const specializedJsonFile = path.resolve(__dirname, 'specialized.json');
let data = JSON.parse(fs.readFileSync(specializedJsonFile, 'utf8'));

const countryNames = {
    uk: 'the UK', usa: 'the USA', australia: 'Australia',
    canada: 'Canada', india: 'India', ireland: 'Ireland',
    singapore: 'Singapore', germany: 'Germany'
};

function getSubjectDesc(subject, countryCode, countryName) {
    const templates = [
        `Expert ${subject} assignment help tailored for students in ${countryName}. Get comprehensive support for coursework and research.`,
        `Top-rated ${subject} assignment writing service in ${countryName}. We ensure high academic standards for your university submissions.`,
        `Need help with your ${subject} assignments in ${countryName}? Our local academic experts provide custom research and writing assistance.`,
        `Professional ${subject} assignment help across ${countryName}. Achieve better grades with our specialized academic support.`,
        `Custom ${subject} assignment solutions for ${countryName} universities. From essays to research papers, we cover it all.`
    ];
    let hash = 0;
    for (let i = 0; i < subject.length; i++) { hash += subject.charCodeAt(i); }
    for (let i = 0; i < countryCode.length; i++) { hash += countryCode.charCodeAt(i); }
    return templates[hash % templates.length];
}

function getCityDesc(city, countryName) {
    const templates = [
        `Top-tier assignment help for students studying at universities across ${city}. Expert academic support in your local area.`,
        `Get reliable assignment writing services in ${city}. We help students at local universities achieve their academic goals.`,
        `Professional academic assistance tailored for ${city} students. Expert writers familiar with your university's standards.`,
        `Struggling with assignments in ${city}? Our dedicated team provides custom essays and research papers.`,
        `The leading assignment help service in ${city}. Trusted by university students for quality and timely delivery.`
    ];
    let hash = 0;
    for (let i = 0; i < city.length; i++) { hash += city.charCodeAt(i); }
    return templates[hash % templates.length];
}

for (const [countryCode, subjects] of Object.entries(data.countrySubjects)) {
    const cName = countryNames[countryCode] || countryCode;
    for (let subject of subjects) {
        let subjectName = subject.title.replace(/ Assignment Help.*/i, '');
        subject.desc = getSubjectDesc(subjectName, countryCode, cName);
    }
}

for (const [countryCode, cities] of Object.entries(data.countryCities)) {
    const cName = countryNames[countryCode] || countryCode;
    for (let city of cities) {
        let cityName = city.title.replace(/Assignment Help /i, '');
        city.desc = getCityDesc(cityName, cName);
    }
}

// Generate file content
let jsContent = `// specializedPages.js
// Stores the data for subject-specific and city-specific programmatic SEO pages.

export const countrySubjects = ${JSON.stringify(data.countrySubjects, null, 4)};

export const countryCities = ${JSON.stringify(data.countryCities, null, 4)};

export const dissertationTopics = [
    { slug: 'nursing-topics', title: 'Nursing Dissertation Topics', category: 'Nursing', desc: 'A comprehensive list of the best nursing dissertation topics for your research.' },
    { slug: 'business-topics', title: 'Business Management Dissertation Topics', category: 'Business', desc: 'Top business management dissertation topics for undergraduate and postgraduate students.' },
    { slug: 'law-topics', title: 'Law Dissertation Topics', category: 'Law', desc: 'Engaging and relevant law dissertation topics covering commercial, criminal, and international law.' },
    { slug: 'psychology-topics', title: 'Psychology Dissertation Topics', category: 'Psychology', desc: 'Explore unique psychology dissertation topics across cognitive, clinical, and developmental fields.' },
    { slug: 'education-topics', title: 'Education Dissertation Topics', category: 'Education', desc: 'Innovative education dissertation topics for teachers and education studies students.' },
    { slug: 'marketing-topics', title: 'Marketing Dissertation Topics', category: 'Marketing', desc: 'Current marketing dissertation topics focusing on digital trends and consumer behavior.' },
    { slug: 'accounting-topics', title: 'Accounting Dissertation Topics', category: 'Accounting', desc: 'Top accounting and finance dissertation topics for your final year research project.' },
    { slug: 'computer-science-topics', title: 'Computer Science Dissertation Topics', category: 'Computer Science', desc: 'Cutting-edge computer science dissertation topics including AI, cyber security, and data science.' },
    { slug: 'history-topics', title: 'History Dissertation Topics', category: 'History', desc: 'Fascinating history dissertation topics spanning ancient, modern, and contemporary eras.' },
    { slug: 'sociology-topics', title: 'Sociology Dissertation Topics', category: 'Sociology', desc: 'Thought-provoking sociology dissertation topics exploring modern social issues.' }
];
`;

const outputFile = path.resolve(__dirname, '../src/data/specializedPages.js');
fs.writeFileSync(outputFile, jsContent, 'utf8');
console.log('Successfully updated specializedPages.js');
