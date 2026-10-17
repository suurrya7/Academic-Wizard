import React from 'react';
import { Helmet } from 'react-helmet-async';
import PageHeader from '../components/PageHeader';
import { GraduationCap, Award, CheckCircle2, MessageCircle, BookOpen, Globe } from 'lucide-react';

const EXPERTS = [
    {
        id: "dr-priya-raghunathan",
        name: "Dr. Priya Raghunathan",
        credentials: "PhD in Finance, Indian Institute of Management Ahmedabad",
        subjects: ["Banking", "Corporate Finance", "Financial Markets"],
        countries: ["India", "UK", "Singapore"],
        bio: "Finance researcher with 10+ years supervising master’s dissertations on banking performance and fintech disruption."
    },
    {
        id: "dr-arjun-mehta",
        name: "Dr. Arjun Mehta",
        credentials: "PhD in Computer Science, University of Leeds",
        subjects: ["Machine Learning", "Data Analytics", "Software Engineering"],
        countries: ["UK", "India", "Canada"],
        bio: "Senior academic with 8+ years guiding undergraduate and postgraduate projects in AI and data science."
    },
    {
        id: "dr-kavitha-subramanian",
        name: "Dr. Kavitha Subramanian",
        credentials: "PhD in Management, London School of Economics",
        subjects: ["Business Strategy", "Organisational Behaviour", "HRM"],
        countries: ["UK", "Ireland", "Australia"],
        bio: "UK-based NRI lecturer with 9 years of experience supervising MBA and MSc research projects."
    },
    {
        id: "dr-rohan-deshmukh",
        name: "Dr. Rohan Deshmukh",
        credentials: "PhD in Mechanical Engineering, IIT Bombay",
        subjects: ["Thermodynamics", "Manufacturing", "Robotics"],
        countries: ["India", "Germany", "USA"],
        bio: "Engineering academic with 12 years of teaching and thesis mentoring experience."
    },
    {
        id: "dr-ananya-chatterjee",
        name: "Dr. Ananya Chatterjee",
        credentials: "PhD in Economics, University of Cambridge",
        subjects: ["Econometrics", "Development Economics", "Macroeconomics"],
        countries: ["UK", "USA", "India"],
        bio: "Economist with 7+ years of experience supporting quantitative dissertations and statistical modelling."
    },
    {
        id: "dr-vikram-nair",
        name: "Dr. Vikram Nair",
        credentials: "PhD in Electrical Engineering, University of Toronto",
        subjects: ["Power Systems", "Signal Processing", "IoT"],
        countries: ["Canada", "USA"],
        bio: "Canada-based NRI researcher who has supervised 40+ undergraduate and master’s theses."
    },
    {
        id: "dr-sneha-kulkarni",
        name: "Dr. Sneha Kulkarni",
        credentials: "PhD in Psychology, University of Delhi",
        subjects: ["Clinical Psychology", "Research Methods", "SPSS Analysis"],
        countries: ["India", "UK", "Australia"],
        bio: "Psychologist with 8 years of experience in survey design, qualitative coding, and thesis guidance."
    },
    {
        id: "dr-harpreet-singh-gill",
        name: "Dr. Harpreet Singh Gill",
        credentials: "PhD in Marketing, University of Melbourne",
        subjects: ["Consumer Behaviour", "Digital Marketing", "Branding"],
        countries: ["Australia", "Singapore"],
        bio: "Australia-based NRI academic with 11 years of experience mentoring marketing dissertations."
    },
    {
        id: "dr-meera-iyer",
        name: "Dr. Meera Iyer",
        credentials: "PhD in Biotechnology, Indian Institute of Science, Bengaluru",
        subjects: ["Molecular Biology", "Bioinformatics", "Genetics"],
        countries: ["India", "UK", "USA"],
        bio: "Life sciences researcher with 9+ years of lab and thesis supervision experience."
    },
    {
        id: "dr-sanjay-kapoor",
        name: "Dr. Sanjay Kapoor",
        credentials: "PhD in Accounting, University of Manchester",
        subjects: ["Financial Reporting", "Auditing", "Corporate Governance"],
        countries: ["UK", "India", "Ireland"],
        bio: "Accounting scholar with 13 years of lecturing and dissertation supervision across UK and Indian institutions."
    },
    {
        id: "dr-lakshmi-venkataraman",
        name: "Dr. Lakshmi Venkataraman",
        credentials: "PhD in Public Health, Johns Hopkins University",
        subjects: ["Epidemiology", "Biostatistics", "Health Policy"],
        countries: ["USA", "Canada"],
        bio: "US-based NRI researcher with 10 years of experience guiding health research projects and statistical analysis."
    },
    {
        id: "dr-aditya-joshi",
        name: "Dr. Aditya Joshi",
        credentials: "PhD in Civil Engineering, IIT Madras",
        subjects: ["Structural Engineering", "Construction Management", "Sustainability"],
        countries: ["India", "Singapore", "Germany"],
        bio: "Civil engineering academic with 9 years of experience supervising final-year projects and master’s theses."
    },
    {
        id: "dr-farah-siddiqui",
        name: "Dr. Farah Siddiqui",
        credentials: "PhD in Law, National Law School of India University",
        subjects: ["Corporate Law", "International Trade Law", "Legal Research"],
        countries: ["India", "UK", "Singapore"],
        bio: "Legal scholar with 8+ years of experience in research writing and dissertation mentoring."
    },
    {
        id: "dr-nikhil-bhatia",
        name: "Dr. Nikhil Bhatia",
        credentials: "PhD in Information Systems, National University of Singapore",
        subjects: ["Cybersecurity", "Business Analytics", "Cloud Computing"],
        countries: ["Singapore", "Australia"],
        bio: "Singapore-based NRI academic with 7 years of experience supervising IS and analytics dissertations."
    },
    {
        id: "dr-pooja-menon",
        name: "Dr. Pooja Menon",
        credentials: "PhD in Education, University of Oxford",
        subjects: ["Curriculum Studies", "Educational Research", "Qualitative Methods"],
        countries: ["UK", "Ireland", "Australia"],
        bio: "Education researcher with 10+ years of experience mentoring postgraduate research."
    },
    {
        id: "dr-rajesh-pillai",
        name: "Dr. Rajesh Pillai",
        credentials: "PhD in Operations Management, Indian School of Business",
        subjects: ["Supply Chain", "Operations Research", "Lean Six Sigma"],
        countries: ["India", "Singapore", "UK"],
        bio: "Operations academic with 12 years of consulting and thesis supervision experience."
    },
    {
        id: "dr-tanvi-agarwal",
        name: "Dr. Tanvi Agarwal",
        credentials: "PhD in Chemistry, University of Edinburgh",
        subjects: ["Organic Chemistry", "Pharmaceutical Sciences", "Spectroscopy"],
        countries: ["UK", "Germany", "Canada"],
        bio: "Chemistry researcher with 6+ years of supervising lab-based dissertations."
    },
    {
        id: "dr-imran-qureshi",
        name: "Dr. Imran Qureshi",
        credentials: "PhD in Data Science, University of British Columbia",
        subjects: ["Statistics", "Python", "Predictive Modelling"],
        countries: ["Canada", "USA"],
        bio: "Canada-based NRI data scientist with 8 years of experience guiding quantitative research projects."
    },
    {
        id: "dr-divya-bhargava",
        name: "Dr. Divya Bhargava",
        credentials: "PhD in Sociology, Jawaharlal Nehru University",
        subjects: ["Social Research", "Gender Studies", "Qualitative Analysis"],
        countries: ["India", "UK", "Canada"],
        bio: "Sociologist with 11 years of experience in fieldwork design, thematic analysis, and thesis support."
    },
    {
        id: "dr-karthik-ramaswamy",
        name: "Dr. Karthik Ramaswamy",
        credentials: "PhD in Fintech and Banking, Imperial College London",
        subjects: ["Digital Banking", "Risk Management", "Financial Modelling"],
        countries: ["UK", "Singapore", "USA"],
        bio: "UK-based NRI academic with 9+ years of experience supervising dissertations on banking and financial technology."
    }
];

