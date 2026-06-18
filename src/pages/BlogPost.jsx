import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, Navigate, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { CalendarDays, Clock, ArrowLeft, Tags } from 'lucide-react';
import { assetPath } from '../config/site';
import Breadcrumbs from '../components/Breadcrumbs';

const BlogPost = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [postData, setPostData] = useState(null);
    const [htmlContent, setHtmlContent] = useState('');
    const [status, setStatus] = useState('loading'); // loading, ready, error, notfound
    const contentRef = useRef(null);

    useEffect(() => {
        // Fetch post metadata from posts.json (prevent caching)
        fetch(assetPath('data/posts.json'), { cache: 'no-store' })
            .then(res => res.json())
            .then(data => {
                const post = data.find(p => p.slug === slug);
                if (!post) {
                    setStatus('notfound');
                    return;
                }
                setPostData(post);
                
                // Fetch the actual HTML fragment (prevent caching)
                return fetch(assetPath(`blog/posts/${slug}.html`), { cache: 'no-store' })
                    .then(res => {
                        if (!res.ok) throw new Error('Failed to fetch post HTML');
                        return res.text();
                    })
                    .then(html => {
                        // Strip any <h1> tags from the HTML content since
                        // the React component already renders the title as <h1>
                        const cleanedHtml = html.replace(/<h1[^>]*>[\s\S]*?<\/h1>/gi, '');
                        setHtmlContent(cleanedHtml);
                        setStatus('ready');
                    });
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
        return <Navigate to="/blog" replace />;
    }

    const formattedDate = postData?.date
        ? new Date(postData.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
        : 'Latest';

    const canonicalUrl = `https://academicwizard.online/blog/${postData?.slug}`;
    const postTitle = `${postData?.title} | Academic Wizard Blog`;
    const postDescription = postData?.excerpt || postData?.title || '';

    // Article JSON-LD Schema for Google
    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": postData?.title,
        "description": postDescription,
        "url": canonicalUrl,
        "datePublished": postData?.date || new Date().toISOString(),
        "dateModified": postData?.date || new Date().toISOString(),
        "author": {
            "@type": "Organization",
            "name": "Academic Wizard",
            "url": "https://academicwizard.online"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Academic Wizard",
            "url": "https://academicwizard.online"
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": canonicalUrl
        },
        "keywords": (postData?.keywords || []).join(', ')
    };

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
                <meta name="twitter:title" content={postTitle} />
                <meta name="twitter:description" content={postDescription} />
                <script type="application/ld+json">
                    {JSON.stringify(articleSchema)}
                </script>
            </Helmet>

            <article className="container px-6 max-w-4xl mx-auto">
                <Link to="/blog" className="inline-flex items-center gap-2 text-accent-gold hover:text-white transition-colors mb-6 font-heading uppercase text-xs tracking-widest">
                    <ArrowLeft size={16} /> Back to Blog
                </Link>

                <Breadcrumbs 
                    paths={[
                        { name: 'Home', url: '/' },
                        { name: 'Blog', url: '/blog' },
                        { name: postData?.title, url: `/blog/${postData?.slug}` }
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

                <div 
                    ref={contentRef}
                    onClick={handleContentClick}
                    className="prose prose-invert prose-lg max-w-none 
                               prose-headings:text-white prose-a:text-accent-gold hover:prose-a:text-white
                               prose-strong:text-white prose-ul:list-disc prose-ol:list-decimal"
                    dangerouslySetInnerHTML={{ __html: htmlContent }} 
                />

                <div className="mt-16 pt-12 border-t border-white/10">
                    <div className="glass-card p-8 text-center rounded-2xl">
                        <h3 className="text-2xl text-white mb-4">Need help with your academic writing?</h3>
                        <p className="text-white/70 mb-6 max-w-2xl mx-auto">
                            Our team of experts is ready to provide ethical guidance, editing, and research support to help you achieve your academic goals.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Link to="/contact" className="btn-primary">
                                Get Expert Help
                            </Link>
                            <Link to="/services" className="btn-secondary">
                                View Services
                            </Link>
                        </div>
                    </div>
                </div>
            </article>

            {/* SEO fallback: if JS doesn't execute (or during prerender snapshot), 
                Google still sees meaningful content with internal links */}
            <noscript>
                <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
                    <h1>{postData?.title}</h1>
                    <p>{postData?.excerpt}</p>
                    <p>Published: {formattedDate}</p>
                    <p>
                        <a href="/blog">← Back to Blog</a> | 
                        <a href="/services"> Our Services</a> | 
                        <a href="/contact"> Contact Us</a>
                    </p>
                </div>
            </noscript>
        </div>
    );
};

export default BlogPost;
