import React from 'react';
import { motion } from 'framer-motion';
import Breadcrumbs from './Breadcrumbs';

const PageHeader = ({ title, subtitle, breadcrumbs }) => {
    return (
        <section className="pt-40 pb-20 relative overflow-hidden">
            <div className="container px-6 text-center relative z-10 flex flex-col items-center">
                {breadcrumbs && (
                    <div className="w-full flex justify-center mb-8">
                        <Breadcrumbs paths={breadcrumbs} />
                    </div>
                )}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl md:text-7xl font-bold mb-8"
                >
                    {title}
                </motion.h1>
                {subtitle && (
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-text-secondary text-lg max-w-2xl mx-auto leading-relaxed"
                        style={{ color: 'var(--text-secondary)' }}
                    >
                        {subtitle}
                    </motion.p>
                )}
            </div>
            <div className="absolute top-0 left-0 w-full h-full bg-accent-gold/5 -z-10" style={{ backgroundColor: 'rgba(212, 175, 55, 0.05)' }} />
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-glass-border to-transparent" />
        </section>
    );
};

export default PageHeader;
