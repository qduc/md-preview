import React from 'react';
import { renderMarkdown } from '../utils/markdown.js';

function Preview({ content, styles, scrollRef, onScroll }) {
  return (
    <div className={styles.pane}>
      <div className={styles.paneLabel}>Preview</div>
      <div
        ref={scrollRef}
        className={styles.preview}
        onScroll={onScroll}
        dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
      />
    </div>
  );
}

export default Preview;
