import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Users, Clock, ShieldCheck, CheckCircle } from 'lucide-react';

const stats = [
    { icon: GraduationCap, label: 'Academic Projects Assisted', value: '5000+' },
    { icon: Users, label: 'Expert Academic Writers', value: '650+' },
    { icon: Clock, label: 'On-Time Delivery Rate', value: '98%' },
    { icon: ShieldCheck, label: 'Student Support', value: '24/7' },
    { icon: CheckCircle, label: 'Confidential Service', value: '100%' },
];

const TrustStats = () => {
    return (
        <section className="bg-bg-secondary/50 py-20 border-y border-glass-border" style={{ backgroundColor: 'rgba(22, 22, 22, 0.5)' }}>
            <div className="container px-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="flex flex-col items-center text-center group"
                    >
                        <div className="w-14 h-14 rounded-full bg-accent-gold/10 flex items-center justify-center mb-6 group-hover:bg-accent-gold group-hover:text-black transition-all duration-500 text-accent-gold" style={{ color: 'var(--accent-gold)' }}>
                            <stat.icon size={28} />
                        </div>
                        <h3 className="text-3xl font-bold font-heading mb-2 text-white">{stat.value}</h3>
                        <p className="text-text-secondary text-xs uppercase tracking-widest leading-loose" style={{ color: 'var(--text-secondary)' }}>
                            {stat.label}
                        </p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default TrustStats;
