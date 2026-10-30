# Argus (Learning-AI)

> **High-Performance Cognitive Copilot for Civil Service & Bar Exams** — AI-Driven Syllabus Dissection, Root-Cause Error Diagnostics, Adaptive SM-2 Spaced Repetition, and Offline-First Architecture.

---

## 🚀 Overview

**Argus** is an enterprise-grade educational accelerator engineered for civil service candidates and bar exam (OAB) preparation. Moving beyond passive study methods, the platform orchestrates psychometric algorithms and LLM workflows to identify cognitive blind spots before exam day:

1. **AI Syllabus Parser & Verticalizer:** Automated extraction of subjects, weights, and statistical board relevance (Cebraspe, FGV, Vunesp, FCC).
2. **Cognitive Diagnostic Simulator:** Root-cause error classification (*Board Trap*, *Theoretical Gap*, *Rushed Reading*, *Forgetting Curve*) linked directly to statutory articles and jurisprudence.
3. **SM-2 Spaced Repetition Player (SRS):** Active recall engine modeled on Ebbinghaus's Forgetting Curve, featuring full keyboard navigation (`Space` / `1-4`) and native **Anki** deck export (`.txt` / `.tsv`).
4. **Smart Mistakes Notebook & Rematch Mode:** Automated cataloging of failed distractors, study annotations, and targeted retry loops.
5. **Discursive Essay Studio:** Past board prompts, real-time line counting, exam timer, and AI grading against official rubric mirrors.
6. **Smart Vade Mecum:** Statutory law browser (CF/88, Law 8.112, Administrative Improbity, Procurement Law 14.133) cross-referenced with past exam questions.
7. **Adaptive Study Cycles:** Alexandre Meirelles methodology integrated with Pomodoro timers and dynamic workload balancing.
8. **Checkout & Monetization:** Dynamic Pix (Asaas) and Credit Card (Stripe) billing across *Aspirante*, *Concurseiro Elite*, and *Tribunal Master* tiers.
9. **Programmatic SEO:** Dynamic public routes (`/edital/[slug]`) optimized for organic search indexing and lead capture.

---

## 🛠️ Tech Stack

- **Frontend:** [Next.js 14](https://nextjs.org/) (App Router + Turbopack), [React 18](https://react.dev/), [TypeScript 5](https://www.typescriptlang.org/) (Strict Mode)
- **Styling & Design System:** [TailwindCSS](https://tailwindcss.com/) with Executive Cyber-Dark palette & 7 UX Laws compliance
- **State & Offline-First Persistence:** [Zustand 5](https://zustand-demo.pmnd.rs/) (`persist` middleware + `localStorage` fallback)
- **Backend & Database:** [Supabase](https://supabase.com/) (PostgreSQL 15+ with Row-Level Security, `pgvector`, `pg_trgm` + Supabase Auth)
- **AI & LLM Orchestration:** Google Gemini 1.5/2.0 Flash + OpenAI fallback with L1 (in-memory) and L2 (PostgreSQL) semantic caching
- **Mobile Runtime:** [Capacitor](https://capacitorjs.com/) (Android & iOS native bridge)
- **Testing & Quality Gates:** [Vitest](https://vitest.dev/) (Unit/Integration), [Playwright](https://playwright.dev/) (E2E), TypeScript Strict Check

### 🧠 System Architecture & AI Workflow

```text
[Next.js 14 Frontend] <---> [Supabase Auth & PostgreSQL]
         |                           |
         v                           v
 [AI Agent Plugins] <-------> [Core Business Logic]
         |---> .agents/skills/sdd-tdd-guardrails-agent-rules
         |---> .agents/plugins/cognitive-focus-plugin
         |---> .agents/skills/sete-leis-ux-arquitetura-tela
```

---

## 🤖 Agentic Engineering & SDD/TDD Guardrails

This repository is structured for autonomous AI coding assistants (Claude Code, Antigravity) using modular context rules rather than monolithic prompts:

- **Spec-Driven & Test-Driven Guardrails (`.agents/skills/sdd-tdd-guardrails-agent-rules`):** Enforces acceptance criteria before implementation, mandatory unit test coverage (`src/__tests__/`), and schema/security guardrails.
- **UI/UX Architecture Constraints (`.agents/skills/sete-leis-ux-arquitetura-tela`):** Enforces the 7 Laws of UX (Fitts, Hick, Zeigarnik, Jakob, Goal-Gradient, Von Restorff, Miller) across all React components.
- **Cognitive Focus Engine (`.agents/plugins/cognitive-focus-plugin`):** Shapes agent output for low cognitive friction, action-first responses, and bounded multi-step execution.

---

## ⚡ Getting Started (Local Development)

### Prerequisites
- Node.js 18+
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/DevByronKing/Learning-AI.git
cd Learning-AI
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy the example environment file:
```bash
cp .env.example .env.local
```
Populate `.env.local` with your Supabase and AI provider credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
GEMINI_API_KEY=your-gemini-api-key
OPENAI_API_KEY=sk-proj-...
```

### 4. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Run Quality Gates (Tests & Production Build)
```bash
npm test
npm run build
npm start
```

---

## 🗄️ Database Schema & Security (Supabase)

The full PostgreSQL DDL script with Row-Level Security (RLS) policies and performance indexes is located at:
```text
supabase/schema.sql
```
Protected tables include:
- `profiles` (student metadata, study methodology, and daily AI quotas)
- `exam_notices` (parsed syllabuses and subject weights)
- `questions` (shared question bank with `pg_trgm` full-text search)
- `question_attempts` (cognitive error telemetry)
- `flashcards` (SM-2 spaced repetition intervals and ease factors)
- `mistakes_notebook` (failed distractor tracking and rematch state)
- `ai_diagnostic_cache` (L2 persistent LLM response cache)

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for full details.
