---
applyTo: agent/**
---

## Block B / C Conventions (Express API)

- The web framework is **Express**. Do not introduce other HTTP frameworks.
- State is held in **in-memory Maps** (`EnergyService`). Do not add a database or file-system persistence.
- All error responses must use the shape `{ error: string; code: string }`. The `code` field is a screaming-snake-case identifier (e.g. `HOUSE_NOT_FOUND`, `READING_NOT_FOUND`, `VALIDATION_ERROR`).
- HTTP semantics to follow:
  - `200` — success with body
  - `201` — resource created (include the created resource in the body)
  - `204` — success with no body (delete)
  - `400` — client validation error
  - `404` — resource not found
  - `500` — unhandled server error (let the error handler produce this)
- **Every new route or behaviour must have a corresponding test.** Do not open a PR with untested code paths.
- The `kwh` field on a reading must always be a positive number (> 0). Reject invalid values with a 400.

---

## Agentic Workflow

Block B is an agent exercise. The intentional gaps in the starter code (date range filtering, aggregation, averages) are the features you are expected to implement.

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

- Test runner is **Jest** with **ts-jest** and **supertest**.
- Test files live in `tests/` alongside `src/`. The glob is `**/tests/**/*.test.ts`.
- Each test file maps to one route or service module (e.g. `energy.test.ts`).
- New behaviour must always be accompanied by tests. This is not optional.
- Do not mock `energyService` in route tests — use the real in-memory store. Reset state by creating resources within each test.
- Test names should read as plain English sentences: `it('returns 404 when the house does not exist')`.
