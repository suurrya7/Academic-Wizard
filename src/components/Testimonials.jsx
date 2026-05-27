import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
    {
        name: 'Sarah',
        location: 'London',
        text: "Academic Wizard helped me structure my dissertation research. The guidance was extremely helpful and professional.",
        rating: 5,
    },
    {
        name: 'Daniel',
        location: 'Sydney',
        text: "Excellent academic editing service and very responsive support on WhatsApp. Saved me so much time with formatting.",
        rating: 5,
    },
    {
        name: 'James',
        location: 'Dublin',
        text: "Reliable academic assistance with great attention to research quality. The experts really know their subjects.",
        rating: 5,
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
                            <div className="flex gap-1 mb-2">
                                {[...Array(t.rating)].map((_, i) => (
                                    <Star key={i} size={16} fill="var(--accent-gold)" className="text-accent-gold" style={{ color: 'var(--accent-gold)' }} />
                                ))}
                            </div>
                            <p className="text-text-secondary italic leading-relaxed text-sm grow" style={{ color: 'var(--text-secondary)' }}>
                                "{t.text}"
                            </p>
                            <div>
                                <h5 className="font-heading text-sm text-white">{t.name}</h5>
                                <p className="text-[10px] uppercase tracking-[2px] text-accent-gold" style={{ color: 'var(--accent-gold)' }}>{t.location}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
