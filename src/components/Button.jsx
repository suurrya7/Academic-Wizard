import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, onClick, type = 'primary', className = '', ...props }) => {
    const baseStyles = "px-10 py-4 font-heading text-xs tracking-[3px] uppercase transition-all duration-300 relative overflow-hidden group";

    const types = {
        primary: "bg-accent-gold text-black hover:shadow-[0_0_30px_rgba(212,175,55,0.6)]",
        outline: "border border-accent-gold text-accent-gold hover:bg-accent-gold hover:text-black",
        ghost: "text-white hover:text-accent-gold",
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`${baseStyles} ${types[type]} ${className}`}
            {...props}
        >
            <span className="relative z-10">{children}</span>
            {type === 'primary' && (
                <motion.div
                    className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                />
            )}
        </motion.button>
    );
};

export default Button;
