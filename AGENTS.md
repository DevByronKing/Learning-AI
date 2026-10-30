# AGENTS.md — Autonomous AI Engineering Manifesto

> **Scope:** Global operational contract for AI coding assistants (Claude Code, Antigravity, Cursor) contributing to the **Argus (Learning-AI)** codebase.

---

## 1. Architectural Governance & Skill Modules

All autonomous code generation, refactoring, and review must comply with the modular skills registered under `.agents/` and `.antigravity/`:

1. **SDD & TDD Guardrails (`.agents/skills/sdd-tdd-guardrails-agent-rules/SKILL.md`):**
   - **Spec-Driven Development (SDD):** Complex features require explicit acceptance criteria (`specs/`) before implementation.
   - **Test-Driven Development (TDD):** Core business logic (`src/lib/`) and security boundaries must be backed by automated Vitest suites (`src/__tests__/`).
   - **Destructive Action Guardrails:** Never drop database tables, bypass Row-Level Security (RLS), or expose server-only keys (`SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY`) to client bundles.
2. **UI/UX Screen Architecture (`.agents/skills/sete-leis-ux-arquitetura-tela/SKILL.md`):**
   - Every view must enforce the **7 Laws of UX**: Fitts's Law (`>= 48px` primary targets), Hick's Law (progressive disclosure, max 3-4 options per group), Zeigarnik Effect (visible onboarding checklists), Jakob's Law (standard navigation patterns), Goal-Gradient Effect (dynamic progress bars), Von Restorff Effect (single primary CTA per section), and Miller's Law (chunked 3-5 item groups).
3. **Cognitive Focus Output Engine (`.agents/plugins/cognitive-focus-plugin/plugin.json`):**
   - Responses are structured for high-velocity execution and low cognitive overhead.

---

## 2. Output & Execution Protocol (`cognitive-focus-plugin`)

Shape every engineering response so it can be acted on immediately:

1. **Lead with the action:** Place the exact command, file path, or code diff on the first line.
2. **Number multi-step workflows:** One bounded, atomic action per step.
3. **End with one concrete verification step:** Name one action doable in under two minutes (e.g., `npm test -- srsAlgorithm.test.ts`).
4. **Single-issue isolation:** Finish the active defect or feature before raising secondary refactors.
5. **Explicit state tracking:** Restate progress across turns (e.g., `Step 2 of 4 complete`).
6. **Deterministic estimates:** Provide concrete time or complexity units, never vague qualifiers.
7. **Verify outcomes:** Show what now passes or renders after every change.
8. **Objective error reporting:** State `file:line`, root cause, and fix without filler.
9. **Bounded lists:** Cap visible bullet lists to 5 items per group.
10. **Zero fluff:** No conversational preambles, recaps, or closing pleasantries.

---

## 3. Commit & Quality Gate Discipline

- **Conventional Commits:** Prefix all commits with semantic scopes (`feat(ai):`, `fix(auth):`, `refactor(ui):`, `docs(architecture):`, `test(srs):`).
- **Pre-Merge Gates:** Code must pass `npx tsc --noEmit` and `npm test` before completion.
