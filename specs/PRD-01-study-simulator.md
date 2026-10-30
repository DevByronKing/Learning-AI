# PRD-01: High-Performance Question Simulator (Argus Arena)

## 1. Overview
High-velocity question resolution engine for Civil Service and Bar (OAB) exams, engineered for mobile ergonomics, reduced cognitive fatigue, and instant psychometric feedback.

## 2. Functional Requirements
1. **One-Tap Option Elimination (Strikethrough):** Dedicated control on each option (`A`, `B`, `C`, `D`, `E`) to strike through and dim (`opacity: 40%`) ruled-out distractors without submitting the answer.
2. **Inline Statutory Commentary & Trap Analysis:** Immediately upon answer confirmation, render the theoretical rationale, linked statutory citation (`codeCitation`), and board trap breakdown directly below the options without requiring page navigation.
3. **Adjustable Typography Scale:** `A- / A+` controls scaling statement and option typography across 4 discrete levels (`sm`, `base`, `lg`, `xl`).
4. **One-Tap Audit Telemetry:** Micro-feedback component with 5 structured tags (*Outdated Question*, *Unclear Explanation*, *System Defect*, *Controversial Answer Key*, *Missing Statutory Citation*).

## 3. Acceptance Criteria
- [x] Clicking the scissors/strikethrough icon on Option B strikes through the text and reduces opacity to 40%.
- [x] Advancing to the next question automatically resets eliminated options.
- [x] The inline rationale block renders the exact statutory quote whenever `currentQuestion.codeCitation` is present.
- [x] Primary confirmation and progression CTAs enforce a minimum height of `48px` (Fitts's Law).
- [x] Automated unit tests covering option elimination state and typography scaling pass 100% (`src/__tests__/uxUsabilitySuite.test.ts`).
