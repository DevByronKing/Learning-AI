# Argus

> **High-Performance Cognitive Copilot for Civil Service & Bar Exams** — AI-Driven Syllabus Dissection, Root-Cause Error Diagnostics, Adaptive SM-2 Spaced Repetition, and Offline-First Architecture.

[![CI/CD Pipeline](https://github.com/DevByronKing/Argus/actions/workflows/ci.yml/badge.svg)](https://github.com/DevByronKing/Argus/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)

---

## 🚀 Overview & Full Feature Ecosystem

**Argus** is a production-grade EdTech SaaS & Mobile platform (60+ React components, 19 API routes, and 21 automated test suites) engineered for competitive civil service and Bar exam (OAB) candidates. Moving beyond passive study methods, the platform orchestrates psychometric algorithms and LLM workflows to identify cognitive blind spots before exam day:

### 1. AI & Cognitive Engines (Google Gemini + L1/L2 Semantic Cache + Deterministic Fallback)
1. **Cognitive Root-Cause Diagnostic Simulator:** Classifies student errors into 4 psychometric categories (*Board Trap*, *Theoretical Gap*, *Rushed Reading*, *Forgetting Curve*) linked directly to statutory citations with `<1ms` L1/L2 cache hits.
2. **AI Syllabus Parser & Async Job Queue:** Automated extraction of subjects, weights, and statistical board relevance (Cebraspe, FGV, Vunesp, FCC) backed by an asynchronous job queue.
3. **Discursive Essay Studio:** AI grading against official board rubrics, real-time line counting, exam timer, line-by-line grammar deviation detection, and a 100-score rewritten mirror.
4. **Multimodal Official Exam Ingestion Pipeline:** Admin OCR/PDF & Regex extractor (`src/lib/questionExtractor.ts`) that cross-references post-appeal answer keys and automatically flags repealed legislation (e.g., Law 8.666/93 vs. 14.133/21).
5. **24/7 Context-Aware AI Copilot & 3D Holographic Mentor:** Personalized tutor aware of the student's target exam, weakest subject, and daily study metrics.

### 2. Active Recall, Psychometrics & Legal Tooling
6. **SM-2 Spaced Repetition Player (SRS):** Active recall engine modeled on Ebbinghaus's Forgetting Curve with full keyboard navigation (`Space` / `1-4`), Web Speech TTS, and native **Anki** deck export (`.txt` / `.tsv`).
7. **Smart Mistakes Notebook & Rematch Mode:** Automated cataloging of failed distractors, study annotations, and targeted retry loops until mastery.
8. **Adaptive Study Cycles (Meirelles Method):** Dynamic schedule generator prioritizing weak subjects ("Achilles' Heel") and syllabus weights with integrated Pomodoro timers.
9. **Smart Vade Mecum & Interactive Brazil Exam Radar:** Searchable statutory law browser (CF/88, Law 8.112, LIA 14.230/21, Law 14.133/21) cross-referenced with past questions, interactive national map of open exams, TRI psychometrics, and GitHub-style consistency heatmaps.

### 3. Enterprise Security, FinTech & Cross-Platform Architecture
10. **Zero-Trust Security & SDD Guardrails:** Custom WAF middleware (`src/middleware.ts`) with SQLi/XSS/Path-Traversal sanitization, SIEM telemetry, IP rate-limiting/auto-ban, 2FA, RBAC, and programmatic SQL guardrails (`src/lib/guardrails.ts`) blocking hard deletes.
11. **Full Monetization & Growth Engine:** Dynamic Pix QR Code (Asaas) and Credit Card (Stripe) billing with idempotent webhooks, terminal-style D0 onboarding, Sean Ellis PMF surveys, anti-churn flows, A/B testing, and programmatic SEO (`/edital/[slug]`).
12. **Offline-First & Native Mobile (Capacitor 8):** Android & iOS native bridge with haptic feedback and automatic Zustand `localStorage` <-> Supabase RLS synchronization.

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
git clone https://github.com/DevByronKing/Argus.git
cd Argus
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
