import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { generateCode } from '../components/ActivationGate';
import { Key, Copy, Check, ShieldAlert } from 'lucide-react';
import PageHeader from '../components/PageHeader';

const ActivationCodeGenerator = () => {
    const [deviceId, setDeviceId] = useState('');
    const [generatedCode, setGeneratedCode] = useState('');
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = (e) => {
        e.preventDefault();
        setError('');
        setGeneratedCode('');

        const cleanId = deviceId.trim();
        const parts = cleanId.split('-');
        
        if (parts.length !== 5) {
            setError('Invalid Device ID format. Make sure it contains 5 parts separated by hyphens (e.g., xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx).');
            return;
        }

        try {
            const code = generateCode(cleanId);
            if (code) {
                setGeneratedCode(code);
            } else {
                setError('Failed to generate code. Please check your Device ID structure.');
            }
        } catch (err) {
            setError('An unexpected error occurred during generation.');
        }
    };

    const handleCopy = () => {
        if (!generatedCode) return;
        navigator.clipboard.writeText(generatedCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="page-activation-generator">
            <Helmet>
                <title>System Utility | Access Portal</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <PageHeader 
                title="Utility Portal" 
                subtitle="Administrative tool for manual license key generation."
                breadcrumbs={[
                    { name: 'Home', url: '/' },
                    { name: 'System Portal', url: '/system-portal-secret/' }
                ]}
            />

            <section className="py-20 container max-w-xl">
                <div className="glass-card p-10 border-accent-gold/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 text-accent-gold">
                        <Key size={120} />
                    </div>

                    <div className="flex items-center gap-3 mb-8 text-accent-gold" style={{ color: 'var(--accent-gold)' }}>
                        <ShieldAlert size={28} />
                        <h2 className="text-2xl font-bold font-heading text-white">Manual License Generator</h2>
                    </div>

                    <p className="text-text-secondary text-sm mb-8 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        Enter the user's Device ID exactly as copied from their screen to compute their unique activation code.
                    </p>

                    <form onSubmit={handleGenerate} className="space-y-6">
                        <div>
                            <label htmlFor="deviceId" className="block text-sm font-medium text-text-secondary mb-2">
                                Device ID (UUID)
                            </label>
                            <input
                                type="text"
                                id="deviceId"
                                value={deviceId}
                                onChange={(e) => setDeviceId(e.target.value)}
                                className="w-full bg-bg-secondary/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent-gold transition-colors font-mono text-sm"
                                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                                required
                            />
                        </div>

                        {error && (
                            <p className="text-red-500 text-xs leading-relaxed">{error}</p>
                        )}

                        <button 
                            type="submit" 
                            className="w-full bg-accent-gold text-bg-primary font-bold py-3 rounded-lg hover:bg-white transition-colors duration-300"
                        >
                            Generate Activation Code
                        </button>
                    </form>

                    {generatedCode && (
                        <div className="mt-10 p-6 bg-white/5 border border-white/10 rounded-lg">
                            <label className="block text-xs font-semibold uppercase tracking-widest text-text-secondary mb-2">
                                Generated Code
                            </label>
                            <div className="flex items-center justify-between gap-4 bg-bg-primary/50 border border-white/5 rounded px-4 py-3 font-mono text-lg font-bold text-accent-gold" style={{ color: 'var(--accent-gold)' }}>
                                <span>{generatedCode}</span>
                                <button 
                                    onClick={handleCopy}
                                    className="text-text-secondary hover:text-white transition-colors"
                                    title="Copy to Clipboard"
                                >
                                    {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default ActivationCodeGenerator;
