import React from 'react';
import { motion } from 'framer-motion';
import Breadcrumbs from './Breadcrumbs';

const PageHeader = ({ title, subtitle, breadcrumbs, backgroundImage, ctaText, ctaLink, ctaSecondaryText, ctaSecondaryLink }) => {
    return (
        <section className="pt-40 pb-20 relative overflow-hidden">
            {backgroundImage && (
                <>
                    <div className="absolute inset-0 z-0">
                        <img 
                            src={backgroundImage} 
                            alt={title} 
                            className="w-full h-full object-cover mix-blend-luminosity opacity-30" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-bg-primary via-bg-primary/80 to-bg-primary" />
                    </div>
                </>
            )}
            <div className="container px-6 text-center relative z-10 flex flex-col items-center">
                {breadcrumbs && (
                    <div className="w-full flex justify-center mb-8">
                        <Breadcrumbs paths={breadcrumbs} align="center" />
                    </div>
                )}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl md:text-7xl font-bold mb-8 relative z-10 text-text-primary"
                >
                    {title}
                </motion.h1>
                {subtitle && (
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-text-secondary text-lg max-w-2xl mx-auto leading-relaxed relative z-10"
                        style={{ color: 'var(--text-secondary)' }}
                    >
                        {subtitle}
                    </motion.p>
                )}
                {ctaText && ctaLink && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-wrap justify-center gap-4 mt-8 relative z-10"
                    >
                        <a
                            href={ctaLink}
                            target={ctaLink.startsWith('http') ? '_blank' : undefined}
                            rel={ctaLink.startsWith('http') ? 'noopener noreferrer' : undefined}
                            className="btn-primary inline-flex items-center gap-2 px-8 py-4 text-base font-bold shadow-lg hover:shadow-accent-gold/20 transition-all"
                        >
                            {ctaText}
                        </a>
                        {ctaSecondaryText && ctaSecondaryLink && (
                            <a
                                href={ctaSecondaryLink}
                                className="btn-secondary inline-flex items-center gap-2 px-8 py-4 text-base transition-all"
                            >
                                {ctaSecondaryText}
                            </a>
                        )}
                    </motion.div>
                )}
                {/* Fear-Reversal Trust Strip for Instant Student Confidence */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 mt-6 text-xs text-text-secondary font-medium relative z-10"
                >
                    <span className="inline-flex items-center gap-1.5 text-slate-300">
                        <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                        Free Turnitin Similarity Report
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-slate-300">
                        <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        0% AI Detection Guaranteed
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-slate-300">
                        <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>
                        Verified PhD Subject Mentors
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-slate-300">
                        <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Pass Standard Guaranteed
                    </span>
                </motion.div>
            </div>
            {!backgroundImage && (
                <div className="absolute top-0 left-0 w-full h-full bg-accent-gold/5 -z-10" style={{ backgroundColor: 'rgba(212, 175, 55, 0.05)' }} />
            )}
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-glass-border to-transparent z-10" />
        </section>
    );
};

export default PageHeader;
