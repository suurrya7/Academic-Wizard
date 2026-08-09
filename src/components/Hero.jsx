import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';

import Button from './Button';

const Hero = () => {
    const whatsappUrl = "https://wa.me/919509893638?text=Hello%20Academic%20Wizard,%20I%20need%20academic%20assistance";

    return (
        <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
            <div className="container grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                <div className="animate-fade-in-left">
                    <span
                        className="text-accent-gold font-heading text-xs tracking-[5px] uppercase mb-6 block animate-fade-in-up"
                        style={{ color: 'var(--accent-gold)' }}
                    >
                        Elite Academic Support
                    </span>
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
                </div>

                <div className="h-[600px] lg:h-[700px] relative w-full">
                    <div className="absolute inset-0 bg-accent-gold/10 rounded-full blur-[120px] -z-10" style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)' }} />
                    
                    {/* Main floating image */}
                    <motion.div 
                        className="absolute top-[5%] right-[5%] w-[65%] h-[55%] rounded-3xl overflow-hidden border border-white/10 shadow-2xl z-20"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: [0, -10, 0] }}
                        transition={{ opacity: { duration: 1 }, y: { duration: 6, repeat: Infinity, ease: "easeInOut" } }}
                    >
                        <img src="/images/students-working.webp" alt="Students studying" className="w-full h-full object-cover opacity-90 hover:opacity-100 mix-blend-luminosity hover:mix-blend-normal transition-all duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-tr from-bg-primary/80 to-transparent pointer-events-none" />
                    </motion.div>

                    {/* Left floating image */}
                    <motion.div 
                        className="absolute bottom-[10%] left-[5%] w-[55%] h-[45%] rounded-3xl overflow-hidden border border-white/10 shadow-2xl z-30"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: [0, 15, 0] }}
                        transition={{ opacity: { duration: 1, delay: 0.2 }, y: { duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 } }}
                    >
                        <img src="/images/library-books.webp" alt="Library" className="w-full h-full object-cover opacity-90 hover:opacity-100 mix-blend-luminosity hover:mix-blend-normal transition-all duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-tr from-bg-primary/80 to-transparent pointer-events-none" />
                    </motion.div>

                    {/* Bottom right floating image */}
                    <motion.div 
                        className="absolute bottom-[20%] right-[0%] w-[45%] h-[40%] rounded-3xl overflow-hidden border border-white/10 shadow-2xl z-10"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: [0, -15, 0] }}
                        transition={{ opacity: { duration: 1, delay: 0.4 }, y: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 } }}
                    >
                        <img src="/images/study-desk.webp" alt="Study desk" className="w-full h-full object-cover opacity-90 hover:opacity-100 mix-blend-luminosity hover:mix-blend-normal transition-all duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-bl from-bg-primary/80 to-transparent pointer-events-none" />
                    </motion.div>
                </div>
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
