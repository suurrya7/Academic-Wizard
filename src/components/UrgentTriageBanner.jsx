import React from 'react';
import { MessageSquare, Zap, Clock, ShieldCheck, ArrowRight } from 'lucide-react';

const UrgentTriageBanner = ({ articleTitle = "Academic Guidance", variant = "top" }) => {
    const defaultWhatsAppNumber = "447476840612";
    const prefilledMessage = encodeURIComponent(
        `Hello Academic Wizard!\n\n` +
        `I am reading your article on "${articleTitle}" and need urgent assistance with my university coursework.\n\n` +
        `⏱️ Deadline Status: Urgent / Approaching\n` +
        `📚 Requirements: University-level research, critical analysis & 100% Turnitin-safe delivery\n\n` +
        `Could an academic specialist review my requirements and provide a fast quote?`
    );
    const whatsappUrl = `https://wa.me/${defaultWhatsAppNumber}?text=${prefilledMessage}`;

    if (variant === "compact") {
        return (
            <aside aria-label="Urgent coursework help" className="my-8 p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-bg-secondary to-bg-primary border border-accent-gold/30 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <div className="inline-flex items-center gap-2 text-accent-gold text-xs font-bold font-heading uppercase tracking-wider">
                        <Zap size={15} className="fill-accent-gold" />
                        <span>Deadline Approaching? 12-Hour Urgent Triage Available</span>
                    </div>
                    <p className="text-xs text-text-secondary">
                        Struggling with citations, data analysis, or essay structure? Connect directly with verified Oxbridge & Ivy League graduates.
                    </p>
                </div>
                <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 px-5 py-2.5 rounded-xl bg-accent-gold hover:bg-amber-400 text-black font-semibold text-xs transition-all shadow-md inline-flex items-center gap-2"
                >
                    <MessageSquare size={15} />
                    <span>Chat on WhatsApp</span>
                    <ArrowRight size={14} />
                </a>
            </aside>
        );
    }

    return (
        <aside aria-label="Emergency academic assistance" className="my-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-black/80 via-bg-secondary to-black/60 border border-accent-gold/35 shadow-[0_10px_35px_rgba(212,175,55,0.08)] relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-gold/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-gold/15 border border-accent-gold/30 text-accent-gold font-bold text-[11px] tracking-wider uppercase font-heading">
                        <Clock size={13} />
                        <span>Academic Emergency Triage</span>
                    </span>
                    <span className="text-[11px] text-text-muted font-mono flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                        Online Specialists Available Now
                    </span>
                </div>

                <div className="space-y-2">
                    <h3 className="text-xl sm:text-2xl font-bold font-heading text-text-primary">
                        Struggling to Format or Finish Your Paper Before Midnight?
                    </h3>
                    <p className="text-sm text-text-secondary leading-relaxed max-w-2xl">
                        Don't let formatting errors or tight deadlines cost you a First-Class mark. Our subject specialists provide 1-on-1 methodology guidance, urgent proofreading, and Turnitin-safe custom model solutions tailored to your university rubrics.
                    </p>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs text-text-secondary">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="text-emerald-400 shrink-0" size={16} />
                        <span>100% Turnitin-Safe</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Zap className="text-accent-gold shrink-0" size={16} />
                        <span>Express 12h Turnaround</span>
                    </div>
                    <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                        <span className="text-accent-gold font-bold">★ 4.9/5</span>
                        <span>Trustpilot Verified</span>
                    </div>
                </div>

                {/* Action CTA */}
                <div className="pt-3 flex flex-wrap items-center gap-4">
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 rounded-2xl bg-accent-gold hover:bg-amber-400 text-black font-bold text-sm transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_25px_rgba(212,175,55,0.45)] inline-flex items-center gap-2"
                    >
                        <MessageSquare size={17} />
                        <span>Connect on WhatsApp for Instant Quote</span>
                    </a>
                    <a
                        href="https://academicwizard.online/services/assignment-help/"
                        className="text-xs text-text-secondary hover:text-accent-gold transition-colors font-medium flex items-center gap-1"
                    >
                        <span>View All 7 Academic Services</span>
                        <ArrowRight size={13} />
                    </a>
                </div>
            </div>
        </aside>
    );
};

export default UrgentTriageBanner;
