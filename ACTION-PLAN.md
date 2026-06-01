# SEO Action Plan: Academic Wizard

## 🔴 Critical Priority (Do This Week)
1. **Add Canonical Tags**: Insert `<link rel="canonical" href="https://academicwizard.online/" />` to the `<head>` of your website to prevent duplicate content issues. Without this, search engines might get confused if your site is loaded via HTTP, HTTPS, `www`, or non-`www`.

## ⚠️ High Priority (Do This Month)
2. **Review Client-Side Rendering Strategy**: Your site is heavily reliant on JavaScript to render its content (via Vite). Ensure that your Vite/React setup does not block search engine bots from seeing the content. If you notice your pages aren't getting indexed, consider using a pre-rendering tool (like `vite-plugin-prerender`) so search bots receive raw HTML immediately.
3. **Implement JSON-LD Schema**: Add `Organization` or `Service` structured data into your `<head>` tag. This helps search engines understand your brand and services, drastically increasing your chances for rich snippets in search results (which builds E-E-A-T).

## 🟡 Medium Priority (Do Next Month)
4. **Remove Meta Keywords**: Delete `<meta name="keywords" content="...">` from your HTML. It provides zero SEO value and only serves to expose your target keyword strategy to competitors.
5. **Optimize Performance (INP/LCP)**: Implement code-splitting to reduce the size of your main JavaScript bundle. The faster the site loads and becomes interactive, the higher Google will rank it.
