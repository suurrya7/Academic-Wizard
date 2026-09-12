import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, CheckCircle, ExternalLink } from 'lucide-react';
import reviewsData from '../data/reviews.json';

const Testimonials = () => {
    const { summary, testimonials } = reviewsData;

    return (
        <section className="py-32 relative">
            <div className="container px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-accent-gold font-heading text-xs tracking-[5px] uppercase mb-4 block" style={{ color: 'var(--accent-gold)' }}>Verified Social Proof</span>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-text-primary">Trusted by <span className="text-accent-gold" style={{ color: 'var(--accent-gold)' }}>University Students</span> Worldwide</h2>
                    
                    {/* Trust Summary Pill */}
                    <div className="inline-flex flex-wrap items-center justify-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-accent-gold/30 text-xs text-text-primary shadow-lg backdrop-blur-sm">
                        <div className="flex text-amber-400">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                            ))}
                        </div>
                        <span className="font-bold text-white">{summary.overallRating.toFixed(1)} / 5.0 Rating</span>
                        <span className="text-white/30">•</span>
                        <span className="text-text-secondary">Based on genuine Google & Trustpilot feedback</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {testimonials.map((t, index) => (
                        <motion.div
                            key={t.id || index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="glass-card p-6 relative flex flex-col justify-between gap-4 group hover:border-accent-gold/50 transition-all duration-300"
                        >
                            <Quote className="absolute top-6 right-6 text-accent-gold/15 pointer-events-none" style={{ color: 'rgba(212, 175, 55, 0.15)' }} size={32} />

                            <div>
                                <div className="flex justify-between items-center mb-4 border-b border-glass-border pb-3">
                                    <div className="flex gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star 
                                                key={i} 
                                                size={14} 
                                                fill={i < t.rating ? "var(--accent-gold)" : "none"} 
                                                className={i < t.rating ? "text-accent-gold" : "text-text-secondary/30"} 
                                                style={{ color: i < t.rating ? 'var(--accent-gold)' : undefined }} 
                                            />
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        {t.source === 'Google' ? (
                                            <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full text-[10px] font-bold">
                                                Google
                                            </span>
                                        ) : (
                                            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full text-[10px] font-bold">
                                                Trustpilot
                                            </span>
                                        )}
                                        <div className="flex items-center gap-1 bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold">
                                            <CheckCircle size={10} />
                                            Verified
                                        </div>
                                    </div>
                                </div>
                                
                                <p className="text-text-secondary italic leading-relaxed text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>
                                    "{t.text}"
                                </p>
                            </div>
                            
                            <div className="flex justify-between items-end pt-3 border-t border-glass-border mt-2">
                                <div>
                                    <h5 className="font-heading text-sm text-text-primary font-bold">
                                        {t.name}
                                    </h5>
                                    <p className="text-[10px] uppercase tracking-[2px] text-accent-gold mt-0.5" style={{ color: 'var(--accent-gold)' }}>{t.location}</p>
                                </div>
                                <span className="text-[10px] text-text-secondary/60 uppercase tracking-wider">{t.date}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Direct Review Links Bar */}
                <div className="glass-card p-6 border-accent-gold/20 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto">
                    <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                            <span>⭐ Share your experience with Academic Wizard</span>
                        </h4>
                        <p className="text-xs text-text-secondary mt-0.5">
                            Real feedback from verified students helps us maintain the highest standard of academic excellence.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 shrink-0">
                        <a 
                            href={summary.google.reviewUrl}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 border border-accent-gold/30 hover:border-accent-gold text-xs font-bold text-white transition-all group"
                        >
                            <span>Google Review</span>
                            <ExternalLink size={12} className="group-hover:translate-x-0.5 transition-transform" />
                        </a>
                        <a 
                            href={summary.trustpilot.profileUrl}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 hover:border-emerald-500 text-xs font-bold text-emerald-400 transition-all group"
                        >
                            <span>Trustpilot</span>
                            <ExternalLink size={12} className="group-hover:translate-x-0.5 transition-transform" />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;

