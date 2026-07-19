import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const CustomCursor = () => {
    const [hovered, setHovered] = useState(false);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 25, stiffness: 400 };

    const cursorX = useSpring(mouseX, springConfig);
    const cursorY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const moveMouse = (e) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        const handleHover = (e) => {
            const target = e.target;
            const isClickable = target.closest('button') ||
                target.closest('a') ||
                target.closest('.interactive') ||
                target.tagName === 'BUTTON' ||
                target.tagName === 'A';

            if (isClickable) {
                setHovered(true);
            } else {
                setHovered(false);
            }
        };

        window.addEventListener('mousemove', moveMouse);
        window.addEventListener('mouseover', handleHover);

        return () => {
            window.removeEventListener('mousemove', moveMouse);
            window.removeEventListener('mouseover', handleHover);
        };
    }, [mouseX, mouseY]);

    return (
        <div className="fixed top-0 left-0 pointer-events-none z-[9999]">
            {/* Glowing Aura Effect */}
            <motion.div
                className="absolute rounded-full"
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: '-50%',
                    translateY: '-50%',
                    width: hovered ? 140 : 70,
                    height: hovered ? 140 : 70,
                    borderRadius: '50%',
                    background: hovered ? 'radial-gradient(circle, rgba(212, 175, 55, 0.4) 0%, rgba(212, 175, 55, 0) 70%)' : 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0) 70%)',
                    filter: 'blur(8px)',
                }}
                animate={{
                    scale: hovered ? 1.2 : 1,
                }}
                transition={{ duration: 0.3 }}
            />

            {/* Fairy Star Wand Cursor */}
            <motion.div
                className="absolute"
                style={{
                    x: mouseX, 
                    y: mouseY,
                    translateX: '-4px', // Align star tip to cursor coordinate
                    translateY: '-4px',
                }}
                animate={{
                    scale: hovered ? 1.2 : 1,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
                <div className="relative drop-shadow-[0_0_10px_rgba(255,215,0,0.8)]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#ffd700" stroke="#b8860b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        {/* Stick */}
                        <line x1="22" y1="22" x2="8" y2="8" stroke="#d4af37" strokeWidth="3" />
                        {/* Star */}
                        <polygon points="5 1 6.5 4 10 4.5 7.5 7 8 10.5 5 9 2 10.5 2.5 7 0 4.5 3.5 4" fill="#ffd700" stroke="#fff" strokeWidth="1"/>
                    </svg>
                    {/* Sparkles that appear on hover */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0 }}
                        className="absolute -top-1 -right-3 text-accent-gold"
                    >
                        <Sparkles size={16} strokeWidth={2.5} className="animate-pulse" />
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default CustomCursor;
