---
description: Block C agentic workflow — Stage 0 through Stage 2 with testing rules
---

## Agentic Workflow

Block C is an agent exercise. The intentional gaps in the starter code (date range filtering, aggregation, averages) are the features you are expected to implement.

### Stage 0 — Understand and Specify

Before writing any code, use the **@spec-interrogator** agent to produce a frozen feature spec. The agent will interview you through four rounds (Goal/Users → Data/Behaviour → Edge cases → Success/Scope) and output a structured spec.

### Stage 1 — Implement

Implement the spec: new routes, service methods, and tests. All new behaviour must be tested before proceeding.

### Stage 2.5 — Self-Review

After implementation, use the **/code-review** skill in Copilot Chat to verify every spec requirement with ✅ / ⚠️ / ❌. Fix every ❌ and ⚠️ before continuing.

> Trigger prompt: *"Now review my implementation against the spec. List each requirement with ✅, ⚠️, or ❌ and fix anything that isn't ✅ before we continue."*

### Stage 2 — Branch and Commit

1. Create a branch: `feat/<short-description>`.
2. Stage all changes and commit with a conventional commit message.
3. Open a pull request against `main`.

---

## Testing Rules

- Test files live in `tests/` alongside `src/`. The glob is `**/tests/**/*.test.ts`.
- Each test file maps to one route or service module (e.g. `energy.test.ts`).
- New behaviour must always be accompanied by tests. This is not optional.
- Do not mock `energyService` in route tests — use the real in-memory store. Reset state by creating resources within each test.
- Test names should read as plain English sentences: `it('returns 404 when the house does not exist')`.
