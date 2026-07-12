import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { fileURLToPath } from 'node:url'
import prerenderer from '@prerenderer/rollup-plugin'
import puppeteer from '@prerenderer/renderer-puppeteer'

const projectRoot = fileURLToPath(new URL('.', import.meta.url))

// Blog routes are handled by scripts/generate-blog-pages.mjs post-build
// (Puppeteer prerenderer can't handle async-fetched blog content)

const serviceRoutes = [
  '/services/assignment-help',
  '/services/essay-help',
  '/services/dissertation-help',
  '/services/literature-review',
  '/services/research-paper-help',
  '/services/editing-proofreading',
  '/services/study-guidance',
];

const countries = ['uk', 'usa', 'australia', 'canada', 'india', 'ireland', 'singapore', 'germany'];
const countryServiceRoutes = [];

serviceRoutes.forEach(service => {
    countries.forEach(country => {
        countryServiceRoutes.push(`${service}/${country}`);
    });
});

// https://vite.dev/config/
export default defineConfig({
  base: process.env.BASE_PATH || '/',
  plugins: [
    react(),
    prerenderer({
      routes: [
        '/', 
        '/services', 
        '/about', 
        '/faq', 
        '/contact', 
        '/blog',
        '/privacy-policy',
        '/terms-of-service',
        ...serviceRoutes,
        ...countryServiceRoutes
      ],
      server: {
        port: 5174 // Use a custom port for the static server
      },
      renderer: new puppeteer({
        renderAfterTime: 10000,
        headless: true,
        maxConcurrentRoutes: 3,
        navigationTimeout: 120000
      })
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'vendor-react';
            if (id.includes('framer-motion')) return 'vendor-framer';
            if (id.includes('lucide-react')) return 'vendor-lucide';
            return 'vendor'; // all other node_modules
          }
        }
      }
    }
  },
})
