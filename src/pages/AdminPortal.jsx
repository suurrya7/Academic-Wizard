import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams, Link } from 'react-router-dom';
import { generateCode } from '../components/ActivationGate';
import { ShieldCheck, Copy, Check, AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';

const ADMIN_PASSWORD_HASH = "d2l6YXJkMjAyNg=="; // "wizard2026" base64

const AdminPortal = () => {
    const [searchParams] = useSearchParams();
    const [calculatedCode, setCalculatedCode] = useState('');
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);
    const [error, setError] = useState('');

    const deviceId = searchParams.get('device') || '';
    const passQuery = searchParams.get('pass') || '';

    useEffect(() => {
        const verifyAndCalculate = async () => {
            setLoading(true);
            setError('');
            
            const decodedPassword = atob(ADMIN_PASSWORD_HASH);
            if (passQuery !== decodedPassword) {
                setAuthorized(false);
                setLoading(false);
                return; // Render nothing / 404 behavior
            }

            setAuthorized(true);

            if (!deviceId) {
                setError('No Device ID provided in the link. Make sure the URL has: ?device=XXXX&pass=YYYY');
                setLoading(false);
                return;
            }

            try {
                // Get current 10-minute UTC slot
                const currentSlot = Math.floor(Date.now() / 600000);
                const code = await generateCode(deviceId.trim(), currentSlot);
                setCalculatedCode(code);
            } catch (err) {
                console.error(err);
                setError('Failed to calculate activation code. Check Device ID format.');
            } finally {
                setLoading(false);
            }
        };

        verifyAndCalculate();
    }, [deviceId, passQuery]);

    const handleCopy = () => {
        if (!calculatedCode) return;
        navigator.clipboard.writeText(calculatedCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // If unauthorized, act like the page does not exist (renders a blank 404 lookalike)
    if (!authorized && !loading) {
        return (
            <div className="min-h-screen bg-bg-primary text-white flex flex-col items-center justify-center px-6">
                <Helmet>
                    <title>Page Not Found | Academic Wizard</title>
                    <meta name="robots" content="noindex, nofollow" />
                </Helmet>
                <div className="space-y-4 text-center">
                    <h1 className="text-6xl font-bold font-heading text-white/20">404</h1>
                    <p className="text-text-secondary text-sm">The page you are looking for does not exist.</p>
                    <Link to="/" className="inline-block mt-4 text-xs font-bold uppercase tracking-widest text-accent-gold hover:underline">
                        Go Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bg-primary text-white flex items-center justify-center px-6 py-12">
            <Helmet>
                <title>Code Calculator | Academic Wizard</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <div className="w-full max-w-md space-y-6">
                {/* Back button */}
                <Link to="/" className="inline-flex items-center gap-2 text-xs text-white/50 hover:text-white transition-colors">
                    <ArrowLeft size={14} /> Back to Home
                </Link>

                <div className="glass-card p-8 border-emerald-500/20 rounded-2xl space-y-6 text-center relative overflow-hidden" style={{ borderColor: 'rgba(16, 185, 129, 0.25)' }}>
                    <div className="h-14 w-14 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400 mx-auto">
                        <ShieldCheck size={28} />
                    </div>

                    <div className="space-y-1">
                        <h2 className="text-xl font-bold font-heading">Wizard Calculator</h2>
                        <p className="text-xs text-white/40">Auto-generating code for user's device</p>
                    </div>

                    {loading ? (
                        <div className="py-8 flex flex-col items-center justify-center gap-3">
                            <RefreshCw size={24} className="animate-spin text-emerald-400" />
                            <span className="text-xs text-white/50">Calculating hash...</span>
                        </div>
                    ) : error ? (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-300 text-xs rounded-xl p-4 flex items-start gap-2 text-left">
                            <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Device ID Display */}
                            <div className="bg-black/30 border border-white/5 rounded-xl p-3 text-left">
                                <span className="block text-[8px] uppercase tracking-wider text-white/30 font-bold">Target Device ID</span>
                                <span className="font-mono text-xs text-white block truncate mt-0.5">{deviceId}</span>
                            </div>

                            {/* Large Code Output */}
                            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-6 space-y-2">
                                <span className="block text-[9px] uppercase tracking-widest text-emerald-400 font-bold">Activation Code</span>
                                <span className="font-mono text-3xl font-extrabold tracking-wider text-accent-gold block py-2 select-all" style={{ color: 'var(--accent-gold)' }}>
                                    {calculatedCode}
                                </span>
                            </div>

                            {/* Copy button */}
                            <button
                                onClick={handleCopy}
                                className={`w-full py-4 rounded-xl text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition-all duration-300 ${copied ? 'bg-emerald-600 text-white' : 'bg-white/10 hover:bg-white/15 text-white'}`}
                            >
                                {copied ? <Check size={16} /> : <Copy size={16} />}
                                {copied ? 'Copied to Clipboard' : 'Copy Code'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminPortal;
