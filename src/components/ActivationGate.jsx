import React, { useState, useEffect } from 'react';
import Button from '../components/Button';
import { Lock, Copy, Check, MessageSquare, Instagram, Facebook, AlertCircle, RefreshCw } from 'lucide-react';

const OBFUSCATED_SECRET = "QUNBRF9XSVpfU0VDX0tFWV8yMDI2"; // "ACAD_WIZ_SEC_KEY_2026" base64
const SECRET = atob(OBFUSCATED_SECRET);

// Helper to generate a UUID (Device ID)
export const getOrCreateDeviceId = () => {
    let deviceId = localStorage.getItem('academic_wizard_device_id');
    if (!deviceId) {
        // Simple UUID v4 generator
        deviceId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
        localStorage.setItem('academic_wizard_device_id', deviceId);
    }
    return deviceId;
};

// Cryptographic HMAC SHA256 logic using native browser SubtleCrypto
export const generateCode = async (deviceId, slot) => {
    const message = `${deviceId}-${slot}`;
    const enc = new TextEncoder();
    const key = await window.crypto.subtle.importKey(
        "raw",
        enc.encode(SECRET),
        { name: "HMAC", hash: { name: "SHA-256" } },
        false,
        ["sign"]
    );
    const signature = await window.crypto.subtle.sign(
        "HMAC",
        key,
        enc.encode(message)
    );
    const hashArray = Array.from(new Uint8Array(signature));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    // Prefix + first 8 characters of hex hash in uppercase
    return `AW-${hashHex.substring(0, 8).toUpperCase()}`;
};

const ActivationGate = ({ children, toolKey, maxUses = 10 }) => {
    const [deviceId] = useState(() => getOrCreateDeviceId());
    const [activationCode, setActivationCode] = useState('');
    const [unlocked, setUnlocked] = useState(() => !!localStorage.getItem('academic_wizard_unlocked'));
    const [useCount, setUseCount] = useState(0);
    const [copiedId, setCopiedId] = useState(false);
    const [error, setError] = useState('');
    const [verifying, setVerifying] = useState(false);

    const counterKey = `academic_wizard_${toolKey}_uses`;

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

    const handleVerify = async (e) => {
        e.preventDefault();
        setError('');
        setVerifying(true);

        if (!activationCode.trim()) {
            setError('Please enter your activation code.');
            setVerifying(false);
            return;
        }

        try {
            // Get current 10-minute UTC slot
            const currentSlot = Math.floor(Date.now() / 600000);
            
            // Generate codes for drift window: previous, current, next 10-minute slots
            const validCodes = await Promise.all([
                generateCode(deviceId, currentSlot - 1),
                generateCode(deviceId, currentSlot),
                generateCode(deviceId, currentSlot + 1)
            ]);

            const enteredCodeClean = activationCode.trim().toUpperCase();

            if (validCodes.includes(enteredCodeClean)) {
                // Success
                localStorage.setItem('academic_wizard_unlocked', 'true');
                setUnlocked(true);
            } else {
                setError('Invalid Activation Code. Please check the code or contact our support.');
            }
        } catch (err) {
            console.error('Verification error:', err);
            setError('Verification failed. Please try again.');
        } finally {
            setVerifying(false);
        }
    };

    // Increments usage locally and returns true if within limit, false if locked
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

    // Attach function to window so tools can increment uses
    useEffect(() => {
        window[`trigger_${toolKey}_use`] = triggerUse;
        return () => {
            delete window[`trigger_${toolKey}_use`];
        };
    }, [unlocked, useCount, toolKey]);

    const isLimitExceeded = !unlocked && useCount >= maxUses;

    if (!isLimitExceeded) {
        // Expose trial count element for tools
        return (
            <div className="relative">
                {!unlocked && (
                    <div className="absolute top-4 right-4 z-50 bg-accent-gold/10 border border-accent-gold/20 text-accent-gold text-xs px-3 py-1.5 rounded-full font-bold">
                        Trial Uses: {useCount} / {maxUses}
                    </div>
                )}
                {children}
            </div>
        );
    }

    // Gated Overlay screen
    const whatsappMsg = encodeURIComponent(`Hi Academic Wizard! My Device ID is ${deviceId}. Please send my Activation Code.`);
    const whatsappUrl = `https://wa.me/919509893638?text=${whatsappMsg}`;
    
    // Copies pitch text for social platforms that don't support custom message URLs
    const copySocialPitch = () => {
        const text = `Hi, I need an Activation Code. My Device ID is: ${deviceId}`;
        navigator.clipboard.writeText(text);
        alert('Verification request text copied to clipboard! You can paste it into Instagram or Facebook direct message.');
    };

    return (
        <div className="relative min-h-[7vh] flex items-center justify-center py-20 px-6 bg-bg-primary text-white">
            {/* Blurred visual elements */}
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
                    <h3 className="text-2xl font-bold font-heading">Trial Limit Reached</h3>
                    <p className="text-text-secondary text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        You have exhausted your free trial uses. Send your Device ID to our team on WhatsApp, Instagram, or Facebook to get a free activation code.
                    </p>
                </div>

                {/* Device ID Display */}
                <div className="w-full bg-black/40 border border-white/10 rounded-xl p-4 flex items-center justify-between gap-4">
                    <div className="text-left overflow-hidden">
                        <span className="block text-[9px] uppercase tracking-wider text-white/40">Your Device ID</span>
                        <span className="font-mono text-xs text-white/95 block truncate">{deviceId}</span>
                    </div>
                    <button 
                        onClick={handleCopyId}
                        className="text-white/50 hover:text-accent-gold transition-colors flex-shrink-0"
                        aria-label="Copy Device ID"
                    >
                        {copiedId ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
                    </button>
                </div>

                {/* Grid of Social Channels */}
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
                        href="https://instagram.com/academic_wizard"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={copySocialPitch}
                        className="flex items-center justify-center gap-2 py-3 bg-pink-500/10 hover:bg-pink-500 text-pink-400 hover:text-white border border-pink-500/20 hover:border-transparent rounded-xl text-xs font-bold transition-all duration-300"
                    >
                        <Instagram size={16} /> Instagram
                    </a>

                    <a 
                        href="https://facebook.com/academic.wizard.online"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={copySocialPitch}
                        className="flex items-center justify-center gap-2 py-3 bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white border border-blue-500/20 hover:border-transparent rounded-xl text-xs font-bold transition-all duration-300"
                    >
                        <Facebook size={16} /> Facebook
                    </a>
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
                            placeholder="Paste Activation Code (e.g. AW-8D7C51A9)"
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
