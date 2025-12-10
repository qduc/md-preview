import React from 'react';
import { renderMarkdown } from '../utils/markdown.js';

function Preview({ content }) {
  return (
    <div className="pane">
      <div className="pane-label">Preview</div>
      <div className="preview" dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }} />
    </div>
  );
}

export default Preview;
