# AI-Assisted Development Workshop

A hands-on monorepo for learning agentic and AI-assisted development workflows with GitHub Copilot.

## Quick Start

Open this repo in a GitHub Codespace — everything installs automatically via the devcontainer.

1. Click **Code** → **Codespaces** → **Create codespace on main**.
2. Wait for the post-create command to finish installing dependencies.
3. Follow the block-specific instructions below.

## What's in the Repo

| Block | Directory | Stack | Scenario |
|---|---|---|---|
| A — Vibe Coding | `vibe-coding/app` | React 18, TypeScript, Vite, Tailwind | Parking booking site — Gardermoen Parkering |
| B — Agent Build | `agent/app` | Express, TypeScript, Jest | Energy consumption API for households |
| C — Issue Pipeline | *(same as Block B)* | Express, TypeScript, Jest | Autonomous agents implements a GitHub Issue |

```
sor-workshop-20260608/
├── .copilot/skills/       ← reusable Copilot skills (/code-review, /test-generation, /dead-code-scanner)
├── .github/
│   ├── agents/             ← custom agents (@spec-interrogator, @pair-programmer, @pr-readiness-gate)
│   ├── instructions/       ← per-block Copilot instructions (vibe-coding, agent)
│   └── copilot-instructions.md
├── vibe-coding/
├── agent/
└── README.md
```

### Root

| File | Purpose |
|---|---|
| `README.md` | This file — workshop overview, quick-start, block descriptions, and repo structure |
| `.gitignore` | Excludes build outputs, `node_modules`, env files, and IDE artifacts from version control |
| `.copilotignore` | Excludes `node_modules`, `dist`, `coverage`, and lock files from Copilot context to keep token usage low |

### `.devcontainer/`

| File | Purpose |
|---|---|
| `devcontainer.json` | Dev container config — Node.js 20, Copilot/ESLint/Prettier/Tailwind extensions, and post-create `npm install` for both app directories |

### `.github/`

| File | Purpose |
|---|---|
| `copilot-instructions.md` | Global code conventions sent to Copilot on every session — TypeScript strict mode, named exports, `const` over `let`, conventional commits, branch/PR rules |
| `agents/spec-interrogator.agent.md` | `@spec-interrogator` — multi-turn interview agent that produces a frozen feature spec before any code is written |
| `agents/pair-programmer.agent.md` | `@pair-programmer` — Socratic navigator that asks technical questions about your implementation; never writes code |
| `agents/pr-readiness-gate.agent.md` | `@pr-readiness-gate` — autonomously builds, tests, and lints; outputs a go/no-go decision before merge |
| `instructions/block-a.instructions.md` | Per-block Copilot instructions scoped to `vibe-coding/**` — React/Tailwind conventions for Block A |
| `instructions/block-b.instructions.md` | Per-block Copilot instructions scoped to `agent/**` — Express/Jest conventions for Block B |
| `prompts/block-b-workflow.prompt.md` | Reusable prompt for the Block B agentic workflow — guides Copilot through Spec → Implement → Review → Commit |

### `.copilot/skills/`

| File | Purpose |
|---|---|
| `code-review.md` | `/code-review` skill — runs a pass/warn/fail checklist of your implementation against the spec |
| `test-generation.md` | `/test-generation` skill — generates tests with real edge cases matching the project's existing test style |
| `dead-code-scanner.md` | `/dead-code-scanner` skill — finds unused exports, unreferenced files, and TODO/FIXME comments across the repo |

### `.vscode/`

| File | Purpose |
|---|---|
| `settings.json` | Workspace settings — editor formatting, Copilot inline suggestions, and language/tool configurations |

## Getting Started

### Block A — Gardermoen Parkering

A parking booking site with pre-seeded zones (P1/P2/P3/EXPRESS) and bookings. Use vibe coding to extend it.

```bash
cd vibe-coding/app
npm run dev
# App available at http://localhost:3000
```

### Block B / C — Energy Consumption API

An Express REST API with houses and hourly energy readings. Basic CRUD is working; date filtering, aggregation, and summary endpoints are intentionally missing — your job is to add them using the agentic workflow.

```bash
cd agent/app
npm run dev      # API available at http://localhost:8000
npm test         # Run the test suite
```

## Copilot Skills

The `.copilot/skills/` folder contains reusable skills — invoke them as slash commands in Copilot Chat:

| Skill | Command | When to use |
|---|---|---|
| `code-review` | `/code-review` | After implementing — checklist review against the spec (✅ / ⚠️ / ❌) |
| `test-generation` | `/test-generation` | When adding coverage — generate meaningful tests with edge cases |
| `dead-code-scanner` | `/dead-code-scanner` | Find unused exports, unreachable code, and dead branches |

## Copilot Agents

The `.github/agents/` folder contains custom agents — switch to them from the agent picker in Copilot Chat:

| Agent | When to use |
|---|---|
| `@spec-interrogator` | Stage 0 — multi-turn interview to produce a frozen feature spec before coding |
| `@pair-programmer` | Stage 1 — Socratic navigator that asks technical questions about your implementation (never writes code) |
| `@pr-readiness-gate` | Pre-merge — autonomously builds, tests, and lints; outputs a go/no-go decision |

## Copilot Tips

- Open `.github/copilot-instructions.md` to see the project conventions Copilot has been given — understanding these helps you write better prompts.
- Use the **agent picker** in Copilot Chat to switch between `@spec-interrogator` (spec work) and `@pair-programmer` (implementation thinking).
- Type `/` in Copilot Chat to see available skills like `/code-review` and `/test-generation`.
- When asking Copilot to implement a feature, include the acceptance criteria and the error format (`{ error, code }`) in your prompt to get output that matches the project style on the first attempt.
