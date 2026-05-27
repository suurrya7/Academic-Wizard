import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Target, UserCheck, Clock, MessageSquare, Zap, BadgeDollarSign } from 'lucide-react';

const features = [
    { icon: UserCheck, title: 'Expert Researchers', desc: 'Subject specialists and PhD-level experts across all disciplines.' },
    { icon: Zap, title: 'High Quality Research', desc: 'Top-tier academic references and impeccable research standards.' },
    { icon: Shield, title: 'Confidential & Secure', desc: 'Your privacy is our priority. 100% confidential assistance.' },
    { icon: MessageSquare, title: 'Fast Response', desc: 'Quick turnaround and instant support via WhatsApp.' },
    { icon: BadgeDollarSign, title: 'Affordable Quotes', desc: 'Premium quality assistance at student-friendly prices.' },
    { icon: Clock, title: 'Urgent Deadlines', desc: 'Support for tight timelines without compromising quality.' },
];

const steps = [
    { step: '01', title: 'Consultation', desc: 'Contact us on WhatsApp and explain your academic requirements.' },
    { step: '02', title: 'Get a Quote', desc: 'Receive a custom quote and timeline for academic assistance.' },
    { step: '03', title: 'Execution', desc: 'Our academic experts begin research, editing, or writing support.' },
    { step: '04', title: 'Delivery', desc: 'Receive your completed academic assistance via WhatsApp or Email.' },
];

const FeaturesGrid = () => {
    return (
        <div className="space-y-32 py-32">
            {/* Why Choose Us */}
            <section className="container px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div>
                        <span className="text-accent-gold font-heading text-xs tracking-[5px] uppercase mb-6 block" style={{ color: 'var(--accent-gold)' }}>The Distinction</span>
                        <h2 className="text-4xl md:text-5xl font-bold mb-10 text-white">Why Choose <br /><span className="text-accent-gold" style={{ color: 'var(--accent-gold)' }}>Academic Wizard?</span></h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            {features.map((feature, index) => (
                                <div key={index} className="flex gap-4">
                                    <div className="shrink-0 w-10 h-10 bg-accent-gold/10 rounded-lg flex items-center justify-center text-accent-gold" style={{ color: 'var(--accent-gold)' }}>
                                        <feature.icon size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-heading text-xs tracking-widest uppercase mb-2 text-white">{feature.title}</h4>
                                        <p className="text-text-secondary text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{feature.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="relative">
                        <div className="glass-card p-12 relative z-10">
                            <h3 className="text-2xl font-bold font-heading mb-8 text-white">Expert <span className="text-accent-gold" style={{ color: 'var(--accent-gold)' }}>Researchers</span></h3>
                            <div className="space-y-8">
                                {[
                                    { name: 'Dr. Michael Turner', role: 'PhD in Business Research' },
                                    { name: 'Dr. Emily Watson', role: 'PhD in Psychology' },
                                    { name: 'Dr. Daniel Roberts', role: 'PhD in Engineering' }
                                ].map((expert, i) => (
                                    <div key={i} className="flex items-center gap-6 p-4 rounded-xl border border-glass-border hover:border-accent-gold/30 transition-colors">
                                        <div className="w-14 h-14 rounded-full bg-accent-gold/20 flex items-center justify-center text-accent-gold font-heading font-bold" style={{ color: 'var(--accent-gold)' }}>
                                            {expert.name[4]}
                                        </div>
                                        <div>
                                            <h5 className="font-heading text-sm text-white">{expert.name}</h5>
                                            <p className="text-xs text-text-secondary uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>{expert.role}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent-gold/10 blur-3xl -z-10" style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)' }} />
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="bg-bg-secondary py-32 border-y border-glass-border" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div className="container px-6">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <span className="text-accent-gold font-heading text-xs tracking-[5px] uppercase mb-6 block" style={{ color: 'var(--accent-gold)' }}>The Process</span>
                        <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">How It <span className="text-accent-gold" style={{ color: 'var(--accent-gold)' }}>Works</span></h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="relative flex flex-col items-center text-center"
                            >
                                <div className="text-6xl font-black font-heading text-accent-gold/10 absolute -top-10 scale-150 -z-10" style={{ color: 'rgba(212, 175, 55, 0.1)' }}>
                                    {step.step}
                                </div>
                                <div className="w-16 h-16 rounded-full bg-accent-gold flex items-center justify-center font-heading font-bold text-black mb-6" style={{ backgroundColor: 'var(--accent-gold)' }}>
                                    {step.step}
                                </div>
                                <h4 className="font-heading text-sm uppercase tracking-widest mb-4 text-white">{step.title}</h4>
                                <p className="text-text-secondary text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default FeaturesGrid;
