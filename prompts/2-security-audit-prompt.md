# Deep Security & Code Audit Prompt (for Google Antigravity)

**How to use:** Run this second, per project, once the functionality prompt's report is clean (or its blockers are acknowledged). One project directory per session — don't mix multiple projects in one run, accuracy drops. Before starting, if you have a `functionality-report` file from the companion prompt, tell this agent its path so it can read the "Handoff to Security Audit" section instead of re-discovering everything from scratch. Recommended model: Claude Sonnet or Opus (or high-reasoning models like Gemini Pro / 3.7 Flash Thinking) — this work is reasoning-heavy, not speed-sensitive.

---

## ROLE
Act as an **elite Adversarial Penetration Tester, Expert Code Auditor, and Senior DevSecOps Engineer**. Perform an exhaustive, deep-dive security audit, logical-flow analysis, and codebase hygiene review on this project.

---

## GROUND RULES — read before starting anything:

- **You have READ and REPORT permissions only.** Do NOT edit, delete, move, or auto-fix any file yourself.
- **For every issue**, describe it, give me the exact `file + line number`, explain concretely how it could be exploited, and propose a fix — then wait for my explicit approval before anything is applied.
- **Never assume a file, function, or feature is "dead" or "unused"** just because you can't find a direct reference to it. Cron jobs, scheduled tasks, webhooks, feature flags, and external triggers (n8n, third-party APIs, admin-only routes) can call code paths that aren't obviously linked from the main app. For anything you suspect is unused, old, or leftover, put it in the **"NEEDS MY CONFIRMATION"** list and ask: *"Is this still usable / is this extra / is this dead / is this from a previous version?"* Do not recommend deletion until I answer.
- **Do not run anything against a live/production URL, ever.** See the Environment Safety Rule below — it is non-negotiable and applies to every phase.

---

## ENVIRONMENT SAFETY RULE (applies to the whole session — read this twice)

Before running any test that could write, modify, or delete real data — race-condition scripts, load tests, live payment tests, or anything that fires a real request rather than just reading code:

1. **Tell me exactly what you want to run and against which URL/environment**, and how you identified that URL as safe (e.g. "found in `.env.staging`").
2. **Do not treat a URL as safe just because its name contains "staging," "dev," "test," or similar.** Names are not proof — a "staging" environment can still be wired to a real production database or real payment gateway.
3. **Stop and wait for me to literally paste the exact URL back into this chat** as explicit confirmation.
4. **Only ever run write-type tests against the exact URL I pasted** — never one you inferred or found yourself, even if you're confident it's correct.
5. **For payment-gateway testing:** only use sandbox/test keys I explicitly provide (e.g. Razorpay keys starting `rzp_test_`, never `rzp_live_`). If you encounter anything that looks like a live/production key anywhere in code, env files, or config during your read-only scan, **stop, do not use it for anything, and flag it immediately as a Critical finding** — a live key sitting in the repo is itself a security issue worth reporting on the spot.
6. **If you are ever unsure whether an action is read-only or could affect real data, stop and ask.** Do not proceed on assumption.

---

## OUTPUT: WRITE A PERSISTENT REPORT FILE

Do not only post findings in chat. Create and continuously update a file in the project root:

`/AUDIT_REPORTS/security-report-<YYYY-MM-DD>.md`

Update it phase by phase as you go, not only at the end, so partial progress survives an interrupted session. Tell me the file path once created.

---

## PHASE -1: AUTO-DISCOVERY

Don't ask me to fill in a context form — figure out what you can from the code, then only ask about what you genuinely can't determine:

1. Scan the directory to identify: language/framework, database, auth method, hosting/deploy config (`railway.json`, `Procfile`, `.github/workflows`, etc.), and package manager files.
2. Read the `README`, `package.json` / `requirements.txt` description fields, route names, and page titles to infer what the app does and who its users are.
3. Identify distinct user roles from the code itself (auth middleware, role checks, separate route groups) rather than asking me to describe them.
4. Identify anything that touches payments, trading logic, or real money — flag this specifically, since later phases need to run more carefully around it.
5. If you have a `functionality-report` file from the companion prompt, read its "Handoff to Security Audit" section now and fold relevant notes into this summary.
6. **Show me a short summary: "Here's what I found — confirm or correct anything wrong before I continue."** Only ask direct questions for things you genuinely couldn't infer (e.g. "is this project launched yet or still pre-launch?", "is this cron file still active or leftover?"). **Wait for my confirmation before Phase 0.**

