import React, { useRef } from 'react';
import { highlightMarkdown } from '../utils/syntaxHighlighter';

function Editor({ value, onChange, placeholder, styles, scrollRef, onScroll, editorWidth = 50 }) {
  const preRef = useRef(null);

  const handleScroll = (e) => {
    if (preRef.current) {
      preRef.current.scrollTop = e.target.scrollTop;
      preRef.current.scrollLeft = e.target.scrollLeft;
    }
    if (onScroll) {
      onScroll(e);
    }
  };

  const highlightedCode = highlightMarkdown(value || '');

  return (
    <div className={styles.pane} style={{ '--editor-width': `${editorWidth}%` }}>
      <div className={styles.paneLabel}>Editor</div>
      <div className={styles.editorContainer}>
        <pre
          ref={preRef}
          className={styles.editorOverlay}
          aria-hidden="true"
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
        <textarea
          ref={scrollRef}
          onScroll={handleScroll}
          className={styles.editor}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          spellCheck="false"
        />
      </div>
    </div>
  );
}

export default Editor;
