# Copilot Instructions

These instructions apply to all code in this repository. Read them before generating any suggestion.

---

## Project Overview

This is a workshop monorepo demonstrating agentic and AI-assisted development workflows. It is structured around three independent blocks:

| Directory | Block | Purpose |
|---|---|---|
| `block-a-vibe-coding/app` | Block A | React + Tailwind frontend — vibe coding exercise |
| `block-b-agent-build/app` | Block B | Express + TypeScript energy consumption API — agent-build exercise |
| `block-c-*` | Block C | Extension of Block B — review and hardening exercise |

TypeScript is used throughout. There is no shared package between blocks; each has its own `package.json`.

---

## General Code Conventions

- **TypeScript strict mode is on everywhere.** Never use `any`. If you do not know the type, model it properly or use `unknown` with a type guard.
- Use **named exports** for everything. Default exports are permitted only for Next.js pages or React components that a framework requires to be default.
- Prefer **`const` over `let`**. Use `let` only when reassignment is genuinely needed. Never use `var`.
- Write **conventional commits**: `feat:`, `fix:`, `test:`, `refactor:`, `chore:`, `docs:`. Keep subject lines under 72 characters, imperative mood.
- Do not commit `node_modules`, `dist`, or `.env` files.

---

## Git Rules

- Branch naming: `feat/<short-description>` or `fix/<short-description>`.
- All work goes through pull requests. Do not commit directly to `main`.
- PR titles follow conventional commits format.
- Squash commits before merging if there are more than three fixup commits.
