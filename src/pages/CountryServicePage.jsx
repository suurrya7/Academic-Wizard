import React, { useEffect, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { servicesData } from '../data/services';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import TrustStats from '../components/TrustStats';
import { CheckCircle, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';
import { assetPath } from '../config/site';

const CountryServicePage = () => {
    const { serviceSlug, countrySlug } = useParams();
    const service = servicesData.find(s => s.slug === serviceSlug);
    const [openFaq, setOpenFaq] = useState(0);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        // Fetch posts for the related blogs section
        fetch(assetPath('data/posts.json'), { cache: 'no-store' })
            .then(res => res.json())
            .then(data => {
                if (service?.relatedBlogSlugs) {
                    const related = data.filter(p => service.relatedBlogSlugs.includes(p.slug));
                    setPosts(related);
                }
            })
            .catch(console.error);
    }, [service]);

    if (!service) {
        return <Navigate to="/services" replace />;
    }

    const country = service.countries.find(c => c.slug === countrySlug);
    
    if (!country) {
        return <Navigate to={`/services/${serviceSlug}`} replace />;
    }

    // Localized Overrides
    const overviewText = country.overview || service.overview;
    const featuresList = country.features || service.features;
    const pricingText = country.pricing || service.pricing;
    const faqsList = country.faqs || service.faqs;

    const whatsappUrl = `https://wa.me/919509893638?text=Hello%20Academic%20Wizard,%20I%20need%20${encodeURIComponent(service.title)}%20for%20${encodeURIComponent(country.name)}`;

    const Icon = service.icon;

    const pageTitle = `${service.title} in ${country.name} | Academic Wizard`;
    const pageDescription = `Expert ${service.title.toLowerCase()} tailored for university students in ${country.name}. ${country.desc}`;

    // Generate JSON-LD Schema
    const serviceSchema = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": `${service.title} in ${country.name}`,
        "description": pageDescription,
        "provider": {
            "@type": "Organization",
            "name": "Academic Wizard",
            "url": "https://academicwizard.online"
        },
        "areaServed": {
            "@type": "Country",
            "name": country.name
        }
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqsList.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };

    return (
        <div className="page-country-service-details">
            <Helmet>
                <title>{pageTitle}</title>
                <meta name="description" content={pageDescription} />
                <link rel="canonical" href={`https://academicwizard.online/services/${service.slug}/${country.slug}`} />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageDescription} />
                <meta property="og:url" content={`https://academicwizard.online/services/${service.slug}/${country.slug}`} />
                
                {/* Hreflang alternates to tell Google this is location-specific content */}
                <link rel="alternate" hreflang="x-default" href={`https://academicwizard.online/services/${service.slug}`} />
                <link rel="alternate" hreflang="en" href={`https://academicwizard.online/services/${service.slug}`} />
                {service.countries.map(c => (
                    <link 
                        key={c.slug} 
                        rel="alternate" 
                        hreflang={`en-${c.slug === 'uk' ? 'gb' : c.slug}`} 
                        href={`https://academicwizard.online/services/${service.slug}/${c.slug}`} 
                    />
                ))}

                <script type="application/ld+json">
                    {JSON.stringify(serviceSchema)}
                </script>
                <script type="application/ld+json">
                    {JSON.stringify(faqSchema)}
                </script>
            </Helmet>

            <PageHeader
                title={`${service.title} in ${country.name} ${country.flag}`}
                subtitle={country.desc}
                breadcrumbs={[
                    { name: 'Home', url: '/' },
                    { name: 'Services', url: '/services' },
                    { name: service.title, url: `/services/${service.slug}` },
                    { name: country.name, url: `/services/${service.slug}/${country.slug}` }
                ]}
            />

            <TrustStats />

            {/* Localized Overview Section */}
            <section className="py-20 bg-bg-secondary">
                <div className="container px-6 max-w-4xl mx-auto text-center">
                    <div className="glass-card inline-flex p-6 rounded-full mb-8">
                        <Icon size={48} className="text-accent-gold" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 font-heading text-white">
                        Local Academic Excellence in {country.name}
                    </h2>
                    <div className="prose prose-invert prose-lg max-w-none text-text-secondary leading-relaxed mb-10">
                        <p>{overviewText}</p>
                    </div>

                    {/* Local University Insight Block */}
                    {country.localInsight && (
                        <div className="glass-card p-8 mb-10 border-l-4" style={{ borderLeftColor: 'var(--accent-gold)' }}>
                            <div className="flex items-start gap-4">
                                <div className="shrink-0 mt-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent-gold)' }}><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-2 font-heading" style={{ color: 'var(--accent-gold)' }}>University Insight: {country.name}</h3>
                                    <p className="text-text-secondary text-sm leading-relaxed">{country.localInsight}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="text-left mt-12">
                        <div className="glass-card p-8 border-accent-gold/10">
                            <h3 className="text-2xl font-bold text-white mb-4 font-heading">Why Choose Academic Wizard for {service.title}?</h3>
                            <p className="text-text-secondary leading-relaxed whitespace-pre-wrap">
                                {service.whyChooseUs}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features / What's Included */}
            <section className="py-20 border-t border-glass-border">
                <div className="container px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold font-heading text-white mb-4">What's Included</h2>
                        <p className="text-text-secondary max-w-2xl mx-auto">Comprehensive support tailored to your academic needs.</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featuresList.map((feature, idx) => (
                            <div key={idx} className="glass-card p-6 flex items-start gap-4">
                                <CheckCircle className="text-accent-gold shrink-0 mt-1" size={20} />
                                <span className="text-white/80">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 bg-bg-secondary border-t border-glass-border">
                <div className="container px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold font-heading text-white mb-4">How It Works</h2>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {service.process.map((step, idx) => (
                            <div key={idx} className="relative group">
                                <div className="text-accent-gold text-6xl font-heading font-bold opacity-10 absolute -top-8 -left-4">
                                    0{idx + 1}
                                </div>
                                <div className="glass-card p-8 h-full relative z-10 border-accent-gold/10 hover:border-accent-gold/30 transition-colors">
                                    <h3 className="text-xl text-white font-bold mb-4">{step.title}</h3>
                                    <p className="text-text-secondary text-sm leading-relaxed">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="py-20 border-t border-glass-border">
                <div className="container px-6 max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold font-heading text-white mb-8">Transparent Pricing</h2>
                    <div className="glass-card p-10 border-accent-gold/20">
                        <p className="text-xl text-white/90 leading-relaxed mb-8">
                            {pricingText}
                        </p>
                        <Button onClick={() => window.open(whatsappUrl, '_blank')}>
                            Get a Personalized Quote for {country.name}
                        </Button>
                    </div>
                </div>
            </section>

            {/* FAQs */}
            <section className="py-20 bg-bg-secondary border-t border-glass-border">
                <div className="container px-6 max-w-3xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold font-heading text-white mb-4">Frequently Asked Questions</h2>
                        <p className="text-text-secondary">Everything you need to know about our {service.title.toLowerCase()} service.</p>
                    </div>
                    <div className="space-y-4">
                        {faqsList.map((faq, idx) => (
                            <div key={idx} className="glass-card overflow-hidden">
                                <button 
                                    className="w-full text-left p-6 flex justify-between items-center text-white font-bold"
                                    onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                                >
                                    {faq.question}
                                    {openFaq === idx ? <ChevronUp size={20} className="text-accent-gold" /> : <ChevronDown size={20} className="text-text-secondary" />}
                                </button>
                                {openFaq === idx && (
                                    <div className="px-6 pb-6 text-text-secondary leading-relaxed border-t border-glass-border/30 pt-4">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Related Blogs */}
            {posts.length > 0 && (
                <section className="py-20 border-t border-glass-border">
                    <div className="container px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold font-heading text-white mb-4">Related Academic Guides</h2>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {posts.map((post, index) => (
                                <Link 
                                    key={index} 
                                    to={`/blog/${post.slug}`}
                                    className="glass-card group hover:border-accent-gold/30 transition-all block"
                                >
                                    <div className="p-8">
                                        <div className="text-accent-gold text-xs font-heading uppercase tracking-widest mb-4">
                                            {post.date ? new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Latest'}
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-4 group-hover:text-accent-gold transition-colors line-clamp-2">
                                            {post.title}
                                        </h3>
                                        {post.excerpt && (
                                            <p className="text-text-secondary text-sm leading-relaxed mb-6 line-clamp-3">
                                                {post.excerpt}
                                            </p>
                                        )}
                                        <span className="text-accent-gold text-sm font-heading font-bold inline-flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                                            Read Guide →
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Final CTA */}
            <section className="py-24 relative overflow-hidden border-t border-glass-border">
                <div className="absolute inset-0 bg-accent-gold/5" />
                <div className="container px-6 relative z-10 text-center max-w-3xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold font-heading text-white mb-6">Ready to excel academically in {country.name}?</h2>
                    <p className="text-xl text-text-secondary mb-10">
                        Join thousands of students who have improved their grades with our {service.title.toLowerCase()} service.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Button onClick={() => window.open(whatsappUrl, '_blank')} className="flex items-center justify-center gap-2">
                            <MessageSquare size={20} /> Let's Discuss Your Project
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CountryServicePage;
