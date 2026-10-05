#!/usr/bin/env node
/**
 * generate-blog-pages.mjs
 * 
 * Post-build script that creates prerendered-like HTML pages for each blog post.
 * 
 * Problem: The Puppeteer prerenderer can't prerender blog posts because BlogPost.jsx
 * fetches content via async fetch() which doesn't complete before the snapshot.
 * 
 * Solution: This script reads the base index.html, reads posts.json, and for each
 * blog post generates a dist/blog/[slug]/index.html with proper SEO meta tags
 * injected into the <head>. This way Google sees unique titles, descriptions,
 * canonical URLs, and JSON-LD schema for each blog post without needing JS.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const projectRoot = resolve(__dirname, '..');
const distDir = join(projectRoot, 'dist');
const postsJsonPath = join(distDir, 'data', 'posts.json');
const baseHtmlPath = join(distDir, 'index.html');

const SITE_URL = 'https://academicwizard.online';

function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function generateBlogPages() {
    if (!existsSync(postsJsonPath)) {
        console.warn('⚠️  posts.json not found, skipping blog page generation');
        return;
    }

    if (!existsSync(baseHtmlPath)) {
        console.warn('⚠️  dist/index.html not found, skipping blog page generation');
        return;
    }

    const posts = JSON.parse(readFileSync(postsJsonPath, 'utf-8'));
    const baseHtml = readFileSync(baseHtmlPath, 'utf-8');

    let generated = 0;

    // Canonical overrides: blog posts that cannibalize service pages
    // MUST match the exact same map in src/pages/BlogPost.jsx (lines 151-160)
    const CANONICAL_OVERRIDES = {
        'mastering-assignment-help-a-guide-for-usa-university-students': '/services/assignment-help/usa/',
        'assignment-help-in-the-uk-what-every-student-should-know': '/services/assignment-help/uk/',
        'the-complete-guide-to-essay-help-for-university-students': '/services/essay-help/',
        'how-to-get-reliable-assignment-help-in-australia': '/services/assignment-help/australia/',
        'the-ultimate-guide-to-dissertation-writing-services': '/services/dissertation-help/',
        'literature-review-writing-guide-for-graduate-students': '/services/literature-review/',
        'professional-editing-and-proofreading-for-academic-papers': '/services/editing-proofreading/',
        'research-paper-writing-tips-for-college-students': '/services/research-paper-help/',
    };

    for (const post of posts) {
        const slug = post.slug;
        if (!slug) continue;

        const overrideCanonical = CANONICAL_OVERRIDES[slug];
        const canonicalUrl = overrideCanonical
            ? `${SITE_URL}${overrideCanonical}`
            : `${SITE_URL}/blog/${slug}/`;
        const title = escapeHtml(post.title || slug.replace(/-/g, ' '));
        const description = escapeHtml(post.excerpt || post.title || '');
        const publishDate = post.date || new Date().toISOString();
        const keywords = (post.keywords || []).join(', ');

        const authorSchema = post.author ? {
            "@type": "Person",
            "name": post.author.name,
            "jobTitle": "Academic Coach & Editor",
            "worksFor": {
                "@type": "Organization",
                "name": "Academic Wizard"
            }
        } : {
            "@type": "Organization",
            "name": "Academic Wizard",
            "url": `${SITE_URL}/`
        };

        // Check if blog post HTML fragment exists to extract or synthesize FAQs
        const postHtmlPath = join(distDir, 'blog', 'posts', `${slug}.html`);
        const postFaqs = [];
        if (existsSync(postHtmlPath)) {
            const rawHtml = readFileSync(postHtmlPath, 'utf-8');
            const faqMatches = [...rawHtml.matchAll(/<h3>(.*?)<\/h3>\s*<p>(.*?)<\/p>/gi)];
            for (const match of faqMatches) {
                const q = match[1].replace(/<[^>]*>/g, '').trim();
                const a = match[2].replace(/<[^>]*>/g, '').trim();
                if (q && a && (q.endsWith('?') || /^(how|what|why|can|is|which|where)/i.test(q))) {
                    postFaqs.push({ question: q, answer: a });
                }
            }
        }

        if (postFaqs.length === 0) {
            postFaqs.push(
                {
                    question: `What are the key academic takeaways from "${post.title}"?`,
                    answer: post.excerpt || `This guide outlines key methodology, research structure, and writing standards for university students.`
                },
                {
                    question: `How does Academic Wizard assist students with this topic?`,
                    answer: `Academic Wizard offers 1-on-1 academic coaching, structural reviews, and proofreading tailored to UK, US, Australian, and global university criteria.`
                },
                {
                    question: `Which citation and formatting standards apply?`,
                    answer: `Our academic specialists format papers according to APA 7th, Harvard, OSCOLA, MLA 9th, Chicago, IEEE, and Vancouver guidelines.`
                }
            );
        }

        const faqSchema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": postFaqs.map(f => ({
                "@type": "Question",
                "name": f.question,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": f.answer
                }
            }))
        };

        // Build SEO meta tags to inject
        const seoTags = `
    <title>${title} | Academic Wizard Blog</title>
    <meta name="description" content="${description}" />
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:title" content="${title} | Academic Wizard Blog" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="Academic Wizard" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:site" content="@academic_wizz" />
    <meta name="twitter:creator" content="@academic_wizz" />
    <meta name="twitter:title" content="${title} | Academic Wizard Blog" />
    <meta name="twitter:description" content="${description}" />
    ${keywords ? `<meta name="keywords" content="${escapeHtml(keywords)}" />` : ''}
    <script type="application/ld+json">
    ${JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": post.title,
        "description": post.excerpt || post.title,
        "url": canonicalUrl,
        "datePublished": publishDate,
        "dateModified": publishDate,
        "author": authorSchema,
        "publisher": {
            "@type": "Organization",
            "name": "Academic Wizard",
            "url": `${SITE_URL}/`,
            "logo": `${SITE_URL}/academic-wizard-favicon.webp`,
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
        "keywords": keywords
    })}
    </script>
    <script type="application/ld+json">
    ${JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": `${SITE_URL}/` },
            { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${SITE_URL}/blog/` },
            { "@type": "ListItem", "position": 3, "name": post.title, "item": canonicalUrl }
        ]
    })}
    </script>
    <script type="application/ld+json">
    ${JSON.stringify(faqSchema)}
    </script>`;

        // Inject SEO tags right before </head> and replace the existing <title>
        let pageHtml = baseHtml;
        
        // Remove the existing homepage title tags
        pageHtml = pageHtml.replace(/<title>[^<]*<\/title>/g, '');
        
        // Remove any existing homepage meta descriptions 
        pageHtml = pageHtml.replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/g, '');

        // Remove existing homepage canonical links
        pageHtml = pageHtml.replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/g, '');

        // Remove existing homepage OG tags
        pageHtml = pageHtml.replace(/<meta\s+property="og:[^"]*"\s+content="[^"]*"\s*\/?>/g, '');

        // Remove existing homepage twitter tags
        pageHtml = pageHtml.replace(/<meta\s+name="twitter:[^"]*"\s+content="[^"]*"\s*\/?>/g, '');

        // Inject our SEO tags before </head>
        pageHtml = pageHtml.replace('</head>', `${seoTags}\n  </head>`);

        // Inject static blog article content directly inside <div id="root">
        // This ensures Googlebot renders the complete article without ignoring noscript tags
        let staticArticleContent = '';
        if (existsSync(postHtmlPath)) {
            const postContent = readFileSync(postHtmlPath, 'utf-8');
            // Extract clean content (strip script, meta, and link tags)
            const cleanContent = postContent
                .replace(/<script[\s\S]*?<\/script>/gi, '')
                .replace(/<meta[^>]*>/gi, '')
                .replace(/<link[^>]*>/gi, '')
                .trim();
            staticArticleContent = `
      <article class="prerendered-blog-article" style="max-width:860px;margin:2rem auto;padding:1.5rem;color:#e2e8f0;font-family:system-ui,-apple-system,sans-serif;line-height:1.75;">
        <nav aria-label="Breadcrumb" style="font-size:0.875rem;margin-bottom:1.5rem;color:#94a3b8;"><a href="/" style="color:#60a5fa;text-decoration:none;">Home</a> &gt; <a href="/blog/" style="color:#60a5fa;text-decoration:none;">Blog</a> &gt; <span style="color:#cbd5e1;">${title}</span></nav>
        <header style="margin-bottom:2rem;">
          <h1 style="font-size:2.25rem;font-weight:700;line-height:1.25;color:#f8fafc;margin-bottom:1rem;">${title}</h1>
          <p style="font-size:1.125rem;color:#94a3b8;font-style:italic;margin-bottom:1rem;">${description}</p>
          ${post.author ? `<div style="display:flex;gap:0.75rem;align-items:center;padding:0.75rem 0;border-top:1px solid #334155;border-bottom:1px solid #334155;color:#cbd5e1;font-size:0.875rem;"><strong>By ${escapeHtml(post.author.name)}</strong> · ${escapeHtml(post.author.credentials)} · Published: ${new Date(publishDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>` : ''}
        </header>
        <div class="article-body">
          ${cleanContent}
        </div>
        ${post.author ? `
        <div style="margin-top:2.5rem;padding:1.5rem;border:1px solid #334155;background:#0f172a;border-radius:12px;">
          <h3 style="font-size:1.125rem;color:#f8fafc;margin-bottom:0.5rem;">About the Author</h3>
          <p style="font-weight:600;color:#60a5fa;margin-bottom:0.25rem;">${escapeHtml(post.author.name)} <span style="font-size:0.875rem;color:#94a3b8;">(${escapeHtml(post.author.credentials)})</span></p>
          <p style="font-size:0.875rem;color:#94a3b8;line-height:1.6;">${escapeHtml(post.author.bio)}</p>
        </div>` : ''}
        <footer style="margin-top:2.5rem;padding-top:1.5rem;border-top:1px solid #334155;font-size:0.875rem;color:#94a3b8;display:flex;justify-content:space-between;flex-wrap:wrap;gap:1rem;">
          <a href="/blog/" style="color:#60a5fa;text-decoration:none;">← Return to All Articles</a>
          <a href="/services/assignment-help/" style="color:#60a5fa;text-decoration:none;">University Assignment Help →</a>
          <a href="https://wa.me/919509893638" style="color:#34d399;text-decoration:none;font-weight:600;">Chat on WhatsApp 24/7</a>
        </footer>
      </article>`;
        }

        // Inject content directly inside <div id="root"> for full Googlebot DOM rendering
        if (staticArticleContent) {
            pageHtml = pageHtml.replace('<div id="root"></div>', `<div id="root">${staticArticleContent}\n</div>`);
            if (!pageHtml.includes('class="prerendered-blog-article"')) {
                pageHtml = pageHtml.replace('<div id="root">', `<div id="root">\n${staticArticleContent}`);
            }
        }

        // Write to dist/blog/[slug]/index.html
        const outputDir = join(distDir, 'blog', slug);
        mkdirSync(outputDir, { recursive: true });
        writeFileSync(join(outputDir, 'index.html'), pageHtml, 'utf-8');
        generated++;
    }

    console.log(`✅ Generated ${generated} blog post pages with SEO meta tags`);
}

// Also remove blog routes from prerenderer since we handle them ourselves
generateBlogPages();
