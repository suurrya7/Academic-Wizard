import React, { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { servicesData } from '../data/services';
import { countrySubjects, countryCities } from '../data/specializedPages';
import specializedContent from '../data/specializedContent.json';
import PageHeader from '../components/PageHeader';
import DefinitionBox from '../components/DefinitionBox';
import ExpertQuote from '../components/ExpertQuote';
import Button from '../components/Button';
import TrustStats from '../components/TrustStats';
import PricingCalculator from '../components/PricingCalculator';
import ContactForm from '../components/ContactForm';
import { CheckCircle, Shield, GraduationCap, FileText, ChevronDown, ChevronUp, MessageSquare, BookOpen } from 'lucide-react';
import { assetPath } from '../config/site';

const SLUG_TO_HREFLANG = {
    'uk': 'en-GB',
    'canada': 'en-CA',
    'australia': 'en-AU',
    'usa': 'en-US',
    'ireland': 'en-IE',
    'india': 'en-IN',
    'singapore': 'en-SG',
    'germany': 'en-DE'
};

const EXPERT_QUOTES = [
    { author: "Dr. Sarah Jenkins", role: "Head of Academic Excellence" },
    { author: "Prof. Michael Roberts", role: "Senior Curriculum Advisor" },
    { author: "Dr. Elena Rodriguez", role: "Director of Student Success" },
    { author: "James Chen, Ph.D.", role: "Lead Academic Strategist" },
    { author: "Dr. Aisha Patel", role: "Global Education Consultant" },
    { author: "Prof. David Thorne", role: "Chief Research Officer" },
    { author: "Dr. Laura Kim", role: "Educational Psychology Expert" }
];

const SubjectCityPage = () => {
    const { serviceSlug, countrySlug, specializedSlug } = useParams();
    const quoteIndex = Array.from(specializedSlug || '').reduce((acc, char) => acc + char.charCodeAt(0), 0) % EXPERT_QUOTES.length;
    const selectedQuote = EXPERT_QUOTES[quoteIndex];

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [specializedSlug, countrySlug, serviceSlug]);

    const service = servicesData.find(s => s.slug === serviceSlug);
    if (!service) return <Navigate to="/services" replace />;

    const country = service.countries?.find(c => c.slug === countrySlug);
    if (!country) return <Navigate to={`/services/${serviceSlug}`} replace />;

    let specializedData = null;
    let pageType = null; // 'subject' or 'city'

    const subjects = countrySubjects[countrySlug] || [];
    const cities = countryCities[countrySlug] || [];

    const subject = subjects.find(s => s.slug === specializedSlug);
    if (subject) {
        specializedData = subject;
        pageType = 'subject';
    } else {
        const city = cities.find(c => c.slug === specializedSlug);
        if (city) {
            specializedData = city;
            pageType = 'city';
        }
    }

    // If not found in our specialized data, redirect to the country page
    if (!specializedData) return <Navigate to={`/services/${serviceSlug}/${countrySlug}`} replace />;

    const pageTitle = `${specializedData.title} | Academic Wizard`;
    const pageDescription = specializedData.desc;
    const url = `https://academicwizard.online/services/${serviceSlug}/${countrySlug}/${specializedSlug}`;

    const whatsappUrl = `https://wa.me/919509893638?text=Hello%20Academic%20Wizard,%20I%20need%20help%20with%20${encodeURIComponent(specializedData.title)}`;
    
    // We can fallback to the country's faqs/guarantees if specialized data doesn't have them
    const faqsList = country.faqs || [];
    const guaranteesList = country.guarantees || [];
    const caseStudiesList = country.caseStudies || [];

    const Icon = service.icon || FileText;

    const [openFaq, setOpenFaq] = React.useState(0);

    return (
        <div className="page-specialized">
            <Helmet>
                <title>{pageTitle}</title>
                <meta name="description" content={pageDescription} />
                <link rel="canonical" href={url} />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageDescription} />
                <meta property="og:url" content={url} />
                
                {/* Hreflang alternate */}
                <link rel="alternate" hreflang="x-default" href={url} />
                <link rel="alternate" hreflang="en" href={url} />
                {service.countries?.map(c => {
                    const cSubjects = countrySubjects[c.slug] || [];
                    const cCities = countryCities[c.slug] || [];
                    const hasSpecializedSlug = cSubjects.some(s => s.slug === specializedSlug) || cCities.some(city => city.slug === specializedSlug);
                    if (hasSpecializedSlug) {
                        return (
                            <link 
                                key={c.slug}
                                rel="alternate" 
                                hreflang={SLUG_TO_HREFLANG[c.slug] || `en-${c.slug}`} 
                                href={`https://academicwizard.online/services/${serviceSlug}/${c.slug}/${specializedSlug}`} 
                            />
                        );
                    }
                    return null;
                })}
                
                {/* Service Schema */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Service",
                        "name": specializedData.title,
                        "description": pageDescription,
                        "url": url,
                        "provider": {
                            "@type": "Organization",
                            "name": "Academic Wizard",
                            "url": "https://academicwizard.online"
                        },
                        "areaServed": country.name,
                        "serviceType": service.title
                    })}
                </script>

                {/* FAQ Schema */}
                {faqsList.length > 0 && (
                    <script type="application/ld+json">
                        {JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "FAQPage",
                            "mainEntity": faqsList.map(faq => ({
                                "@type": "Question",
                                "name": faq.question,
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": (faq.answer || '').replace(/\n/g, ' ')
                                }
                            }))
                        })}
                    </script>
                )}
            </Helmet>

            <PageHeader 
                title={specializedData.title}
                description={pageDescription}
                breadcrumbs={[
                    { label: 'Services', path: '/services' },
                    { label: service.title, path: `/services/${service.slug}` },
                    { label: country.name, path: `/services/${service.slug}/${country.slug}` },
                    { label: specializedData.title, path: `/services/${service.slug}/${country.slug}/${specializedSlug}` }
                ]}
            />

            <TrustStats />

            <section className="py-20 relative">
                <div className="container px-6 max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 items-start">
                        <div className="text-left">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-gold/10 text-accent-gold font-semibold mb-6">
                                <Icon size={18} />
                                <span>{pageType === 'subject' ? 'Subject Specialization' : 'Local Support'}</span>
                            </div>
                            <h2 className="text-3xl lg:text-4xl font-bold font-heading text-white mb-6 leading-tight">
                                Expert {specializedData.title}
                            </h2>
                            <p className="text-xl text-white/80 leading-relaxed mb-6">
                                {pageType === 'subject' 
                                    ? `Are you struggling with complex modules in your ${specializedData.title.replace('Assignment Help UK', '')} coursework? Our subject-matter experts provide custom, high-quality academic support to help you achieve top grades.`
                                    : `Studying at a university in ${specializedData.title.replace('Assignment Help ', '')}? Our local experts understand your specific academic guidelines and citation requirements perfectly.`
                                }
                            </p>
                            
                            <DefinitionBox 
                                title={specializedData.title} 
                                definition={specializedData.desc} 
                            />
                            
                            <ExpertQuote 
                                quote={`Mastering ${specializedData.title} requires deep focus and specialized knowledge. Our goal is to provide you with the exact insights you need to excel.`}
                                author={selectedQuote.author}
                                role={selectedQuote.role}
                            />

                            {specializedContent[`${country.slug}-${specializedData.slug}`] && (
                                <div className="mt-8 mb-8 prose prose-invert prose-lg max-w-none prose-headings:text-accent-gold prose-a:text-accent-gold hover:prose-a:text-white"
                                     dangerouslySetInnerHTML={{ __html: specializedContent[`${country.slug}-${specializedData.slug}`] }}
                                />
                            )}
                            
                            <div className="space-y-4 mb-8">
                                {guaranteesList.slice(0, 4).map((guarantee, i) => (
                                    <div key={i} className="flex items-center gap-3 text-white/90">
                                        <CheckCircle className="text-accent-gold shrink-0" size={24} />
                                        <span>{guarantee}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-wrap gap-4">
                                <Button onClick={() => window.open(whatsappUrl, '_blank')} className="flex items-center gap-2">
                                    <MessageSquare size={20} /> Request a Quote
                                </Button>
                            </div>
                        </div>
                        <div className="relative lg:sticky lg:top-24 space-y-12 pb-12">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-accent-gold/20 to-accent-blue/20 blur-3xl rounded-full" />
                                <div className="relative glass-card p-2 rounded-2xl border-accent-gold/20">
                                    <img 
                                        src={country.image || service.image || "/images/dark-office.webp"}
                                        alt={specializedData.title}
                                        className="rounded-xl w-full h-[300px] object-cover"
                                    />
                                    <div className="absolute -bottom-6 -left-6 bg-bg-secondary p-4 rounded-xl border border-glass-border shadow-2xl flex items-center gap-3">
                                        <div className="p-2 bg-accent-gold/10 rounded-lg">
                                            <Shield className="text-accent-gold" size={20} />
                                        </div>
                                        <div>
                                            <div className="text-white font-bold font-heading text-base">Trusted Support</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="glass-card p-6 border-accent-gold/20 relative z-10">
                                <h3 className="text-2xl font-bold font-heading text-white mb-2">Request Expert Help</h3>
                                <p className="text-white/70 mb-6 text-sm">Get a free, no-obligation quote for your assignment.</p>
                                <ContactForm />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works / Process */}
            <section className="py-20 bg-bg-secondary border-t border-glass-border">
                <div className="container px-6 max-w-7xl mx-auto">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold font-heading text-white mb-6">Our Process for {specializedData.title}</h2>
                        <p className="text-white/80">A simple, transparent process designed for student success.</p>
                    </div>
                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            { title: 'Submit Requirements', desc: 'Share your assignment brief and deadline.', icon: FileText },
                            { title: 'Get a Quote', desc: 'Receive a fair, instant price quote.', icon: MessageSquare },
                            { title: 'Expert Writing', desc: 'Our specialist completes your assignment.', icon: BookOpen },
                            { title: 'Final Delivery', desc: 'Receive a polished, ready-to-submit paper.', icon: CheckCircle }
                        ].map((step, idx) => (
                            <div key={idx} className="glass-card p-6 text-center relative group hover:border-accent-gold/40 transition-colors">
                                <div className="w-16 h-16 rounded-full bg-accent-gold/10 flex items-center justify-center mx-auto mb-6 text-accent-gold group-hover:scale-110 transition-transform">
                                    <step.icon size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                                <p className="text-white/70">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="py-20 border-t border-glass-border">
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

            {/* FAQs */}
            {faqsList.length > 0 && (
                <section className="py-20 bg-bg-secondary border-t border-glass-border">
                    <div className="container px-6 max-w-4xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold font-heading text-white mb-6">
                                Frequently Asked Questions
                            </h2>
                        </div>
                        <div className="space-y-4">
                            {faqsList.map((faq, index) => (
                                <div 
                                    key={index}
                                    className={`glass-card overflow-hidden transition-all duration-300 border-accent-gold/20 ${openFaq === index ? 'shadow-[0_0_15px_rgba(255,215,0,0.1)]' : ''}`}
                                >
                                    <button 
                                        className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
                                        onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                                    >
                                        <span className="font-bold text-lg text-white/90">{faq.question}</span>
                                        <div className={`p-1 rounded-full transition-transform duration-300 ${openFaq === index ? 'bg-accent-gold text-bg-primary rotate-180' : 'text-accent-gold'}`}>
                                            <ChevronDown size={20} />
                                        </div>
                                    </button>
                                    <div 
                                        className={`px-6 transition-all duration-300 ease-in-out ${
                                            openFaq === index ? 'py-4 opacity-100' : 'max-h-0 py-0 opacity-0 overflow-hidden'
                                        }`}
                                    >
                                        <div className="text-white/70 leading-relaxed">
                                            {(faq.answer || '').split('\n').map((line, i) => {
                                                if (line.trim().startsWith('- ')) {
                                                    return <li key={i} className="ml-4 mb-2">{line.trim().substring(2)}</li>;
                                                }
                                                return <p key={i} className="mb-4 last:mb-0">{line}</p>;
                                            })}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Email Contact Form (Removed from here as it's now sticky on the right) */}
        </div>
    );
};

export default SubjectCityPage;
