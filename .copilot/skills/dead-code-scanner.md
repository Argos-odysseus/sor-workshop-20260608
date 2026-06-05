---
name: dead-code-scanner
description: "Use when: clean up unused code, find dead exports, audit unused files, dead code report. Scans vibe-coding and agent source trees and produces a structured report."
---

# Dead Code Scanner

## When to Use
- Auditing for unused exports or unreachable files
- Cleaning up after refactors
- Pre-PR hygiene checks

## Procedure

1. List all `.ts` / `.tsx` source files under:
   - `vibe-coding/app/src`
   - `agent/app/src`

2. For every named export in each file, search the workspace for import references to it.

3. Flag:
   - **Unused exports** — named exports with zero import sites
   - **Unreachable files** — files not imported and not an entry point (`main.tsx`, `index.ts`)
   - **TODOs / FIXMEs** — grep for `TODO` and `FIXME` in source files

4. Output the report in this exact format — nothing else:

```
## Dead Code Report

### Unused Exports
| File | Export | Reason |
|------|--------|--------|
| path/to/file.ts | `exportName` | No import sites found |

### Unreachable Files
| File | Reason |
|------|--------|
| path/to/file.ts | Not imported anywhere; not an entry point |

### TODOs / FIXMEs
| File | Line | Comment |
|------|------|---------|
| path/to/file.ts | 42 | TODO: replace with structured logger |

### Summary
- Unused exports: N
- Unreachable files: N
- TODOs/FIXMEs: N
```

If all three sections are empty, output:

```
## Dead Code Report

No unused exports, unreachable files, or TODO/FIXME comments found. Codebase is clean.
```
