import React, { useEffect, useMemo, useState } from 'react';
import { Search, CalendarDays, Clock, ArrowUpRight, Tags } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { assetPath, staticPostUrl } from '../config/site';

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
    const [posts, setPosts] = useState([]);
    const [status, setStatus] = useState('loading');
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState('all');
    const [page, setPage] = useState(1);

    useEffect(() => {
        let mounted = true;

        fetch(assetPath('data/posts.json'), { cache: 'no-store' })
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
            })
            .catch(() => {
                if (!mounted) return;
                setStatus('error');
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
            <PageHeader
                title="Academic Blog"
                subtitle="Daily guides on assignment help, academic writing, literature reviews, research support, editing, and study strategy."
            />

            <section className="container px-6 pb-24">
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
                                            <a href={staticPostUrl(post)} className="hover:text-accent-gold transition-colors">
                                                {post.title}
                                            </a>
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

                                        <a
                                            href={staticPostUrl(post)}
                                            className="inline-flex items-center gap-2 text-accent-gold text-xs uppercase tracking-[2px] font-heading"
                                            style={{ color: 'var(--accent-gold)' }}
                                        >
                                            Read Article <ArrowUpRight size={16} />
                                        </a>
                                    </article>
                                );
                            })}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex justify-center gap-3 mt-12">
                                {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                                    <button
                                        key={pageNumber}
                                        onClick={() => setPage(pageNumber)}
                                        className={`w-11 h-11 rounded-lg border font-heading text-sm transition-all ${page === pageNumber
                                            ? 'border-accent-gold bg-accent-gold text-black'
                                            : 'border-white/10 bg-white/5 text-white hover:border-accent-gold'
                                            }`}
                                        type="button"
                                    >
                                        {pageNumber}
                                    </button>
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
