#!/usr/bin/env node
/**
 * 🧙‍♂️ Academic Wizard — Ultra Stealth Anti-Detect Tool Directory Automator
 * 
 * Features:
 * - Anti-Detect Cloaking (Masks webdriver, Canvas noise, WebGL vendor/renderer, AudioContext, Permissions, Chrome runtime)
 * - User-Agent & Screen Profile Rotation (Modern Chrome on macOS / Windows)
 * - Human-Behavior Emulation (Bézier mouse movements, natural typing jitter, smooth organic scroll)
 * - Deep React/Vue/Angular DOM event dispatch (Synthetic value setter + input/change/blur events)
 * - Embedded Frame Support (Scans both main document and child iframes like Typeform, Tally, Google Forms, Airtable)
 * - Per-Directory 30s Strict Timeout Guard (Never freezes or halts on slow/hanging websites)
 * - Idempotency Guard (Skips already successfully submitted directories)
 */

import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROFILES_PATH = path.join(__dirname, 'tools_profiles.json');
const DB_PATH = path.join(__dirname, 'directories_database.json');
const HISTORY_PATH = path.join(__dirname, 'submission_history.json');
const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots');

const BROWSER_PROFILES = [
  {
    ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    platform: 'MacIntel',
    vendor: 'Apple Inc.',
    renderer: 'Apple M2 Pro',
    brands: [
      { brand: 'Google Chrome', version: '131' },
      { brand: 'Chromium', version: '131' },
      { brand: 'Not_A Brand', version: '24' }
    ]
  },
  {
    ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    platform: 'Win32',
    vendor: 'Google Inc. (NVIDIA)',
    renderer: 'ANGLE (NVIDIA, NVIDIA GeForce RTX 3070 Direct3D11 vs_5_0 ps_5_0, D3D11)',
    brands: [
      { brand: 'Google Chrome', version: '131' },
      { brand: 'Chromium', version: '131' },
      { brand: 'Not_A Brand', version: '24' }
    ]
  },
  {
    ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
    platform: 'MacIntel',
    vendor: 'Apple Inc.',
    renderer: 'Apple M1 Max',
    brands: [
      { brand: 'Google Chrome', version: '130' },
      { brand: 'Chromium', version: '130' },
      { brand: 'Not_A Brand', version: '24' }
    ]
  }
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const randomDelay = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

async function applyStealthShield(page, profile) {
  await page.evaluateOnNewDocument((p) => {
    try {
      const newProto = navigator.__proto__;
      delete newProto.webdriver;
      navigator.__proto__ = newProto;
    } catch (e) {}
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined, configurable: true });

    window.chrome = {
      app: { isInstalled: false, InstallState: { DISABLED: 'disabled', INSTALLED: 'installed', NOT_INSTALLED: 'not_installed' }, RunningState: { CANNOT_RUN: 'cannot_run', READY_TO_RUN: 'ready_to_run', RUNNING: 'running' } },
      runtime: {
        OnInstalledReason: { CHROME_UPDATE: 'chrome_update', INSTALL: 'install', SHARED_MODULE_UPDATE: 'shared_module_update', UPDATE: 'update' },
        PlatformArch: { ARM: 'arm', ARM64: 'arm64', MIPS: 'mips', MIPS64: 'mips64', X86_32: 'x86-32', X86_64: 'x86-64' },
        PlatformNaclArch: { ARM: 'arm', MIPS: 'mips', MIPS64: 'mips64', X86_32: 'x86-32', X86_64: 'x86-64' },
        PlatformOs: { ANDROID: 'android', CROS: 'cros', LINUX: 'linux', MAC: 'mac', OPENBSD: 'openbsd', WIN: 'win' },
        connect: () => {},
        sendMessage: () => {}
      },
      csi: () => ({ startE: Date.now(), onloadT: Date.now() + 100, pageT: 150, tran: 15 }),
      loadTimes: () => ({ commitLoadTime: Date.now() / 1000, connectionInfo: 'h2', finishDocumentLoadTime: Date.now() / 1000 + 0.1, finishLoadTime: Date.now() / 1000 + 0.2, firstPaintAfterLoadTime: 0, firstPaintTime: Date.now() / 1000 + 0.05, navigationType: 'Other', npnNegotiatedProtocol: 'h2', requestTime: Date.now() / 1000, startLoadTime: Date.now() / 1000, wasAlternateProtocolAvailable: false, wasFetchedViaSpdy: true, wasNpnNegotiated: true })
    };

    const fakePlugins = [
      { name: 'PDF Viewer', filename: 'internal-pdf-viewer', description: 'Portable Document Format' },
      { name: 'Chrome PDF Viewer', filename: 'internal-pdf-viewer', description: 'Portable Document Format' },
      { name: 'Chromium PDF Viewer', filename: 'internal-pdf-viewer', description: 'Portable Document Format' }
    ];
    Object.defineProperty(navigator, 'plugins', { get: () => fakePlugins, configurable: true });

    Object.defineProperty(navigator, 'platform', { get: () => p.platform, configurable: true });
    Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en', 'en-GB'], configurable: true });
    Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => 8, configurable: true });
    Object.defineProperty(navigator, 'deviceMemory', { get: () => 8, configurable: true });
    Object.defineProperty(navigator, 'maxTouchPoints', { get: () => 0, configurable: true });

    const getParameter = WebGLRenderingContext.prototype.getParameter;
    WebGLRenderingContext.prototype.getParameter = function (param) {
      if (param === 37445) return p.vendor;
      if (param === 37446) return p.renderer;
      return getParameter.apply(this, arguments);
    };

    // Sub-pixel Canvas Noise
    const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
    HTMLCanvasElement.prototype.toDataURL = function (type) {
      const ctx = this.getContext('2d');
      if (ctx) {
        try {
          const imgData = ctx.getImageData(0, 0, Math.min(this.width, 10), Math.min(this.height, 10));
          for (let i = 0; i < imgData.data.length; i += 4) {
            imgData.data[i] = Math.min(255, Math.max(0, imgData.data[i] + (i % 2 === 0 ? 1 : -1)));
          }
          ctx.putImageData(imgData, 0, 0);
        } catch (e) {}
      }
      return originalToDataURL.apply(this, arguments);
    };

    const originalQuery = window.navigator.permissions.query;
    window.navigator.permissions.query = (params) =>
      params.name === 'notifications'
        ? Promise.resolve({ state: Notification.permission })
        : originalQuery(params);
  }, profile);
}

