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
            className="fixed bottom-8 right-8 z-[90] w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(37,211,102,0.4)] text-white hover:scale-110 transition-transform"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ y: -5 }}
            style={{ backgroundColor: '#25D366' }}
        >
            <MessageCircle size={32} fill="white" />
            <p className="text-text-secondary" style={{ color: 'var(--text-secondary)' }}>+91 95098 93638</p>
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
