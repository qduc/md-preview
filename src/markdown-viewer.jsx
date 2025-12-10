import React, { useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import Toolbar from './components/Toolbar.jsx';
import Editor from './components/Editor.jsx';
import Preview from './components/Preview.jsx';
import { useNotesStorage } from './hooks/useNotesStorage.js';
import styles from './styles/markdown-viewer.module.css';

const MarkdownViewer = () => {
  const {
    notes,
    currentNoteId,
    content,
    setContent,
    createNewNote,
    deleteNote,
    switchNote,
  } = useNotesStorage();
  const [showNotesList, setShowNotesList] = useState(false);

  return (
    <div className={styles.markdownViewer}>
      <Sidebar
        visible={showNotesList}
        notes={notes}
        currentNoteId={currentNoteId}
        onCreate={createNewNote}
        onDelete={deleteNote}
        onSelect={switchNote}
        styles={styles}
      />

      <div className={styles.editorSection}>
        <Toolbar
          showNotesList={showNotesList}
          onToggleSidebar={() => setShowNotesList(!showNotesList)}
          styles={styles}
        />

        <div className={styles.panesContainer}>
          <Editor
            value={content}
            onChange={setContent}
            placeholder="Start typing your markdown here..."
            styles={styles}
          />
          <Preview
            content={content}
            styles={styles}
          />
        </div>
      </div>
    </div>
  );
};

export default MarkdownViewer;
