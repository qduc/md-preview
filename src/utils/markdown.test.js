import { describe, it, expect } from 'vitest';
import { renderMarkdown } from './markdown';

describe('renderMarkdown', () => {
  describe('Headings', () => {
    it('should render h1 headings', () => {
      const result = renderMarkdown('# Heading 1');
      expect(result).toContain('<h1');
      expect(result).toContain('Heading 1');
    });

    it('should render h2 headings', () => {
      const result = renderMarkdown('## Heading 2');
      expect(result).toContain('<h2');
      expect(result).toContain('Heading 2');
    });

    it('should render h3 headings', () => {
      const result = renderMarkdown('### Heading 3');
      expect(result).toContain('<h3');
      expect(result).toContain('Heading 3');
    });
  });

  describe('Text formatting', () => {
    it('should render bold text with **', () => {
      const result = renderMarkdown('**bold text**');
      expect(result).toContain('<strong>');
      expect(result).toContain('bold text');
    });

    it('should render bold text with __', () => {
      const result = renderMarkdown('__bold text__');
      expect(result).toContain('<strong>');
      expect(result).toContain('bold text');
    });

    it('should render italic text with *', () => {
      const result = renderMarkdown('*italic text*');
      expect(result).toContain('<em>');
      expect(result).toContain('italic text');
    });

    it('should render italic text with _', () => {
      const result = renderMarkdown('_italic text_');
      expect(result).toContain('<em>');
      expect(result).toContain('italic text');
    });

    it('should render strikethrough text', () => {
      const result = renderMarkdown('~~strikethrough~~');
      expect(result).toContain('<del>');
      expect(result).toContain('strikethrough');
    });

    it('should render mixed formatting', () => {
      const result = renderMarkdown('**bold _italic_ text**');
      expect(result).toContain('<strong>');
      expect(result).toContain('<em>');
    });
  });

  describe('Links', () => {
    it('should render basic links', () => {
      const result = renderMarkdown('[Link Text](https://example.com)');
      expect(result).toContain('<a');
      expect(result).toContain('href="https://example.com"');
      expect(result).toContain('Link Text');
    });

    it('should add security attributes to links', () => {
      const result = renderMarkdown('[Link](https://example.com)');
      expect(result).toContain('target="_blank"');
      expect(result).toContain('rel="noopener noreferrer"');
    });

    it('should render links with titles', () => {
      const result = renderMarkdown('[Link](https://example.com "Title")');
      expect(result).toContain('title="Title"');
    });
  });

  describe('Code', () => {
    it('should render inline code', () => {
      const result = renderMarkdown('This is `inline code` here');
      expect(result).toContain('<code class="inline-code">');
      expect(result).toContain('inline code');
    });

    it('should render code blocks without language', () => {
      const result = renderMarkdown('```\nhello world\n```');
      expect(result).toContain('<pre class="code-block">');
      expect(result).toContain('<code');
      expect(result).toContain('hello world');
    });

    it('should render code blocks with language', () => {
      const result = renderMarkdown('```javascript\nconst x = 1;\n```');
      expect(result).toContain('<pre class="code-block">');
      expect(result).toContain('language-javascript');
      expect(result).toContain('hljs-keyword');
    });

    it('should preserve whitespace in code blocks', () => {
      const result = renderMarkdown('```\n  indented\n    code\n```');
      expect(result).toContain('indented');
      expect(result).toContain('code');
    });
  });

  describe('Lists', () => {
    it('should render unordered lists', () => {
      const result = renderMarkdown('- Item 1\n- Item 2\n- Item 3');
      expect(result).toContain('<ul>');
      expect(result).toContain('<li>');
      expect(result).toContain('Item 1');
      expect(result).toContain('Item 2');
    });

    it('should render ordered lists', () => {
      const result = renderMarkdown('1. First\n2. Second\n3. Third');
      expect(result).toContain('<ol>');
      expect(result).toContain('<li>');
      expect(result).toContain('First');
      expect(result).toContain('Second');
    });

    it('should render nested lists', () => {
      const result = renderMarkdown('- Item 1\n  - Nested 1\n  - Nested 2\n- Item 2');
      expect(result).toContain('<ul>');
      expect(result).toContain('Item 1');
      expect(result).toContain('Nested 1');
    });

    it('should render task lists (GFM)', () => {
      const result = renderMarkdown('- [ ] Unchecked\n- [x] Checked');
      expect(result).toContain('<input');
      expect(result).toContain('type="checkbox"');
    });
  });

  describe('Blockquotes', () => {
    it('should render blockquotes', () => {
      const result = renderMarkdown('> This is a quote');
      expect(result).toContain('<blockquote>');
      expect(result).toContain('This is a quote');
    });

    it('should render multi-line blockquotes', () => {
      const result = renderMarkdown('> Line 1\n> Line 2\n> Line 3');
      expect(result).toContain('<blockquote>');
      expect(result).toContain('Line 1');
      expect(result).toContain('Line 2');
    });
  });

  describe('Horizontal rules', () => {
    it('should render horizontal rules with ---', () => {
      const result = renderMarkdown('---');
      expect(result).toContain('<hr');
    });

    it('should render horizontal rules with ***', () => {
      const result = renderMarkdown('***');
      expect(result).toContain('<hr');
    });

    it('should render horizontal rules with ___', () => {
      const result = renderMarkdown('___');
      expect(result).toContain('<hr');
    });
  });

  describe('Tables (GFM)', () => {
    it('should render tables', () => {
      const markdown = '| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |';
      const result = renderMarkdown(markdown);
      expect(result).toContain('<table>');
      expect(result).toContain('<thead>');
      expect(result).toContain('<tbody>');
      expect(result).toContain('<th>');
      expect(result).toContain('Header 1');
      expect(result).toContain('Cell 1');
    });
  });

  describe('Edge cases and security', () => {
    it('should handle empty string', () => {
      const result = renderMarkdown('');
      expect(result).toBe('');
    });

    it('should handle null input', () => {
      const result = renderMarkdown(null);
      expect(result).toBe('');
    });

    it('should handle undefined input', () => {
      const result = renderMarkdown(undefined);
      expect(result).toBe('');
    });

    it('should sanitize malicious script tags', () => {
      const result = renderMarkdown('<script>alert("XSS")</script>');
      expect(result).not.toContain('<script>');
      expect(result).not.toContain('alert');
    });

    it('should sanitize inline event handlers', () => {
      const result = renderMarkdown('[Click](javascript:alert("XSS"))');
      expect(result).not.toContain('javascript:');
      expect(result).not.toContain('alert');
    });

    it('should sanitize onclick attributes', () => {
      const result = renderMarkdown('<a onclick="alert(1)">Click</a>');
      expect(result).not.toContain('onclick');
    });

    it('should preserve safe HTML entities', () => {
      const result = renderMarkdown('&lt; &gt; &amp;');
      expect(result).toBeTruthy();
    });

    it('should handle special characters', () => {
      const result = renderMarkdown('Test with © ™ ® symbols');
      expect(result).toContain('Test with');
    });

    it('should handle very long content', () => {
      const longContent = 'A'.repeat(10000);
      const result = renderMarkdown(longContent);
      expect(result).toBeTruthy();
      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle malformed markdown gracefully', () => {
      const result = renderMarkdown('**unclosed bold');
      expect(result).toBeTruthy();
    });
  });

  describe('Complex mixed content', () => {
    it('should render complex document with multiple elements', () => {
      const markdown = `
# Main Title

This is a paragraph with **bold** and *italic* text.

## Subsection

Here's a list:
- Item 1
- Item 2
  - Nested item

\`\`\`javascript
const code = "example";
\`\`\`

> A quote about something important

[Link to example](https://example.com)
      `.trim();

      const result = renderMarkdown(markdown);
      expect(result).toContain('<h1');
      expect(result).toContain('<h2');
      expect(result).toContain('<strong>');
      expect(result).toContain('<em>');
      expect(result).toContain('<ul>');
      expect(result).toContain('<pre class="code-block">');
      expect(result).toContain('language-javascript');
      expect(result).toContain('<blockquote>');
      expect(result).toContain('<a');
    });
  });
});
