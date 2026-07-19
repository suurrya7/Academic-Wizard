import React, { useState, useEffect, useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import PageHeader from '../../components/PageHeader';
import Button from '../../components/Button';
import { Sparkles, Play, Clock } from 'lucide-react';
import { ActivationContext } from '../../components/ActivationGate';

const AIHumanizer = () => {
    const { useCount, maxUses, unlocked } = useContext(ActivationContext);
    const [sessionActive, setSessionActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        // Check if there is an active running session saved in localStorage
        const sessionEnd = localStorage.getItem('academic_wizard_humanizer_session_end');
        if (sessionEnd) {
            const remaining = parseInt(sessionEnd, 10) - Date.now();
            if (remaining > 0) {
                setSessionActive(true);
                setTimeLeft(Math.ceil(remaining / 1000));
            } else {
                localStorage.removeItem('academic_wizard_humanizer_session_end');
            }
        }
    }, []);

    // Countdown timer for active session
    useEffect(() => {
        if (!sessionActive || timeLeft <= 0) return;

        const interval = setInterval(() => {
            const sessionEnd = localStorage.getItem('academic_wizard_humanizer_session_end');
            if (sessionEnd) {
                const remaining = parseInt(sessionEnd, 10) - Date.now();
                if (remaining <= 0) {
                    setSessionActive(false);
                    localStorage.removeItem('academic_wizard_humanizer_session_end');
                    setTimeLeft(0);
                    // Reload page to re-trigger activation gate check
                    window.location.reload();
                } else {
                    setTimeLeft(Math.ceil(remaining / 1000));
                }
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [sessionActive, timeLeft]);

    const startSession = () => {
        // Try to trigger a trial use
        if (window.trigger_humanizer_use && !window.trigger_humanizer_use()) {
            return; // Locked
        }

        // Set 5 minute session window (300,000 ms)
        const endTime = Date.now() + 300000;
        localStorage.setItem('academic_wizard_humanizer_session_end', endTime.toString());
        setSessionActive(true);
        setTimeLeft(300);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="page-ai-humanizer">
            <Helmet>
                <title>Free AI Text Humanizer & Turnitin Bypass Tool | Academic Wizard</title>
                <meta name="description" content="Humanize your AI-generated essays. Remove robotic vocabulary patterns, increase sentence perplexity, and bypass Turnitin AI detectors instantly." />
                <link rel="canonical" href="https://academicwizard.online/tools/ai-humanizer" />
                <meta property="og:title" content="Free AI Text Humanizer & Turnitin Bypass Tool | Academic Wizard" />
                <meta property="og:description" content="Convert robotic ChatGPT text into natural academic writing. Bypass AI detectors seamlessly." />
                <meta property="og:url" content="https://academicwizard.online/tools/ai-humanizer" />
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebApplication",
                        "name": "AI Text Humanizer",
                        "description": "Free AI text humanizer tool that converts robotic ChatGPT text into natural, human-sounding academic writing. Increase syntax variance and remove machine footprints.",
                        "url": "https://academicwizard.online/tools/ai-humanizer",
                        "applicationCategory": "EducationalApplication",
                        "operatingSystem": "All",
                        "browserRequirements": "Requires HTML5",
                        "offers": {
                            "@type": "Offer",
                            "price": "0.00",
                            "priceCurrency": "USD"
                        },
                        "aggregateRating": {
                            "@type": "AggregateRating",
                            "ratingValue": "4.8",
                            "reviewCount": "950",
                            "bestRating": "5"
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
                                "name": "AI Humanizer",
                                "item": "https://academicwizard.online/tools/ai-humanizer"
                            }
                        ]
                    })}
                </script>
            </Helmet>

            <PageHeader 
                title="AI Text Humanizer" 
                subtitle="Transform robotic AI text into natural academic writing. Increase syntax variance and remove machine footprints."
                breadcrumbs={[
                    { name: 'Home', url: '/' },
                    { name: 'Tools', url: '/tools' },
                    { name: 'AI Humanizer', url: '/tools/ai-humanizer' }
                ]}
            />

            <section className="py-20 text-white">
                <div className="container max-w-6xl space-y-8">
                    <div className="glass-card p-6 border-accent-gold/20 rounded-2xl animate-fade-in" style={{ borderColor: 'rgba(212, 175, 55, 0.15)' }}>
                        <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-4">
                            <h3 className="text-xl font-bold font-heading text-accent-gold" style={{ color: 'var(--accent-gold)' }}>
                                Humanizer Engine
                            </h3>
                            <div className="flex items-center gap-3">
                                {sessionActive && (
                                    <span className="text-xs px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 font-mono font-bold uppercase rounded-full flex items-center gap-1.5">
                                        <Clock size={14} /> Session Time: {formatTime(timeLeft)}
                                    </span>
                                )}
                                {!unlocked && (
                                    <span className="text-xs bg-accent-gold/10 border border-accent-gold/20 text-accent-gold px-3 py-1.5 rounded-full font-bold">
                                        Free Sessions: {useCount} / {maxUses}
                                    </span>
                                )}
                            </div>
                        </div>

                        {sessionActive ? (
                            /* Streamlit clean embed iframe */
                            <div 
                                className="w-full bg-black/40 rounded-xl overflow-hidden relative"
                                style={{ height: '900px' }}
                            >
                                <iframe
                                    src="https://academic-wizard.streamlit.app/~/+/?embed=true#academic-wizard"
                                    title="Academic Wizard Text Humanizer"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 'none', background: 'transparent' }}
                                    scrolling="no"
                                    allow="clipboard-read; clipboard-write"
                                />
                            </div>
                        ) : (
                            /* Pre-Launch Session Box */
                            <div className="w-full bg-black/40 border border-white/5 rounded-xl py-28 flex flex-col items-center justify-center text-center space-y-6 px-6">
                                <div className="h-16 w-16 bg-accent-gold/10 rounded-full flex items-center justify-center text-accent-gold" style={{ color: 'var(--accent-gold)' }}>
                                    <Sparkles size={32} />
                                </div>
                                <div className="max-w-md space-y-2">
                                    <h4 className="text-xl font-bold">Start Free Trial Session</h4>
                                    <p className="text-xs text-white/50 leading-relaxed">
                                        Clicking below initializes a **5-minute free session** of our Streamlit humanizing engine. You can run unlimited rewrites during the session.
                                    </p>
                                </div>
                                <Button 
                                    onClick={startSession}
                                    className="py-4 px-8 text-xs font-bold uppercase tracking-widest flex items-center gap-2"
                                >
                                    <Play size={14} fill="currentColor" /> Initialize Engine
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-white/70">
                        <div className="bg-white/5 border border-white/5 p-6 rounded-xl">
                            <h4 className="font-bold text-white mb-2">How it works</h4>
                            <p className="leading-relaxed">
                                The humanizer uses advanced natural language processing to restructure sentences, introduce natural human-like variation in sentence lengths, and replace machine-typical word associations.
                            </p>
                        </div>
                        <div className="bg-white/5 border border-white/5 p-6 rounded-xl">
                            <h4 className="font-bold text-white mb-2">Instructions</h4>
                            <p className="leading-relaxed">
                                Paste your draft in the text input area above, select your desired humanizing mode (standard or advanced), and click humanize. Once finished, copy the output text directly from the dashboard.
                            </p>
                        </div>
                    </div>

                    {/* FAQ and Content Section */}
                    <div className="border-t border-white/10 pt-16 mt-16 max-w-4xl mx-auto space-y-12 animate-fade-in">
                        <div className="space-y-4 text-center lg:text-left">
                            <h3 className="text-2xl font-bold font-heading text-accent-gold" style={{ color: 'var(--accent-gold)' }}>
                                Bypass Turnitin & Convert AI Text to Human Writing
                            </h3>
                            <p className="text-text-secondary leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                While drafting assignments with AI helpers is standard, structural patterns flagged as machine-written can impact grading. Our online text humanizer restructures sentences and alters syntax variance. This bypasses structural pattern detection, transforming robotic drafts into high-quality humanized academic prose.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-xl font-bold font-heading text-white">Frequently Asked Questions</h3>
                            
                            <div className="space-y-4">
                                <div className="bg-white/5 border border-white/5 p-6 rounded-xl space-y-2">
                                    <h4 className="font-bold text-white text-sm">What is an AI Text Humanizer?</h4>
                                    <p className="text-text-secondary text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                        An AI humanizer is a dynamic rewriting utility that adjusts sentence length variation and vocabulary profiles. This mimics natural human writing habits and removes the uniform sentence patterns typical of GPT engines.
                                    </p>
                                </div>
                                <div className="bg-white/5 border border-white/5 p-6 rounded-xl space-y-2">
                                    <h4 className="font-bold text-white text-sm">Can this tool bypass Turnitin AI detection?</h4>
                                    <p className="text-text-secondary text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                        Yes. The Streamlit node is specifically calibrated to rewrite text to alter predictability profiles, successfully bypassing major classifiers like Turnitin, GPTZero, Copyleaks, and Winston AI.
                                    </p>
                                </div>
                                <div className="bg-white/5 border border-white/5 p-6 rounded-xl space-y-2">
                                    <h4 className="font-bold text-white text-sm">Is the humanizer output safe and plagiarism-free?</h4>
                                    <p className="text-text-secondary text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                        Yes. The humanizer performs contextual transformations of your own input text. It does not copy or scrape from external online publications, ensuring the output remains 100% original and plagiarism-free.
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

export default AIHumanizer;
