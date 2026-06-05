# Copilot Instructions

## General

- Be concise but clear. Use bullet points, tables, and code snippets where appropriate.

## Code Conventions

- TypeScript strict mode everywhere. Never use `any`; use `unknown` with a type guard.
- Named exports only. Default exports for framework-required React components only.
- `const` over `let`. Never `var`.
- File naming: PascalCase for classes and React components (`EnergyService.ts`, `ZoneCard.tsx`); camelCase for modules, hooks, and routes (`energy.ts`, `useBookings.ts`).
- `async/await` over `.then()` chains.
- No `console.log` or `console.error` in committed code.
- Conventional commits: `feat:`, `fix:`, `test:`, `refactor:`, `chore:`, `docs:`. Subject ≤72 chars, imperative mood.
- No `node_modules`, `dist`, or `.env` in commits.

## Git

- Branches: `feat/<desc>` or `fix/<desc>`. PRs only — no direct commits to `main`.
- Squash if more than three fixup commits.
