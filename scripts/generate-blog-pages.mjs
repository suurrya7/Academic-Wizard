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

    for (const post of posts) {
        const slug = post.slug;
        if (!slug) continue;

        const canonicalUrl = `${SITE_URL}/blog/${slug}`;
        const title = escapeHtml(post.title || slug.replace(/-/g, ' '));
        const description = escapeHtml(post.excerpt || post.title || '');
        const publishDate = post.date || new Date().toISOString();
        const keywords = (post.keywords || []).join(', ');

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
        "author": {
            "@type": "Organization",
            "name": "Academic Wizard",
            "url": SITE_URL
        },
        "publisher": {
            "@type": "Organization",
            "name": "Academic Wizard",
            "url": SITE_URL
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
            { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${SITE_URL}/blog` },
            { "@type": "ListItem", "position": 3, "name": post.title, "item": canonicalUrl }
        ]
    })}
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

        // Also inject a noscript block with the blog content for SEO fallback
        // Read the blog post HTML fragment if it exists
        const postHtmlPath = join(distDir, 'blog', 'posts', `${slug}.html`);
        let noscriptContent = '';
        if (existsSync(postHtmlPath)) {
            const postContent = readFileSync(postHtmlPath, 'utf-8');
            // Extract just the text content (strip script tags for safety)
            const cleanContent = postContent
                .replace(/<script[\s\S]*?<\/script>/gi, '')
                .slice(0, 5000); // First 5KB is enough for SEO
            noscriptContent = `
    <noscript>
      <article style="max-width:800px;margin:2rem auto;padding:1rem;color:#fff;font-family:sans-serif;">
        <nav><a href="/">Home</a> &gt; <a href="/blog">Blog</a> &gt; ${title}</nav>
        <h1>${title}</h1>
        <p><em>${description}</em></p>
        ${cleanContent}
        <footer>
          <p><a href="/blog">← More Articles</a> | <a href="/services">Our Services</a> | <a href="/contact">Contact Us</a></p>
        </footer>
      </article>
    </noscript>`;
        }

        // Inject noscript content after the opening <body> or the root div
        if (noscriptContent) {
            pageHtml = pageHtml.replace('<div id="root">', `${noscriptContent}\n    <div id="root">`);
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
