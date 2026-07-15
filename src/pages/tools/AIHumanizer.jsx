import React from 'react';
import { Helmet } from 'react-helmet-async';
import PageHeader from '../../components/PageHeader';

const AIHumanizer = () => {
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
                <div className="container max-w-4xl space-y-8">
                    <div className="glass-card p-6 border-accent-gold/20 rounded-2xl" style={{ borderColor: 'rgba(212, 175, 55, 0.15)' }}>
                        <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-4">
                            <h3 className="text-xl font-bold font-heading text-accent-gold" style={{ color: 'var(--accent-gold)' }}>Humanizer Engine</h3>
                            <span className="text-xs px-2.5 py-1 bg-accent-gold/15 text-accent-gold font-bold uppercase rounded-full">
                                Streamlit Node
                            </span>
                        </div>

                        {/* Streamlit clean embed iframe */}
                        <div 
                            className="w-full bg-black/40 rounded-xl overflow-hidden relative"
                            style={{ height: '700px' }}
                        >
                            <iframe
                                src="https://dn-bot.streamlit.app/~/+/humanize_text?embed=true#a367619d"
                                title="Academic Wizard Text Humanizer"
                                width="100%"
                                height="100%"
                                style={{ border: 'none', background: 'transparent' }}
                                scrolling="no"
                                allow="clipboard-read; clipboard-write"
                            />
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
                </div>
            </section>
        </div>
    );
};

export default AIHumanizer;
