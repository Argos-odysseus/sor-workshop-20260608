---
description: Block B renovation workflow — Understand → Modernize → Test → Refactor
---

## Code Renovation Workflow

Block B is a reverse exercise. Instead of building new features, you start with a **deliberately messy legacy codebase** and use AI to understand, modernize, and refactor it.

The starter code is a gym membership API with four modules (`members`, `checkins`, `billing`, `routes`). It works — but barely. It has bugs, no types, no tests, duplicated logic, magic numbers, and `var` everywhere.

### Stage 1 — Understand (Ask Mode)

Before touching any code, use Copilot Chat in **Ask mode** to build a mental model of the codebase. Do this for each file:

**Explain a file:**
```
Explain what src/members.js does. What data does it hold? What functions does it export? What problems or risks do you see?
```

**Find bugs:**
```
Read src/checkins.js. Find all bugs related to the week calculation in getWeekKey. Explain each bug and how it would manifest.
```

**Trace a flow:**
```
Trace the full flow of POST /members/:id/checkin from the route handler through checkins.js. What validations are missing? What would happen if the member doesn't exist?
```

**Map the codebase:**
```
Read all files in src/ and produce a dependency graph. Which modules depend on which? Where is business logic mixed into route handlers?
```

Record your findings in a `notes.md` file. You should identify at least:
- The week calculation bug in `checkins.js`
- The hardcoded plan prices in `routes.js`
- The duplicate date-diff logic in `billing.js`
- Missing validations across all routes
- Inconsistent error response shapes

### Stage 2 — Modernize (Agent Mode)

Now convert the codebase to modern standards. Switch to **Agent mode** and work file by file:

1. **Convert to TypeScript** — rename `.js` → `.ts`, add types (`Member`, `Checkin`, `Plan`, `BillingSummary`)
2. **Convert to ES modules** — `import`/`export` instead of `require`/`module.exports`
3. **Convert to `const`/`let`** — no `var`
4. **Add `tsconfig.json`** and **`jest.config.ts`**

**Starter prompts:**

**Type the members module:**
```
Convert src/members.js to TypeScript (src/members.ts). Create a Member interface with id, name, email, plan, joinDate, active. Create a Plan interface with name, price, maxCheckins. Use ES module exports. Use const/let. Do not change the logic yet.
```

**Add project config:**
```
Add a tsconfig.json for a Node.js project targeting ES2022 with strict mode. Add a jest.config.ts that uses ts-jest and targets tests/**.test.ts. Add the necessary devDependencies to package.json.
```

### Stage 3 — Test (Agent Mode)

Before refactoring, create a safety net:

1. Write tests for the existing (still messy) code. Tests prove current behavior — bugs and all.
2. Use **supertest** for HTTP-level tests, direct imports for unit tests.

**Prompt:**
```
Read all source files in src/ and generate tests in tests/ that cover all routes and service functions. Include edge cases: missing member, invalid input, duplicate checkin. Use the existing (buggy) behavior as the expected outcome.
```

Run the tests and confirm they pass (capturing current buggy behavior). This is your safety net for refactoring.

### Stage 4 — Fix & Refactor (Agent Mode)

Now fix the bugs and refactor. Work incrementally — fix one thing, run tests, commit.

**Fix order:**

1. **Add input validation** to all routes — missing fields → 400, unknown member → 404
2. **Fix the week calculation bug** in `checkins.ts`
3. **Extract business logic** from `routes.ts` into `src/services/`
4. **Fix the hardcoded plan prices** — pass the real plans map to billing functions
5. **Add plan limit enforcement** — reject checkins when member exceeds `maxCheckins` per week
6. **Consistent error shapes** — all errors use `{ error, code }`
7. **Run `/dead-code-scanner`** to find unused exports

### Stage 5 — Review & Commit

1. Run **`/code-review`** against your own acceptance criteria
2. Run **`@pr-readiness-gate`** to verify everything builds and tests pass
3. Branch, commit, push

```bash
git checkout -b feat/refactor-gym-api
git add .
git commit -m "refactor: modernize gym membership API with TypeScript, tests, and validation"
```
