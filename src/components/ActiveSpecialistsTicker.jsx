import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, X, MessageSquare, GraduationCap } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const REAL_DELIVERIES = [
    {
        id: 1,
        code: "NUR3105",
        title: "Clinical Nursing Assessment & Care Plan",
        stream: "Evidence-Based Clinical Practice (SNB / NHS Standards)",
        university: "National University of Singapore (NUS)",
        country: "🇸🇬 Singapore",
        specialist: "Dr. Sarah T., RN, PhD",
        subject: "Nursing"
    },
    {
        id: 2,
        code: "LAW4002",
        title: "Commercial Equity & Trusts Case Brief",
        stream: "Doctrinal Analysis (OSCOLA 4th Edition)",
        university: "University of Oxford",
        country: "🇬🇧 United Kingdom",
        specialist: "Adv. Richard K., BCL (Oxon)",
        subject: "Law"
    },
    {
        id: 3,
        code: "ACC30002",
        title: "Corporate Financial Reporting & Valuation",
        stream: "AASB 15/16 Compliance & Ledger Reconciliation",
        university: "University of Melbourne",
        country: "🇦🇺 Australia",
        specialist: "Marcus L., CPA Australia",
        subject: "Accounting"
    },
    {
        id: 4,
        code: "CS5008",
        title: "Distributed Cloud Systems & AI Architecture",
        stream: "Scalable Microservices with Full Test Suite",
        university: "University of Toronto",
        country: "🇨🇦 Canada",
        specialist: "Dr. Alex V., PhD in Computer Science",
        subject: "Computer Science"
    },
    {
        id: 5,
        code: "PSY8010",
        title: "Cognitive Neuropsychology Empirical Study",
        stream: "SPSS Multivariate Regression & APA 7th Synthesis",
        university: "University College London (UCL)",
        country: "🇬🇧 United Kingdom",
        specialist: "Dr. Elena M., PhD",
        subject: "Psychology"
    },
    {
        id: 6,
        code: "ENG6200",
        title: "Renewable Energy & Thermal Fluid Mechanics",
        stream: "MATLAB Simulation & Computational Modeling",
        university: "Technical University of Munich (TUM)",
        country: "🇩🇪 Germany",
        specialist: "Prof. Hans W., Dr.-Ing.",
        subject: "Engineering"
    },
    {
        id: 7,
        code: "BMG4050",
        title: "Executive Strategic Management & Market Entry",
        stream: "Global Supply Chain & Corporate Strategy",
        university: "Trinity College Dublin",
        country: "🇮🇪 Ireland",
        specialist: "Liam O., MBA (INSEAD)",
        subject: "Business / MBA"
    },
    {
        id: 8,
        code: "FIN8820",
        title: "Quantitative Derivatives & Financial Risk Analysis",
        stream: "Black-Scholes Modeling & Portfolio Optimization",
        university: "New York University (NYU Stern)",
        country: "🇺🇸 United States",
        specialist: "Dr. Raymond C., CFA",
        subject: "Finance"
    }
];

const ActiveSpecialistsTicker = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    const [isHovered, setIsHovered] = useState(false);
    const [dynamicTime, setDynamicTime] = useState("Just now");
    const { theme } = useTheme();

    useEffect(() => {
        if (isHovered) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => {
                const nextIndex = (prev + 1) % REAL_DELIVERIES.length;
                // Generate natural rolling time offset
                const mins = (nextIndex * 3 + 2);
                setDynamicTime(nextIndex === 0 ? "Just now" : `${mins} mins ago`);
                return nextIndex;
            });
        }, 18000);
        return () => clearInterval(timer);
    }, [isHovered]);

    if (!isVisible) return null;

    const item = REAL_DELIVERIES[currentIndex];
    const whatsappUrl = `https://wa.me/919509893638?text=Hello%20Academic%20Wizard,%20I%20saw%20your%20verified%20${encodeURIComponent(item.subject)}%20faculty%20for%20${encodeURIComponent(item.code)}%20and%20need%20assistance.`;

    return (
        <aside aria-label="Live academic delivery notifications" className="fixed bottom-6 left-6 z-50 max-w-sm hidden sm:block">
            <AnimatePresence mode="wait">
                <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -15, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className={`relative p-4 rounded-2xl backdrop-blur-xl border shadow-2xl transition-all ${
                        theme === "dark"
                            ? "bg-[#121212]/95 border-accent-gold/30 text-white shadow-[0_10px_30px_rgba(0,0,0,0.6)]"
                            : "bg-white/95 border-slate-200 text-slate-900 shadow-[0_10px_30px_rgba(0,0,0,0.12)]"
                    }`}
                >
                    <button
                        onClick={() => setIsVisible(false)}
                        className="absolute top-2.5 right-2.5 text-text-secondary hover:text-text-primary p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                        aria-label="Dismiss live notification"
                    >
                        <X size={14} />
                    </button>

                    <div className="flex items-start gap-3">
                        <div className="relative shrink-0 mt-0.5">
                            <div className="w-10 h-10 rounded-xl bg-accent-gold/15 border border-accent-gold/40 flex items-center justify-center text-accent-gold">
                                <GraduationCap size={22} />
                            </div>
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-black dark:ring-black animate-pulse" />
                        </div>

                        <div className="pr-4 flex-1 text-left">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className="px-1.5 py-0.5 rounded bg-accent-gold/20 text-accent-gold font-mono font-bold text-[10px]">
                                    {item.code}
                                </span>
                                <span className="text-[11px] font-bold text-text-primary font-heading line-clamp-1">
                                    {item.title}
                                </span>
                                <span className="text-[10px] text-text-secondary font-mono">
                                    • {dynamicTime}
                                </span>
                            </div>

                            <p className="text-xs text-text-secondary leading-snug mb-1 font-medium line-clamp-1">
                                {item.stream}
                            </p>

                            <div className="text-[10px] text-accent-gold font-semibold mb-2">
                                🎓 {item.university}
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-glass-border text-[11px]">
                                <span className="text-[10px] text-text-secondary truncate max-w-[170px]">
                                    {item.country}
                                </span>
                                <a
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 font-bold text-accent-gold hover:underline text-[11px]"
                                >
                                    <MessageSquare size={12} /> Hire Specialist
                                </a>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </aside>
    );
};

export default ActiveSpecialistsTicker;
