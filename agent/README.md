# Block B — Agent Build

**Energy Consumption API** — a REST API for tracking hourly household energy readings.

## What this is

A working Express + TypeScript API with three pre-seeded houses and 24 hourly readings for `house-001`. Basic CRUD is implemented. Several features are **intentionally missing** — your job is to add them using the agentic workflow.

## Start the API

```bash
cd agent/app
npm install
npm run dev    # API at http://localhost:8000
npm test       # Run the test suite
```

## What is working

| Endpoint | Description |
|---|---|
| `GET /houses` | List all houses |
| `GET /houses/:id` | Get a single house |
| `GET /houses/:id/readings` | Get all readings for a house |
| `POST /houses/:id/readings` | Add a reading (`{ timestamp, kwh }`) |
| `DELETE /readings/:id` | Delete a reading |

## What is missing — your job

These features are gaps in the starter code. Implement them using the agentic workflow below:

1. **Date range filtering** — `GET /houses/:id/readings?from=<ISO>&to=<ISO>` returns only readings within the range
2. **Aggregation** — `GET /houses/:id/readings/summary` returns `{ total: number, average: number, count: number }` for a house
3. **Daily averages** — extend the summary to include a breakdown by day

## Agentic workflow

### Stage 0 — Spec
Switch to **`@spec-interrogator`** in Copilot Chat. It will interview you about the feature and produce a frozen spec. Confirm the spec before moving on.

### Stage 1 — Implement
Switch to **`@pair-programmer`** while you write code. It acts as your navigator — asking technical questions, not writing code for you. Use Copilot's agent mode to implement the feature itself.

### Stage 2.5 — Self-review
Use the **`/code-review`** skill to run a checklist of your implementation against the spec. Fix every ❌ and ⚠️ before continuing.

### Stage 2 — Commit
Optionally run **`/dead-code-scanner`** to find unused exports before committing. Use the **`/test-generation`** skill if you need to fill coverage gaps, then branch and commit:

```bash
git checkout -b feat/<short-description>
git add .
git commit -m "feat: <what you built>"
```

## Bonus: Find the bug

There is a validation gap in the starter code. The `POST /houses/:id/readings` endpoint accepts a `timestamp` field but does **not** validate that it is a valid ISO 8601 date string. A request like:

```json
{ "kwh": 4.2, "timestamp": "not-a-date" }
```

… returns `201 Created`. That data is then silently broken for any date-range filter.

**Task:** Use AI to find and fix it.

1. Open **`@pair-programmer`** and describe the symptom: *"The readings endpoint accepts invalid timestamps. Walk me through finding where the validation is missing."*
2. Once you know the gap, use Copilot agent mode to add a validation check. Invalid ISO timestamps should return `400` with `{ error: "...", code: "VALIDATION_ERROR" }`.
3. Write a test: `it('returns 400 when timestamp is not a valid ISO date')`.
4. Use **`/code-review`** to verify your fix covers the edge cases.

## Codebase at a glance

| File | Purpose |
|---|---|
| `src/routes/energy.ts` | All Express route handlers |
| `src/services/EnergyService.ts` | In-memory state — `Map<string, House>` and `Map<string, EnergyReading>` |
| `src/types/Energy.ts` | TypeScript types: `House`, `EnergyReading`, `CreateReadingDto` |
| `src/middleware/errorHandler.ts` | Global error handler — produces `500` responses |
| `tests/energy.test.ts` | Jest + supertest test suite |

## Error shape

All error responses use:

```json
{ "error": "Human-readable message", "code": "SCREAMING_SNAKE_CASE" }
```

## HTTP conventions

| Status | Meaning |
|---|---|
| `200` | Success with body |
| `201` | Resource created |
| `204` | Success, no body (delete) |
| `400` | Validation error |
| `404` | Resource not found |
| `500` | Unhandled server error |
