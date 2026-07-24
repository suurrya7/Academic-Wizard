import React from 'react';
import { Helmet } from 'react-helmet-async';
import PageHeader from '../components/PageHeader';

const TermsOfService = () => {
    const termsSchema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Terms of Service | Academic Wizard",
        "url": "https://academicwizard.online/terms-of-service/",
        "description": "Read the terms of service and usage conditions for Academic Wizard's consulting and research services."
    };

    return (
        <div className="page-legal">
            <Helmet>
                <title>Terms of Service | Academic Wizard</title>
                <meta name="description" content="Read the terms of service and usage conditions for Academic Wizard's consulting and research services." />
                <link rel="canonical" href="https://academicwizard.online/terms-of-service" />
                <script type="application/ld+json">
                    {JSON.stringify(termsSchema)}
                </script>
            </Helmet>

            <PageHeader 
                title="Terms of Service" 
                subtitle="Please read these terms carefully before using our services."
                breadcrumbs={[
                    { name: 'Home', url: '/' },
                    { name: 'Terms of Service', url: '/terms-of-service' }
                ]}
            />

            <section className="py-20 container max-w-4xl">
                <div className="glass-card p-10 space-y-8 text-text-secondary leading-relaxed">
                    <p>Last Updated: {new Date().toLocaleDateString()}</p>

                    <h2 className="text-2xl font-bold text-white font-heading">1. Agreement to Terms</h2>
                    <p>These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and Academic Wizard ("we," "us" or "our"), concerning your access to and use of the academicwizard.online website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the "Site").</p>
                    <p>You agree that by accessing the Site and utilizing our services, you have read, understood, and agree to be bound by all of these Terms of Service. If you do not agree with all of these Terms of Service, then you are expressly prohibited from using the Site and you must discontinue use immediately.</p>

                    <h2 className="text-2xl font-bold text-white font-heading">2. Fair Use and Academic Integrity Policy</h2>
                    <p>Academic Wizard is firmly committed to upholding the highest standards of academic integrity. Our services are designed to provide research assistance, model answers, structural editing, and pedagogical guidance.</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Not for Direct Submission:</strong> Any written materials, research papers, dissertations, or essays provided by Academic Wizard are intended to serve as reference materials, model answers, or study aids. You agree not to submit any provided materials, in whole or in part, directly to any educational institution as your own original work.</li>
                        <li><strong>Copyright:</strong> The materials we provide are intended to facilitate your own learning and research. You do not acquire the copyright to the delivered materials and therefore cannot present them as your own creation.</li>
                        <li><strong>No Academic Misconduct:</strong> We strictly prohibit the use of our services for academic fraud, contract cheating, or plagiarism. We reserve the right to refuse service to anyone suspected of attempting to violate their institution's academic honor codes.</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-white font-heading">3. Order Process and Requirements</h2>
                    <p>When placing an order for academic assistance, you are responsible for providing clear, accurate, and complete instructions, including grading rubrics, required reading materials, formatting guidelines, and exact deadlines. </p>
                    <p>If the instructions you provide are ambiguous, conflicting, or incomplete, the delivery of your project may be delayed. Our experts will execute the project strictly based on the written instructions provided at the time of order confirmation. Any additional requirements added after the expert has begun work may incur additional charges and require an extension of the deadline.</p>

                    <h2 className="text-2xl font-bold text-white font-heading">4. Revisions and Amendments</h2>
                    <p>We are dedicated to your complete satisfaction. We offer a free revision period (typically 14 to 30 days depending on the project size) starting from the date of final delivery.</p>
                    <p>Free revisions are applicable only if the delivered work fails to meet the original instructions provided at the time of order placement. If your revision request introduces new materials, changes the original prompt, or requires entirely new research not initially discussed, it will be treated as a new order and billed accordingly.</p>

                    <h2 className="text-2xl font-bold text-white font-heading">5. Payment and Refunds</h2>
                    <p>All services must be paid for in advance unless an installment plan has been explicitly agreed upon with our support team. We use secure, third-party payment processors to handle all transactions.</p>
                    <p><strong>Refund Policy:</strong> Refunds are granted at our sole discretion under the following circumstances:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>If a suitable academic expert cannot be found for your highly specialized topic, a full refund will be issued immediately.</li>
                        <li>If the final delivery completely deviates from your original instructions and multiple revision attempts fail to rectify the issue, a partial or full refund may be issued following a review by our Quality Assurance team.</li>
                        <li>Refunds are not granted for changes of mind once an expert has already commenced work on the project, or if the deadline was missed due to a lack of communication or delayed provision of necessary materials on your part.</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-white font-heading">6. Intellectual Property Rights</h2>
                    <p>Unless otherwise indicated, the Site and all its proprietary tools (including the Citation Generator, AI Detector, and Grammar Checker), source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws.</p>

                    <h2 className="text-2xl font-bold text-white font-heading">7. Site Management</h2>
                    <p>We reserve the right, but not the obligation, to: (1) monitor the Site for violations of these Terms of Service; (2) take appropriate legal action against anyone who, in our sole discretion, violates the law or these Terms of Service; (3) in our sole discretion and without limitation, refuse, restrict access to, limit the availability of, or disable any of your Contributions or any portion thereof; and (4) otherwise manage the Site in a manner designed to protect our rights and property and to facilitate the proper functioning of the Site.</p>

                    <h2 className="text-2xl font-bold text-white font-heading">8. Contact Information</h2>
                    <p>To resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at:</p>
                    <p className="mt-4">
                        Academic Wizard<br />
                        Email: support@academicwizard.online<br />
                        WhatsApp: +91 95098 93638
                    </p>
                </div>
            </section>
        </div>
    );
};

export default TermsOfService;
