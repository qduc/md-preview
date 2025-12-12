import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Editor from './Editor.jsx';
import styles from '../styles/markdown-viewer.module.css';

describe('Editor Component', () => {
  it('renders the editor with placeholder', () => {
    render(
      <Editor
        value=""
        onChange={() => {}}
        placeholder="Start typing..."
        styles={styles}
      />
    );
    expect(screen.getByPlaceholderText('Start typing...')).toBeInTheDocument();
  });

  it('displays the provided value', () => {
    render(
      <Editor
        value="# Hello World"
        onChange={() => {}}
        placeholder="Start typing..."
        styles={styles}
      />
    );
    expect(screen.getByDisplayValue('# Hello World')).toBeInTheDocument();
  });

  it('applies custom width when provided', () => {
    const { container } = render(
      <Editor
        value=""
        onChange={() => {}}
        placeholder="Start typing..."
        styles={styles}
        editorWidth={75}
      />
    );
    // Check if the style attribute contains the expected CSS variable
    const editorElement = container.querySelector(`[style*="--editor-width"]`);
    expect(editorElement).toBeInTheDocument();
    expect(editorElement.getAttribute('style')).toContain('--editor-width: 75%');
  });

  it('uses default width when not provided', () => {
    const { container } = render(
      <Editor
        value=""
        onChange={() => {}}
        placeholder="Start typing..."
        styles={styles}
      />
    );
    // Check if the style attribute contains the expected CSS variable
    const editorElement = container.querySelector(`[style*="--editor-width"]`);
    expect(editorElement).toBeInTheDocument();
    expect(editorElement.getAttribute('style')).toContain('--editor-width: 50%');
  });
});