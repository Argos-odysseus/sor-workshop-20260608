# Copilot Instructions

## Code Conventions

- TypeScript strict mode everywhere. Never use `any`; use `unknown` with a type guard.
- Named exports only. Default exports for framework-required React components only.
- `const` over `let`. Never `var`.
- Conventional commits: `feat:`, `fix:`, `test:`, `refactor:`, `chore:`, `docs:`. Subject ≤72 chars, imperative mood.
- No `node_modules`, `dist`, or `.env` in commits.

## Git

- Branches: `feat/<desc>` or `fix/<desc>`. PRs only — no direct commits to `main`.
- Squash if more than three fixup commits.
