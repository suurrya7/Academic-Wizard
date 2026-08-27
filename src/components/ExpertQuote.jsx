import React from 'react';
import { Quote } from 'lucide-react';

const ExpertQuote = ({ quote, author, role, image }) => {
    return (
        <div className="relative glass-card p-8 md:p-10 my-12 overflow-hidden border-l-4 border-accent-gold group">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-gold/5 rounded-full blur-3xl -z-10 group-hover:bg-accent-gold/10 transition-colors duration-500" />
            
            <Quote size={64} className="absolute -top-4 -left-4 text-accent-gold/10 -z-10 rotate-180" />
            
            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start">
                <div className="shrink-0">
                    <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-br from-accent-gold to-accent-blue">
                        <div className="w-full h-full rounded-full bg-bg-secondary flex items-center justify-center overflow-hidden">
                            {image ? (
                                <img src={image} alt={author} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-2xl font-heading font-bold text-white">{author.charAt(0)}</span>
                            )}
                        </div>
                    </div>
                </div>
                
                <div>
                    <blockquote className="text-xl md:text-2xl text-text-primary leading-relaxed font-heading italic mb-6">
                        "{quote}"
                    </blockquote>
                    
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-px bg-accent-gold/50" />
                        <div>
                            <div className="text-text-primary font-bold text-lg">{author}</div>
                            <div className="text-accent-gold text-sm font-semibold">{role}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExpertQuote;
