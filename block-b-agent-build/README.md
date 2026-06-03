# Block B — Agent Build

**Energy Consumption API** — a REST API for tracking hourly household energy readings.

## What this is

A working Express + TypeScript API with three pre-seeded houses and 24 hourly readings for `house-001`. Basic CRUD is implemented. Several features are **intentionally missing** — your job is to add them using the agentic workflow.

## Start the API

```bash
cd block-b-agent-build/app
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
Use the **`/test-generation`** skill if you need to fill coverage gaps, then branch and commit:

```bash
git checkout -b feat/<short-description>
git add .
git commit -m "feat: <what you built>"
```

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
