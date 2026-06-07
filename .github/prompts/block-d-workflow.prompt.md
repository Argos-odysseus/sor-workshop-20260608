---
description: Block D issue-pipeline workflow — autonomous agents implement a GitHub Issue
---

## Issue Pipeline Workflow

Block D uses the same Energy Consumption API as Block C. The agent codebase is already implemented. Your job: create a GitHub Issue describing a feature request, then let autonomous agents implement it end-to-end.

### How it works

1. **Create a GitHub Issue** in this repo describing a new feature for the Energy API. Examples:
   - "Add a `GET /houses/:id/readings/summary` endpoint that returns total, average, and count"
   - "Add date-range filtering to `GET /houses/:id/readings?from=<ISO>&to=<ISO>`"
   - "Add input validation — reject negative kwh values with a 400 error"

2. **Let the agents work** — Copilot agents will read the issue, plan the implementation, modify the code, run tests, and open a PR.

3. **Review the PR** — check the implementation, run tests locally, and merge if it passes.

### What you'll learn

- How to write issues that agents can understand and act on
- How autonomous agents plan and implement from a spec
- How to review AI-generated PRs effectively
- The end-to-end flow from issue to merged PR without writing code yourself

After each fix, run `npm test` to confirm nothing breaks.

### Stage 5 — Review & Commit

1. Run **`/code-review`** against your own acceptance criteria
2. Run **`@pr-readiness-gate`** to verify everything builds and tests pass
3. Branch, commit, push

```bash
git checkout -b feat/refactor-gym-api
git add .
git commit -m "refactor: modernize gym membership API with TypeScript, tests, and validation"
```
