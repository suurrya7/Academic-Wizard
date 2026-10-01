import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import PageHeader from '../components/PageHeader';
import { FileText, CheckCircle2, ShieldCheck, Award, MessageCircle, BookOpen } from 'lucide-react';

const SAMPLES = [
    {
        id: "law-oscola-contract",
        title: "Commercial Contract Law: Frustration & Breach under Common Law",
        subject: "Law & Legal Studies",
        style: "OSCOLA 4th Edition",
        level: "Postgraduate (LLM)",
        grade: "1st Class (78%)",
        words: "2,500 words",
        description: "Comprehensive problem question resolution applying the IRAC method to complex supply-chain disruptions, analyzing Taylor v Caldwell and the Law Reform (Frustrated Contracts) Act 1943.",
        excerpt: `[1] The primary legal question is whether the supervening export ban constitutes a frustrating event discharging Alpha Ltd from its contractual delivery obligations to Beta Corp under Clause 14.

[2] Under the doctrine established in Davis Contractors Ltd v Fareham UDC [1956] AC 696, frustration occurs when an unforeseen event renders performance fundamentally different from that which was undertaken. Lord Radcliffe emphasized that "frustration is not to be lightly invoked; the change of circumstances must be so radical that to hold the parties to the contract would be to enforce a contract they never made."

[3] Applying the test to the present facts, the government decree of 14 March was wholly non-foreseeable. Crucially, Clause 14 contains no force majeure allocation for sovereign trade embargoes. Consequently, under s 1(2) of the Law Reform (Frustrated Contracts) Act 1943, all sums paid or payable before discharge are recoverable, subject to the court's discretion regarding incurred expenses (Gamerco SA v ICM/Fair Warning (Agency) Ltd [1995] 1 WLR 1226).`
    },
    {
        id: "nursing-gibbs-clinical",
        title: "Clinical Placement Reflection: Post-Operative Sepsis Identification",
        subject: "Nursing & Health Sciences",
        style: "Harvard (Cite Them Right)",
        level: "Undergraduate (BSc Nursing Yr 3)",
        grade: "1st Class (82%)",
        words: "2,000 words",
        description: "Reflective portfolio piece integrating Gibbs' Reflective Cycle (1988) with the National Early Warning Score 2 (NEWS2) escalation pathway and NICE NG51 sepsis protocols.",
        excerpt: `1. Description of the Clinical Encounter
During my ward placement in acute surgical care, I was assigned to monitor a 68-year-old post-hemicolectomy patient on Day 2 recovery. At 14:00, routine observations indicated an elevated heart rate (114 bpm), respiratory rate (24 bpm), and a core temperature of 38.6°C. The NEWS2 score aggregated to 7, signaling a medium-to-high clinical risk tier.

2. Feelings and Clinical Reasoning
Initially, I felt a surge of anxiety recognizing early signs of systemic inflammatory response syndrome (SIRS). However, recalling the 'Sepsis Six' pathway (NICE 2016), I prioritized immediate escalation to the charge nurse rather than assuming physiological post-surgical fluctuation.

3. Evaluation and Synthesis
Reflecting upon Gibbs (1988), the encounter demonstrated that timely physiological tracking directly mitigates septic shock progression. Immediate blood cultures, intravenous broad-spectrum antimicrobials, and fluid resuscitation were initiated within the golden hour, corroborating the clinical governance benchmarks mandated by the Nursing and Midwifery Council (NMC 2018) Code.`
    },
    {
        id: "mba-strategic-lit-review",
        title: "Digital Platform Ecosystems & Competitive Advantage: A Systematic Literature Review",
        subject: "Business & MBA Management",
        style: "APA 7th Edition",
        level: "Master's (MBA)",
        grade: "Distinction (76%)",
        words: "3,500 words",
        description: "PRISMA-compliant literature synthesis evaluating two-sided network externalities, multi-homing costs, and dynamic capabilities in platform-mediated competition.",
        excerpt: `Introduction & Conceptual Foundations
Platform ecosystems represent a paradigmatic shift from traditional pipeline business architectures (Eisenmann et al., 2006). By intermediating multi-sided markets, platform leaders generate value through indirect network externalities rather than internalized asset control (Parker et al., 2016; Cusumano et al., 2019).

Theoretical Synthesis: Network Externalities vs. Multi-Homing
The literature reveals a critical dichotomy regarding the sustainability of platform competitive advantage. While early scholars (Rochet & Tirole, 2003; Armstrong, 2006) posited that high user volumes create insurmountable 'winner-take-all' barriers, contemporary empirical inquiries demonstrate that multi-homing—the practice where consumers simultaneously engage multiple competing platforms—substantially erodes platform defensibility (Cennamo & Santalo, 2013). Consequently, firms must cultivate dynamic platform capabilities (Teece, 2018), orchestrating complementor innovation rather than merely commoditizing supply.`
    },
    {
        id: "cs-distributed-systems",
        title: "Empirical Analysis of Raft Consensus Protocol Under Asymmetric Network Partitions",
        subject: "Computer Science & IT",
        style: "IEEE Citation Format",
        level: "Postgraduate (MSc Advanced CS)",
        grade: "1st Class (85%)",
        words: "3,000 words",
        description: "Experimental research evaluating leader election latency, split-vote recovery overhead, and Byzantine fault handling in distributed state machine replication.",
        excerpt: `I. INTRODUCTION
Distributed consensus algorithms form the bedrock of fault-tolerant state machine replication (SMR) [1]. While Paxos historically provided the theoretical standard for consensus, its operational complexity hindered provable correctness in production systems [2]. Ongaro and Ousterhout introduced Raft [3] to decompose consensus into distinct, verifiable invariants: leader election, log replication, and safety.

II. EXPERIMENTAL METHODOLOGY & PARTITION SIMULATION
To evaluate Raft's resilience against asymmetric network partitioning, we constructed a 5-node cluster deployed across geographically disparate AWS regions (us-east-1, eu-west-1, ap-southeast-1). Using Linux netem (Network Emulation) and iptables rules, we simulated split-brain conditions where candidate nodes retain connectivity to a minority partition while isolated from the majority quorum. The election timeout randomized window was calibrated between 150ms and 300ms to evaluate heart-beat synchronization stability.`
    }
];

