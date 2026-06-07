# Block B — Code Renovation

**Gym Membership API** — a deliberately messy legacy codebase for testing AI-assisted renovation.

## What this is

A working (but poorly written) Express API for a gym membership system. Four members, two plans (Basic/Premium), check-in tracking, and billing. The code has intentional problems — your job is to use AI to understand, modernize, and fix it.

## Start the API

```bash
cd renovation/app
npm install
npm run dev    # API at http://localhost:4000
```

## What works (barely)

| Endpoint | Description |
|---|---|
| `GET /members` | List all members |
| `GET /members/:id` | Get a member (returns `null` if not found — no 404) |
| `POST /members` | Add a member (no validation) |
| `POST /members/:id/checkin` | Check in a member (no validation, no limit enforcement) |
| `GET /members/:id/checkins` | Get checkin history |
| `GET /members/:id/billing` | Billing summary (with hardcoded prices and bugs) |

## What's wrong — your job

The codebase has deliberate issues. Use AI to find and fix them:

| Issue | Location | Symptom |
|---|---|---|
| Week calculation bug | `checkins.js` | `getWeekKey` computes wrong Monday for Sundays |
| No input validation | `routes.js` | Accepts missing fields, invalid emails, unknown members |
| Hardcoded plan prices | `routes.js` | Billing endpoint passes hardcoded `{ basic: { price: 299 }, premium: { price: 499 } }` instead of the real plans map |
| Duplicate date logic | `billing.js` | `isOverdue` and `daysSinceLastPayment` duplicate date-diff math |
| Magic numbers | `billing.js` | 30-day month, 35-day overdue threshold, no constants |
| No plan limit enforcement | `checkins.js` | Premium members have `maxCheckins: 999` but it's never checked |
| Inconsistent error shapes | `routes.js` | One uses `{ error }`, another `{ msg }` — no standard |
| No tests | — | Zero test coverage |
| `var` everywhere | all files | No `const`/`let` |
| CommonJS `require` | all files | Should be ES modules |
| No TypeScript | all files | Should be strict TypeScript |

## The workflow — 5 stages

### Stage 1 — Understand

Use Copilot Chat in **Ask mode** to explain each file, trace request flows, and identify bugs. Record findings in `notes.md`.

> *"Explain what src/checkins.js does. Find all bugs related to the week calculation."*

### Stage 2 — Modernize

Switch to **Agent mode**. Convert to TypeScript, ES modules, `const`/`let`. Add `tsconfig.json` and `jest.config.ts`.

> *"Convert src/members.js to TypeScript with proper interfaces. Use ES module syntax."*

### Stage 3 — Test

Use Copilot to generate a test suite that captures current (buggy) behavior — this is your safety net before refactoring.

### Stage 4 — Fix & Refactor

Fix bugs one at a time. Extract business logic into services. Add validation. Run tests after each change.

### Stage 5 — Review & Commit

**`/code-review`** → **`@pr-readiness-gate`** → branch → commit → push.

## Codebase at a glance

| File | Purpose |
|---|---|
| `src/app.js` | Express entry point — inline error handler, CommonJS |
| `src/members.js` | Member store — in-memory array, no validation |
| `src/checkins.js` | Check-in logic — week calculation bug, no limit enforcement |
| `src/billing.js` | Billing logic — magic numbers, duplicated date math |
| `src/routes.js` | Route handlers — business logic mixed in, inconsistent errors |

## Tips

- **Don't fix anything in Stage 1.** Just read and document. Understanding first, editing later.
- **Run the API** (`npm run dev`) and send requests with `curl` or the VS Code REST client to see the buggy behavior live.
- **Tests are your safety net.** If you skip Stage 3, you risk breaking things during refactoring without knowing it.
- **Use `@pair-programmer`** when unsure about a refactoring approach — it helps you think through the tradeoffs.
- **Work incrementally.** Fix one bug, run tests, commit. Don't fix everything at once.

## After the exercise

Your refactored codebase should have:
- Strict TypeScript throughout
- ES module imports/exports
- Service layer (`src/services/`) with business logic separated from routes
- Full test coverage with Jest
- Consistent `{ error, code }` error responses
- Validation on all inputs
- No magic numbers — named constants
- Plan limit enforcement on checkins
