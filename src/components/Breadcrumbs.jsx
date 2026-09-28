import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ChevronRight } from 'lucide-react';

/**
 * Breadcrumbs Component
 * Renders a visual breadcrumb trail and automatically injects JSON-LD BreadcrumbList schema.
 * 
 * @param {Array} paths - Array of objects { name: string, url: string }
 */
const Breadcrumbs = ({ paths, align = "left" }) => {
    if (!paths || paths.length === 0) return null;

    const alignClass = align === "center" ? "justify-center" : "justify-start";

    // Filter out items without a valid label or name
    const validPaths = (paths || []).filter(p => p && (p.name || p.label));
    if (validPaths.length === 0) return null;

    // Normalize paths array to handle both { name, url } and { label, path }
    let rawNormalized = validPaths.map(p => {
        const name = (p.name || p.label || '').trim();
        const rawUrl = p.url || p.path || '/';
        const cleanUrl = rawUrl === '/' 
            ? '/' 
            : (rawUrl.endsWith('/') ? rawUrl : `${rawUrl}/`);
        return { name, url: cleanUrl };
    }).filter(p => p.name.length > 0);

    // Ensure breadcrumb hierarchy strictly starts at Home (Position 1) per Google Search guidelines
    if (rawNormalized.length > 0 && rawNormalized[0].url !== '/') {
        rawNormalized = [{ name: 'Home', url: '/' }, ...rawNormalized];
    }

    // De-duplicate any consecutive or duplicate URLs to guarantee valid Google BreadcrumbList Schema
    const seenUrls = new Set();
    const normalizedPaths = [];
    for (const p of rawNormalized) {
        if (!seenUrls.has(p.url)) {
            seenUrls.add(p.url);
            normalizedPaths.push(p);
        }
    }

    if (normalizedPaths.length === 0) return null;

    // Generate JSON-LD Schema
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": normalizedPaths.map((path, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": path.name,
            "item": `https://academicwizard.online${path.url.startsWith('/') ? path.url : `/${path.url}`}`
        }))
    };

    return (
        <nav aria-label="Breadcrumb" className={`w-full flex items-center ${alignClass} text-xs font-heading tracking-wider uppercase text-white/50 mb-6 overflow-x-auto whitespace-nowrap hide-scrollbar`}>
            <Helmet>
                <script type="application/ld+json">
                    {JSON.stringify(breadcrumbSchema)}
                </script>
            </Helmet>
            
            <ol className="flex items-center gap-2 m-0 p-0 list-none">
                {normalizedPaths.map((path, index) => {
                    const isLast = index === normalizedPaths.length - 1;
                    
                    return (
                        <li key={index} className="flex items-center gap-2">
                            {isLast ? (
                                <span className="text-accent-gold" aria-current="page">
                                    {path.name}
                                </span>
                            ) : (
                                <>
                                    <Link 
                                        to={path.url} 
                                        className="hover:text-white transition-colors flex items-center"
                                    >
                                        {path.name}
                                    </Link>
                                    <ChevronRight size={12} className="text-white/30" />
                                </>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default Breadcrumbs;
