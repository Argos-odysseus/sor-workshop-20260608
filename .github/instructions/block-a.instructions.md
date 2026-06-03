---
applyTo: block-a-vibe-coding/**
---

## Block A Conventions (React + Tailwind)

- Components must be **function components using hooks only**. No class components.
- All styling must use **Tailwind utility classes**. Do not write inline `style` props or separate CSS files unless you are adding a Tailwind `@layer` extension.
- Place all components in `src/components/`. Group by feature in sub-directories when a feature has more than two files.
- Keep components small and focused: if a component exceeds ~100 lines, consider splitting it.
- Fetch data inside custom hooks (e.g. `useHouses`), not directly inside components.
