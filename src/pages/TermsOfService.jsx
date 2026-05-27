import React from 'react';
import PageHeader from '../components/PageHeader';

const TermsOfService = () => {
    return (
        <div className="page-terms">
            <PageHeader
                title="Terms of Service"
                subtitle="The service terms for Academic Wizard academic guidance, editing, and research support."
            />

            <section className="container px-6 pb-24">
                <div className="max-w-4xl mx-auto glass-card p-8 md:p-12 space-y-8">
                    <div>
                        <h2 className="text-2xl text-white mb-4">Purpose of Service</h2>
                        <p className="text-text-secondary leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                            Academic Wizard provides academic guidance, research support, editing, proofreading, formatting, planning help, and study assistance. Services are intended to support learning and improve academic quality.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl text-white mb-4">Student Responsibility</h2>
                        <p className="text-text-secondary leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                            Students are responsible for following their institution's academic integrity rules. Any guidance or reference material should be used ethically and reviewed before submission.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl text-white mb-4">Deadlines and Requirements</h2>
                        <p className="text-text-secondary leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                            Accurate instructions, rubrics, deadlines, and source requirements must be provided before work begins. Changes after confirmation may affect delivery time or pricing.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl text-white mb-4">No Grade Guarantee</h2>
                        <p className="text-text-secondary leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                            We aim to provide high-quality support, but grades, marks, approvals, or academic outcomes depend on many factors and cannot be guaranteed.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl text-white mb-4">Contact</h2>
                        <p className="text-text-secondary leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                            Questions about these terms can be sent through the contact page or WhatsApp support.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default TermsOfService;
