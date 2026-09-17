import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, Navigate, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { CalendarDays, Clock, ArrowLeft, Tags } from 'lucide-react';
import { assetPath } from '../config/site';
import Breadcrumbs from '../components/Breadcrumbs';
import UrgentTriageBanner from '../components/UrgentTriageBanner';

const SERVICE_MAPPING = {
    'assignment-help': { slug: 'assignment-help', name: 'Assignment Help', verb: 'Assignments & Coursework' },
    'essay-writing': { slug: 'essay-help', name: 'Essay Writing Service', verb: 'Academic Essays' },
    'dissertation': { slug: 'dissertation-help', name: 'Dissertation & Thesis Support', verb: 'Dissertations & Theses' },
    'literature-review': { slug: 'literature-review', name: 'Literature Review Service', verb: 'Systematic Literature Reviews' },
    'research': { slug: 'research-paper-help', name: 'Research Paper Assistance', verb: 'Journal Research Papers' },
    'editing': { slug: 'editing-proofreading', name: 'Academic Proofreading & Editing', verb: 'Manuscript Editing & AI Verification' },
    'study-guidance': { slug: 'study-guidance', name: 'Study Guidance & Tutoring', verb: '1-on-1 Academic Mentorship' }
};

const COUNTRY_SLUG_MAP = {
    'UK': 'uk', 'USA': 'usa', 'Australia': 'australia', 'Canada': 'canada',
    'India': 'india', 'Ireland': 'ireland', 'Singapore': 'singapore', 'Germany': 'germany'
};

