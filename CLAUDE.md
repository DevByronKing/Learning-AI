# CLAUDE.md — Claude Code & Multi-Agent Configuration

> This repository uses a unified Agentic Engineering architecture compatible with **Claude Code** (`CLAUDE.md`) and **Antigravity** (`AGENTS.md`, `.agents/`, `.antigravity/`).

## 1. Quick Commands for Claude Code

- **Install dependencies:** `npm ci --legacy-peer-deps`
- **Typecheck (Gate 1):** `npx tsc --noEmit`
- **Unit & Security Tests (Gate 2 - 21 suites):** `npm test`
- **E2E Accessibility Tests:** `npm run test:a11y`
- **Production Build (Gate 3):** `npm run build`

## 2. Mandatory Engineering Rules & Skills

Before modifying code, read and follow the modular rules in:

1. [`AGENTS.md`](./AGENTS.md) — Global operational contract, Conventional Commits discipline, and cognitive focus output protocol.
2. [`.agents/skills/sdd-tdd-guardrails-agent-rules/SKILL.md`](./.agents/skills/sdd-tdd-guardrails-agent-rules/SKILL.md) — Spec-Driven Development (`specs/PRD-*.md`), mandatory TDD (`src/__tests__/`), and SQL/data safety guardrails (`src/lib/guardrails.ts`).
3. [`.agents/skills/sete-leis-ux-arquitetura-tela/SKILL.md`](./.agents/skills/sete-leis-ux-arquitetura-tela/SKILL.md) — The 7 Laws of UX enforced across all Next.js and Capacitor mobile screens.
4. [`.agents/plugins/cognitive-focus-plugin/plugin.json`](./.agents/plugins/cognitive-focus-plugin/plugin.json) — Action-first response formatting and bounded step execution.
5. [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) — 11-layer system architecture, Supabase RLS matrix, and L1/L2 AI caching specifications.
