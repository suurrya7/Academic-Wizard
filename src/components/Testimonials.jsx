import React from 'react';
import { motion } from 'framer-motion';
import { Star, StarHalf, Quote, CheckCircle } from 'lucide-react';

const testimonials = [
    {
        name: 'S***',
        location: 'London, UK',
        text: "Academic Wizard helped me structure my dissertation research. The guidance was extremely helpful and professional.",
        rating: 4.5,
        date: "August 2026"
    },
    {
        name: 'D***',
        location: 'Sydney, AU',
        text: "Excellent academic editing service and very responsive support on WhatsApp. Saved me so much time with formatting.",
        rating: 4,
        date: "July 2026"
    },
    {
        name: 'J***',
        location: 'Dublin, IE',
        text: "Reliable academic assistance with great attention to research quality. The experts really know their subjects.",
        rating: 5,
        date: "July 2026"
    },
];

const Testimonials = () => {
    return (
        <section className="py-32">
            <div className="container px-6">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <span className="text-accent-gold font-heading text-xs tracking-[5px] uppercase mb-6 block" style={{ color: 'var(--accent-gold)' }}>Success Stories</span>
                    <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">Trusted by <span className="text-accent-gold" style={{ color: 'var(--accent-gold)' }}>Thousands</span></h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="glass-card p-10 relative flex flex-col gap-6 group hover:border-accent-gold/50"
                        >
                            <Quote className="absolute top-10 right-10 text-accent-gold/20" style={{ color: 'rgba(212, 175, 55, 0.2)' }} size={40} />
                            
                            {/* Gradient for Half Star */}
                            <svg width="0" height="0" className="absolute">
                                <defs>
                                    <linearGradient id="testiHalfStarGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="50%" stopColor="var(--accent-gold)" />
                                        <stop offset="50%" stopColor="transparent" />
                                    </linearGradient>
                                </defs>
                            </svg>

                            <div className="flex justify-between items-center mb-2 border-b border-glass-border pb-4">
                                <div className="flex gap-1">
                                    {[...Array(5)].map((_, i) => {
                                        if (t.rating >= i + 1) {
                                            return <Star key={i} size={16} fill="var(--accent-gold)" className="text-accent-gold" style={{ color: 'var(--accent-gold)' }} />;
                                        } else if (t.rating === i + 0.5) {
                                            return <Star key={i} size={16} fill="url(#testiHalfStarGradient)" className="text-accent-gold" style={{ color: 'var(--accent-gold)' }} />;
                                        } else {
                                            return <Star key={i} size={16} fill="none" className="text-white/20" />;
                                        }
                                    })}
                                </div>
                                <div className="flex items-center gap-1.5 bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold">
                                    <CheckCircle size={12} />
                                    Verified
                                </div>
                            </div>
                            
                            <p className="text-text-secondary italic leading-relaxed text-sm grow" style={{ color: 'var(--text-secondary)' }}>
                                "{t.text}"
                            </p>
                            
                            <div className="flex justify-between items-end mt-2 pt-4 border-t border-glass-border">
                                <div>
                                    <h5 className="font-heading text-sm text-white flex items-center gap-2">
                                        {t.name}
                                    </h5>
                                    <p className="text-[10px] uppercase tracking-[2px] text-accent-gold mt-1" style={{ color: 'var(--accent-gold)' }}>{t.location}</p>
                                </div>
                                <span className="text-[10px] text-text-secondary/60 uppercase tracking-widest">{t.date}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;

