# Repository Guidelines

This repository is a Vite-powered React markdown editor/previewer with local note storage. Use the guidelines below to contribute quickly and safely.

## Project Structure & Module Organization
- App entry: `src/main.jsx` bootstraps `src/App.jsx`, which renders `src/markdown-viewer.jsx`.
- UI components: `src/components/` (Sidebar, Toolbar, Editor, Preview); shared styles in `src/styles/` with CSS modules.
- Logic & utilities: `src/hooks/useNotesStorage.js` (localStorage CRUD) and `src/utils/markdown.js` (marked + DOMPurify + highlight.js).
- Assets live in `src/assets/`; static files in `public/`. Tests sit next to code as `*.test.js`; vitest setup is in `src/test/setup.js`.

## Build, Test, and Development Commands
- `npm run build`: Production bundle into `dist/`.
- `npm run lint`: ESLint (flat config) over the repo.
- `npm test`: Vitest unit suite; add `-- ui` or `--coverage` via `npm run test:ui` / `npm run test:coverage`. Target a file with `npm test -- src/utils/markdown.test.js`.

Avoid running `npm run dev` to verify your works; use `npm run build` and `npm test` instead to catch issues early.

## Coding Style & Naming Conventions
- JavaScript/JSX with ES modules; prefer function components and hooks. Use camelCase for variables/functions, PascalCase for components, kebab-case for CSS module files.
- Indentation is 2 spaces; prefer single quotes and trailing semicolons as seen in existing files.
- ESLint extends `@eslint/js` recommended plus React Hooks/React Refresh; address lint warnings before opening a PR. Avoid unused vars (allowed constants matching `^[A-Z_]`).
- Keep components focused; shared logic goes into `src/hooks/` or `src/utils/`.

## Testing Guidelines
- Framework: Vitest + Testing Library + jsdom; matcher extras come from `@testing-library/jest-dom` via `src/test/setup.js`.
- Place tests alongside source as `*.test.js` (e.g., `src/hooks/useNotesStorage.test.js`). Mirror file names and describe behaviors, not implementations.
- Cover new branches and error handling (e.g., malformed localStorage data). For rendering output, assert on text and roles rather than DOM structure when possible.

## Security & Configuration Tips
- Rendered HTML is sanitized with DOMPurify; keep that path intact when touching `src/utils/markdown.js`.
- Notes persist in `localStorage`; avoid adding secrets or remote data-fetching without configuration review. When introducing new dependencies, prefer audited packages and update `package-lock.json`.
