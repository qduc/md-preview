import React from 'react';
import { LayoutPanelLeft, ArrowLeftRight } from 'lucide-react';

function Toolbar({ showNotesList, onToggleSidebar, syncScrollEnabled, onToggleSyncScroll, styles }) {
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
      <button
        className={styles.toggleSidebarBtn}
        onClick={onToggleSyncScroll}
        aria-pressed={syncScrollEnabled}
        style={{ marginLeft: '10px' }}
      >
        <ArrowLeftRight size={18} />
        <span>Sync Scroll: {syncScrollEnabled ? 'On' : 'Off'}</span>
      </button>
    </div>
  );
}

export default Toolbar;
