import React, { useState, useEffect } from 'react';
import Button from '../components/Button';
import { Lock, Copy, Check, MessageSquare, Instagram, Facebook, AlertCircle, RefreshCw, Sparkles } from 'lucide-react';

export const ActivationContext = React.createContext();

// Shift +1 character shift algorithm for hex UUIDs
const shiftChar = (char) => {
    if (char >= '0' && char <= '9') {
        return char === '9' ? '0' : String.fromCharCode(char.charCodeAt(0) + 1);
    }
    if (char >= 'a' && char <= 'f') {
        return char === 'f' ? 'a' : String.fromCharCode(char.charCodeAt(0) + 1);
    }
    return char;
};

// Generates the shift +1 code for the given UUID Device ID
export const generateCode = (deviceId) => {
    const parts = deviceId.trim().toLowerCase().split('-');
    if (parts.length !== 5) return '';
    
    const char1 = shiftChar(parts[0][0]);
    const char2 = shiftChar(parts[1][0]);
    const char3 = shiftChar(parts[2][0]);
    const char4 = shiftChar(parts[3][0]);
    const char5 = shiftChar(parts[4][0]);
    
    return `${char1}${char2}${char3}AWIZ${char4}${char5}`;
};

// Helper to get or create a Device ID
export const getOrCreateDeviceId = () => {
    let deviceId = localStorage.getItem('academic_wizard_device_id');
    if (!deviceId) {
        deviceId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
        localStorage.setItem('academic_wizard_device_id', deviceId);
    }
    return deviceId;
};

