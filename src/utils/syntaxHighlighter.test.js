import { describe, it, expect } from 'vitest';
import { highlightMarkdown } from './syntaxHighlighter';

describe('highlightMarkdown', () => {
  it('should highlight headings', () => {
    const input = '# Hello';
    const output = highlightMarkdown(input);
    expect(output).toContain('md-heading');
    expect(output).toContain('# Hello');
  });

  it('should highlight bold text', () => {
    const input = '**Bold**';
    const output = highlightMarkdown(input);
    expect(output).toContain('md-bold');
    expect(output).toContain('**Bold**');
  });

  it('should highlight italic text', () => {
    const input = '*Italic*';
    const output = highlightMarkdown(input);
    expect(output).toContain('md-italic');
    expect(output).toContain('*Italic*');
  });

  it('should highlight inline code', () => {
    const input = '`code`';
    const output = highlightMarkdown(input);
    expect(output).toContain('md-code');
    expect(output).toContain('`code`');
  });

  it('should highlight blockquotes', () => {
    const input = '> Quote';
    const output = highlightMarkdown(input);
    expect(output).toContain('md-quote');
    expect(output).toContain('&gt; Quote');
  });

  it('should escape HTML', () => {
    const input = '<script>';
    const output = highlightMarkdown(input);
    expect(output).toContain('&lt;script&gt;');
  });

  it('should handle trailing newlines', () => {
    const input = 'Hello\n';
    const output = highlightMarkdown(input);
    expect(output).toContain('<br>');
  });

  it('should handle empty string', () => {
    const input = '';
    const output = highlightMarkdown(input);
    expect(output).toBe('');
  });
});
