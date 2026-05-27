import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    FileText,
    BookOpen,
    Library,
    Search,
    Edit,
    CheckSquare,
    Presentation,
    BookMarked,
    Microscope,
    Briefcase
} from 'lucide-react';
import Button from './Button';

const services = [
    { icon: Briefcase, title: 'Assignment Help', desc: 'Expert assignment writing solution for complex university assignments across all subjects.' },
    { icon: FileText, title: 'Essay Help', desc: 'Premium guidance for developing high-quality academic essays.' },
    { icon: Library, title: 'Dissertation Help', desc: 'Comprehensive support for dissertation research and structuring.' },
    { icon: BookOpen, title: 'Thesis Guidance', desc: 'Specialized help for Master and PhD level thesis development.' },
    { icon: Search, title: 'Research Paper Support', desc: 'Advanced research methodology and data analysis assistance.' },
    { icon: Microscope, title: 'Case Study Assistance', desc: 'Detailed analysis and formatting for academic case studies.' },
    { icon: Edit, title: 'Editing & Proofreading', desc: 'Professional academic editing to ensure flawless final submissions.' },
    { icon: CheckSquare, title: 'Plagiarism Checking', desc: 'Rigorous original content verification for academic integrity.' },
    { icon: Presentation, title: 'PowerPoint Support', desc: 'Stunning academic presentation design and content support.' },
    { icon: BookMarked, title: 'Literature Review', desc: 'Critical evaluation and synthesis of academic literature.' },
];

const ServiceOverview = () => {
    return (
        <section id="services" className="py-32">
            <div className="container px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                    <div className="max-w-2xl">
                        <span className="text-accent-gold font-heading text-xs tracking-[5px] uppercase mb-6 block" style={{ color: 'var(--accent-gold)' }}>Our Expertise</span>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Comprehensive Academic <br /><span className="text-accent-gold" style={{ color: 'var(--accent-gold)' }}>Services</span></h2>
                        <p className="text-text-secondary leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                            Academic Wizard offers professional academic assistance for students who need help with assignments, essays, dissertations, and research papers. Our academic experts provide research guidance, editing services, and academic writing support.
                        </p>
                    </div>
                    <Link to="/services">
                        <Button type="outline">View All Services</Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            className="glass-card p-10 flex flex-col gap-6 group hover:translate-y-[-10px] interactive service-card"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-accent-gold/10 flex items-center justify-center group-hover:bg-accent-gold group-hover:text-black transition-all duration-500 text-accent-gold" style={{ color: 'var(--accent-gold)' }}>
                                <service.icon size={32} />
                            </div>
                            <h3 className="text-xl font-bold font-heading group-hover:text-accent-gold transition-colors text-white">
                                {service.title}
                            </h3>
                            <p className="text-text-secondary text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                {service.desc}
                            </p>
                            <Link to="/services" className="text-accent-gold text-xs uppercase tracking-[3px] font-heading mt-4 flex items-center gap-3 group/link" style={{ color: 'var(--accent-gold)' }}>
                                Learn More
                                <span className="w-8 h-[1px] bg-accent-gold scale-x-0 group-hover/link:scale-x-100 transition-transform origin-left" style={{ backgroundColor: 'var(--accent-gold)' }} />
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ServiceOverview;
