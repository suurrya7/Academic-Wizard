import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import PageHeader from '../../components/PageHeader';
import Button from '../../components/Button';
import { CheckCircle, AlertTriangle, RefreshCw, Copy, Check } from 'lucide-react';

const GrammarChecker = () => {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [matches, setMatches] = useState([]);
    const [checked, setChecked] = useState(false);
    const [copied, setCopied] = useState(false);

    const checkGrammar = async () => {
        if (!text.trim()) return;
        if (window.trigger_grammar_use && !window.trigger_grammar_use()) {
            return;
        }
        setLoading(true);
        try {
            const response = await fetch('https://api.languagetool.org/v2/check', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    text: text,
                    language: 'en-US',
                }),
            });
            const data = await response.json();
            setMatches(data.matches || []);
            setChecked(true);
        } catch (error) {
            console.error('Error checking grammar:', error);
        } finally {
            setLoading(false);
        }
    };

    const applySuggestion = (offset, length, replacement) => {
        const newText = text.substring(0, offset) + replacement + text.substring(offset + length);
        
        // Recalculate offsets for remaining matches
        const diff = replacement.length - length;
        const updatedMatches = matches
            .map(match => {
                if (match.offset > offset) {
                    return { ...match, offset: match.offset + diff };
                }
                return match;
            })
            .filter(match => match.offset !== offset); // remove applied match
            
        setText(newText);
        setMatches(updatedMatches);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const clearText = () => {
        setText('');
        setMatches([]);
        setChecked(false);
    };

    return (
        <div className="page-grammar-checker">
            <Helmet>
                <title>Free Grammar & Spell Checker | Academic Wizard</title>
                <meta name="description" content="Check your academic papers and essays for grammar, spelling, and punctuation errors. Real-time suggestions and one-click corrections." />
                <link rel="canonical" href="https://academicwizard.online/tools/grammar-checker" />
            </Helmet>

            <PageHeader 
                title="Grammar & Spell Checker" 
                subtitle="Instant proofreading and editing checker. Find grammatical slips, spelling mistakes, and structural errors."
                breadcrumbs={[
                    { name: 'Home', url: '/' },
                    { name: 'Tools', url: '/tools' },
                    { name: 'Grammar Checker', url: '/tools/grammar-checker' }
                ]}
            />

            <section className="py-20 text-white">
                <div className="container grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Editor Panel */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="glass-card p-6 flex flex-col h-[500px]">
                            <textarea
                                value={text}
                                onChange={(e) => {
                                    setText(e.target.value);
                                    if (checked) setChecked(false); // Reset check status if text changes
                                }}
                                placeholder="Paste your essay, paper, or paragraphs here (up to 20,000 characters)..."
                                className="w-full flex-grow bg-transparent resize-none focus:outline-none text-white text-base leading-relaxed placeholder-white/30"
                                maxLength={20000}
                            />
                            
                            <div className="flex justify-between items-center border-t border-white/10 pt-4 mt-4">
                                <span className="text-xs text-white/40 font-mono">
                                    {text.length} / 20,000 characters
                                </span>
                                <div className="flex gap-3">
                                    {text.trim() && (
                                        <>
                                            <button 
                                                onClick={clearText}
                                                className="px-4 py-2 rounded-lg border border-white/10 text-xs font-semibold hover:bg-white/5 transition-colors"
                                            >
                                                Clear
                                            </button>
                                            <button 
                                                onClick={handleCopy}
                                                className="px-4 py-2 rounded-lg border border-white/10 text-xs font-semibold hover:bg-white/5 transition-colors flex items-center gap-1.5"
                                            >
                                                {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                                {copied ? 'Copied' : 'Copy'}
                                            </button>
                                        </>
                                    )}
                                    <Button 
                                        onClick={checkGrammar} 
                                        disabled={loading || !text.trim()}
                                        className="py-2.5 px-6 text-xs uppercase tracking-wider font-bold flex items-center gap-2"
                                    >
                                        {loading ? <RefreshCw size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                                        {loading ? 'Checking...' : 'Check Text'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Results / Suggestions Sidebar */}
                    <div className="space-y-6">
                        <div className="glass-card p-8 min-h-[500px]">
                            <h3 className="text-xl font-bold mb-6 font-heading border-b border-white/10 pb-4 flex justify-between items-center">
                                <span>Audit Report</span>
                                {checked && (
                                    <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${matches.length === 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                        {matches.length} {matches.length === 1 ? 'Issue' : 'Issues'}
                                    </span>
                                )}
                            </h3>

                            {!checked && !loading && (
                                <div className="flex flex-col items-center justify-center text-center py-20 text-white/30 space-y-4">
                                    <CheckCircle size={48} className="text-white/10" />
                                    <p className="text-sm">Paste your text and click "Check Text" to analyze spelling and grammar issues.</p>
                                </div>
                            )}

                            {loading && (
                                <div className="flex flex-col items-center justify-center text-center py-20 text-white/40 space-y-4">
                                    <RefreshCw size={36} className="animate-spin text-accent-gold" style={{ color: 'var(--accent-gold)' }} />
                                    <p className="text-sm">LanguageTool is auditing your document...</p>
                                </div>
                            )}

                            {checked && !loading && matches.length === 0 && (
                                <div className="flex flex-col items-center justify-center text-center py-20 text-emerald-400 space-y-4">
                                    <CheckCircle size={48} className="text-emerald-500/20" />
                                    <h4 className="text-lg font-bold">Flawless Draft!</h4>
                                    <p className="text-xs text-white/50 px-6">No spelling or grammatical errors were found in your text. Your document is ready to go!</p>
                                </div>
                            )}

                            {checked && !loading && matches.length > 0 && (
                                <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">
                                    {matches.map((match, idx) => (
                                        <div key={idx} className="bg-white/5 border-l-4 border-amber-500 rounded-r-lg p-4 space-y-3 text-sm">
                                            <div className="flex justify-between items-start">
                                                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                                                    {match.rule.category.name}
                                                </span>
                                                <span className="text-white/30 text-xs font-mono">
                                                    "{text.substring(match.offset, match.offset + match.length)}"
                                                </span>
                                            </div>

                                            <p className="text-white/80 text-xs">{match.message}</p>

                                            {match.replacements && match.replacements.length > 0 && (
                                                <div className="flex flex-wrap gap-2 pt-1">
                                                    {match.replacements.slice(0, 3).map((rep, repIdx) => (
                                                        <button
                                                            key={repIdx}
                                                            onClick={() => applySuggestion(match.offset, match.length, rep.value)}
                                                            className="bg-accent-gold/10 hover:bg-accent-gold text-accent-gold hover:text-bg-primary border border-accent-gold/20 hover:border-transparent px-3 py-1 rounded text-xs transition-colors duration-300 font-semibold"
                                                            style={{ 
                                                                color: 'var(--accent-gold)',
                                                                borderColor: 'rgba(212, 175, 55, 0.2)'
                                                            }}
                                                        >
                                                            {rep.value}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
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

export default GrammarChecker;
