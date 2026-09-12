import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import TrustStats from '../components/TrustStats';
import ServiceOverview from '../components/ServiceOverview';
import SubjectsGrid from '../components/SubjectsGrid';
import FeaturesGrid from '../components/FeaturesGrid';
import Testimonials from '../components/Testimonials';
import PricingCalculator from '../components/PricingCalculator';
import Button from '../components/Button';
import { motion } from 'framer-motion';
import reviewsData from '../data/reviews.json';

const Home = () => {
    const whatsappUrl = "https://wa.me/919509893638?text=Hello%20Academic%20Wizard,%20I%20need%20academic%20assistance";

    const orgSchema = {
        "@context": "https://schema.org",
        "@type": "EducationalOrganization",
        "name": "Academic Wizard",
        "url": "https://academicwizard.online/",
        "logo": "https://academicwizard.online/academic-wizard-favicon.webp",
        "description": "Expert academic assistance for essays, assignments, dissertations, theses, research papers, and academic editing.",
        "sameAs": [
            "https://twitter.com/academicwizard",
            "https://youtube.com/@academicwizard",
            "https://www.facebook.com/academics.wizard",
            "https://www.instagram.com/_academic.wizard_",
            "https://www.linkedin.com/company/academic-wizard",
            "https://share.google/gFYneo9HEwNeToTvN",
            "https://www.google.com/search?kgmid=/g/11z93djzl9&q=Academic+Wizard",
            "https://www.trustpilot.com/review/academicwizard.online"
        ],
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": reviewsData.summary.overallRating.toFixed(1),
            "bestRating": "5",
            "worstRating": "1",
            "ratingCount": reviewsData.summary.totalReviews
        },
        "address": {
            "@type": "PostalAddress",
            "addressCountry": "UK"
        },
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+91-95098-93638",
            "contactType": "customer support"
        }
    };

    const homeFaqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "What services does Academic Wizard provide for university students?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Academic Wizard provides professional academic guidance, essay writing support, dissertation and thesis mentoring, literature reviews, research paper assistance, and academic proofreading tailored to university standards in the UK, USA, Australia, Canada, Singapore, and worldwide."
                }
            },
            {
                "@type": "Question",
                "name": "Are academic papers guaranteed to be 100% plagiarism-free and AI-safe?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. Every academic project undergoes rigorous originality verification and includes a complimentary Turnitin plagiarism and AI similarity scan report ensuring less than 5% similarity under a non-repository policy."
                }
            },
            {
                "@type": "Question",
                "name": "Can I get urgent 12-hour or 24-hour academic assistance?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, Academic Wizard offers express turnaround options starting from 12 hours for urgent coursework, essays, and revisions with 24/7 dedicated support via WhatsApp."
                }
            },
            {
                "@type": "Question",
                "name": "Which citation and academic referencing styles do your experts support?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Our Master's and PhD subject specialists support all standard university citation styles, including APA 7th, Harvard, OSCOLA (Law), MLA 9th, Chicago, IEEE, and Vancouver."
                }
            }
        ]
    };

    return (
        <div className="page-home overflow-hidden">
            <Helmet>
                <title>Academic Wizard | Expert Academic & Research Support</title>
                <meta name="description" content="Top-rated academic writing, essay help, and dissertation support tailored for university students in the UK, USA, Australia, and worldwide." />
                <link rel="canonical" href="https://academicwizard.online/" />
                <meta property="og:title" content="Academic Wizard | Expert Academic Assistance" />
                <meta property="og:description" content="Top-rated academic writing, essay help, and dissertation support tailored for university students." />
                <meta property="og:url" content="https://academicwizard.online/" />
                <script type="application/ld+json">
                    {JSON.stringify(orgSchema)}
                </script>
                <script type="application/ld+json">
                    {JSON.stringify(homeFaqSchema)}
                </script>
            </Helmet>

            <Hero />
            <TrustStats />

            {/* Instant Price Calculator Section */}
            <section id="quote-calculator" className="py-20 container px-4 sm:px-6">
                <PricingCalculator />
            </section>

            {/* SEO Intro Section */}
            <section className="py-12 text-center container">
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
                        <div className="glass-card p-6 border-white/5 hover:border-accent-gold/45 rounded-xl flex flex-col justify-between space-y-4 transition-all duration-300 group">
                            <div>
                                <div className="mb-4 h-32 w-full rounded-lg overflow-hidden relative bg-bg-secondary">
                                    <img src="/images/tools/citation-generator.webp" alt="Citation Maker" className="w-full h-full object-cover mix-blend-luminosity opacity-80 group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-accent-gold transition-colors">Citation Maker</h3>
                                <p className="text-xs text-text-secondary leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                    Generate referencing citations in APA 7th, MLA 9th, Harvard, IEEE, and Chicago styles instantly.
                                </p>
                            </div>
                            <Link to="/tools/citation-generator/" className="w-full mt-4 block">
                                <Button type="outline" className="w-full py-2 text-[10px]">
                                    Launch Builder
                                </Button>
                            </Link>
                        </div>
                        <div className="glass-card p-6 border-white/5 hover:border-accent-gold/45 rounded-xl flex flex-col justify-between space-y-4 transition-all duration-300 group">
                            <div>
                                <div className="mb-4 h-32 w-full rounded-lg overflow-hidden relative bg-bg-secondary">
                                    <img src="/images/tools/grammar-checker.webp" alt="Grammar Checker" className="w-full h-full object-cover mix-blend-luminosity opacity-80 group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-accent-gold transition-colors">Grammar Checker</h3>
                                <p className="text-xs text-text-secondary leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                    Proofread your essays, edit spelling slips, and improve writing styles in real-time.
                                </p>
                            </div>
                            <Link to="/tools/grammar-checker/" className="w-full mt-4 block">
                                <Button type="outline" className="w-full py-2 text-[10px]">
                                    Launch Editor
                                </Button>
                            </Link>
                        </div>
                        <div className="glass-card p-6 border-white/5 hover:border-accent-gold/45 rounded-xl flex flex-col justify-between space-y-4 transition-all duration-300 group">
                            <div>
                                <div className="mb-4 h-32 w-full rounded-lg overflow-hidden relative bg-bg-secondary">
                                    <img src="/images/tools/ai-detector.webp" alt="AI Detector" className="w-full h-full object-cover mix-blend-luminosity opacity-80 group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-accent-gold transition-colors">AI Detector</h3>
                                <p className="text-xs text-text-secondary leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                    Scan drafts for perplexity metrics, sentence uniformity, and AI-typical buzzwords.
                                </p>
                            </div>
                            <Link to="/tools/ai-detector/" className="w-full mt-4 block">
                                <Button type="outline" className="w-full py-2 text-[10px]">
                                    Scan Draft
                                </Button>
                            </Link>
                        </div>
                        <div className="glass-card p-6 border-white/5 hover:border-accent-gold/45 rounded-xl flex flex-col justify-between space-y-4 transition-all duration-300 group">
                            <div>
                                <div className="mb-4 h-32 w-full rounded-lg overflow-hidden relative bg-bg-secondary">
                                    <img src="/images/tools/ai-humanizer.webp" alt="AI Humanizer" className="w-full h-full object-cover mix-blend-luminosity opacity-80 group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-accent-gold transition-colors">AI Humanizer</h3>
                                <p className="text-xs text-text-secondary leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                    Transform robotic AI text into natural academic phrasing to bypass detectors like Turnitin.
                                </p>
                            </div>
                            <Link to="/tools/ai-humanizer/" className="w-full mt-4 block">
                                <Button type="outline" className="w-full py-2 text-[10px]">
                                    Humanize Text
                                </Button>
                            </Link>
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
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button onClick={() => window.open(whatsappUrl, '_blank')} className="px-16 py-6 text-sm w-full sm:w-auto">
                                Chat With Academic Expert
                            </Button>
                            <Link to="/blog/" className="w-full sm:w-auto">
                                <Button type="outline" className="px-16 py-6 text-sm w-full">
                                    Read Academic Resources
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-accent-gold/5 blur-[120px] -z-10 rounded-full" style={{ backgroundColor: 'rgba(212, 175, 55, 0.05)' }} />
            </section>
        </div>
    );
};

export default Home;
