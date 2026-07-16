import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Award, ThumbsUp, Linkedin, Facebook, Instagram } from 'lucide-react';
import academicWizardLogo from '../assets/academic-wizard-logo.webp';

const Footer = () => {
    return (
        <footer className="bg-bg-secondary pt-20 pb-10 border-t border-glass-border" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <div className="container px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 mb-20">
                <div className="flex flex-col gap-6">
                    <Link to="/" className="block w-[190px]" aria-label="Academic Wizard home">
                        <img
                            src={academicWizardLogo}
                            alt="Academic Wizard"
                            width="190"
                            height="45"
                            className="h-auto w-full object-contain"
                        />
                    </Link>
                    <p className="text-text-secondary text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        Supporting university students worldwide with professional academic guidance and research assistance. Trusted for quality and confidentiality.
                    </p>
                    <div className="flex gap-4 mt-2">
                        <a 
                            href="https://www.linkedin.com/company/academic-wizard" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="w-10 h-10 bg-white/5 border border-white/10 hover:border-accent-gold rounded-lg flex items-center justify-center text-text-secondary hover:text-accent-gold transition-all duration-300"
                            style={{ color: 'var(--text-secondary)' }}
                            aria-label="LinkedIn"
                        >
                            <Linkedin size={18} />
                        </a>
                        <a 
                            href="https://www.facebook.com/academics.wizard" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="w-10 h-10 bg-white/5 border border-white/10 hover:border-accent-gold rounded-lg flex items-center justify-center text-text-secondary hover:text-accent-gold transition-all duration-300"
                            style={{ color: 'var(--text-secondary)' }}
                            aria-label="Facebook"
                        >
                            <Facebook size={18} />
                        </a>
                        <a 
                            href="https://www.instagram.com/_academic.wizard_" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="w-10 h-10 bg-white/5 border border-white/10 hover:border-accent-gold rounded-lg flex items-center justify-center text-text-secondary hover:text-accent-gold transition-all duration-300"
                            style={{ color: 'var(--text-secondary)' }}
                            aria-label="Instagram"
                        >
                            <Instagram size={18} />
                        </a>
                    </div>
                </div>

                <div>
                    <h3 className="font-heading text-sm mb-8 tracking-widest text-white">Quick Links</h3>
                    <ul className="flex flex-col gap-4 text-text-secondary text-sm" style={{ color: 'var(--text-secondary)' }}>
                        <li><Link to="/" className="hover:text-accent-gold transition-colors">Home</Link></li>
                        <li><Link to="/services/" className="hover:text-accent-gold transition-colors">Services</Link></li>
                        <li><Link to="/tools/" className="hover:text-accent-gold transition-colors">Free Tools</Link></li>
                        <li><Link to="/about/" className="hover:text-accent-gold transition-colors">About Us</Link></li>
                        <li><Link to="/faq/" className="hover:text-accent-gold transition-colors">FAQs</Link></li>
                        <li><Link to="/blog/" className="hover:text-accent-gold transition-colors">Blog</Link></li>
                        <li><Link to="/contact/" className="hover:text-accent-gold transition-colors">Contact</Link></li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-heading text-sm mb-8 tracking-widest text-white">Services</h3>
                    <ul className="flex flex-col gap-4 text-text-secondary text-sm" style={{ color: 'var(--text-secondary)' }}>
                        <li><Link to="/services/assignment-help" className="hover:text-accent-gold transition-colors">Assignment Assistance</Link></li>
                        <li><Link to="/services/essay-help" className="hover:text-accent-gold transition-colors">Essay Writing Support</Link></li>
                        <li><Link to="/services/dissertation-help" className="hover:text-accent-gold transition-colors">Dissertation Help</Link></li>
                        <li><Link to="/services/literature-review" className="hover:text-accent-gold transition-colors">Literature Review</Link></li>
                        <li><Link to="/services/editing-proofreading" className="hover:text-accent-gold transition-colors">Editing & Proofreading</Link></li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-heading text-sm mb-8 tracking-widest text-white">Free Tools</h3>
                    <ul className="flex flex-col gap-4 text-text-secondary text-sm" style={{ color: 'var(--text-secondary)' }}>
                        <li><Link to="/tools/citation-generator" className="hover:text-accent-gold transition-colors">Citation Builder</Link></li>
                        <li><Link to="/tools/grammar-checker" className="hover:text-accent-gold transition-colors">Grammar Editor</Link></li>
                        <li><Link to="/tools/ai-detector" className="hover:text-accent-gold transition-colors">AI Content Scanner</Link></li>
                        <li><Link to="/tools/ai-humanizer" className="hover:text-accent-gold transition-colors">AI Text Humanizer</Link></li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-heading text-sm mb-8 tracking-widest text-white">Trust & Quality</h3>
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="text-accent-gold" style={{ color: 'var(--accent-gold)' }} size={24} />
                            <span className="text-xs uppercase tracking-widest font-heading text-white">100% Confidential</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Award className="text-accent-gold" style={{ color: 'var(--accent-gold)' }} size={24} />
                            <span className="text-xs uppercase tracking-widest font-heading text-white">Expert Writers</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <ThumbsUp className="text-accent-gold" style={{ color: 'var(--accent-gold)' }} size={24} />
                            <span className="text-xs uppercase tracking-widest font-heading text-white">Quality Support</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container px-6 pt-10 border-t border-glass-border flex flex-col items-center justify-center gap-4">
                <div className="flex gap-8 text-text-secondary text-xs" style={{ color: 'var(--text-secondary)' }}>
                    <Link to="/privacy-policy" className="hover:text-accent-gold transition-colors">Privacy Policy</Link>
                    <Link to="/terms-of-service" className="hover:text-accent-gold transition-colors">Terms of Service</Link>
                </div>
                <p className="text-text-secondary text-xs text-center" style={{ color: 'var(--text-secondary)' }}>
                    &copy; {new Date().getFullYear()} Academic Wizard. All Rights Reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