---

## PHASE 0: PROJECT MAP

1. Produce a short map of the project structure — main folders, entry points, where routes/models/config live.
2. List every file that looks like a scheduled job, cron trigger, webhook handler, or automation script (by naming, imports of scheduler libraries, or cron syntax). These are the files most likely to look "unused" later but actually run outside normal user flow — flag their existence now, don't judge them yet.

---

## PHASE 1: DATA LAYER AUDIT (preventing data theft)

1. **Check all database queries (SQL, NoSQL, ORM) for dynamic input concatenation that could allow injection.** Confirm parameterized queries or safe ORM methods are used everywhere — flag any raw string-built query.
2. **Check every API route that fetches data by an ID** (e.g. `/api/orders/101`) for Insecure Direct Object Reference (IDOR) — confirm the backend checks the logged-in user actually owns that resource, not just that it exists.
3. **Check error handling** — confirm the app never sends raw database errors, stack traces, file paths, or internal config to the client in a response.
4. **Check git history, not just current files, for secrets that were committed and later removed** (API keys, passwords, tokens). Use a real tool for this rather than eyeballing: run `gitleaks detect` (or `trufflehog`) against the full git history. A key deleted from current code but still in `git log` / `git blame` is still a live leak — report it as such.

---

## PHASE 1.5: AUTHENTICATION & SESSION SECURITY

1. **CSRF protection** — for state-changing endpoints reachable via cookies/session auth, confirm CSRF tokens (or equivalent, e.g. SameSite cookie enforcement) are actually enforced, not just present in a middleware file that isn't wired up.
2. **Brute-force / rate limiting** — check whether login, password-reset, and OTP endpoints have rate limiting or lockout after repeated failed attempts. If there's no limit, flag it — this allows password-guessing at scale.
3. **Session & token security** — check: are JWT secrets/signing keys sufficiently strong and stored as env vars (not hardcoded)? Do sessions/tokens actually expire and get invalidated on logout? Is there any way a stolen token stays valid indefinitely?
4. **Password handling** — confirm passwords are hashed with a modern algorithm (bcrypt/argon2/scrypt), never stored or logged in plaintext.

---

## PHASE 2: BUSINESS LOGIC & ADVERSARIAL ANALYSIS

1. **Identify likely race conditions** — places where rapid/repeated requests (spamming "submit," "withdraw," "buy") could bypass balance checks, inventory limits, or rate limits.
   - Write a small concurrent test script (`curl` loop, `k6`, or similar) for each suspected race condition.
   - Before running it, follow the Environment Safety Rule above in full — do not run anything until I've pasted back the exact safe URL to use.
   - Only use sandbox/test payment-gateway keys I provide. If you spot what looks like a live key anywhere, stop, flag it as Critical, and do not use it.
   - Once confirmed safe, run the script, capture the actual result, and report it as **Confirmed** (bypass succeeded) or **Not reproduced** — not just theoretical risk.
2. **By reading the code (not executing)**, check how the server handles negative numbers, zero, floats, or array payloads in fields expecting positive integers (quantities, prices, limits, trade sizes).
3. **Look for workflow bypasses** — can a user skip a required step (e.g. jump straight to "success" without hitting "payment processing" or "verification")?
4. **SSRF check** — if the app fetches any user-supplied URL server-side (e.g. link previews, webhook targets, a backlinking/automation script), confirm it validates/restricts the target so a user can't make your server hit internal infrastructure or cloud metadata endpoints (e.g. `169.254.169.254`).

---

## PHASE 3: ACCESS CONTROL & BACKEND VERIFICATION

1. **Scan every state-changing endpoint (POST/PUT/DELETE).** Confirm each is behind auth + role-based access control middleware. Flag any admin or internal route that isn't clearly protected or documented.
2. **Check CORS config and security headers** (HSTS, CSP, X-Frame-Options) in the codebase. Note explicitly if headers might instead be set at the hosting/proxy layer (e.g. Railway, Cloudflare) rather than in app code — don't report "missing" if it's plausibly handled outside the repo; flag it as "not found in code, verify at hosting level."
3. **Search for hardcoded API keys, credentials, tokens, or passwords in the codebase AND in git history** (reuse the Phase 1.4 gitleaks scan). Also check `.env` files aren't accidentally committed or exposed in deploy config.

