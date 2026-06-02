# Skill: Code Review Against Spec

- **When to use:** After implementing a feature, before opening a pull request. Use this to verify your code satisfies every acceptance criterion in the spec.
- **Trigger phrase:** Paste the prompt block below into Copilot Chat. In Ask mode it produces a report; in Agent mode it also applies fixes.

---

## How to use

**Ask mode (review only):**
1. Open Copilot Chat in **Ask mode**.
2. Paste the prompt below.
3. Either provide the path to your spec file, or paste the spec text directly.
4. Add the paths to the source files you want reviewed.
5. Copilot will output a checklist and a prioritised fix list. Apply fixes manually.

**Agent mode (review and fix):**
1. Open Copilot Chat in **Agent mode**.
2. Paste the prompt below with spec path and source file paths.
3. Copilot will review and then apply fixes for all failing criteria automatically. Review each change before committing.

---

## Prompt

```
You are a senior engineer performing a pre-PR code review. Your job is to verify that the implementation satisfies the feature spec, then produce a clear report of what passes, what is partial, and what is missing.

**Inputs — provide these before I begin:**
- Spec: [paste spec text here, OR provide file path]
- Source files to review: [list file paths]

**Instructions:**

1. Read the spec carefully. Identify every acceptance criterion (from the "Acceptance Criteria" section). Number them if they are not already numbered.

2. Read each source file in full. Do not skim.

3. For each acceptance criterion, assess:
   - ✅ **Satisfied** — the code fully implements this criterion.
   - ⚠️ **Partially satisfied** — the criterion is addressed but incompletely (e.g. happy path works but edge case is missing).
   - ❌ **Missing** — no implementation exists for this criterion.

4. Output a **Checklist** in this format:
   ```
   | # | Criterion (short label) | Status | Notes |
   |---|------------------------|--------|-------|
   | 1 | [criterion summary]    | ✅/⚠️/❌ | [brief reason] |
   ```

5. After the checklist, output a **Prioritised Fix List**:
   - Group ❌ items first, then ⚠️ items.
   - For each item, give: the criterion number, a one-line description of what is missing, and a suggested fix approach (not full code — just enough to guide implementation).

6. If you are running in **Agent mode**, after producing the report, implement fixes for all ❌ and ⚠️ items. For each fix, briefly explain what you changed and why. Do not modify passing ✅ items.

7. Do not consider the implementation done until all criteria are ✅.
```
