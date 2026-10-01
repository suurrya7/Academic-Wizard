import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Search, CalendarDays, Clock, ArrowUpRight, Tags } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { assetPath, staticPostUrl } from '../config/site';
import { dissertationTopics } from '../data/specializedPages';

const POSTS_PER_PAGE = 9;

const categoryLabels = {
    all: 'All',
    'assignment-help': 'Assignment Help',
    'essay-writing': 'Essay Writing',
    'literature-review': 'Literature Review',
    dissertation: 'Dissertation',
    research: 'Research',
    editing: 'Editing',
    'study-guidance': 'Study Guidance',
};

function normalizePost(post) {
    const keywords = Array.isArray(post.keywords)
        ? post.keywords
        : String(post.keywords || '')
            .split(',')
            .map((keyword) => keyword.trim())
            .filter(Boolean);

    return {
        ...post,
        keywords,
        category: post.category || 'assignment-help',
        readingTime: post.readingTime || post.reading_time || 6,
    };
}

const Blog = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [posts, setPosts] = useState([]);
    const [status, setStatus] = useState('loading');
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState('all');
    const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);
    const [page, setPage] = useState(pageFromUrl > 0 ? pageFromUrl : 1);

    useEffect(() => {
        const p = parseInt(searchParams.get('page') || '1', 10);
        if (p > 0 && p !== page) {
            setPage(p);
        }
    }, [searchParams]);

    const handlePageChange = (newPage) => {
        setPage(newPage);
        const params = new URLSearchParams(searchParams);
        if (newPage === 1) {
            params.delete('page');
        } else {
            params.set('page', String(newPage));
        }
        setSearchParams(params);
        window.scrollTo({ top: 350, behavior: 'smooth' });
    };

    useEffect(() => {
        let mounted = true;
        const cacheKey = 'aw_posts_cache';

        try {
            const cached = sessionStorage.getItem(cacheKey);
            if (cached) {
                const parsed = JSON.parse(cached);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setPosts(parsed);
                    setStatus('ready');
                }
            }
        } catch (e) {
            // Ignore sessionStorage error
        }

        fetch(assetPath('data/posts.json'))
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Could not load posts: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                if (!mounted) return;
                const normalized = Array.isArray(data)
                    ? data.map(normalizePost).sort((a, b) => new Date(b.date) - new Date(a.date))
                    : [];
                setPosts(normalized);
                setStatus('ready');
                try {
                    sessionStorage.setItem(cacheKey, JSON.stringify(normalized));
                } catch (e) {
                    // SessionStorage quota exceeded or private browsing
                }
            })
            .catch(() => {
                if (!mounted) return;
                setStatus((prev) => (prev === 'ready' ? 'ready' : 'error'));
            });

        return () => {
            mounted = false;
        };
    }, []);

    const categories = useMemo(() => {
        const postCategories = new Set(posts.map((post) => post.category).filter(Boolean));
        return ['all', ...Array.from(postCategories)];
    }, [posts]);

    const filteredPosts = useMemo(() => {
        const term = query.trim().toLowerCase();
        return posts.filter((post) => {
            const matchesCategory = category === 'all' || post.category === category;
            const searchText = [
                post.title,
                post.excerpt,
                post.category,
                ...(post.keywords || []),
            ].join(' ').toLowerCase();
            return matchesCategory && (!term || searchText.includes(term));
        });
    }, [category, posts, query]);

    const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));
    const visiblePosts = filteredPosts.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

    return (
        <div className="page-blog">
            <Helmet>
                <title>Assignment Help Guides & Writing Tips | Academic Wizard</title>
                <meta name="description" content="Expert guides on assignment help, essay writing, dissertation tips, literature reviews, and study strategies. Updated weekly by PhD academics." />
                <link rel="canonical" href="https://academicwizard.online/blog/" />
                <meta property="og:title" content="Assignment Help Guides & Academic Writing Tips | Academic Wizard" />
                <meta property="og:description" content="Expert guides on assignment help, essay writing, dissertation tips, and study strategies." />
                <meta property="og:url" content="https://academicwizard.online/blog/" />
                <meta property="og:type" content="website" />
                <meta property="og:image" content="https://academicwizard.online/academic-wizard-favicon.webp" />
                <meta property="og:site_name" content="Academic Wizard" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@academic_wizz" />
                <meta name="twitter:title" content="Assignment Help Guides & Academic Writing Tips" />
                <meta name="twitter:description" content="Expert guides on assignment help, essay writing, dissertation tips, and study strategies." />
                <meta name="twitter:image" content="https://academicwizard.online/academic-wizard-favicon.webp" />
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "CollectionPage",
                        "name": "Assignment Help Guides & Academic Writing Tips",
                        "description": "Expert guides on assignment help, essay writing, dissertation tips, literature reviews, and study strategies.",
                        "url": "https://academicwizard.online/blog/",
                        "publisher": {
                            "@type": "Organization",
                            "name": "Academic Wizard",
                            "url": "https://academicwizard.online/"
                        }
                    })}
                </script>
            </Helmet>

            <PageHeader
                title="Academic Writing Guides & Study Resources"
                subtitle="Expert guides on assignment help, essay writing, literature reviews, research support, editing, and study strategy."
                breadcrumbs={[
                    { name: 'Home', url: '/' },
                    { name: 'Blog', url: '/blog/' }
                ]}
            />
            
            <section className="pt-12 pb-4 bg-bg-primary">
                <div className="container px-6 max-w-4xl mx-auto text-center">
                    <p className="text-text-secondary leading-relaxed">
                        Welcome to the Academic Wizard Blog, your daily resource for comprehensive guides, expert tips, and strategic insights designed to help university students excel. Our articles cover every phase of the academic journey—from crafting compelling essay arguments and conducting rigorous literature reviews, to mastering complex research methodologies and polishing your final dissertation. Whether you are studying in the UK, USA, Australia, or anywhere else around the globe, our expert educators share best practices to improve your writing skills, ensure adherence to strict formatting guidelines, and elevate the overall quality of your assignments.
                    </p>
                </div>
            </section>

            {/* Dissertation Topics Section — fixes orphan pages */}
            <section className="pb-8 bg-bg-primary">
                <div className="container px-6 max-w-6xl mx-auto">
                    <h3 className="text-xl font-bold font-heading text-white mb-4 text-center">📚 Dissertation Topic Ideas</h3>
                    <div className="flex flex-wrap gap-3 justify-center">
                        {dissertationTopics.map((topic) => (
                            <Link
                                key={topic.slug}
                                to={`/blog/dissertation-topics/${topic.slug}`}
                                className="glass-card px-5 py-2.5 rounded-full text-sm text-white/80 hover:text-accent-gold hover:border-accent-gold/50 transition-colors whitespace-nowrap"
                            >
                                {topic.category}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <section className="container px-6 pb-24 mt-8">
                <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between mb-10">
                    <div className="relative flex-1 max-w-2xl">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-accent-gold" size={20} />
                        <input
                            value={query}
                            onChange={(event) => {
                                setQuery(event.target.value);
                                setPage(1);
                            }}
                            className="w-full bg-white/5 border border-white/10 rounded-lg py-4 pl-14 pr-5 text-white outline-none focus:border-accent-gold transition-colors"
                            placeholder="Search articles, keywords, or topics"
                            type="search"
                        />
                    </div>

                    <div className="flex gap-3 overflow-x-auto pb-2 lg:pb-0">
                        {categories.map((item) => (
                            <button
                                key={item}
                                onClick={() => {
                                    setCategory(item);
                                    setPage(1);
                                }}
                                className={`shrink-0 rounded-lg border px-4 py-3 text-[11px] uppercase tracking-[2px] font-heading transition-all ${category === item
                                    ? 'border-accent-gold bg-accent-gold text-black'
                                    : 'border-white/10 bg-white/5 text-white/70 hover:border-accent-gold hover:text-accent-gold'
                                    }`}
                                type="button"
                            >
                                {categoryLabels[item] || item.replaceAll('-', ' ')}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Commercial Bridge Service Promotion */}
                <div className="glass-card p-6 sm:p-8 mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-accent-gold/25 rounded-2xl bg-gradient-to-r from-accent-gold/10 via-bg-secondary to-bg-primary">
                    <div className="space-y-2 max-w-2xl">
                        <span className="text-[10px] uppercase tracking-[3px] font-heading text-accent-gold font-bold block">
                            Direct Faculty Mentorship
                        </span>
                        <h2 className="text-xl sm:text-2xl font-bold font-heading text-white">
                            Need Professional Assistance With Your Coursework?
                        </h2>
                        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                            Our team of 150+ verified PhD specialists provides 100% Turnitin-safe assignment writing, dissertation guidance, and literature reviews tailored to UK, US, Australian, and global university rubrics.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3 shrink-0 w-full md:w-auto">
                        <Link to="/services/assignment-help/" className="btn-primary text-xs font-bold uppercase tracking-wider px-6 py-3">
                            Explore Services →
                        </Link>
                        <a 
                            href="https://wa.me/919509893638?text=Hello%20Academic%20Wizard!%20I%20am%20browsing%20your%20blog%20and%20need%20urgent%20coursework%20help."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-secondary text-xs font-bold uppercase tracking-wider px-6 py-3"
                        >
                            💬 Quick Quote
                        </a>
                    </div>
                </div>

                {status === 'loading' && (
                    <div className="glass-card p-12 text-center text-text-secondary" style={{ color: 'var(--text-secondary)' }}>
                        Loading latest academic guides...
                    </div>
                )}

                {status === 'error' && (
                    <div className="glass-card p-12 text-center">
                        <h2 className="text-2xl text-white mb-4">Blog posts are not available yet</h2>
                        <p className="text-text-secondary" style={{ color: 'var(--text-secondary)' }}>
                            The daily automation will publish new academic writing guides here after the first run.
                        </p>
                    </div>
                )}

                {status === 'ready' && posts.length === 0 && (
                    <div className="glass-card p-12 text-center">
                        <h2 className="text-2xl text-white mb-4">No articles published yet</h2>
                        <p className="text-text-secondary" style={{ color: 'var(--text-secondary)' }}>
                            The daily GitHub Actions automation will publish four academic writing guides after the first Gemini run.
                        </p>
                    </div>
                )}

                {status === 'ready' && posts.length > 0 && visiblePosts.length === 0 && (
                    <div className="glass-card p-12 text-center">
                        <h2 className="text-2xl text-white mb-4">No matching articles</h2>
                        <p className="text-text-secondary" style={{ color: 'var(--text-secondary)' }}>
                            Try a different search term or category.
                        </p>
                    </div>
                )}

                {visiblePosts.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {visiblePosts.map((post) => {
                                const formattedDate = post.date
                                    ? new Date(post.date).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                    })
                                    : 'Latest';

                                return (
                                    <article key={post.slug || post.url} className="glass-card p-7 flex flex-col min-h-[360px]">
                                        <div className="flex flex-wrap gap-4 text-[11px] uppercase tracking-[2px] text-white/50 mb-6">
                                            <span className="flex items-center gap-2">
                                                <CalendarDays size={14} />
                                                {formattedDate}
                                            </span>
                                            <span className="flex items-center gap-2">
                                                <Clock size={14} />
                                                {post.readingTime} min
                                            </span>
                                        </div>

                                        <h2 className="text-xl leading-snug text-white mb-4">
                                            <Link to={`/blog/${post.slug}`} className="hover:text-accent-gold transition-colors">
                                                {post.title}
                                            </Link>
                                        </h2>

                                        <p className="text-text-secondary leading-relaxed mb-6 flex-1" style={{ color: 'var(--text-secondary)' }}>
                                            {post.excerpt}
                                        </p>

                                        <div className="flex flex-wrap gap-2 mb-7">
                                            {(post.keywords || []).slice(0, 3).map((keyword) => (
                                                <span key={keyword} className="inline-flex items-center gap-1 rounded-md bg-white/5 px-3 py-2 text-xs text-white/60">
                                                    <Tags size={12} />
                                                    {keyword}
                                                </span>
                                            ))}
                                        </div>

                                        <Link
                                            to={`/blog/${post.slug}`}
                                            className="inline-flex items-center gap-2 text-accent-gold text-xs uppercase tracking-[2px] font-heading"
                                            style={{ color: 'var(--accent-gold)' }}
                                        >
                                            Read Article <ArrowUpRight size={16} />
                                        </Link>
                                    </article>
                                );
                            })}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex justify-center gap-3 mt-12">
                                {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                                    <Link
                                        key={pageNumber}
                                        to={`/blog/${pageNumber === 1 ? '' : `?page=${pageNumber}`}`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handlePageChange(pageNumber);
                                        }}
                                        className={`w-11 h-11 rounded-lg border font-heading text-sm transition-all flex items-center justify-center ${page === pageNumber
                                            ? 'border-accent-gold bg-accent-gold text-black font-bold'
                                            : 'border-white/10 bg-white/5 text-white hover:border-accent-gold'
                                            }`}
                                        aria-label={`Go to blog page ${pageNumber}`}
                                        aria-current={page === pageNumber ? 'page' : undefined}
                                    >
                                        {pageNumber}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </section>
        </div>
    );
};

export default Blog;
