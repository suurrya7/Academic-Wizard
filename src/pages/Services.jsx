import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import { servicesData } from '../data/services';

const Services = () => {
    return (
        <div className="page-services">
            <PageHeader
                title="Our Services"
                subtitle="Professional academic assistance and research support tailored to your university requirements."
            />

            <section className="py-20">
                <div className="container space-y-20">
                    {servicesData.map((service, index) => (
                        <div
                            key={index}
                            className={`flex flex-col lg:flex-row gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
                        >
                            <div className="w-full lg:w-1/3">
                                <Link to={`/services/${service.slug}`} className="block group">
                                    <div className="glass-card p-12 flex items-center justify-center aspect-square border-accent-gold/20 group-hover:border-accent-gold/50 transition-colors" style={{ borderColor: 'rgba(212, 175, 55, 0.2)' }}>
                                        <service.icon size={100} className="text-accent-gold group-hover:scale-110 transition-transform duration-500" style={{ color: 'var(--accent-gold)' }} />
                                    </div>
                                </Link>
                            </div>
                            <div className="w-full lg:w-2/3">
                                <Link to={`/services/${service.slug}`}>
                                    <h2 className="text-3xl font-bold mb-6 font-heading text-white hover:text-accent-gold transition-colors">{service.title}</h2>
                                </Link>
                                <p className="text-text-secondary text-lg leading-relaxed mb-8 line-clamp-3" style={{ color: 'var(--text-secondary)' }}>
                                    {service.overview}
                                </p>
                                <div className="flex gap-4">
                                    <Link to={`/services/${service.slug}`}>
                                        <Button>
                                            View Details
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Services;
