---
name: dead-code-scanner
description: "Use when: clean up unused code, find dead exports, audit unused files, dead code report. Scans block-a and block-b source trees and produces a structured report."
---

# Dead Code Scanner

## When to Use
- Auditing for unused exports or unreachable files
- Cleaning up after refactors
- Pre-PR hygiene checks

## Procedure

1. List all `.ts` / `.tsx` source files under:
   - `block-a-vibe-coding/app/src`
   - `block-b-agent-build/app/src`

2. For every named export in each file, search the workspace for import references to it.

3. Flag:
   - **Unused exports** — named exports with zero import sites
   - **Unreachable files** — files not imported and not an entry point (`main.tsx`, `index.ts`)
   - **TODOs / FIXMEs** — grep for `TODO` and `FIXME` in source files

4. Output the report in this exact format — nothing else:
