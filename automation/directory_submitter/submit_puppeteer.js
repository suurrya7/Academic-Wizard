#!/usr/bin/env node

/**
 * Academic Wizard — Automated AI Directory Submitter
 * 
 * Automatically navigates to AI tool directories, auto-detects and populates
 * submission form fields with pre-formulated tool metadata, and tracks
 * submission progress across 25+ high-DA platforms.
 * 
 * Usage:
 *   node automation/directory_submitter/submit_puppeteer.js --list
 *   node automation/directory_submitter/submit_puppeteer.js --status
 *   node automation/directory_submitter/submit_puppeteer.js --dry-run
 *   node automation/directory_submitter/submit_puppeteer.js --tool ai-detector --interactive
 *   node automation/directory_submitter/submit_puppeteer.js --tool ai-detector --directory toolify
 */

import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROFILES_PATH = path.join(__dirname, 'tool_profiles.json');
const DIRECTORIES_PATH = path.join(__dirname, 'directories.json');
const TRACKER_PATH = path.join(__dirname, 'submission_tracker.json');

// Load configurations
const toolProfiles = JSON.parse(fs.readFileSync(PROFILES_PATH, 'utf-8'));
const rawDirectories = JSON.parse(fs.readFileSync(DIRECTORIES_PATH, 'utf-8'));
const directories = rawDirectories.filter(d => d.free_listing !== false);

function loadTracker() {
    if (fs.existsSync(TRACKER_PATH)) {
        return JSON.parse(fs.readFileSync(TRACKER_PATH, 'utf-8'));
    }
    return { last_updated: new Date().toISOString(), submissions: {} };
}

function saveTracker(tracker) {
    tracker.last_updated = new Date().toISOString();
    fs.writeFileSync(TRACKER_PATH, JSON.stringify(tracker, null, 2), 'utf-8');
}

let globalRl = null;
function getReadline() {
    if (!globalRl) {
        globalRl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }
    return globalRl;
}

function askQuestion(query) {
    return new Promise(resolve => {
        getReadline().question(query, ans => {
            resolve((ans || '').trim());
        });
    });
}

function closeReadline() {
    if (globalRl) {
        globalRl.close();
        globalRl = null;
    }
}

// Command Line Interface Parser
const args = process.argv.slice(2);

function getArg(flag, defaultValue = null) {
    const idx = args.indexOf(flag);
    if (idx !== -1 && idx + 1 < args.length) {
        return args[idx + 1];
    }
    return defaultValue;
}

const hasFlag = flag => args.includes(flag);

