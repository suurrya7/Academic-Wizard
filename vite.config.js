import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { fileURLToPath } from 'node:url'
import prerenderer from '@prerenderer/rollup-plugin'
import puppeteer from '@prerenderer/renderer-puppeteer'
import { countrySubjects, countryCities } from './src/data/specializedPages.js'

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
const specializedRoutes = [];

serviceRoutes.forEach(service => {
    countries.forEach(country => {
        countryServiceRoutes.push(`${service}/${country}`);
        
        // Add subject routes for this country
        if (countrySubjects[country]) {
            countrySubjects[country].forEach(subject => {
                specializedRoutes.push(`${service}/${country}/${subject.slug}`);
            });
        }
        
        // Add city routes for this country
        if (countryCities[country]) {
            countryCities[country].forEach(city => {
                specializedRoutes.push(`${service}/${country}/${city.slug}`);
            });
        }
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
        '/tools',
        '/tools/citation-generator',
        '/tools/grammar-checker',
        '/tools/ai-detector',
        '/tools/ai-humanizer',
        ...serviceRoutes,
        ...countryServiceRoutes,
        ...specializedRoutes
      ],
      server: {
        port: 5174 // Use a custom port for the static server
      },
      renderer: new puppeteer({
        renderAfterTime: 1000, // 1 second is plenty for static rendering
        headless: true,
        maxConcurrentRoutes: 5, // Process 5 routes at a time to speed it up
        navigationTimeout: 60000,
        launchOptions: {
          args: [
            '--no-sandbox', 
            '--disable-setuid-sandbox', 
            '--disable-gpu', 
            '--disable-dev-shm-usage',
            '--disable-crash-reporter',
            '--no-zygote',
            '--single-process'
          ]
        }
      })
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'lucide': ['lucide-react']
        }
      }
    }
  },
})
