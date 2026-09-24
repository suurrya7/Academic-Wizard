import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { servicesData } from "../data/services";
import { countrySubjects, countryCities } from "../data/specializedPages";
import { 
    Globe, BookOpen, MapPin, Sparkles, ArrowRight, ChevronRight, 
    GraduationCap, Search, Layers, Compass, ExternalLink 
} from "lucide-react";

const COUNTRY_CONFIG = {
    uk: { name: "United Kingdom", flag: "🇬🇧", code: "UK" },
    usa: { name: "United States", flag: "🇺🇸", code: "USA" },
    australia: { name: "Australia", flag: "🇦🇺", code: "AU" },
    canada: { name: "Canada", flag: "🇨🇦", code: "CA" },
    singapore: { name: "Singapore", flag: "🇸🇬", code: "SG" },
    germany: { name: "Germany", flag: "🇩🇪", code: "DE" },
    india: { name: "India", flag: "🇮🇳", code: "IN" },
    ireland: { name: "Ireland", flag: "🇮🇪", code: "IE" }
};

const ServicesDirectory = () => {
    const [selectedService, setSelectedService] = useState("assignment-help");
    const [searchQuery, setSearchQuery] = useState("");

    const activeServiceObj = servicesData.find(s => s.slug === selectedService) || servicesData[0];
    const countries = Object.keys(COUNTRY_CONFIG);

    const canonicalUrl = "https://academicwizard.online/services/directory/";

    return (
        <div className="page-services-directory">
            <Helmet>
                <title>Academic Services Directory | All Subjects, Cities & Countries | Academic Wizard</title>
                <meta 
                    name="description" 
                    content="Browse our comprehensive directory of 1,400+ academic consulting, assignment help, essay writing, and dissertation services across the UK, USA, Australia, Canada, Singapore, and worldwide." 
                />
                <link rel="canonical" href={canonicalUrl} />
                <meta property="og:title" content="Academic Services Directory | Academic Wizard" />
                <meta property="og:description" content="Complete directory of specialized academic consulting services across 8 countries and 200+ academic disciplines." />
                <meta property="og:url" content={canonicalUrl} />

                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "CollectionPage",
                        "name": "Academic Services Directory",
                        "description": "Comprehensive index of academic guidance, assignment consulting, and dissertation support services categorized by country and discipline.",
                        "url": canonicalUrl
                    })}
                </script>
            </Helmet>

            <PageHeader
                title="Academic Services Directory"
                subtitle="Explore our comprehensive directory of specialized academic consulting, subject guidance, and regional university support."
                breadcrumbs={[
                    { name: "Home", url: "/" },
                    { name: "Services", url: "/services/" },
                    { name: "Directory", url: "/services/directory/" }
                ]}
            />

            {/* Quick Country Jump Navigation */}
            <section className="py-6 bg-bg-secondary border-b border-white/5 sticky top-20 z-20 backdrop-blur-md bg-bg-secondary/90">
                <div className="container px-6 max-w-7xl mx-auto">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div className="flex items-center gap-2 text-text-secondary text-sm font-medium">
                            <Compass className="w-4 h-4 text-accent-gold" />
                            <span>Jump to Country:</span>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            {countries.map(cSlug => {
                                const conf = COUNTRY_CONFIG[cSlug];
                                return (
                                    <a
                                        key={cSlug}
                                        href={`#country-${cSlug}`}
                                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-accent-gold/20 hover:text-accent-gold text-text-secondary border border-white/10 hover:border-accent-gold/30 transition-all flex items-center gap-1.5"
                                    >
                                        <span>{conf.flag}</span>
                                        <span>{conf.code}</span>
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* Service Filter Pills & Search Bar */}
            <section className="py-8 bg-bg-primary">
                <div className="container px-6 max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
                        {/* Service Switcher */}
                        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
                            {servicesData.map(serv => (
                                <button
                                    key={serv.slug}
                                    onClick={() => setSelectedService(serv.slug)}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                                        selectedService === serv.slug
                                            ? "bg-accent-gold text-black font-semibold shadow-lg shadow-accent-gold/20"
                                            : "bg-bg-secondary text-text-secondary hover:text-white border border-white/5 hover:border-white/15"
                                    }`}
                                >
                                    <Layers className="w-4 h-4" />
                                    {serv.title}
                                </button>
                            ))}
                        </div>

                        {/* Search Input */}
                        <div className="relative w-full md:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                            <input
                                type="text"
                                placeholder="Search subject or city..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 rounded-xl bg-bg-secondary border border-white/10 text-white placeholder-text-muted text-sm focus:outline-none focus:border-accent-gold/50 transition-all"
                            />
                        </div>
                    </div>

                    <div className="bg-accent-gold/10 border border-accent-gold/20 rounded-2xl p-4 md:p-6 mb-12 flex items-start gap-4">
                        <Sparkles className="w-6 h-6 text-accent-gold shrink-0 mt-1" />
                        <div>
                            <h3 className="text-white font-semibold mb-1">
                                Viewing: {activeServiceObj.title} Across Global Campuses
                            </h3>
                            <p className="text-text-secondary text-sm leading-relaxed">
                                Below is the full directory of localized academic pages for <strong>{activeServiceObj.title}</strong>. Click any subject or campus link for rubric-aligned guidance, grading breakdowns, and 24/7 specialist matching.
                            </p>
                        </div>
                    </div>

                    {/* Countries Directory Grid */}
                    <div className="space-y-16">
                        {countries.map(countrySlug => {
                            const conf = COUNTRY_CONFIG[countrySlug];
                            const subjects = (countrySubjects[countrySlug] || []).filter(s => 
                                !searchQuery || 
                                s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                s.slug.toLowerCase().includes(searchQuery.toLowerCase())
                            );
                            const cities = (countryCities[countrySlug] || []).filter(c => 
                                !searchQuery || 
                                c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                c.slug.toLowerCase().includes(searchQuery.toLowerCase())
                            );

                            if (searchQuery && subjects.length === 0 && cities.length === 0) {
                                return null;
                            }

                            return (
                                <div 
                                    key={countrySlug} 
                                    id={`country-${countrySlug}`}
                                    className="bg-bg-secondary/60 rounded-3xl p-6 md:p-8 border border-white/5 scroll-mt-36"
                                >
                                    {/* Country Header */}
                                    <div className="flex items-center justify-between flex-wrap gap-4 pb-6 mb-6 border-b border-white/10">
                                        <div className="flex items-center gap-3">
                                            <span className="text-3xl">{conf.flag}</span>
                                            <div>
                                                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                                    {conf.name}
                                                    <span className="text-xs font-normal px-2.5 py-0.5 rounded-full bg-accent-gold/10 text-accent-gold border border-accent-gold/20">
                                                        {subjects.length} Subjects · {cities.length} Campuses
                                                    </span>
                                                </h2>
                                                <p className="text-text-secondary text-sm">
                                                    Higher education support aligned to {conf.name} university grading rubrics
                                                </p>
                                            </div>
                                        </div>

                                        {/* Hub Links */}
                                        <div className="flex items-center gap-3">
                                            <Link
                                                to={`/services/${selectedService}/${countrySlug}/`}
                                                className="px-4 py-2 rounded-xl text-xs font-semibold bg-accent-gold/15 text-accent-gold hover:bg-accent-gold hover:text-black border border-accent-gold/30 transition-all flex items-center gap-1.5"
                                            >
                                                <span>{conf.name} Hub</span>
                                                <ArrowRight className="w-3.5 h-3.5" />
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Subjects Section */}
                                    {subjects.length > 0 && (
                                        <div className="mb-8">
                                            <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted mb-4 flex items-center gap-2">
                                                <GraduationCap className="w-4 h-4 text-accent-gold" />
                                                Subject Specializations ({subjects.length})
                                            </h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                                                {subjects.map(s => {
                                                    const cleanName = s.title
                                                        .replace(/ Assignment Help.*/i, "")
                                                        .replace(/ Help.*/i, "")
                                                        .replace(/ Coursework.*/i, "")
                                                        .trim();
                                                    return (
                                                        <Link
                                                            key={s.slug}
                                                            to={`/services/${selectedService}/${countrySlug}/${s.slug}/`}
                                                            className="group p-3 rounded-xl bg-bg-primary/70 hover:bg-white/10 border border-white/5 hover:border-accent-gold/30 transition-all flex items-center justify-between gap-2"
                                                        >
                                                            <div className="min-w-0">
                                                                <div className="text-sm font-medium text-white group-hover:text-accent-gold truncate transition-colors">
                                                                    {cleanName}
                                                                </div>
                                                                <div className="text-xs text-text-muted truncate">
                                                                    {s.targetKeyword}
                                                                </div>
                                                            </div>
                                                            <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-accent-gold group-hover:translate-x-0.5 transition-all shrink-0" />
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* Cities / Campus Hubs Section */}
                                    {cities.length > 0 && (
                                        <div>
                                            <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted mb-4 flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-accent-gold" />
                                                University Cities & Regions ({cities.length})
                                            </h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                                                {cities.map(c => {
                                                    const cleanCity = c.title
                                                        .replace(/^Assignment Help\s+/i, "")
                                                        .replace(/^Essay Help\s+/i, "")
                                                        .replace(/^Dissertation Help\s+/i, "")
                                                        .replace(/ Help.*/i, "")
                                                        .trim();
                                                    return (
                                                        <Link
                                                            key={c.slug}
                                                            to={`/services/${selectedService}/${countrySlug}/${c.slug}/`}
                                                            className="group p-3 rounded-xl bg-bg-primary/70 hover:bg-white/10 border border-white/5 hover:border-accent-gold/30 transition-all flex items-center justify-between gap-2"
                                                        >
                                                            <div className="min-w-0">
                                                                <div className="text-sm font-medium text-white group-hover:text-accent-gold truncate transition-colors">
                                                                    {cleanCity}
                                                                </div>
                                                                <div className="text-xs text-text-muted truncate">
                                                                    {conf.name}
                                                                </div>
                                                            </div>
                                                            <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-accent-gold group-hover:translate-x-0.5 transition-all shrink-0" />
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Comprehensive Static Crawl Matrix for All 7 Services (Guarantees Googlebot 100% Crawl Access) */}
                    <div className="mt-16 pt-12 border-t border-white/10">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Layers className="w-5 h-5 text-accent-gold" />
                            Comprehensive Global Services Index
                        </h2>
                        <p className="text-text-secondary text-sm mb-8">
                            Direct reference links to our 7 core academic advisory categories across each supported country hub:
                        </p>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {servicesData.map(serv => (
                                <div key={serv.slug} className="p-4 rounded-2xl bg-bg-secondary/40 border border-white/5">
                                    <h3 className="font-semibold text-white mb-2 text-sm flex items-center justify-between">
                                        <span>{serv.title}</span>
                                        <Link to={`/services/${serv.slug}/`} className="text-accent-gold hover:underline text-xs flex items-center gap-1">
                                            <span>Overview</span>
                                            <ExternalLink className="w-3 h-3" />
                                        </Link>
                                    </h3>
                                    <ul className="space-y-1.5 text-xs">
                                        {countries.map(cSlug => {
                                            const conf = COUNTRY_CONFIG[cSlug];
                                            return (
                                                <li key={cSlug}>
                                                    <Link 
                                                        to={`/services/${serv.slug}/${cSlug}/`}
                                                        className="text-text-secondary hover:text-accent-gold transition-colors flex items-center gap-1.5"
                                                    >
                                                        <span>{conf.flag}</span>
                                                        <span>{conf.name}</span>
                                                    </Link>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ServicesDirectory;
