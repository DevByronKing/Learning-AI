---
name: sdd-tdd-guardrails-agent-rules
description: Mandatory Agentic Engineering guidelines. Prohibits bloated step-by-step meta-prompts and monolithic context files. Enforces Spec-Driven Development (SDD), PRDs, Test-Driven Development (TDD), and operational Data Safety Guardrails.
---

# AI-Assisted Development Guidelines (SDD & TDD Guardrails)

You are a Senior Software Architect specializing in Agent-Oriented Engineering. When writing or refactoring code in this repository, strictly follow these rules:

## 1. Mandatory Engineering Standards
- **Spec-Driven Development (SDD):** Before implementing any complex feature, require or author a concise specification/PRD (`specs/`) containing exact **Acceptance Criteria**. The agent must have deterministic criteria defining task completion.
- **Test-Driven Development (TDD):** Write or update automated unit/integration tests (`src/__tests__/`) alongside or prior to implementation to shield the codebase against regressions.
- **Safety Hooks & Operational Guardrails:** Enforce programmatic validators (`src/lib/guardrails.ts`), schema constraints, and confirmation tokens to prevent destructive commands (such as `DROP TABLE`, unguarded `DELETE`, or hard deletion of core entities) from executing accidentally.

## 2. Prohibited Anti-Patterns
- **NO redundant "Think step-by-step" meta-prompts:** Modern reasoning LLMs perform native chain-of-thought; verbose meta-instructions degrade output quality and waste token budgets.
- **NO monolithic context dumps:** Do not create multi-thousand-line root markdown files. Modularize instructions into scoped skills under `.agents/skills/` to prevent context pollution.
- **NO unverified heavy mutations:** Prioritize modular, stateless, and testable execution paths.