const BlogPost = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [postData, setPostData] = useState(null);
    const [htmlContent, setHtmlContent] = useState('');
    const [jsonLdSchemas, setJsonLdSchemas] = useState([]);
    const [status, setStatus] = useState('loading'); // loading, ready, error, notfound
    const contentRef = useRef(null);

    useEffect(() => {
        const cacheKey = 'aw_posts_cache';
        let cachedPosts = null;
        try {
            const raw = sessionStorage.getItem(cacheKey);
            if (raw) cachedPosts = JSON.parse(raw);
        } catch (e) {
            // Ignore
        }

        const loadPostHtml = (post) => {
            setPostData(post);
            return fetch(assetPath(`blog/posts/${slug}.html`))
                .then(res => {
                    if (!res.ok) throw new Error('Failed to fetch post HTML');
                    return res.text();
                })
                .then(html => {
                    const schemas = [];
                    let processedHtml = html.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi, (match, innerJson) => {
                        try {
                            schemas.push(JSON.parse(innerJson));
                        } catch (e) {
                            console.error('Failed to parse json-ld from blog post', e);
                        }
                        return '';
                    });

                    // Strip redirect scripts, meta/link tags, and any <h1> tags from the HTML content
                    let cleanedHtml = processedHtml
                        .replace(/<script[\s\S]*?<\/script>/gi, '')
                        .replace(/<meta[^>]*>/gi, '')
                        .replace(/<link[^>]*>/gi, '')
                        .replace(/<h1[^>]*>[\s\S]*?<\/h1>/gi, '');
                    setHtmlContent(cleanedHtml);
                    setJsonLdSchemas(schemas);
                    setStatus('ready');
                });
        };

        if (cachedPosts && Array.isArray(cachedPosts)) {
            const post = cachedPosts.find(p => p.slug === slug);
            if (post) {
                loadPostHtml(post).catch(err => {
                    console.error("Error loading blog post HTML:", err);
                    setStatus('error');
                });
                return;
            }
        }

        // Fetch post metadata from posts.json if not in cache or post not found
        fetch(assetPath('data/posts.json'))
            .then(res => res.json())
            .then(data => {
                try {
                    sessionStorage.setItem(cacheKey, JSON.stringify(data));
                } catch (e) {
                    // Quota exceeded or private browsing
                }
                const post = data.find(p => p.slug === slug);
                if (!post) {
                    setStatus('notfound');
                    return;
                }
                return loadPostHtml(post);
            })
            .catch(err => {
                console.error("Error loading blog post:", err);
                setStatus('error');
            });
    }, [slug]);

    // Intercept clicks on internal links inside the blog HTML content
    // so they use React Router navigation instead of full page reloads
    const handleContentClick = useCallback((e) => {
        const anchor = e.target.closest('a');
        if (!anchor) return;
        
        const href = anchor.getAttribute('href');
        if (!href) return;
        
        // Only intercept internal links (starting with /)
        if (href.startsWith('/')) {
            e.preventDefault();
            navigate(href);
            // Scroll to top on navigation
            window.scrollTo(0, 0);
        }
    }, [navigate]);

    if (status === 'loading') {
        return (
            <div className="pt-32 pb-24 container px-6 min-h-[60vh] flex items-center justify-center">
                <Helmet>
                    <title>{`${slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} | Academic Wizard Blog`}</title>
                    <meta name="robots" content="noindex" />
                </Helmet>
                <div className="text-white text-xl">Loading article...</div>
            </div>
        );
    }

    if (status === 'notfound' || status === 'error') {
        return <Navigate to="/blog/" replace />;
    }

    const formattedDate = postData?.date
        ? new Date(postData.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
        : 'Latest';

    const canonicalUrl = `https://academicwizard.online/blog/${postData?.slug}/`;
    const postTitle = `${postData?.title} | Academic Wizard Blog`;
    const postDescription = postData?.excerpt || postData?.title || '';

    // Article JSON-LD Schema for Google
    const authorSchema = postData?.author ? {
        "@type": "Person",
        "name": postData.author.name,
        "jobTitle": "Academic Coach & Editor",
        "worksFor": {
            "@type": "Organization",
            "name": "Academic Wizard"
        }
    } : {
        "@type": "Organization",
        "name": "Academic Wizard",
        "url": "https://academicwizard.online/"
    };

    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": postData?.title,
        "description": postDescription,
        "url": canonicalUrl,
        "datePublished": postData?.date || new Date().toISOString(),
        "dateModified": postData?.date || new Date().toISOString(),
        "author": authorSchema,
        "publisher": {
            "@type": "Organization",
            "name": "Academic Wizard",
            "url": "https://academicwizard.online/",
            "logo": "https://academicwizard.online/academic-wizard-favicon.webp",
            "sameAs": [
                "https://x.com/academic_wizz",
                "https://www.instagram.com/_academic.wizard_",
                "https://www.facebook.com/academics.wizard",
                "https://www.linkedin.com/company/academic-wizard"
            ]
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": canonicalUrl
        },
        "keywords": (postData?.keywords || []).join(', ')
    };

    const matchedService = postData?.category ? SERVICE_MAPPING[postData.category] : null;
    const countrySlug = postData?.targetCountry ? COUNTRY_SLUG_MAP[postData.targetCountry] : null;
    const regionalServiceUrl = (matchedService && countrySlug) ? `/services/${matchedService.slug}/${countrySlug}/` : null;
    const mainServiceUrl = matchedService ? `/services/${matchedService.slug}/` : '/services/';

    return (
        <div className="page-blog-post pt-32 pb-24">
            <Helmet>
                <title>{postTitle}</title>
                <meta name="description" content={postDescription} />
                <link rel="canonical" href={canonicalUrl} />
                <meta property="og:title" content={postTitle} />
                <meta property="og:description" content={postDescription} />
                <meta property="og:url" content={canonicalUrl} />
                <meta property="og:type" content="article" />
                <meta property="og:site_name" content="Academic Wizard" />
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:site" content="@academic_wizz" />
                <meta name="twitter:creator" content="@academic_wizz" />
                <meta name="twitter:title" content={postTitle} />
                <meta name="twitter:description" content={postDescription} />
                <script type="application/ld+json">
                    {JSON.stringify(articleSchema)}
                </script>
                {jsonLdSchemas.map((schema, index) => (
                    <script key={`schema-${index}`} type="application/ld+json">
                        {JSON.stringify(schema)}
                    </script>
                ))}
            </Helmet>

            <article className="container px-6 max-w-4xl mx-auto">
                <Link to="/blog/" className="inline-flex items-center gap-2 text-accent-gold hover:text-white transition-colors mb-6 font-heading uppercase text-xs tracking-widest">
                    <ArrowLeft size={16} /> Back to Blog
                </Link>

                <Breadcrumbs 
                    paths={[
                        { name: 'Home', url: '/' },
                        { name: 'Blog', url: '/blog/' },
                        { name: postData?.title, url: `/blog/${postData?.slug}/` }
                    ]} 
                />

                <header className="mb-12">
                    <div className="flex flex-wrap items-center gap-4 text-white/50 text-xs uppercase tracking-widest mb-6 font-heading">
                        <span className="flex items-center gap-2">
                            <CalendarDays size={14} />
                            {formattedDate}
                        </span>
                        <span className="flex items-center gap-2">
                            <Clock size={14} />
                            {postData?.readingTime || 7} min read
                        </span>
                        {postData?.targetCountry && postData.targetCountry !== "Global" && (
                            <span className="px-3 py-1 bg-white/10 rounded-full text-white">
                                {postData.targetCountry}
                            </span>
                        )}
                    </div>
                    
                    <h1 className="text-4xl md:text-5xl text-white mb-6 leading-tight">
                        {postData?.title}
                    </h1>
                    
                    {postData?.excerpt && (
                        <p className="text-xl text-white/70 leading-relaxed mb-8">
                            {postData.excerpt}
                        </p>
                    )}

                    <div className="flex flex-wrap gap-2 pb-8 border-b border-white/10">
                        {(postData?.keywords || []).map((keyword) => (
                            <span key={keyword} className="inline-flex items-center gap-1 rounded-md bg-white/5 px-3 py-2 text-xs text-white/60">
                                <Tags size={12} />
                                {keyword}
                            </span>
                        ))}
                    </div>
                </header>

                <UrgentTriageBanner articleTitle={postData?.title} variant="compact" />

                <div 
                    ref={contentRef}
                    onClick={handleContentClick}
                    className="prose prose-invert prose-lg max-w-none 
                               prose-headings:text-white prose-a:text-accent-gold hover:prose-a:text-white
                               prose-strong:text-white prose-ul:list-disc prose-ol:list-decimal"
                    dangerouslySetInnerHTML={{ __html: htmlContent }} 
                />

                <UrgentTriageBanner articleTitle={postData?.title} variant="full" />

                {postData?.author && (
                    <div className="mt-12 p-8 glass-card flex flex-col sm:flex-row gap-6 items-center sm:items-start text-left border-white/10">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-accent-gold to-accent-gold-light flex items-center justify-center text-black font-heading text-xl font-bold shrink-0 shadow-lg" style={{ background: 'linear-gradient(135deg, var(--accent-gold), var(--accent-gold-light))' }}>
                            {postData.author.name.split(' ').filter(n => !n.includes('.')).map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1">
                            <span className="text-[10px] uppercase tracking-[3px] font-heading text-accent-gold block mb-1" style={{ color: 'var(--accent-gold)' }}>Expert Contributor</span>
                            <h3 className="text-xl font-bold font-heading text-white mb-2">{postData.author.name}</h3>
                            <p className="text-xs text-white/50 mb-3 font-medium">{postData.author.credentials}</p>
                            <p className="text-sm text-text-secondary leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{postData.author.bio}</p>
                        </div>
                    </div>
                )}

                <div className="mt-16 pt-12 border-t border-white/10">
                    <div className="glass-card p-8 text-center rounded-2xl border-accent-gold/20">
                        <h3 className="text-2xl font-bold text-white mb-3 font-heading">
                            {matchedService 
                                ? `Need Expert Assistance with Your ${matchedService.verb}?`
                                : "Need Help with Your Academic Coursework?"}
                        </h3>
                        <p className="text-white/70 mb-6 max-w-2xl mx-auto leading-relaxed">
                            {regionalServiceUrl 
                                ? `Our verified faculty specialists provide 100% Turnitin-safe, PhD-level ${matchedService.name.toLowerCase()} tailored for university students in ${postData.targetCountry}.`
                                : "Our team of verified PhD subject specialists is ready to provide ethical guidance, meticulous editing, and research support tailored to university rubrics."}
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            {regionalServiceUrl && (
                                <Link to={regionalServiceUrl} className="btn-primary">
                                    {matchedService.name} {postData.targetCountry} →
                                </Link>
                            )}
                            <Link to={mainServiceUrl} className="btn-secondary">
                                {matchedService ? matchedService.name : "View Services"}
                            </Link>
                            <Link to="/contact/" className="btn-secondary">
                                Contact Academic Advisor
                            </Link>
                        </div>
                    </div>
                </div>
            </article>

            {/* SEO fallback: if JS doesn't execute (or during prerender snapshot), 
                Google still sees meaningful content with internal links */}
            <noscript>
                <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
                    <h2>{postData?.title}</h2>
                    <p>{postData?.excerpt}</p>
                    <p>Published: {formattedDate}</p>
                    <p>
                        <Link to="/blog/">← Back to Blog</Link> | 
                        {regionalServiceUrl && <Link to={regionalServiceUrl}> {matchedService.name} {postData.targetCountry} |</Link>}
                        <Link to={mainServiceUrl}> {matchedService ? matchedService.name : "Our Services"} |</Link> 
                        <Link to="/contact/"> Contact Us</Link>
                    </p>
                </div>
            </noscript>
        </div>
    );
};

export default BlogPost;
