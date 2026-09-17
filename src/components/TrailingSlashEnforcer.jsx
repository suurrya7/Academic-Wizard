import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * TrailingSlashEnforcer
 * 
 * Ensures all internal routes strictly adhere to canonical trailing slashes (e.g. /services/assignment-help/uk/psychology/).
 * This prevents Google Search Console from indexing both /path and /path/, eliminating URL dilution and splitting ranking signals.
 */
const TrailingSlashEnforcer = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const { pathname, search, hash } = location;

        // Skip root "/" or paths that already end with "/"
        if (pathname === '/' || pathname.endsWith('/')) {
            return;
        }

        // Skip static files with extensions (.html, .xml, .txt, .png, .jpg, .webp, .svg, .json, .pdf)
        const lastSegment = pathname.split('/').pop() || '';
        if (lastSegment.includes('.')) {
            return;
        }

        // Seamlessly replace the browser history entry with the canonical trailing-slash URL
        const canonicalPath = `${pathname}/${search}${hash}`;
        navigate(canonicalPath, { replace: true });
    }, [location, navigate]);

    return null;
};

export default TrailingSlashEnforcer;
