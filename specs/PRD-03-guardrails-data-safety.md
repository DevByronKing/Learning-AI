# PRD-03: Operational Data Safety & Destructive Action Guardrails

## 1. Overview
Programmatic governance layer and runtime code guardrails (`src/lib/guardrails.ts`) preventing accidental deletions, destructive SQL commands, or unauthorized purging of core Argus entities.

## 2. Functional Requirements
1. **Destructive SQL Interception:** Intercept and block any command containing `DROP TABLE`, `DROP DATABASE`, `TRUNCATE`, or unguarded `DELETE` statements lacking a `WHERE` clause (or using `WHERE 1=1`).
2. **Hard-Delete Protection on Critical Entities:** Core tables (`questions`, `student_profiles`, `audit_logs`, `exam_notices`, `question_attempts`, `payment_transactions`) cannot be hard-deleted by application requests.
3. **Mandatory Soft Delete:** Entity removal operations must apply `isDeleted = true` and an ISO `deletedAt` timestamp via `executeSafeEntityDeletion`.
4. **2FA Confirmation Token for Bulk Mutations:** High-impact bulk updates require a cryptographic `confirmationToken` (`CONFIRM_BULK_*`).

## 3. Acceptance Criteria
- [x] `validateDatabaseGuardrail` blocks 100% of `DROP TABLE` and `DELETE FROM questions` attempts.
- [x] Hard-delete attempts return a deterministic rejection reason without crashing the runtime process.
- [x] Automated test suites in `src/__tests__/guardrailsEngine.test.ts` verify rejection of malicious or accidental destructive commands.
