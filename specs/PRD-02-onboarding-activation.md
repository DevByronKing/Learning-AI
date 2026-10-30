# PRD-02: Cognitive Onboarding & Instant D0 Activation

## 1. Overview
Guided 5-step onboarding pipeline designed for rapid candidate profiling, 4G drop-off resilience via real-time draft persistence, and immediate routing into the first active study session without upfront paywall friction.

## 2. Functional Requirements
1. **Single-Decision Screen Architecture (Miller's & Hick's Laws):** Segmented 5-step flow (*Pain Point Mapping*, *Target Exam & Board*, *Achilles' Heel Subject*, *Cognitive Guardian*, and *Study Passport Verdict*).
2. **4G Drop-Off Resilience:** Persist every step selection immediately to `localStorage` under the `argus_onboarding_draft` key.
3. **Stateful Back Navigation:** Navigating backward restores previous selections without data loss.
4. **Goal-Gradient Trigger:** Motivational microcopy (*"⚡ Almost there!"*) activates automatically from Step 4 onward (`>= 75%` completion).
5. **Direct D0 Activation:** Completing onboarding routes the student directly to `setActiveTab('simulator')` calibrated to their target exam syllabus.

## 3. Acceptance Criteria
- [x] Temporary onboarding draft is persisted in real time and purged upon completion.
- [x] Users never encounter blank screens or uninitialized states post-onboarding.
- [x] The target syllabus selected during onboarding becomes the active session default.
- [x] Automated unit tests for draft persistence, recovery, and cleanup pass 100% (`src/__tests__/uxUsabilitySuite.test.ts`).
