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
| A — Vibe Coding | `block-a-vibe-coding/app` | React 18, TypeScript, Vite, Tailwind | Parking booking site — Gardermoen Parkering |
| B — Agent Build | `block-b-agent-build/app` | Express, TypeScript, Jest | Energy consumption API for households |
| C — Issue Pipeline | *(same as Block B)* | Express, TypeScript, Jest | Autonomous Copilot agent implements a GitHub Issue |

```
workshop-ai-dev/
├── .copilot/skills/       ← reusable Copilot prompt skills
├── .devcontainer/         ← Codespace configuration
├── .github/
│   └── copilot-instructions.md
├── block-a-vibe-coding/
├── block-b-agent-build/
└── README.md
```

## Getting Started

### Block A — Gardermoen Parkering

A parking booking site with pre-seeded zones (P1/P2/P3/EXPRESS) and bookings. Use vibe coding to extend it.

```bash
cd block-a-vibe-coding/app
npm run dev
# App available at http://localhost:3000
```

### Block B / C — Energy Consumption API

An Express REST API with houses and hourly energy readings. Basic CRUD is working; date filtering, aggregation, and summary endpoints are intentionally missing — your job is to add them using the agentic workflow.

```bash
cd block-b-agent-build/app
npm run dev      # API available at http://localhost:8000
npm test         # Run the test suite
```

## Copilot Skills

The `.copilot/skills/` folder contains reusable prompt files you can paste into Copilot Chat:

| Skill | When to use |
|---|---|
| `spec-interrogation.md` | Before implementing — let Copilot interview you to produce a frozen spec |
| `code-review.md` | After implementing — checklist review against the spec (✅ / ⚠️ / ❌) |
| `conventional-commit.md` | When staging changes — generate a well-formed commit message |
| `test-generation.md` | When adding coverage — generate meaningful tests with edge cases |

## Copilot Tips

- Open `.github/copilot-instructions.md` to see the project conventions Copilot has been given — understanding these helps you write better prompts.
- Use **Copilot Chat** (`Ctrl+Shift+I`) to ask questions about the codebase before writing code: *"What does EnergyService.getReadingsForHouse return?"*
- When asking Copilot to implement a feature, include the acceptance criteria and the error format (`{ error, code }`) in your prompt to get output that matches the project style on the first attempt.
