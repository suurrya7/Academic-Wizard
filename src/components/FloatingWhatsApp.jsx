import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

const FloatingWhatsApp = () => {
    const whatsappUrl = "https://wa.me/919509893638?text=Hello%20Academic%20Wizard,%20I%20need%20academic%20assistance";

    return (
        <motion.a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with Academic Wizard on WhatsApp"
            className="fixed bottom-6 right-5 md:bottom-8 md:right-8 z-[90] flex items-center gap-3 rounded-full bg-[#25D366] px-4 py-3 md:px-5 shadow-[0_12px_32px_rgba(37,211,102,0.35)] text-white hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(37,211,102,0.45)] transition-all"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{ backgroundColor: '#25D366' }}
        >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                <MessageCircle size={22} />
            </span>
            <span className="hidden sm:flex flex-col leading-tight text-left">
                <span className="text-[10px] uppercase tracking-[2px] font-heading text-white/80">WhatsApp</span>
                <span className="text-sm font-semibold text-white">Chat Now</span>
            </span>
            <motion.div
                className="absolute inset-0 rounded-full bg-[#25D366]/30 -z-10"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ backgroundColor: 'rgba(37, 211, 102, 0.3)' }}
            />
        </motion.a>
    );
};

export default FloatingWhatsApp;
