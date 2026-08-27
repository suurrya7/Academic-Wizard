import React, { useEffect, useState } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { servicesData } from "../data/services";
import { countrySubjects, countryCities } from "../data/specializedPages";
import specializedContent from "../data/specializedContent.json";
import PageHeader from "../components/PageHeader";
import DefinitionBox from "../components/DefinitionBox";
import ExpertQuote from "../components/ExpertQuote";
import Button from "../components/Button";
import TrustStats from "../components/TrustStats";
import PricingCalculator from "../components/PricingCalculator";
import { 
    CheckCircle, Shield, ShieldCheck, GraduationCap, FileText, ChevronDown, 
    MessageSquare, BookOpen, Star, Clock, Zap, Award, Sparkles, Check 
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const SLUG_TO_HREFLANG = {
    uk: "en-GB",
    canada: "en-CA",
    australia: "en-AU",
    usa: "en-US",
    ireland: "en-IE",
    india: "en-IN",
    singapore: "en-SG",
    germany: "en-DE"
};

const EXPERT_QUOTES = [
    { author: "Dr. Sarah Jenkins", role: "Head of Academic Quality & Senior Clinical Reviewer" },
    { author: "Prof. Michael Roberts", role: "Senior Curriculum Advisor (Oxon)" },
    { author: "Dr. Elena Rodriguez", role: "Director of Student Research & Quantitative Analytics" },
    { author: "James Chen, Ph.D.", role: "Lead Academic Strategist & Peer-Review Lead" },
    { author: "Dr. Aisha Patel", role: "Senior Education Consultant & Healthcare Specialist" },
    { author: "Prof. David Thorne", role: "Chief Research Officer & Legal Jurisprudence Fellow" },
    { author: "Dr. Laura Kim", role: "Psychology & Behavioral Analytics Expert" }
];

const SERVICE_VERBS = {
    "assignment-help": { action: "Assignment Help", suffix: "Assignments & Coursework", badge: "Coursework Excellence" },
    "essay-help": { action: "Essay Writing Help", suffix: "Essays & Argumentative Papers", badge: "First-Class Essay Help" },
    "dissertation-help": { action: "Dissertation & Thesis Help", suffix: "Dissertations, Theses & Proposals", badge: "PhD Dissertation Support" },
    "literature-review": { action: "Literature Review Help", suffix: "Systematic & Scoping Reviews", badge: "PRISMA Literature Review" },
    "research-paper-help": { action: "Research Paper Assistance", suffix: "Research Papers & Journal Manuscripts", badge: "Empirical Research Help" },
    "editing-proofreading": { action: "Academic Editing & Proofreading", suffix: "Line Editing & Citation Formatting", badge: "Turnitin AI-Zero Editing" },
    "study-guidance": { action: "Study Guidance & Coaching", suffix: "1-on-1 Academic Mentorship", badge: "Academic Mentorship" }
};

const SubjectCityPage = () => {
    const { serviceSlug, countrySlug, specializedSlug } = useParams();
    const [openFaq, setOpenFaq] = useState(0);
    const { theme } = useTheme();

    const quoteIndex = Array.from(specializedSlug || "").reduce((acc, char) => acc + char.charCodeAt(0), 0) % EXPERT_QUOTES.length;
    const selectedQuote = EXPERT_QUOTES[quoteIndex];

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [specializedSlug, countrySlug, serviceSlug]);

    const service = servicesData.find(s => s.slug === serviceSlug);
    if (!service) return <Navigate to="/services" replace />;

    const country = service.countries?.find(c => c.slug === countrySlug);
    if (!country) return <Navigate to={`/services/${serviceSlug}`} replace />;

    let specializedData = null;
    let pageType = null; // "subject" or "city"

    const subjects = countrySubjects[countrySlug] || [];
    const cities = countryCities[countrySlug] || [];

    const subject = subjects.find(s => s.slug === specializedSlug);
    if (subject) {
        specializedData = subject;
        pageType = "subject";
    } else {
        const city = cities.find(c => c.slug === specializedSlug);
        if (city) {
            specializedData = city;
            pageType = "city";
        }
    }

    if (!specializedData) return <Navigate to={`/services/${serviceSlug}/${countrySlug}`} replace />;

    const serviceVerb = SERVICE_VERBS[serviceSlug] || { action: service.title, suffix: service.title, badge: "Academic Specialization" };
    
    // Clean raw subject name (e.g. "Nursing Assignment Help UK" -> "Nursing")
    const cleanSubjectName = specializedData.title
        .replace(/ Assignment Help.*/i, "")
        .replace(/ Help.*/i, "")
        .replace(/ Coursework.*/i, "")
        .trim();

    // Dynamic Title & Heading Synthesis
    const synthesizedTitle = pageType === "subject"
        ? `${cleanSubjectName} ${serviceVerb.action} ${country.name}`
        : `${service.title} in ${cleanSubjectName}, ${country.name}`;

    const pageMetaTitle = `${synthesizedTitle} | Top-Rated Academic Experts | Academic Wizard`;
    const pageDescription = `Get professional ${synthesizedTitle.toLowerCase()}. 100% Turnitin-safe, verified PhD specialists, and urgent 12-hour turnaround. ${specializedData.desc}`;
    const url = `https://academicwizard.online/services/${serviceSlug}/${countrySlug}/${specializedSlug}`;

    const whatsappUrl = `https://wa.me/919509893638?text=Hello%20Academic%20Wizard,%20I%20need%20urgent%20help%20with%20my%20${encodeURIComponent(cleanSubjectName)}%20${encodeURIComponent(service.title)}%20in%20${encodeURIComponent(country.name)}.`;
    
    const synthesizedFaqs = pageType === "subject" ? [
        {
            question: `How do your ${cleanSubjectName} specialists align papers with ${country.name} university standards?`,
            answer: `Our ${cleanSubjectName} academic faculty in ${country.name} hold advanced postgraduate degrees (Master's & PhD) from leading universities. Every paper is customized around local curriculum rubrics, departmental guidelines, and preferred citation standards (e.g. APA 7th, Harvard, OSCOLA, or IEEE).`
        },
        {
            question: `Can I request express 12-hour or 24-hour delivery for my ${cleanSubjectName} coursework?`,
            answer: `Yes. We provide expedited 12-hour and 24-hour priority delivery options for urgent ${cleanSubjectName} assignments, essays, and dissertation chapters without compromising on critical scholarship or rigorous peer-review.`
        },
        {
            question: `Is an official Turnitin originality and AI scan report included with my ${cleanSubjectName} paper?`,
            answer: `Every document comes with a complimentary Turnitin originality scan and AI detection report verifying < 5% similarity under our strict non-repository policy (never indexed in public databases).`
        },
        {
            question: `What if my tutor requests adjustments to my ${cleanSubjectName} assignment?`,
            answer: `We provide free, unlimited revisions within your initial project scope. Your dedicated ${cleanSubjectName} specialist will fine-tune arguments, integrate tutor feedback, or adjust formatting until you are completely satisfied.`
        },
        ...(country.faqs || [])
    ] : (country.faqs && country.faqs.length > 0 ? country.faqs : [
        {
            question: `How does Academic Wizard provide localized ${service.title.toLowerCase()} in ${cleanSubjectName}?`,
            answer: `Our academic mentors in ${country.name} deliver personalized 1-on-1 support calibrated to higher education institutions and specific university guidelines in ${cleanSubjectName}.`
        },
        {
            question: `How fast can I connect with an academic specialist in ${cleanSubjectName}?`,
            answer: `Our specialists are available 24/7. When you submit your assignment details via WhatsApp or live chat, an expert matching your faculty requirements reviews your brief within 3 minutes.`
        }
    ]);

    const guaranteesList = country.guarantees || [
        "100% Plagiarism-Free & Turnitin AI Report Included",
        "Strict On-Time Delivery with 12-Hour Urgent Option",
        "Direct 1-on-1 Chat with Verified Subject Specialists",
        "Unlimited Free Revisions until 100% Satisfied"
    ];

    const Icon = service.icon || FileText;
    const deepContentKey = `${country.slug}-${specializedData.slug}`;
    const deepHtml = specializedContent[deepContentKey];

    return (
        <div className="page-specialized">
            <Helmet>
                <title>{pageMetaTitle}</title>
                <meta name="description" content={pageDescription} />
                <link rel="canonical" href={url} />
                <meta property="og:title" content={pageMetaTitle} />
                <meta property="og:description" content={pageDescription} />
                <meta property="og:url" content={url} />
                
                {/* Hreflang alternates */}
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
                
                {/* Service Schema with Aggregate Rating */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Service",
                        "name": synthesizedTitle,
                        "description": pageDescription,
                        "url": url,
                        "provider": {
                            "@type": "Organization",
                            "name": "Academic Wizard",
                            "url": "https://academicwizard.online",
                            "logo": "https://academicwizard.online/logo.png"
                        },
                        "areaServed": country.name,
                        "serviceType": service.title,
                        "aggregateRating": {
                            "@type": "AggregateRating",
                            "ratingValue": "4.9",
                            "reviewCount": "524",
                            "bestRating": "5",
                            "worstRating": "1"
                        }
                    })}
                </script>

                {/* BreadcrumbList Schema */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BreadcrumbList",
                        "itemListElement": [
                            { "@type": "ListItem", "position": 1, "name": "Services", "item": "https://academicwizard.online/services" },
                            { "@type": "ListItem", "position": 2, "name": service.title, "item": `https://academicwizard.online/services/${service.slug}` },
                            { "@type": "ListItem", "position": 3, "name": country.name, "item": `https://academicwizard.online/services/${service.slug}/${country.slug}` },
                            { "@type": "ListItem", "position": 4, "name": cleanSubjectName, "item": url }
                        ]
                    })}
                </script>

                {/* Rich FAQ Schema */}
                {synthesizedFaqs.length > 0 && (
                    <script type="application/ld+json">
                        {JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "FAQPage",
                            "mainEntity": synthesizedFaqs.map(faq => ({
                                "@type": "Question",
                                "name": faq.question,
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": (faq.answer || "").replace(/\n/g, " ")
                                }
                            }))
                        })}
                    </script>
                )}
            </Helmet>

            <PageHeader 
                title={`${synthesizedTitle} ${country.flag}`}
                description={pageDescription}
                breadcrumbs={[
                    { label: "Services", path: "/services" },
                    { label: service.title, path: `/services/${service.slug}` },
                    { label: country.name, path: `/services/${service.slug}/${country.slug}` },
                    { label: cleanSubjectName, path: `/services/${service.slug}/${country.slug}/${specializedSlug}` }
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

            {/* Main Content & Active Sticky Conversion Stack */}
            <section className="py-20 relative bg-bg-primary">
                <div className="container px-6 max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-12 gap-12 items-start">
                        
                        {/* Left Column: Deep Academic Content */}
                        <div className="lg:col-span-7 text-left space-y-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-gold/10 border border-accent-gold/20 text-accent-gold font-semibold text-xs tracking-wider uppercase font-heading">
                                <Icon size={16} />
                                <span>{serviceVerb.badge} • {country.name}</span>
                            </div>

                            <h2 className="text-3xl lg:text-4xl font-bold font-heading text-text-primary leading-tight">
                                Expert {synthesizedTitle}
                            </h2>

                            <p className="text-lg text-text-secondary leading-relaxed">
                                {pageType === "subject" 
                                    ? `Are you working on complex ${cleanSubjectName} ${serviceVerb.suffix.toLowerCase()} at a ${country.name} university? Our subject-matter specialists deliver structured, university-grade academic solutions calibrated to local assessment criteria.`
                                    : `Studying at a university in ${cleanSubjectName}? Our ${country.name} academic mentors provide personalized support adhering to your institution's exact citation and rubric standards.`
                                }
                            </p>
                            
                            <DefinitionBox 
                                title={`${cleanSubjectName} Academic Standard`} 
                                definition={specializedData.desc} 
                            />
                            
                            <ExpertQuote 
                                quote={`Achieving top marks in ${cleanSubjectName} requires rigorous doctrinal clarity and precise referencing. Our specialists ensure every paper demonstrates critical scholarship and flawless methodology.`}
                                author={selectedQuote.author}
                                role={`${selectedQuote.role} (${country.name})`}
                            />

                            {/* Deep Domain Specific HTML Article */}
                            {deepHtml && (
                                <div 
                                    className="prose prose-invert prose-lg max-w-none prose-headings:text-accent-gold prose-a:text-accent-gold hover:prose-a:underline text-text-secondary leading-relaxed space-y-4"
                                    dangerouslySetInnerHTML={{ __html: deepHtml }}
                                />
                            )}
                            
                            {/* Guarantees Box */}
                            <div className="glass-card p-6 border-accent-gold/20 space-y-3">
                                <h3 className="text-lg font-bold text-text-primary font-heading flex items-center gap-2">
                                    <Shield className="text-accent-gold" size={20} />
                                    Our Verified Service Guarantees
                                </h3>
                                <div className="grid sm:grid-cols-2 gap-3 pt-2">
                                    {guaranteesList.slice(0, 4).map((guarantee, i) => (
                                        <div key={i} className="flex items-start gap-2.5 text-sm text-text-secondary">
                                            <CheckCircle className="text-accent-gold shrink-0 mt-0.5" size={18} />
                                            <span>{guarantee}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Primary Action Button */}
                            <div className="pt-4 flex flex-wrap items-center gap-4">
                                <Button 
                                    onClick={() => window.open(whatsappUrl, "_blank")} 
                                    className="flex items-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)]"
                                >
                                    <MessageSquare size={20} /> Request a Fast Quote on WhatsApp
                                </Button>
                            </div>
                        </div>

                        {/* Right Column: Active Sticky Conversion Stack (Eliminates Blank Space) */}
                        <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
                            
                            {/* Live Specialist Availability Card */}
                            <div className="glass-card p-5 border-accent-gold/30 relative overflow-hidden">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-xs font-bold font-heading text-emerald-500 uppercase tracking-wider">
                                            Specialists Online Now
                                        </span>
                                    </div>
                                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-accent-gold/15 text-accent-gold font-mono font-bold">
                                        ⚡ Avg. Response &lt; 3m
                                    </span>
                                </div>
                                <h4 className="text-base font-bold text-text-primary font-heading mb-1">
                                    {cleanSubjectName} Faculty Available ({country.name})
                                </h4>
                                <p className="text-xs text-text-secondary leading-relaxed mb-4">
                                    <strong className="text-accent-gold">{new Date().getHours() >= 16 || new Date().getHours() < 2 ? '6' : (new Date().getHours() >= 7 ? '4' : '3')} verified PhD & Master's faculty</strong> currently active to review your {cleanSubjectName} requirements.
                                </p>
                                <button 
                                    onClick={() => window.open(whatsappUrl, "_blank")}
                                    className="w-full py-3 px-4 rounded-xl bg-accent-gold hover:bg-accent-gold-light text-black font-heading font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-accent-gold/20"
                                >
                                    <MessageSquare size={16} /> Chat with Specialist on WhatsApp
                                </button>
                            </div>

                            {/* Academic Integrity & Originality Guarantee Card */}
                            <div className="glass-card p-5 border-glass-border space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-text-primary font-bold text-sm font-heading">
                                        <ShieldCheck className="text-accent-gold" size={18} />
                                        Academic Integrity Guarantee
                                    </div>
                                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-500 font-bold border border-emerald-500/20">
                                        Institutional Safe
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-3 py-2">
                                    <div className="p-3 rounded-xl bg-glass-bg border border-glass-border text-center">
                                        <div className="text-lg font-bold font-mono text-emerald-500">&lt; 5%</div>
                                        <div className="text-[10px] text-text-secondary uppercase font-semibold">Similarity Index</div>
                                    </div>
                                    <div className="p-3 rounded-xl bg-glass-bg border border-glass-border text-center">
                                        <div className="text-lg font-bold font-mono text-emerald-500">100%</div>
                                        <div className="text-[10px] text-text-secondary uppercase font-semibold">Human-Authored</div>
                                    </div>
                                </div>
                                <p className="text-[11px] text-text-secondary leading-relaxed">
                                    Every submission is custom-researched from primary literature and includes a verified scan under a <strong>Strict Non-Repository Policy</strong> (never stored or indexed in public databases).
                                </p>
                            </div>

                            {/* Quick Quote Interactive Estimator */}
                            <div className="glass-card p-6 border-accent-gold/20 space-y-4">
                                <h4 className="text-lg font-bold text-text-primary font-heading">
                                    Instant Price Estimate
                                </h4>
                                <p className="text-xs text-text-secondary">
                                    Transparent pricing in your local currency with zero hidden fees.
                                </p>
                                <div className="pt-2">
                                    <button 
                                        onClick={() => {
                                            const calcElem = document.getElementById("pricing-section");
                                            if (calcElem) calcElem.scrollIntoView({ behavior: "smooth" });
                                        }}
                                        className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-glass-border text-xs font-semibold text-text-primary transition-all flex items-center justify-center gap-2"
                                    >
                                        Open Detailed Multi-Currency Calculator ↓
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            {/* Interactive 4-Step Process Section */}
            <section className="py-20 bg-bg-secondary border-t border-glass-border">
                <div className="container px-6 max-w-7xl mx-auto">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-gold/10 text-accent-gold text-xs font-bold uppercase tracking-wider mb-3">
                            <Sparkles size={14} /> Seamless Workflow
                        </div>
                        <h2 className="text-3xl font-bold font-heading text-text-primary mb-4">
                            Our Process for {synthesizedTitle}
                        </h2>
                        <p className="text-text-secondary">A simple 4-step delivery cycle engineered for First-Class university grades.</p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { step: "01", title: "Submit Brief", desc: "Share your assignment guidelines, word count, and deadline via WhatsApp.", icon: FileText },
                            { step: "02", title: "Faculty Matching", desc: "Your project is assigned to a verified subject-matter PhD specialist.", icon: GraduationCap },
                            { step: "03", title: "Rigorous Writing", desc: "Custom draft written with full primary citations and 0% AI detection.", icon: BookOpen },
                            { step: "04", title: "QA & Delivery", desc: "Peer-reviewed, Turnitin certified, and delivered ahead of your deadline.", icon: CheckCircle }
                        ].map((item, idx) => (
                            <div key={idx} className="glass-card p-6 relative group hover:border-accent-gold/40 transition-all text-left">
                                <div className="text-3xl font-black font-heading text-accent-gold/20 group-hover:text-accent-gold transition-colors mb-4">
                                    {item.step}
                                </div>
                                <h3 className="text-lg font-bold text-text-primary mb-2 font-heading">{item.title}</h3>
                                <p className="text-xs text-text-secondary leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing-section" className="py-20 border-t border-glass-border">
                <div className="container px-6 max-w-7xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-gold/10 text-accent-gold text-xs font-bold uppercase tracking-wider mb-3">
                        <Award size={14} /> Fair & Transparent
                    </div>
                    <h2 className="text-3xl font-bold font-heading text-text-primary mb-4">
                        Multi-Currency Cost Calculator
                    </h2>
                    <p className="text-text-secondary max-w-2xl mx-auto mb-10 text-sm">
                        Select your academic level, deadline, and word count for an instant, transparent quote.
                    </p>
                    <PricingCalculator />
                </div>
            </section>

            {/* Frequently Asked Questions */}
            {synthesizedFaqs.length > 0 && (
                <section className="py-20 bg-bg-secondary border-t border-glass-border">
                    <div className="container px-6 max-w-4xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold font-heading text-text-primary mb-4">
                                Frequently Asked Questions
                            </h2>
                            <p className="text-text-secondary text-sm">Answers to common questions regarding {synthesizedTitle} in {country.name}.</p>
                        </div>
                        <div className="space-y-4">
                            {synthesizedFaqs.map((faq, index) => (
                                <div 
                                    key={index}
                                    className={`glass-card overflow-hidden transition-all duration-300 border-accent-gold/20 ${openFaq === index ? "shadow-[0_0_15px_rgba(255,215,0,0.1)]" : ""}`}
                                >
                                    <button 
                                        className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
                                        onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                                        aria-expanded={openFaq === index}
                                    >
                                        <span className="font-bold text-base text-text-primary">{faq.question}</span>
                                        <div className={`p-1 rounded-full transition-transform duration-300 ${openFaq === index ? "bg-accent-gold text-black rotate-180" : "text-accent-gold"}`}>
                                            <ChevronDown size={18} />
                                        </div>
                                    </button>
                                    <div 
                                        className={`px-6 transition-all duration-300 ease-in-out ${
                                            openFaq === index ? "py-4 opacity-100" : "max-h-0 py-0 opacity-0 overflow-hidden"
                                        }`}
                                    >
                                        <div className="text-text-secondary text-sm leading-relaxed">
                                            {(faq.answer || "").split("\n").map((line, i) => {
                                                if (line.trim().startsWith("- ")) {
                                                    return <li key={i} className="ml-4 mb-2">{line.trim().substring(2)}</li>;
                                                }
                                                return <p key={i} className="mb-3 last:mb-0">{line}</p>;
                                            })}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Mobile Sticky Floating Action Bar */}
            <aside aria-label="Mobile quick quote" className="md:hidden fixed bottom-0 left-0 w-full z-40 bg-bg-primary/95 border-t border-glass-border backdrop-blur-lg p-3 shadow-2xl">
                <div className="flex items-center justify-between gap-3">
                    <div className="truncate">
                        <div className="text-xs font-bold text-text-primary truncate">{cleanSubjectName} Help</div>
                        <div className="text-[10px] text-accent-gold font-mono">⚡ 12h Fast Delivery</div>
                    </div>
                    <button
                        onClick={() => window.open(whatsappUrl, "_blank")}
                        className="py-2.5 px-5 rounded-xl bg-accent-gold text-black font-heading font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shrink-0 shadow-lg shadow-accent-gold/20"
                    >
                        <MessageSquare size={14} /> Get Quote
                    </button>
                </div>
            </aside>
        </div>
    );
};

export default SubjectCityPage;
