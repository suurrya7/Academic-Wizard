import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Button from './Button';
import ThemeToggle from './ThemeToggle';
import academicWizardFavicon from '../assets/academic-wizard-favicon.webp';

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
        { name: 'Services', path: '/services/' },
        { name: 'Free Tools', path: '/tools/' },
        { name: 'About Us', path: '/about/' },
        { name: 'FAQs', path: '/faq/' },
        { name: 'Blog', path: '/blog/' },
        { name: 'Contact', path: '/contact/' },
    ];

    return (
        <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${scrolled ? 'py-4 bg-bg-primary/90 backdrop-blur-xl border-b border-glass-border shadow-lg' : 'py-8'}`}>
            <div className="container mx-auto px-6 flex justify-between items-center">
                <Link to="/" className="flex items-center group" aria-label="Academic Wizard home">
                    <motion.div
                        whileHover={{ scale: 1.04 }}
                        transition={{ duration: 0.8 }}
                        className="h-14 w-14 sm:h-16 sm:w-16 flex items-center justify-center"
                    >
                        <img
                            src={academicWizardFavicon}
                            alt="Academic Wizard"
                            width="64"
                            height="64"
                            className="h-full w-full object-contain"
                        />
                    </motion.div>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center space-x-8 lg:space-x-12">
                    {navLinks && navLinks.map((link) => {
                        const isActive = link.path === '/' 
                            ? location?.pathname === '/' 
                            : location?.pathname?.startsWith(link.path);
                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`text-[11px] uppercase tracking-[3px] font-heading transition-all hover:text-accent-gold relative group ${isActive ? 'text-accent-gold' : 'text-text-primary/70'}`}
                            >
                                {link.name}
                                <span className={`absolute -bottom-2 left-0 h-[1px] bg-accent-gold transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                            </Link>
                        );
                    })}
                    
                    <ThemeToggle />

                    {Button && (
                        <Link to="/contact">
                            <Button type="outline" className="px-8 py-3 text-[10px]">
                                Order Now
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Mobile Actions: ThemeToggle + Hamburger */}
                <div className="flex md:hidden items-center gap-3">
                    <ThemeToggle />
                    <button 
                        className="text-text-primary" 
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label={isOpen ? "Close menu" : "Open menu"}
                    >
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-full left-0 w-full bg-bg-primary/95 backdrop-blur-xl border-b border-glass-border shadow-2xl flex flex-col items-center py-8 gap-5"
                    >
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className={`text-base uppercase tracking-widest font-heading transition-colors hover:text-accent-gold ${
                                    location.pathname === link.path ? 'text-accent-gold font-bold' : 'text-text-primary'
                                }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link 
                            to="/contact/" 
                            onClick={() => setIsOpen(false)}
                            className="mt-2"
                        >
                            <Button type="outline" className="px-8 py-3 text-xs">
                                Order Now
                            </Button>
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
