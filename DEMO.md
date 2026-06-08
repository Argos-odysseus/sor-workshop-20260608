# Knowit AI Workshop Demo

This repo is shaped for a short live showcase: one frontend flow, one legacy renovation story, and one API feature slice with tests.

## Starter State

- Block A (`vibe-coding/app`) starts with four seeded Gardermoen parking zones and two bookings.
- Block B (`renovation/app`) starts from a deliberately messy Express gym API and now ends as strict TypeScript with services and tests.
- Block C (`agent/app`) starts with three houses and 24 seeded hourly readings for `house-001`.

## Acceptance Criteria

### Block A — Parking Frontend

- Select a parking zone.
- Enter a plate number in `AB12345` format.
- Choose arrival and departure dates.
- See a price estimate before submitting.
- Submit and see the booking appear in the active booking list.
- Cancel a booking and see availability update.

### Block B — Renovated Gym API

- Express app exports separately from server startup.
- Routes return consistent `{ error, code }` responses.
- Member creation validates required fields, email, known plan, duplicate id, and join date.
- Check-ins validate member existence, active status, date, and weekly plan limits.
- Billing uses the real plan map and named constants.
- Tests cover route behavior and service logic with deterministic reset hooks.

### Block C — Energy API

- `GET /houses/:id/readings?from=<ISO>&to=<ISO>` filters readings inclusively.
- `GET /houses/:id/readings/summary` returns `{ total, average, count, dailyAverages }`.
- Invalid timestamps return `400` with `VALIDATION_ERROR`.

## Commands

```bash
cd vibe-coding/app
npm install
npm run build
```

```bash
cd renovation/app
npm install
npm run build
npm test -- --coverage --runInBand
```

```bash
cd agent/app
npm install
npm run build
npm test -- --runInBand
```

```bash
git diff --check
```

## Demo Script

### Block A

```bash
cd vibe-coding/app
npm run dev
```

Open `http://localhost:3000`.

1. Click `Express - Terminalparking`.
2. Enter `NO12345`.
3. Choose arrival tomorrow and departure a few days later.
4. Confirm that the estimate updates.
5. Submit the booking.
6. Confirm the new booking appears.
7. Click `Avbestill` and confirm it disappears.

### Block B

```bash
cd renovation/app
npm run dev
```

The demo server binds to `127.0.0.1:4000` and is intended for local workshop use only. It exposes seeded in-memory data and unauthenticated mutations for the exercise; do not run it as a network-facing service.

Show before-after contrast from `README.md`: legacy JS had no tests, weak validation, inconsistent errors, and hardcoded billing. The renovated app has strict TypeScript, service modules, deterministic tests, and consistent errors.

Example requests:

```bash
curl http://127.0.0.1:4000/members/m1/billing
curl -X POST http://127.0.0.1:4000/members/m2/checkin \
  -H 'Content-Type: application/json' \
  -d '{"date":"2026-06-08T09:00:00.000Z"}'
curl -X POST http://127.0.0.1:4000/members/missing/checkin \
  -H 'Content-Type: application/json' \
  -d '{"date":"2026-06-08T09:00:00.000Z"}'
```

### Block C

```bash
cd agent/app
npm run dev
```

Example requests:

```bash
curl 'http://localhost:8000/houses/house-001/readings'
curl 'http://localhost:8000/houses/house-001/readings/summary'
curl 'http://localhost:8000/houses/house-001/readings?from=2026-06-05T00:00:00.000Z&to=2026-06-06T00:00:00.000Z'
curl -X POST http://localhost:8000/houses/house-001/readings \
  -H 'Content-Type: application/json' \
  -d '{"timestamp":"not-a-date","kwh":1.5}'
```

## Verification Evidence

- Block A build passed.
- Block B build passed, 30 Jest tests passed, and coverage reached 100% statements, branches, functions, and lines.
- Block C build passed and 25 Jest tests passed.
- `git diff --check` passed.

## Known Limitations

- Block A uses in-memory React state for the workshop demo; no backend, authentication, payments, maps, or persistence layer was added.
- Block B remains an in-memory API by design; no database or production auth layer was added.
- Block C uses seeded in-memory Maps; no database, external meter ingestion, or deployment configuration was added.