const Experts = () => {
    const expertsSchema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Academic Wizard Verified Faculty Specialists",
        "description": "Directory of verified PhD editors, dissertation advisors, and academic subject specialists at Academic Wizard.",
        "itemListElement": EXPERTS.map((exp, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
                "@type": "Person",
                "name": exp.name,
                "jobTitle": "Academic Advisor & Dissertation Supervisor",
                "honorificPrefix": "Dr.",
                "description": exp.bio,
                "knowsAbout": exp.subjects,
                "hasCredential": {
                    "@type": "EducationalOccupationalCredential",
                    "credentialCategory": "degree",
                    "name": exp.credentials
                },
                "worksFor": {
                    "@type": "Organization",
                    "name": "Academic Wizard",
                    "url": "https://academicwizard.online/"
                }
            }
        }))
    };

    return (
        <div className="page-experts min-h-screen bg-bg-primary text-text-primary">
            <Helmet>
                <title>Our Academic Faculty & Experts | Academic Wizard</title>
                <meta name="description" content="Meet Academic Wizard's verified academic subject specialists, editors, and dissertation supervisors across sciences, law, humanities, and business." />
                <link rel="canonical" href="https://academicwizard.online/experts/" />
                <meta property="og:title" content="Our Academic Faculty & Experts | Academic Wizard" />
                <meta property="og:description" content="Academic subject specialists and dissertation supervisors providing research mentorship across UK, USA, Australia, and worldwide." />
                <meta property="og:url" content="https://academicwizard.online/experts/" />
                <meta property="og:type" content="website" />
                <meta property="og:image" content="https://academicwizard.online/academic-wizard-favicon.webp" />
                <script type="application/ld+json">
                    {JSON.stringify(expertsSchema)}
                </script>
            </Helmet>

            <PageHeader
                title="Academic Faculty & Subject Specialists"
                subtitle="Every draft, dissertation proposal, and literature review is overseen by verified PhD and Master's graduates from world-leading universities."
                breadcrumbs={[
                    { name: 'Home', url: '/' },
                    { name: 'About', url: '/about/' },
                    { name: 'Faculty & Experts', url: '/experts/' }
                ]}
                ctaText="💬 Match With an Expert on WhatsApp"
                ctaLink="https://wa.me/919509893638?text=Hello%20Academic%20Wizard!%20I'd%20like%20to%20consult%20with%20a%20subject%20specialist%20for%20my%20university%20coursework."
            />

            {/* Quality Standard Banner */}
            <section className="py-12 bg-bg-secondary border-y border-glass-border">
                <div className="container px-6 max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-6 text-center">
                        <div className="glass-card p-6 rounded-2xl flex flex-col items-center">
                            <GraduationCap size={36} className="text-accent-gold mb-3" style={{ color: 'var(--accent-gold)' }} />
                            <h3 className="text-lg font-bold font-heading text-white mb-2">100% Verified Degrees</h3>
                            <p className="text-xs text-text-secondary leading-relaxed">
                                All mentors hold verified terminal degrees (PhD, MSc, MA) from Russell Group, Ivy League, Group of Eight, and top global institutions.
                            </p>
                        </div>
                        <div className="glass-card p-6 rounded-2xl flex flex-col items-center">
                            <Award size={36} className="text-accent-gold mb-3" style={{ color: 'var(--accent-gold)' }} />
                            <h3 className="text-lg font-bold font-heading text-white mb-2">Discipline Specialization</h3>
                            <p className="text-xs text-text-secondary leading-relaxed">
                                No generalist writers. A nursing case study is handled by a nursing PhD; a legal brief is audited by an OSCOLA law specialist.
                            </p>
                        </div>
                        <div className="glass-card p-6 rounded-2xl flex flex-col items-center">
                            <CheckCircle2 size={36} className="text-accent-gold mb-3" style={{ color: 'var(--accent-gold)' }} />
                            <h3 className="text-lg font-bold font-heading text-white mb-2">Zero AI & Plagiarism</h3>
                            <p className="text-xs text-text-secondary leading-relaxed">
                                Every piece of writing is handcrafted from primary scholarly literature, complete with a verified Turnitin authenticity report.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Experts Grid */}
            <section className="py-20 bg-bg-primary">
                <div className="container px-6 max-w-7xl mx-auto">
                    <div className="text-center mb-16 space-y-3">
                        <span className="text-xs uppercase tracking-[3px] font-heading text-accent-gold font-bold block" style={{ color: 'var(--accent-gold)' }}>
                            Verified Academic Mentors
                        </span>
                        <h2 className="text-3xl md:text-5xl font-bold font-heading text-white">
                            Meet Our Subject Matter Faculty
                        </h2>
                        <p className="text-sm md:text-base text-text-secondary max-w-2xl mx-auto leading-relaxed">
                            Connect directly with the specialists behind our 1st-class essays, empirical dissertations, and systematic literature reviews.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {EXPERTS.map((exp) => (
                            <div 
                                key={exp.id} 
                                id={exp.id}
                                className="glass-card p-8 rounded-2xl border border-glass-border hover:border-accent-gold/40 transition-all flex flex-col justify-between group shadow-xl"
                            >
                                <div className="space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div 
                                            className="w-14 h-14 rounded-2xl flex items-center justify-center font-heading font-black text-black text-lg shrink-0 shadow-lg"
                                            style={{ background: 'linear-gradient(135deg, var(--accent-gold), var(--accent-gold-light, #f3e5ab))' }}
                                        >
                                            <GraduationCap size={24} className="text-black" />
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="text-xl font-bold font-heading text-white group-hover:text-accent-gold transition-colors truncate">
                                                {exp.name}
                                            </h3>
                                            <p className="text-xs text-accent-gold font-medium mt-0.5 line-clamp-2" style={{ color: 'var(--accent-gold)' }}>
                                                {exp.credentials}
                                            </p>
                                        </div>
                                    </div>

                                    <p className="text-xs text-text-secondary leading-relaxed pt-2 border-t border-white/5">
                                        {exp.bio}
                                    </p>

                                    <div className="space-y-2 pt-2">
                                        <div className="flex flex-wrap gap-1.5">
                                            {exp.subjects.map(s => (
                                                <span key={s} className="text-[10px] bg-white/5 border border-white/10 text-white/70 px-2 py-0.5 rounded-md font-mono">
                                                    {s}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[11px] text-white/50">
                                            <Globe size={12} className="text-accent-gold" />
                                            <span>Regions: {exp.countries.join(', ')}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 mt-6 border-t border-white/10">
                                    <a
                                        href={`https://wa.me/919509893638?text=${encodeURIComponent(`Hello Academic Wizard! I would like to request academic assistance from ${exp.name} (${exp.credentials}).`)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-primary w-full inline-flex items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-wider"
                                    >
                                        <MessageCircle size={15} />
                                        <span>Consult {exp.name}</span>
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Experts;
