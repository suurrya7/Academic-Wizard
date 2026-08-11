import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { servicesData } from '../data/services';
import Button from './Button';

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
                    {servicesData.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            className="glass-card p-6 flex flex-col gap-6 group hover:translate-y-[-10px] interactive service-card overflow-hidden"
                        >
                            {service.image ? (
                                <div className="w-[calc(100%+3rem)] h-48 -mt-6 -mx-6 mb-[-1rem] relative">
                                    <img src={service.image} alt={service.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity mix-blend-luminosity group-hover:mix-blend-normal" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/50 to-transparent" />
                                    <div className="absolute bottom-4 left-6 w-12 h-12 rounded-xl bg-bg-secondary/80 backdrop-blur-md flex items-center justify-center border border-accent-gold/20">
                                        <service.icon size={24} className="text-accent-gold" />
                                    </div>
                                </div>
                            ) : (
                                <div className="w-16 h-16 rounded-2xl bg-accent-gold/10 flex items-center justify-center group-hover:bg-accent-gold group-hover:text-black transition-all duration-500 text-accent-gold" style={{ color: 'var(--accent-gold)' }}>
                                    <service.icon size={32} />
                                </div>
                            )}
                            <h3 className="text-xl font-bold font-heading group-hover:text-accent-gold transition-colors text-white">
                                {service.title}
                            </h3>
                            <p className="text-text-secondary text-sm leading-relaxed line-clamp-3" style={{ color: 'var(--text-secondary)' }}>
                                {service.overview}
                            </p>
                            <Link 
                                to={`/services/${service.slug}`} 
                                className="text-accent-gold text-xs uppercase tracking-[3px] font-heading mt-4 flex items-center gap-3 group/link" 
                                style={{ color: 'var(--accent-gold)' }}
                                aria-label={`Learn more about our ${service.title} services`}
                            >
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
