import React, { useState, useRef } from 'react';
import Sidebar from './components/Sidebar.jsx';
import Toolbar from './components/Toolbar.jsx';
import Editor from './components/Editor.jsx';
import Preview from './components/Preview.jsx';
import { useNotesStorage } from './hooks/useNotesStorage.js';
import { useTheme } from './hooks/useTheme.js';
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
    loading,
  } = useNotesStorage();
  const { theme, toggleTheme } = useTheme();
  const [showNotesList, setShowNotesList] = useState(false);
  const [syncScrollEnabled, setSyncScrollEnabled] = useState(true);
  const [editorWidth, setEditorWidth] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  const editorRef = useRef(null);
  const previewRef = useRef(null);
  const isSyncingRef = useRef(null);
  const containerRef = useRef(null);

  const handleEditorScroll = () => {
    if (!syncScrollEnabled || !editorRef.current || !previewRef.current) return;
    if (isSyncingRef.current === 'preview') return;
    isSyncingRef.current = 'editor';

    const { scrollTop, scrollHeight, clientHeight } = editorRef.current;
    const percentage = scrollTop / (scrollHeight - clientHeight);

    const preview = previewRef.current;
    preview.scrollTop = percentage * (preview.scrollHeight - preview.clientHeight);
    requestAnimationFrame(() => {
      isSyncingRef.current = null;
    });
  };

  const handlePreviewScroll = () => {
    if (!syncScrollEnabled || !editorRef.current || !previewRef.current) return;
    if (isSyncingRef.current === 'editor') return;
    isSyncingRef.current = 'preview';

    const { scrollTop, scrollHeight, clientHeight } = previewRef.current;
    const percentage = scrollTop / (scrollHeight - clientHeight);
    const editor = editorRef.current;
    editor.scrollTop = percentage * (editor.scrollHeight - editor.clientHeight);
    requestAnimationFrame(() => {
      isSyncingRef.current = null;
    });
  };

  const handleResizeStart = (e) => {
    e.preventDefault();
    setIsResizing(true);
    document.addEventListener('mousemove', handleResize);
    document.addEventListener('mouseup', handleResizeEnd);
  };

  const handleResize = (e) => {
    if (!isResizing || !containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
    
    // Ensure minimum and maximum widths
    const constrainedWidth = Math.max(10, Math.min(90, newWidth));
    setEditorWidth(constrainedWidth);
  };

  const handleResizeEnd = () => {
    setIsResizing(false);
    document.removeEventListener('mousemove', handleResize);
    document.removeEventListener('mouseup', handleResizeEnd);
  };

  return (
    <div className={styles.markdownViewer} data-theme={theme}>
      <Sidebar
        visible={showNotesList}
        notes={notes}
        currentNoteId={currentNoteId}
        onDelete={deleteNote}
        onSelect={switchNote}
        onClose={() => setShowNotesList(false)}
        styles={styles}
      />

      {loading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading notes...</p>
        </div>
      )}

      <div className={styles.editorSection}>
        <Toolbar
          showNotesList={showNotesList}
          onToggleSidebar={() => setShowNotesList(!showNotesList)}
          syncScrollEnabled={syncScrollEnabled}
          onToggleSyncScroll={() => setSyncScrollEnabled(!syncScrollEnabled)}
          theme={theme}
          onToggleTheme={toggleTheme}
          onCreate={createNewNote}
          styles={styles}
        />

        <div className={styles.panesContainer} ref={containerRef}>
          <Editor
            value={content}
            onChange={setContent}
            placeholder="Start typing your markdown here..."
            styles={styles}
            scrollRef={editorRef}
            onScroll={handleEditorScroll}
            editorWidth={editorWidth}
          />
          <div
            className={styles.resizeHandle}
            onMouseDown={handleResizeStart}
          />
          <Preview
            content={content}
            styles={styles}
            scrollRef={previewRef}
            onScroll={handlePreviewScroll}
          />
        </div>
      </div>
    </div>
  );
};

export default MarkdownViewer;