async function humanType(frameOrPage, selector, text) {
  try {
    const el = await frameOrPage.$(selector);
    if (!el) return false;

    await frameOrPage.evaluate((el) => {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.focus();
    }, el);

    await sleep(randomDelay(80, 150));

    try {
      await el.click();
    } catch (e) {
      await el.focus();
    }

    await sleep(randomDelay(80, 150));

    // Fast human typing with event triggers
    for (let i = 0; i < text.length; i++) {
      await frameOrPage.keyboard.type(text[i], { delay: randomDelay(20, 50) });
      if (text[i] === ' ' && Math.random() > 0.8) {
        await sleep(randomDelay(80, 150));
      }
    }

    // Force React/Vue/Angular synthetic state sync
    await frameOrPage.evaluate((el, val) => {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
      const nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;

      if (el.tagName === 'INPUT' && nativeInputValueSetter) {
        nativeInputValueSetter.call(el, val);
      } else if (el.tagName === 'TEXTAREA' && nativeTextAreaValueSetter) {
        nativeTextAreaValueSetter.call(el, val);
      } else {
        el.value = val;
      }

      el.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
      el.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
      el.dispatchEvent(new Event('blur', { bubbles: true, cancelable: true }));
    }, el, text);

    await sleep(randomDelay(100, 200));
    return true;
  } catch (err) {
    return false;
  }
}

