import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import { MessageCircle, Mail, Globe, Clock, CheckCircle } from 'lucide-react';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const whatsappUrl = "https://wa.me/919509893638?text=Hello%20Academic%20Wizard,%20I%20need%20academic%20assistance";

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const { name, email, subject, message } = formData;

        // Construct detailed WhatsApp message
        const text = `*Hi I need your help for my assignment*%0A%0A` +
            `*Name:* ${encodeURIComponent(name)}%0A` +
            `*Email:* ${encodeURIComponent(email)}%0A` +
            `*Subject:* ${encodeURIComponent(subject)}%0A` +
            `*Message:* ${encodeURIComponent(message || 'N/A')}`;

        const dynamicUrl = `https://wa.me/919509893638?text=${text}`;

        // Open WhatsApp in new tab
        window.open(dynamicUrl, '_blank');

        // Show success state
        setIsSubmitted(true);

        // Reset form after a delay
        setTimeout(() => {
            setIsSubmitted(false);
            setFormData({ name: '', email: '', subject: '', message: '' });
        }, 5000);
    };

    const contactSchema = {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "name": "Contact Academic Wizard",
        "url": "https://academicwizard.online/contact",
        "description": "Get in touch with an academic expert today for a custom quote and professional assistance.",
        "mainEntity": {
            "@type": "Organization",
            "name": "Academic Wizard",
            "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+91-95098-93638",
                "contactType": "customer support",
                "availableLanguage": ["English"]
            }
        }
    };

    return (
        <div className="page-contact">
            <Helmet>
                <title>Contact Us | Academic Wizard</title>
                <meta name="description" content="Get in touch with Academic Wizard. Contact us on WhatsApp for an instant custom quote on assignment help, essay writing, and dissertation support." />
                <link rel="canonical" href="https://academicwizard.online/contact" />
                <meta property="og:title" content="Contact Us | Academic Wizard" />
                <meta property="og:description" content="Get in touch with Academic Wizard. Contact us on WhatsApp for an instant custom quote." />
                <meta property="og:url" content="https://academicwizard.online/contact" />
                <script type="application/ld+json">
                    {JSON.stringify(contactSchema)}
                </script>
            </Helmet>

            <PageHeader
                title="Contact Us"
                subtitle="Get in touch with an academic expert today for a custom quote and professional assistance."
            />

            <section className="py-20 container">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                    <div>
                        <h2 className="text-4xl font-bold mb-8 font-heading text-white">Need Academic <br /><span className="text-accent-gold" style={{ color: 'var(--accent-gold)' }}>Assistance Today?</span></h2>
                        <p className="text-text-secondary text-lg leading-relaxed mb-12" style={{ color: 'var(--text-secondary)' }}>
                            Contact Academic Wizard directly on WhatsApp to discuss your academic requirements and receive a custom quote. Our experts are standing by to help you with your assignments, essays, and research papers.
                        </p>

                        <div className="space-y-8">
                            <div className="flex gap-6 items-center">
                                <div className="w-14 h-14 bg-accent-gold/10 rounded-xl flex items-center justify-center text-accent-gold" style={{ color: 'var(--accent-gold)' }}>
                                    <MessageCircle size={28} />
                                </div>
                                <div>
                                    <h4 className="font-heading text-xs uppercase tracking-widest text-white">WhatsApp</h4>
                                    <p className="text-text-secondary" style={{ color: 'var(--text-secondary)' }}>+91 95098 93638</p>
                                </div>
                            </div>
                            <div className="flex gap-6 items-center">
                                <div className="w-14 h-14 bg-accent-gold/10 rounded-xl flex items-center justify-center text-accent-gold" style={{ color: 'var(--accent-gold)' }}>
                                    <Clock size={28} />
                                </div>
                                <div>
                                    <h4 className="font-heading text-xs uppercase tracking-widest text-white">Availability</h4>
                                    <p className="text-text-secondary" style={{ color: 'var(--text-secondary)' }}>24/7 Student Support</p>
                                </div>
                            </div>
                            <div className="flex gap-6 items-center">
                                <div className="w-14 h-14 bg-accent-gold/10 rounded-xl flex items-center justify-center text-accent-gold" style={{ color: 'var(--accent-gold)' }}>
                                    <Globe size={28} />
                                </div>
                                <div>
                                    <h4 className="font-heading text-xs uppercase tracking-widest text-white">Global Support</h4>
                                    <p className="text-text-secondary" style={{ color: 'var(--text-secondary)' }}>UK, AU, USA, IE, India</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-16">
                            <Button onClick={() => window.open(whatsappUrl, '_blank')} className="w-full sm:w-auto px-16 py-6 text-sm">
                                Chat on WhatsApp
                            </Button>
                        </div>
                    </div>

                    <div className="glass-card p-12 border-accent-gold/20" style={{ borderColor: 'rgba(212, 175, 55, 0.2)' }}>
                        {isSubmitted ? (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in zoom-in duration-500">
                                <div className="w-20 h-20 bg-accent-gold/20 rounded-full flex items-center justify-center text-accent-gold">
                                    <CheckCircle size={48} />
                                </div>
                                <h3 className="text-2xl font-bold font-heading text-white">Inquiry Sent!</h3>
                                <p className="text-text-secondary" style={{ color: 'var(--text-secondary)' }}>
                                    Thank you for reaching out. We have opened WhatsApp to continue our conversation. Redirecting back to form in 5 seconds...
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <h3 className="text-2xl font-bold font-heading mb-8 text-white">Request a <span className="text-accent-gold" style={{ color: 'var(--accent-gold)' }}>Quote</span></h3>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-text-secondary block" style={{ color: 'var(--text-secondary)' }}>Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-glass-border px-6 py-4 rounded-xl focus:border-accent-gold outline-none text-white transition-colors"
                                        placeholder="e.g. John Doe"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-text-secondary block" style={{ color: 'var(--text-secondary)' }}>Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-glass-border px-6 py-4 rounded-xl focus:border-accent-gold outline-none text-white transition-colors"
                                        placeholder="e.g. john@example.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-text-secondary block" style={{ color: 'var(--text-secondary)' }}>Subject / Topic</label>
                                    <input
                                        type="text"
                                        name="subject"
                                        required
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-glass-border px-6 py-4 rounded-xl focus:border-accent-gold outline-none text-white transition-colors"
                                        placeholder="e.g. Business Management"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-text-secondary block" style={{ color: 'var(--text-secondary)' }}>Message (Optional)</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-glass-border px-6 py-4 rounded-xl focus:border-accent-gold outline-none text-white transition-colors h-32 resize-none"
                                        placeholder="Explain your requirements..."
                                    ></textarea>
                                </div>
                                <Button type="submit" className="w-full py-4 text-xs">
                                    Send Inquiry
                                </Button>
                            </form>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
