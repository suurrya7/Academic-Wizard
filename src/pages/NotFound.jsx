import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>404 — Page Not Found | Academic Wizard</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="min-h-screen pt-32 pb-20 px-6 flex flex-col items-center justify-center text-center">
        <div className="glass-card max-w-lg p-12 rounded-3xl border-accent-gold/20 flex flex-col items-center">
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-gold to-white mb-6">
            404
          </h1>
          <h2 className="text-2xl font-bold text-white mb-4">Page Not Found</h2>
          <p className="text-neutral-light mb-10">
            Oops! The page you are looking for doesn't exist, has been moved, or is temporarily unavailable.
          </p>
          <Link to="/">
            <Button variant="primary" className="text-lg px-8 py-3">
              Back to Homepage
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default NotFound;
