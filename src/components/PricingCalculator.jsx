import React, { useState } from 'react';
import Button from './Button';

const PricingCalculator = () => {
    const [academicLevel, setAcademicLevel] = useState('undergraduate');
    const [wordCount, setWordCount] = useState(1000);
    const [deadline, setDeadline] = useState('7-days');

    // Base price per 250 words
    const baseRates = {
        'high-school': 6,
        'undergraduate': 7,
        'masters': 8,
        'phd': 10
    };

    const deadlineMultipliers = {
        '14-days': 1,
        '7-days': 1.15,
        '3-days': 1.35,
        '24-hours': 1.75,
        '12-hours': 2.2
    };

    const calculatePrice = () => {
        const pages = Math.ceil(wordCount / 250);
        const basePrice = baseRates[academicLevel] * pages;
        const finalPrice = basePrice * deadlineMultipliers[deadline];
        return finalPrice.toFixed(2);
    };

    return (
        <div className="glass-card p-8 border-accent-gold/20 max-w-2xl mx-auto text-left">
            <h3 className="text-2xl font-bold font-heading text-white mb-6 text-center">Get an Instant Quote</h3>
            
            <div className="space-y-6">
                <div>
                    <label className="block text-white/80 font-medium mb-2">Academic Level</label>
                    <select 
                        className="w-full bg-bg-secondary/50 border border-glass-border text-white p-3 rounded focus:outline-none focus:border-accent-gold transition-colors"
                        value={academicLevel}
                        onChange={(e) => setAcademicLevel(e.target.value)}
                    >
                        <option value="high-school">High School</option>
                        <option value="undergraduate">Undergraduate</option>
                        <option value="masters">Master's</option>
                        <option value="phd">PhD</option>
                    </select>
                </div>

                <div>
                    <label className="block text-white/80 font-medium mb-2">Word Count ({Math.ceil(wordCount/250)} Pages)</label>
                    <input 
                        type="range" 
                        min="250" 
                        max="10000" 
                        step="250"
                        value={wordCount}
                        onChange={(e) => setWordCount(parseInt(e.target.value))}
                        className="w-full h-2 bg-glass-border rounded-lg appearance-none cursor-pointer accent-accent-gold"
                    />
                    <div className="text-right mt-2 text-accent-gold font-bold">
                        {wordCount} words
                    </div>
                </div>

                <div>
                    <label className="block text-white/80 font-medium mb-2">Deadline</label>
                    <select 
                        className="w-full bg-bg-secondary/50 border border-glass-border text-white p-3 rounded focus:outline-none focus:border-accent-gold transition-colors"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                    >
                        <option value="14-days">14 Days</option>
                        <option value="7-days">7 Days</option>
                        <option value="3-days">3 Days</option>
                        <option value="24-hours">24 Hours</option>
                        <option value="12-hours">12 Hours</option>
                    </select>
                </div>

                <div className="mt-8 p-6 bg-accent-gold/10 rounded-lg border border-accent-gold/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                        <div className="text-white/60 text-sm font-medium mb-1">Estimated Price</div>
                        <div className="text-4xl font-bold text-accent-gold font-heading">
                            ${calculatePrice()}
                        </div>
                    </div>
                    <Button onClick={() => window.open(`https://wa.me/919509893638?text=Hello,%20I%20need%20a%20${wordCount}-word%20${academicLevel}%20assignment%20in%20${deadline.replace('-', ' ')}.%20Quote:%20$${calculatePrice()}`, '_blank')}>
                        Order Now
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PricingCalculator;
