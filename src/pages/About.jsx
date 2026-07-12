import React from 'react';
import { Helmet } from 'react-helmet-async';
import PageHeader from '../components/PageHeader';
import { Target, Users, Globe, Shield } from 'lucide-react';

const About = () => {
    const aboutSchema = {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "name": "About Academic Wizard",
        "url": "https://academicwizard.online/about",
        "description": "Learn about Academic Wizard, our mission, vision, and the core values that drive our expert academic assistance services.",
        "publisher": {
            "@type": "Organization",
            "name": "Academic Wizard",
            "logo": "https://academicwizard.online/academic-wizard-favicon.webp"
        }
    };

    return (
        <div className="page-about">
            <Helmet>
                <title>About Us | Academic Wizard</title>
                <meta name="description" content="Learn about Academic Wizard, our mission, and our team of expert academic consultants dedicated to your success." />
                <link rel="canonical" href="https://academicwizard.online/about" />
                <meta property="og:title" content="About Us | Academic Wizard" />
                <meta property="og:description" content="Learn about Academic Wizard and our mission to help university students achieve academic excellence." />
                <meta property="og:url" content="https://academicwizard.online/about" />
                <script type="application/ld+json">
                    {JSON.stringify(aboutSchema)}
                </script>
            </Helmet>

            <PageHeader
                title="About Academic Wizard"
                subtitle="Empowering students worldwide with expert academic guidance, ethical research support, and unwavering dedication to educational success."
                breadcrumbs={[
                    { name: 'Home', url: '/' },
                    { name: 'About', url: '/about' }
                ]}
            />

            <section className="py-20 container">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div>
                        <h2 className="text-4xl font-bold mb-8 font-heading text-white">Our <span className="text-accent-gold" style={{ color: 'var(--accent-gold)' }}>Mission</span></h2>
                        <p className="text-text-secondary text-lg leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
                            Academic Wizard is an international academic assistance platform dedicated to supporting university students with research guidance, editing services, and academic writing support.
                        </p>
                        <p className="text-text-secondary text-lg leading-relaxed mb-10" style={{ color: 'var(--text-secondary)' }}>
                            Our mission is to help students achieve academic success through expert research assistance and professional academic guidance. We believe that every student deserves access to high-quality academic support to reach their full potential.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            {[
                                { icon: Target, title: 'Precision', desc: 'Accurate research and data-driven insights.' },
                                { icon: Globe, title: 'Global', desc: 'Supporting students in UK, USA, AU, IE, & IN.' },
                                { icon: Users, title: 'Expertise', desc: 'PhD and Master level academic specialists.' },
                                { icon: Shield, title: 'Integrity', desc: '100% confidential and original work.' },
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="text-accent-gold" style={{ color: 'var(--accent-gold)' }}>
                                        <item.icon size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-heading text-xs tracking-widest uppercase mb-2 text-white">{item.title}</h4>
                                        <p className="text-text-secondary text-xs" style={{ color: 'var(--text-secondary)' }}>{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <div className="glass-card p-4 aspect-[4/5] relative z-10">
                            <div className="w-full h-full bg-accent-gold/10 rounded-xl flex items-center justify-center border border-accent-gold/20" style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)', borderColor: 'rgba(212, 175, 55, 0.2)' }}>
                                <span className="text-accent-gold font-heading text-xl tracking-[10px]" style={{ color: 'var(--accent-gold)' }}>ACADEMIC WIZARD</span>
                            </div>
                        </div>
                        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-accent-gold/10 blur-[100px] -z-10" style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)' }} />
                    </div>
                </div>
            </section>

            <section className="py-32 bg-bg-secondary" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div className="container text-center">
                    <h2 className="text-3xl font-bold font-heading mb-12 text-white">Our Core <span className="text-accent-gold" style={{ color: 'var(--accent-gold)' }}>Philosophy</span></h2>
                    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div>
                            <h3 className="text-accent-gold text-4xl font-bold mb-4 font-heading" style={{ color: 'var(--accent-gold)' }}>01</h3>
                            <h4 className="font-heading text-sm mb-4 text-white">Quality First</h4>
                            <p className="text-text-secondary text-sm" style={{ color: 'var(--text-secondary)' }}>We never compromise on the quality of research and academic standards.</p>
                        </div>
                        <div>
                            <h3 className="text-accent-gold text-4xl font-bold mb-4 font-heading" style={{ color: 'var(--accent-gold)' }}>02</h3>
                            <h4 className="font-heading text-sm mb-4 text-white">Student Trust</h4>
                            <p className="text-text-secondary text-sm" style={{ color: 'var(--text-secondary)' }}>Building long-term relationships through reliability and confidentiality.</p>
                        </div>
                        <div>
                            <h3 className="text-accent-gold text-4xl font-bold mb-4 font-heading" style={{ color: 'var(--accent-gold)' }}>03</h3>
                            <h4 className="font-heading text-sm mb-4 text-white">Ethics</h4>
                            <p className="text-text-secondary text-sm" style={{ color: 'var(--text-secondary)' }}>Promoting academic integrity through guidance and support.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
