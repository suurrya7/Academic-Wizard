import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

const ThemeToggle = ({ className = '' }) => {
    const { theme, toggleTheme, isAuto } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'Day' : 'Night'} Mode`}
            title={`Current: ${theme === 'dark' ? 'Night (Dark)' : 'Day (Light)'} Mode${isAuto ? ' (Auto-Scheduled)' : ''}`}
            className={`relative p-2 rounded-xl transition-all duration-300 flex items-center justify-center border ${
                theme === 'dark' 
                    ? 'bg-white/5 border-white/10 text-accent-gold hover:bg-white/10 hover:border-accent-gold/40' 
                    : 'bg-slate-100 border-slate-300 text-amber-600 hover:bg-slate-200 hover:border-amber-500/40 shadow-sm'
            } ${className}`}
        >
            <motion.div
                initial={false}
                animate={{ rotate: theme === 'dark' ? 0 : 180, scale: [0.8, 1.1, 1] }}
                transition={{ duration: 0.3 }}
            >
                {theme === 'dark' ? (
                    <Moon size={18} className="text-accent-gold" />
                ) : (
                    <Sun size={18} className="text-amber-500" />
                )}
            </motion.div>
            {isAuto && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-accent-gold animate-pulse" title="Auto Day/Night Mode Active" />
            )}
        </button>
    );
};

export default ThemeToggle;