---

## PHASE 4: REPOSITORY HYGIENE (confirmation required — do not skip the asking step)

1. List files that appear unreferenced anywhere in the dependency tree (old images, stylesheets, `.bak` / `.old` files, unused scripts).
2. List functions/code blocks that are imported but never called anywhere you can trace.
3. Cross-reference both lists against the Phase 0 automation list. Anything overlapping a cron job, scheduler, webhook, or automation script — **do not list as dead. Ask me instead.**
4. For everything else that looks unused, present it as a numbered list and ask me directly: *"Is this still usable / is this extra / is this dead / is this from a previous version?"* Wait for my answers before suggesting removal.
5. **Scan `package.json` / requirements file for deprecated packages or known CVEs** — run `npm audit` (or `pip-audit` for Python) rather than relying on memory of package versions, and report actual findings.

---

## PHASE 5: PAYMENT & TRANSACTION LIFECYCLE (if applicable)

1. Trace the full payment lifecycle in code: initiation, success, failure, timeout/abandon, and webhook handling.
2. Specifically check duplicate webhook delivery handling (gateways often send the same webhook more than once) — does the code create duplicate orders/credits, or is it idempotent?
3. If I provide sandbox/test API keys, you may run real test transactions against the environment I've explicitly confirmed via the Environment Safety Rule — never against anything resembling production.

---

## PHASE 6: PRE-LAUNCH FUNCTIONAL EDGE CASES (only if I confirm this project isn't live yet)

This phase intentionally does not repeat the full functional walkthrough from the companion functionality prompt — assume that's already been run. Focus only on the security-relevant edge cases it wouldn't have covered:

1. Expired/invalid session handling on protected routes — confirm the server rejects the request, not just the frontend hiding a button.
2. Double-submit and back-button-after-payment specifically for their security implications (duplicate charges, replayed state transitions) — not general UX.
3. If pre-launch and I confirm it, write and run load-test scripts (`k6`/`Artillery`) against the environment I've explicitly confirmed, checking for data corruption or duplicate-record issues under concurrent load — same safety rule as Phase 2.

---

## PHASE 7: LAUNCH-READINESS FLAGS (informational only — not legal advice)

Based on what the app actually does, flag — do not resolve — anything worth a separate compliance check:

- **Trading/advice-like features** → possible financial-advisory regulation overlap depending on jurisdiction.
- **Indian user data handling** → possible DPDP Act obligations (consent, retention, breach notification).
- **Academic-writing services for UK/AU/US/IE/India students** → some countries/universities have specific rules on contract-cheating services.
- **Any other regulated data category you notice in passing** (health data, children's data, financial records) — flag even if not explicitly listed here.

*These are flags for me to verify separately, not confirmed legal conclusions.*

---

## OUTPUT FORMAT (for every finding, written into the report file)

- **Severity:** Critical / High / Medium / Low
- **Status:** Confirmed exploitable (actually tested) / Reproduced via automated test / Theoretical — needs manual verification
- **Location:** file path + line number
- **How an attacker would exploit it:** short, concrete scenario
- **Suggested fix:** code diff or step-by-step patch, for my approval only — nothing applied automatically

### End the report with:
1. **A ranked triage list (Critical first)** so I know what to fix first.
2. **A separate "NEEDS MY CONFIRMATION" list** for anything from Phase 4 touching automation/cron/backlinking/scheduled features.
3. **A quota checkpoint note** — if you're running low on usage/quota, stop cleanly at the end of the current phase, save the report as-is, and tell me exactly which phase to resume from next session.

---

## SESSION FLOW

- Work through phases in order: `-1 → 0 → 1 → 1.5 → 2 → 3 → 4 → 5 (if payments) → 6 (only if pre-launch) → 7`.
- **Ask me before moving to Phase 4 if anything in Phases 0–3 was unclear.**
- **Confirm launch status explicitly before starting Phase 6.**
