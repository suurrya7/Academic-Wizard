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

for (const file of files) {
    const slug = file.replace(/\.html$/, '');
    const filePath = join(postsDir, file);
    let content = readFileSync(filePath, 'utf-8');

    const canonicalTarget = `/blog/${slug}/`;
    const noindexTag = '<meta name="robots" content="noindex, follow">';

    // If redirect header exists but lacks noindex, inject noindex
    if (content.includes('window.location.replace') && content.includes('/blog/')) {
        if (!content.includes('name="robots" content="noindex')) {
            content = content.replace(
                /<link rel="canonical"[^>]*>/i,
                `$&\n${noindexTag}`
            );
            writeFileSync(filePath, content, 'utf-8');
            updatedCount++;
        }
        continue;
    }

    const redirectHeader = `<script>window.location.replace("${canonicalTarget}");</script>\n<meta http-equiv="refresh" content="0; url=${canonicalTarget}">\n<link rel="canonical" href="https://academicwizard.online${canonicalTarget}">\n${noindexTag}\n\n`;

    content = redirectHeader + content;
    writeFileSync(filePath, content, 'utf-8');
    updatedCount++;
}

console.log(`✅ Successfully injected redirect headers into ${updatedCount} HTML fragments.`);
