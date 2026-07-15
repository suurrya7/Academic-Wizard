import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// Core UI components loaded eagerly
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ActivationGate from './components/ActivationGate';

const CustomCursor = React.lazy(() => import('./components/CustomCursor'));
const ParticleBackground = React.lazy(() => import('./components/ParticleBackground'));
const FloatingWhatsApp = React.lazy(() => import('./components/FloatingWhatsApp'));

// Pages loaded lazily (Code Splitting)
const Home = React.lazy(() => import('./pages/Home'));
const Services = React.lazy(() => import('./pages/Services'));
const ServicePage = React.lazy(() => import('./pages/ServicePage'));
const CountryServicePage = React.lazy(() => import('./pages/CountryServicePage'));
const About = React.lazy(() => import('./pages/About'));
const FAQ = React.lazy(() => import('./pages/FAQ'));
const Contact = React.lazy(() => import('./pages/Contact'));
const Blog = React.lazy(() => import('./pages/Blog'));
const BlogPost = React.lazy(() => import('./pages/BlogPost'));
const PrivacyPolicy = React.lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = React.lazy(() => import('./pages/TermsOfService'));

// Tools Pages (Lazy Loaded)
const Tools = React.lazy(() => import('./pages/Tools'));
const CitationGenerator = React.lazy(() => import('./pages/tools/CitationGenerator'));
const GrammarChecker = React.lazy(() => import('./pages/tools/GrammarChecker'));
const AIDetector = React.lazy(() => import('./pages/tools/AIDetector'));
const AIHumanizer = React.lazy(() => import('./pages/tools/AIHumanizer'));
const AdminPortal = React.lazy(() => import('./pages/AdminPortal'));

const LoadingFallback = () => (
  <div style={{ minHeight: '100vh', background: '#050505' }}></div>
);

function App() {
  return (
    <HelmetProvider>
      <Router basename={import.meta.env.BASE_URL}>
        <Suspense fallback={null}>
          <CustomCursor />
          <ParticleBackground />
        </Suspense>
        <Navbar />
        <main>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/:slug" element={<ServicePage />} />
              <Route path="/services/:serviceSlug/:countrySlug" element={<CountryServicePage />} />
              <Route path="/about" element={<About />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              
              {/* Tools Routes */}
              <Route path="/tools" element={<Tools />} />
              <Route path="/tools/citation-generator" element={<ActivationGate toolKey="citation" maxUses={10}><CitationGenerator /></ActivationGate>} />
              <Route path="/tools/grammar-checker" element={<ActivationGate toolKey="grammar" maxUses={10}><GrammarChecker /></ActivationGate>} />
              <Route path="/tools/ai-detector" element={<ActivationGate toolKey="detector" maxUses={10}><AIDetector /></ActivationGate>} />
              <Route path="/tools/ai-humanizer" element={<ActivationGate toolKey="humanizer" maxUses={5}><AIHumanizer /></ActivationGate>} />
              
              {/* Admin Portal */}
              <Route path="/admin-portal" element={<AdminPortal />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <Suspense fallback={null}>
          <FloatingWhatsApp />
        </Suspense>
      </Router>
    </HelmetProvider>
  );
}

export default App;
