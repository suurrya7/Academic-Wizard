import React from 'react';
import { Helmet } from 'react-helmet-async';
import PageHeader from '../components/PageHeader';
import { GraduationCap, Award, CheckCircle2, MessageCircle, BookOpen, Globe } from 'lucide-react';

const EXPERTS = [
    {
        id: "dr-arthur-pendleton",
        name: "Dr. Arthur Pendleton",
        credentials: "PhD in Physics, Massachusetts Institute of Technology (MIT)",
        subjects: ["Physics", "Mathematics", "Engineering", "Data Science"],
        countries: ["USA", "Canada"],
        bio: "Dr. Arthur Pendleton is a STEM editor and technical writing consultant helping US and Canadian university students with complex engineering reports, quantitative modeling, and methodology defense."
    },
    {
        id: "dr-jessica-carter",
        name: "Dr. Jessica Carter",
        credentials: "PhD in Chemistry, Columbia University",
        subjects: ["Chemistry", "Biochemistry", "STEM Literature Reviews"],
        countries: ["USA", "UK"],
        bio: "Dr. Jessica Carter is a chemical researcher and scientific proofreader supporting postgraduate students in the USA and UK with complex thesis structuring, peer-reviewed citations, and lab dissertations."
    },
    {
        id: "prof-james-henderson",
        name: "Prof. James Henderson",
        credentials: "PhD in English Literature, Harvard University",
        subjects: ["English Literature", "Critical Theory", "Comparative Literature", "MLA/Chicago"],
        countries: ["USA", "Canada"],
        bio: "Prof. James Henderson is a published academic with over 15 years of experience mentoring students in literary analysis, argumentative essay construction, and dissertation proposals at leading North American institutions."
    },
    {
        id: "dr-robert-oconnor",
        name: "Dr. Robert O'Connor",
        credentials: "PhD in History, University of Cambridge",
        subjects: ["History", "Historiography", "Law", "OSCOLA & Harvard"],
        countries: ["UK", "Ireland"],
        bio: "Dr. Robert O'Connor is a humanities editor and dissertation advisor, expert in OSCOLA, Harvard, and Chicago formatting rules across UK and Irish universities with focus on archival analysis."
    },
    {
        id: "dr-sarah-evans",
        name: "Dr. Sarah Evans",
        credentials: "PhD in Education, University of Oxford",
        subjects: ["Education", "Pedagogy", "Reflective Practice", "PGCE Assessments"],
        countries: ["UK", "Ireland"],
        bio: "Dr. Sarah Evans is an education specialist focusing on pedagogical frameworks, Bloom's Taxonomy, Kolb's reflective cycles, and academic integrity training for undergraduate and master's students."
    },
    {
        id: "dr-chloe-desjardins",
        name: "Dr. Chloe Desjardins",
        credentials: "PhD in Nursing, McGill University",
        subjects: ["Nursing", "Healthcare Management", "Evidence-Based Practice", "PRISMA"],
        countries: ["Canada", "USA"],
        bio: "Dr. Chloe Desjardins specializes in health sciences and nursing curricula, helping Canadian and US nursing students format complex clinical case studies, Gibbs reflective logs, and systematic literature reviews."
    },
    {
        id: "dr-david-johnston",
        name: "Dr. David Johnston",
        credentials: "PhD in Environmental Science, University of British Columbia",
        subjects: ["Environmental Science", "Geography", "Quantitative Research", "SPSS/R"],
        countries: ["Canada", "Australia"],
        bio: "Dr. David Johnston specialises in environmental research design, geospatial analysis, and empirical methodology, supervising postgraduate students across Australian and Canadian universities."
    },
    {
        id: "dr-emily-chen",
        name: "Dr. Emily Chen",
        credentials: "PhD in Psychology, University of Toronto",
        subjects: ["Psychology", "Cognitive Science", "APA 7th", "Statistical Analysis"],
        countries: ["Canada", "USA"],
        bio: "Dr. Emily Chen is a clinical psychologist and research methodologist who guides students through APA 7th style conventions, quantitative data analysis, and qualitative thematic coding."
    },
    {
        id: "dr-marcus-vance",
        name: "Dr. Marcus Vance",
        credentials: "PhD in Political Science, Yale University",
        subjects: ["Political Science", "International Relations", "Public Policy", "Law"],
        countries: ["USA", "UK"],
        bio: "Dr. Marcus Vance provides expert guidance on thesis statement construction, policy memos, IRAC legal arguments, and political theory for university scholars worldwide."
    },
    {
        id: "dr-sarah-lim",
        name: "Dr. Sarah Lim",
        credentials: "PhD in Business Administration, Nanyang Technological University (NTU)",
        subjects: ["MBA", "Strategic Management", "Marketing", "Corporate Finance"],
        countries: ["Singapore", "Australia"],
        bio: "Dr. Sarah Lim is a business strategist helping university students in Singapore, Australia, and the UK with Harvard case studies, Porter's Five Forces analysis, and executive MBA dissertations."
    },
    {
        id: "dr-cheryl-tan",
        name: "Dr. Cheryl Tan",
        credentials: "PhD in Linguistics, National University of Singapore (NUS)",
        subjects: ["Linguistics", "ESL Academic Writing", "Proofreading & Editing"],
        countries: ["Singapore", "Australia"],
        bio: "Dr. Cheryl Tan is an ESL specialist and academic editor, helping international students polish sentence mechanics, eliminate robotic tone, and meet strict university grading rubrics."
    },
    {
        id: "dr-amit-sharma",
        name: "Dr. Amit Sharma",
        credentials: "PhD in Computer Science, IIT Delhi",
        subjects: ["Computer Science", "Algorithms", "Software Engineering", "AI & ML"],
        countries: ["India", "Singapore", "UK"],
        bio: "Dr. Amit Sharma is a computer science methodologist guiding students through algorithms, software architecture documentation, IEEE conference styling, and empirical code evaluations."
    },
    {
        id: "dr-fiona-gallagher",
        name: "Dr. Fiona Gallagher",
        credentials: "PhD in Sociology, Trinity College Dublin",
        subjects: ["Sociology", "Social Policy", "Qualitative Methods", "NVivo Coding"],
        countries: ["Ireland", "UK"],
        bio: "Dr. Fiona Gallagher is a social scientist providing thesis coaching and essay structuring with deep expertise in Irish NFQ and British QAA university grading frameworks."
    },
    {
        id: "dr-hans-mueller",
        name: "Dr. Hans Müller",
        credentials: "PhD in Economics, LMU Munich",
        subjects: ["Economics", "Econometrics", "Finance", "ECTS Standards"],
        countries: ["Germany", "Ireland"],
        bio: "Dr. Hans Müller brings deep expertise in European academic standards, quantitative econometrics, and cross-cultural scholarly communication across German and European universities."
    },
    {
        id: "dr-alistair-macleod",
        name: "Dr. Alistair Macleod",
        credentials: "PhD in Philosophy, University of Edinburgh",
        subjects: ["Philosophy", "Ethics", "Logic & Epistemology", "Critical Argumentation"],
        countries: ["UK", "Australia"],
        bio: "Dr. Alistair Macleod is a logical analysis coach who helps students structure critical literature reviews, philosophical debate papers, and ethical frameworks in postgraduate dissertations."
    },
    {
        id: "dr-eleanor-wright",
        name: "Dr. Eleanor Wright",
        credentials: "PhD in English, King's College London",
        subjects: ["English", "Academic Register", "Manuscript Editing", "Harvard Style"],
        countries: ["UK", "Canada"],
        bio: "Dr. Eleanor Wright is a professional academic editor with extensive expertise in structural proofreading, tone harmonization, and citation auditing across Russell Group universities."
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
                "jobTitle": "Academic Advisor & Editor",
                "honorificPrefix": "Dr.",
                "description": exp.bio,
                "knowsAbout": exp.subjects,
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
                <meta name="description" content="Meet Academic Wizard's verified PhD specialists, editors, and dissertation supervisors from Oxford, Cambridge, MIT, Harvard, Columbia, and NUS." />
                <link rel="canonical" href="https://academicwizard.online/experts/" />
                <meta property="og:title" content="Our Academic Faculty & Experts | Academic Wizard" />
                <meta property="og:description" content="Verified PhD subject specialists and dissertation supervisors providing 100% Turnitin-safe academic mentorship across UK, USA, Australia, and worldwide." />
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
                                            {exp.name.split(' ').filter(n => !n.includes('.')).map(n => n[0]).join('')}
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
                                        <span>Consult {exp.name.split(' ')[1]}</span>
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
