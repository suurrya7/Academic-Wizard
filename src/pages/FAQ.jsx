import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import PageHeader from '../components/PageHeader';
import { Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
    {
        question: "Is your service confidential?",
        answer: "Yes, 100%. We take student privacy extremely seriously. All your personal details and academic requirements remain strictly confidential and are never shared with third parties."
    },
    {
        question: "How fast can academic assistance be delivered?",
        answer: "Our turnaround time depends on the complexity and scope of your request. However, we specialize in meeting tight deadlines and can often provide assistance within 24-48 hours for urgent tasks."
    },
    {
        question: "How do I request a quote?",
        answer: "The easiest way is to contact us directly on WhatsApp. Simply explain your academic requirements, deadline, and subject, and we will provide a custom quote instantly."
    },
    {
        question: "Which countries do you support?",
        answer: "We support university students globally, with a primary focus on the UK, Australia, USA, Ireland, and India. Our experts are familiar with the specific academic standards of these regions."
    },
    {
        question: "Do you provide plagiarism checking?",
        answer: "Yes, we provide comprehensive plagiarism checking as part of our quality assurance process. We ensure all academic assistance is original and properly cited."
    },
    {
        question: "How can I contact support?",
        answer: "Our primary support channel is WhatsApp (+91 95098 93638), available 24/7. You can also reach out via our contact page for email-based inquiries."
    }
];

const FAQItem = ({ faq }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-glass-border">
            <button
                className="w-full py-8 flex justify-between items-center text-left hover:text-accent-gold transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="text-lg font-heading tracking-widest uppercase text-white">{faq.question}</span>
                {isOpen ? <Minus className="text-accent-gold" style={{ color: 'var(--accent-gold)' }} /> : <Plus className="text-accent-gold" style={{ color: 'var(--accent-gold)' }} />}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <p className="pb-8 text-text-secondary leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                            {faq.answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const FAQ = () => {
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };

    return (
        <div className="page-faq">
            <Helmet>
                <title>Frequently Asked Questions | Academic Wizard</title>
                <meta name="description" content="Find quick answers to common questions about Academic Wizard's professional academic assistance and research support services." />
                <link rel="canonical" href="https://academicwizard.online/faq" />
                <meta property="og:title" content="Frequently Asked Questions | Academic Wizard" />
                <meta property="og:description" content="Find quick answers to common questions about Academic Wizard's professional academic assistance and research support services." />
                <meta property="og:url" content="https://academicwizard.online/faq" />
                <script type="application/ld+json">
                    {JSON.stringify(faqSchema)}
                </script>
            </Helmet>

            <PageHeader
                title="Frequently Asked Questions"
                subtitle="Find quick answers to common questions about our academic assistance and research support services."
            />

            <section className="py-20 container">
                <div className="max-w-4xl mx-auto">
                    {faqs.map((faq) => (
                        <FAQItem key={faq.question} faq={faq} />
                    ))}
                </div>
            </section>

            <section className="py-20 text-center container">
                <div className="glass-card p-12 inline-block border-accent-gold/20" style={{ borderColor: 'rgba(212, 175, 55, 0.2)' }}>
                    <h3 className="text-2xl font-bold font-heading mb-6 text-white">Still have questions?</h3>
                    <p className="text-text-secondary mb-8" style={{ color: 'var(--text-secondary)' }}>Our experts are available on WhatsApp to help you with any inquiries.</p>
                    <a href="https://wa.me/919509893638?text=Hello%20Academic%20Wizard,%20I%20have%20a%20question" target="_blank" rel="noreferrer" className="text-accent-gold font-heading tracking-widest uppercase border-b border-accent-gold pb-2 hover:text-white hover:border-white transition-all" style={{ color: 'var(--accent-gold)', borderColor: 'var(--accent-gold)' }}>
                        Chat on WhatsApp
                    </a>
                </div>
            </section>
        </div>
    );
};

export default FAQ;
