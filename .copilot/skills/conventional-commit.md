# Skill: Conventional Commit Message

- **When to use:** When you are ready to commit staged changes and want a well-formed commit message that follows the Conventional Commits specification.
- **Trigger phrase:** Paste the prompt block below into Copilot Chat (Ask mode). Copilot will read your staged diff or ask you to paste it.

---

## Prompt

```
You are helping write a commit message that follows the Conventional Commits specification (https://www.conventionalcommits.org).

**Step 1 — Get the diff**
Check if a staged diff is available in context. If not, ask the user to paste the output of `git diff --staged`.

**Step 2 — Analyse the changes**
Read the diff and determine:
- What type of change is this? Use exactly one of: feat, fix, chore, refactor, test, docs, style, perf, ci, build
- Is there a logical scope (a module, component, or area of the codebase)? Keep it short — one word or hyphenated phrase.
- What is the single most important thing this commit does? Express it as a short imperative sentence (≤72 chars), no period at the end.
- Is a body needed? Add one only if the "why" or "how" is not obvious from the subject line.
- Is there a breaking change? If yes, add a `BREAKING CHANGE:` footer.

**Step 3 — Propose the message**
Output the proposed commit message in a code block, e.g.:

```
feat(auth): add JWT refresh token rotation

Tokens are now rotated on every refresh request to limit the window
of exposure for stolen refresh tokens.
```

Then explain in one or two sentences why you chose that type and scope.

**Step 4 — Confirm**
Ask: "Does this message look right, or would you like to adjust the type, scope, or wording?"

Do not finalise until the user confirms.
```
