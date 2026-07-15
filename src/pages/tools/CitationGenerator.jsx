import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import PageHeader from '../../components/PageHeader';
import Button from '../../components/Button';
import { Copy, Trash2, Plus, Download, Check } from 'lucide-react';

const CitationGenerator = () => {
    const [sourceType, setSourceType] = useState('website'); // website, journal, book
    const [style, setStyle] = useState('apa'); // apa, mla, harvard, chicago, ieee, vancouver
    
    // Form fields
    const [authors, setAuthors] = useState('');
    const [title, setTitle] = useState('');
    const [containerTitle, setContainerTitle] = useState(''); // website name, journal name
    const [publisher, setPublisher] = useState('');
    const [pubDate, setPubDate] = useState('');
    const [accessDate, setAccessDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    });
    const [url, setUrl] = useState('');
    const [volume, setVolume] = useState('');
    const [issue, setIssue] = useState('');
    const [pages, setPages] = useState('');
    const [edition, setEdition] = useState('');
    const [doi, setDoi] = useState('');

    // Generated citation state
    const [citation, setCitation] = useState({ bib: '', intext: '' });
    const [copiedBib, setCopiedBib] = useState(false);
    const [copiedIntext, setCopiedIntext] = useState(false);

    // Bibliography state
    const [bibliography, setBibliography] = useState(() => {
        const saved = localStorage.getItem('academic_wizard_bibliography');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('academic_wizard_bibliography', JSON.stringify(bibliography));
    }, [bibliography]);

    // Helper to format authors
    const parseAuthors = (authorStr) => {
        if (!authorStr.trim()) return [];
        return authorStr.split(',').map(name => name.trim()).filter(Boolean);
    };

    const getLastName = (fullName) => {
        const parts = fullName.split(' ');
        return parts[parts.length - 1] || '';
    };

    const getInitials = (fullName) => {
        const parts = fullName.split(' ');
        if (parts.length <= 1) return '';
        return parts.slice(0, parts.length - 1).map(p => p[0] + '.').join(' ');
    };

    // Reference logic calculations
    useEffect(() => {
        const authorList = parseAuthors(authors);
        const year = pubDate ? new Date(pubDate).getFullYear() || pubDate : 'n.d.';
        
        let bibHTML = '';
        let intextText = '';

        // Determine Index for numeric styles
        const bibIndex = bibliography.length + 1;

        if (style === 'apa') {
            // APA 7th Edition
            let authorFormatted = '';
            if (authorList.length === 0) {
                authorFormatted = 'Anonymous';
            } else if (authorList.length === 1) {
                const name = authorList[0];
                authorFormatted = `${getLastName(name)}, ${getInitials(name)}`;
            } else if (authorList.length === 2) {
                const name1 = authorList[0];
                const name2 = authorList[1];
                authorFormatted = `${getLastName(name1)}, ${getInitials(name1)} & ${getLastName(name2)}, ${getInitials(name2)}`;
            } else {
                const name = authorList[0];
                authorFormatted = `${getLastName(name)}, ${getInitials(name)}, et al.`;
            }

            if (sourceType === 'website') {
                const formattedDate = pubDate ? pubDate : 'n.d.';
                bibHTML = `${authorFormatted} (${formattedDate}). <em>${title || 'Untitled Page'}</em>. ${containerTitle || 'Website'}. <a href="${url}" target="_blank" class="text-accent-gold underline">${url || 'URL'}</a>`;
                intextText = authorList.length > 0 ? `(${getLastName(authorList[0])}, ${year})` : `(Anonymous, ${year})`;
            } else if (sourceType === 'journal') {
                bibHTML = `${authorFormatted} (${year}). ${title || 'Untitled Article'}. <em>${containerTitle || 'Journal Name'}</em>`;
                if (volume) bibHTML += `, <em>${volume}</em>`;
                if (issue) bibHTML += `(${issue})`;
                if (pages) bibHTML += `, ${pages}`;
                if (doi) bibHTML += `. https://doi.org/${doi}`;
                else if (url) bibHTML += `. <a href="${url}" target="_blank" class="text-accent-gold underline">${url}</a>`;
                
                intextText = authorList.length > 0 ? `(${getLastName(authorList[0])}, ${year})` : `(Anonymous, ${year})`;
            } else if (sourceType === 'book') {
                bibHTML = `${authorFormatted} (${year}). <em>${title || 'Untitled Book'}</em>`;
                if (edition) bibHTML += ` (${edition} ed.)`;
                if (publisher) bibHTML += `. ${publisher}`;
                
                intextText = authorList.length > 0 ? `(${getLastName(authorList[0])}, ${year})` : `(Anonymous, ${year})`;
            }
        } 
        else if (style === 'mla') {
            // MLA 9th Edition
            let authorFormatted = '';
            if (authorList.length === 1) {
                authorFormatted = `${getLastName(authorList[0])}, ${authorList[0].split(' ')[0] || ''}.`;
            } else if (authorList.length === 2) {
                authorFormatted = `${getLastName(authorList[0])}, ${authorList[0].split(' ')[0] || ''}, and ${authorList[1]}.`;
            } else if (authorList.length > 2) {
                authorFormatted = `${getLastName(authorList[0])}, ${authorList[0].split(' ')[0] || ''}, et al.`;
            }

            if (sourceType === 'website') {
                bibHTML = `${authorFormatted ? authorFormatted + ' ' : ''}"${title || 'Untitled Page'}." <em>${containerTitle || 'Website Name'}</em>`;
                if (publisher) bibHTML += `, ${publisher}`;
                if (pubDate) bibHTML += `, ${pubDate}`;
                if (url) bibHTML += `, <a href="${url}" target="_blank" class="text-accent-gold underline">${url}</a>`;
                if (accessDate) bibHTML += `. Accessed ${accessDate}`;

                intextText = authorList.length > 0 ? `(${getLastName(authorList[0])})` : `("${title ? title.substring(0, 15) + '...' : 'Untitled'}")`;
            } else if (sourceType === 'journal') {
                bibHTML = `${authorFormatted ? authorFormatted + ' ' : ''}"${title || 'Untitled Article'}." <em>${containerTitle || 'Journal Name'}</em>`;
                if (volume) bibHTML += `, vol. ${volume}`;
                if (issue) bibHTML += `, no. ${issue}`;
                if (year) bibHTML += `, ${year}`;
                if (pages) bibHTML += `, pp. ${pages}`;
                if (doi) bibHTML += `, https://doi.org/${doi}`;
                else if (url) bibHTML += `, <a href="${url}" target="_blank" class="text-accent-gold underline">${url}</a>`;

                intextText = authorList.length > 0 ? `(${getLastName(authorList[0])})` : `("${title ? title.substring(0, 15) + '...' : 'Untitled'}")`;
            } else if (sourceType === 'book') {
                bibHTML = `${authorFormatted ? authorFormatted + ' ' : ''}<em>${title || 'Untitled Book'}</em>`;
                if (edition) bibHTML += `, ${edition} ed.`;
                if (publisher) bibHTML += `, ${publisher}`;
                if (year) bibHTML += `, ${year}`;

                intextText = authorList.length > 0 ? `(${getLastName(authorList[0])})` : `(Anonymous)`;
            }
        }
        else if (style === 'harvard') {
            // Harvard Style
            let authorFormatted = '';
            if (authorList.length === 1) {
                authorFormatted = `${getLastName(authorList[0])}, ${getInitials(authorList[0])[0] || ''}.`;
            } else if (authorList.length === 2) {
                authorFormatted = `${getLastName(authorList[0])}, ${getInitials(authorList[0])[0] || ''}. and ${getLastName(authorList[1])}, ${getInitials(authorList[1])[0] || ''}.`;
            } else if (authorList.length > 2) {
                authorFormatted = `${getLastName(authorList[0])}, ${getInitials(authorList[0])[0] || ''}. et al.`;
            }

            if (sourceType === 'website') {
                bibHTML = `${authorFormatted ? authorFormatted + ' ' : ''}${year}. <em>${title || 'Untitled Page'}</em>. ${containerTitle || 'Website Name'}. Available at: <a href="${url}" target="_blank" class="text-accent-gold underline">${url || 'URL'}</a> [Accessed ${accessDate}].`;
                intextText = authorList.length > 0 ? `(${getLastName(authorList[0])}, ${year})` : `(Anonymous, ${year})`;
            } else if (sourceType === 'journal') {
                bibHTML = `${authorFormatted ? authorFormatted + ' ' : ''}${year}. '${title || 'Untitled Article'}'. <em>${containerTitle || 'Journal Name'}</em>, ${volume || 'Vol'}(${issue || 'Issue'})`;
                if (pages) bibHTML += `, pp. ${pages}`;
                
                intextText = authorList.length > 0 ? `(${getLastName(authorList[0])}, ${year})` : `(Anonymous, ${year})`;
            } else if (sourceType === 'book') {
                bibHTML = `${authorFormatted ? authorFormatted + ' ' : ''}${year}. <em>${title || 'Untitled Book'}</em>.`;
                if (edition) bibHTML += ` ${edition} ed.`;
                if (publisher) bibHTML += ` ${publisher}`;

                intextText = authorList.length > 0 ? `(${getLastName(authorList[0])}, ${year})` : `(Anonymous, ${year})`;
            }
        }
        else if (style === 'chicago') {
            // Chicago (Author-Date)
            let authorFormatted = '';
            if (authorList.length === 1) {
                authorFormatted = `${getLastName(authorList[0])}, ${authorList[0].split(' ')[0] || ''}.`;
            } else if (authorList.length === 2) {
                authorFormatted = `${getLastName(authorList[0])}, ${authorList[0].split(' ')[0] || ''}, and ${authorList[1]}.`;
            } else if (authorList.length > 2) {
                authorFormatted = `${getLastName(authorList[0])}, ${authorList[0].split(' ')[0] || ''}, et al.`;
            }

            if (sourceType === 'website') {
                bibHTML = `${authorFormatted ? authorFormatted + ' ' : ''}${year}. "${title || 'Untitled Page'}." ${containerTitle || 'Website Name'}. ${pubDate || ''}. <a href="${url}" target="_blank" class="text-accent-gold underline">${url}</a>.`;
                intextText = authorList.length > 0 ? `(${getLastName(authorList[0])} ${year})` : `(Anonymous ${year})`;
            } else if (sourceType === 'journal') {
                bibHTML = `${authorFormatted ? authorFormatted + ' ' : ''}${year}. "${title || 'Untitled Article'}." <em>${containerTitle || 'Journal Name'}</em> ${volume || ''}`;
                if (issue) bibHTML += `, no. ${issue}`;
                if (pages) bibHTML += `: ${pages}`;
                if (doi) bibHTML += `. https://doi.org/${doi}`;

                intextText = authorList.length > 0 ? `(${getLastName(authorList[0])} ${year})` : `(Anonymous ${year})`;
            } else if (sourceType === 'book') {
                bibHTML = `${authorFormatted ? authorFormatted + ' ' : ''}${year}. <em>${title || 'Untitled Book'}</em>.`;
                if (edition) bibHTML += ` ${edition} ed.`;
                if (publisher) bibHTML += ` ${publisher}.`;

                intextText = authorList.length > 0 ? `(${getLastName(authorList[0])} ${year})` : `(Anonymous ${year})`;
            }
        }
        else if (style === 'ieee') {
            // IEEE (Numeric)
            let authorFormatted = '';
            if (authorList.length === 1) {
                authorFormatted = `${getInitials(authorList[0])} ${getLastName(authorList[0])}`;
            } else if (authorList.length === 2) {
                authorFormatted = `${getInitials(authorList[0])} ${getLastName(authorList[0])} and ${getInitials(authorList[1])} ${getLastName(authorList[1])}`;
            } else if (authorList.length > 2) {
                authorFormatted = `${getInitials(authorList[0])} ${getLastName(authorList[0])} et al.`;
            }

            if (sourceType === 'website') {
                bibHTML = `[${bibIndex}] ${authorFormatted}, "${title || 'Untitled Page'}," *${containerTitle || 'Website Name'}*, ${year}. [Online]. Available: <a href="${url}" target="_blank" class="text-accent-gold underline">${url}</a>. [Accessed: ${accessDate}].`;
                intextText = `[${bibIndex}]`;
            } else if (sourceType === 'journal') {
                bibHTML = `[${bibIndex}] ${authorFormatted}, "${title || 'Untitled Article'}," *${containerTitle || 'Journal'}*, vol. ${volume || 'X'}, no. ${issue || 'Y'}`;
                if (pages) bibHTML += `, pp. ${pages}`;
                if (year) bibHTML += `, ${year}`;
                if (doi) bibHTML += `, doi: ${doi}`;

                intextText = `[${bibIndex}]`;
            } else if (sourceType === 'book') {
                bibHTML = `[${bibIndex}] ${authorFormatted}, *${title || 'Untitled Book'}*`;
                if (edition) bibHTML += `, ${edition} ed.`;
                if (publisher) bibHTML += `, ${publisher}`;
                if (year) bibHTML += `, ${year}`;

                intextText = `[${bibIndex}]`;
            }
        }
        else if (style === 'vancouver') {
            // Vancouver (Numeric)
            let authorFormatted = '';
            if (authorList.length > 0) {
                authorFormatted = authorList.map(name => {
                    const last = getLastName(name);
                    const init = name.split(' ').slice(0, -1).map(p => p[0]).join('').toUpperCase();
                    return `${last} ${init}`;
                }).join(', ');
            }

            if (sourceType === 'website') {
                bibHTML = `(${bibIndex}) ${authorFormatted ? authorFormatted + '. ' : ''}${title || 'Untitled Page'} [Internet]. ${containerTitle || 'Website Name'}; ${year} [cited ${accessDate}]. Available from: <a href="${url}" target="_blank" class="text-accent-gold underline">${url}</a>`;
                intextText = `(${bibIndex})`;
            } else if (sourceType === 'journal') {
                bibHTML = `(${bibIndex}) ${authorFormatted ? authorFormatted + '. ' : ''}${title || 'Untitled Article'}. *${containerTitle || 'Journal'}*. ${year};${volume || 'Vol'}(${issue || 'Issue'}):${pages || 'Pages'}.`;
                intextText = `(${bibIndex})`;
            } else if (sourceType === 'book') {
                bibHTML = `(${bibIndex}) ${authorFormatted ? authorFormatted + '. ' : ''}${title || 'Untitled Book'}.`;
                if (edition) bibHTML += ` ${edition} ed.`;
                if (publisher) bibHTML += ` ${publisher};`;
                if (year) bibHTML += ` ${year}.`;

                intextText = `(${bibIndex})`;
            }
        }

        setCitation({ bib: bibHTML, intext: intextText });
    }, [sourceType, style, authors, title, containerTitle, publisher, pubDate, accessDate, url, volume, issue, pages, edition, doi, bibliography.length]);

    const handleCopy = (text, type) => {
        // Strip HTML tags for clean copy
        const cleanText = text.replace(/<[^>]*>/g, '');
        navigator.clipboard.writeText(cleanText);
        if (type === 'bib') {
            setCopiedBib(true);
            setTimeout(() => setCopiedBib(false), 2000);
        } else {
            setCopiedIntext(true);
            setTimeout(() => setCopiedIntext(false), 2000);
        }
    };

    const addCitation = () => {
        setBibliography([...bibliography, { ...citation, id: Date.now() }]);
        // Reset inputs
        setAuthors('');
        setTitle('');
        setContainerTitle('');
        setPublisher('');
        setPubDate('');
        setUrl('');
        setVolume('');
        setIssue('');
        setPages('');
        setEdition('');
        setDoi('');
    };

    const removeCitation = (id) => {
        setBibliography(bibliography.filter(item => item.id !== id));
    };

    const exportToTxt = () => {
        const text = bibliography.map((item, index) => `${index + 1}. ${item.bib.replace(/<[^>]*>/g, '')}`).join('\n\n');
        const blob = new Blob([text], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'bibliography.txt';
        link.click();
    };

    return (
        <div className="page-citation-generator">
            <Helmet>
                <title>All-In-One Citation Generator | Academic Wizard</title>
                <meta name="description" content="Generate instant, accurate citations in APA 7th, MLA 9th, Harvard, Chicago, IEEE, and Vancouver formatting with in-text output." />
                <link rel="canonical" href="https://academicwizard.online/tools/citation-generator" />
            </Helmet>

            <PageHeader 
                title="Citation Generator" 
                subtitle="All-in-one referencing builder supporting major university formats and real-time in-text citation output."
                breadcrumbs={[
                    { name: 'Home', url: '/' },
                    { name: 'Tools', url: '/tools' },
                    { name: 'Citation Generator', url: '/tools/citation-generator' }
                ]}
            />

            <section className="py-20 text-white">
                <div className="container grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Input Columns */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Selector Tabs */}
                        <div className="flex flex-wrap gap-3 p-2 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
                            {['website', 'journal', 'book'].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setSourceType(type)}
                                    className={`px-6 py-3 rounded-lg text-sm font-semibold capitalize transition-all duration-300 ${sourceType === type ? 'bg-accent-gold text-bg-primary shadow-lg shadow-accent-gold/20' : 'hover:bg-white/5 text-white'}`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>

                        <div className="flex flex-wrap gap-2 p-2 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
                            {['apa', 'mla', 'harvard', 'chicago', 'ieee', 'vancouver'].map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setStyle(s)}
                                    className={`px-4 py-2 rounded-lg text-xs uppercase font-bold tracking-wider transition-all duration-300 ${style === s ? 'bg-accent-gold text-bg-primary shadow-lg shadow-accent-gold/20' : 'hover:bg-white/5 text-white/70'}`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>

                        {/* Form Body */}
                        <div className="glass-card p-8 sm:p-12 space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="sm:col-span-2">
                                    <label className="block text-xs uppercase tracking-widest text-accent-gold font-bold mb-2">Author(s)</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. John Smith, Jane Doe (Separate with commas)" 
                                        value={authors} 
                                        onChange={(e) => setAuthors(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-accent-gold transition-colors text-white"
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-xs uppercase tracking-widest text-accent-gold font-bold mb-2">Title</label>
                                    <input 
                                        type="text" 
                                        placeholder={sourceType === 'book' ? "Book Title" : sourceType === 'journal' ? "Article Title" : "Webpage Title"}
                                        value={title} 
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-accent-gold transition-colors text-white"
                                    />
                                </div>

                                {sourceType !== 'book' && (
                                    <div className="sm:col-span-2">
                                        <label className="block text-xs uppercase tracking-widest text-accent-gold font-bold mb-2">
                                            {sourceType === 'journal' ? "Journal Name" : "Website Name"}
                                        </label>
                                        <input 
                                            type="text" 
                                            placeholder={sourceType === 'journal' ? "e.g. Journal of Higher Education" : "e.g. Academic Wizard Blog"}
                                            value={containerTitle} 
                                            onChange={(e) => setContainerTitle(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-accent-gold transition-colors text-white"
                                        />
                                    </div>
                                )}

                                {sourceType === 'book' && (
                                    <>
                                        <div>
                                            <label className="block text-xs uppercase tracking-widest text-accent-gold font-bold mb-2">Publisher</label>
                                            <input 
                                                type="text" 
                                                placeholder="e.g. Oxford University Press" 
                                                value={publisher} 
                                                onChange={(e) => setPublisher(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-accent-gold transition-colors text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs uppercase tracking-widest text-accent-gold font-bold mb-2">Edition</label>
                                            <input 
                                                type="text" 
                                                placeholder="e.g. 3rd" 
                                                value={edition} 
                                                onChange={(e) => setEdition(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-accent-gold transition-colors text-white"
                                            />
                                        </div>
                                    </>
                                )}

                                {sourceType === 'journal' && (
                                    <>
                                        <div>
                                            <label className="block text-xs uppercase tracking-widest text-accent-gold font-bold mb-2">Volume</label>
                                            <input 
                                                type="text" 
                                                placeholder="e.g. 14" 
                                                value={volume} 
                                                onChange={(e) => setVolume(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-accent-gold transition-colors text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs uppercase tracking-widest text-accent-gold font-bold mb-2">Issue</label>
                                            <input 
                                                type="text" 
                                                placeholder="e.g. 2" 
                                                value={issue} 
                                                onChange={(e) => setIssue(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-accent-gold transition-colors text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs uppercase tracking-widest text-accent-gold font-bold mb-2">Pages</label>
                                            <input 
                                                type="text" 
                                                placeholder="e.g. 102-115" 
                                                value={pages} 
                                                onChange={(e) => setPages(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-accent-gold transition-colors text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs uppercase tracking-widest text-accent-gold font-bold mb-2">DOI</label>
                                            <input 
                                                type="text" 
                                                placeholder="e.g. 10.1080/00221546..." 
                                                value={doi} 
                                                onChange={(e) => setDoi(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-accent-gold transition-colors text-white"
                                            />
                                        </div>
                                    </>
                                )}

                                <div>
                                    <label className="block text-xs uppercase tracking-widest text-accent-gold font-bold mb-2">
                                        {sourceType === 'book' ? "Publication Year" : "Publish Date / Year"}
                                    </label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. 2026 or 2026-05-12" 
                                        value={pubDate} 
                                        onChange={(e) => setPubDate(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-accent-gold transition-colors text-white"
                                    />
                                </div>

                                {sourceType === 'website' && (
                                    <div>
                                        <label className="block text-xs uppercase tracking-widest text-accent-gold font-bold mb-2">Access Date</label>
                                        <input 
                                            type="date" 
                                            value={accessDate} 
                                            onChange={(e) => setAccessDate(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-accent-gold transition-colors text-white"
                                        />
                                    </div>
                                )}

                                {sourceType !== 'book' && (
                                    <div className="sm:col-span-2">
                                        <label className="block text-xs uppercase tracking-widest text-accent-gold font-bold mb-2">URL</label>
                                        <input 
                                            type="url" 
                                            placeholder="https://example.com/article" 
                                            value={url} 
                                            onChange={(e) => setUrl(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-accent-gold transition-colors text-white"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="pt-4">
                                <Button 
                                    onClick={addCitation}
                                    className="w-full py-4 text-sm uppercase tracking-widest font-bold flex items-center justify-center gap-2"
                                >
                                    <Plus size={16} /> Add to Bibliography
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Output and Bibliography Panel */}
                    <div className="space-y-8">
                        {/* Live Output */}
                        <div className="glass-card p-8 border-accent-gold/30" style={{ borderColor: 'rgba(212, 175, 55, 0.3)' }}>
                            <h3 className="text-xl font-bold mb-6 font-heading text-accent-gold" style={{ color: 'var(--accent-gold)' }}>Live Citation</h3>
                            
                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[10px] uppercase tracking-widest text-white/50">Bibliography Reference</span>
                                        <button 
                                            onClick={() => handleCopy(citation.bib, 'bib')} 
                                            className="text-white/50 hover:text-accent-gold transition-colors"
                                            aria-label="Copy bibliography reference"
                                        >
                                            {copiedBib ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                                        </button>
                                    </div>
                                    <div 
                                        className="bg-black/30 border border-white/5 rounded-lg p-4 text-sm leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: citation.bib || 'Fill in the fields to generate...' }}
                                    />
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[10px] uppercase tracking-widest text-white/50">In-Text Citation</span>
                                        <button 
                                            onClick={() => handleCopy(citation.intext, 'intext')} 
                                            className="text-white/50 hover:text-accent-gold transition-colors"
                                            aria-label="Copy in-text citation"
                                        >
                                            {copiedIntext ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                                        </button>
                                    </div>
                                    <div className="bg-black/30 border border-white/5 rounded-lg p-4 text-sm font-mono">
                                        {citation.intext || 'Fill in the fields to generate...'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bibliography list */}
                        <div className="glass-card p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold font-heading">My Bibliography ({bibliography.length})</h3>
                                {bibliography.length > 0 && (
                                    <button 
                                        onClick={exportToTxt} 
                                        className="text-xs text-accent-gold hover:underline flex items-center gap-1 font-semibold"
                                        style={{ color: 'var(--accent-gold)' }}
                                    >
                                        <Download size={14} /> Export (.txt)
                                    </button>
                                )}
                            </div>

                            {bibliography.length === 0 ? (
                                <p className="text-white/40 text-sm py-10 text-center">Your bibliography is empty. Generate citations above and click "Add to Bibliography".</p>
                            ) : (
                                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                    {bibliography.map((item) => (
                                        <div key={item.id} className="relative group bg-white/5 border border-white/5 rounded-lg p-4 text-xs pr-10">
                                            <div dangerouslySetInnerHTML={{ __html: item.bib }} />
                                            <div className="mt-2 text-[10px] text-white/40">In-text: <span className="font-mono">{item.intext}</span></div>
                                            <button
                                                onClick={() => removeCitation(item.id)}
                                                className="absolute top-4 right-4 text-white/30 hover:text-red-500 transition-colors"
                                                aria-label="Delete citation"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CitationGenerator;
