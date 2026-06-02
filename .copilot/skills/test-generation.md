# Skill: Test Generation

- **When to use:** After implementing a module or function, when you need a meaningful test suite rather than boilerplate coverage. Also useful when adding tests to untested legacy code.
- **Trigger phrase:** Paste the prompt block below into Copilot Chat (Ask or Agent mode) and provide the file path(s) you want tested.

---

## How to use

1. Open Copilot Chat in **Ask mode** (to generate tests for manual review) or **Agent mode** (to generate and write test files automatically).
2. Paste the prompt below.
3. Provide the path(s) to the module or function you want tested.
4. Optionally paste the feature spec or a brief description of intended behaviour to help Copilot generate more accurate tests.

---

## Prompt

```
You are a senior engineer writing a test suite for the code provided. Your goal is tests that would catch real regressions — not tests that just mirror the implementation.

**Inputs — provide these before I begin:**
- File(s) to test: [list file paths]
- Spec or behavioural description (optional): [paste or reference]

**Instructions:**

1. Read the source file(s) in full. Identify every exported function, class, route handler, or component.

2. For each unit of code, identify:
   - The **happy path**: normal inputs, expected outputs.
   - **Edge cases**: empty input, boundary values, nulls, very large inputs, unexpected types.
   - **Error conditions**: invalid input, missing dependencies, network/IO failures, permission errors.

3. Write tests using the project's existing test framework:
   - **API / backend:** Jest + supertest. Import the Express app, use `supertest` for HTTP assertions.
   - **Frontend / components:** Vitest + React Testing Library. Test from the user's perspective (what they see and interact with), not implementation details.
   - If neither applies, infer the framework from existing test files in the project.

4. Follow these rules for every test:
   - Name each test with `it('should ...')` or `test('should ...')` phrasing that describes the behaviour, not the method name.
   - Do not write trivial tautological tests (e.g. "it returns the value passed to it").
   - Each test must assert something that could plausibly break if the implementation regresses.
   - Mock external dependencies (databases, HTTP calls, file system) — do not rely on live services.
   - Group related tests in `describe` blocks named after the function or behaviour being tested.

5. Output the complete test file(s). Use the naming convention `[filename].test.ts` (or `.spec.ts` if that is the project convention).

6. After the test file(s), list any behaviours you could NOT test due to missing context or untestable code structure, and briefly explain why.
```
