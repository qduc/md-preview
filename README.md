# MD Preview

A simple, client-side Markdown editor and previewer built with React and Vite. Create, edit, and manage multiple notes with live rendering and local persistence.

## Features

- **Live Markdown Preview**: Real-time rendering of Markdown as you type.
- **Note Management**: Create, switch between, and delete notes.
- **Persistent Storage**: Notes are saved to your browser's localStorage.
- **Responsive Design**: Clean interface suitable for quick note-taking and editing.

## Technologies

- React (with hooks)
- Vite (for development and build)
- Lucide React (for icons)
- Marked (for Markdown parsing, if applicable—assuming it's used in the app based on context)

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
- **Build**: `npm run build` – Creates a production bundle in the `dist/` directory.
- **Preview**: `npm run preview` – Serves the built application locally.

### Project Structure

- \`src/main.jsx\`: Entry point for React.
- \`src/App.jsx\`: Main app component, routes to MarkdownViewer.
- \`src/markdown-viewer.jsx\`: Core component for note editing and preview.
- \`src/index.css\`: Global styles.
- \`public/\`: Static assets.
- Key dependencies: React, Lucide React, Vite.

Follow the coding guidelines in \`AGENTS.md\` for contributions.

## Contributing

1. Fork the repository.
2. Create a feature branch (\`git checkout -b feature/new-feature\`).
3. Make changes, ensuring \`npm run lint\` passes.
4. Commit with descriptive messages.
5. Open a pull request with a summary, screenshots if UI changes, and verification steps.

## License

This project is private and not licensed for public use. Contact the maintainer for permissions.
