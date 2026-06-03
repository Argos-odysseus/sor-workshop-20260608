# Block A — Vibe Coding

**Gardermoen Parkering** — a parking booking site for Oslo Airport.

## What this is

A working React + TypeScript frontend with four parking zones (P1, P2, P3, EXPRESS), a booking form, and a booking list with cancellation. All state is in-memory — no backend.

## Start the app

```bash
cd block-a-vibe-coding/app
npm install
npm run dev
# App at http://localhost:3000
```

## Your task

Extend the app using **vibe coding** — describe what you want in plain language and let Copilot build it.

Suggestions (pick any, or invent your own):

- **Price estimate** — show total cost when a user fills in arrival/departure dates
- **Date validation** — prevent departure before arrival, or arrival in the past
- **Filter/sort zones** — by price, distance, or availability
- **Availability countdown** — highlight zones with fewer than 10 spots remaining
- **Booking confirmation** — show a summary modal before confirming
- **Persistent state** — save bookings to `localStorage` so they survive a page refresh

## How to vibe code

1. Open **Copilot Chat** and switch to **Agent mode**.
2. Describe what you want in one or two sentences, e.g. *"Add a price estimate below the departure date field that shows total cost based on days × zone price"*.
3. Review what Copilot does. Accept or adjust.
4. Repeat — build up features incrementally.

## Codebase at a glance

| File | Purpose |
|---|---|
| `src/App.tsx` | Root component — wires zones, bookings, and form together |
| `src/hooks/useBookings.ts` | All state: zones, bookings, `addBooking`, `cancelBooking` |
| `src/components/ZoneCard.tsx` | Displays a single parking zone |
| `src/components/BookingForm.tsx` | Form for new bookings |
| `src/components/BookingList.tsx` | List of active bookings with cancel |
| `src/types/Booking.ts` | TypeScript types: `Booking`, `ParkingZone`, `ZoneId` |

## Project conventions

- **Function components + hooks only** — no class components
- **Tailwind utility classes only** — no inline `style` props, no separate CSS files
- Fetch/derive data in **custom hooks**, not directly in components
- **TypeScript strict mode** — no `any`
