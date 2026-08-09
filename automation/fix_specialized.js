const fs = require('fs');
const path = require('path');

const targetFile = path.resolve(__dirname, '../src/data/specializedPages.js');
let content = fs.readFileSync(targetFile, 'utf8');

// Helper to make descriptions unique
function getSubjectDesc(subject, country, countryName) {
    const templates = [
        `Expert ${subject} assignment help tailored for students in ${countryName}. Get comprehensive support for coursework and research.`,
        `Top-rated ${subject} assignment writing service in ${countryName}. We ensure high academic standards for your university submissions.`,
        `Need help with your ${subject} assignments in ${countryName}? Our local academic experts provide custom research and writing assistance.`,
        `Professional ${subject} assignment help across ${countryName}. Achieve better grades with our specialized academic support.`,
        `Custom ${subject} assignment solutions for ${countryName} universities. From essays to research papers, we cover it all.`
    ];
    // Pick a template based on the length of the country name + subject name
    const hash = (subject.length + country.length) % templates.length;
    return templates[hash];
}

function getCityDesc(city, countryName) {
    const templates = [
        `Top-tier assignment help for students studying at universities across ${city}. Expert academic support in your local area.`,
        `Get reliable assignment writing services in ${city}. We help students at local universities achieve their academic goals.`,
        `Professional academic assistance tailored for ${city} students. Expert writers familiar with your university's standards.`,
        `Struggling with assignments in ${city}? Our dedicated team provides custom essays and research papers.`,
        `The leading assignment help service in ${city}. Trusted by university students for quality and timely delivery.`
    ];
    // Pick a template based on the length of the city name
    const hash = city.length % templates.length;
    return templates[hash];
}

const countryNames = {
    uk: 'the UK',
    usa: 'the USA',
    australia: 'Australia',
    canada: 'Canada',
    india: 'India',
    ireland: 'Ireland',
    singapore: 'Singapore',
    germany: 'Germany'
};

// We will parse the file using regex and string replacement, or since it's just exporting JS objects, we can actually require it (if we transform it) or parse it.
// Actually, it's easier to use a Python script with regex to modify the objects, or just generate the whole file since we know the subjects and cities.
