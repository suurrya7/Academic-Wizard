import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import { generateCode } from '../components/ActivationGate';
import { ShieldCheck, Lock, Copy, Check, Calculator, KeyRound } from 'lucide-react';

const ADMIN_PASSWORD_HASH = "d2l6YXJkMjAyNg=="; // "wizard2026" base64

const AdminPortal = () => {
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [deviceIdInput, setDeviceIdInput] = useState('');
    const [generatedCodes, setGeneratedCodes] = useState(null);
    const [copiedIndex, setCopiedIndex] = useState(null);
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');
        
        const decodedPassword = atob(ADMIN_PASSWORD_HASH);
        if (password === decodedPassword) {
            setIsLoggedIn(true);
            setPassword('');
        } else {
            setError('Incorrect master password. Access Denied.');
        }
    };

    const handleGenerate = async (e) => {
        e.preventDefault();
        setError('');
        setGeneratedCodes(null);

        const cleanId = deviceIdInput.trim();
        if (!cleanId) {
            setError('Please enter a valid Device ID.');
            return;
        }

        try {
            // Get current 10-minute UTC slot
            const currentSlot = Math.floor(Date.now() / 600000);

            // Generate codes for drift windows
            const prevCode = await generateCode(cleanId, currentSlot - 1);
            const currentCode = await generateCode(cleanId, currentSlot);
            const nextCode = await generateCode(cleanId, currentSlot + 1);

            setGeneratedCodes([
                { name: 'Previous Window Code (Valid for drift/lag)', code: prevCode },
                { name: 'Primary Activation Code (Current Window)', code: currentCode, primary: true },
                { name: 'Next Window Code (Pre-generated)', code: nextCode }
            ]);
        } catch (err) {
            console.error(err);
            setError('Failed to compute HMAC code. Please check the Device ID format.');
        }
    };

    const handleCopyCode = (code, index) => {
        navigator.clipboard.writeText(code);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (
        <div className="page-admin-portal text-white">
            <Helmet>
                <title>Wizard Admin Portal | Academic Wizard</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <PageHeader 
                title="Wizard Portal" 
                subtitle="Cryptographic code calculator for support activations and user access grants."
                breadcrumbs={[
                    { name: 'Home', url: '/' },
                    { name: 'Admin Portal', url: '/admin-portal' }
                ]}
            />

            <section className="py-20 bg-bg-primary">
                <div className="container max-w-xl">
                    {!isLoggedIn ? (
                        /* Login Form */
                        <div className="glass-card p-8 sm:p-12 border-accent-gold/20 rounded-2xl flex flex-col items-center space-y-6" style={{ borderColor: 'rgba(212, 175, 55, 0.2)' }}>
                            <div className="h-14 w-14 bg-accent-gold/15 rounded-full flex items-center justify-center text-accent-gold" style={{ color: 'var(--accent-gold)' }}>
                                <KeyRound size={28} />
                            </div>

                            <h3 className="text-xl font-bold font-heading">Secure Portal Login</h3>
                            
                            <form onSubmit={handleLogin} className="w-full space-y-4">
                                {error && (
                                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg p-3.5 text-center">
                                        {error}
                                    </div>
                                )}
                                <div>
                                    <input 
                                        type="password"
                                        placeholder="Enter Master Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3.5 focus:outline-none focus:border-accent-gold transition-colors text-center text-sm text-white"
                                        required
                                    />
                                </div>
                                <Button type="submit" className="w-full py-3.5 text-xs font-bold uppercase tracking-wider">
                                    Authenticate
                                </Button>
                            </form>
                        </div>
                    ) : (
                        /* Admin Dashboard Code Generator */
                        <div className="glass-card p-8 sm:p-12 border-emerald-500/20 rounded-2xl space-y-8" style={{ borderColor: 'rgba(16, 185, 129, 0.2)' }}>
                            <div className="flex justify-between items-center border-b border-white/10 pb-4">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="text-emerald-400" size={24} />
                                    <h3 className="text-lg font-bold font-heading">Activation Generator</h3>
                                </div>
                                <button 
                                    onClick={() => setIsLoggedIn(false)}
                                    className="text-white/40 hover:text-white text-xs font-semibold"
                                >
                                    Log Out
                                </button>
                            </div>

                            <form onSubmit={handleGenerate} className="space-y-4">
                                {error && (
                                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg p-3 text-center">
                                        {error}
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <label className="block text-xs uppercase tracking-widest text-accent-gold font-bold">User Device ID</label>
                                    <input 
                                        type="text"
                                        placeholder="e.g. 4f7c8a9d-2e31-4d9a-9f2d-a61d8f7b5c11"
                                        value={deviceIdInput}
                                        onChange={(e) => setDeviceIdInput(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3.5 focus:outline-none focus:border-emerald-500 transition-colors text-sm text-white font-mono"
                                        required
                                    />
                                </div>
                                <Button type="submit" className="w-full py-4 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                                    <Calculator size={16} /> Calculate Code
                                </Button>
                            </form>

                            {/* Generated Codes Results */}
                            {generatedCodes && (
                                <div className="space-y-4 border-t border-white/10 pt-6">
                                    <h4 className="text-xs uppercase tracking-widest text-white/50 mb-2">Calculated Results</h4>
                                    
                                    {generatedCodes.map((item, idx) => (
                                        <div 
                                            key={idx} 
                                            className={`border rounded-xl p-4 flex items-center justify-between gap-4 ${item.primary ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/5 border-white/5 opacity-70'}`}
                                        >
                                            <div className="text-left overflow-hidden">
                                                <span className={`block text-[8px] uppercase tracking-wider ${item.primary ? 'text-emerald-400 font-bold' : 'text-white/40'}`}>
                                                    {item.name}
                                                </span>
                                                <span className="font-mono text-base font-bold text-white block mt-0.5">{item.code}</span>
                                            </div>
                                            <button 
                                                onClick={() => handleCopyCode(item.code, idx)}
                                                className={`transition-colors p-2 rounded-lg ${item.primary ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'text-white/50 hover:text-white bg-white/5'}`}
                                                aria-label="Copy code to clipboard"
                                            >
                                                {copiedIndex === idx ? <Check size={16} /> : <Copy size={16} />}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default AdminPortal;
