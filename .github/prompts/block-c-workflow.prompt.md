---
description: Block C agentic workflow — Stage 0 through Stage 2 with testing rules and AI prompting guidance
---

## Agentic Workflow

Block C is a spec-first exercise. The starter API has basic CRUD for houses and readings, but three features are **intentionally missing** — your job is to spec them with AI, then implement them.

### What is working

| Endpoint | Description |
|---|---|
| `GET /houses` | List all houses (3 pre-seeded) |
| `GET /houses/:id` | Get a single house |
| `GET /houses/:id/readings` | Get all readings for a house (24 pre-seeded for house-001) |
| `POST /houses/:id/readings` | Add a reading (`{ timestamp, kwh }`) |
| `DELETE /readings/:id` | Delete a reading |

### What is missing — your job

1. **Date range filtering** — `GET /houses/:id/readings?from=<ISO>&to=<ISO>` returns only readings within the range. Both params are optional; omit one to leave that side unbounded. 404 for unknown house.
2. **Aggregation / summary** — `GET /houses/:id/readings/summary` returns `{ total, average, count }` across all readings for a house. 404 for unknown house. House with no readings returns zeros.
3. **Daily averages** — extend the summary to include `dailyAverages: [{ date, total, average, count }]` grouped by calendar day.

### Codebase map

| File | Purpose |
|---|---|
| `src/routes/energy.ts` | Express route handlers — follow the existing pattern |
| `src/services/EnergyService.ts` | In-memory state — `Map<string, House>` and `Map<string, EnergyReading>` |
| `src/types/Energy.ts` | Types: `House`, `EnergyReading`, `CreateReadingDto` |
| `src/middleware/errorHandler.ts` | Global error handler — produces `500` responses |
| `tests/energy.test.ts` | Jest + supertest — uses real in-memory store, no mocking |

**Error shape:** `{ error: string; code: 'HOUSE_NOT_FOUND' | 'READING_NOT_FOUND' | 'VALIDATION_ERROR' }`
**HTTP codes:** `200` (success), `201` (created), `204` (deleted), `400` (validation), `404` (not found), `500` (server error)

---

### Stage 0 — Specify

Use the **@spec-interrogator** agent to produce a frozen feature spec before writing code. It interviews you through four rounds (Goal/Users → Data/Behaviour → Edge cases → Success/Scope) and outputs a structured spec. Run one spec per feature — don't try to spec all three at once.

**Starter prompts** — copy and adapt these:

**Date range filtering:**
```
I need to add date range filtering to GET /houses/:id/readings.
It should accept optional query params: ?from=<ISO timestamp>&to=<ISO timestamp>.
When both are provided, return only readings whose timestamp falls between from and to (inclusive).
When only one is provided, filter on that side only. When neither, return all readings (existing behavior).
Return 404 if the house does not exist.
Follow the existing error shape: { error: string, code: string }.
```

**Summary + daily averages:**
```
I need a GET /houses/:id/readings/summary endpoint that aggregates readings for a house.
Return: { total: number, average: number, count: number, dailyAverages: Array<{ date: string, total: number, average: number, count: number }> }.
Daily averages are grouped by calendar day (YYYY-MM-DD) from the timestamp.
Return 404 if the house does not exist. For a house with no readings, return { total: 0, average: 0, count: 0, dailyAverages: [] }.
Follow the existing patterns in energy.ts and EnergyService.ts. Add tests for all cases.
```

### Stage 1 — Implement

Open Copilot Chat in **Agent mode** and implement the spec. Use **@pair-programmer** alongside for design decisions — it asks technical questions without writing code.

**Starter prompts** — copy and adapt these:

**Date range filtering:**
```
Implement date range filtering on GET /houses/:id/readings.
Add optional from and to query params (ISO strings). Filter readings whose timestamp falls within the range.
Add a service method for the filtering. Add tests covering:
- both params provided → returns filtered readings
- only from provided → returns readings after from
- only to provided → returns readings before to
- neither param → returns all readings (backward compatible)
- unknown house → 404
- valid ISO but no readings match → returns []
Follow the existing patterns: errorHandler for 500s, { error, code } shape for errors, supertest with real store for tests.
```

**Summary + daily averages:**
```
Add GET /houses/:id/readings/summary to the energy router.
Compute total kwh, average kwh, count, and dailyAverages grouped by calendar day.
Add a service method that returns the aggregate object. Add tests covering:
- house with readings → returns correct total, average, count, and daily breakdown
- house with no readings → returns { total: 0, average: 0, count: 0, dailyAverages: [] }
- unknown house → 404
- dailyAverages entries have shape { date, total, average, count }
Follow existing patterns. Use the real in-memory store in tests — no mocking energyService.
```

### Stage 2.5 — Self-review

After implementing a feature, use the **/code-review** skill to check your implementation against the spec.

> Trigger prompt: *"Review my implementation. Check that it handles all edge cases from the spec. List each requirement with ✅, ⚠️, or ❌."*

Fix every ❌ and ⚠️ before continuing.

### Stage 2 — Branch and commit

1. Create a branch: `feat/<short-description>`.
2. Stage all changes and commit with a conventional commit message.
3. Open a pull request against `main`.

```bash
git checkout -b feat/<short-description>
git add .
git commit -m "feat: <what you built>"
```

---

## Testing Rules

- Test files live in `tests/` alongside `src/`. The glob is `**/tests/**/*.test.ts`.
- Each test file maps to one route or service module (e.g. `energy.test.ts`).
- New behaviour must always be accompanied by tests. This is not optional.
- Do not mock `energyService` in route tests — use the real in-memory store. Reset state by creating resources within each test.
- Test names should read as plain English sentences: `it('returns 404 when the house does not exist')`.

---

## Tips

- **One feature at a time.** Spec → implement → review → commit. Then move to the next. Don't batch all three into one giant PR.
- **Run tests after every change.** `npm test` in `agent/app/`. Catch regressions immediately — the existing CRUD tests must keep passing.
- **Use @pair-programmer for design decisions.** When unsure about where logic should live (route vs. service) or how to structure the daily aggregation, ask it before generating code.
- **Reference existing code explicitly.** Tell Copilot "follow the same pattern as the GET /houses/:id route" or "add a method to energyService like getReadingsForHouse but with filtering." This keeps output consistent.
- **Reject and re-prompt freely.** If the AI output is wrong, don't fix it manually — re-describe more precisely and regenerate.
- **Bonus bug:** The `POST /houses/:id/readings` endpoint accepts invalid ISO timestamps (e.g. `"not-a-date"` returns 201). See the README for a guided exercise to find and fix it with AI.
