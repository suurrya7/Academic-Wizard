# Academic Wizard — AI Directory Auto-Submitter Suite

This automated suite enables fast, scalable submission of Academic Wizard's free student tools (Linguistic AI Detector, AI Text Humanizer, Citation Generator, and Grammar Checker) to **25+ high-Domain-Authority (DA 50–90+) AI and startup directories**.

---

## 📁 Directory Structure

```
automation/directory_submitter/
├── tool_profiles.json         # Pre-formulated copy & metadata for all 4 tools
├── directories.json           # Catalog of 25+ curated AI directories with submission URLs
├── submit_puppeteer.js        # Automated browser submission assistant
├── autofill_bookmarklet.js    # 1-click JavaScript bookmarklet for manual/browser submission
├── submission_tracker.json    # Live ledger tracking submitted, pending, and live listings
└── README.md                  # This guide
```

---

## 🚀 Option 1: Automated Assistant via CLI (Recommended)

The automated assistant launches a browser window, opens each directory in sequence, auto-detects and fills form fields, and leaves the window open for you to solve any CAPTCHA or confirm submission before auto-logging the result.

### 1. View Available Directories & Status
```bash
node automation/directory_submitter/submit_puppeteer.js --list
node automation/directory_submitter/submit_puppeteer.js --status
```

### 2. Run Dry-Run Validation
```bash
node automation/directory_submitter/submit_puppeteer.js --dry-run
```

### 3. Launch Interactive Submission
```bash
# Submits the AI Content Detector (Default)
node automation/directory_submitter/submit_puppeteer.js --tool ai-detector --interactive

# Or target another tool:
node automation/directory_submitter/submit_puppeteer.js --tool ai-humanizer --interactive
node automation/directory_submitter/submit_puppeteer.js --tool citation-generator --interactive

# Or target a single specific directory:
node automation/directory_submitter/submit_puppeteer.js --directory toolify
```

**How It Works:**
1. The browser automatically navigates to the directory's submission URL.
2. Form fields (`Name`, `Website URL`, `Tagline`, `Description`, `Email`, `Category`, `Pricing`) are filled in 1 second flat.
3. You review, complete any CAPTCHA if prompted, and click "Submit".
4. Hit `[Enter]` in the terminal to record the submission in `submission_tracker.json` and move automatically to the next directory!

---

## ⚡ Option 2: 1-Click Browser Bookmarklet

If you prefer submitting directly from your everyday browser (Chrome, Safari, Brave, Edge):

1. Open your browser bookmarks bar (`Cmd + Shift + B` on Mac).
2. Create a new bookmark named: `⚡ Autofill Academic Wizard`.
3. Copy the minified code from [autofill_bookmarklet.js](./autofill_bookmarklet.js) and paste it into the **URL** field of your bookmark:
   ```javascript
   javascript:(function(){const d={name:"Academic Wizard Linguistic AI Detector",url:"https://academicwizard.online/tools/ai-detector/",email:"support@academicwizard.online",tagline:"Free AI Content & Academic Integrity Detector for Essays",pitch:"Instant linguistic AI detector analyzing perplexity and sentence burstiness to verify student essays against false Turnitin flags. 100% free with zero data logging.",desc:"Academic Wizard's Linguistic AI Detector is an essential academic integrity companion engineered specifically for higher education students and researchers.\n\nKey Capabilities:\n• Multi-Sentence Perplexity Scoring: Pinpoints exact paragraphs with uniform phrasing likely to trigger false positive flags.\n• Strict Non-Repository Policy: Your text is never stored, indexed, or shared with third-party databases.\n• Academic Convention Awareness: Calibrated for formal coursework, lab reports, and literature reviews.\n• Instant Color-Coded Heatmaps: Visual breakdown of human vs algorithmic syntax patterns.\n\n100% Free with zero ads or paywalls.",pricing:"Free",pricingType:"0",category:"Education / AI Detection",tags:"ai detector, academic integrity, turnitin checker, essay checker, edtech"};function setVal(el,val){if(!el)return false;el.focus();el.value=val;el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));el.blur();return true;}let c=0;document.querySelectorAll('input, textarea, select').forEach(el=>{const n=(el.name||'').toLowerCase(),i=(el.id||'').toLowerCase(),p=(el.placeholder||'').toLowerCase(),t=(el.type||'').toLowerCase();const m=n+' '+i+' '+p;if(t==='email'||m.includes('email')){if(setVal(el,d.email))c++;}else if(m.includes('tagline')||m.includes('headline')||m.includes('short_desc')||m.includes('summary')||m.includes('punchline')||m.includes('subtitle')){if(setVal(el,d.tagline))c++;}else if(el.tagName==='TEXTAREA'||m.includes('description')||m.includes('about')||m.includes('details')||m.includes('overview')){if(setVal(el,d.desc))c++;}else if(m.includes('url')||m.includes('website')||m.includes('link')||m.includes('domain')||m.includes('homepage')){if(setVal(el,d.url))c++;}else if(m.includes('tool_name')||m.includes('product_name')||m.includes('app_name')||m.includes('title')||m.includes('name')){if(setVal(el,d.name))c++;}else if(m.includes('pricing')||m.includes('price')){if(setVal(el,d.pricing))c++;}else if(m.includes('tag')||m.includes('keyword')){if(setVal(el,d.tags))c++;}});const t=document.createElement('div');t.innerText='⚡ Auto-filled '+c+' fields with Academic Wizard AI Detector data!';t.style.cssText='position:fixed;top:20px;right:20px;background:#D4AF37;color:#000;padding:14px 20px;border-radius:10px;font-family:sans-serif;font-weight:bold;font-size:14px;z-index:999999;box-shadow:0 4px 20px rgba(0,0,0,0.5);';document.body.appendChild(t);setTimeout(()=>t.remove(),4000);})();
   ```
4. Whenever you are on any AI directory submission form, click the bookmark to fill all fields in 0.1 seconds!

---

## 🏆 Top 25 Curated Directories Included

| Directory | Domain Authority | Login Required? | Pricing |
|:---|:---:|:---:|:---:|
| **There's An AI For That** | DA 78 | Free account | Free |
| **Futurepedia** | DA 68 | Google sign-in | Free |
| **Toolify.ai** | DA 65 | None | Free |
| **TopAI.tools** | DA 52 | None | Free |
| **FutureTools.io** | DA 60 | None | Free |
| **SaaSHub** | DA 67 | Free account | Free |
| **AlternativeTo** | DA 82 | Free account | Free |
| **Dang.ai** | DA 49 | None | Free |
| **AI Valley** | DA 48 | None | Free |
| **AI Tool Hunt** | DA 45 | None | Free |
| **AIcyclopedia** | DA 46 | None | Free |
| **Insidr AI** | DA 54 | None | Free |
| **MicroLaunch** | DA 51 | GitHub / Google | Free |
| **AI Top Tools** | DA 50 | None | Free |
| **AI Scout** | DA 48 | None | Free |
| **Easy With AI** | DA 52 | None | Free |
| **OpenTools AI** | DA 47 | None | Free |
| **AI Tools Guru** | DA 43 | None | Free |
| **FoundrAI** | DA 41 | None | Free |
| **NextGenTools** | DA 40 | None | Free |
| **All Things AI** | DA 49 | None | Free |
| **Product Hunt** | DA 91 | Google / Twitter | Free |
| **StartupStash** | DA 65 | Free account | Free |
| **1000.tools** | DA 44 | None | Free |
| **AI Tools Directory** | DA 42 | None | Free |
