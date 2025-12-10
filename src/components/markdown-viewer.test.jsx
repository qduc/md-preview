import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MarkdownViewer from '../markdown-viewer.jsx';

function setDimensions(el, { scrollHeight, clientHeight }) {
  Object.defineProperty(el, 'scrollHeight', { configurable: true, value: scrollHeight });
  Object.defineProperty(el, 'clientHeight', { configurable: true, value: clientHeight });
}

describe('MarkdownViewer sync scroll', () => {
  it('syncs scroll from editor to preview', () => {
    render(<MarkdownViewer />);
    const textarea = screen.getByPlaceholderText('Start typing your markdown here...');
    const previewLabel = screen.getByText('Preview');
    const preview = previewLabel.nextElementSibling;

    // Put a lot of content to ensure scrollable areas
    fireEvent.change(textarea, { target: { value: Array(200).fill('hello').join('\n') } });

    setDimensions(textarea, { scrollHeight: 2000, clientHeight: 200 });
    setDimensions(preview, { scrollHeight: 3000, clientHeight: 300 });

    // Simulate scrolling editor
    textarea.scrollTop = 400;
    fireEvent.scroll(textarea);

    // percentage = 400 / (2000 - 200) = 400/1800 = 0.222...
    // expected preview scrollTop = 0.222... * (3000 - 300) = 0.222... * 2700 = ~600
    const expectedPreviewTop = (400 / (2000 - 200)) * (3000 - 300);
    expect(preview.scrollTop).toBeCloseTo(expectedPreviewTop, 1);
  });

  it('syncs scroll from preview to editor', () => {
    render(<MarkdownViewer />);
    const textarea = screen.getByPlaceholderText('Start typing your markdown here...');
    const previewLabel = screen.getByText('Preview');
    const preview = previewLabel.nextElementSibling;

    // Put a lot of content to ensure scrollable areas
    fireEvent.change(textarea, { target: { value: Array(200).fill('hello').join('\n') } });

    setDimensions(textarea, { scrollHeight: 2200, clientHeight: 200 });
    setDimensions(preview, { scrollHeight: 4200, clientHeight: 400 });

    // Simulate scrolling preview
    preview.scrollTop = 800;
    fireEvent.scroll(preview);

    const expectedEditorTop = (800 / (4200 - 400)) * (2200 - 200);
    expect(textarea.scrollTop).toBeCloseTo(expectedEditorTop, 1);
  });
});