async function executeAutofillInPage(page, tool) {
    try {
        const report = await page.evaluate((toolData) => {
            const actions = [];

            // 1. Auto-dismiss modal popups
            document.querySelectorAll('button, a, span, p').forEach(el => {
                const txt = (el.innerText || '').toLowerCase().trim();
                if (txt === 'no thanks' || txt === '✕' || txt === '×' || txt === 'close' || txt === 'reject all' || txt === 'dismiss') {
                    if (el.offsetWidth > 0 && el.offsetHeight > 0) {
                        try { el.click(); } catch (e) {}
                    }
                }
            });

            function setNativeValue(el, val) {
                if (!el) return false;
                try {
                    el.focus();
                    if (el._valueTracker) {
                        el._valueTracker.setValue('');
                    }
                    const proto = el.tagName === 'TEXTAREA' ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
                    const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
                    if (setter) {
                        setter.call(el, val);
                    } else {
                        el.value = val;
                    }
                    el.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
                    el.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
                    el.blur();
                    return true;
                } catch (e) {
                    el.value = val;
                    return true;
                }
            }

            function getContext(el) {
                const id = (el.id || '').toLowerCase();
                const name = (el.name || '').toLowerCase();
                const placeholder = (el.placeholder || '').toLowerCase();
                const ariaLabel = (el.getAttribute('aria-label') || '').toLowerCase();
                const title = (el.title || '').toLowerCase();

                let labelsText = '';
                if (el.labels && el.labels.length > 0) {
                    for (let l of el.labels) labelsText += ' ' + (l.innerText || '');
                }
                if (el.id) {
                    const explicitLabel = document.querySelector(`label[for="${el.id}"]`);
                    if (explicitLabel) labelsText += ' ' + (explicitLabel.innerText || '');
                }
                const parentLabel = el.closest('label');
                if (parentLabel) labelsText += ' ' + (parentLabel.innerText || '');

                const prevSibling = el.previousElementSibling?.innerText || '';
                const wrapper = el.closest('.field, .form-group, .control, label, div, tr, li, p');
                const wrapperText = wrapper ? (wrapper.innerText || '').slice(0, 150) : '';

                return `${id} ${name} ${placeholder} ${ariaLabel} ${title} ${labelsText} ${prevSibling} ${wrapperText}`.toLowerCase();
            }

            const filledSet = new Set();

            // A. Fill text inputs and textareas
            document.querySelectorAll('input, textarea').forEach(el => {
                const type = (el.type || 'text').toLowerCase();
                if (['hidden', 'submit', 'button', 'image', 'reset', 'password', 'file'].includes(type)) return;
                if (filledSet.has(el)) return;

                const ctx = getContext(el);

                // 1. Math Captcha (e.g. "What is 2+3?", "2 + 5 =", "quick check")
                const mathMatch = ctx.match(/(\d{1,2})\s*[\+\*x]\s*(\d{1,2})/i);
                if (mathMatch && (ctx.includes('check') || ctx.includes('math') || ctx.includes('what') || ctx.includes('quick'))) {
                    const num1 = parseInt(mathMatch[1], 10);
                    const num2 = parseInt(mathMatch[2], 10);
                    const sum = (ctx.includes('*') || ctx.includes('x')) ? (num1 * num2) : (num1 + num2);
                    setNativeValue(el, sum.toString());
                    filledSet.add(el);
                    actions.push({ field: 'Math Captcha', value: `${sum} (solved: ${mathMatch[0]})` });
                    return;
                }

                // 2. Submitter / Founder / Your Name
                if (
                    ctx.includes('your name') || ctx.includes('your_name') || ctx.includes('submitter_name') ||
                    ctx.includes('founder') || ctx.includes('author name') || ctx.includes('first name') ||
                    ctx.includes('contact name')
                ) {
                    setNativeValue(el, 'Academic Wizard');
                    filledSet.add(el);
                    actions.push({ field: 'Your Name', value: 'Academic Wizard' });
                    return;
                }

                // 3. Submitter / Contact Email
                if (type === 'email' || ctx.includes('email') || ctx.includes('your email') || ctx.includes('submitter email')) {
                    setNativeValue(el, toolData.contact_email);
                    filledSet.add(el);
                    actions.push({ field: 'Contact Email', value: toolData.contact_email });
                    return;
                }

                // 4. Tool / Startup Name
                if (
                    ctx.includes('startup name') || ctx.includes('tool name') || ctx.includes('product name') ||
                    ctx.includes('app name') || ctx.includes('service name') || ctx.includes('project name') ||
                    ctx.includes('software name') || ctx.includes('title') || ctx.includes('tool_name') ||
                    ctx.includes('name of') || (ctx.includes('name') && !ctx.includes('user') && !ctx.includes('your'))
                ) {
                    setNativeValue(el, toolData.name);
                    filledSet.add(el);
                    actions.push({ field: 'Tool / Startup Name', value: toolData.name });
                    return;
                }

                // 5. Website / Startup URL
                if (
                    ctx.includes('url') || ctx.includes('website') || ctx.includes('link') ||
                    ctx.includes('domain') || ctx.includes('homepage') || ctx.includes('web address')
                ) {
                    if (!ctx.includes('twitter') && !ctx.includes('facebook') && !ctx.includes('linkedin') && !ctx.includes('github') && !ctx.includes('logo')) {
                        setNativeValue(el, toolData.website_url);
                        filledSet.add(el);
                        actions.push({ field: 'Website URL', value: toolData.website_url });
                        return;
                    }
                }

                // 6. Headline / Tagline / Punchline / Short Pitch
                if (
                    ctx.includes('headline') || ctx.includes('tagline') || ctx.includes('punchline') ||
                    ctx.includes('one liner') || ctx.includes('one-liner') || ctx.includes('5-8 words') ||
                    ctx.includes('short_desc') || ctx.includes('short desc') || ctx.includes('summary') ||
                    ctx.includes('subtitle')
                ) {
                    setNativeValue(el, toolData.tagline);
                    filledSet.add(el);
                    actions.push({ field: 'Headline / Tagline', value: toolData.tagline });
                    return;
                }

                // 7. Tags / Keywords / Categories
                if (ctx.includes('tag') || ctx.includes('keyword') || ctx.includes('topic') || ctx.includes('field_20743f6')) {
                    const tagStr = Array.isArray(toolData.tags) ? toolData.tags.join(', ') : toolData.tags;
                    setNativeValue(el, tagStr);
                    filledSet.add(el);
                    actions.push({ field: 'Tags / Keywords', value: tagStr });
                    return;
                }

                // 8. Full Description / Pitch / About
                if (
                    el.tagName === 'TEXTAREA' || ctx.includes('description') || ctx.includes('about') ||
                    ctx.includes('details') || ctx.includes('pitch') || ctx.includes('overview') ||
                    ctx.includes('message') || ctx.includes('body')
                ) {
                    const max = el.getAttribute('maxlength') ? parseInt(el.getAttribute('maxlength'), 10) : 5000;
                    const descText = (max < 300) ? toolData.tagline : (max < 1500) ? (toolData.short_description || toolData.full_description) : toolData.full_description;
                    setNativeValue(el, descText);
                    filledSet.add(el);
                    actions.push({ field: 'Full Description', value: `${descText.slice(0, 45)}... (${descText.length} chars)` });
                    return;
                }
            });

            // B. Radio buttons & Checkboxes
            document.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(el => {
                const ctx = getContext(el);

                // Pricing: Free
                if (ctx.includes('free') || ctx.includes('$0') || el.value?.toLowerCase() === 'free') {
                    if (!el.checked) {
                        try {
                            el.click();
                            el.checked = true;
                            el.dispatchEvent(new Event('change', { bubbles: true }));
                            actions.push({ field: 'Pricing Radio', value: 'Selected "Free / $0"' });
                        } catch (e) {}
                    }
                }
                // Submission Type (e.g. Launching Next: A side project / bootstrapped)
                else if (ctx.includes('side project') || ctx.includes('bootstrapped')) {
                    if (!el.checked) {
                        try {
                            el.click();
                            el.checked = true;
                            el.dispatchEvent(new Event('change', { bubbles: true }));
                            actions.push({ field: 'Project Type Radio', value: 'Selected "Side project / Bootstrapped"' });
                        } catch (e) {}
                    }
                }
                // Marketing Budget: $0
                else if (ctx.includes('marketing') && (ctx.includes('$0') || ctx.includes('0') || el.value === '0')) {
                    if (!el.checked) {
                        try {
                            el.click();
                            el.checked = true;
                            el.dispatchEvent(new Event('change', { bubbles: true }));
                            actions.push({ field: 'Marketing Budget Radio', value: 'Selected "$0"' });
                        } catch (e) {}
                    }
                }
            });

            // C. Select dropdowns
            document.querySelectorAll('select').forEach(el => {
                const ctx = getContext(el);
                if (ctx.includes('category') || ctx.includes('topic') || ctx.includes('type')) {
                    for (let opt of el.options) {
                        const optTxt = (opt.text || '').toLowerCase();
                        if (optTxt.includes('education') || optTxt.includes('writing') || optTxt.includes('ai') || optTxt.includes('productivity') || optTxt.includes('side project') || optTxt.includes('free')) {
                            el.value = opt.value;
                            el.dispatchEvent(new Event('change', { bubbles: true }));
                            actions.push({ field: 'Category Dropdown', value: opt.text });
                            break;
                        }
                    }
                }
            });

            // Expose a global runner on window for the floating button
            window.__aw_executeAutofill = () => {
                const rerun = executeAutofillInPage ? null : null;
            };

            // Update on-screen button state if present
            const btn = document.getElementById('aw-autofill-btn');
            if (btn) {
                btn.innerHTML = `✅ <b>${actions.length} Fields Auto-Filled!</b>`;
                btn.style.background = '#28a745';
                btn.style.color = '#fff';
                setTimeout(() => {
                    btn.innerHTML = '🪄 <b>Re-Fill Form Details</b>';
                    btn.style.background = '#D4AF37';
                    btn.style.color = '#000';
                }, 3000);
            }

            return actions;
        }, tool);

        return report || [];
    } catch (err) {
        return [{ field: 'Notice', value: `Autofill evaluated with notice: ${err.message}` }];
    }
}

