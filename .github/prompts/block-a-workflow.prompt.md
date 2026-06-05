---
description: Block A vibe-coding workflow — Stage 0 through Stage 2 with AI prompting guidance
---

## Vibe Coding Workflow

Block A is a vibe-coding exercise. The intentional gaps in the starter code (booking form, booking list, price estimation, validation) are the features you are expected to implement — using AI to do most of the writing.

### Stage 0 — Specify (optional but recommended)

For anything bigger than a single component, use the **@spec-interrogator** agent to produce a frozen spec before writing code. This prevents wasted effort when the AI builds the wrong thing.

> Skip Stage 0 for small additions (a button, a label, a CSS tweak) and go straight to Stage 1.

### Stage 1 — Vibe code it

Open Copilot Chat in **Agent mode** and describe what you want. Be specific about:
- What the user sees and does (not how the code works)
- Where in the UI it appears
- Any constraints (e.g. "use the existing `useBookings` hook, not new state")

**Starter prompts** — copy and adapt these:

**Booking form:**
```
Add a booking form that appears when the user clicks "Book" on a ZoneCard.
The form should collect: licence plate (text), arrival date, departure date.
Wire it up to the addBooking function in useBookings.
Close the form after a successful booking.
Use Tailwind for styling. No inline style props.
```

**Booking list:**
```
Add a booking list below the zone grid that shows all active bookings.
Each row should show: zone name, licence plate, arrival date, departure date, and a Cancel button.
The Cancel button should call cancelBooking from useBookings.
Use Tailwind for styling. Keep it as a separate component in src/components/.
```

**Price estimate:**
```
Inside the booking form, add a live price estimate that updates as the user changes arrival and departure dates.
Calculate total = days × zone.pricePerDay. Show it as "Estimated total: NOK X".
If the dates are invalid or not yet filled in, show nothing.
```

**Date validation:**
```
Add validation to the booking form:
- Arrival date cannot be in the past.
- Departure date must be after arrival date.
Show an inline error message under the relevant field when the rule is violated.
Disable the submit button while any validation error is active.
```

### Stage 2.5 — Self-review

After implementing a feature, use the **/code-review** skill to check your implementation against the spec (or against your own acceptance criteria if you skipped Stage 0).

> Trigger prompt: *"Review my booking form implementation. Check that it handles empty inputs, invalid dates, and wires correctly to useBookings. List each criterion with ✅, ⚠️, or ❌."*

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

## Tips

- **Iterate in small steps.** Build the form shell first, then add validation, then wire state. AI is better at small focused tasks than "build the whole feature at once".
- **Reference existing code.** Tell Copilot to "use the existing `useBookings` hook" or "follow the same pattern as `ZoneCard.tsx`". This keeps the output consistent.
- **Reject and re-prompt freely.** If the output is wrong, don't try to manually fix it — re-describe more precisely and regenerate.
- **Use @pair-programmer** when you're unsure about a design decision (e.g. "should this state live in the hook or the component?"). It will ask you the right questions without writing the code for you.
