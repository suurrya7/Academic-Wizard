import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// Core UI components loaded eagerly
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import ParticleBackground from './components/ParticleBackground';
import FloatingWhatsApp from './components/FloatingWhatsApp';

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

const LoadingFallback = () => (
  <div style={{ minHeight: '100vh', background: '#050505' }}></div>
);

function App() {
  return (
    <HelmetProvider>
      <Router basename={import.meta.env.BASE_URL}>
        <CustomCursor />
        <ParticleBackground />
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
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <FloatingWhatsApp />
      </Router>
    </HelmetProvider>
  );
}

export default App;
