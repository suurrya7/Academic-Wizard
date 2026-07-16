import React from 'react';
import { Helmet } from 'react-helmet-async';
import PageHeader from '../components/PageHeader';
import { Mail, MessageCircle, Clock, ShieldCheck } from 'lucide-react';

const Contact = () => {
    const contactSchema = {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "name": "Contact Academic Wizard",
        "url": "https://academicwizard.online/contact",
        "mainEntity": {
            "@type": "Organization",
            "name": "Academic Wizard",
            "url": "https://academicwizard.online",
            "logo": "https://academicwizard.online/academic-wizard-favicon.webp",
            "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+91-95098-93638",
                "contactType": "customer service",
                "availableLanguage": "English"
            }
        }
    };

    return (
        <div className="page-contact">
            <Helmet>
                <title>Contact Us | Academic Wizard Support</title>
                <meta name="description" content="Get in touch with Academic Wizard's support team via WhatsApp or email. We offer 24/7 assistance for all your academic writing and research needs." />
                <link rel="canonical" href="https://academicwizard.online/contact" />
                <meta property="og:title" content="Contact Us | Academic Wizard" />
                <meta property="og:description" content="Get in touch with Academic Wizard's support team for 24/7 academic assistance." />
                <meta property="og:url" content="https://academicwizard.online/contact" />
                <script type="application/ld+json">
                    {JSON.stringify(contactSchema)}
                </script>
            </Helmet>

            <PageHeader
                title="Get in Touch"
                subtitle="Our dedicated support team and academic coordinators are available 24/7 to assist you with your research needs."
                breadcrumbs={[
                    { name: 'Home', url: '/' },
                    { name: 'Contact', url: '/contact' }
                ]}
            />

            <section className="py-20 container">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <div>
                        <h2 className="text-3xl font-bold mb-6 font-heading text-white">How Can We Help You?</h2>
                        <p className="text-text-secondary text-lg leading-relaxed mb-12" style={{ color: 'var(--text-secondary)' }}>
                            Whether you need a custom quote for a complex dissertation, have questions about our quality assurance process, or want to follow up on an ongoing order, our team is ready to provide immediate assistance.
                        </p>

                        <div className="space-y-8">
                            <div className="glass-card p-6 flex items-start gap-6 border-accent-gold/20 hover:border-accent-gold/40 transition-colors">
                                <div className="text-accent-gold shrink-0 mt-1" style={{ color: 'var(--accent-gold)' }}>
                                    <MessageCircle size={32} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">WhatsApp Support</h3>
                                    <p className="text-text-secondary mb-4" style={{ color: 'var(--text-secondary)' }}>Fastest response time. Available 24/7 for quotes and urgent queries.</p>
                                    <a href="https://wa.me/919509893638?text=Hello%20Academic%20Wizard" target="_blank" rel="noreferrer" className="text-accent-gold font-bold hover:underline" style={{ color: 'var(--accent-gold)' }}>
                                        +91 95098 93638
                                    </a>
                                </div>
                            </div>

                            <div className="glass-card p-6 flex items-start gap-6 border-white/5">
                                <div className="text-white/50 shrink-0 mt-1">
                                    <Mail size={32} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">Email Us</h3>
                                    <p className="text-text-secondary mb-4" style={{ color: 'var(--text-secondary)' }}>For detailed project briefs, document attachments, and formal inquiries.</p>
                                    <a href="mailto:support@academicwizard.online" className="text-white hover:text-accent-gold transition-colors">
                                        support@academicwizard.online
                                    </a>
                                </div>
                            </div>
                            
                            <div className="glass-card p-6 flex items-start gap-6 border-white/5">
                                <div className="text-white/50 shrink-0 mt-1">
                                    <Clock size={32} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">Business Hours</h3>
                                    <p className="text-text-secondary" style={{ color: 'var(--text-secondary)' }}>
                                        Our academic writers work globally across different time zones. Our customer support desk is operational <strong>24 hours a day, 7 days a week, 365 days a year</strong> to ensure you never miss a deadline.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="glass-card p-10 border-accent-gold/10">
                            <div className="flex items-center gap-3 mb-8">
                                <ShieldCheck className="text-accent-gold" size={24} style={{ color: 'var(--accent-gold)' }} />
                                <h3 className="text-2xl font-bold font-heading text-white">Send a Message</h3>
                            </div>
                            <p className="text-sm text-text-secondary mb-8">Your information is strictly confidential and protected by 256-bit encryption. We never share your data.</p>
                            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert("Thanks for contacting us!"); }}>
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-2">Full Name</label>
                                    <input type="text" id="name" className="w-full bg-bg-secondary/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent-gold transition-colors" placeholder="John Doe" required />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-2">Email Address</label>
                                    <input type="email" id="email" className="w-full bg-bg-secondary/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent-gold transition-colors" placeholder="john@university.edu" required />
                                </div>
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-text-secondary mb-2">Subject (Service Type)</label>
                                    <input type="text" id="subject" className="w-full bg-bg-secondary/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent-gold transition-colors" placeholder="e.g. Dissertation Help" />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-text-secondary mb-2">Message & Instructions</label>
                                    <textarea id="message" rows="4" className="w-full bg-bg-secondary/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent-gold transition-colors" placeholder="Please provide your word count, deadline, and topic..." required></textarea>
                                </div>
                                <button type="submit" className="w-full bg-accent-gold text-bg-primary font-bold py-4 rounded-lg hover:bg-white transition-colors duration-300">
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
