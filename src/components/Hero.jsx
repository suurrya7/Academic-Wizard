import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import Academic3DScene from './Academic3D';
import Button from './Button';

const Hero = () => {
    const whatsappUrl = "https://wa.me/919509893638?text=Hello%20Academic%20Wizard,%20I%20need%20academic%20assistance";

    return (
        <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
            <div className="container grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                >
                    <motion.span
                        className="text-accent-gold font-heading text-xs tracking-[5px] uppercase mb-6 block"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        style={{ color: 'var(--accent-gold)' }}
                    >
                        Elite Academic Support
                    </motion.span>
                    <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-8">
                        <span className="premium-gradient-text" style={{ display: 'block' }}>Academic Wizard</span>
                        Assistance & Research <br />
                        <span className="text-accent-gold" style={{ color: 'var(--accent-gold)' }}>Support</span>
                    </h1>
                    <p className="text-text-secondary text-lg mb-10 max-w-xl leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        Expert academic assistance for essays, assignments, dissertations, theses, research papers, and academic editing. Trusted by university students across the UK, Australia, USA, Ireland, and India.
                    </p>
                    <div className="flex flex-wrap gap-6">
                        <Button onClick={() => window.open(whatsappUrl, '_blank')}>
                            Get Help on WhatsApp
                        </Button>
                        <Button type="outline" onClick={() => document.getElementById('services').scrollIntoView({ behavior: 'smooth' })}>
                            Explore Services
                        </Button>
                    </div>

                    <div className="mt-16 flex items-center gap-8">
                        <div className="flex -space-x-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="w-12 h-12 rounded-full border-2 border-bg-primary bg-accent-gold flex items-center justify-center text-black font-bold text-xs" style={{ backgroundColor: 'var(--accent-gold)', borderColor: 'var(--bg-primary)' }}>
                                    {i === 3 ? '5k+' : <GraduationCap size={16} />}
                                </div>
                            ))}
                        </div>
                        <p className="text-xs uppercase tracking-widest text-text-secondary" style={{ color: 'var(--text-secondary)' }}>
                            Trusted by <span className="text-white">5000+ Students</span> Worldwide
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    className="h-[600px] lg:h-[700px] relative rounded-3xl overflow-hidden bg-bg-secondary/30"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, delay: 0.5 }}
                >
                    <div className="absolute inset-0 bg-accent-gold/5 rounded-full blur-[120px] -z-10" style={{ backgroundColor: 'rgba(212, 175, 55, 0.05)' }} />
                    <React.Suspense fallback={<div className="w-full h-full flex items-center justify-center text-accent-gold-light font-heading animate-pulse">Loading Wizardry...</div>}>
                        <Academic3DScene />
                    </React.Suspense>
                </motion.div>
            </div>

            {/* Flag decoration */}
            <div className="absolute bottom-10 left-0 w-full flex justify-center gap-10 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
                <span className="text-xs font-heading tracking-widest uppercase">United Kingdom</span>
                <span className="text-xs font-heading tracking-widest uppercase">Australia</span>
                <span className="text-xs font-heading tracking-widest uppercase">United States</span>
                <span className="text-xs font-heading tracking-widest uppercase">Ireland</span>
                <span className="text-xs font-heading tracking-widest uppercase">India</span>
            </div>
        </section>
    );
};

export default Hero;
