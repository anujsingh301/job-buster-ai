# Job Buster AI
### Job-listing risk and resume-fit analysis

Job Buster AI helps job seekers screen a listing for common scam and ghost-job signals, then compare the listed skills with a candidate profile. It includes sample listings for quickly demonstrating the workflow.

Without an API key, the app uses local keyword-based heuristics. It does not independently verify employers, domains, live vacancies, repost history, or cited claims. With `GEMINI_API_KEY` configured, listing and candidate-profile text is sent to Google's Gemini API for analysis; do not submit sensitive personal information unless you are comfortable sharing it with that provider.

---

## 🚀 Key Features

1. **Listing risk screening:** Highlights common fee, fake-check, off-platform messaging, compensation, and reposting signals.
2. **Streaming analysis status:** Server-Sent Events (SSE) deliver progress updates to the terminal-style interface.
3. **Forensic Verdict Dashboard:** Legitimacy score, risk signals, resume fit, career pages, and JSON export.
4. **1-Click Interactive Demos:** Suspicious ghost job, legit listing, and high scam risk samples.

## 🛠️ Tech Stack
- Next.js 14+ (App Router, Server-Sent Events streaming)
- TypeScript and Tailwind CSS
- Optional `@google/genai` API
- `lucide-react`

## ⚡ Quick Start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. Add `GEMINI_API_KEY=your_gemini_api_key_here` to `.env.local` for optional Gemini analysis. Without a key, local mode does not browse the web or verify the signals it reports.

```bash
npm run build
npm start
```