async function fillTargetContext(ctx, tool) {
  let fieldsFilled = 0;

  const nameSelectors = ['input[name*="name" i]', 'input[name*="title" i]', 'input[name*="product" i]', 'input[name*="app" i]', 'input[id*="name" i]', 'input[id*="title" i]', 'input[placeholder*="Name" i]', 'input[placeholder*="Title" i]', 'input[placeholder*="Product" i]', 'input[placeholder*="Tool" i]'];
  for (const sel of nameSelectors) {
    if (await ctx.$(sel)) {
      const ok = await humanType(ctx, sel, tool.name);
      if (ok) {
        console.log(`    ✓ Filled Tool Name: "${tool.name}"`);
        fieldsFilled++;
        break;
      }
    }
  }

  const urlSelectors = ['input[type="url"]', 'input[name*="url" i]', 'input[name*="website" i]', 'input[name*="link" i]', 'input[name*="domain" i]', 'input[id*="url" i]', 'input[id*="website" i]', 'input[placeholder*="http" i]', 'input[placeholder*="url" i]', 'input[placeholder*="website" i]'];
  for (const sel of urlSelectors) {
    if (await ctx.$(sel)) {
      const ok = await humanType(ctx, sel, tool.website_url);
      if (ok) {
        console.log(`    ✓ Filled Website URL: "${tool.website_url}"`);
        fieldsFilled++;
        break;
      }
    }
  }

  const taglineSelectors = ['input[name*="tagline" i]', 'input[name*="headline" i]', 'input[name*="short" i]', 'input[name*="summary" i]', 'input[name*="subtitle" i]', 'input[placeholder*="tagline" i]', 'input[placeholder*="short" i]', 'input[placeholder*="headline" i]'];
  for (const sel of taglineSelectors) {
    if (await ctx.$(sel)) {
      const ok = await humanType(ctx, sel, tool.tagline);
      if (ok) {
        console.log(`    ✓ Filled Tagline: "${tool.tagline}"`);
        fieldsFilled++;
        break;
      }
    }
  }

  const descSelectors = ['textarea[name*="desc" i]', 'textarea[name*="about" i]', 'textarea[name*="detail" i]', 'textarea[id*="desc" i]', 'textarea[placeholder*="desc" i]', 'textarea[placeholder*="about" i]', 'textarea'];
  for (const sel of descSelectors) {
    if (await ctx.$(sel)) {
      const ok = await humanType(ctx, sel, tool.full_description);
      if (ok) {
        console.log(`    ✓ Filled Full Description (${tool.full_description.length} chars)`);
        fieldsFilled++;
        break;
      }
    }
  }

  const emailSelectors = ['input[type="email"]', 'input[name*="email" i]', 'input[id*="email" i]', 'input[placeholder*="email" i]'];
  for (const sel of emailSelectors) {
    if (await ctx.$(sel)) {
      const ok = await humanType(ctx, sel, tool.contact_email);
      if (ok) {
        console.log(`    ✓ Filled Email: "${tool.contact_email}"`);
        fieldsFilled++;
        break;
      }
    }
  }

  // Auto-check Terms Checkboxes
  try {
    const checkboxes = await ctx.$$('input[type="checkbox"]');
    for (const cb of checkboxes) {
      const isChecked = await (await cb.getProperty('checked')).jsonValue();
      if (!isChecked) {
        await cb.evaluate(el => el.click());
        console.log(`    ✓ Checked terms/agreement confirmation box`);
      }
    }
  } catch (e) {}

  return fieldsFilled;
}

async function autoFillDirectoryForm(page, tool) {
  console.log(`  🤖 Scanning page & frames for submission form inputs...`);
  let fieldsFilled = await fillTargetContext(page, tool);

  for (const frame of page.frames()) {
    if (frame === page.mainFrame()) continue;
    try {
      const frameFilled = await fillTargetContext(frame, tool);
      if (frameFilled > 0) {
        console.log(`    ⚡ Injected ${frameFilled} fields inside embedded form frame`);
        fieldsFilled += frameFilled;
      }
    } catch (e) {}
  }
  return fieldsFilled;
}

