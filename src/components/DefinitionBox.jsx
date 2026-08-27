import React from 'react';
import { Info } from 'lucide-react';

const DefinitionBox = ({ title, definition }) => {
    return (
        <div className="glass-card p-6 my-8 border-l-4 border-l-accent-gold flex gap-4 items-start bg-accent-gold/5">
            <Info className="text-accent-gold shrink-0 mt-1" size={24} />
            <div>
                <h3 className="text-lg font-bold text-text-primary mb-2">What is {title}?</h3>
                <p className="text-text-secondary leading-relaxed m-0">
                    {definition}
                </p>
            </div>
        </div>
    );
};

export default DefinitionBox;
