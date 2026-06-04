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
const Breadcrumbs = ({ paths }) => {
    if (!paths || paths.length === 0) return null;

    // Generate JSON-LD Schema
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": paths.map((path, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": path.name,
            "item": `https://academicwizard.online${path.url}`
        }))
    };

    return (
        <nav aria-label="Breadcrumb" className="w-full flex items-center text-xs font-heading tracking-wider uppercase text-white/50 mb-6 overflow-x-auto whitespace-nowrap hide-scrollbar">
            <Helmet>
                <script type="application/ld+json">
                    {JSON.stringify(breadcrumbSchema)}
                </script>
            </Helmet>
            
            <ol className="flex items-center gap-2 m-0 p-0 list-none">
                {paths.map((path, index) => {
                    const isLast = index === paths.length - 1;
                    
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