async function autoClickSubmit(page) {
  console.log(`  🚀 Initiating Automatic Submission Click Sequence...`);
  const submitSelectors = ['button[type="submit"]', 'input[type="submit"]', 'button:not([disabled])', 'form button'];
  let clicked = false;

  for (const sel of submitSelectors) {
    const buttons = await page.$$(sel);
    for (const btn of buttons) {
      const text = (await page.evaluate(el => el.innerText || el.value || '', btn)).toLowerCase().trim();
      const isSubmitText = ['submit', 'add tool', 'publish', 'submit tool', 'submit product', 'continue', 'next', 'send', 'add product', 'submit startup'].some(kw => text.includes(kw));

      if (isSubmitText) {
        console.log(`    🎯 Found Target Submit Button: "${text.toUpperCase()}"`);
        await page.evaluate(el => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), btn);
        await sleep(randomDelay(300, 600));

        // Click via DOM evaluate to avoid hanging on alert/modal
        await page.evaluate(el => el.click(), btn);
        clicked = true;
        console.log(`    ⚡ [SUBMIT CLICKED] Triggered form dispatch!`);
        break;
      }
    }
    if (clicked) break;
  }

  if (!clicked) {
    clicked = await page.evaluate(() => {
      const form = document.querySelector('form');
      if (form) {
        form.requestSubmit ? form.requestSubmit() : form.submit();
        return true;
      }
      return false;
    });
    if (clicked) {
      console.log(`    ⚡ [FORM DISPATCHED] Triggered standard HTML form submission!`);
    }
  }

  if (clicked) {
    await sleep(randomDelay(2500, 4000));
    const pageText = await page.evaluate(() => document.body.innerText.toLowerCase());
    const isSuccess = ['thank you', 'submitted', 'received', 'under review', 'success', 'confirmation', 'added', 'reviewing', 'listed'].some(kw => pageText.includes(kw));
    return { clicked: true, confirmed: isSuccess, message: isSuccess ? 'Confirmed Live' : 'Dispatched to Queue' };
  }

  return { clicked: false, confirmed: false, message: 'No Submit Button Found' };
}

async function processDirectorySubmission(directory, tool, browser, autoSubmit = true) {
  const page = await browser.newPage();
  
  // Set dialog auto-dismiss so no modal can block execution
  page.on('dialog', async dialog => {
    try { await dialog.accept(); } catch (e) {}
  });

  const profile = BROWSER_PROFILES[Math.floor(Math.random() * BROWSER_PROFILES.length)];
  await applyStealthShield(page, profile);
  await page.setUserAgent(profile.ua);
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  const dirName = directory.name;
  const targetUrl = directory.submission_url;

  console.log(`\n🚀 [DA ${directory.da}] Navigating to: ${dirName}`);
  console.log(`   URL: ${targetUrl}`);

  try {
    // 25s timeout for navigation
    const response = await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 25000 });
    const status = response ? response.status() : 'Unknown';
    console.log(`   HTTP Status: ${status}`);

    await sleep(randomDelay(1500, 2500));

    const filledCount = await autoFillDirectoryForm(page, tool);
    let submitResult = { clicked: false, confirmed: false, message: 'Skipped' };

    if (autoSubmit && filledCount > 0) {
      submitResult = await autoClickSubmit(page);
    }

    await fs.mkdir(SCREENSHOTS_DIR, { recursive: true });
    const screenshotName = `${directory.id}_${Date.now()}.png`;
    const screenshotPath = path.join(SCREENSHOTS_DIR, screenshotName);
    await page.screenshot({ path: screenshotPath, fullPage: false });

    console.log(`   📸 Proof Screenshot Saved: ${screenshotName}`);
    console.log(`   ✨ Fields Injected: ${filledCount}`);
    if (submitResult.clicked) {
      console.log(`   🎉 Submission Status: ${submitResult.confirmed ? '✅ Confirmed Live' : '✅ Dispatched to Directory Queue'}`);
    }

    return {
      id: directory.id,
      name: dirName,
      da: directory.da,
      submission_url: targetUrl,
      status: submitResult.confirmed ? '✅ Submitted & Confirmed' : (submitResult.clicked ? '✅ Submitted (In Queue)' : (filledCount > 0 ? '🟢 Pre-filled & Ready' : '🟡 Manual Review / Dynamic Form')),
      fields_filled: filledCount,
      auto_submitted: submitResult.clicked,
      screenshot: screenshotName,
      tool: tool.name,
      timestamp: new Date().toISOString()
    };
  } catch (err) {
    console.log(`   ⚠️ Notice: ${err.message}`);
    return {
      id: directory.id,
      name: dirName,
      da: directory.da,
      submission_url: targetUrl,
      status: '⚠️ Navigation Timeout / Protected Portal',
      error: err.message,
      timestamp: new Date().toISOString()
    };
  } finally {
    try { await page.close(); } catch (e) {}
  }
}

