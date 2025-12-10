/**
 * Production-grade markdown renderer using `marked` library
 *
 * Library Choice: marked v15+ with DOMPurify
 *
 * Why marked was chosen:
 * - Lightweight bundle size (~20KB minified) - critical for client-side performance
 * - Fast parsing optimized for real-time preview scenarios
 * - Built-in GitHub Flavored Markdown (GFM) support
 * - Simple, intuitive API that's easy to configure and maintain
 * - Excellent extension system for syntax highlighting
 * - Active maintenance and security updates
 *
 * Security: DOMPurify provides robust XSS protection by sanitizing all HTML output
 * before rendering, protecting against malicious script injection, event handlers,
 * and other attack vectors.
 */

import { marked } from 'marked';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js';

// Configure marked with GitHub Flavored Markdown and security settings
marked.setOptions({
  gfm: true,              // Enable GitHub Flavored Markdown
  breaks: true,           // Convert \n to <br> (GFM line breaks)
  headerIds: true,        // Add IDs to headings for anchor links
  mangle: false,          // Don't escape autolinked email addresses
  pedantic: false,        // Don't conform to original markdown.pl quirks
});

// Custom renderer to add security attributes and styling to links
const renderer = new marked.Renderer();

// Override link rendering to add security attributes (noopener, noreferrer)
// and open external links in new tabs
const originalLinkRenderer = renderer.link.bind(renderer);
renderer.link = (href, title, text) => {
  const html = originalLinkRenderer(href, title, text);
  // Add target="_blank" and security attributes to all links
  return html.replace('<a', '<a target="_blank" rel="noopener noreferrer"');
};

// Configure code block rendering with syntax highlighting
renderer.code = ({ text, lang }) => {
  if (lang && hljs.getLanguage(lang)) {
    try {
      const highlighted = hljs.highlight(text, { language: lang }).value;
      return `<pre class="code-block"><code class="language-${lang} hljs">${highlighted}</code></pre>`;
    } catch (err) {
      console.error('Syntax highlighting error:', err);
    }
  }
  // Fallback to plain text with auto-detection
  const autoHighlighted = hljs.highlightAuto(text).value;
  return `<pre class="code-block"><code class="hljs">${autoHighlighted}</code></pre>`;
};

// Configure inline code rendering
renderer.codespan = ({ text }) => {
  return `<code class="inline-code">${text}</code>`;
};

// Apply custom renderer
marked.setOptions({ renderer });

// Configure DOMPurify for safe HTML sanitization
const purifyConfig = {
  ALLOWED_TAGS: [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'br', 'hr',
    'strong', 'em', 'del', 'code', 'pre',
    'a', 'img',
    'ul', 'ol', 'li',
    'blockquote',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'input', // For GFM task lists
  ],
  ALLOWED_ATTR: [
    'href', 'title', 'target', 'rel',
    'src', 'alt', 'style',
    'class',
    'type', 'checked', 'disabled', // For GFM task lists
  ],
  ALLOW_DATA_ATTR: false,
  ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.-]+(?:[^a-z+.-:]|$))/i,
};

/**
 * Renders markdown text to sanitized HTML
 *
 * Features:
 * - GitHub Flavored Markdown (tables, task lists, strikethrough, autolinks)
 * - Syntax highlighting support via language-* classes
 * - XSS protection through DOMPurify sanitization
 * - Safe link handling (target="_blank" with noopener/noreferrer)
 * - Code blocks and inline code with custom styling classes
 *
 * @param {string} text - Markdown text to render
 * @returns {string} Sanitized HTML string safe for dangerouslySetInnerHTML
 */
export function renderMarkdown(text) {
  if (!text) return '';

  try {
    // Parse markdown to HTML
    const rawHtml = marked.parse(text);

    // Sanitize HTML to prevent XSS attacks
    const cleanHtml = DOMPurify.sanitize(rawHtml, purifyConfig);

    return cleanHtml;
  } catch (error) {
    console.error('Markdown rendering error:', error);
    // Return escaped text as fallback
    return DOMPurify.sanitize(text);
  }
}