const Samples = () => {
    const [activeTab, setActiveTab] = useState(SAMPLES[0].id);
    const activeSample = SAMPLES.find(s => s.id === activeTab) || SAMPLES[0];

    const samplesSchema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "Academic Wizard Scholarly Writing Samples",
        "description": "Peer-reviewed, redacted university writing samples showcasing 1st Class dissertation chapters, legal problem questions, and systematic literature reviews.",
        "url": "https://academicwizard.online/samples/"
    };

    return (
        <div className="page-samples min-h-screen bg-bg-primary text-text-primary">
            <Helmet>
                <title>Academic Writing Samples (1st Class Examples) | Academic Wizard</title>
                <meta name="description" content="Explore redacted 1st-class academic writing samples across Law (OSCOLA), Nursing (Gibbs), MBA (APA 7th), and Computer Science (IEEE). Verify our PhD standard." />
                <link rel="canonical" href="https://academicwizard.online/samples/" />
                <meta property="og:title" content="Academic Writing Samples (1st Class Examples) | Academic Wizard" />
                <meta property="og:description" content="Read redacted 1st-class university coursework samples across Law, Nursing, Business, and STEM formatted to APA, Harvard, OSCOLA, and IEEE standards." />
                <meta property="og:url" content="https://academicwizard.online/samples/" />
                <meta property="og:type" content="website" />
                <meta property="og:image" content="https://academicwizard.online/academic-wizard-favicon.webp" />
                <script type="application/ld+json">
                    {JSON.stringify(samplesSchema)}
                </script>
            </Helmet>

            <PageHeader
                title="Curated Scholarly Writing Samples"
                subtitle="Evaluate our standard of critical analysis, academic referencing, and thesis methodology before placing your order."
                breadcrumbs={[
                    { name: 'Home', url: '/' },
                    { name: 'Samples', url: '/samples/' }
                ]}
                ctaText="💬 Request a Custom Sample on WhatsApp"
                ctaLink="https://wa.me/919509893638?text=Hello%20Academic%20Wizard!%20I'm%20viewing%20your%20samples%20and%20would%20like%20to%20see%20examples%20for%20my%20specific%20subject."
            />

            {/* Quality Standard Bar */}
            <section className="py-10 bg-bg-secondary border-y border-glass-border">
                <div className="container px-6 max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-6 text-xs text-text-secondary">
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={18} className="text-accent-gold" />
                        <span><strong>Redacted for Confidentiality:</strong> Student identities & institutional names removed</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Award size={18} className="text-accent-gold" />
                        <span><strong>1st Class Quality:</strong> Every sample achieved Distinction (70%+)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle2 size={18} className="text-accent-gold" />
                        <span><strong>100% Turnitin-Safe:</strong> Clean originality report verified</span>
                    </div>
                </div>
            </section>

            {/* Samples Viewer */}
            <section className="py-16 bg-bg-primary">
                <div className="container px-6 max-w-7xl mx-auto space-y-10">
                    {/* Tab Selectors */}
                    <div className="flex flex-wrap gap-3 border-b border-white/10 pb-4">
                        {SAMPLES.map((sample) => (
                            <button
                                key={sample.id}
                                onClick={() => setActiveTab(sample.id)}
                                className={`px-5 py-3 rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                                    activeTab === sample.id
                                        ? 'bg-accent-gold text-black shadow-lg shadow-accent-gold/20'
                                        : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
                                }`}
                                style={activeTab === sample.id ? { backgroundColor: 'var(--accent-gold)' } : {}}
                            >
                                <FileText size={14} />
                                <span>{sample.subject.split(' ')[0]} ({sample.style.split(' ')[0]})</span>
                            </button>
                        ))}
                    </div>

                    {/* Active Sample Card */}
                    <div className="glass-card p-8 md:p-12 rounded-3xl border border-glass-border shadow-2xl space-y-8">
                        {/* Sample Metadata */}
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-white/10 pb-8">
                            <div className="space-y-2">
                                <span className="text-[11px] font-mono uppercase tracking-[2px] text-accent-gold font-bold block" style={{ color: 'var(--accent-gold)' }}>
                                    {activeSample.subject} · {activeSample.level}
                                </span>
                                <h2 className="text-2xl md:text-3xl font-bold font-heading text-white">
                                    {activeSample.title}
                                </h2>
                                <p className="text-xs md:text-sm text-text-secondary max-w-3xl leading-relaxed">
                                    {activeSample.description}
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2 shrink-0">
                                <span className="px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-mono">
                                    {activeSample.grade}
                                </span>
                                <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/80 text-xs font-mono">
                                    {activeSample.style}
                                </span>
                                <span className="px-3 py-1.5 rounded-lg bg-accent-gold/10 border border-accent-gold/20 text-accent-gold text-xs font-mono" style={{ color: 'var(--accent-gold)' }}>
                                    {activeSample.words}
                                </span>
                            </div>
                        </div>

                        {/* Sample Content Paper Box */}
                        <div className="bg-black/50 border border-white/10 rounded-2xl p-6 md:p-10 font-serif leading-relaxed text-sm md:text-base text-white/90 space-y-4 shadow-inner">
                            <div className="font-mono text-[11px] text-accent-gold uppercase tracking-widest pb-3 border-b border-white/10 flex items-center justify-between" style={{ color: 'var(--accent-gold)' }}>
                                <span>Academic Text Excerpt</span>
                                <span className="text-white/40">Redacted Academic Deliverable</span>
                            </div>
                            <div className="whitespace-pre-line leading-loose text-white/80 font-sans text-sm md:text-base">
                                {activeSample.excerpt}
                            </div>
                        </div>

                        {/* Call to Action Footer */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-white/10">
                            <div>
                                <h3 className="text-lg font-bold font-heading text-white mb-1">
                                    Need the Same Scholarly Standard for Your Assignment?
                                </h3>
                                <p className="text-xs text-text-secondary">
                                    Our verified PhD specialists draft according to your university rubric with guaranteed Turnitin-safe originality.
                                </p>
                            </div>
                            <a
                                href={`https://wa.me/919509893638?text=${encodeURIComponent(`Hello Academic Wizard! I reviewed your sample on "${activeSample.title}" and would like to hire a PhD writer for a similar standard paper.`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary inline-flex items-center gap-2 px-8 py-4 text-xs font-bold uppercase tracking-wider shrink-0 shadow-lg hover:shadow-accent-gold/20"
                            >
                                <MessageCircle size={16} />
                                <span>Get 1st Class Paper Quote</span>
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Samples;
