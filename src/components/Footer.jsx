import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Award, ThumbsUp, Linkedin, Facebook, Instagram, MapPin } from 'lucide-react';
import academicWizardLogo from '../assets/academic-wizard-logo.webp';
import reviewsData from '../data/reviews.json';

const Footer = () => {
    return (
        <footer className="bg-bg-secondary pt-16 pb-8 border-t border-glass-border" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <div className="container px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12 mb-12">
                <div className="flex flex-col gap-5 lg:col-span-2">
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
                    <div className="flex flex-col gap-2 mt-2 mb-4 text-text-secondary text-sm" style={{ color: 'var(--text-secondary)' }}>
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-text-primary">Phone:</span> +91 95098 93638
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-text-primary">Email:</span> admin@academicwizard.online
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-text-primary">Location:</span> Global Online Service
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-2">
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
                        <a 
                            href="https://share.google/gFYneo9HEwNeToTvN" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="w-10 h-10 bg-white/5 border border-white/10 hover:border-accent-gold rounded-lg flex items-center justify-center text-text-secondary hover:text-accent-gold transition-all duration-300"
                            style={{ color: 'var(--text-secondary)' }}
                            aria-label="Google Business Profile"
                            title="Academic Wizard on Google"
                        >
                            <MapPin size={18} />
                        </a>
                    </div>
                </div>

                <div>
                    <h3 className="font-heading text-sm mb-8 tracking-widest text-text-primary">Quick Links</h3>
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
                    <h3 className="font-heading text-sm mb-8 tracking-widest text-text-primary">Services</h3>
                    <ul className="flex flex-col gap-4 text-text-secondary text-sm" style={{ color: 'var(--text-secondary)' }}>
                        <li><Link to="/services/assignment-help/" className="hover:text-accent-gold transition-colors">Assignment Assistance</Link></li>
                        <li><Link to="/services/essay-help/" className="hover:text-accent-gold transition-colors">Essay Writing Support</Link></li>
                        <li><Link to="/services/dissertation-help/" className="hover:text-accent-gold transition-colors">Dissertation Help</Link></li>
                        <li><Link to="/services/literature-review/" className="hover:text-accent-gold transition-colors">Literature Review</Link></li>
                        <li><Link to="/services/editing-proofreading/" className="hover:text-accent-gold transition-colors">Editing & Proofreading</Link></li>
                        <li><Link to="/services/research-paper-help/" className="hover:text-accent-gold transition-colors">Research Paper Help</Link></li>
                        <li><Link to="/services/study-guidance/" className="hover:text-accent-gold transition-colors">Study Guidance</Link></li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-heading text-sm mb-8 tracking-widest text-text-primary">Free Tools</h3>
                    <ul className="flex flex-col gap-4 text-text-secondary text-sm" style={{ color: 'var(--text-secondary)' }}>
                        <li><Link to="/tools/citation-generator/" className="hover:text-accent-gold transition-colors">Citation Builder</Link></li>
                        <li><Link to="/tools/grammar-checker/" className="hover:text-accent-gold transition-colors">Grammar Editor</Link></li>
                        <li><Link to="/tools/ai-detector/" className="hover:text-accent-gold transition-colors">AI Content Scanner</Link></li>
                        <li><Link to="/tools/ai-humanizer/" className="hover:text-accent-gold transition-colors">AI Text Humanizer</Link></li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-heading text-sm mb-8 tracking-widest text-text-primary">Trust & Quality</h3>
                    <div className="flex flex-col gap-3">
                        <a 
                            href={reviewsData.summary.google.reviewUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-accent-gold/20 hover:border-accent-gold transition-all group"
                        >
                            <div className="flex flex-col">
                                <div className="flex items-center gap-1.5 text-accent-gold text-xs font-bold">
                                    <span>⭐⭐⭐⭐⭐</span>
                                    <span className="text-white text-xs font-heading">{reviewsData.summary.google.rating.toFixed(1)} / 5</span>
                                </div>
                                <span className="text-[11px] text-text-secondary group-hover:text-accent-gold transition-colors mt-0.5">
                                    Google Verified ({reviewsData.summary.google.reviewCount} Reviews)
                                </span>
                            </div>
                        </a>
                        <a 
                            href={reviewsData.summary.trustpilot.profileUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center gap-3 p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 hover:border-emerald-500 transition-all group"
                        >
                            <div className="flex flex-col">
                                <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                                    <span>★★★★★</span>
                                    <span className="text-white text-xs font-heading">{reviewsData.summary.trustpilot.rating.toFixed(1)} / 5</span>
                                </div>
                                <span className="text-[11px] text-text-secondary group-hover:text-emerald-400 transition-colors mt-0.5">
                                    Trustpilot Verified ({reviewsData.summary.trustpilot.reviewCount} Review)
                                </span>
                            </div>
                        </a>
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="text-accent-gold" style={{ color: 'var(--accent-gold)' }} size={24} />
                            <span className="text-xs uppercase tracking-widest font-heading text-text-primary">100% Confidential</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Award className="text-accent-gold" style={{ color: 'var(--accent-gold)' }} size={24} />
                            <span className="text-xs uppercase tracking-widest font-heading text-text-primary">Expert Writers</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <ThumbsUp className="text-accent-gold" style={{ color: 'var(--accent-gold)' }} size={24} />
                            <span className="text-xs uppercase tracking-widest font-heading text-text-primary">Quality Support</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* High-Intent Academic Disciplines & Regional Hubs — Passes Link Equity to High-CPC Money Pages */}
            <div className="container px-6 pt-10 pb-6 border-t border-glass-border">
                <div className="text-xs font-heading tracking-widest text-text-primary uppercase mb-4">
                    Popular Academic Specializations
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-2.5 text-xs text-text-secondary leading-relaxed">
                    <Link to="/services/assignment-help/uk/law/" className="hover:text-accent-gold transition-colors font-medium text-white/90">Business Law Assignment Help</Link>
                    <Link to="/services/assignment-help/singapore/business/" className="hover:text-accent-gold transition-colors font-medium text-white/90">MBA Assignment Help Singapore</Link>
                    <Link to="/services/editing-proofreading/" className="hover:text-accent-gold transition-colors font-medium text-white/90">Academic Editing Services</Link>
                    <Link to="/services/assignment-help/usa/philadelphia/" className="hover:text-accent-gold transition-colors">Assignment Help Philadelphia</Link>
                    <Link to="/services/assignment-help/ireland/dublin/" className="hover:text-accent-gold transition-colors">Assignment Help Dublin</Link>
                    <Link to="/services/editing-proofreading/canada/" className="hover:text-accent-gold transition-colors">Academic Editing Canada</Link>
                    <Link to="/services/assignment-help/usa/nursing/" className="hover:text-accent-gold transition-colors">Nursing Assignment Help USA</Link>
                    <Link to="/services/assignment-help/uk/nursing/" className="hover:text-accent-gold transition-colors">Nursing Assignment Help UK</Link>
                    <Link to="/services/assignment-help/uk/psychology/" className="hover:text-accent-gold transition-colors">Psychology Assignment Help</Link>
                    <Link to="/services/assignment-help/usa/computer-science/" className="hover:text-accent-gold transition-colors">Computer Science Help USA</Link>
                    <Link to="/services/assignment-help/australia/accounting/" className="hover:text-accent-gold transition-colors">Accounting Assignment Help Australia</Link>
                    <Link to="/services/assignment-help/australia/sydney/" className="hover:text-accent-gold transition-colors">Assignment Help Sydney</Link>
                    <Link to="/services/assignment-help/uk/london/" className="hover:text-accent-gold transition-colors">Assignment Help London</Link>
                    <Link to="/services/assignment-help/canada/toronto/" className="hover:text-accent-gold transition-colors">Assignment Help Toronto</Link>
                </div>
            </div>

            <div className="container px-6 pt-8 border-t border-glass-border flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-text-secondary text-xs text-center md:text-left" style={{ color: 'var(--text-secondary)' }}>
                    &copy; {new Date().getFullYear()} Academic Wizard. All Rights Reserved.
                </p>
                <div className="flex gap-8 text-text-secondary text-xs" style={{ color: 'var(--text-secondary)' }}>
                    <Link to="/privacy-policy/" className="hover:text-accent-gold transition-colors">Privacy Policy</Link>
                    <Link to="/terms-of-service/" className="hover:text-accent-gold transition-colors">Terms of Service</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
