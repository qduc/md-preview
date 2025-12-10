import React from 'react';
import { LayoutPanelLeft } from 'lucide-react';

function Toolbar({ showNotesList, onToggleSidebar }) {
  return (
    <div className="editor-controls">
      <button
        className="toggle-sidebar-btn"
        onClick={onToggleSidebar}
        aria-pressed={showNotesList}
      >
        <LayoutPanelLeft size={18} />
        <span>{showNotesList ? 'Hide notes' : 'Show notes'}</span>
      </button>
    </div>
  );
}

export default Toolbar;
