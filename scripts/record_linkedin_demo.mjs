import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const VIDEO_DIR = path.resolve('public/temp_video');
const FINAL_WEBM_PATH = path.resolve('public/linkedin-api-demo.webm');

if (!fs.existsSync(VIDEO_DIR)) {
  fs.mkdirSync(VIDEO_DIR, { recursive: true });
}

async function smoothScroll(page, distance, steps = 15, delayMs = 60) {
  const stepDistance = distance / steps;
  for (let i = 0; i < steps; i++) {
    await page.mouse.wheel(0, stepDistance);
    await page.waitForTimeout(delayMs);
  }
}

async function run() {
  console.log('🚀 Launching Playwright browser with video recording...');
  const browser = await chromium.launch({
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: {
      dir: VIDEO_DIR,
      size: { width: 1280, height: 720 }
    },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });

  const page = await context.newPage();

  // Helper to show informative overlay banner in video (pointer-events: none)
  async function showOverlay(text, durationMs = 2500) {
    await page.evaluate((msg) => {
      let banner = document.getElementById('demo-overlay-banner');
      if (!banner) {
        banner = document.createElement('div');
        banner.id = 'demo-overlay-banner';
        banner.style.position = 'fixed';
        banner.style.top = '20px';
        banner.style.left = '50%';
        banner.style.transform = 'translateX(-50%)';
        banner.style.backgroundColor = 'rgba(15, 15, 15, 0.94)';
        banner.style.color = '#D4AF37';
        banner.style.padding = '12px 28px';
        banner.style.borderRadius = '30px';
        banner.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        banner.style.fontSize = '15px';
        banner.style.fontWeight = '600';
        banner.style.letterSpacing = '0.5px';
        banner.style.zIndex = '999999';
        banner.style.pointerEvents = 'none';
        banner.style.boxShadow = '0 8px 30px rgba(0,0,0,0.6), 0 0 15px rgba(212, 175, 55, 0.3)';
        banner.style.border = '1px solid rgba(212, 175, 55, 0.5)';
        document.body.appendChild(banner);
      }
      banner.innerText = msg;
      banner.style.display = 'block';
    }, text);
    await page.waitForTimeout(durationMs);
  }

  try {
    // --- Step 1: Academic Wizard Platform Overview ---
    console.log('1. Navigating to Academic Wizard Homepage...');
    await page.goto('https://academicwizard.online', { waitUntil: 'domcontentloaded', timeout: 40000 });
    await page.waitForTimeout(2000);
    await showOverlay('Academic Wizard — Educational & Research Support Platform', 2500);

    console.log('Scrolling through platform features & services...');
    await smoothScroll(page, 450, 15, 60);
    await page.waitForTimeout(1000);
    await showOverlay('Comprehensive Academic Services: Assignment, Thesis & Research Support', 2500);
    await smoothScroll(page, 650, 15, 50);
    await page.waitForTimeout(1500);
    await smoothScroll(page, 700, 15, 50);
    await page.waitForTimeout(1500);

    // --- Step 2: Educational Blog & Content Syndication ---
    console.log('2. Navigating to Blog / Academic Research Publications...');
    await page.goto('https://academicwizard.online/blog', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(1500);
    await showOverlay('Educational Blog: Scholarly Articles & Research Guidance', 2500);
    await smoothScroll(page, 500, 15, 60);
    await page.waitForTimeout(1500);

    // --- Step 3: View Article Content ---
    console.log('3. Navigating to a published research guide...');
    await page.goto('https://academicwizard.online/blog/turnitin-ai-false-positives-a-2026-student-guide-to-integrity-audits', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(1500);
    await showOverlay('Research Article: Formatted & Summarized for LinkedIn Followers', 3000);
    await smoothScroll(page, 500, 15, 60);
    await page.waitForTimeout(2000);

    // --- Step 4: Official LinkedIn Company Page ---
    console.log('4. Navigating to LinkedIn Company Page...');
    await page.goto('https://www.linkedin.com/company/academic-wizard', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000);
    await showOverlay('Destination: Official Academic Wizard LinkedIn Company Page', 3500);
    await smoothScroll(page, 450, 15, 70);
    await page.waitForTimeout(2500);

    // --- Step 5: Backend Automated Publishing Architecture ---
    console.log('5. Demonstrating Backend API Integration Architecture...');
    await page.setContent(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            background-color: #0b0f17;
            color: #c9d1d9;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
            padding: 30px;
            margin: 0;
            box-sizing: border-box;
          }
          .card {
            background-color: #161b22;
            border: 1px solid #30363d;
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 10px 35px rgba(0,0,0,0.6);
          }
          h2 {
            color: #58a6ff;
            margin-top: 0;
            font-size: 20px;
          }
          .badge {
            background: #238636;
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            display: inline-block;
            margin-bottom: 12px;
          }
          pre {
            background: #090d13;
            border: 1px solid #30363d;
            padding: 16px;
            border-radius: 8px;
            color: #79c0ff;
            font-size: 13px;
            line-height: 1.5;
            overflow-x: auto;
          }
          .highlight { color: #ff7b72; font-weight: 600; }
          .string { color: #a5d6ff; }
          .comment { color: #8b949e; font-style: italic; }
          .footer-note {
            color: #8b949e;
            font-size: 13px;
            margin-top: 14px;
            border-top: 1px solid #21262d;
            padding-top: 12px;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <span class="badge">LinkedIn Community Management API Integration</span>
          <h2>Academic Wizard Content Syndication Engine (publisher.js)</h2>
          <p>Automated first-party publication of educational research summaries directly to our LinkedIn Organization Page:</p>
          <pre><code><span class="comment">// 1. Determine Author URN: LinkedIn Organization Page (Academic Wizard)</span>
<span class="highlight">const</span> authorUrn = <span class="string">\`urn:li:organization:\${process.env.LINKEDIN_ORG_ID}\`</span>;

<span class="comment">// 2. Post educational briefing directly to Academic Wizard Company Page</span>
<span class="highlight">const</span> res = <span class="highlight">await</span> fetchApi(<span class="string">'https://api.linkedin.com/v2/ugcPosts'</span>, {
    method: <span class="string">'POST'</span>,
    headers: {
        <span class="string">'Authorization'</span>: <span class="string">\`Bearer \${accessToken}\`</span>,
        <span class="string">'X-Restli-Protocol-Version'</span>: <span class="string">'2.0.0'</span>,
        <span class="string">'Content-Type'</span>: <span class="string">'application/json'</span>
    },
    body: JSON.stringify({
        author: authorUrn,
        lifecycleState: <span class="string">"PUBLISHED"</span>,
        specificContent: {
            <span class="string">"com.linkedin.ugc.ShareContent"</span>: {
                shareCommentary: { text: educationalSummary },
                shareMediaCategory: <span class="string">"ARTICLE"</span>,
                media: [{ status: <span class="string">"READY"</span>, originalUrl: articleCanonicalUrl }]
            }
        },
        visibility: { <span class="string">"com.linkedin.ugc.MemberNetworkVisibility"</span>: <span class="string">"PUBLIC"</span> }
    })
});</code></pre>
          <div class="footer-note">
            🔒 <strong>Compliance & Security:</strong> Operates strictly via secure GitHub Actions backend tasks. OAuth tokens encrypted in GitHub Secrets. No user profiling, scraping, or advertising use cases.
          </div>
        </div>
      </body>
      </html>
    `);
    await page.waitForTimeout(3500);
    await smoothScroll(page, 200, 10, 60);
    await page.waitForTimeout(3000);

  } catch (err) {
    console.error('Error during recording:', err);
  } finally {
    console.log('Closing browser to finalize video stream...');
    await page.close();
    await context.close();
    await browser.close();
  }

  // Find the recorded webm file
  const files = fs.readdirSync(VIDEO_DIR).filter(f => f.endsWith('.webm'));
  if (files.length === 0) {
    throw new Error('No video recorded!');
  }
  const recordedWebmPath = path.join(VIDEO_DIR, files[0]);
  console.log(`Video recorded to: ${recordedWebmPath}`);

  // Rename to final location in public folder
  fs.copyFileSync(recordedWebmPath, FINAL_WEBM_PATH);
  fs.rmSync(VIDEO_DIR, { recursive: true, force: true });
  console.log(`🎉 Demo video successfully created at: ${FINAL_WEBM_PATH}`);
}

run().catch(console.error);
