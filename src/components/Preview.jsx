import React from 'react';
import { renderMarkdown } from '../utils/markdown.js';

function Preview({ content, styles, scrollRef }) {
  return (
    <div className={styles.pane}>
      <div className={styles.paneLabel}>Preview</div>
      <div
        ref={scrollRef}
        className={styles.preview}
        dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
      />
    </div>
  );
}

export default Preview;