const ActivationGate = ({ children, toolKey, maxUses = 10 }) => {
    const [deviceId] = useState(() => getOrCreateDeviceId());
    const [activationCode, setActivationCode] = useState('');
    const [unlocked, setUnlocked] = useState(() => localStorage.getItem('academic_wizard_unlocked') === 'true');
    const [useCount, setUseCount] = useState(0);
    const [copiedId, setCopiedId] = useState(false);
    const [error, setError] = useState('');
    const [verifying, setVerifying] = useState(false);
    const [activationSuccess, setActivationSuccess] = useState(false);

    const [copiedMsg, setCopiedMsg] = useState(false);

    const counterKey = `academic_wizard_${toolKey}_uses`;

    // 1. Weekly Reset/Expiration Logic
    useEffect(() => {
        const isUnlocked = localStorage.getItem('academic_wizard_unlocked') === 'true';
        const activationDate = localStorage.getItem('academic_wizard_activation_date');
        
        if (isUnlocked && activationDate) {
            const elapsed = Date.now() - parseInt(activationDate, 10);
            const sevenDaysMs = 7 * 24 * 60 * 60 * 1000; // 604,800,000 ms
            
            if (elapsed > sevenDaysMs) {
                // Lock the site immediately
                localStorage.removeItem('academic_wizard_unlocked');
                localStorage.removeItem('academic_wizard_activation_date');
                
                // Max out counters so they are locked immediately and see the activation screen
                localStorage.setItem('academic_wizard_citation_uses', '5');
                localStorage.setItem('academic_wizard_grammar_uses', '5');
                localStorage.setItem('academic_wizard_detector_uses', '5');
                localStorage.setItem('academic_wizard_humanizer_uses', '3');
                
                setUnlocked(false);
                setError('Your weekly activation code has expired. Please request a new weekly code.');
            }
        }
    }, []);

    // 2. 1-Click Link Auto-Unlock (?activate=...)
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const codeFromUrl = params.get('activate');

        if (codeFromUrl) {
            const expectedCode = generateCode(deviceId);
            if (codeFromUrl.trim().toLowerCase() === expectedCode.toLowerCase()) {
                localStorage.setItem('academic_wizard_unlocked', 'true');
                localStorage.setItem('academic_wizard_activation_date', Date.now().toString());
                setUnlocked(true);
                setActivationSuccess(true);
                
                // Remove ?activate from URL
                const newUrl = window.location.pathname;
                window.history.replaceState({}, document.title, newUrl);
                
                setTimeout(() => setActivationSuccess(false), 5000);
            } else {
                setError('The activation link you clicked is invalid or expired.');
            }
        }
    }, [deviceId]);

    useEffect(() => {
        if (!unlocked) {
            const count = parseInt(localStorage.getItem(counterKey) || '0', 10);
            setUseCount(count);
        }
    }, [unlocked, counterKey]);

    const handleCopyId = () => {
        navigator.clipboard.writeText(deviceId);
        setCopiedId(true);
        setTimeout(() => setCopiedId(false), 2000);
    };

    const handleVerify = (e) => {
        e.preventDefault();
        setError('');
        setVerifying(true);

        if (!activationCode.trim()) {
            setError('Please enter your activation code.');
            setVerifying(false);
            return;
        }

        const expectedCode = generateCode(deviceId);
        const enteredCodeClean = activationCode.trim().toLowerCase();

        if (enteredCodeClean === expectedCode.toLowerCase()) {
            // Success
            localStorage.setItem('academic_wizard_unlocked', 'true');
            localStorage.setItem('academic_wizard_activation_date', Date.now().toString());
            setUnlocked(true);
            setActivationSuccess(true);
            setTimeout(() => setActivationSuccess(false), 5000);
        } else {
            setError('Invalid Activation Code. Please request a valid code.');
        }
        setVerifying(false);
    };

    const triggerUse = () => {
        if (unlocked) return true;

        const currentCount = parseInt(localStorage.getItem(counterKey) || '0', 10);
        if (currentCount >= maxUses) {
            return false;
        }

        const newCount = currentCount + 1;
        localStorage.setItem(counterKey, newCount.toString());
        setUseCount(newCount);
        return newCount <= maxUses;
    };

    useEffect(() => {
        window[`trigger_${toolKey}_use`] = triggerUse;
        return () => {
            delete window[`trigger_${toolKey}_use`];
        };
    }, [unlocked, useCount, toolKey]);

    const isLimitExceeded = !unlocked && useCount >= maxUses;

    if (!isLimitExceeded) {
        return (
            <ActivationContext.Provider value={{ useCount, maxUses, unlocked }}>
                <div className="relative">
                    {activationSuccess && (
                        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[100] bg-emerald-500 text-white font-bold px-6 py-3.5 rounded-full shadow-2xl flex items-center gap-2 border border-emerald-400/30 animate-bounce">
                            <Check size={16} /> Academic Suite Activated for 7 Days!
                        </div>
                    )}
                    
                    {children}
                </div>
            </ActivationContext.Provider>
        );
    }

    const requestCode = 'AWIZ-ACAD-PRO-SUITE';
    const msgText = 'AWIZ-ACAD-PRO-SUITE';
    const whatsappMsg = encodeURIComponent(msgText);
    const whatsappUrl = `https://wa.me/919509893638?text=${whatsappMsg}`;
    const fbUrl = `https://m.me/108992517116465?text=${whatsappMsg}`;
    
    const handleCopyMsg = () => {
        navigator.clipboard.writeText(msgText);
        setCopiedMsg(true);
        setTimeout(() => setCopiedMsg(false), 2000);
    };

    return (
        <div className="relative min-h-[7vh] flex items-center justify-center py-20 px-6 bg-bg-primary text-white">
            <div className="absolute inset-0 filter blur-[15px] opacity-10 pointer-events-none select-none">
                <div className="w-full h-full flex flex-col justify-center items-center gap-10">
                    <div className="h-10 w-96 bg-white/20 rounded"></div>
                    <div className="h-60 w-full max-w-2xl bg-white/20 rounded"></div>
                </div>
            </div>

            <div className="relative z-10 w-full max-w-lg glass-card p-8 sm:p-12 border-accent-gold/30 rounded-2xl flex flex-col items-center text-center space-y-6" style={{ borderColor: 'rgba(212, 175, 55, 0.3)' }}>
                <div className="h-16 w-16 bg-accent-gold/15 rounded-full flex items-center justify-center text-accent-gold" style={{ color: 'var(--accent-gold)' }}>
                    <Lock size={32} />
                </div>

                <div className="space-y-2">
                    <h3 className="text-2xl font-bold font-heading">Activation Required</h3>
                    <p className="text-text-secondary text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        To keep our tools free and protect server resources, we require a free weekly activation. Get your code instantly on WhatsApp, Instagram, or Facebook.
                    </p>
                </div>

                {/* Step 1: Copy Device ID */}
                <div className="w-full space-y-2 text-left">
                    <span className="block text-[9px] uppercase tracking-wider text-white/40 font-bold">Step 1: Copy Your Device ID</span>
                    <div className="w-full bg-black/40 border border-white/10 rounded-xl p-4 flex items-center justify-between gap-4">
                        <div className="text-left overflow-hidden">
                            <span className="font-mono text-xs text-white/90 block truncate">{deviceId}</span>
                        </div>
                        <button 
                            onClick={handleCopyId}
                            className="px-3.5 py-2 bg-white/10 text-white hover:bg-white/20 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all duration-300 flex items-center gap-1.5 flex-shrink-0"
                            aria-label="Copy Device ID"
                        >
                            {copiedId ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                            {copiedId ? 'Copied' : 'Copy ID'}
                        </button>
                    </div>
                </div>

                {/* Step 2: Copy Request Code */}
                <div className="w-full space-y-2 text-left">
                    <span className="block text-[9px] uppercase tracking-wider text-white/40 font-bold">Step 2: Copy Verification Request Code</span>
                    <div className="w-full bg-black/40 border border-white/10 rounded-xl p-4 flex items-center justify-between gap-4">
                        <div className="text-left overflow-hidden">
                            <span className="font-mono text-xs text-accent-gold block truncate">{msgText}</span>
                        </div>
                        <button 
                            onClick={handleCopyMsg}
                            className="px-3.5 py-2 bg-accent-gold text-bg-primary hover:bg-white hover:text-bg-primary rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all duration-300 flex items-center gap-1.5 flex-shrink-0"
                            aria-label="Copy Request Code"
                        >
                            {copiedMsg ? <Check size={12} className="text-bg-primary" /> : <Copy size={12} />}
                            {copiedMsg ? 'Copied' : 'Copy Code'}
                        </button>
                    </div>
                </div>

                {/* Step 3: Send Message on Social Channels */}
                <div className="w-full space-y-2 text-left">
                    <span className="block text-[9px] uppercase tracking-wider text-white/40 font-bold">Step 3: Send to support on any platform</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
                        <a 
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 py-3 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white border border-emerald-500/20 hover:border-transparent rounded-xl text-xs font-bold transition-all duration-300"
                        >
                            <MessageSquare size={16} /> WhatsApp
                        </a>

                        <a 
                            href="https://www.instagram.com/_academic.wizard_"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={handleCopyMsg}
                            className="flex items-center justify-center gap-2 py-3 bg-pink-500/10 hover:bg-pink-500 text-pink-400 hover:text-white border border-pink-500/20 hover:border-transparent rounded-xl text-xs font-bold transition-all duration-300"
                        >
                            <Instagram size={16} /> Instagram
                        </a>

                        <a 
                            href={fbUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 py-3 bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white border border-blue-500/20 hover:border-transparent rounded-xl text-xs font-bold transition-all duration-300"
                        >
                            <Facebook size={16} /> Facebook
                        </a>
                    </div>
                </div>

                {/* Step-by-Step Instructions & Prefilled Message Note */}
                <div className="w-full bg-white/5 border border-white/5 rounded-xl p-5 text-left text-xs space-y-3.5">
                    <h4 className="font-bold text-accent-gold uppercase tracking-wider text-[10px]" style={{ color: 'var(--accent-gold)' }}>How to Activate:</h4>
                    <ul className="space-y-3 text-white/70 leading-relaxed list-decimal pl-4">
                        <li>
                            <strong className="text-white">Copy Code and ID:</strong> Copy your <strong>Device ID</strong> (Step 1) and your <strong>Verification Request Code</strong> (Step 2).
                        </li>
                        <li>
                            <strong className="text-white">Send to us:</strong> Click WhatsApp, Instagram, or Facebook in Step 3 to open our support chat. Send the copied details.
                            <div className="mt-2 p-3 bg-white/5 border-l-2 border-accent-gold rounded text-white/60 text-[11px] leading-relaxed">
                                <strong className="text-accent-gold uppercase text-[9px] tracking-wider block mb-1">Prefilled Message Note:</strong>
                                Clicking <strong>WhatsApp</strong> or <strong>Facebook</strong> will open the chat with your request details pre-filled automatically! For <strong>Instagram</strong>, please paste the copied text manually.
                            </div>
                        </li>
                        <li>
                            <strong className="text-white">Open the generation link:</strong> Our support team will reply with a secret key generation URL.
                        </li>
                        <li>
                            <strong className="text-white">Generate activation key:</strong> Open the URL provided by support, paste your copied <strong>Device ID</strong>, and click generate to get your activation key.
                        </li>
                        <li>
                            <strong className="text-white">Unlock the suite:</strong> Paste the generated activation key into the "Enter Weekly Code" box below and click <strong>Activate Suite</strong>.
                        </li>
                    </ul>
                </div>

                {/* Code Entry Input */}
                <form onSubmit={handleVerify} className="w-full space-y-4 pt-4 border-t border-white/10">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-200 text-xs rounded-lg p-3.5 flex items-start gap-2 text-left">
                            <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="flex gap-3">
                        <input 
                            type="text"
                            placeholder="Enter Weekly Code"
                            value={activationCode}
                            onChange={(e) => setActivationCode(e.target.value)}
                            className="flex-grow bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-accent-gold transition-colors text-sm text-white text-center font-mono uppercase"
                            required
                        />
                    </div>

                    <Button 
                        type="submit" 
                        disabled={verifying}
                        className="w-full py-4 text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2"
                    >
                        {verifying ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
                        {verifying ? 'Verifying Code...' : 'Activate Suite'}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default ActivationGate;
