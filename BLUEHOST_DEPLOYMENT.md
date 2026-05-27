# Bluehost Deployment Guide: Academic Wizard

Follow these steps to deploy your Academic Wizard website to Bluehost.

## Prerequisites
- Access to your Bluehost Control Panel (cPanel).
- FTP credentials or access to the File Manager in cPanel.

## Step 1: Build the Project
Before uploading, you must generate the production-ready files. In your local terminal, run:

```bash
npm run build
```

This will create a `dist` folder in your project directory containing all the optimized files.

## Step 2: Upload Files to Bluehost

### Option A: Using File Manager (Recommended for small updates)
1. Log in to your Bluehost account and go to **Advanced** > **File Manager**.
2. Navigate to the `public_html` directory (or the subdirectory for your domain).
3. Upload all the files and folders from your local `dist` directory into `public_html`.
   - **Note:** Do NOT upload the `dist` folder itself, only its *contents*.

### Option B: Using FTP (FileZilla)
1. Connect to your Bluehost server using your FTP credentials.
2. Navigate to the `public_html` directory.
3. Drag and drop the contents of your local `dist` folder into `public_html`.

## Step 3: Configure Client-Side Routing
Since this is a Single Page Application (SPA), you need to ensure that all requests are redirected to `index.html` so that React Router can handle them.

1. In the `public_html` directory on Bluehost, create a new file named `.htaccess`.
2. Paste the following code into the `.htaccess` file:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-y
  RewriteRule . /index.html [L]
</IfModule>
```

3. Save the file.

## Step 4: Verify Deployment
Navigate to your domain (e.g., `https://yourdomain.com`) in a web browser. Your Academic Wizard website should now be live!

---

### Troubleshooting
- **White Screen:** Check the browser console for errors. This is often caused by incorrect base paths in `vite.config.js`. If you are deploying to a subdirectory, ensure `base: '/subdirectory/'` is set.
- **404 on Refresh:** Ensure the `.htaccess` file is correctly placed in the same directory as `index.html`.
