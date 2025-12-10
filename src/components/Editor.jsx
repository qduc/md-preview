import React from 'react';

function Editor({ value, onChange, placeholder }) {
  return (
    <div className="pane">
      <div className="pane-label">Editor</div>
      <textarea
        className="editor"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

export default Editor;
