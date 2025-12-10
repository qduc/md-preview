# Repository Guidelines

## Project Structure & Module Organization
- `src/main.jsx` boots React into `#root`; `src/App.jsx` routes to `MarkdownViewer`.
- `src/markdown-viewer.jsx` holds the note editor/preview logic, inline styles, and localStorage interactions under the `markdown-notes` key.
- `src/index.css` contains global Vite starter styles (body sizing, color scheme); adjust or remove if overriding in components.
- `public/` hosts static assets served as-is; `src/assets/` is for imported images/icons.
- `index.html` is the Vite entry shell; avoid hardcoding assets outside `/src` unless truly static.

## Build, Test, and Development Commands
- `npm install` fetches dependencies.
- `npm run build` creates a production bundle in `dist/`.
- `npm run lint` runs ESLint via the flat config; fix warnings before PRs.

## Coding Style & Naming Conventions
- Use React function components with hooks; keep components in PascalCase (`MarkdownViewer`), helpers/constants in camelCase/SCREAMING_SNAKE_CASE.
- Prefer 2-space indentation, single quotes, and trailing semicolons where files already use them; match surrounding style.
- ESLint extends `@eslint/js` plus React hooks/refresh rules; `no-unused-vars` ignores ALL_CAPS values. Run lint before pushing.
- Keep inline styles scoped; use CSS classes in kebab-case if adding shared styles.

## Testing Guidelines
- No automated test suite yet; rely on `npm run lint` and manual checks in the browser.
- Validate flows: creating, switching, deleting notes; markdown rendering (headings, lists, code blocks); localStorage persistence across reloads.
- If adding tests, favor Vite-friendly tools (e.g., Vitest + React Testing Library) and colocate specs near components.

## Commit & Pull Request Guidelines
- Write concise, present-tense commits (e.g., "Add sidebar toggle logic"); keep one logical change per commit when possible.
- PRs should include a summary, linked issues (if any), screenshots/gifs for UI changes, and steps to verify (`npm run lint`, `npm run dev` smoke check).
- Note any data-impacting changes to localStorage keys or note schema in the PR description.

## Security & Configuration Tips
- Do not store secrets; everything runs client-side. Environment values intended for the client must be prefixed with `VITE_`.
- Local notes live in `localStorage`; be mindful when debugging to avoid exposing personal data in screenshots or logs.
