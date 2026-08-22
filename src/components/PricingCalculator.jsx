import React, { useState } from 'react';
import { MessageCircle, ShieldCheck, Clock, Award, CheckCircle2, Sparkles } from 'lucide-react';
import Button from './Button';

const CURRENCIES = {
    USD: { symbol: '$', rate: 1.0, label: 'USD ($)' },
    GBP: { symbol: '£', rate: 0.78, label: 'GBP (£)' },
    AUD: { symbol: 'A$', rate: 1.52, label: 'AUD (A$)' },
    CAD: { symbol: 'C$', rate: 1.36, label: 'CAD (C$)' },
    EUR: { symbol: '€', rate: 0.92, label: 'EUR (€)' }
};

const SUBJECTS = [
    'Nursing & Healthcare',
    'Law & Legal Studies (OSCOLA)',
    'Business & MBA Management',
    'Computer Science & IT',
    'Engineering & Technical',
    'Psychology & Social Sciences',
    'Finance, Accounting & Economics',
    'Literature, History & Humanities',
    'Dissertation & PhD Thesis'
];

const PricingCalculator = () => {
    const [currency, setCurrency] = useState('USD');
    const [subject, setSubject] = useState('Nursing & Healthcare');
    const [academicLevel, setAcademicLevel] = useState('undergraduate');
    const [wordCount, setWordCount] = useState(1500);
    const [deadline, setDeadline] = useState('3-days');

    // Base USD rate per 250 words (1 page)
    const baseRatesUSD = {
        'high-school': 11,
        'undergraduate': 14,
        'masters': 18,
        'phd': 24
    };

    const deadlineMultipliers = {
        '14-days': 1.0,
        '7-days': 1.15,
        '3-days': 1.35,
        '48-hours': 1.55,
        '24-hours': 1.85,
        '12-hours': 2.30
    };

    const deadlineLabels = {
        '14-days': '14 Days (Standard)',
        '7-days': '7 Days (Relaxed)',
        '3-days': '3 Days (Fast)',
        '48-hours': '48 Hours (Urgent)',
        '24-hours': '24 Hours (Express)',
        '12-hours': '12 Hours (Emergency)'
    };

    const calculatePrice = () => {
        const pages = Math.max(1, Math.ceil(wordCount / 250));
        const baseUSD = baseRatesUSD[academicLevel] * pages;
        const totalUSD = baseUSD * deadlineMultipliers[deadline];
        const converted = totalUSD * CURRENCIES[currency].rate;
        return Math.round(converted);
    };

    const currentSymbol = CURRENCIES[currency].symbol;
    const finalPrice = calculatePrice();
    const pagesCount = Math.max(1, Math.ceil(wordCount / 250));

    const whatsappMessage = encodeURIComponent(
        `Hello Academic Wizard! I'd like an exact quote for my project:\n\n` +
        `📚 Subject: ${subject}\n` +
        `🎓 Level: ${academicLevel.toUpperCase()}\n` +
        `📝 Word Count: ${wordCount} words (~${pagesCount} pages)\n` +
        `⏱️ Deadline: ${deadlineLabels[deadline]}\n` +
        `💰 Estimated Quote: ${currentSymbol}${finalPrice}\n\n` +
        `Can you confirm writer availability and timeline?`
    );

    const whatsappUrl = `https://wa.me/919509893638?text=${whatsappMessage}`;

    return (
        <div className="relative overflow-hidden rounded-3xl border border-accent-gold/30 bg-gradient-to-b from-bg-secondary/95 via-bg-primary to-bg-secondary/95 p-6 sm:p-10 max-w-3xl mx-auto shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-left">
            {/* Ambient gold glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-accent-gold/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent-gold/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 space-y-8">
                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-gold/15 border border-accent-gold/30 text-accent-gold text-xs font-semibold uppercase tracking-widest">
                        <Sparkles size={13} className="text-accent-gold" />
                        <span>Instant Transparent Cost Estimator</span>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold font-heading text-white">
                        Calculate Your <span className="text-accent-gold" style={{ color: 'var(--accent-gold)' }}>Academic Assistance</span> Fee
                    </h3>
                    <p className="text-text-secondary text-sm max-w-lg mx-auto">
                        Get an instant upfront estimate tailored to your academic tier, discipline, and urgent submission deadline.
                    </p>
                </div>

                {/* Form Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Currency Selector */}
                    <div>
                        <label className="block text-white/90 text-xs font-heading uppercase tracking-wider mb-2">
                            Select Currency
                        </label>
                        <select 
                            className="w-full bg-bg-primary/90 border border-white/10 text-white p-3 rounded-xl focus:outline-none focus:border-accent-gold transition-colors text-sm font-medium"
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                        >
                            {Object.entries(CURRENCIES).map(([code, info]) => (
                                <option key={code} value={code} className="bg-bg-primary text-white">
                                    {info.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Academic Level */}
                    <div>
                        <label className="block text-white/90 text-xs font-heading uppercase tracking-wider mb-2">
                            Academic Level
                        </label>
                        <select 
                            className="w-full bg-bg-primary/90 border border-white/10 text-white p-3 rounded-xl focus:outline-none focus:border-accent-gold transition-colors text-sm font-medium"
                            value={academicLevel}
                            onChange={(e) => setAcademicLevel(e.target.value)}
                        >
                            <option value="high-school" className="bg-bg-primary text-white">High School / College Diploma</option>
                            <option value="undergraduate" className="bg-bg-primary text-white">Undergraduate (BSc / BA / BEng)</option>
                            <option value="masters" className="bg-bg-primary text-white">Master's (MSc / MA / MBA)</option>
                            <option value="phd" className="bg-bg-primary text-white">PhD / Doctoral Research</option>
                        </select>
                    </div>

                    {/* Subject / Discipline */}
                    <div>
                        <label className="block text-white/90 text-xs font-heading uppercase tracking-wider mb-2">
                            Subject / Discipline
                        </label>
                        <select 
                            className="w-full bg-bg-primary/90 border border-white/10 text-white p-3 rounded-xl focus:outline-none focus:border-accent-gold transition-colors text-sm font-medium"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                        >
                            {SUBJECTS.map((sub) => (
                                <option key={sub} value={sub} className="bg-bg-primary text-white">
                                    {sub}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Deadline */}
                    <div>
                        <label className="block text-white/90 text-xs font-heading uppercase tracking-wider mb-2">
                            Urgency / Deadline
                        </label>
                        <select 
                            className="w-full bg-bg-primary/90 border border-white/10 text-white p-3 rounded-xl focus:outline-none focus:border-accent-gold transition-colors text-sm font-medium"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                        >
                            {Object.entries(deadlineLabels).map(([key, label]) => (
                                <option key={key} value={key} className="bg-bg-primary text-white">
                                    {label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Word Count Slider */}
                <div className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-3">
                    <div className="flex justify-between items-center text-sm">
                        <label className="text-white font-medium flex items-center gap-2">
                            <span>Project Length</span>
                            <span className="text-accent-gold font-bold">({pagesCount} {pagesCount === 1 ? 'Page' : 'Pages'})</span>
                        </label>
                        <span className="text-accent-gold font-heading text-lg font-bold">
                            {wordCount.toLocaleString()} words
                        </span>
                    </div>

                    <input 
                        type="range" 
                        min="250" 
                        max="15000" 
                        step="250"
                        value={wordCount}
                        onChange={(e) => setWordCount(parseInt(e.target.value, 10))}
                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent-gold"
                    />

                    <div className="flex justify-between text-[11px] text-white/40">
                        <span>250 words (1 pg)</span>
                        <span>5,000 words (Dissertation ch.)</span>
                        <span>15,000 words (Full thesis)</span>
                    </div>
                </div>

                {/* Live Quote Output Card */}
                <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-accent-gold/20 via-accent-gold/10 to-transparent border border-accent-gold/40 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_10px_30px_rgba(212,175,55,0.1)]">
                    <div className="space-y-1 text-center sm:text-left">
                        <div className="text-white/70 text-xs uppercase tracking-wider font-semibold">
                            Estimated All-Inclusive Quote
                        </div>
                        <div className="text-4xl sm:text-5xl font-bold text-accent-gold font-heading flex items-baseline justify-center sm:justify-start gap-1">
                            <span>{currentSymbol}</span>
                            <span>{finalPrice}</span>
                            <span className="text-xs text-white/50 font-normal uppercase tracking-widest ml-2">
                                ({currency})
                            </span>
                        </div>
                        <div className="text-[11px] text-white/60">
                            Includes complete referencing, Turnitin plagiarism report & free edits.
                        </div>
                    </div>

                    <div className="w-full sm:w-auto">
                        <Button 
                            onClick={() => window.open(whatsappUrl, '_blank')}
                            className="w-full sm:w-auto px-8 py-4 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-3 shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:shadow-[0_0_35px_rgba(212,175,55,0.7)]"
                        >
                            <MessageCircle size={18} />
                            <span>Claim Quote on WhatsApp</span>
                        </Button>
                    </div>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-white/10 text-center">
                    <div className="flex items-center justify-center gap-2 text-[11px] text-white/70">
                        <CheckCircle2 size={14} className="text-accent-gold shrink-0" />
                        <span>100% Turnitin-Safe</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-[11px] text-white/70">
                        <Clock size={14} className="text-accent-gold shrink-0" />
                        <span>3-Min Response</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-[11px] text-white/70">
                        <Award size={14} className="text-accent-gold shrink-0" />
                        <span>First-Class PhD Writers</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-[11px] text-white/70">
                        <ShieldCheck size={14} className="text-accent-gold shrink-0" />
                        <span>100% Confidential</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PricingCalculator;
