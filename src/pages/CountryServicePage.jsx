import React, { useEffect, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { servicesData } from '../data/services';
import { countrySubjects, countryCities } from '../data/specializedPages';
import PageHeader from '../components/PageHeader';
import DefinitionBox from '../components/DefinitionBox';
import ExpertQuote from '../components/ExpertQuote';
import Button from '../components/Button';
import TrustStats from '../components/TrustStats';
import PricingCalculator from '../components/PricingCalculator';
import ContactForm from '../components/ContactForm';
import { CheckCircle, ChevronDown, ChevronUp, MessageSquare, BookOpen, Shield, GraduationCap, FileText, Star, Zap } from 'lucide-react';
import { assetPath } from '../config/site';

const SLUG_TO_HREFLANG = {
    'uk': 'en-GB', 'usa': 'en-US', 'australia': 'en-AU', 'canada': 'en-CA',
    'india': 'en-IN', 'ireland': 'en-IE', 'singapore': 'en-SG', 'germany': 'en-DE'
};

const CountryServicePage = () => {
    const { serviceSlug, countrySlug } = useParams();
    const service = servicesData.find(s => s.slug === serviceSlug);
    const [openFaq, setOpenFaq] = useState(0);
    const [posts, setPosts] = useState([]);
    const [currentCaseStudy, setCurrentCaseStudy] = useState(0);

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
    const faqsList = country.faqs || service.faqs || [];
    const subjectsList = country.subjectsWeCover || [];
    const guaranteesList = country.guarantees || [];
    const universitiesList = country.universities || [];
    const caseStudiesList = country.caseStudies || [];

    const whatsappUrl = `https://wa.me/919509893638?text=Hello%20Academic%20Wizard,%20I%20need%20${encodeURIComponent(service.title)}%20for%20${encodeURIComponent(country.name)}`;

    const Icon = service.icon;

    const pageTitle = country.metaTitle || service.metaTitle || `${service.title} in ${country.name} | Academic Wizard`;
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
                title={`${service.title} in ${country.name} ${country.flag}`}
                subtitle={country.desc}
                breadcrumbs={[
                    { name: 'Home', url: '/' },
                    { name: 'Services', url: '/services' },
                    { name: service.title, url: `/services/${service.slug}` },
                    { name: country.name, url: `/services/${service.slug}/${country.slug}` }
                ]}
            />

            {/* Social Proof Trust Bar */}
            <div className="border-y border-glass-border bg-black/40 py-3 backdrop-blur-md">
                <div className="container mx-auto px-6 max-w-7xl flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs font-semibold text-white/80">
                    <div className="flex items-center gap-2">
                        <div className="flex text-amber-400">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={14} className="fill-amber-400" />
                            ))}
                        </div>
                        <span>4.9/5 Rating (1,450+ Verified Students)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Shield className="text-emerald-400" size={16} />
                        <span>100% Turnitin-Safe & 0% AI Pass Guarantee</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Zap className="text-accent-gold" size={16} />
                        <span>Urgent 12-Hour Turnaround Available</span>
                    </div>
                </div>
            </div>

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
                    
                    {country.image && (
                        <div className="w-full h-64 md:h-80 mb-10 rounded-2xl overflow-hidden relative border border-white/10 shadow-2xl">
                            <img src={country.image} alt={`${service.title} in ${country.name}`} className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-all duration-700 mix-blend-luminosity hover:mix-blend-normal" />
                            <div className="absolute inset-0 bg-gradient-to-t from-bg-secondary via-transparent to-transparent pointer-events-none" />
                        </div>
                    )}
                    
                    <DefinitionBox 
                        title={`${service.title} in ${country.name}`} 
                        definition={overviewText} 
                    />
                    
                    <ExpertQuote 
                        quote={`Academic standards in ${country.name} require a tailored approach. According to Academic Wizard's internal analysis of over 5,000 university submissions, students who receive localized academic support see an average grade improvement of 12 percentage points.`}
                        author="Prof. James Roberts"
                        role={`Director of Academic Quality, ${country.name}`}
                    />
                    
                    {/* Local University Insight Block */}
                    {country.localInsight && (
                        <div className="glass-card p-8 mb-10 border-l-4 text-left" style={{ borderLeftColor: 'var(--accent-gold)' }}>
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

            {/* Subjects We Cover */}
            {subjectsList.length > 0 && (
                <section className="py-20 bg-bg-secondary border-t border-glass-border">
                    <div className="container px-6">
                        <div className="text-center mb-16">
                            <BookOpen size={40} className="text-accent-gold mx-auto mb-4" />
                            <h2 className="text-3xl font-bold font-heading text-white mb-4">Subjects We Cover in {country.name}</h2>
                            <p className="text-text-secondary max-w-2xl mx-auto">Expertise across a wide range of academic disciplines.</p>
                        </div>
                        <div className="flex flex-wrap gap-4 justify-center">
                            {subjectsList.map((subject, idx) => {
                                const slugified = subject.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                                const matchingSubject = countrySubjects[country.slug]?.find(s => s.slug === slugified || s.title.toLowerCase().includes(subject.toLowerCase()));
                                
                                return matchingSubject ? (
                                    <Link key={idx} to={`/services/${service.slug}/${country.slug}/${matchingSubject.slug}`} className="glass-card px-6 py-3 rounded-full text-white/80 hover:text-accent-gold hover:border-accent-gold/50 transition-colors whitespace-nowrap inline-block">
                                        {subject}
                                    </Link>
                                ) : (
                                    <div key={idx} className="glass-card px-6 py-3 rounded-full text-white/80 whitespace-nowrap">
                                        {subject}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* Popular Cities */}
            {countryCities[country.slug] && countryCities[country.slug].length > 0 && (
                <section className="py-20 border-t border-glass-border">
                    <div className="container px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold font-heading text-white mb-4">Popular Cities in {country.name}</h2>
                            <p className="text-text-secondary max-w-2xl mx-auto">Providing localized {service.title.toLowerCase()} for students in major academic hubs.</p>
                        </div>
                        <div className="flex flex-wrap gap-4 justify-center">
                            {countryCities[country.slug].map((city, idx) => (
                                <Link key={idx} to={`/services/${service.slug}/${country.slug}/${city.slug}`} className="glass-card px-6 py-3 rounded-full text-white/80 hover:text-accent-blue hover:border-accent-blue/50 transition-colors whitespace-nowrap inline-block">
                                    {city.title.replace('Assignment Help ', '')}
                                </Link>
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
                            <h2 className="text-3xl font-bold font-heading text-white mb-4">Universities We Support in {country.name}</h2>
                            <p className="text-text-secondary max-w-2xl mx-auto">Our experts are familiar with the academic standards of top institutions.</p>
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
                <section className="py-20 border-t border-glass-border">
                    <div className="container px-6">
                        <div className="text-center mb-16">
                            <FileText size={40} className="text-accent-gold mx-auto mb-4" />
                            <h2 className="text-3xl font-bold font-heading text-white mb-4">How Students Use Our Service</h2>
                        </div>
                        <div className="relative max-w-4xl mx-auto">
                            <div className="overflow-hidden relative pb-4">
                                <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentCaseStudy * 100}%)` }}>
                                    {caseStudiesList.map((caseStudy, idx) => (
                                        <div key={idx} className="w-full shrink-0 px-2 sm:px-4">
                                            <div className="glass-card p-8 border-accent-gold/20 h-full text-center flex flex-col justify-center">
                                                <h3 className="text-2xl font-bold text-white mb-6 font-heading">{caseStudy.title}</h3>
                                                <p className="text-white/80 leading-relaxed text-lg max-w-2xl mx-auto">{caseStudy.content}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {caseStudiesList.length > 1 && (
                                <div className="flex justify-center items-center gap-6 mt-8">
                                    <button 
                                        onClick={() => setCurrentCaseStudy(prev => (prev === 0 ? caseStudiesList.length - 1 : prev - 1))}
                                        className="p-3 px-6 rounded-full bg-white/5 hover:bg-accent-gold/20 text-white transition-colors border border-white/10 hover:border-accent-gold/50 font-semibold"
                                        aria-label="Previous Case Study"
                                    >
                                        ← Prev
                                    </button>
                                    <div className="text-white/50 text-sm font-medium">
                                        {currentCaseStudy + 1} / {caseStudiesList.length}
                                    </div>
                                    <button 
                                        onClick={() => setCurrentCaseStudy(prev => (prev === caseStudiesList.length - 1 ? 0 : prev + 1))}
                                        className="p-3 px-6 rounded-full bg-white/5 hover:bg-accent-gold/20 text-white transition-colors border border-white/10 hover:border-accent-gold/50 font-semibold"
                                        aria-label="Next Case Study"
                                    >
                                        Next →
                                    </button>
                                </div>
                            )}
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
            <section className="py-20 bg-bg-secondary border-t border-glass-border">
                <div className="container px-6 text-center">
                    <h2 className="text-3xl font-bold font-heading text-white mb-8">Transparent Pricing</h2>
                    <div className="max-w-4xl mx-auto mb-12">
                        <p className="text-xl text-white/90 leading-relaxed">
                            {pricingText}
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

            {/* Mobile Sticky Floating Action Bar */}
            <aside aria-label="Mobile quick quote" className="md:hidden fixed bottom-0 left-0 w-full z-40 bg-bg-primary/95 border-t border-glass-border backdrop-blur-lg p-3 shadow-2xl">
                <div className="flex items-center justify-between gap-3">
                    <div className="truncate">
                        <div className="text-xs font-bold text-text-primary truncate">{service.title} in {country.name}</div>
                        <div className="text-[10px] text-accent-gold font-mono">⚡ 12h Fast Delivery Available</div>
                    </div>
                    <button
                        onClick={() => window.open(whatsappUrl, '_blank')}
                        className="py-2.5 px-5 rounded-xl bg-accent-gold text-black font-heading font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shrink-0 shadow-lg shadow-accent-gold/20"
                    >
                        <MessageSquare size={14} /> Get Quote
                    </button>
                </div>
            </aside>
        </div>
    );
};

export default CountryServicePage;
