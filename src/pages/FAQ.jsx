import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import PageHeader from '../components/PageHeader';
import { Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
    {
        question: "Is your academic assistance completely confidential?",
        answer: "Yes, absolute confidentiality is the cornerstone of our service. We utilize enterprise-grade encryption for all communications. Your personal details, university name, and the nature of your request are never shared with our writers, third-party agencies, or any institutional databases."
    },
    {
        question: "How do you guarantee the originality of the work provided?",
        answer: "Every piece of academic work we deliver undergoes a rigorous two-step originality check. First, our writers are strictly bound to create content from scratch. Second, we run the final document through advanced, proprietary anti-plagiarism and AI-detection software before it ever reaches your inbox."
    },
    {
        question: "What happens if I need changes to the delivered work?",
        answer: "We offer a comprehensive free revision period. If the delivered work does not strictly adhere to your original instructions or grading rubric, our experts will revise it at no extra cost. Your satisfaction and academic success are our primary goals."
    },
    {
        question: "Who are the academic experts providing the assistance?",
        answer: "Our team consists exclusively of native English speakers holding Master's or PhD degrees from top-tier universities in the UK, USA, Canada, and Australia. They are retired professors, active researchers, and professional academic editors with years of pedagogical experience."
    },
    {
        question: "Can I communicate directly with the expert handling my project?",
        answer: "To maintain our strict privacy protocols and ensure efficient project management, all communication is routed through our dedicated 24/7 support team. You can relay any specific instructions, feedback, or questions, and we will ensure your expert receives them immediately."
    },
    {
        question: "How is the pricing structured for your services?",
        answer: "Our pricing is highly individualized, reflecting the unique demands of your project. It is calculated based on three main factors: the academic level (e.g., Undergraduate vs. Doctoral), the total word count or page length, and the urgency of the deadline."
    },
    {
        question: "What referencing styles do your experts support?",
        answer: "We support every major academic referencing style required by global universities. This includes APA (7th Edition), MLA (9th Edition), Harvard, Chicago/Turabian, OSCOLA for law, IEEE for engineering, and Vancouver for medical sciences."
    },
    {
        question: "Can you handle extremely urgent deadlines?",
        answer: "Yes, we specialize in high-pressure situations. For standard essays and assignments, we can often provide complete assistance within 12 to 24 hours. For longer projects like dissertations, we have rapid-response teams that can expedite specific chapters."
    },
    {
        question: "What is the difference between proofreading and editing?",
        answer: "Proofreading strictly addresses surface-level errors: spelling, grammar, punctuation, and typos. Editing is a much deeper intervention where we improve sentence structure, academic tone, logical flow, argument coherence, and overall readability."
    },
    {
        question: "Do you offer support for STEM subjects and data analysis?",
        answer: "Absolutely. Beyond humanities and business, we have specialists in computer science, engineering, mathematics, and applied sciences. We also offer dedicated statistical data analysis using SPSS, R, Python, and STATA for empirical dissertations."
    },
    {
        question: "How do I know if my payment is secure?",
        answer: "We use internationally recognized, PCI-compliant payment gateways to process all transactions. We do not store your credit card information on our servers, ensuring your financial data is fully protected against unauthorized access."
    },
    {
        question: "Are your services considered cheating or academic misconduct?",
        answer: "No. Academic Wizard provides model answers, structural editing, and research coaching. Our work is intended to serve as a high-quality study aid and reference tool to help you understand how to approach your assignments, not to be submitted directly as your own work."
    },
    {
        question: "What specific formatting guidelines do you follow?",
        answer: "By default, we format all documents in standard academic style: Times New Roman or Arial 12pt font, double-spaced, with 1-inch margins. However, if your university provides a specific formatting template, we will strictly adhere to those requirements."
    },
    {
        question: "Do you offer any discounts for returning students?",
        answer: "Yes, we highly value long-term academic partnerships. Returning students are eligible for loyalty discounts. We also occasionally offer seasonal promotions during peak mid-term and final exam periods. Contact our support team to inquire about active offers."
    },
    {
        question: "Can you help me choose a topic for my dissertation?",
        answer: "Topic ideation is one of our most popular services. Our PhD consultants can help you identify a compelling, researchable gap in your field's current literature and formulate strong, academically rigorous research questions to guide your study."
    },
    {
        question: "What happens if I miss my university deadline?",
        answer: "While we guarantee delivery on the deadline you set with us, we always recommend setting your Academic Wizard deadline at least 2-3 days before your actual university submission date. This provides ample time for you to review the work and request any necessary revisions."
    },
    {
        question: "Do you provide assistance with online exams or quizzes?",
        answer: "No, we strictly do not participate in live exams, quizzes, or any form of impersonation. Our services are focused entirely on asynchronous research, writing, editing, and academic coaching."
    },
    {
        question: "How do I submit the requirements for my assignment?",
        answer: "You can submit your requirements via our contact form or directly through WhatsApp. Please include your grading rubric, assignment brief, any specific readings you want incorporated, and your required citation style to ensure we meet your exact needs."
    },
    {
        question: "Can you match the writing style of my previous assignments?",
        answer: "Yes, if you provide us with samples of your previous academic work, our experts can analyze your personal writing style, tone, and vocabulary to ensure the assistance we provide seamlessly aligns with your voice."
    },
    {
        question: "Is there a money-back guarantee?",
        answer: "We operate on a strict quality-first basis. If the final work fundamentally fails to follow your initial instructions, and if our revision process cannot rectify the issue, we have a dispute resolution process that can result in a partial or full refund."
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
                        <div className="pb-8 text-text-secondary leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                            {faq.answer.split('\n').map((line, idx) => {
                                if (line.trim().startsWith('- ')) {
                                    return <li key={idx} className="ml-4 mb-2">{line.trim().substring(2)}</li>;
                                }
                                return <p key={idx} className="mb-4">{line}</p>;
                            })}
                        </div>
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
                subtitle="Everything you need to know about our academic services."
                breadcrumbs={[
                    { name: 'Home', url: '/' },
                    { name: 'FAQ', url: '/faq' }
                ]}
            />
            
            <section className="pt-12 pb-4 bg-bg-primary">
                <div className="container px-6 max-w-4xl mx-auto text-center">
                    <p className="text-text-secondary leading-relaxed">
                        Navigating university assignments, essays, and research papers can often raise important questions regarding confidentiality, originality, and the overall writing process. To help you make an informed decision, we have compiled a comprehensive list of frequently asked questions about Academic Wizard's services. Here you'll find detailed answers concerning our guarantees, expert qualifications, and strict adherence to academic integrity guidelines.
                    </p>
                </div>
            </section>

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
