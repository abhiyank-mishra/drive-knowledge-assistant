# DriveMind AI - Gemini Enterprise Drive Knowledge & Hourly Agent Hub ⚡

> **Autonomous AI Command Center** combining Google Drive notes summarization, exam preparation flashcards, interactive multi-document Q&A, and an hourly live tech news briefing agent.

Built with **Next.js 14**, **Tailwind CSS**, and **Google Gemini Enterprise (Gemini 1.5 Flash / Pro)**. Designed for zero-config 1-click **Vercel** deployment and **GitHub** hosting.

---

## 🌟 Key Features

1. **Autonomous Hourly News Agent (`GET /api/news`)**:
   - Fetches and synthesizes real-time tech breakthroughs, AI releases, open-source trends, and campus placement insights every hour.
   - Live countdown ticker (*"Next sync in 48m"*).
   - Listen to news aloud with browser Text-to-Speech (Audio Briefing).
   - Category filtering (AI & ML, Tech & Dev, Open Source, Cybersecurity, Campus).

2. **Google Drive Knowledge Assistant**:
   - Import any college lecture notes, PDFs, or Drive links.
   - **Executive Summary**: High-yield takeaways generated in seconds.
   - **Key Concepts**: Deep dive definitions and architectural explanations.
   - **Formula Sheet**: Crucial equations, invariants, and complexity metrics.
   - **Exam Prep**: Predicted 10-mark and 15-mark university questions.
   - **हिन्दी Audio Recap**: 3-sentence Hindi summary with one-click speech audio playback!
   - **Interactive Flashcards**: 3D flip study cards for rapid revision.

3. **Gemini Enterprise Agent Copilot**:
   - Context-aware conversational agent grounded in the currently active Drive document.
   - Answers questions in English, Hindi, or conversational Hinglish.

---

## 🛠️ Vertex AI Agent Builder Setup (From your Screenshot)

In your Google Cloud Console / Gemini Enterprise:

### 1. Connecting Google Drive:
1. In Vertex AI Agent Builder, go to **Data Stores** in the left sidebar.
2. Click **+ New Data Store** and choose **Google Drive**.
3. Select your Google Drive folders containing your college notes/PDFs.
4. When creating a **Chat agent**, select this Data Store under **Knowledge / Grounding**.
5. Your agent now automatically knows everything in your Google Drive!

### 2. Chat Agent vs Workflow:
* **Chat Agent**: Use this for interactive Q&A where you want to ask questions about your Drive documents.
* **Workflow**: Use this for the automated pipeline (e.g. periodically fetching news, processing it with Gemini, and outputting structured JSON).

---

## 🚀 Quickstart (Local Development)

```bash
# 1. Clone repository & enter directory
git clone <your-repo-url>
cd drive-knowledge-assistant

# 2. Install dependencies
npm install

# 3. Create .env.local file
cp .env.example .env.local
# Add your GEMINI_API_KEY from https://aistudio.google.com/

# 4. Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser!

---

## 📦 How to Push to GitHub & Deploy to Vercel

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit: DriveMind AI Assistant"
git branch -M main

# Create a new repository on github.com, then link it:
git remote add origin https://github.com/YOUR_USERNAME/drive-knowledge-assistant.git
git push -u origin main
```

### Step 2: Deploy to Vercel (Free 1-Click)
1. Go to [vercel.com](https://vercel.com) and log in with GitHub.
2. Click **Add New Project** -> **Import** your `drive-knowledge-assistant` repository.
3. In the **Environment Variables** section, add:
   * **Key**: `GEMINI_API_KEY`
   * **Value**: *Your Gemini API Key*
4. Click **Deploy**!
5. In ~45 seconds, your app will be live at `https://your-project.vercel.app` with free HTTPS!

---

## 📁 Project Structure

```
drive-knowledge-assistant/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── news/route.ts        # GET /api/news (Hourly AI news feed)
│   │   │   ├── gemini/
│   │   │   │   ├── chat/route.ts    # POST /api/gemini/chat (Agent Copilot)
│   │   │   │   └── summarize/route.ts # POST /api/gemini/summarize (Multi-tier notes summary)
│   │   │   └── drive/
│   │   │       └── parse/route.ts   # POST /api/drive/parse (Drive URL parser)
│   │   ├── globals.css              # Dark cyber aesthetic & glassmorphism
│   │   ├── layout.tsx               # Root layout & metadata
│   │   └── page.tsx                 # Main dashboard UI
│   ├── components/
│   │   ├── Navbar.tsx               # Header with live countdown & clock
│   │   ├── HourlyNewsFeed.tsx       # Live news ticker & audio briefing
│   │   ├── DriveKnowledgeView.tsx   # Document reader & 6-tab analysis
│   │   ├── FlashcardDeck.tsx        # 3D interactive flashcards
│   │   ├── AgentChatDrawer.tsx      # Grounded AI conversation drawer
│   │   ├── AddDriveModal.tsx        # Modal to import Drive links
│   │   └── SettingsModal.tsx        # Gemini API Key configuration
│   ├── lib/
│   │   ├── mockData.ts              # Pre-loaded OS, DBMS, & ML college notes
│   │   └── newsData.ts              # Initial hourly news dataset
│   └── types/
│       └── index.ts                 # TypeScript data contracts
├── vercel.json                      # Vercel deployment configuration
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 🛡️ License
MIT License. Built for hackathons, student productivity, and enterprise portfolio showcases.
