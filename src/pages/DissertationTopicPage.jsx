import React, { useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { dissertationTopics } from '../data/specializedPages';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import { BookOpen, CheckCircle, Lightbulb, FileText, ChevronRight } from 'lucide-react';
import { assetPath } from '../config/site';

const DissertationTopicPage = () => {
    const { topicSlug } = useParams();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [topicSlug]);

    const topicData = dissertationTopics.find(t => t.slug === topicSlug);

    if (!topicData) {
        return <Navigate to="/blog" replace />;
    }

    const pageTitle = `100+ Free ${topicData.title} | Academic Wizard`;
    const url = `https://academicwizard.online/blog/dissertation-topics/${topicSlug}/`;
    const whatsappUrl = `https://wa.me/919509893638?text=Hello%20Academic%20Wizard,%20I%20need%20help%20with%20my%20${encodeURIComponent(topicData.category)}%20dissertation.`;

    return (
        <div className="page-dissertation-topic">
            <Helmet>
                <title>{pageTitle}</title>
                <meta name="description" content={topicData.desc} />
                <link rel="canonical" href={url} />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={topicData.desc} />
                <meta property="og:url" content={url} />
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebPage",
                        "name": pageTitle,
                        "description": topicData.desc,
                        "url": url,
                        "publisher": {
                            "@type": "Organization",
                            "name": "Academic Wizard",
                            "url": "https://academicwizard.online"
                        },
                        "breadcrumb": {
                            "@type": "BreadcrumbList",
                            "itemListElement": [
                                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://academicwizard.online" },
                                { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://academicwizard.online/blog/" },
                                { "@type": "ListItem", "position": 3, "name": topicData.category, "item": url }
                            ]
                        }
                    })}
                </script>
            </Helmet>

            <PageHeader 
                title={topicData.title}
                description={topicData.desc}
                breadcrumbs={[
                    { label: 'Blog', path: '/blog' },
                    { label: 'Dissertation Topics', path: '#' },
                    { label: topicData.category, path: `/blog/dissertation-topics/${topicSlug}` }
                ]}
            />

            <section className="py-20">
                <div className="container px-6 max-w-5xl mx-auto">
                    <div className="glass-card p-10 border-accent-gold/20 mb-12 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10 text-accent-gold">
                            <Lightbulb size={120} />
                        </div>
                        <div className="relative z-10 max-w-3xl">
                            <h2 className="text-3xl font-bold font-heading text-white mb-6">Need Inspiration for Your {topicData.category} Dissertation?</h2>
                            <p className="text-xl text-white/80 leading-relaxed mb-8">
                                Choosing the right dissertation topic is the most critical step in your final year. A strong, well-defined topic ensures you have enough literature to review, a clear research gap to address, and a manageable scope for primary or secondary research.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Button onClick={() => window.open(whatsappUrl, '_blank')} className="flex items-center gap-2">
                                    <BookOpen size={20} /> Hire a Dissertation Expert
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="mb-16">
                        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <FileText className="text-accent-gold" /> 
                            Trending {topicData.category} Topics for 2024
                        </h3>
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map((num) => (
                                <div key={num} className="p-6 bg-bg-secondary border border-glass-border rounded-xl hover:border-accent-gold/50 transition-colors">
                                    <h4 className="text-lg font-bold text-white mb-2">Example Topic {num}: The impact of modern challenges on {topicData.category.toLowerCase()} practices.</h4>
                                    <p className="text-white/70 text-sm">
                                        This study investigates the primary constraints and opportunities within the sector, analyzing current methodologies and proposing a modernized framework based on recent empirical evidence.
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 p-6 bg-accent-gold/10 border border-accent-gold/20 rounded-xl text-center">
                            <p className="text-white mb-4">Want a custom topic proposal tailored to your exact interests and university requirements?</p>
                            <Button variant="outline" onClick={() => window.open(whatsappUrl, '_blank')}>
                                Get 3 Custom Topics (Free)
                            </Button>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 mb-16">
                        <div className="glass-card p-8 border-glass-border">
                            <h3 className="text-xl font-bold text-white mb-6">What makes a good topic?</h3>
                            <ul className="space-y-4 text-white/80">
                                <li className="flex items-start gap-3"><CheckCircle className="text-accent-gold shrink-0 mt-1" size={18} /> Must address a clear research gap</li>
                                <li className="flex items-start gap-3"><CheckCircle className="text-accent-gold shrink-0 mt-1" size={18} /> Needs sufficient existing literature</li>
                                <li className="flex items-start gap-3"><CheckCircle className="text-accent-gold shrink-0 mt-1" size={18} /> Feasible within your timeframe</li>
                                <li className="flex items-start gap-3"><CheckCircle className="text-accent-gold shrink-0 mt-1" size={18} /> Access to necessary data/participants</li>
                            </ul>
                        </div>
                        <div className="glass-card p-8 border-glass-border bg-gradient-to-br from-bg-secondary to-accent-blue/10">
                            <h3 className="text-xl font-bold text-white mb-6">Our Dissertation Services</h3>
                            <ul className="space-y-4 text-white/80">
                                <li className="flex items-start gap-3"><ChevronRight className="text-accent-blue shrink-0 mt-1" size={18} /> Full Dissertation Writing</li>
                                <li className="flex items-start gap-3"><ChevronRight className="text-accent-blue shrink-0 mt-1" size={18} /> Chapter by Chapter Help</li>
                                <li className="flex items-start gap-3"><ChevronRight className="text-accent-blue shrink-0 mt-1" size={18} /> Proposal Writing</li>
                                <li className="flex items-start gap-3"><ChevronRight className="text-accent-blue shrink-0 mt-1" size={18} /> Editing & Proofreading</li>
                            </ul>
                            <Link to="/services/dissertation-help" className="mt-6 inline-block text-accent-gold font-bold hover:underline">
                                View Dissertation Services &rarr;
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default DissertationTopicPage;
