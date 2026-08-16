import React from 'react';
import Button from './Button';

const ContactForm = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const name = form.name.value;
        const email = form.email.value;
        const service = form.service.value;
        const message = form.message.value;
        const msgText = `*New Service Inquiry*\n\n*Name:* ${name}\n*Email:* ${email}\n*Service:* ${service}\n*Message:* ${message}`;
        window.open(`https://wa.me/919509893638?text=${encodeURIComponent(msgText)}`, '_blank');
    };

    return (
        <div className="glass-card p-8 border-accent-gold/20 max-w-2xl mx-auto text-left">
            <h3 className="text-2xl font-bold font-heading text-white mb-6 text-center">Send Us a Message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-white/80 font-medium mb-2">Name</label>
                        <input 
                            type="text" 
                            name="name" 
                            required 
                            className="w-full bg-bg-secondary/50 border border-glass-border text-white p-3 rounded focus:outline-none focus:border-accent-gold transition-colors"
                            placeholder="Your Name"
                        />
                    </div>
                    <div>
                        <label className="block text-white/80 font-medium mb-2">Email</label>
                        <input 
                            type="email" 
                            name="email" 
                            required 
                            className="w-full bg-bg-secondary/50 border border-glass-border text-white p-3 rounded focus:outline-none focus:border-accent-gold transition-colors"
                            placeholder="your@email.com"
                        />
                    </div>
                </div>
                
                <div>
                    <label className="block text-white/80 font-medium mb-2">Service Required</label>
                    <select 
                        name="service"
                        className="w-full bg-bg-secondary/50 border border-glass-border text-white p-3 rounded focus:outline-none focus:border-accent-gold transition-colors"
                    >
                        <option value="Assignment Help">Assignment Help</option>
                        <option value="Essay Help">Essay Help</option>
                        <option value="Dissertation Help">Dissertation Help</option>
                        <option value="Literature Review">Literature Review</option>
                        <option value="Research Paper Help">Research Paper Help</option>
                        <option value="Editing & Proofreading">Editing & Proofreading</option>
                        <option value="Study Guidance">Study Guidance</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div>
                    <label className="block text-white/80 font-medium mb-2">Message & Requirements</label>
                    <textarea 
                        name="message" 
                        required 
                        rows="4" 
                        className="w-full bg-bg-secondary/50 border border-glass-border text-white p-3 rounded focus:outline-none focus:border-accent-gold transition-colors"
                        placeholder="Tell us about your assignment requirements, word count, and deadline..."
                    ></textarea>
                </div>

                <div className="text-center">
                    <Button type="submit" className="w-full sm:w-auto">
                        Send via WhatsApp
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ContactForm;
