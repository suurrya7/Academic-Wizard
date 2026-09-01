import React from 'react';
import { Helmet } from 'react-helmet-async';
import PageHeader from '../components/PageHeader';

const PrivacyPolicy = () => {
    const policySchema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Privacy Policy | Academic Wizard",
        "url": "https://academicwizard.online/privacy-policy/",
        "description": "Read our privacy policy to understand how Academic Wizard collects, uses, and protects your personal and academic data."
    };

    return (
        <div className="page-legal">
            <Helmet>
                <title>Privacy Policy | Academic Wizard</title>
                <meta name="description" content="Read our privacy policy to understand how Academic Wizard collects, uses, and protects your personal and academic data." />
                <link rel="canonical" href="https://academicwizard.online/privacy-policy/" />
                <meta property="og:title" content="Privacy Policy | Academic Wizard" />
                <meta property="og:description" content="Read our privacy policy to understand how Academic Wizard collects, uses, and protects your personal and academic data." />
                <meta property="og:url" content="https://academicwizard.online/privacy-policy/" />
                <meta property="og:type" content="website" />
                <script type="application/ld+json">
                    {JSON.stringify(policySchema)}
                </script>
            </Helmet>

            <PageHeader 
                title="Privacy Policy" 
                subtitle="Your privacy and academic confidentiality are our highest priorities."
                breadcrumbs={[
                    { name: 'Home', url: '/' },
                    { name: 'Privacy Policy', url: '/privacy-policy' }
                ]}
            />

            <section className="py-20 container max-w-4xl">
                <div className="glass-card p-10 space-y-8 text-text-secondary leading-relaxed">
                    <p>Last Updated: {new Date().toLocaleDateString()}</p>
                    
                    <h2 className="text-2xl font-bold text-white font-heading">1. Introduction</h2>
                    <p>At Academic Wizard ("we", "our", or "us"), we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website (academicwizard.online) and use our academic assistance services. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.</p>
                    
                    <h2 className="text-2xl font-bold text-white font-heading">2. Information We Collect</h2>
                    <p>We may collect information about you in a variety of ways. The information we may collect on the Site includes:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, email address, and telephone number, that you voluntarily give to us when you register with the Site or when you choose to participate in various activities related to the Site (such as chat support or contact forms).</li>
                        <li><strong>Academic Data:</strong> Information related to your academic requests, including assignment briefs, grading rubrics, syllabus documents, and the specific university guidelines you provide to us to fulfill your service request.</li>
                        <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-white font-heading">3. Use of Your Information</h2>
                    <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Create and manage your account and project requests.</li>
                        <li>Deliver the specific academic research, writing, and editing services you requested.</li>
                        <li>Process payments and refunds securely via third-party payment processors.</li>
                        <li>Email you regarding your project status, order delivery, and service updates.</li>
                        <li>Increase the efficiency and operation of the Site.</li>
                        <li>Monitor and analyze usage and trends to improve your experience with the Site.</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-white font-heading">4. Disclosure of Your Information</h2>
                    <p>We take academic confidentiality incredibly seriously. <strong>We do not sell, trade, rent, or otherwise share your personal information or the details of your academic requests with third parties, academic institutions, or any university databases.</strong></p>
                    <p>We may share information only in the following restricted situations:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others.</li>
                        <li><strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us or on our behalf, including payment processing (e.g., Stripe, PayPal), data analysis, email delivery, hosting services, and customer service (e.g., WhatsApp Business). These third parties are strictly bound by confidentiality agreements.</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-white font-heading">5. Tracking Technologies (Cookies)</h2>
                    <p>We may use cookies, web beacons, tracking pixels, and other tracking technologies on the Site to help customize the Site and improve your experience. When you access the Site, your personal information is not collected through the use of tracking technology. Most browsers are set to accept cookies by default. You can remove or reject cookies, but be aware that such action could affect the availability and functionality of the Site.</p>

                    <h2 className="text-2xl font-bold text-white font-heading">6. Data Security</h2>
                    <p>We use administrative, technical, and physical security measures to help protect your personal information. All communications between you and our experts are encrypted using TLS/SSL technology. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.</p>

                    <h2 className="text-2xl font-bold text-white font-heading">7. Policy for Minors</h2>
                    <p>We do not knowingly solicit information from or market to children under the age of 18. Our academic services are designed exclusively for university and college-level students. If we learn that we have collected personal information from a minor under age 18, we will delete that information as quickly as possible.</p>

                    <h2 className="text-2xl font-bold text-white font-heading">8. GDPR and CCPA Rights</h2>
                    <p>Depending on your geographic location (e.g., the European Economic Area or California), you may have the right to request access to the personal data we collect from you, change that information, or delete it in some circumstances. To request to review, update, or delete your personal information, please submit a request form by contacting our support team.</p>

                    <h2 className="text-2xl font-bold text-white font-heading">9. Contact Us</h2>
                    <p>If you have questions or comments about this Privacy Policy, please contact us at:</p>
                    <p className="mt-4">
                        Academic Wizard<br />
                        Email: admin@academicwizard.online<br />
                        WhatsApp: +91 95098 93638
                    </p>
                </div>
            </section>
        </div>
    );
};

export default PrivacyPolicy;
