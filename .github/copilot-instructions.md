# Copilot Instructions

These instructions apply to all code in this repository. Read them before generating any suggestion.

---

## Project Overview

This is a workshop monorepo demonstrating agentic and AI-assisted development workflows. It is structured around three independent blocks:

| Directory | Block | Purpose |
|---|---|---|
| `block-a-vibe-coding/app` | Block A | React + Tailwind frontend — vibe coding exercise |
| `block-b-agent-build/app` | Block B | Express + TypeScript energy consumption API — agent-build exercise |
| `block-c-*` | Block C | Extension of Block B — review and hardening exercise |

TypeScript is used throughout. There is no shared package between blocks; each has its own `package.json`.

---

## General Code Conventions

- **TypeScript strict mode is on everywhere.** Never use `any`. If you do not know the type, model it properly or use `unknown` with a type guard.
- Use **named exports** for everything. Default exports are permitted only for Next.js pages or React components that a framework requires to be default.
- Prefer **`const` over `let`**. Use `let` only when reassignment is genuinely needed. Never use `var`.
- Write **conventional commits**: `feat:`, `fix:`, `test:`, `refactor:`, `chore:`, `docs:`. Keep subject lines under 72 characters, imperative mood.
- Do not commit `node_modules`, `dist`, or `.env` files.

---

## Block A Conventions (React + Tailwind)

- Components must be **function components using hooks only**. No class components.
- All styling must use **Tailwind utility classes**. Do not write inline `style` props or separate CSS files unless you are adding a Tailwind `@layer` extension.
- Place all components in `src/components/`. Group by feature in sub-directories when a feature has more than two files.
- Keep components small and focused: if a component exceeds ~100 lines, consider splitting it.
- Fetch data inside custom hooks (e.g. `useHouses`), not directly inside components.

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

## Block B Agentic Workflow

Block B is an agent-build exercise. The agent follows a structured workflow to extend the starter API. The intentional gaps in the starter code (date range filtering, aggregation, averages) are the features the agent is expected to implement.

### Stage 0 — Understand and Specify

Before writing any code, the agent reads the existing source files and produces a short spec in Markdown describing what it plans to implement. This spec covers:
- The new endpoints or behaviours being added
- The expected request/response shapes
- Any validation rules
- Which existing files will be modified and why

### Stage 1 — Implement

The agent implements the spec: new routes, service methods, and tests. All new behaviour must be tested before proceeding.

---

### Stage 2.5 — Self-Review

**This stage runs after implementation (Stage 1) and before branching or committing (Stage 2).**

After finishing the implementation, the agent must re-read the spec it produced in Stage 0 and verify that every requirement has been satisfied.

**Steps:**

1. Re-read the Stage 0 spec markdown.
2. For each requirement listed in the spec, evaluate the implementation:
   - **✅ implemented** — the code fully satisfies this requirement and a test covers it.
   - **⚠️ partial** — the code addresses it but incompletely (e.g. missing edge case, no test).
   - **❌ missing** — the requirement has not been implemented at all.
3. Produce a short checklist with one line per requirement and a ✅ / ⚠️ / ❌ status.
4. Fix every ❌ and ⚠️ item before proceeding.
5. Once all items are ✅, proceed to Stage 2.

**Trigger prompt to use in Copilot Chat:**

> Now review your implementation against the spec. List each requirement with ✅, ⚠️, or ❌ and fix anything that isn't ✅ before we continue.

---

### Stage 2 — Branch and Commit

After Stage 2.5 confirms all items are ✅:

1. Create a branch: `feat/<short-description>`.
2. Stage all changes and commit with a conventional commit message.
3. Open a pull request against `main`.

---

## Testing Rules

- Test runner is **Jest** with **ts-jest** and **supertest**.
- Test files live in `tests/` alongside `src/`. The glob is `**/tests/**/*.test.ts`.
- Each test file maps to one route or service module. Name them accordingly (e.g. `energy.test.ts`).
- New behaviour must always be accompanied by tests. This is not optional.
- Do not mock `energyService` in route tests — use the real in-memory store. Reset state by creating resources within each test.
- Test names should read as plain English sentences: `it('returns 404 when the house does not exist')`.

---

## Git Rules

- Branch naming: `feat/<short-description>` or `fix/<short-description>`.
- All work goes through pull requests. Do not commit directly to `main`.
- PR titles follow conventional commits format.
- Squash commits before merging if there are more than three fixup commits.
