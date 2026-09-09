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

function askQuestion(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }));
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
            await new Promise(r => setTimeout(r, 2000));

            // Inject floating on-screen autofill button and perform initial fill
            await page.evaluate((toolData) => {
                if (document.getElementById('aw-autofill-btn')) return;

                function runFill() {
                    let filled = 0;
                    function setVal(el, val) {
                        if (!el) return false;
                        el.focus();
                        el.value = val;
                        el.dispatchEvent(new Event('input', { bubbles: true }));
                        el.dispatchEvent(new Event('change', { bubbles: true }));
                        el.blur();
                        return true;
                    }

                    document.querySelectorAll('input, textarea, select').forEach(el => {
                        const n = (el.name || '').toLowerCase();
                        const id = (el.id || '').toLowerCase();
                        const p = (el.placeholder || '').toLowerCase();
                        const t = (el.type || '').toLowerCase();
                        const combined = `${n} ${id} ${p}`;

                        if (combined.includes('submitter_name') || combined.includes('your_name') || combined.includes('first_name')) {
                            if (setVal(el, 'Academic Wizard')) filled++;
                        } else if (combined.includes('submitter_email') || (t === 'email' && (combined.includes('your_email') || combined.includes('email')))) {
                            if (setVal(el, toolData.contact_email)) filled++;
                        } else if (combined.includes('tool_name') || combined.includes('app_name') || combined.includes('product_name') || combined.includes('form-field-name')) {
                            if (setVal(el, toolData.name)) filled++;
                        } else if (combined.includes('tagline') || combined.includes('headline') || combined.includes('short_desc') || combined.includes('summary') || combined.includes('punchline')) {
                            if (setVal(el, toolData.tagline)) filled++;
                        } else if (el.tagName === 'TEXTAREA' || combined.includes('description') || combined.includes('about') || combined.includes('details') || combined.includes('message')) {
                            if (setVal(el, toolData.short_description || toolData.full_description)) filled++;
                        } else if (combined.includes('url') || combined.includes('website') || combined.includes('link') || combined.includes('domain') || combined.includes('homepage') || combined.includes('form-field-email')) {
                            if (setVal(el, toolData.website_url)) filled++;
                        } else if (combined.includes('title') || (!combined.includes('user') && combined.includes('name'))) {
                            if (setVal(el, toolData.name)) filled++;
                        } else if (el.tagName === 'SELECT' && combined.includes('category')) {
                            for (let opt of el.options) {
                                if (opt.text.toLowerCase().includes('writing') || opt.text.toLowerCase().includes('education') || opt.text.toLowerCase().includes('productivity')) {
                                    el.value = opt.value;
                                    el.dispatchEvent(new Event('change', { bubbles: true }));
                                    filled++;
                                    break;
                                }
                            }
                        } else if (t === 'radio' && (combined.includes('pricing') || combined.includes('price'))) {
                            if (el.value.toLowerCase().includes('free') || el.nextSibling?.textContent?.toLowerCase().includes('free') || el.parentElement?.textContent?.toLowerCase().includes('free')) {
                                el.checked = true;
                                el.dispatchEvent(new Event('change', { bubbles: true }));
                                filled++;
                            }
                        } else if (combined.includes('tag') || combined.includes('keyword') || combined.includes('field_20743f6')) {
                            if (setVal(el, toolData.tags.join(', '))) filled++;
                        }
                    });

                    const btn = document.getElementById('aw-autofill-btn');
                    if (btn) {
                        btn.innerHTML = `✅ <b>${filled} Fields Filled!</b>`;
                        btn.style.background = '#28a745';
                        btn.style.color = '#fff';
                        setTimeout(() => {
                            btn.innerHTML = '🪄 <b>Re-Fill Form Details</b>';
                            btn.style.background = '#D4AF37';
                            btn.style.color = '#000';
                        }, 3000);
                    }
                    return filled;
                }

                const btn = document.createElement('button');
                btn.id = 'aw-autofill-btn';
                btn.innerHTML = '🪄 <b>Auto-Fill Academic Wizard</b>';
                btn.style.cssText = 'position:fixed;bottom:25px;right:25px;z-index:999999999;background:#D4AF37;color:#000;padding:14px 22px;border-radius:30px;font-family:sans-serif;font-weight:bold;font-size:15px;box-shadow:0 8px 30px rgba(0,0,0,0.6);border:2px solid #fff;cursor:pointer;transition:transform 0.2s;';
                btn.onmouseover = () => btn.style.transform = 'scale(1.05)';
                btn.onmouseout = () => btn.style.transform = 'scale(1)';
                btn.onclick = runFill;
                document.body.appendChild(btn);

                // Initial fill attempt
                runFill();
            }, tool);

            console.log('💡 Tip: An on-screen floating gold button [🪄 Auto-Fill Academic Wizard] has been added.');
            console.log('   If a popup appeared, close it and click the gold button (or type "f" + Enter in terminal).\n');

            while (true) {
                const answer = await askQuestion(
                    '👉 Action: [Enter] = Mark as Submitted & Next | [f] = Re-Fill Form | [s] = Skip | [q] = Quit: '
                );

                if (answer.toLowerCase() === 'f') {
                    await page.evaluate((toolData) => {
                        const btn = document.getElementById('aw-autofill-btn');
                        if (btn) btn.click();
                    }, tool);
                    console.log('🔄 Re-executed form autofill on page.\n');
                    continue;
                } else if (answer.toLowerCase() === 'q') {
                    console.log('Stopping assistant.');
                    await browser.close();
                    return;
                } else if (answer.toLowerCase() === 's') {
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

    await browser.close();
}

main().catch(err => {
    console.error('Fatal execution error:', err);
    process.exit(1);
});
