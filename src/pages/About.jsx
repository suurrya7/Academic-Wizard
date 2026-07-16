import React from 'react';
import { Helmet } from 'react-helmet-async';
import PageHeader from '../components/PageHeader';
import { Target, Users, Globe, Shield, BookOpen, Award, CheckCircle } from 'lucide-react';

const About = () => {
    const aboutSchema = {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "name": "About Academic Wizard",
        "url": "https://academicwizard.online/about",
        "description": "Learn about Academic Wizard, our mission, vision, and the core values that drive our expert academic assistance services.",
        "publisher": {
            "@type": "Organization",
            "name": "Academic Wizard",
            "logo": "https://academicwizard.online/academic-wizard-favicon.webp"
        }
    };

    return (
        <div className="page-about">
            <Helmet>
                <title>About Us | Academic Wizard - Professional Research Experts</title>
                <meta name="description" content="Founded in 2018, Academic Wizard is a leading educational consultancy. Learn about our strict 3-stage QA process and our team of 150+ PhD and Master's level academic experts." />
                <link rel="canonical" href="https://academicwizard.online/about" />
                <meta property="og:title" content="About Us | Academic Wizard" />
                <meta property="og:description" content="Founded in 2018, Academic Wizard is a leading educational consultancy. Learn about our strict 3-stage QA process and our team of 150+ PhD and Master's level academic experts." />
                <meta property="og:url" content="https://academicwizard.online/about" />
                <script type="application/ld+json">
                    {JSON.stringify(aboutSchema)}
                </script>
            </Helmet>

            <PageHeader
                title="About Academic Wizard"
                subtitle="Empowering students worldwide with expert academic guidance, ethical research support, and unwavering dedication to educational success since 2018."
                breadcrumbs={[
                    { name: 'Home', url: '/' },
                    { name: 'About', url: '/about' }
                ]}
            />

            <section className="py-20 container">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div>
                        <h2 className="text-4xl font-bold mb-8 font-heading text-white">Our <span className="text-accent-gold" style={{ color: 'var(--accent-gold)' }}>Mission & History</span></h2>
                        <div className="text-text-secondary text-lg leading-relaxed mb-8 space-y-4" style={{ color: 'var(--text-secondary)' }}>
                            <p>
                                Founded in 2018 by a consortium of former university lecturers and peer-reviewers, Academic Wizard was born out of a stark realization: the modern university system is increasingly overcrowded, leaving students with unprecedented pressure and diminishing access to one-on-one pedagogical support.
                            </p>
                            <p>
                                Our mission is to bridge this gap. We provide an international academic assistance platform dedicated to supporting university students with high-level research guidance, meticulous editing services, and structural academic writing support. We believe that every student, regardless of their background or current academic standing, deserves access to world-class academic mentorship to reach their full potential.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-12">
                            {[
                                { icon: Target, title: 'Precision', desc: 'Accurate research and data-driven insights.' },
                                { icon: Globe, title: 'Global', desc: 'Supporting students in UK, USA, AU, IE, & IN.' },
                                { icon: Users, title: 'Expertise', desc: '150+ PhD and Master level specialists.' },
                                { icon: Shield, title: 'Integrity', desc: '100% confidential and original work.' },
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="text-accent-gold" style={{ color: 'var(--accent-gold)' }}>
                                        <item.icon size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-heading text-xs tracking-widest uppercase mb-2 text-white">{item.title}</h4>
                                        <p className="text-text-secondary text-xs" style={{ color: 'var(--text-secondary)' }}>{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <div className="glass-card p-4 aspect-[4/5] relative z-10">
                            <div className="w-full h-full bg-accent-gold/10 rounded-xl flex items-center justify-center border border-accent-gold/20" style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)', borderColor: 'rgba(212, 175, 55, 0.2)' }}>
                                <span className="text-accent-gold font-heading text-xl tracking-[10px]" style={{ color: 'var(--accent-gold)' }}>ACADEMIC WIZARD</span>
                            </div>
                        </div>
                        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-accent-gold/10 blur-[100px] -z-10" style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)' }} />
                    </div>
                </div>
            </section>

            <section className="py-20 bg-bg-secondary border-t border-white/5" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div className="container">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold font-heading mb-8 text-white text-center">Our Commitment to <span className="text-accent-gold" style={{ color: 'var(--accent-gold)' }}>Quality (E-E-A-T)</span></h2>
                        <p className="text-text-secondary text-lg leading-relaxed mb-12 text-center" style={{ color: 'var(--text-secondary)' }}>
                            At Academic Wizard, we operate on the principles of Experience, Expertise, Authoritativeness, and Trustworthiness. We do not operate a freelance marketplace. Instead, we maintain a highly curated, in-house network of academic professionals.
                        </p>
                        
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="glass-card p-8 border-accent-gold/10">
                                <Award className="text-accent-gold mb-6" size={32} style={{ color: 'var(--accent-gold)' }} />
                                <h3 className="text-xl font-bold text-white mb-4">Rigorous Hiring Process</h3>
                                <p className="text-text-secondary leading-relaxed text-sm">
                                    Less than 3% of applicants pass our vetting process. Every expert must hold a minimum of a Master's degree (with over 60% holding a PhD) from a recognized university. Candidates undergo rigorous subject-matter testing and academic formatting assessments before joining our team.
                                </p>
                            </div>
                            <div className="glass-card p-8 border-accent-gold/10">
                                <CheckCircle className="text-accent-gold mb-6" size={32} style={{ color: 'var(--accent-gold)' }} />
                                <h3 className="text-xl font-bold text-white mb-4">3-Stage QA Process</h3>
                                <p className="text-text-secondary leading-relaxed text-sm">
                                    We never deliver a first draft. Every piece of work undergoes a strict 3-stage Quality Assurance process: primary drafting by the subject expert, structural review by a senior editor, and a final technical scan using proprietary anti-plagiarism and AI-detection tools.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-32">
                <div className="container text-center">
                    <h2 className="text-3xl font-bold font-heading mb-12 text-white">Our Core <span className="text-accent-gold" style={{ color: 'var(--accent-gold)' }}>Philosophy</span></h2>
                    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div>
                            <h3 className="text-accent-gold text-4xl font-bold mb-4 font-heading" style={{ color: 'var(--accent-gold)' }}>01</h3>
                            <h4 className="font-heading text-sm mb-4 text-white">Quality First</h4>
                            <p className="text-text-secondary text-sm" style={{ color: 'var(--text-secondary)' }}>We never compromise on the quality of research and academic standards.</p>
                        </div>
                        <div>
                            <h3 className="text-accent-gold text-4xl font-bold mb-4 font-heading" style={{ color: 'var(--accent-gold)' }}>02</h3>
                            <h4 className="font-heading text-sm mb-4 text-white">Student Trust</h4>
                            <p className="text-text-secondary text-sm" style={{ color: 'var(--text-secondary)' }}>Building long-term relationships through reliability and absolute confidentiality.</p>
                        </div>
                        <div>
                            <h3 className="text-accent-gold text-4xl font-bold mb-4 font-heading" style={{ color: 'var(--accent-gold)' }}>03</h3>
                            <h4 className="font-heading text-sm mb-4 text-white">Ethics</h4>
                            <p className="text-text-secondary text-sm" style={{ color: 'var(--text-secondary)' }}>Promoting academic integrity through targeted pedagogical guidance and support.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
