import React from 'react';
import { LayoutPanelLeft } from 'lucide-react';

function Toolbar({ showNotesList, onToggleSidebar, styles }) {
  return (
    <div className={styles.editorControls}>
      <button
        className={styles.toggleSidebarBtn}
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
