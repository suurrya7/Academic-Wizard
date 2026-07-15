import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import PageHeader from '../../components/PageHeader';
import Button from '../../components/Button';
import { Sparkles, Play, Clock } from 'lucide-react';

const AIHumanizer = () => {
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
                <title>AI Text Humanizer | Academic Wizard</title>
                <meta name="description" content="Humanize your AI-generated essays. Remove robotic vocabulary, increase perplexity, and bypass AI content detectors instantly." />
                <link rel="canonical" href="https://academicwizard.online/tools/ai-humanizer" />
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
                            {sessionActive ? (
                                <span className="text-xs px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 font-mono font-bold uppercase rounded-full flex items-center gap-1.5">
                                    <Clock size={14} /> Session Time: {formatTime(timeLeft)}
                                </span>
                            ) : (
                                <span className="text-xs px-2.5 py-1 bg-accent-gold/15 text-accent-gold font-bold uppercase rounded-full">
                                    Streamlit Node
                                </span>
                            )}
                        </div>

                        {sessionActive ? (
                            /* Streamlit clean embed iframe */
                            <div 
                                className="w-full bg-black/40 rounded-xl overflow-hidden relative"
                                style={{ height: '900px' }}
                            >
                                <iframe
                                    src="https://academic-wizard.streamlit.app/?embed=true"
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
                </div>
            </section>
        </div>
    );
};

export default AIHumanizer;