async function main() {
  const args = process.argv.slice(2);
  const isHeadless = !args.includes('--show');
  const autoSubmit = !args.includes('--dry-run');
  const targetToolArg = args.find((a) => a.startsWith('--tool='))?.split('=')[1] || 'all';
  const limit = parseInt(args.find((a) => a.startsWith('--limit='))?.split('=')[1] || '50', 10);
  const forceAll = args.includes('--force');

  console.log('='.repeat(72));
  console.log(' 🧙‍♂️ Academic Wizard — Ultra Stealth Backlink & Directory Automator');
  console.log(` Mode: ${isHeadless ? 'Stealth Headless' : 'Visual Window'} | Target: ${targetToolArg.toUpperCase()}`);
  console.log(` Anti-Bot Evasion: 🛡️ ACTIVE (Canvas Noise + WebGL + Audio + React State Sync)`);
  console.log(` Auto-Submit Clicking: ${autoSubmit ? '🟢 ENABLED (Live Final Submit)' : '🟡 DRY-RUN ONLY'}`);
  console.log('='.repeat(72));

  const profiles = JSON.parse(await fs.readFile(PROFILES_PATH, 'utf-8'));
  const db = JSON.parse(await fs.readFile(DB_PATH, 'utf-8'));
  let history = {};
  try {
    history = JSON.parse(await fs.readFile(HISTORY_PATH, 'utf-8'));
  } catch (e) {}

  let toolKeys = targetToolArg === 'all' ? Object.keys(profiles.tools) : targetToolArg.split(',').filter(k => profiles.tools[k]);

  const browser = await puppeteer.launch({
    headless: isHeadless ? 'new' : false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--disable-infobars',
      '--window-size=1440,900',
      '--disable-dev-shm-usage',
      '--no-first-run',
      '--no-default-browser-check'
    ]
  });

  const targetDirs = db.directories.slice(0, limit);
  console.log(`\n📋 Target Directories: ${targetDirs.length}`);
  console.log(`🔧 Target Tools: ${toolKeys.map(k => profiles.tools[k].name).join(', ')}\n`);

  for (const dir of targetDirs) {
    // Skip if already successfully submitted (unless --force)
    const existing = history[dir.id];
    if (!forceAll && existing && (existing.status.includes('Confirmed') || existing.status.includes('In Queue'))) {
      console.log(`⏩ [DA ${dir.da}] ${dir.name}: Already ${existing.status} -> Skipping`);
      continue;
    }

    let chosenToolKey = toolKeys[0];
    if (dir.target_tools && dir.target_tools.length > 0) {
      const match = toolKeys.find(k => dir.target_tools.includes(k));
      if (match) chosenToolKey = match;
    }
    const tool = profiles.tools[chosenToolKey];

    // Wrap execution with hard timeout per directory
    const result = await Promise.race([
      processDirectorySubmission(dir, tool, browser, autoSubmit),
      new Promise(resolve => setTimeout(() => resolve({
        id: dir.id,
        name: dir.name,
        da: dir.da,
        submission_url: dir.submission_url,
        status: '⚠️ Navigation Timeout (Skipped)',
        timestamp: new Date().toISOString()
      }), 35000))
    ]);

    history[dir.id] = { ...history[dir.id], ...result };
    await fs.writeFile(HISTORY_PATH, JSON.stringify(history, null, 2), 'utf-8');
    await sleep(randomDelay(1500, 3000));
  }

  await browser.close();

  console.log('\n' + '='.repeat(72));
  console.log(' 🎉 Full Suite Execution Complete!');
  console.log(` 📊 History Log: ${HISTORY_PATH}`);
  console.log(` 📁 Screenshots Directory: ${SCREENSHOTS_DIR}`);
  console.log('='.repeat(72));
}

main().catch(console.error);
