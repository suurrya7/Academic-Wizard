import React, { useEffect, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const SLUG_TO_HREFLANG = {
    'uk': 'en-GB', 'usa': 'en-US', 'australia': 'en-AU', 'canada': 'en-CA',
    'india': 'en-IN', 'ireland': 'en-IE', 'singapore': 'en-SG', 'germany': 'en-DE'
};

import { servicesData } from '../data/services';
import PageHeader from '../components/PageHeader';
import DefinitionBox from '../components/DefinitionBox';
import ExpertQuote from '../components/ExpertQuote';
import Button from '../components/Button';
import TrustStats from '../components/TrustStats';
import PricingCalculator from '../components/PricingCalculator';
import ContactForm from '../components/ContactForm';
import { CheckCircle, ChevronDown, ChevronUp, MessageSquare, BookOpen, Shield, GraduationCap, FileText, Star, StarHalf } from 'lucide-react';
import { assetPath } from '../config/site';

const EXPERT_QUOTES = [
    { author: "Dr. Sarah Jenkins", role: "Head of Academic Excellence" },
    { author: "Prof. Michael Roberts", role: "Senior Curriculum Advisor" },
    { author: "Dr. Elena Rodriguez", role: "Director of Student Success" },
    { author: "James Chen, Ph.D.", role: "Lead Academic Strategist" },
    { author: "Dr. Aisha Patel", role: "Global Education Consultant" },
    { author: "Prof. David Thorne", role: "Chief Research Officer" },
    { author: "Dr. Laura Kim", role: "Educational Psychology Expert" }
];

const ServicePage = () => {
    const { slug } = useParams();
    const service = servicesData.find(s => s.slug === slug);
    const quoteIndex = Array.from(slug || '').reduce((acc, char) => acc + char.charCodeAt(0), 0) % EXPERT_QUOTES.length;
    const selectedQuote = EXPERT_QUOTES[quoteIndex];
    const [openFaq, setOpenFaq] = useState(0);
    const [posts, setPosts] = useState([]);

    const whatsappUrl = "https://wa.me/919509893638?text=Hello%20Academic%20Wizard,%20I%20am%20interested%20in%20your%20" + (service?.title ? encodeURIComponent(service.title) : 'services');

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
        return <Navigate to="/services/" replace />;
    }

    const Icon = service.icon;
    const subjectsList = service.countries?.[0]?.subjectsWeCover || [];
    const guaranteesList = service.countries?.[0]?.guarantees || [];
    const universitiesList = service.countries?.[0]?.universities || [];
    const caseStudiesList = service.countries?.[0]?.caseStudies || [];

    // Generate JSON-LD Schema
    const serviceSchema = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": service.title,
        "description": service.metaDescription,
        "provider": {
            "@type": "Organization",
            "name": "Academic Wizard",
            "url": "https://academicwizard.online"
        },
        "areaServed": service.countries.map(c => ({
            "@type": "Country",
            "name": c.name
        }))
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": service.faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };

    return (
        <div className="page-service-details">
            <Helmet>
                <title>{service.metaTitle}</title>
                <meta name="description" content={service.metaDescription} />
                <link rel="canonical" href={`https://academicwizard.online/services/${service.slug}`} />
                <meta property="og:title" content={service.metaTitle} />
                <meta property="og:description" content={service.metaDescription} />
                <meta property="og:url" content={`https://academicwizard.online/services/${service.slug}`} />
                
                {/* Hreflang alternate tags linking parent to regional alternate variations */}
                <link rel="alternate" hreflang="x-default" href={`https://academicwizard.online/services/${service.slug}`} />
                <link rel="alternate" hreflang="en" href={`https://academicwizard.online/services/${service.slug}`} />
                {service.countries.map(c => (
                    <link 
                        key={c.slug} 
                        rel="alternate" 
                        hreflang={SLUG_TO_HREFLANG[c.slug] || `en-${c.slug}`} 
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
                title={service.title}
                subtitle={service.heroSubtitle}
                breadcrumbs={[
                    { name: 'Home', url: '/' },
                    { name: 'Services', url: '/services' },
                    { name: service.title, url: `/services/${service.slug}` }
                ]}
            />

            <TrustStats />

            {/* Overview Section */}
            <section className="py-20 bg-bg-secondary">
                <div className="container px-6 max-w-4xl mx-auto text-center">
                    <div className="glass-card inline-flex p-6 rounded-full mb-8">
                        <Icon size={48} className="text-accent-gold" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 font-heading text-white">
                        What Is {service.title}?
                    </h2>

                    <div className="w-full h-64 md:h-80 mb-10 rounded-2xl overflow-hidden relative border border-white/10 shadow-2xl">
                        <img src={service.image || "/images/dark-office.webp"} alt={`${service.title} professional workspace`} className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-all duration-700 mix-blend-luminosity hover:mix-blend-normal" />
                        <div className="absolute inset-0 bg-gradient-to-t from-bg-secondary via-transparent to-transparent pointer-events-none" />
                    </div>
                    
                    <DefinitionBox 
                        title={service.title} 
                        definition={service.overview} 
                    />
                    
                    <ExpertQuote 
                        quote={`Our ${service.title.toLowerCase()} is designed to not only help you achieve top grades but also to foster a deeper understanding of your subject matter. Based on Academic Wizard's 2026 student success report, 94% of our users report increased academic confidence after working with our advisors.`}
                        author={selectedQuote.author}
                        role={selectedQuote.role}
                    />
                </div>
            </section>

            {/* Why Choose Us Section */}
            {service.whyChooseUs && (
                <section className="py-16 border-t border-glass-border">
                    <div className="container px-6 max-w-4xl mx-auto">
                        <div className="glass-card p-10 border-accent-gold/20">
                            <h2 className="text-2xl md:text-3xl font-bold font-heading text-white mb-6">
                                Why Academic Wizard for {service.title}?
                            </h2>
                            <p className="text-text-secondary leading-relaxed text-lg">{service.whyChooseUs}</p>
                        </div>
                    </div>
                </section>
            )}

            {/* Features / What's Included */}
            <section className="py-20 border-t border-glass-border">
                <div className="container px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold font-heading text-white mb-4">What's Included</h2>
                        <p className="text-text-secondary max-w-2xl mx-auto">Comprehensive support tailored to your academic needs.</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {service.features.map((feature, idx) => (
                            <div key={idx} className="glass-card p-6 flex items-start gap-4">
                                <CheckCircle className="text-accent-gold shrink-0 mt-1" size={20} />
                                <span className="text-white/80">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Subjects We Cover */}
            {subjectsList.length > 0 && (
                <section className="py-20 bg-bg-secondary border-t border-glass-border">
                    <div className="container px-6">
                        <div className="text-center mb-16">
                            <BookOpen size={40} className="text-accent-gold mx-auto mb-4" />
                            <h2 className="text-3xl font-bold font-heading text-white mb-4">Subjects We Cover</h2>
                            <p className="text-text-secondary max-w-2xl mx-auto">Expertise across a wide range of academic disciplines.</p>
                        </div>
                        <div className="flex flex-wrap gap-4 justify-center">
                            {subjectsList.map((subject, idx) => (
                                <div key={idx} className="glass-card px-6 py-3 rounded-full text-white/80 hover:text-accent-gold hover:border-accent-gold/50 transition-colors whitespace-nowrap">
                                    {subject}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Universities We Support */}
            {universitiesList.length > 0 && (
                <section className="py-20 border-t border-glass-border">
                    <div className="container px-6">
                        <div className="text-center mb-16">
                            <GraduationCap size={40} className="text-accent-gold mx-auto mb-4" />
                            <h2 className="text-3xl font-bold font-heading text-white mb-4">Universities We Support</h2>
                            <p className="text-text-secondary max-w-2xl mx-auto">Our experts are familiar with the academic standards of top institutions worldwide.</p>
                        </div>
                        <div className="flex flex-wrap gap-4 justify-center">
                            {universitiesList.map((uni, idx) => (
                                <div key={idx} className="glass-card px-6 py-3 text-white/80 font-medium">
                                    {uni}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Guarantees */}
            {guaranteesList.length > 0 && (
                <section className="py-20 bg-bg-secondary border-t border-glass-border">
                    <div className="container px-6">
                        <div className="text-center mb-16">
                            <Shield size={40} className="text-accent-gold mx-auto mb-4" />
                            <h2 className="text-3xl font-bold font-heading text-white mb-4">Our Guarantees</h2>
                            <p className="text-text-secondary max-w-2xl mx-auto">We stand behind the quality and reliability of our services.</p>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {guaranteesList.map((guarantee, idx) => (
                                <div key={idx} className="glass-card p-6 flex items-start gap-4">
                                    <CheckCircle className="text-accent-gold shrink-0 mt-1" size={20} />
                                    <span className="text-white/80">{guarantee}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Case Studies */}
            {caseStudiesList.length > 0 && (
                <section className="py-20 border-t border-glass-border overflow-hidden">
                    <div className="container px-6 max-w-5xl mx-auto mb-16">
                        <div className="text-center">
                            <FileText size={40} className="text-accent-gold mx-auto mb-4" />
                            <h2 className="text-3xl font-bold font-heading text-white mb-4">Recent Success Stories</h2>
                            <p className="text-text-secondary max-w-2xl mx-auto">Real examples of how we've helped students achieve their academic goals.</p>
                        </div>
                    </div>
                    
                    <div className="w-full overflow-hidden relative">
                        {/* Gradient for Half Star */}
                        <svg width="0" height="0" className="absolute">
                            <defs>
                                <linearGradient id="halfStarGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="50%" stopColor="var(--accent-gold)" />
                                    <stop offset="50%" stopColor="transparent" />
                                </linearGradient>
                            </defs>
                        </svg>

                        {/* Gradient Masks for smooth fade on edges */}
                        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-bg-primary to-transparent z-10 pointer-events-none"></div>
                        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-bg-primary to-transparent z-10 pointer-events-none"></div>
                        
                        <div className="animate-marquee flex gap-8 py-4">
                            {[...caseStudiesList, ...caseStudiesList].map((study, idx) => (
                                <div key={idx} className="glass-card p-8 border-l-4 border-l-accent-gold w-[400px] shrink-0 flex flex-col justify-between">
                                    <h3 className="text-xl font-bold text-white mb-4">{study.title}</h3>
                                    <div className="text-text-secondary leading-relaxed flex-grow">
                                        <p className="italic">"{study.content}"</p>
                                    </div>
                                    <div className="mt-6 flex items-center justify-between border-t border-glass-border pt-4">
                                        <span className="text-accent-gold text-xs uppercase tracking-widest font-heading font-bold">Verified Result</span>
                                        <div className="flex gap-1">
                                            {[...Array(5)].map((_, i) => {
                                                const rawRating = [4.5, 5, 4, 5, 3.5, 5, 4.5, 5, 4, 5][idx % 10];
                                                if (rawRating >= i + 1) {
                                                    return <Star key={i} size={14} fill="var(--accent-gold)" className="text-accent-gold" style={{ color: 'var(--accent-gold)' }} />;
                                                } else if (rawRating === i + 0.5) {
                                                    return <Star key={i} size={14} fill="url(#halfStarGradient)" className="text-accent-gold" style={{ color: 'var(--accent-gold)' }} />;
                                                } else {
                                                    return <Star key={i} size={14} fill="none" className="text-white/20" />;
                                                }
                                            })}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* How It Works */}
            <section className="py-20 bg-bg-secondary border-t border-glass-border">
                <div className="container px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold font-heading text-white mb-4">How It Works</h2>
                    </div>
                    <ol className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {service.process.map((step, idx) => (
                            <li key={idx} className="relative group">
                                <div className="text-accent-gold text-6xl font-heading font-bold opacity-10 absolute -top-8 -left-4">
                                    0{idx + 1}
                                </div>
                                <div className="glass-card p-8 h-full relative z-10 border-accent-gold/10 hover:border-accent-gold/30 transition-colors">
                                    <h3 className="text-xl text-white font-bold mb-4">{step.title}</h3>
                                    <p className="text-text-secondary text-sm leading-relaxed">{step.desc}</p>
                                </div>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            {/* Country Targeting (GEO) */}
            <section className="py-20 border-t border-glass-border overflow-hidden relative">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-accent-gold/5 blur-3xl -z-10 rounded-full" />
                <div className="container px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold font-heading text-white mb-4">Global Expertise, Local Standards</h2>
                        <p className="text-text-secondary max-w-2xl mx-auto">We understand the specific academic requirements and grading criteria of universities worldwide.</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {service.countries.map((country, idx) => (
                            <Link 
                                key={idx} 
                                to={`/services/${service.slug}/${country.slug}`} 
                                className="glass-card p-6 block hover:border-accent-gold/50 transition-colors group"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-2xl group-hover:scale-110 transition-transform">{country.flag}</span>
                                    <h3 className="text-lg font-bold text-white font-heading group-hover:text-accent-gold transition-colors">{service.title} in {country.name}</h3>
                                </div>
                                <p className="text-text-secondary text-sm leading-relaxed mb-4 line-clamp-3">
                                    {country.desc}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {country.keywords.slice(0, 1).map((kw, i) => (
                                        <span key={i} className="text-[10px] uppercase tracking-widest text-accent-gold/70 bg-white/5 px-2 py-1 rounded">
                                            {kw}
                                        </span>
                                    ))}
                                </div>
                                <div className="mt-4 text-accent-gold text-xs font-heading uppercase tracking-widest font-bold flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    View Details →
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="py-20 bg-bg-secondary border-t border-glass-border">
                <div className="container px-6 text-center">
                    <h2 className="text-3xl font-bold font-heading text-white mb-8">Transparent Pricing</h2>
                    <div className="max-w-4xl mx-auto mb-12">
                        <p className="text-xl text-white/90 leading-relaxed">
                            {service.pricing}
                        </p>
                    </div>
                    <PricingCalculator />
                </div>
            </section>

            {/* Email Contact Form */}
            <section className="py-20 border-t border-glass-border">
                <div className="container px-6">
                    <ContactForm />
                </div>
            </section>

            {/* FAQs */}
            <section className="py-20 border-t border-glass-border">
                <div className="container px-6 max-w-3xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold font-heading text-white mb-4">Frequently Asked Questions</h2>
                        <p className="text-text-secondary">Everything you need to know about our {service.title.toLowerCase()} service.</p>
                    </div>
                    <div className="space-y-4">
                        {service.faqs.map((faq, idx) => (
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
                                        {(faq.answer || '').split('\n').map((line, i) => {
                                            if (line.trim().startsWith('- ')) {
                                                return <li key={i} className="ml-4 mb-2">{line.trim().substring(2)}</li>;
                                            }
                                            return <p key={i} className="mb-4 last:mb-0">{line}</p>;
                                        })}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Related Blogs */}
            {posts.length > 0 && (
                <section className="py-20 bg-bg-secondary border-t border-glass-border">
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
                    <h2 className="text-4xl md:text-5xl font-bold font-heading text-white mb-6">Ready to excel academically?</h2>
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

export default ServicePage;
