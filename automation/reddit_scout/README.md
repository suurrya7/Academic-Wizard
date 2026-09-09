# ⚡ Academic Wizard — Unified Streamlit Keep-Alive & Reddit Commercial Scout Bot

A 100% hands-off autonomous engine running completely free on **GitHub Actions (every 30 mins)** that performs two critical missions in a single workflow run:

1. **Streamlit App 24/7 Keep-Alive:** Pings `https://academic-wizard.streamlit.app/` to prevent the free container from going to sleep, ensuring zero cold-start delay for visitors on your site's AI Humanizer tool.
2. **Commercial & Tool Reddit Auto-Scout:** Monitors active student communities for high-buying-intent commercial queries across all services & tools, posting ultra-humanized peer replies with natural contextual backlinks.

---

## 🎯 Complete Scope: Services & Tools Monitored

### 💼 Commercial Writing Services (High-Buying-Intent):
1. **Nursing & Healthcare Help:** `r/NursingStudents`, `r/studentnurse` $\rightarrow$ `/services/assignment-help/uk/nursing/`
2. **Law Essays & OSCOLA:** `r/LawSchool`, `r/uklaw` $\rightarrow$ `/services/assignment-help/uk/law/`
3. **Dissertation & Thesis Mentoring:** `r/GradSchool`, `r/PhD`, `r/AskAcademia` $\rightarrow$ `/services/dissertation-help/`
4. **Accounting & Finance Homework:** `r/Accounting`, `r/financialcareers` $\rightarrow$ `/services/assignment-help/australia/accounting/`
5. **Computer Science & Coding Help:** `r/csMajors`, `r/learnprogramming` $\rightarrow$ `/services/assignment-help/uk/computer-science/`
6. **Academic Editing & Proofreading:** `r/GradSchool`, `r/writing` $\rightarrow$ `/services/editing-proofreading/`
7. **Bespoke Assignment & Essay Help:** `r/Essay_Writing_Service`, `r/HomeworkHelp`, `r/college`, `r/UniUK` $\rightarrow$ `/services/assignment-help/`

### 🛠️ Interactive Academic Tools:
1. **Linguistic AI Detector:** False positive / Turnitin AI flags $\rightarrow$ `/tools/ai-detector/`
2. **AI Text Humanizer:** Robotic tone / QuillBot alternative $\rightarrow$ `/tools/ai-humanizer/`
3. **Citation Generator:** APA 7th, Harvard, OSCOLA referencing $\rightarrow$ `/tools/citation-generator/`
4. **Grammar Checker:** Academic style & proofreading check $\rightarrow$ `/tools/grammar-checker/`

---

## ⏱️ GitHub Free Tier Minute Optimization

* **GitHub Free Allowance:** 2,000 minutes/month for private repos (unlimited for public).
* **Execution Time:** ~25 seconds per execution.
* **Frequency:** Triggers once every 30 minutes (`*/30 * * * *`).
* **Total Usage:** ~720 minutes/month $\rightarrow$ Leaves **over 1,200 free minutes** remaining every month!

---

## 🔑 Recommended: Setting Up Reddit Session Cookie (Bypasses Developer Approval)

Because Reddit closed instant self-service API creation at `prefs/apps`, the bot now directly uses your browser's **`reddit_session` cookie** to authenticate and post comments:

1. **Log in to Reddit** in your desktop browser (Chrome / Edge / Brave).
2. Press **F12** (or Right Click anywhere $\rightarrow$ **Inspect**).
3. In Developer Tools, select the **Application** tab *(in Firefox: Storage tab)*.
4. In the left panel: Expand **Cookies** $\rightarrow$ Click **`https://www.reddit.com`**.
5. Find the cookie named **`reddit_session`**.
6. Double-click its **Value** and copy the full string.

---

## 🔐 Adding Secrets to GitHub

1. Go to your repository on GitHub (`suurrya7/Academic-Wizard`).
2. Click **Settings** (tab at the top right).
3. In the left sidebar, click **Secrets and variables** $\rightarrow$ **Actions**.
4. Click **New repository secret** and add:

| Secret Name | Value |
| :--- | :--- |
| **`REDDIT_SESSION_COOKIE`** | The value you copied from Developer Tools |

*(Note: `BACKLINK_GEMINI_API_KEY` and `GEMINI_MODEL` are already configured in your repo from your blog automation and will be automatically reused!)*

---

## ⚙️ Optional: Adjusting Daily Limits & Cooldown (Ramp-Up Scaling)

You can customize the pacing directly in GitHub without changing any code! 
Go to **Settings** $\rightarrow$ **Secrets and variables** $\rightarrow$ **Actions** $\rightarrow$ **Variables** (or Secrets) and add:

| Variable / Secret Name | Default Value | Recommended Warm-Up | Scale-Up (After 2-3 Weeks) |
| :--- | :--- | :--- | :--- |
| `MAX_DAILY_COMMENTS` | `3` | `2` (Days 1–7) | `5` or `6` (After gaining 100+ karma) |
| `MIN_COOLDOWN_MINUTES` | `150` (2.5 hrs) | `180` (3 hrs) | `60` to `90` (1–1.5 hrs) |

---

## 🚀 Activation

Once the 4 Reddit secrets are added:
1. Go to the **Actions** tab on your GitHub repository.
2. Select **Unified Reddit Auto-Scout & Backlink Bot**.
3. Click **Run workflow** to perform your first live test!
4. From then on, GitHub Actions will trigger it autonomously every 30 minutes.
