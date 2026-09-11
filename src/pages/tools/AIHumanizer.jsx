import React, { useState, useEffect, useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import PageHeader from '../../components/PageHeader';
import Button from '../../components/Button';
import ToolHireExpertBanner from '../../components/ToolHireExpertBanner';
import { Sparkles, Play, Clock, ShieldAlert, ShieldCheck, CheckCircle2, MessageCircle } from 'lucide-react';
import { ActivationContext } from '../../components/ActivationGate';

const AIHumanizer = () => {
    const { useCount, maxUses, unlocked } = useContext(ActivationContext);
    const [sessionActive, setSessionActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);

    const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000; // 259,200,000 ms (72 hours)

    useEffect(() => {
        if (unlocked) {
            setSessionActive(true);
            return;
        }

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
    }, [unlocked]);

    // Countdown timer for active session
    useEffect(() => {
        if (unlocked || !sessionActive || timeLeft <= 0) return;

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
    }, [sessionActive, timeLeft, unlocked]);

    const startSession = () => {
        // Try to trigger a trial use
        if (window.trigger_humanizer_use && !window.trigger_humanizer_use()) {
            return; // Locked
        }

        // Set 3-day session window (72 hours)
        const endTime = Date.now() + THREE_DAYS_MS;
        localStorage.setItem('academic_wizard_humanizer_session_end', endTime.toString());
        setSessionActive(true);
        setTimeLeft(Math.ceil(THREE_DAYS_MS / 1000));
    };

    const formatTime = (seconds) => {
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        if (days > 0) {
            return `${days}d ${hours}h ${mins}m`;
        }
        if (hours > 0) {
            return `${hours}h ${mins}m ${secs.toString().padStart(2, '0')}s`;
        }
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="page-ai-humanizer">
            <Helmet>
                <title>Free AI Text Humanizer & Turnitin Bypass Tool | Academic Wizard</title>
                <meta name="description" content="Free AI Humanizer tool — paste AI-generated text and get a human-sounding rewrite that passes Turnitin, Winston AI, and other AI detection tools. No sign-up required." />
                <link rel="canonical" href="https://academicwizard.online/tools/ai-humanizer/" />
                <meta property="og:title" content="Free AI Text Humanizer & Turnitin Bypass Tool | Academic Wizard" />
                <meta property="og:description" content="Convert robotic ChatGPT text into natural academic writing. Bypass AI detectors seamlessly." />
                <meta property="og:url" content="https://academicwizard.online/tools/ai-humanizer/" />
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebApplication",
                        "name": "AI Text Humanizer",
                        "description": "Free AI text humanizer tool that converts robotic ChatGPT text into natural, human-sounding academic writing. Increase syntax variance and remove machine footprints.",
                        "url": "https://academicwizard.online/tools/ai-humanizer/",
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
                            "bestRating": "5",
                            "worstRating": "1"
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
                                "item": "https://academicwizard.online/"
                            },
                            {
                                "@type": "ListItem",
                                "position": 2,
                                "name": "Tools",
                                "item": "https://academicwizard.online/tools/"
                            },
                            {
                                "@type": "ListItem",
                                "position": 3,
                                "name": "AI Humanizer",
                                "item": "https://academicwizard.online/tools/ai-humanizer/"
                            }
                        ]
                    })}
                </script>
            </Helmet>

            <PageHeader 
                title="AI Text Humanizer" 
                subtitle="Humanize AI-generated text to improve variation and bypass AI pattern detection."
                backgroundImage="/images/tools/ai-humanizer.webp"
                breadcrumbs={[
                    { name: 'Home', url: '/' },
                    { name: 'Tools', url: '/tools/' },
                    { name: 'AI Humanizer', url: '/tools/ai-humanizer/' }
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
                                    <span className="text-xs px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono font-bold uppercase rounded-full flex items-center gap-1.5">
                                        <Clock size={14} /> Active Session: {formatTime(timeLeft)}
                                    </span>
                                )}
                                {!unlocked && (
                                    <span className="text-xs bg-accent-gold/10 border border-accent-gold/20 text-accent-gold px-3 py-1.5 rounded-full font-bold">
                                        Free Sessions: {useCount} / {maxUses} (3 Days Each)
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
                                    <h4 className="text-xl font-bold">Start 3-Day Free Session</h4>
                                    <p className="text-xs text-white/50 leading-relaxed">
                                        Clicking below activates a **3-day free session (72 hours)** of our Streamlit humanizing engine. You can run unlimited rewrites anytime during these 3 days.
                                    </p>
                                </div>
                                <Button 
                                    onClick={startSession}
                                    className="py-4 px-8 text-xs font-bold uppercase tracking-widest flex items-center gap-2"
                                >
                                    <Play size={14} fill="currentColor" /> Activate 3-Day Session
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Turnitin Defense & 20% Discount Lead Generation Card */}
                    <div className="rounded-2xl border-2 border-accent-gold/40 bg-gradient-to-r from-red-950/40 via-bg-secondary to-amber-950/30 p-6 md:p-8 shadow-[0_10px_40px_rgba(212,175,55,0.18)] text-left relative overflow-hidden animate-fade-in">
                        <div className="absolute top-0 right-0 transform translate-x-3 -translate-y-1 bg-gradient-to-l from-accent-gold to-amber-500 text-black text-[11px] font-black uppercase px-5 py-1 rounded-full shadow-lg tracking-wider hidden sm:block">
                            ⚡ 20% Off Active
                        </div>
                        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                            <div className="space-y-3 max-w-2xl">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-bold uppercase tracking-wider">
                                        <ShieldAlert size={14} /> Turnitin AI Detection Alert
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                                        <ShieldCheck size={14} /> 100% Pass Guarantee
                                    </span>
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold font-heading text-white leading-snug">
                                    Worried Automated Rewrites Might Still Trigger Turnitin?
                                </h3>
                                <p className="text-sm text-text-secondary leading-relaxed">
                                    Turnitin and GPTZero frequently flag AI-paraphrased text due to repetitive perplexity footprints. If this submission affects your final GPA or degree, don’t risk machine filters. Our Oxbridge & Ivy League PhD specialists will <strong className="text-white">manually rewrite, cite, and certify your draft</strong> with a <span className="text-accent-gold font-semibold">guaranteed 0% AI detection report</span>.
                                </p>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs text-white/80">
                                    <div className="flex items-center gap-1.5">
                                        <CheckCircle2 size={14} className="text-accent-gold shrink-0" />
                                        <span>Certified 0% AI</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <CheckCircle2 size={14} className="text-accent-gold shrink-0" />
                                        <span>Rush 2-Hr Available</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <CheckCircle2 size={14} className="text-accent-gold shrink-0" />
                                        <span>PhD Subject Writers</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <CheckCircle2 size={14} className="text-accent-gold shrink-0" />
                                        <span>100% Confidential</span>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full lg:w-auto flex flex-col items-center lg:items-end justify-center gap-2 shrink-0">
                                <span className="text-[11px] text-emerald-400 font-semibold flex items-center justify-center lg:justify-end gap-1.5 mb-1">
                                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                                    4 PhD Specialists Online Now
                                </span>
                                <a
                                    href="https://wa.me/919509893638?text=Hello%20Academic%20Wizard,%20I%20used%20your%20AI%20Humanizer%20and%20need%20a%20PhD%20expert%20to%20manually%20rewrite/verify%20my%20paper%20with%200%25%20AI%20detection%20guarantee."
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => {
                                        if (typeof window !== 'undefined' && window.gtag) {
                                            window.gtag('event', 'generate_lead', {
                                                event_category: 'conversion',
                                                event_label: 'whatsapp_ai_humanizer_defense_card',
                                                value: 1
                                            });
                                        }
                                    }}
                                    className="inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-gradient-to-r from-accent-gold via-amber-400 to-accent-gold text-black font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:shadow-[0_0_35px_rgba(212,175,55,0.7)] w-full sm:w-auto"
                                >
                                    <MessageCircle size={18} />
                                    <span>Claim 20% Off on WhatsApp</span>
                                </a>
                                <span className="block text-[10px] text-accent-gold font-medium text-center lg:text-right">
                                    Code: <strong className="font-bold">WIZARD20</strong> (Auto-Applied)
                                </span>
                            </div>
                        </div>
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

                    {/* High-Converting Expert Hiring Banner */}
                    <ToolHireExpertBanner 
                        toolName="AI Humanizer"
                        headline="Need Guaranteed 100% Human Writing with 0% AI Detection?"
                        subheadline="Don't risk academic penalties. Have an Oxbridge / Ivy League-educated subject specialist manually rewrite, refine, and polish your draft before submission."
                        discountBadge="Claim 20% Student Discount on WhatsApp"
                        whatsappMessage="Hello Academic Wizard, I used your AI Humanizer and need a PhD expert to manually rewrite/verify my paper with 0% AI detection guarantee."
                        ctaText="Claim 20% Off on WhatsApp"
                    />

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
