---
name: sete-leis-ux-arquitetura-tela
description: Mandatory UI/UX engineering guidelines based on the 7 Laws of UX (Fitts, Hick, Zeigarnik, Jakob, Goal-Gradient, Von Restorff, and Miller). Apply when creating, reviewing, or refactoring any screen, dashboard, navigation menu, pricing page, or onboarding flow.
---

# Screen Architecture Guidelines: The 7 Laws of UX

Core Principle: **Great screens minimize cognitive load.** Every component and layout built in this repository must enforce the following engineering constraints:

## 1. Fitts's Law (Primary Targets Close & Large)
- **Rule:** The time to acquire a target is a function of the distance to and size of the target.
- **Implementation:** The primary Call-to-Action (CTA) on any screen must have generous dimensions (minimum height of `48px` on mobile, ample padding) and sit within the immediate visual focus area or thumb zone.
- **Prohibited:** Hiding primary actions in distant corners, nested dropdown menus, or undersized buttons.

## 2. Hick's Law (Fewer Choices, Less Friction)
- **Rule:** The time it takes to make a decision increases with the number and complexity of choices.
- **Implementation:** Cap simultaneous decisions (e.g., 2 to 3 highlighted tiers on pricing views; max 3 to 4 quick actions per card). Use *Progressive Disclosure* to tuck advanced filters or settings into secondary tabs or modals.

## 3. Zeigarnik Effect (Visible Incomplete Tasks Drive Completion)
- **Rule:** People remember uncompleted or interrupted tasks better than completed tasks.
- **Implementation:** In onboarding, activation, and daily study flows, render a visible checklist component (e.g., "Activation Steps: 4/5 completed") with the initial step pre-checked upon account creation.

## 4. Jakob's Law (Familiar Mental Models)
- **Rule:** Users spend most of their time on other sites and expect your application to work the same way.
- **Implementation:** Preserve universal UI conventions:
  - Search bar at the top with a magnifying glass icon (`Search`).
  - Notifications using a bell icon (`Bell`) in the header.
  - Profile and Settings anchored in the top-right header or bottom of the sidebar.

## 5. Goal-Gradient Effect (Visible Progress Accelerates Effort)
- **Rule:** The tendency to approach a goal increases with proximity to the goal.
- **Implementation:** In multi-step journeys (onboarding, mock exams, flashcard decks), render a continuous progress bar and trigger encouraging dynamic microcopy once progress reaches `>= 75%` (e.g., "Almost there!").

## 6. Von Restorff Effect (Single Primary Highlight Per Section)
- **Rule:** When multiple similar objects are present, the one that differs from the rest is most likely to be remembered and acted upon.
- **Implementation:** Render **only 1 Primary-styled button (solid accent fill)** per visual section. Secondary actions ("Share", "Export", "Details", "Schedule") must use neutral variants (`secondary`, `outline`, or `ghost`).

## 7. Miller's Law (Chunking — 3 to 5 Groups)
- **Rule:** The average person can only keep `7 ± 2` items (ideally 3 to 5 chunks) in working memory.
- **Implementation:** Never render flat navigation bars or metric lists with more than 7 ungrouped items of equal visual weight. Group metrics, links, and controls into **3 to 4 clear categories** with distinct section headers.
