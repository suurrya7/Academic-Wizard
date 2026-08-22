import React from 'react';
import { MessageCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import Button from './Button';

const ToolHireExpertBanner = ({ 
    toolName = "Academic Tool",
    headline = "Need Guaranteed A-Grade Academic Results?",
    subheadline = "Have an Oxbridge / Ivy League-educated PhD specialist manually research, write, and reference your draft.",
    defaultService = "Assignment & Dissertation Support"
}) => {
    const whatsappUrl = `https://wa.me/919509893638?text=Hello%20Academic%20Wizard,%20I%20am%20using%20the%20${encodeURIComponent(toolName)}%20and%20need%20expert%20assistance%20for%20my%20academic%20project.`;

    return (
        <div className="relative overflow-hidden rounded-2xl border border-accent-gold/40 bg-gradient-to-br from-bg-secondary/90 via-bg-primary to-bg-secondary/90 p-8 md:p-10 shadow-[0_10px_40px_rgba(212,175,55,0.15)] my-12 text-left">
            {/* Background Glow */}
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent-gold/10 blur-[90px] pointer-events-none" />
            <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-accent-gold/10 blur-[90px] pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-8 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-gold/15 border border-accent-gold/30 text-accent-gold text-xs font-semibold uppercase tracking-widest">
                        <Sparkles size={13} className="text-accent-gold animate-pulse" />
                        <span>1-on-1 Human Academic Assistance</span>
                    </div>
                    
                    <h3 className="text-2xl md:text-3xl font-bold font-heading text-white leading-tight">
                        {headline}
                    </h3>
                    
                    <p className="text-text-secondary text-sm md:text-base leading-relaxed max-w-2xl">
                        {subheadline}
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                        <div className="flex items-center gap-2 text-xs text-white/90 font-medium">
                            <CheckCircle2 size={15} className="text-accent-gold shrink-0" />
                            <span>100% Turnitin-Safe</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-white/90 font-medium">
                            <CheckCircle2 size={15} className="text-accent-gold shrink-0" />
                            <span>24/7 Rapid Delivery</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-white/90 font-medium">
                            <CheckCircle2 size={15} className="text-accent-gold shrink-0" />
                            <span>Confidential & Anonymous</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-white/90 font-medium">
                            <CheckCircle2 size={15} className="text-accent-gold shrink-0" />
                            <span>Free Unlimited Edits</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-white/90 font-medium">
                            <CheckCircle2 size={15} className="text-accent-gold shrink-0" />
                            <span>All Formatting Styles</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-white/90 font-medium">
                            <CheckCircle2 size={15} className="text-accent-gold shrink-0" />
                            <span>First-Class Standard</span>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center space-y-4">
                    <div className="w-full sm:w-auto text-center lg:text-right">
                        <span className="text-[11px] text-white/60 uppercase tracking-wider block mb-2">
                            ⚡ Instant WhatsApp Response (3-min avg)
                        </span>
                        <Button 
                            onClick={() => window.open(whatsappUrl, '_blank')}
                            className="w-full sm:w-auto px-8 py-4 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-3 shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:shadow-[0_0_35px_rgba(212,175,55,0.7)]"
                        >
                            <MessageCircle size={18} />
                            <span>Get Expert Quote</span>
                        </Button>
                    </div>

                    <p className="text-[10px] text-white/40 text-center lg:text-right">
                        🔒 Protected by 256-bit encryption. Zero institutional sharing.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ToolHireExpertBanner;
