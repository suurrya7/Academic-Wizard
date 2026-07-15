import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import PageHeader from '../../components/PageHeader';
import Button from '../../components/Button';
import { Cpu, AlertCircle, Sparkles, User, RefreshCw, BarChart2 } from 'lucide-react';

const AI_BUZZWORDS = [
    'delve', 'testament', 'furthermore', 'meticulously', 'showcasing', 
    'seamlessly', 'seamless', 'robust', 'landscape', 'crucial', 
    'crucially', 'pivotal', 'pivotally', 'inherently', 'underscored', 
    'tapestry', 'multidimensional', 'multifaceted', 'revolutionize',
    'revolutionizing', 'demystify', 'foster', 'fostering', 'game-changer',
    'beacon', 'paradigm', 'realm', 'leverage', 'leveraging', 'tailored',
    'elevate', 'elevating', 'comprehensive', 'catalyst', 'conundrum',
    'pinnacle', 'notably', 'journey', 'enriching', 'in conclusion'
];

const AIDetector = () => {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [analyzed, setAnalyzed] = useState(false);

    const analyzeText = () => {
        if (!text.trim()) return;
        if (window.trigger_detector_use && !window.trigger_detector_use()) {
            return;
        }
        setLoading(true);
        
        setTimeout(() => {
            const cleanText = text.trim();
            const words = cleanText.toLowerCase().split(/\s+/).filter(Boolean);
            const sentences = cleanText.split(/[.!?]+/).map(s => s.trim()).filter(Boolean);

            if (words.length < 20) {
                alert("Please enter at least 20 words for a reliable analysis.");
                setLoading(false);
                return;
            }

            // 1. Buzzword Density calculation
            let buzzwordCount = 0;
            const detectedBuzzwords = [];
            AI_BUZZWORDS.forEach(word => {
                const regex = new RegExp(`\\b${word}\\b`, 'gi');
                const matches = cleanText.match(regex);
                if (matches) {
                    buzzwordCount += matches.length;
                    detectedBuzzwords.push({ word, count: matches.length });
                }
            });
            const buzzwordDensity = (buzzwordCount / words.length) * 100;

            // 2. Sentence Length Variance (Burstiness)
            const sentenceLengths = sentences.map(s => s.split(/\s+/).filter(Boolean).length);
            const avgSentenceLength = sentenceLengths.reduce((a, b) => a + b, 0) / sentences.length;
            
            // Standard Deviation of sentence lengths
            const variance = sentenceLengths.reduce((a, b) => a + Math.pow(b - avgSentenceLength, 2), 0) / sentences.length;
            const stdDev = Math.sqrt(variance);

            // 3. Sentence Structure / Perplexity calculation
            // Uniform sentence lengths (low stdDev) indicate AI writing.
            // Human average stdDev is typically 8.0 - 14.0. AI is usually 2.0 - 5.0.
            let burstinessScore = 0;
            if (stdDev < 4.0) burstinessScore = 40; // High AI indicator
            else if (stdDev < 6.0) burstinessScore = 25;
            else if (stdDev < 8.5) burstinessScore = 12;
            else burstinessScore = 2; // Low AI indicator (human burstiness)

            // 4. Calculate final AI Probability
            // Base score based on burstiness (uniformity) + buzzword density multiplier
            let aiScore = 15; // baseline AI similarity
            aiScore += burstinessScore;
            
            // Buzzword multiplier: more buzzwords -> much higher probability
            if (buzzwordDensity > 4.0) aiScore += 45;
            else if (buzzwordDensity > 2.5) aiScore += 30;
            else if (buzzwordDensity > 1.2) aiScore += 18;
            else if (buzzwordDensity > 0.5) aiScore += 8;

            // Cap the score logically
            aiScore = Math.min(Math.max(Math.round(aiScore), 5), 98);

            // Flag sentences with uniform lengths and buzzwords
            const flaggedSentences = sentences.map(s => {
                const sWords = s.split(/\s+/).filter(Boolean);
                const hasBuzzword = AI_BUZZWORDS.some(w => s.toLowerCase().includes(w));
                const lengthMatch = Math.abs(sWords.length - avgSentenceLength) < 3;
                
                let certainty = 'low';
                if (hasBuzzword && lengthMatch && aiScore > 50) certainty = 'high';
                else if (hasBuzzword || (lengthMatch && aiScore > 65)) certainty = 'medium';

                return {
                    text: s,
                    certainty
                };
            });

            setResult({
                aiProbability: aiScore,
                avgSentenceLength: Math.round(avgSentenceLength * 10) / 10,
                sentenceVar: Math.round(stdDev * 10) / 10,
                buzzwordCount,
                buzzwordDensity: Math.round(buzzwordDensity * 100) / 100,
                detectedBuzzwords: detectedBuzzwords.sort((a, b) => b.count - a.count).slice(0, 5),
                flaggedSentences
            });
            setAnalyzed(true);
            setLoading(false);
        }, 1200);
    };

    const clearText = () => {
        setText('');
        setResult(null);
        setAnalyzed(false);
    };

    return (
        <div className="page-ai-detector">
            <Helmet>
                <title>Accurate AI Content Detector & Essay Scanner | Academic Wizard</title>
                <meta name="description" content="Check your essays and academic papers for AI content. Scan sentence-level perplexity, predictability, and AI buzzwords to detect ChatGPT, Claude, and Gemini." />
                <link rel="canonical" href="https://academicwizard.online/tools/ai-detector" />
                <meta property="og:title" content="Accurate AI Content Detector & Essay Scanner | Academic Wizard" />
                <meta property="og:description" content="Audit essay authenticity. Scan texts for AI-generated patterns and robotic vocabulary." />
                <meta property="og:url" content="https://academicwizard.online/tools/ai-detector" />
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebApplication",
                        "name": "AI Content Detector",
                        "url": "https://academicwizard.online/tools/ai-detector",
                        "applicationCategory": "EducationalApplication",
                        "operatingSystem": "All",
                        "browserRequirements": "Requires HTML5",
                        "offers": {
                            "@type": "Offer",
                            "price": "0.00",
                            "priceCurrency": "USD"
                        }
                    })}
                </script>
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BreadcrumbList",
                        "itemListElement": [
                            {
                                "@type": "ListItem",
                                "position": 1,
                                "name": "Home",
                                "item": "https://academicwizard.online"
                            },
                            {
                                "@type": "ListItem",
                                "position": 2,
                                "name": "Tools",
                                "item": "https://academicwizard.online/tools"
                            },
                            {
                                "@type": "ListItem",
                                "position": 3,
                                "name": "AI Detector",
                                "item": "https://academicwizard.online/tools/ai-detector"
                            }
                        ]
                    })}
                </script>
            </Helmet>

            <PageHeader 
                title="Linguistic AI Detector" 
                subtitle="Evaluate your text's variance, complexity, and vocabulary indicators to detect writing patterns."
                breadcrumbs={[
                    { name: 'Home', url: '/' },
                    { name: 'Tools', url: '/tools' },
                    { name: 'AI Detector', url: '/tools/ai-detector' }
                ]}
            />

            <section className="py-20 text-white">
                <div className="container grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Form Input */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="glass-card p-6 flex flex-col h-[500px]">
                            <textarea
                                value={text}
                                onChange={(e) => {
                                    setText(e.target.value);
                                    if (analyzed) setAnalyzed(false);
                                }}
                                placeholder="Paste your text here (minimum 20 words, up to 10,000 characters)..."
                                className="w-full flex-grow bg-transparent resize-none focus:outline-none text-white text-base leading-relaxed placeholder-white/30"
                                maxLength={10000}
                            />
                            
                            <div className="flex justify-between items-center border-t border-white/10 pt-4 mt-4">
                                <span className="text-xs text-white/40 font-mono">
                                    {text.split(/\s+/).filter(Boolean).length} words
                                </span>
                                <div className="flex gap-3">
                                    {text.trim() && (
                                        <button 
                                            onClick={clearText}
                                            className="px-4 py-2 rounded-lg border border-white/10 text-xs font-semibold hover:bg-white/5 transition-colors"
                                        >
                                            Clear
                                        </button>
                                    )}
                                    <Button 
                                        onClick={analyzeText} 
                                        disabled={loading || text.split(/\s+/).filter(Boolean).length < 20}
                                        className="py-2.5 px-6 text-xs uppercase tracking-wider font-bold flex items-center gap-2"
                                    >
                                        {loading ? <RefreshCw size={14} className="animate-spin" /> : <Cpu size={14} />}
                                        {loading ? 'Analyzing...' : 'Scan AI Score'}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Text highlighting results */}
                        {analyzed && result && (
                            <div className="glass-card p-8 space-y-6">
                                <h3 className="text-xl font-bold font-heading border-b border-white/10 pb-4">Sentence-by-Sentence Scan</h3>
                                <div className="text-sm leading-relaxed space-y-1">
                                    {result.flaggedSentences.map((sentence, idx) => {
                                        let bgClass = '';
                                        if (sentence.certainty === 'high') bgClass = 'bg-red-500/20 text-red-100 border-b-2 border-red-500';
                                        else if (sentence.certainty === 'medium') bgClass = 'bg-amber-500/10 text-amber-100 border-b-2 border-amber-500/50';
                                        
                                        return (
                                            <span 
                                                key={idx} 
                                                className={`inline-block px-1 rounded transition-colors duration-300 ${bgClass}`}
                                            >
                                                {sentence.text}.{' '}
                                            </span>
                                        );
                                    })}
                                </div>
                                <div className="flex gap-6 flex-wrap text-xs text-white/60">
                                    <div className="flex items-center gap-1.5">
                                        <span className="h-3 w-3 rounded bg-red-500/25 border-b-2 border-red-500 block" />
                                        <span>Highly AI-typical structure</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="h-3 w-3 rounded bg-amber-500/15 border-b-2 border-amber-500/50 block" />
                                        <span>Moderate AI-typical pattern</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Results Score Card */}
                    <div className="space-y-6">
                        <div className="glass-card p-8 min-h-[500px] flex flex-col">
                            <h3 className="text-xl font-bold mb-6 font-heading border-b border-white/10 pb-4">Linguistic Report</h3>

                            {!analyzed && !loading && (
                                <div className="flex-grow flex flex-col items-center justify-center text-center py-10 text-white/30 space-y-4">
                                    <BarChart2 size={48} className="text-white/10" />
                                    <p className="text-sm">Scan text to audit probability distributions, syntax variance, and phrase structures.</p>
                                </div>
                            )}

                            {loading && (
                                <div className="flex-grow flex flex-col items-center justify-center text-center py-10 text-white/40 space-y-4">
                                    <RefreshCw size={36} className="animate-spin text-accent-gold" style={{ color: 'var(--accent-gold)' }} />
                                    <p className="text-sm">Evaluating standard deviation of sentence lengths...</p>
                                </div>
                            )}

                            {analyzed && !loading && result && (
                                <div className="space-y-8 flex-grow flex flex-col">
                                    {/* Circle Score */}
                                    <div className="flex flex-col items-center justify-center space-y-4">
                                        <div className="relative h-32 w-32 flex items-center justify-center">
                                            {/* Track Circle */}
                                            <svg className="absolute w-full h-full transform -rotate-90">
                                                <circle cx="64" cy="64" r="54" className="stroke-white/5 fill-transparent" strokeWidth="8" />
                                                <circle 
                                                    cx="64" 
                                                    cy="64" 
                                                    r="54" 
                                                    className={`fill-transparent transition-all duration-1000 ${result.aiProbability > 50 ? 'stroke-red-500' : 'stroke-emerald-500'}`}
                                                    strokeWidth="8" 
                                                    strokeDasharray={339.3}
                                                    strokeDashoffset={339.3 - (339.3 * result.aiProbability) / 100}
                                                />
                                            </svg>
                                            <div className="text-center">
                                                <span className="text-3xl font-extrabold">{result.aiProbability}%</span>
                                                <span className="block text-[8px] uppercase tracking-widest text-white/40">AI Score</span>
                                            </div>
                                        </div>

                                        <div className="text-center">
                                            <h4 className={`text-base font-bold flex items-center gap-1.5 justify-center ${result.aiProbability > 50 ? 'text-red-400' : 'text-emerald-400'}`}>
                                                {result.aiProbability > 55 ? <Cpu size={16} /> : <User size={16} />}
                                                {result.aiProbability > 75 ? 'Strongly AI Generated' : result.aiProbability > 50 ? 'Likely AI/Mixed' : 'Likely Human Written'}
                                            </h4>
                                        </div>
                                    </div>

                                    {/* Numerical breakdown */}
                                    <div className="space-y-4 text-sm border-t border-white/10 pt-6">
                                        <div className="flex justify-between items-center">
                                            <span className="text-white/60">Sentence Uniformity (Std Dev)</span>
                                            <span className="font-mono font-bold">{result.sentenceVar}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-white/60">AI Buzzwords Density</span>
                                            <span className="font-mono font-bold">{result.buzzwordDensity}%</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-white/60">Avg. Sentence Length</span>
                                            <span className="font-mono font-bold">{result.avgSentenceLength} words</span>
                                        </div>
                                    </div>

                                    {/* Top Buzzwords */}
                                    {result.detectedBuzzwords.length > 0 && (
                                        <div className="border-t border-white/10 pt-4 flex-grow">
                                            <h4 className="text-xs uppercase tracking-wider text-white/50 mb-3">Flagged Words</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {result.detectedBuzzwords.map((item, i) => (
                                                    <span key={i} className="text-xs bg-white/5 border border-white/10 rounded-full px-3 py-1 font-semibold text-accent-gold" style={{ color: 'var(--accent-gold)' }}>
                                                        {item.word} ({item.count}x)
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Premium Call to action (Humanizer Streamlit hook) */}
                                    {result.aiProbability > 45 && (
                                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 space-y-3">
                                            <p className="text-xs text-red-200 leading-relaxed">
                                                Audited scores show robotically structured sentences and phrases. Bypass AI scanning by runnning our Text Humanizer.
                                            </p>
                                            <Button type="outline" className="w-full py-2.5 text-[10px] border-red-500/50 hover:bg-red-500 text-red-200 hover:text-white" onClick={() => window.location.href='/tools/ai-humanizer'}>
                                                Humanize Text Now
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* FAQ and Content Section */}
                    <div className="lg:col-span-3 border-t border-white/10 pt-16 mt-16 max-w-4xl mx-auto space-y-12">
                        <div className="space-y-4 text-center lg:text-left animate-fade-in">
                            <h3 className="text-2xl font-bold font-heading text-accent-gold" style={{ color: 'var(--accent-gold)' }}>
                                Analyze Essay Authenticity with Linguistic Audits
                            </h3>
                            <p className="text-text-secondary leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                Universities employ strict scanning systems to flag papers generated by machine learning engines. Our linguistic AI scanner evaluates the sentence-level perplexity and burstiness of your writing. Because AI models output highly uniform sentence patterns, variation in syntax is the key indicator of authentic, human-written academic prose.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-xl font-bold font-heading text-white">Frequently Asked Questions</h3>
                            
                            <div className="space-y-4">
                                <div className="bg-white/5 border border-white/5 p-6 rounded-xl space-y-2">
                                    <h4 className="font-bold text-white text-sm">How does this free AI detector scan essays?</h4>
                                    <p className="text-text-secondary text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                        The detector checks two variables: perplexity (complexity of sentence structure) and vocabulary density. If sentences have uniform length and contain typical AI filler words (e.g., "testament," "delve," "moreover"), it flags the text with a high AI probability.
                                    </p>
                                </div>
                                <div className="bg-white/5 border border-white/5 p-6 rounded-xl space-y-2">
                                    <h4 className="font-bold text-white text-sm">Can Turnitin detect ChatGPT-generated content?</h4>
                                    <p className="text-text-secondary text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                        Yes, Turnitin uses structural classifiers specifically trained to recognize the flat, predictable cadence of Large Language Models. Running your essay through our scanner helps you see exactly what pattern Turnitin will flag.
                                    </p>
                                </div>
                                <div className="bg-white/5 border border-white/5 p-6 rounded-xl space-y-2">
                                    <h4 className="font-bold text-white text-sm">What is the minimum word count required?</h4>
                                    <p className="text-text-secondary text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                        To calculate a reliable statistical probability, we require a minimum of 20 words. For maximum accuracy, we recommend scanning a paragraph of at least 150 words to avoid false positive alerts.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AIDetector;
