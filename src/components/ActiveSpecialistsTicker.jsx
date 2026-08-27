import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, X, MessageSquare } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const NOTIFICATIONS = [
    {
        id: 1,
        title: "Nursing Dissertation Verified",
        detail: "Master's Nursing Care Plan (UK) verified with 0% Turnitin AI",
        specialist: "Dr. Claire M. (NHS Clinical Consultant)",
        country: "🇬🇧 London, UK",
        time: "2 mins ago",
        subject: "Nursing"
    },
    {
        id: 2,
        title: "Commercial Law Brief Delivered",
        detail: "OSCOLA 4th ed. legal analysis delivered (High Distinction grade)",
        specialist: "Adv. David K., LL.M. (Oxon)",
        country: "🇨🇦 Toronto, Canada",
        time: "6 mins ago",
        subject: "Law"
    },
    {
        id: 3,
        title: "SPSS Dissertation Analysis Completed",
        detail: "Regression & hypothesis testing for Master's Business thesis",
        specialist: "Dr. Aisha P. (Senior Biostatistician)",
        country: "🇸🇬 Singapore (NUS)",
        time: "11 mins ago",
        subject: "Data Analysis"
    },
    {
        id: 4,
        title: "Accounting AASB Project Accepted",
        detail: "Corporate finance valuation model & ledger reconciliation",
        specialist: "Marcus T., CPA Australia",
        country: "🇦🇺 Melbourne, Australia",
        time: "18 mins ago",
        subject: "Accounting"
    },
    {
        id: 5,
        title: "Computer Science Algorithm Documented",
        detail: "Clean Python full-stack implementation with clean test suite",
        specialist: "Alex V., Ph.D. (AI Systems)",
        country: "🇺🇸 California, USA",
        time: "24 mins ago",
        subject: "Computer Science"
    }
];

const ActiveSpecialistsTicker = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    const [isHovered, setIsHovered] = useState(false);
    const { theme } = useTheme();

    useEffect(() => {
        if (isHovered) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % NOTIFICATIONS.length);
        }, 7000);
        return () => clearInterval(timer);
    }, [isHovered]);

    if (!isVisible) return null;

    const item = NOTIFICATIONS[currentIndex];
    const whatsappUrl = `https://wa.me/919509893638?text=Hello%20Academic%20Wizard,%20I%20saw%20your%20verified%20${encodeURIComponent(item.subject)}%20specialist%20and%20need%20help%20with%20my%20assignment.`;

    return (
        <aside aria-label="Live activity notifications" className="fixed bottom-6 left-6 z-50 max-w-sm hidden sm:block">
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
                            ? "bg-[#121212]/90 border-accent-gold/30 text-white shadow-[0_10px_30px_rgba(0,0,0,0.6)]"
                            : "bg-white/95 border-slate-200 text-slate-900 shadow-[0_10px_30px_rgba(0,0,0,0.12)]"
                    }`}
                >
                    <button
                        onClick={() => setIsVisible(false)}
                        className="absolute top-2.5 right-2.5 text-white/50 hover:text-white dark:hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
                        aria-label="Dismiss live notification"
                    >
                        <X size={14} />
                    </button>

                    <div className="flex items-start gap-3">
                        <div className="relative shrink-0 mt-0.5">
                            <div className="w-9 h-9 rounded-xl bg-accent-gold/15 border border-accent-gold/40 flex items-center justify-center text-accent-gold">
                                <ShieldCheck size={20} />
                            </div>
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-black animate-pulse" />
                        </div>

                        <div className="pr-4 flex-1 text-left">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-accent-gold font-heading">
                                    {item.title}
                                </span>
                                <span className="text-[10px] opacity-60 font-mono">
                                    • {item.time}
                                </span>
                            </div>

                            <p className="text-xs opacity-90 leading-snug mb-2 font-medium">
                                {item.detail}
                            </p>

                            <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[11px]">
                                <span className="text-[10px] opacity-75 truncate max-w-[170px]">
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
