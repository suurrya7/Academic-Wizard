import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, GraduationCap } from 'lucide-react';
import Button from './Button';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Services', path: '/services' },
        { name: 'About Us', path: '/about' },
        { name: 'FAQs', path: '/faq' },
        { name: 'Blog', path: '/blog' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${scrolled ? 'py-4 bg-black/80 backdrop-blur-xl border-b border-white/10' : 'py-8'}`}>
            <div className="container mx-auto px-6 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-3 group">
                    <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.8 }}
                        className="w-12 h-12 bg-accent-gold rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                        style={{ backgroundColor: 'var(--accent-gold)' }}
                    >
                        <GraduationCap color="black" size={28} />
                    </motion.div>
                    <span className="text-xl font-bold tracking-[3px] font-heading group-hover:text-accent-gold transition-colors">
                        ACADEMIC <span className="text-accent-gold" style={{ color: 'var(--accent-gold)' }}>WIZARD</span>
                    </span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center space-x-12 lg:space-x-16">
                    {navLinks && navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`text-[11px] uppercase tracking-[3px] font-heading transition-all hover:text-accent-gold relative group ${(location && location.pathname === link.path) ? 'text-accent-gold' : 'text-white/70'}`}
                        >
                            {link.name}
                            <span className={`absolute -bottom-2 left-0 h-[1px] bg-accent-gold transition-all duration-300 ${(location && location.pathname === link.path) ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                        </Link>
                    ))}
                    {Button && (
                        <Link to="/contact">
                            <Button type="outline" className="px-8 py-3 text-[10px]">
                                Order Now
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={30} /> : <Menu size={30} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-full left-0 w-full bg-bg-primary/95 backdrop-blur-xl border-b border-glass-border flex flex-col items-center py-10 gap-6"
                        style={{ backgroundColor: 'rgba(15, 15, 15, 0.95)' }}
                    >
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className={`text-lg uppercase tracking-widest font-heading transition-colors hover:text-accent-gold ${location.pathname === link.path ? 'text-accent-gold' : 'text-white'}`}
                                style={{ color: location.pathname === link.path ? 'var(--accent-gold)' : 'white' }}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
