import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const subjects = [
    { name: 'Business', slug: 'business' },
    { name: 'Marketing', slug: 'marketing' },
    { name: 'Management', slug: 'mba' },
    { name: 'Finance', slug: 'finance' },
    { name: 'Accounting', slug: 'accounting' },
    { name: 'Law', slug: 'law' },
    { name: 'Nursing', slug: 'nursing' },
    { name: 'Engineering', slug: 'engineering' },
    { name: 'Computer Science', slug: 'computer-science' },
    { name: 'Psychology', slug: 'psychology' },
    { name: 'Sociology', slug: 'sociology' }
];

const SubjectsGrid = () => {
    return (
        <section className="bg-bg-secondary py-32" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <div className="container px-6">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <span className="text-accent-gold font-heading text-xs tracking-[5px] uppercase mb-6 block" style={{ color: 'var(--accent-gold)' }}>Expertise Areas</span>
                    <h2 className="text-4xl md:text-5xl font-bold mb-8 text-text-primary">Academic Subjects <br /><span className="text-accent-gold" style={{ color: 'var(--accent-gold)' }}>Covered</span></h2>
                    <p className="text-text-secondary leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        Our academic experts provide assistance across a wide range of university subjects including business, engineering, psychology, computer science, law, and many more.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {subjects.map((subject, index) => (
                        <Link key={index} to={`/services/assignment-help/uk/${subject.slug}`}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ scale: 1.05, borderColor: 'var(--accent-gold)' }}
                                className="px-8 py-10 border border-glass-border rounded-xl text-center group cursor-pointer"
                            >
                                <span className="text-sm font-heading tracking-widest uppercase group-hover:text-accent-gold transition-colors text-text-primary">
                                    {subject.name}
                                </span>
                            </motion.div>
                        </Link>
                    ))}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: subjects.length * 0.05 }}
                        className="px-8 py-10 bg-accent-gold/10 border border-accent-gold/30 rounded-xl text-center flex items-center justify-center"
                        style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)', borderColor: 'rgba(212, 175, 55, 0.3)' }}
                    >
                        <Link to="/services" className="text-xs font-heading tracking-widest uppercase text-accent-gold" style={{ color: 'var(--accent-gold)' }}>& Many More</Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default SubjectsGrid;
