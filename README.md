# MD Preview

A simple, client-side Markdown editor and previewer built with React and Vite. Create, edit, and manage multiple notes with live rendering and local persistence.

## Features

- **Live Markdown Preview**: Real-time rendering of Markdown as you type.
- **Note Management**: Create, switch between, and delete notes.
- **Persistent Storage**: Notes are saved to your browser's localStorage.
- **Responsive Design**: Clean interface suitable for quick note-taking and editing.

## Technologies

- React 19 (with hooks)
- Vite 7 (for development and build)
- Lucide React (for icons)
- Marked 17 (GitHub Flavored Markdown parser)
- DOMPurify 3 (XSS protection for rendered HTML)
- Vitest 4 (unit testing framework)
- Testing Library (React component testing)

## Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd md-preview
npm install
```

## Usage

Start the development server:

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173`. Start creating notes!

- **Adding Notes**: Click the "New Note" button (Plus icon).
- **Switching Notes**: Use the dropdown to select a note.
- **Editing**: Type in the textarea; the preview updates automatically.
- **Deleting Notes**: Click the trash icon next to a note.

Notes are automatically saved to localStorage, so they'll persist across browser sessions.

## Development

- **Linting**: `npm run lint` – Runs ESLint to check for code style issues.
- **Testing**: `npm test` – Runs the test suite with Vitest.
  - `npm test:ui` – Opens an interactive test UI.
  - `npm test:coverage` – Generates code coverage reports.
- **Build**: `npm run build` – Creates a production bundle in the `dist/` directory.
- **Preview**: `npm run preview` – Serves the built application locally.

## Deploy to GitHub Pages

This repo includes a GitHub Actions workflow that automatically builds and deploys the `dist/` folder to GitHub Pages whenever you push to the `main` branch.

### One-time GitHub setup

1. Push this repo to GitHub.
2. In GitHub, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.

After the first successful workflow run on `main`, your site will be available at:

- `https://<your-username>.github.io/<your-repo>/`

### Repo name / base path

Vite needs a correct `base` path for Pages (because Pages serves the site under `/<repo>/`). This project currently assumes the repo name is `md-preview`.

If your repo name is different, update `vite.config.js` to match your repository name (the `/<repo>/` part).

### Project Structure

- `src/main.jsx`: Entry point for React.
- `src/App.jsx`: Main app component, routes to MarkdownViewer.
- `src/markdown-viewer.jsx`: Core component for note editing and preview.
- `src/components/`: Reusable React components (Sidebar, Editor, Preview, Toolbar).
- `src/hooks/`: Custom React hooks (useNotesStorage).
- `src/utils/`: Utility functions (markdown rendering with marked + DOMPurify).
- `src/styles/`: CSS modules for component styling.
- `src/test/`: Test setup and configuration.
- `src/**/*.test.js`: Unit test files (61 tests covering utilities and hooks).
- `public/`: Static assets.

Follow the coding guidelines in `AGENTS.md` for contributions.

### Test Coverage

The project includes comprehensive unit tests:
- ✅ 37 tests for markdown rendering (marked + DOMPurify integration)
- ✅ 24 tests for notes storage hook (localStorage, CRUD operations, autosave)
- 🎯 All tests passing with 100% success rate

Run `npm test` to execute the test suite.

## Contributing

1. Fork the repository.
2. Create a feature branch (\`git checkout -b feature/new-feature\`).
3. Make changes, ensuring \`npm run lint\` passes.
4. Commit with descriptive messages.
5. Open a pull request with a summary, screenshots if UI changes, and verification steps.

## License

This project is private and not licensed for public use. Contact the maintainer for permissions.
