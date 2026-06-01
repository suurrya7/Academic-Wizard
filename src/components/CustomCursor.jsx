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
        <div style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 9999 }}>
            {/* Glowing Aura Effect */}
            <motion.div
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: '-50%',
                    translateY: '-50%',
                    position: 'absolute',
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

            {/* Magic Wand Cursor */}
            <motion.div
                style={{
                    x: mouseX, 
                    y: mouseY,
                    position: 'absolute',
                    translateX: '-2px', // Align wand tip closely to actual cursor coordinate
                    translateY: '-2px',
                }}
                animate={{
                    scale: hovered ? 1.2 : 1,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
                <div className="relative drop-shadow-[0_0_12px_rgba(212,175,55,0.8)]">
                    <img src="/custom-wand.png" alt="Wand" className="w-12 h-12 object-contain pointer-events-none" />
                    {/* Sparkles that appear on hover */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0 }}
                        className="absolute -top-3 -right-3 text-accent-gold"
                    >
                        <Sparkles size={16} strokeWidth={2.5} className="animate-pulse" />
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default CustomCursor;
