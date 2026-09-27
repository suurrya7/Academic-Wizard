import React, { useState, useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { dissertationTopics } from '../data/specializedPages';
import { dissertationTopicsData } from '../data/dissertationTopicsData';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import { 
    BookOpen, 
    CheckCircle, 
    Lightbulb, 
    FileText, 
    ChevronRight, 
    Copy, 
    Check, 
    Sparkles, 
    HelpCircle, 
    Layers, 
    ArrowUpRight,
    MessageCircle
} from 'lucide-react';

const DissertationTopicPage = () => {
    const { topicSlug } = useParams();
    const [copiedId, setCopiedId] = useState(null);
    const [selectedLevel, setSelectedLevel] = useState('All');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [topicSlug]);

    const topicData = dissertationTopics.find(t => t.slug === topicSlug);

    if (!topicData) {
        return <Navigate to="/blog/" replace />;
    }

    const topicsList = dissertationTopicsData[topicSlug] || [];
    const filteredTopics = selectedLevel === 'All' 
        ? topicsList 
        : topicsList.filter(t => t.level.toLowerCase().includes(selectedLevel.toLowerCase()));

    const handleCopy = (topic) => {
        const textToCopy = `Dissertation Topic: ${topic.title}\n\nAim: ${topic.aim}\n\nKey Research Questions:\n${topic.researchQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}\n\nRecommended Methodology: ${topic.methodology} (${topic.level})`;
        navigator.clipboard.writeText(textToCopy);
        setCopiedId(topic.id);
        setTimeout(() => setCopiedId(null), 2500);
    };

    const pageTitle = `Curated ${topicData.title} (2026/2027) | Academic Wizard`;
    const metaDescription = `Explore authentic 2026/2027 ${topicData.category.toLowerCase()} dissertation and thesis topics with research questions, recommended methodologies, and proposal frameworks.`;
    const url = `https://academicwizard.online/blog/dissertation-topics/${topicSlug}/`;
    const baseWhatsappUrl = `https://wa.me/919509893638?text=`;

    // ItemList Schema for rich list snippets
    const itemListSchema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": `Curated 2026/2027 ${topicData.title}`,
        "description": metaDescription,
        "numberOfItems": topicsList.length,
        "itemListElement": topicsList.map((topic, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": topic.title,
            "description": topic.aim
        }))
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": `How do I choose the best ${topicData.category} dissertation topic?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `To choose an outstanding ${topicData.category.toLowerCase()} dissertation topic, identify an unresolved empirical gap or policy debate in recent peer-reviewed journals (2023–2026), ensure your dataset or participant access is feasible within your timetable, and align your research questions with your intended postgraduate or professional career path.`
                }
            },
            {
                "@type": "Question",
                "name": "Can Academic Wizard help write my dissertation proposal?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. Our postgraduate and PhD mentors assist in drafting comprehensive dissertation proposals, including literature context, research questions, theoretical frameworks, data collection methodologies, and ethical approval compliance."
                }
            },
            {
                "@type": "Question",
                "name": "What methodologies are most valued by university examiners?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Examiners look for rigorous methodological alignment rather than novelty alone. Quantitative regression/SEM, qualitative thematic analysis (Braun & Clarke), and mixed-methods convergent designs are well-regarded when accompanied by explicit validity, reliability, and ethical disclosures."
                }
            }
        ]
    };

    return (
        <div className="page-dissertation-topic">
            <Helmet>
                <title>{pageTitle}</title>
                <meta name="description" content={metaDescription} />
                <link rel="canonical" href={url} />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={metaDescription} />
                <meta property="og:url" content={url} />
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebPage",
                        "name": pageTitle,
                        "description": metaDescription,
                        "url": url,
                        "publisher": {
                            "@type": "Organization",
                            "name": "Academic Wizard",
                            "url": "https://academicwizard.online/"
                        }
                    })}
                </script>
                <script type="application/ld+json">
                    {JSON.stringify(itemListSchema)}
                </script>
                <script type="application/ld+json">
                    {JSON.stringify(faqSchema)}
                </script>
            </Helmet>

            <PageHeader 
                title={topicData.title}
                description={`Peer-reviewed, publication-grade research topics and thesis ideas for 2026/2027 ${topicData.category} dissertations.`}
                breadcrumbs={[
                    { name: 'Home', url: '/' },
                    { name: 'Blog', url: '/blog/' },
                    { name: 'Dissertation Topics', url: '/blog/' },
                    { name: topicData.category, url: `/blog/dissertation-topics/${topicSlug}/` }
                ]}
            />

            <section className="py-16">
                <div className="container px-6 max-w-6xl mx-auto">
                    {/* Hero Strategy Banner */}
                    <div className="glass-card p-8 md:p-10 border-accent-gold/20 mb-12 relative overflow-hidden rounded-2xl bg-gradient-to-r from-bg-secondary via-bg-secondary to-accent-gold/5">
                        <div className="absolute top-0 right-0 p-8 opacity-10 text-accent-gold pointer-events-none">
                            <Lightbulb size={140} />
                        </div>
                        <div className="relative z-10 max-w-3xl">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-accent-gold/10 text-accent-gold border border-accent-gold/20 mb-4">
                                <Sparkles size={14} /> 2026/2027 Academic Research Guide
                            </span>
                            <h2 className="text-3xl md:text-4xl font-bold font-heading text-white mb-4 leading-tight">
                                High-Scoring {topicData.category} Dissertation & Thesis Ideas
                            </h2>
                            <p className="text-lg text-white/80 leading-relaxed mb-6">
                                Securing a 1st Class or High Distinction in your {topicData.category.toLowerCase()} dissertation demands a well-defined empirical gap. Each topic below includes formulated research questions, suggested methodologies, and difficulty tiers vetted by our academic faculty.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Button 
                                    onClick={() => window.open(`${baseWhatsappUrl}${encodeURIComponent(`Hello Academic Wizard, I would like guidance on choosing and structuring my ${topicData.category} dissertation topic.`)}`, '_blank')}
                                    className="flex items-center gap-2"
                                >
                                    <BookOpen size={18} /> Consult a {topicData.category} PhD Expert
                                </Button>
                                <Link to="/services/dissertation-help/">
                                    <Button variant="outline" className="flex items-center gap-2">
                                        Dissertation Services <ArrowUpRight size={16} />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Filter & Topic List Section */}
                    <div className="mb-16">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-white/10">
                            <div>
                                <h3 className="text-2xl font-bold text-white flex items-center gap-3 font-heading">
                                    <FileText className="text-accent-gold" /> 
                                    Curated Research Topics ({filteredTopics.length})
                                </h3>
                                <p className="text-text-muted text-sm mt-1">
                                    Click any topic to copy its full outline or consult our advisory faculty on study feasibility.
                                </p>
                            </div>
                            
                            {/* Academic Level Filter */}
                            <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-xl border border-white/10">
                                <span className="text-xs text-text-muted px-2 flex items-center gap-1">
                                    <Layers size={14} /> Level:
                                </span>
                                {['All', 'Master', 'PhD', 'Undergraduate'].map((lvl) => (
                                    <button
                                        key={lvl}
                                        onClick={() => setSelectedLevel(lvl)}
                                        className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
                                            selectedLevel === lvl 
                                                ? 'bg-accent-gold text-black shadow-sm font-semibold' 
                                                : 'text-white/70 hover:text-white hover:bg-white/5'
                                        }`}
                                    >
                                        {lvl === 'Master' ? "Master's" : lvl}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Topics List */}
                        <div className="space-y-6">
                            {filteredTopics.map((topic, index) => {
                                const isCopied = copiedId === topic.id;
                                const topicWhatsappMsg = `Hello Academic Wizard, I am interested in developing a dissertation proposal for this topic:\n\n"${topic.title}"\n\nCould you advise on timeline and methodology support?`;
                                
                                return (
                                    <div 
                                        key={topic.id} 
                                        className="p-6 md:p-8 bg-bg-secondary border border-glass-border rounded-2xl hover:border-accent-gold/40 transition-all duration-300 shadow-lg relative group"
                                    >
                                        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="text-xs font-mono px-2.5 py-1 bg-accent-gold/10 text-accent-gold border border-accent-gold/20 rounded-md font-semibold">
                                                    #{index + 1}
                                                </span>
                                                <span className="text-xs px-3 py-1 bg-white/5 text-white/90 border border-white/10 rounded-full font-medium">
                                                    {topic.level}
                                                </span>
                                                <span className="text-xs px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full font-medium">
                                                    {topic.methodology.split('(')[0].trim()}
                                                </span>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleCopy(topic)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-white/10 hover:border-accent-gold/40 bg-white/5 hover:bg-white/10 text-white transition-colors"
                                                    title="Copy Topic & Research Questions"
                                                >
                                                    {isCopied ? (
                                                        <>
                                                            <Check size={14} className="text-emerald-400" />
                                                            <span className="text-emerald-400 font-medium">Copied!</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Copy size={14} className="text-white/70" />
                                                            <span>Copy Outline</span>
                                                        </>
                                                    )}
                                                </button>
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    onClick={() => window.open(`${baseWhatsappUrl}${encodeURIComponent(topicWhatsappMsg)}`, '_blank')}
                                                    className="inline-flex items-center gap-1.5 text-xs py-1.5 px-3"
                                                >
                                                    <MessageCircle size={14} /> Get Proposal
                                                </Button>
                                            </div>
                                        </div>

                                        <h4 className="text-xl md:text-2xl font-bold text-white mb-3 font-heading leading-snug group-hover:text-accent-gold transition-colors">
                                            {topic.title}
                                        </h4>

                                        <p className="text-white/80 text-sm md:text-base leading-relaxed mb-6">
                                            <strong className="text-white font-semibold">Research Rationale: </strong> 
                                            {topic.aim}
                                        </p>

                                        {/* Core Research Questions */}
                                        <div className="p-4 md:p-5 bg-black/30 border border-white/5 rounded-xl mb-4">
                                            <h5 className="text-xs font-semibold uppercase tracking-wider text-accent-gold mb-3 flex items-center gap-2">
                                                <HelpCircle size={14} /> Core Research Questions
                                            </h5>
                                            <ul className="space-y-2 text-xs md:text-sm text-white/80">
                                                {topic.researchQuestions.map((q, qIdx) => (
                                                    <li key={qIdx} className="flex items-start gap-2.5">
                                                        <span className="text-accent-gold font-mono font-bold shrink-0">{qIdx + 1}.</span>
                                                        <span className="leading-relaxed">{q}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="flex flex-wrap items-center justify-between text-xs text-text-muted gap-2 pt-2 border-t border-white/5">
                                            <div>
                                                <span className="text-white/50">Full Methodology: </span>
                                                <span className="text-white/80 font-medium">{topic.methodology}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                {topic.tags.map((tag, tIdx) => (
                                                    <span key={tIdx} className="px-2 py-0.5 bg-white/5 rounded text-white/60">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Free Custom Topic Proposal Callout */}
                        <div className="mt-12 p-8 bg-gradient-to-r from-accent-gold/10 via-bg-secondary to-accent-gold/10 border border-accent-gold/30 rounded-2xl text-center space-y-4">
                            <h4 className="text-2xl font-bold font-heading text-white">
                                Need a Bespoke Topic Tailored to Your University Guidelines?
                            </h4>
                            <p className="text-white/70 max-w-2xl mx-auto text-sm md:text-base">
                                Tell us your specific module requirements, preferred theoretical model, and submission deadline. Our subject specialists will formulate 3 unique, researchable topics with preliminary reading lists free of charge.
                            </p>
                            <div className="pt-2">
                                <Button 
                                    onClick={() => window.open(`${baseWhatsappUrl}${encodeURIComponent(`Hello Academic Wizard, I would like to request 3 free bespoke topics for my ${topicData.category} dissertation.`)}`, '_blank')}
                                    className="px-8 py-3 font-semibold"
                                >
                                    Request 3 Free Custom Topics
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Academic Advice Grid */}
                    <div className="grid md:grid-cols-2 gap-8 mb-16">
                        <div className="glass-card p-8 border-glass-border">
                            <h3 className="text-xl font-bold text-white mb-6 font-heading flex items-center gap-2">
                                <CheckCircle className="text-accent-gold" size={20} />
                                Criteria for a 1st Class Topic
                            </h3>
                            <ul className="space-y-4 text-white/80 text-sm leading-relaxed">
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="text-accent-gold shrink-0 mt-0.5" size={16} /> 
                                    <span><strong>Verifiable Literature Gap:</strong> Must address an unexplored angle, conflicting finding, or novel socio-technological phenomenon.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="text-accent-gold shrink-0 mt-0.5" size={16} /> 
                                    <span><strong>Realistic Methodology:</strong> Primary data collection (surveys, interviews) or secondary archival data must be feasible within your semester deadline.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="text-accent-gold shrink-0 mt-0.5" size={16} /> 
                                    <span><strong>Theoretical Framework:</strong> Ability to map findings against recognized models (e.g. TAM, UTAUT, Resource-Based View, Transtheoretical Model).</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="text-accent-gold shrink-0 mt-0.5" size={16} /> 
                                    <span><strong>Institutional Ethics Feasibility:</strong> Minimal risk of ethical clearance rejection regarding sensitive data or vulnerable groups.</span>
                                </li>
                            </ul>
                        </div>

                        <div className="glass-card p-8 border-glass-border bg-gradient-to-br from-bg-secondary to-accent-blue/10">
                            <h3 className="text-xl font-bold text-white mb-6 font-heading flex items-center gap-2">
                                <ChevronRight className="text-accent-blue" size={20} />
                                How Academic Wizard Supports Your Research
                            </h3>
                            <ul className="space-y-4 text-white/80 text-sm leading-relaxed">
                                <li className="flex items-start gap-3">
                                    <span className="h-2 w-2 rounded-full bg-accent-blue shrink-0 mt-2"></span>
                                    <span><strong>Dissertation Proposals:</strong> Rationale, research questions, literature context, and detailed methodology protocols.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="h-2 w-2 rounded-full bg-accent-blue shrink-0 mt-2"></span>
                                    <span><strong>Systematic Literature Reviews:</strong> PRISMA protocol compliance, thematic matrices, and peer-reviewed synthesis.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="h-2 w-2 rounded-full bg-accent-blue shrink-0 mt-2"></span>
                                    <span><strong>Statistical & Qualitative Analysis:</strong> Expert guidance across SPSS, R, Python, Stata, NVivo, and MAXQDA.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="h-2 w-2 rounded-full bg-accent-blue shrink-0 mt-2"></span>
                                    <span><strong>Full Proofreading & Viva Defense Coaching:</strong> Mock oral examinations and formatting to university specifications.</span>
                                </li>
                            </ul>
                            <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between">
                                <span className="text-xs text-text-muted">Turnitin similarity report included</span>
                                <Link to="/services/dissertation-help/" className="text-accent-gold font-bold text-sm hover:underline flex items-center gap-1">
                                    Explore Dissertation Help <ArrowUpRight size={14} />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Explore Other Academic Disciplines */}
                    <div className="border-t border-white/10 pt-12">
                        <h3 className="text-xl font-bold text-white mb-6 font-heading">
                            Explore Dissertation Topics by Subject
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                            {dissertationTopics.map((item) => {
                                const isActive = item.slug === topicSlug;
                                return (
                                    <Link
                                        key={item.slug}
                                        to={`/blog/dissertation-topics/${item.slug}/`}
                                        className={`p-3.5 rounded-xl border text-center transition-all ${
                                            isActive
                                                ? 'bg-accent-gold/15 border-accent-gold text-accent-gold font-semibold shadow-sm'
                                                : 'bg-bg-secondary border-white/5 hover:border-accent-gold/40 text-white/80 hover:text-white'
                                        }`}
                                    >
                                        <div className="text-sm font-medium">{item.category}</div>
                                        <div className="text-[11px] text-text-muted mt-0.5">2026/2027 Topics</div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default DissertationTopicPage;
