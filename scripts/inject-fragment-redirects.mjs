#!/usr/bin/env node
/**
 * inject-fragment-redirects.mjs
 * 
 * Prepends client-side redirect scripts and canonical tags to all raw blog post fragments in public/blog/posts/
 * so that if any search crawler or user visits /blog/posts/*.html directly on GitHub Pages, they are instantly
 * redirected to the canonical /blog/:slug/ route.
 */

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const projectRoot = resolve(__dirname, '..');
const postsDir = join(projectRoot, 'public', 'blog', 'posts');

const files = readdirSync(postsDir).filter(f => f.endsWith('.html'));
console.log(`Processing ${files.length} blog post HTML fragments...`);

let updatedCount = 0;

const SITE_URL = 'https://academicwizard.online';

for (const file of files) {
    const slug = file.replace(/\.html$/, '');
    const filePath = join(postsDir, file);
    let content = readFileSync(filePath, 'utf-8');

    const canonicalUrl = `${SITE_URL}/blog/${slug}/`;
    const noindexTag = '<meta name="robots" content="noindex, follow">';
    const redirectHeader = `<script>window.location.replace("${canonicalUrl}");</script>\n<meta http-equiv="refresh" content="0;url=${canonicalUrl}">\n<link rel="canonical" href="${canonicalUrl}">\n${noindexTag}\n\n`;

    // Remove any previous redirect scripts, meta, and link tags
    content = content
        .replace(/<script>window\.location\.replace\(.*?<\/script>\s*/gi, '')
        .replace(/<meta\s+http-equiv="refresh"\s+content=".*?"\s*\/?>\s*/gi, '')
        .replace(/<link\s+rel="canonical"\s+href=".*?"\s*\/?>\s*/gi, '')
        .replace(/<meta\s+name="robots"\s+content=".*?"\s*\/?>\s*/gi, '');

    content = redirectHeader + content.trimStart();
    writeFileSync(filePath, content, 'utf-8');
    updatedCount++;
}

console.log(`✅ Successfully injected redirect headers into ${updatedCount} HTML fragments.`);
