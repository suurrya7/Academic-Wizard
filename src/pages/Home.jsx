import React from 'react';
import { Helmet } from 'react-helmet-async';
import Hero from '../components/Hero';
import TrustStats from '../components/TrustStats';
import ServiceOverview from '../components/ServiceOverview';
import SubjectsGrid from '../components/SubjectsGrid';
import FeaturesGrid from '../components/FeaturesGrid';
import Testimonials from '../components/Testimonials';
import Button from '../components/Button';
import { motion } from 'framer-motion';

const Home = () => {
    const whatsappUrl = "https://wa.me/919509893638?text=Hello%20Academic%20Wizard,%20I%20need%20academic%20assistance";

    const orgSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Academic Wizard",
        "url": "https://academicwizard.online",
        "logo": "https://academicwizard.online/academic-wizard-favicon.webp",
        "description": "Expert academic assistance for essays, assignments, dissertations, theses, research papers, and academic editing.",
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+91-95098-93638",
            "contactType": "customer support"
        }
    };

    return (
        <div className="page-home overflow-hidden">
            <Helmet>
                <title>Academic Wizard | Expert Academic Assistance & Research Support</title>
                <meta name="description" content="Top-rated academic writing, essay help, and dissertation support tailored for university students in the UK, USA, Australia, and worldwide." />
                <link rel="canonical" href="https://academicwizard.online/" />
                <meta property="og:title" content="Academic Wizard | Expert Academic Assistance" />
                <meta property="og:description" content="Top-rated academic writing, essay help, and dissertation support tailored for university students." />
                <meta property="og:url" content="https://academicwizard.online/" />
                <script type="application/ld+json">
                    {JSON.stringify(orgSchema)}
                </script>
            </Helmet>

            <Hero />
            <TrustStats />

            {/* SEO Intro Section */}
            <section className="py-20 text-center container">
                <div className="max-w-4xl mx-auto glass-card p-12 border-accent-gold/20" style={{ borderColor: 'rgba(212, 175, 55, 0.2)' }}>
                    <p className="text-text-secondary leading-loose text-lg" style={{ color: 'var(--text-secondary)' }}>
                        Academic Wizard offers professional academic assistance for students who need help with
                        <span className="text-white"> assignments, essays, dissertations, and research papers</span>.
                        Our academic experts provide research guidance, editing services, and academic writing support
                        to help students improve the quality of their academic work.
                    </p>
                </div>
            </section>

            <ServiceOverview />

            {/* Free Writing Tools Teaser */}
            <section className="py-20 text-white relative">
                <div className="container space-y-12">
                    <div className="text-center max-w-3xl mx-auto space-y-4">
                        <h2 className="text-3xl md:text-5xl font-bold font-heading">
                            Free <span className="text-accent-gold" style={{ color: 'var(--accent-gold)' }}>Student Tools</span> Suite
                        </h2>
                        <p className="text-text-secondary text-sm md:text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                            Instantly boost your academic grades with our free, browser-based referencing, editing, and authenticity checkers.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="glass-card p-6 border-white/5 hover:border-accent-gold/45 rounded-xl flex flex-col justify-between space-y-4 transition-all duration-300">
                            <div>
                                <h3 className="text-lg font-bold text-white mb-2">Citation Maker</h3>
                                <p className="text-xs text-text-secondary leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                    Generate referencing citations in APA 7th, MLA 9th, Harvard, IEEE, and Chicago styles instantly.
                                </p>
                            </div>
                            <Button type="outline" onClick={() => window.location.href='/tools/citation-generator/'} className="w-full py-2 text-[10px]">
                                Launch Builder
                            </Button>
                        </div>
                        <div className="glass-card p-6 border-white/5 hover:border-accent-gold/45 rounded-xl flex flex-col justify-between space-y-4 transition-all duration-300">
                            <div>
                                <h3 className="text-lg font-bold text-white mb-2">Grammar Checker</h3>
                                <p className="text-xs text-text-secondary leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                    Proofread your essays, edit spelling slips, and improve writing styles in real-time.
                                </p>
                            </div>
                            <Button type="outline" onClick={() => window.location.href='/tools/grammar-checker/'} className="w-full py-2 text-[10px]">
                                Launch Editor
                            </Button>
                        </div>
                        <div className="glass-card p-6 border-white/5 hover:border-accent-gold/45 rounded-xl flex flex-col justify-between space-y-4 transition-all duration-300">
                            <div>
                                <h3 className="text-lg font-bold text-white mb-2">AI Detector</h3>
                                <p className="text-xs text-text-secondary leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                    Scan drafts for perplexity metrics, sentence uniformity, and AI-typical buzzwords.
                                </p>
                            </div>
                            <Button type="outline" onClick={() => window.location.href='/tools/ai-detector/'} className="w-full py-2 text-[10px]">
                                Scan Draft
                            </Button>
                        </div>
                        <div className="glass-card p-6 border-white/5 hover:border-accent-gold/45 rounded-xl flex flex-col justify-between space-y-4 transition-all duration-300">
                            <div>
                                <h3 className="text-lg font-bold text-white mb-2">AI Humanizer</h3>
                                <p className="text-xs text-text-secondary leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                    Transform robotic AI text into natural academic phrasing to bypass detectors like Turnitin.
                                </p>
                            </div>
                            <Button type="outline" onClick={() => window.location.href='/tools/ai-humanizer/'} className="w-full py-2 text-[10px]">
                                Humanize Text
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            <SubjectsGrid />
            <FeaturesGrid />
            <Testimonials />

            {/* Final CTA */}
            <section className="py-32 relative overflow-hidden">
                <div className="container text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-3xl mx-auto"
                    >
                        <h2 className="text-4xl md:text-6xl font-bold mb-10 text-white">Ready for <span className="text-accent-gold" style={{ color: 'var(--accent-gold)' }}>Academic Excellence?</span></h2>
                        <p className="text-text-secondary text-lg mb-12" style={{ color: 'var(--text-secondary)' }}>
                            Join thousands of students who have achieved academic success with our expert guidance. Get a custom quote on WhatsApp today.
                        </p>
                        <Button onClick={() => window.open(whatsappUrl, '_blank')} className="px-16 py-6 text-sm">
                            Chat With Academic Expert
                        </Button>
                    </motion.div>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-accent-gold/5 blur-[120px] -z-10 rounded-full" style={{ backgroundColor: 'rgba(212, 175, 55, 0.05)' }} />
            </section>
        </div>
    );
};

export default Home;
