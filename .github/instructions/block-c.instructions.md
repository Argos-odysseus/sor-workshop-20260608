---
applyTo: agent/**
---

## Block C Conventions (Express API)

- The web framework is **Express**. Do not introduce other HTTP frameworks.
- State is held in **in-memory Maps** (`EnergyService`). Do not add a database or file-system persistence.
- All error responses must use the shape `{ error: string; code: string }`. The `code` field is a screaming-snake-case identifier (e.g. `HOUSE_NOT_FOUND`, `READING_NOT_FOUND`, `VALIDATION_ERROR`).
- HTTP semantics: `200` success with body, `201` resource created, `204` no body (delete), `400` validation error, `404` not found, `500` unhandled server error.
- Every new route or behaviour must have a corresponding test. Do not open a PR with untested code paths.
- The `kwh` field on a reading must always be a positive number (> 0). Reject invalid values with a 400.
- Test runner is **Jest** with **ts-jest** and **supertest**. Test files live in `tests/`. Do not mock `energyService` — use the real in-memory store.
