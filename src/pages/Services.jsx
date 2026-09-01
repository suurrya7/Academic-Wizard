import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import Testimonials from '../components/Testimonials';
import { servicesData } from '../data/services';

const Services = () => {
    return (
        <div className="page-services">
            <Helmet>
                <title>Academic Writing Services & Consulting | Academic Wizard</title>
                <meta name="description" content="Explore our comprehensive range of academic services including essay help, dissertation consulting, and research support." />
                <link rel="canonical" href="https://academicwizard.online/services/" />
                <meta property="og:title" content="Our Academic Services | Academic Wizard" />
                <meta property="og:description" content="Explore Academic Wizard's comprehensive range of academic services." />
                <meta property="og:url" content="https://academicwizard.online/services/" />
            
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        "mainEntity": [
                            {
                                "@type": "Question",
                                "name": "What is the difference between essay help and dissertation consulting?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Essay help focuses on shorter, argument-driven papers typical of undergraduate courses, while dissertation consulting provides long-term, structural support for large-scale original research projects at the postgraduate level."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "Can I combine multiple academic services?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Yes, many students combine our editing services with study guidance to both improve their current submission and develop long-term academic skills."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "Are your services tailored to specific countries?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Absolutely. Each of our services is adapted to meet the specific grading rubrics and academic standards of universities in the UK, USA, Australia, Canada, and other major educational hubs."
                                }
                            }
                        ]
                    })}
                </script>
</Helmet>

            <PageHeader 
                title="Our Services" 
                subtitle="Comprehensive academic support tailored to your unique educational needs."
                breadcrumbs={[
                    { name: 'Home', url: '/' },
                    { name: 'Services', url: '/services' }
                ]}
            />

            
            <section className="py-12 bg-bg-secondary">
                <div className="container px-6 max-w-5xl mx-auto text-center">
                    <h2 className="text-3xl font-bold font-heading text-white mb-6">Choose the Right Academic Support</h2>
                    <p className="text-text-secondary leading-relaxed mb-10 max-w-3xl mx-auto">
                        At Academic Wizard, we recognize that every student's journey is unique. Whether you are an undergraduate seeking guidance on your first major essay, or a doctoral candidate navigating a complex dissertation, our specialized services are designed to provide targeted support.
                    </p>
                    <div className="grid md:grid-cols-3 gap-6 text-left">
                        <div className="glass-card p-6 border-accent-gold/20">
                            <h3 className="text-xl font-bold mb-3 font-heading" style={{ color: 'var(--accent-gold)' }}>Undergraduate</h3>
                            <p className="text-sm text-text-secondary leading-relaxed">Core essay support, fundamental research methods, and assignment structuring.</p>
                        </div>
                        <div className="glass-card p-6 border-accent-gold/20">
                            <h3 className="text-xl font-bold mb-3 font-heading" style={{ color: 'var(--accent-gold)' }}>Postgraduate</h3>
                            <p className="text-sm text-text-secondary leading-relaxed">Master's level dissertation consulting, literature review synthesis, and advanced data analysis.</p>
                        </div>
                        <div className="glass-card p-6 border-accent-gold/20">
                            <h3 className="text-xl font-bold mb-3 font-heading" style={{ color: 'var(--accent-gold)' }}>Doctoral</h3>
                            <p className="text-sm text-text-secondary leading-relaxed">PhD thesis editing, methodological framework defense, and publication-ready formatting.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20">
                <div className="container space-y-20">
                    {servicesData.map((service, index) => (
                        <div
                            key={index}
                            className={`flex flex-col lg:flex-row gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
                        >
                            <div className="w-full lg:w-5/12">
                                <Link to={`/services/${service.slug}`} className="block group relative rounded-3xl overflow-hidden">
                                    <div className="aspect-[4/3] w-full">
                                        <img src={service.image || "/images/dark-office.webp"} alt={service.title} className="w-full h-full object-cover opacity-80 mix-blend-luminosity group-hover:mix-blend-normal group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/20 to-transparent pointer-events-none" />
                                    </div>
                                    <div className="absolute top-6 left-6 glass-card p-4 rounded-2xl border-accent-gold/30 backdrop-blur-md">
                                        <service.icon size={32} className="text-accent-gold group-hover:scale-110 transition-transform duration-500" style={{ color: 'var(--accent-gold)' }} />
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
            
            <Testimonials />
        </div>
    );
};

export default Services;
