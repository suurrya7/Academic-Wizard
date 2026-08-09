import React, { useState } from 'react';
import Button from './Button';
import { Mail, Phone, Lock, RefreshCw, AlertCircle } from 'lucide-react';
import { WEB3FORMS_ACCESS_KEY } from '../config/site';

const checkEmailValidity = (email) => {
    const domain = email.split('@')[1]?.toLowerCase();
    if (!domain) return false;

    const whitelistedConsumerDomains = [
        'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 
        'icloud.com', 'aol.com', 'protonmail.com', 'proton.me', 
        'zoho.com', 'live.com', 'msn.com'
    ];

    // Check if it's a whitelisted consumer domain
    if (whitelistedConsumerDomains.includes(domain)) {
        return true;
    }

    // Check if it's an educational/academic domain (.edu, .ac.uk, etc.)
    const isEducational = /\.edu(\.[a-z]{2,3})?$/i.test(domain) || /\.ac\.[a-z]{2,3}$/i.test(domain);
    if (isEducational) {
        return true;
    }

    return false;
};

const checkPhoneValidity = (phone) => {
    // E.164 phone validation regex (e.g. +919509893638, 19509893638)
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone.replace(/[\s-()]/g, ''));
};

const EmailGate = ({ children }) => {
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [unlocked, setUnlocked] = useState(() => {
        return !!localStorage.getItem('academic_wizard_user_email');
    });

    const handleUnlock = async (e) => {
        e.preventDefault();
        setError('');
        
        // 1. Validations
        if (!email.trim() || !phone.trim()) {
            setError('Please fill in both fields.');
            return;
        }

        if (!checkEmailValidity(email)) {
            setError('Access Denied: Please use a valid personal (Gmail, Yahoo, etc.) or university email.');
            return;
        }

        if (!checkPhoneValidity(phone)) {
            setError('Access Denied: Please enter a valid phone number with country code (e.g. +91 95098 93638).');
            return;
        }

        setLoading(true);

        try {
            // 2. Save locally to prevent locking again
            localStorage.setItem('academic_wizard_user_email', email);
            localStorage.setItem('academic_wizard_user_phone', phone);
            
            // 3. WhatsApp Handshake Verification Redirect
            // Pre-fill a message to your business number
            const encodedText = encodeURIComponent(`Hi Academic Wizard! My email is ${email} and phone is ${phone}. Please unlock my academic tools.`);
            const whatsappUrl = `https://wa.me/919509893638?text=${encodedText}`;
            
            // Open in new tab
            window.open(whatsappUrl, '_blank');

            // Unlock the page layout immediately
            setUnlocked(true);
        } catch (err) {
            console.error('Submission failed:', err);
            setError('Something went wrong. Please check your network connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    if (unlocked) {
        return <>{children}</>;
    }

    return (
        <div className="relative min-h-[70vh] flex items-center justify-center py-20 px-6 bg-bg-primary text-white overflow-hidden">
            {/* Blurred background preview of the tool */}
            <div className="absolute inset-0 filter blur-[15px] opacity-15 pointer-events-none select-none select-all-none">
                <div className="w-full h-full flex flex-col justify-center items-center gap-10">
                    <div className="h-10 w-96 bg-white/20 rounded"></div>
                    <div className="h-60 w-full max-w-2xl bg-white/20 rounded"></div>
                </div>
            </div>

            {/* Lock Pop Up Card */}
            <div className="relative z-10 w-full max-w-md glass-card p-8 sm:p-12 border-accent-gold/30 rounded-2xl flex flex-col items-center text-center space-y-6" style={{ borderColor: 'rgba(212, 175, 55, 0.3)' }}>
                <div className="h-16 w-16 bg-accent-gold/15 rounded-full flex items-center justify-center text-accent-gold" style={{ color: 'var(--accent-gold)' }}>
                    <Lock size={32} />
                </div>

                <div className="space-y-2">
                    <h3 className="text-2xl font-bold font-heading">Unlock Free Tools</h3>
                    <p className="text-text-secondary text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        Unlock our Citation Builder, Grammar Checker, AI Detector, and Humanizer. Enter your details to get instant access.
                    </p>
                </div>

                <form onSubmit={handleUnlock} className="w-full space-y-4">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-200 text-xs rounded-lg p-3.5 flex items-start gap-2 text-left">
                            <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="relative">
                        <Mail className="absolute left-4 top-3.5 text-white/30" size={18} />
                        <input 
                            type="email"
                            placeholder="University or Personal Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg pl-12 pr-4 py-3.5 focus:outline-none focus:border-accent-gold transition-colors text-sm text-white"
                            required
                        />
                    </div>

                    <div className="relative">
                        <Phone className="absolute left-4 top-3.5 text-white/30" size={18} />
                        <input 
                            type="tel"
                            placeholder="WhatsApp Number (e.g. +91...)"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg pl-12 pr-4 py-3.5 focus:outline-none focus:border-accent-gold transition-colors text-sm text-white"
                            required
                        />
                    </div>

                    <Button 
                        type="submit" 
                        disabled={loading}
                        className="w-full py-4 text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 mt-2"
                    >
                        {loading ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
                        {loading ? 'Unlocking...' : 'Unlock Suite'}
                    </Button>
                </form>

                <p className="text-[10px] text-white/40 leading-relaxed">
                    By unlocking, you'll be redirected to send a WhatsApp verification message to our official support team.
                </p>
            </div>
        </div>
    );
};

export default EmailGate;
