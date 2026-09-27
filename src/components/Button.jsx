import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, onClick, type = 'primary', variant, className = '', ...props }) => {
    const baseStyles = "px-10 py-4 font-heading text-xs tracking-[3px] uppercase transition-all duration-300 relative overflow-hidden group";

    const types = {
        primary: "bg-accent-gold text-black hover:shadow-[0_0_30px_rgba(212,175,55,0.6)]",
        outline: "border border-accent-gold text-accent-gold hover:bg-accent-gold hover:text-black",
        ghost: "text-white hover:text-accent-gold",
    };

    const isHtmlButtonType = ['submit', 'button', 'reset'].includes(type);
    const resolvedVariant = variant || (isHtmlButtonType ? 'primary' : type);
    const htmlType = isHtmlButtonType ? type : (props.buttonType || 'button');

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            type={htmlType}
            className={`${baseStyles} ${types[resolvedVariant] || types.primary} ${className}`}
            {...props}
        >
            <span className="relative z-10">{children}</span>
            {resolvedVariant === 'primary' && (
                <motion.div
                    className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                />
            )}
        </motion.button>
    );
};

export default Button;
