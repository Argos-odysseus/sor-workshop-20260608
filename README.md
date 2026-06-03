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
├── .copilot/skills/       ← reusable Copilot skills (/code-review, /test-generation)
├── .github/
│   ├── agents/             ← custom agents (@spec-interrogator, @pair-programmer)
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

The `.copilot/skills/` folder contains reusable skills — invoke them as slash commands in Copilot Chat:

| Skill | Command | When to use |
|---|---|---|
| `code-review` | `/code-review` | After implementing — checklist review against the spec (✅ / ⚠️ / ❌) |
| `test-generation` | `/test-generation` | When adding coverage — generate meaningful tests with edge cases |

## Copilot Agents

The `.github/agents/` folder contains custom agents — switch to them from the agent picker in Copilot Chat:

| Agent | When to use |
|---|---|
| `@spec-interrogator` | Stage 0 — multi-turn interview to produce a frozen feature spec before coding |
| `@pair-programmer` | Stage 1 — Socratic navigator that asks technical questions about your implementation (never writes code) |

## Copilot Tips

- Open `.github/copilot-instructions.md` to see the project conventions Copilot has been given — understanding these helps you write better prompts.
- Use the **agent picker** in Copilot Chat to switch between `@spec-interrogator` (spec work) and `@pair-programmer` (implementation thinking).
- Type `/` in Copilot Chat to see available skills like `/code-review` and `/test-generation`.
- When asking Copilot to implement a feature, include the acceptance criteria and the error format (`{ error, code }`) in your prompt to get output that matches the project style on the first attempt.
