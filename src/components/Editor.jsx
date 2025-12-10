import React from 'react';

function Editor({ value, onChange, placeholder, styles }) {
  return (
    <div className={styles.pane}>
      <div className={styles.paneLabel}>Editor</div>
      <textarea
        className={styles.editor}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

export default Editor;