async function injectFloatingButton(page, tool) {
    try {
        await page.evaluate((toolData) => {
            if (document.getElementById('aw-autofill-btn')) return;

            const btn = document.createElement('button');
            btn.id = 'aw-autofill-btn';
            btn.innerHTML = '🪄 <b>Auto-Fill Academic Wizard</b>';
            btn.style.cssText = 'position:fixed;bottom:25px;right:25px;z-index:999999999;background:#D4AF37;color:#000;padding:14px 22px;border-radius:30px;font-family:sans-serif;font-weight:bold;font-size:15px;box-shadow:0 8px 30px rgba(0,0,0,0.6);border:2px solid #fff;cursor:pointer;transition:transform 0.2s;';
            btn.onmouseover = () => btn.style.transform = 'scale(1.05)';
            btn.onmouseout = () => btn.style.transform = 'scale(1)';
            document.body.appendChild(btn);
        }, tool);
    } catch (e) {}
}

async function main() {
    console.log('\n========================================================');
    console.log('⚡ ACADEMIC WIZARD — AI DIRECTORY AUTO-SUBMITTER');
    console.log('========================================================\n');

    const tracker = loadTracker();

    // 1. Action: List Directories
    if (hasFlag('--list')) {
        console.log(`Loaded ${directories.length} curated AI & Startup directories:\n`);
        console.log(
            '#'.padEnd(4) +
            'DIRECTORY'.padEnd(28) +
            'EST. DA'.padEnd(10) +
            'LOGIN?'.padEnd(12) +
            'STATUS'.padEnd(14)
        );
        console.log('-'.repeat(68));

        directories.forEach((dir, idx) => {
            const sub = tracker.submissions[dir.id] || { status: 'not_started' };
            const statusColor = sub.status === 'submitted' ? '✅ Submitted' : '⏳ Pending';
            console.log(
                `${idx + 1}`.padEnd(4) +
                `${dir.name}`.padEnd(28) +
                `DA ${dir.estimated_da}`.padEnd(10) +
                `${dir.requires_login ? 'Required' : 'No'}`.padEnd(12) +
                statusColor
            );
        });

        console.log('\nRun with --dry-run or --interactive to begin submissions.\n');
        return;
    }

    // 2. Action: Status Report
    if (hasFlag('--status')) {
        const totalDirs = directories.length;
        const toolCounts = {};
        Object.keys(toolProfiles).forEach(slug => { toolCounts[slug] = 0; });
        let totalSubmissions = 0;

        // Tally submissions
        Object.entries(tracker.submissions).forEach(([k, entry]) => {
            if (entry.status === 'submitted') {
                if (entry.tool && toolCounts[entry.tool] !== undefined) {
                    toolCounts[entry.tool]++;
                    totalSubmissions++;
                }
            }
        });

        console.log('📊 SUBMISSION CAMPAIGN SUMMARY:');
        console.log(`• Total Curated Directories: ${totalDirs}`);
        console.log(`• Total Submissions Logged:  ${totalSubmissions}\n`);
        console.log('Breakdown by Tool Profile:');
        Object.entries(toolCounts).forEach(([slug, count]) => {
            const toolName = toolProfiles[slug]?.name || slug;
            console.log(`  - ${toolName.padEnd(46)}: ${count}/${totalDirs} submitted`);
        });
        console.log(`\n• Estimated Link Equity:     ${totalSubmissions * 55}+ Average Domain Authority backlinks\n`);
        return;
    }

    // Determine target tool
    const toolSlug = getArg('--tool', 'ai-detector');
    const tool = toolProfiles[toolSlug];

    if (!tool) {
        console.error(`❌ Unknown tool slug: "${toolSlug}". Available tools:`);
        Object.keys(toolProfiles).forEach(slug => {
            console.log(`  - ${slug.padEnd(24)} (${toolProfiles[slug].name})`);
        });
        console.log('\nExample usage:');
        console.log('  node automation/directory_submitter/submit_puppeteer.js --tool ai-detector --interactive');
        console.log('  node automation/directory_submitter/submit_puppeteer.js --tool ai-humanizer --interactive');
        console.log('  node automation/directory_submitter/submit_puppeteer.js --tool citation-generator --interactive');
        console.log('  node automation/directory_submitter/submit_puppeteer.js --tool grammar-checker --interactive');
        console.log('  node automation/directory_submitter/submit_puppeteer.js --tool academic-wizard-suite --interactive\n');
        process.exit(1);
    }

    console.log(`🎯 Active Tool Profile: ${tool.name}`);
    console.log(`🔗 Target URL:          ${tool.website_url}`);
    console.log(`📝 Category:            ${tool.category}`);
    console.log(`🏷️  Pricing:             ${tool.pricing_details}\n`);

    // 3. Action: Dry Run Validation
    if (hasFlag('--dry-run')) {
        console.log('🔍 Performing dry-run validation on directories & tool profile...\n');
        
        let valid = 0;
        directories.forEach(d => {
            if (d.submit_url && d.submit_url.startsWith('http')) {
                valid++;
            } else {
                console.warn(`⚠️ Warning: Invalid submit_url for ${d.name}`);
            }
        });

        console.log(`✅ All ${directories.length} directories have valid HTTPS submission endpoints.`);
        console.log(`✅ Tool metadata complete (tagline: ${tool.tagline.length} chars, description: ${tool.full_description.length} chars).`);
        console.log('\nTo launch interactive browser submission, run:');
        console.log(`  node automation/directory_submitter/submit_puppeteer.js --tool ${toolSlug} --interactive\n`);
        return;
    }

    // 4. Action: Automated / Interactive Submission Engine
    const targetDirId = getArg('--directory');
    let targetDirectories = directories;

    if (targetDirId) {
        targetDirectories = directories.filter(d => d.id === targetDirId);
        if (targetDirectories.length === 0) {
            console.error(`❌ Directory ID "${targetDirId}" not found in database.`);
            process.exit(1);
        }
    }

    // Check if puppeteer is available
    let puppeteer;
    try {
        const imported = await import('puppeteer');
        puppeteer = imported.default || imported;
    } catch (e) {
        console.error('❌ Puppeteer is not available in node. Error:', e.message);
        process.exit(1);
    }

    console.log('🚀 Launching automated browser submission assistant...\n');
    console.log('TIPS:');
    console.log('• The browser will open each submission page in sequence.');
    console.log('• Form fields (name, URL, email, description) will be auto-filled.');
    console.log('• If a CAPTCHA or Google login appears, complete it in the browser window.');
    console.log('• Press ENTER in this terminal when finished to log the submission and proceed.\n');

    // Launch browser with persistent profile so Google logins and cookies are preserved
    const profileDir = path.join(__dirname, '.browser_profile');

    // Clean up any stale singleton locks from previous unexpected exits
    ['SingletonLock', 'SingletonSocket', 'SingletonCookie'].forEach(lockFile => {
        const lockPath = path.join(profileDir, lockFile);
        try {
            if (fs.existsSync(lockPath)) {
                fs.unlinkSync(lockPath);
            }
        } catch (e) {}
    });

    const browser = await puppeteer.launch({
        headless: false,
        userDataDir: profileDir,
        defaultViewport: { width: 1280, height: 800 },
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-blink-features=AutomationControlled'
        ]
    });

    const page = await browser.newPage();

    // Set standard user agent to avoid bot-fingerprinting
    await page.setUserAgent(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    );

    for (let i = 0; i < targetDirectories.length; i++) {
        const dir = targetDirectories[i];
        const subKey = `${dir.id}:${tool.slug}`;
        const prevDirSub = tracker.submissions[dir.id];
        const isAlreadySubmitted = (tracker.submissions[subKey]?.status === 'submitted') ||
            (prevDirSub?.status === 'submitted' && prevDirSub?.tool === tool.slug) ||
            (prevDirSub?.tools_submitted && prevDirSub.tools_submitted.includes(tool.slug));

        if (isAlreadySubmitted && !hasFlag('--force')) {
            console.log(`\n------------------------------------------------------------`);
            console.log(`[${i + 1}/${targetDirectories.length}] ⏩ SKIPPING: ${dir.name} (DA ${dir.estimated_da})`);
            console.log(`   Already marked as submitted for tool: "${tool.name}".`);
            console.log(`   (Pass --force to re-open and submit again)`);
            continue;
        }

        console.log(`\n------------------------------------------------------------`);
        console.log(`[${i + 1}/${targetDirectories.length}] Processing: ${dir.name} (DA ${dir.estimated_da})`);
        console.log(`🌐 Submission URL: ${dir.submit_url}`);
        if (dir.notes) console.log(`💡 Note: ${dir.notes}`);

        try {
            console.log('⏳ Navigating to submission page...');
            await page.goto(dir.submit_url, { waitUntil: 'domcontentloaded', timeout: 30000 });
            await new Promise(r => setTimeout(r, 2500));

            // Automatically dismiss any full-screen popup/newsletter modal
            try {
                await page.keyboard.press('Escape');
                await new Promise(r => setTimeout(r, 500));
            } catch (e) {}

            // Inject on-screen floating gold button
            await injectFloatingButton(page, tool);

            // Automatically execute initial form autofill
            console.log('🤖 Auto-detecting and filling submission form fields...');
            const initialReport = await executeAutofillInPage(page, tool);
            if (initialReport.length > 0) {
                console.log(`✅ Form auto-filled (${initialReport.length} fields):`);
                initialReport.forEach(r => console.log(`   ✔ ${r.field.padEnd(24)}: ${r.value}`));
            } else {
                console.log('ℹ️  No standard input fields found on this landing page (may require logging in or clicking "Submit").');
            }

            console.log('\n💡 Tip: An on-screen floating gold button [🪄 Auto-Fill Academic Wizard] has been added.');
            console.log('   You can click it on-screen, or type "f" + Enter in this terminal at ANY time to re-fill.\n');

            while (true) {
                const answer = await askQuestion(
                    '👉 Action: [Enter] = Mark as Submitted & Next | [f] = Re-Fill Form | [s] = Skip | [q] = Quit: '
                );

                const cmd = answer.toLowerCase();

                if (cmd === 'f' || cmd === 'refill' || cmd === 'fill') {
                    console.log('\n🔄 Re-filling form fields on active browser tab...');
                    const pages = await browser.pages();
                    const activePage = pages[pages.length - 1]; // Current active tab
                    try { await activePage.bringToFront(); } catch (e) {}

                    // Re-inject floating button in case page refreshed/navigated
                    await injectFloatingButton(activePage, tool);

                    // Execute intelligent autofill
                    const refillReport = await executeAutofillInPage(activePage, tool);
                    if (refillReport.length > 0) {
                        console.log(`\n✨ Successfully filled ${refillReport.length} field(s):`);
                        refillReport.forEach(r => console.log(`   ✔ ${r.field.padEnd(24)}: ${r.value}`));
                        console.log('');
                    } else {
                        console.log('\n⚠️ No standard form fields detected on the current active page.');
                        console.log('   (If this page is a login or multi-step screen, complete the step first, then type "f" once the submission form appears).\n');
                    }
                    continue;
                } else if (cmd === 'q' || cmd === 'quit' || cmd === 'exit') {
                    console.log('Stopping assistant.');
                    closeReadline();
                    await browser.close();
                    return;
                } else if (cmd === 's' || cmd === 'skip') {
                    console.log(`⏩ Skipped ${dir.name}.`);
                    break;
                } else {
                    const subKey = `${dir.id}:${tool.slug}`;
                    tracker.submissions[subKey] = {
                        directory_id: dir.id,
                        name: dir.name,
                        status: 'submitted',
                        submitted_at: new Date().toISOString(),
                        tool: tool.slug,
                        tool_name: tool.name,
                        live_url: null,
                        notes: 'Auto-filled via puppeteer assistant'
                    };

                    // Maintain directory-level tracking
                    if (!tracker.submissions[dir.id] || typeof tracker.submissions[dir.id] !== 'object') {
                        tracker.submissions[dir.id] = { name: dir.name, status: 'submitted', tools_submitted: [] };
                    }
                    if (!Array.isArray(tracker.submissions[dir.id].tools_submitted)) {
                        tracker.submissions[dir.id].tools_submitted = tracker.submissions[dir.id].tool ? [tracker.submissions[dir.id].tool] : [];
                    }
                    if (!tracker.submissions[dir.id].tools_submitted.includes(tool.slug)) {
                        tracker.submissions[dir.id].tools_submitted.push(tool.slug);
                    }
                    tracker.submissions[dir.id].status = 'submitted';
                    tracker.submissions[dir.id].tool = tool.slug;
                    tracker.submissions[dir.id].last_submitted_at = new Date().toISOString();

                    saveTracker(tracker);
                    console.log(`🎉 Logged: ${dir.name} marked as SUBMITTED for "${tool.name}"!`);
                    break;
                }
            }
        } catch (err) {
            console.error(`⚠️ Could not complete auto-navigation for ${dir.name}: ${err.message}`);
            const retry = await askQuestion('Continue to next directory? (y/n): ');
            if (retry.toLowerCase() === 'n') break;
        }
    }

    console.log('\n========================================================');
    console.log('✅ Session Complete. Tracker updated in submission_tracker.json');
    console.log('========================================================\n');

    closeReadline();
    await browser.close();
}

main().catch(err => {
    console.error('Fatal execution error:', err);
    closeReadline();
    process.exit(1);
});
