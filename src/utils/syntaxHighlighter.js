export function highlightMarkdown(text) {
  // Escape HTML first
  let result = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Headings: wrap group 2 in <span class="md-heading">...</span>
  result = result.replace(/(^|\n)(#{1,6}\s+.*)/g, '$1<span class="md-heading">$2</span>');

  // Bold: wrap match in <span class="md-bold">...</span>
  result = result.replace(/\*\*([^*]+)\*\*/g, '<span class="md-bold">**$1**</span>');
  result = result.replace(/__([^_]+)__/g, '<span class="md-bold">__$1__</span>');

  // Italic: wrap match in <span class="md-italic">...</span>
  // Use lookarounds to ensure we don't match inside bold markers (e.g. ** or __)
  result = result.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<span class="md-italic">*$1*</span>');
  result = result.replace(/(?<!_)_([^_]+)_(?!_)/g, '<span class="md-italic">_$1_</span>');

  // Inline Code: wrap match in <span class="md-code">...</span>
  result = result.replace(/`([^`]+)`/g, '<span class="md-code">`$1`</span>');

  // Blockquote: wrap group 2 in <span class="md-quote">...</span>
  // Match &gt; because HTML is escaped first
  result = result.replace(/(^|\n)(&gt;.*)/g, '$1<span class="md-quote">$2</span>');

  // Trailing Newline
  if (text.endsWith('\n')) {
    return result + '<br>';
  }

  return result;
}
