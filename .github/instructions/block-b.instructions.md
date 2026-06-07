---
applyTo: renovation/**
---

## Block B Conventions (Code Renovation)

- Start with **vanilla JavaScript (CommonJS)**. Do not introduce TypeScript or ES modules until Stage 2 (Modernize).
- The codebase intentionally contains bugs, magic numbers, duplicated logic, and missing validation. Do not fix issues during Stage 1 (Understand) — only document them.
- Use Copilot Chat **Ask mode** for Stage 1 (explain code). Use **Agent mode** for Stage 2 (modernize) and Stage 3 (refactor).
- All refactored code must use **strict TypeScript**, `const`/`let`, `async/await`, and named exports.
- Test runner is **Jest** with **ts-jest**. Tests live in `tests/`. Reach 100% coverage on the refactored code.
- Error responses must use `{ error: string; code: string }` shape. Screaming-snake-case codes (`MEMBER_NOT_FOUND`, `VALIDATION_ERROR`, `PLAN_LIMIT_EXCEEDED`).
- Extract business logic into service modules (`src/services/`). Route handlers must be thin — validation and logic in services.
