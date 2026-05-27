import React from 'react';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import {
    Briefcase,
    FileText,
    Library,
    BookOpen,
    Search,
    Microscope,
    Edit,
    CheckSquare,
    Presentation,
    BookMarked
} from 'lucide-react';

const serviceList = [
    {
        icon: Briefcase,
        title: 'Assignment Assistance',
        desc: 'Academic Wizard provides professional assignment assistance for university students who need help with research, structure, and academic formatting. Our experts cover all academic levels and subjects.',
        keywords: ['assignment help', 'assignment help UK']
    },
    {
        icon: FileText,
        title: 'Essay Writing Support',
        desc: 'Our experts assist students in developing high quality essays with proper research, academic arguments, and referencing. We focus on critical thinking and academic excellence.',
        keywords: ['essay writing help', 'essay help Australia']
    },
    {
        icon: Library,
        title: 'Dissertation Assistance',
        desc: 'We provide dissertation guidance including research structure, literature review assistance, and editing support. Tailored help for undergraduate and postgraduate dissertations.',
        keywords: ['dissertation assistance', 'dissertation help UK']
    },
    {
        icon: BookOpen,
        title: 'Thesis Guidance',
        desc: 'Expert support for PhD and Master theses. We help with methodology development, data analysis, and academic synthesis to ensure your thesis meets university standards.',
        keywords: ['thesis support']
    },
    {
        icon: Search,
        title: 'Research Paper Assistance',
        desc: 'Professional help with academic research papers. We assist in formulating research questions, gathering primary/secondary data, and writing comprehensive research reports.',
        keywords: ['research paper assistance']
    },
    {
        icon: Microscope,
        title: 'Case Study Assistance',
        desc: 'Detailed analysis of academic case studies. Our experts help apply theoretical frameworks to real-world scenarios with professional academic formatting.'
    },
    {
        icon: Edit,
        title: 'Editing & Proofreading',
        desc: 'Flawless academic editing service. We ensure your work is free from grammatical errors, follows proper referencing styles (APA, MLA, Harvard, etc.), and maintains a professional tone.',
        keywords: ['academic editing service']
    },
    {
        icon: CheckSquare,
        title: 'Plagiarism Checking',
        desc: 'Comprehensive originality reports. We use advanced tools to ensure your academic work is 100% original and properly cited to maintain academic integrity.'
    },
    {
        icon: Presentation,
        title: 'PowerPoint Support',
        desc: 'Visual and content support for academic presentations. We create structured, professional, and visually engaging slides for your university projects.'
    },
    {
        icon: BookMarked,
        title: 'Literature Review',
        desc: 'In-depth synthesis of academic literature. We help identify gaps in current research and build a strong theoretical foundation for your academic work.'
    },
];

const Services = () => {
    const whatsappUrl = "https://wa.me/919509893638?text=Hello%20Academic%20Wizard,%20I%20need%20academic%20assistance";

    return (
        <div className="page-services">
            <PageHeader
                title="Our Services"
                subtitle="Professional academic assistance and research support tailored to your university requirements."
            />

            <section className="py-20">
                <div className="container space-y-20">
                    {serviceList.map((service, index) => (
                        <div
                            key={index}
                            className={`flex flex-col lg:flex-row gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
                        >
                            <div className="w-full lg:w-1/3">
                                <div className="glass-card p-12 flex items-center justify-center aspect-square border-accent-gold/20" style={{ borderColor: 'rgba(212, 175, 55, 0.2)' }}>
                                    <service.icon size={100} className="text-accent-gold" style={{ color: 'var(--accent-gold)' }} />
                                </div>
                            </div>
                            <div className="w-full lg:w-2/3">
                                <h2 className="text-3xl font-bold mb-6 font-heading text-white">{service.title}</h2>
                                <p className="text-text-secondary text-lg leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>{service.desc}</p>
                                {service.keywords && (
                                    <div className="flex flex-wrap gap-3 mb-10">
                                        {service.keywords.map((k, i) => (
                                            <span key={i} className="px-4 py-2 bg-glass-bg border border-glass-border rounded-full text-[10px] uppercase tracking-widest text-accent-gold" style={{ color: 'var(--accent-gold)' }}>
                                                {k}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                <Button onClick={() => window.open(whatsappUrl, '_blank')}>
                                    Discuss Requirements
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Services;
