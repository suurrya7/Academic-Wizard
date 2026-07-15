import React from 'react';
import { Helmet } from 'react-helmet-async';
import PageHeader from '../components/PageHeader';

const PrivacyPolicy = () => {
    return (
        <div className="page-privacy">
            <Helmet>
                <title>Privacy Policy | Academic Wizard</title>
                <meta name="description" content="Read the Academic Wizard Privacy Policy to learn how we handle and protect student information." />
                <link rel="canonical" href="https://academicwizard.online/privacy-policy" />
            </Helmet>

            <PageHeader
                title="Privacy Policy"
                subtitle="How Academic Wizard handles student information, project details, and communication data."
            />

            <section className="container px-6 pb-24">
                <div className="max-w-4xl mx-auto glass-card p-8 md:p-12 space-y-8">
                    <div>
                        <h2 className="text-2xl text-white mb-4">Information We Collect</h2>
                        <p className="text-text-secondary leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                            We may collect your name, contact details, academic requirements, deadlines, subject information, uploaded instructions, and messages you send through WhatsApp, email, or the contact page.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl text-white mb-4">How We Use Information</h2>
                        <p className="text-text-secondary leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                            Information is used to understand your academic support request, prepare quotes, coordinate guidance, provide editing or research assistance, improve service quality, and respond to your questions.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl text-white mb-4">Confidentiality</h2>
                        <p className="text-text-secondary leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                            We treat student information and project details as confidential. We do not sell personal data or share academic materials with unrelated third parties.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl text-white mb-4">Data Security</h2>
                        <p className="text-text-secondary leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                            We use reasonable safeguards to protect information, but no online communication method is completely risk-free. Please avoid sending unnecessary sensitive personal information.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl text-white mb-4">Academic Writing Tools & Browser Storage</h2>
                        <p className="text-text-secondary leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
                            Our free client-side writing tools (including the Citation Generator, Grammar Checker, and AI Detector) use standard browser storage (<code className="font-mono bg-white/5 px-1.5 py-0.5 rounded text-[11px] text-accent-gold">localStorage</code>) on your local device to store a generated unique Device ID, remaining free trial usage count, and active activation keys. No text, academic essays, citation records, or analyzed writing drafts are ever uploaded to our servers, sold, or shared with third parties.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl text-white mb-4">Contact</h2>
                        <p className="text-text-secondary leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                            To request updates or deletion of your information, contact Academic Wizard through the contact page or WhatsApp support.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PrivacyPolicy;
