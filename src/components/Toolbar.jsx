import React from 'react';
import { LayoutPanelLeft, ArrowLeftRight, Moon, Sun } from 'lucide-react';

function Toolbar({ showNotesList, onToggleSidebar, syncScrollEnabled, onToggleSyncScroll, theme, onToggleTheme, styles }) {
  return (
    <div className={styles.editorControls}>
      <button
        className={styles.toggleSidebarBtn}
        onClick={onToggleSidebar}
        aria-pressed={showNotesList}
      >
        <LayoutPanelLeft size={16} />
        <span>{showNotesList ? 'Hide notes' : 'Show notes'}</span>
      </button>
      <button
        className={styles.toggleSidebarBtn}
        onClick={onToggleSyncScroll}
        aria-pressed={syncScrollEnabled}
        style={{ marginLeft: '10px' }}
      >
        <ArrowLeftRight size={16} />
        <span>Sync Scroll: {syncScrollEnabled ? 'On' : 'Off'}</span>
      </button>
      <button
        className={styles.toggleSidebarBtn}
        onClick={onToggleTheme}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        style={{ marginLeft: '10px' }}
      >
        {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        <span>{theme === 'light' ? 'Dark' : 'Light'}</span>
      </button>
    </div>
  );
}

export default Toolbar;
