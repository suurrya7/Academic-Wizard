import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Book, Sparkles, Pencil, ArrowRight } from 'lucide-react';

const CustomCursor = () => {
    const [hovered, setHovered] = useState(false);
    const [cursorType, setCursorType] = useState('default');

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth spring physics for premium feel
    const outerSpringConfig = { damping: 20, stiffness: 250 };
    const innerSpringConfig = { damping: 30, stiffness: 800 };

    const outerX = useSpring(mouseX, outerSpringConfig);
    const outerY = useSpring(mouseY, outerSpringConfig);

    const innerX = useSpring(mouseX, innerSpringConfig);
    const innerY = useSpring(mouseY, innerSpringConfig);

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

            if (target.closest('.service-card')) setCursorType('sparkle');
            else if (target.closest('input') || target.closest('textarea')) setCursorType('pencil');
            else if (target.closest('.cta-button')) setCursorType('arrow');
            else setCursorType('default');
        };

        window.addEventListener('mousemove', moveMouse);
        window.addEventListener('mouseover', handleHover);

        return () => {
            window.removeEventListener('mousemove', moveMouse);
            window.removeEventListener('mouseover', handleHover);
        };
    }, []);

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 9999 }}>
            {/* Outer Ring - Dynamic & Smooth */}
            <motion.div
                style={{
                    x: outerX,
                    y: outerY,
                    translateX: '-50%',
                    translateY: '-50%',
                    width: hovered ? 70 : 35,
                    height: hovered ? 70 : 35,
                    borderRadius: '50%',
                    border: '1.5px solid #D4AF37',
                    boxShadow: hovered ? '0 0 25px rgba(212, 175, 55, 0.4)' : 'none',
                    backgroundColor: hovered ? 'rgba(212, 175, 55, 0.05)' : 'transparent',
                    position: 'absolute',
                }}
                animate={{
                    scale: hovered ? 1.2 : 1,
                    opacity: 1,
                }}
            />

            {/* Inner Dot / Icon Container */}
            <motion.div
                style={{
                    x: innerX,
                    y: innerY,
                    translateX: '-50%',
                    translateY: '-50%',
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                animate={{
                    scale: hovered ? 0.8 : 1,
                }}
            >
                <div className="relative flex items-center justify-center">
                    {/* Inner Gold Dot */}
                    <div
                        className="w-1.5 h-1.5 bg-accent-gold rounded-full"
                        style={{
                            display: hovered ? 'none' : 'block',
                            backgroundColor: 'var(--accent-gold)'
                        }}
                    />

                    {/* Hover Icons */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{
                            opacity: hovered ? 1 : 0,
                            scale: hovered ? 1 : 0
                        }}
                        className="text-accent-gold"
                        style={{ color: 'var(--accent-gold)' }}
                    >
                        {cursorType === 'default' && <Book size={18} strokeWidth={2.5} />}
                        {cursorType === 'sparkle' && <Sparkles size={22} strokeWidth={2} />}
                        {cursorType === 'pencil' && <Pencil size={18} strokeWidth={2.5} />}
                        {cursorType === 'arrow' && <ArrowRight size={22} strokeWidth={2.5} />}
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default CustomCursor;
