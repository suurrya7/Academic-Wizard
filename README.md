# Academic Wizard

Academic Wizard is a Vite + React site for academic guidance, editing, research support, and assignment planning. It is configured for GitHub Pages with a custom domain at:

https://academicwizard.online/

## Local Development

```bash
npm ci
npm run dev
```

## Build

```bash
npm run build
```

The build script runs Vite and then prepares the GitHub Pages artifact by copying generated blog assets, `data/posts.json`, `sitemap.xml`, `robots.txt`, creating `404.html`, and adding `.nojekyll`.

## Blog Automation

The daily GitHub Actions workflow generates 4 blog posts with Gemini, refreshes SEO files, commits generated content, builds the site, and deploys to GitHub Pages.

Required GitHub repository secret:

```text
GEMINI_API_KEY
```

Optional repository secret or variable:

```text
GEMINI_MODEL
```

Local dry run without calling Gemini:

```bash
python3 automation/generate_post.py --dry-run --count 4
```

Refresh sitemap and robots locally:

```bash
python3 automation/generate_seo.py
```

## Custom Domain

The site is configured to deploy at the domain root. If the domain changes later, update:

- `SITE_URL` in `.github/workflows/deploy.yml`
- `BASE_PATH` in `.github/workflows/deploy.yml`
- `BASE_PATH` or default base in `vite.config.js`
- GitHub Pages custom domain settings
