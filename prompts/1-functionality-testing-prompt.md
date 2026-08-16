# Functional QA & Production-Readiness Prompt (for Google Antigravity)

**How to use:** Run this FIRST, per project, one directory at a time. Its only job is to confirm the app's features actually work end-to-end and nothing is stubbed, broken, or incomplete. It does NOT cover payments, load testing, or legal flags in depth — those live in the security audit prompt, which you run second. Recommended model: use Claude Sonnet or Opus (or high-reasoning models like Gemini Pro / 3.7 Flash Thinking) — reasoning-heavy tracing benefits from it more than a fast/lightweight model.

---

## ROLE
Act as a **Senior QA Engineer** preparing this application for its first production launch. Your only job in this prompt is functional correctness: find every feature that is broken, incomplete, stubbed, or unverified before real users touch it.

---

## GROUND RULES — read before starting anything:

- **READ and REPORT only.** Do not edit, delete, comment out, or "fix" anything yourself unless I explicitly approve that specific change in this chat.
- **Never write "this probably works."** For every item, either:
  1. trace it fully in the code and state your confidence, or
  2. mark it `"Needs manual click-through to verify"` — never guess silently.
- **If something looks unused, disabled, or leftover** (old test files, disabled feature flags, WIP code, commented-out blocks), do not assume it's dead. Add it to a running **"NEEDS MY CONFIRMATION"** list and ask me: *"Is this still usable / is this extra / is this dead / is this from a previous version?"* Never suggest deleting it.
- **Do not run anything against a live/production URL.** See the Environment Safety Rule below — it applies to every phase.

---

## ENVIRONMENT SAFETY RULE (applies to the whole session)

Before running any test that writes data, submits a form, hits an API with a real request, or touches a database — not just load tests — stop and do the following:

1. **Tell me exactly which URL/environment you intend to run it against**, and how you determined it (e.g. "found in `.env.staging`", "inferred from folder name").
2. **Do not infer or assume a URL is safe** just because it's named "staging," "dev," "test," or similar — names can be misleading (a "staging" URL can still point at a real production database).
3. **Wait for me to literally paste the exact URL back to you in this chat**, confirmed as safe to test against.
4. **Only ever run write/submit-type tests against the exact URL I pasted** — never a URL you inferred, guessed, or found in config files on your own, even if it looks obviously correct.
5. **If at any point you're not 100% certain an action is read-only** (i.e., it might create, modify, or delete real data), stop and ask before running it.

*This rule overrides convenience at every phase below. When in doubt, don't run it — ask.*

---

## OUTPUT: WRITE A PERSISTENT REPORT FILE

Do not just post findings in chat. Create and continuously update a file in the project root:

`/AUDIT_REPORTS/functionality-report-<YYYY-MM-DD>.md`

Structure it with one section per phase (matching the phase headers below), and update it as you go rather than only at the very end — so if the session gets interrupted, partial progress isn't lost. Tell me the file path once created.

---

## PHASE -1: AUTO-DISCOVERY

Figure this out yourself from the code first — don't make me fill out a form:

1. Identify tech stack, database, auth method, and hosting/deploy setup.
2. Identify what the app does, who its distinct user roles are, and whether it involves payments, trading, or other money-adjacent logic (flag this — it matters for the security prompt later, not this one).
3. Confirm with me whether this project is genuinely pre-launch (no real users/data yet) — this affects what's safe to actively test later.
4. **Show me a short summary and wait for my confirmation before continuing to Phase 1.**

---

## PHASE 1: COMPLETE FEATURE INVENTORY & FUNCTIONAL CHECK

1. Build a full checklist of every feature/page/module/API route in the app — not just the obvious ones. Pull from route definitions, nav menus, and folder structure so nothing is missed.
2. For each item, trace the code and mark one of: **Working / Broken / Incomplete (stub, TODO, commented-out) / Needs manual click-through to confirm**.
3. For each distinct user role, walk their entire journey end-to-end (`signup` → `every action available to them` → `logout`) and flag any broken or incomplete step.
4. Confirm every automated feature (cron jobs, scheduled tasks, background workers, any auto-posting/auto-generation scripts) has complete, working logic — not just that the file exists and is imported somewhere.
5. For anything you cannot verify just by reading (JS-dependent UI states, animations, responsive behavior, actual button clicks), mark it **"Needs manual click-through"** rather than guessing it works.

---

## PHASE 2: INPUT & EDGE-CASE HANDLING (read-only code trace — no live submission yet)

By reading the code (not submitting real requests unless the Environment Safety Rule above has been satisfied), check how each form, API input, and file upload handles:

- Empty submissions, missing required fields
- Extremely long text / oversized payloads
- Wrong data types (text in number fields, negative numbers, decimals where integers are expected)
- Special characters, emoji, non-English scripts
- Wrong file types / oversized file uploads
- Expired or invalid sessions
- Double-submit (rapid double-click) and browser back-button after an action completes

If you want to actually fire any of these as live test submissions rather than just trace the code, that requires satisfying the Environment Safety Rule first — stop and ask before doing so.

---

## PHASE 3: CROSS-ENVIRONMENT & COMPATIBILITY CHECK

1. From the code, identify anything that might behave differently across browsers/devices (browser-specific JS, unresponsive CSS breakpoints, mobile-unfriendly layouts).
2. Check that environment variables and config are cleanly separated between local/staging/production — flag anything hardcoded (API URLs, keys, feature flags) that should be an env var instead.
3. Confirm the app degrades gracefully if a third-party service (email provider, external API, CDN) is slow or down — does the code show a real user-facing error, or would it hang/crash silently? Trace this in the code; don't simulate an outage unless I've approved it.

---

## PHASE 4: OBSERVABILITY & ROLLBACK READINESS

1. Check whether error logging/tracking is set up (e.g. Sentry or similar) — flag clearly if errors currently just vanish silently in production with no record.
2. Check whether there's a health-check endpoint or any uptime-monitoring hook.
3. Check the deploy setup (CI/CD config, Railway/Vercel/etc. config) for whether rolling back to the previous working version is fast and simple, or would require manual intervention.
4. Flag if there's no visible backup strategy for the database.

---

## OUTPUT FORMAT (for every item across all phases, written into the report file)

- **Status:** Working / Broken / Incomplete / Needs manual verification
- **Severity if broken:** Blocker (must fix before launch) / Important / Minor / Cosmetic
- **Location:** file path / route
- **What happens when it fails:** concrete, specific description — not "it might not work"
- **Suggested fix:** for my approval only — nothing applied automatically

### End the report with:
1. **A "Blockers" list** — things that must be fixed before you'd consider this launch-ready.
2. **A "Needs My Confirmation" list** — every possibly-dead or possibly-unfinished item you flagged, collected in one place so I can answer them in a batch.
3. **A "Handoff to Security Audit" note** — a short list of anything you noticed in passing (auth quirks, payment code, exposed config) that the security prompt should specifically look at, so I don't have to repeat context when I run that prompt next.

---

## SESSION FLOW

- Work through phases in order: `-1 → 1 → 2 → 3 → 4`.
- **Stop and wait for my confirmation after Phase -1 before continuing.**
- If you hit your usage quota mid-session, stop cleanly at the end of the current phase, save the report file as-is, and tell me exactly which phase to resume from next session — don't leave the report half-written mid-phase.
