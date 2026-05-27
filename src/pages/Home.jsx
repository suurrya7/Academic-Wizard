import React from 'react';
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

    return (
        <div className="page-home overflow-hidden">
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
