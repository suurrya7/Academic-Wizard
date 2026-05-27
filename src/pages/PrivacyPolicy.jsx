import React from 'react';
import PageHeader from '../components/PageHeader';

const PrivacyPolicy = () => {
    return (
        <div className="page-privacy">
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
