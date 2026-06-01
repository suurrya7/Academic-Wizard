import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs'
import prerenderer from '@prerenderer/rollup-plugin'
import puppeteer from '@prerenderer/renderer-puppeteer'

const projectRoot = fileURLToPath(new URL('.', import.meta.url))

// Read posts for dynamic routes
let blogRoutes = [];
try {
  const postsJson = fs.readFileSync(resolve(projectRoot, 'public/data/posts.json'), 'utf-8')
  const posts = JSON.parse(postsJson)
  blogRoutes = posts.map(p => `/blog/${p.slug}`)
} catch (e) {
  console.warn('Could not read posts.json for prerendering:', e)
}

const serviceRoutes = [
  '/services/assignment-help',
  '/services/essay-help',
  '/services/dissertation-help',
  '/services/literature-review',
  '/services/research-paper-help',
  '/services/editing-proofreading',
  '/services/study-guidance',
];

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
        ...blogRoutes
      ],
      renderer: new puppeteer({
        renderAfterTime: 2000,
        headless: true
      })
    })
  ],
  build: {
    // default output is index.html
  },
})
