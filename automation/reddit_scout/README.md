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

## 🔑 Step-by-Step: How to Get Your Free Reddit OAuth Credentials

Reddit allows anyone to create a **Script Application** for 100% free:

1. **Open Reddit App Preferences:**
   * Go to: [https://www.reddit.com/prefs/apps](https://www.reddit.com/prefs/apps)
   * (Log in with the Reddit account you want the bot to post from).

2. **Create the Script App:**
   * Scroll to the very bottom and click the button: **`are you a developer? create an app...`** (or `create another app...`).
   * Fill in the fields:
     * **name:** `academic-wizard-bot`
     * **App Type (CRUCIAL):** Select the radio button labeled **`script`** *(DO NOT select web app or installed app)*.
     * **description:** (optional, leave blank)
     * **about url:** (optional, leave blank)
     * **redirect uri:** `http://localhost:8080` (required by Reddit form, but not used by script bots).
   * Click **`create app`**.

3. **Copy Your Credentials:**
   * **`REDDIT_CLIENT_ID`**: The string of ~14 characters displayed directly beneath your app name (e.g. `k8sD9x_AbC1234`).
   * **`REDDIT_CLIENT_SECRET`**: The string next to the label **`secret`** (e.g. `w0E98fsd_as98df7as89d7f`).
   * **`REDDIT_USERNAME`**: Your Reddit username (without `/u/`).
   * **`REDDIT_PASSWORD`**: Your Reddit account password.

---

## 🤖 Step-by-Step: How to Get Your Free Google Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/).
2. Sign in with your Google account.
3. Click **Get API key** $\rightarrow$ **Create API key in new project**.
4. Copy the key $\rightarrow$ This is your `GEMINI_API_KEY` (Free up to 15 requests/minute).

---

## 🔐 Adding Secrets to GitHub

1. Go to your repository on GitHub.
2. Click **Settings** (tab at the top right).
3. In the left sidebar, click **Secrets and variables** $\rightarrow$ **Actions**.
4. Click **New repository secret** and add each of the 5 secrets:
   * `REDDIT_CLIENT_ID`
   * `REDDIT_CLIENT_SECRET`
   * `REDDIT_USERNAME`
   * `REDDIT_PASSWORD`
   * `GEMINI_API_KEY`

---

## 🚀 Activation

Once the secrets are added:
1. Go to the **Actions** tab on your GitHub repository.
2. Select **Unified Reddit Auto-Scout & Backlink Bot**.
3. Click **Run workflow** to perform your first live run!
4. From then on, GitHub Actions will trigger it autonomously every 30 minutes.
