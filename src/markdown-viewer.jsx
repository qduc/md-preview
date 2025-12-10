import React, { useState, useEffect } from 'react';
import { FileText, Plus, Trash2, LayoutPanelLeft } from 'lucide-react';

const MarkdownViewer = () => {
  const [notes, setNotes] = useState([]);
  const [currentNoteId, setCurrentNoteId] = useState(null);
  const [content, setContent] = useState('');
  const [showNotesList, setShowNotesList] = useState(false);

  // Load notes from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('markdown-notes');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setNotes(parsed);
        if (parsed.length > 0) {
          setCurrentNoteId(parsed[0].id);
          setContent(parsed[0].content);
        }
      } catch (e) {
        console.error('Failed to load notes:', e);
      }
    }
  }, []);

  // Auto-save current note
  useEffect(() => {
    if (currentNoteId !== null) {
      const timer = setTimeout(() => {
        const updated = notes.map(n =>
          n.id === currentNoteId ? { ...n, content, updatedAt: new Date().toISOString() } : n
        );
        setNotes(updated);
        localStorage.setItem('markdown-notes', JSON.stringify(updated));
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [content, currentNoteId]);

  const createNewNote = () => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const title = `Note ${dateStr} ${timeStr}`;
    
    const newNote = {
      id: Date.now().toString(),
      title,
      content: '',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };
    
    const updated = [newNote, ...notes];
    setNotes(updated);
    setCurrentNoteId(newNote.id);
    setContent('');
    localStorage.setItem('markdown-notes', JSON.stringify(updated));
  };

  const deleteNote = (id) => {
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    localStorage.setItem('markdown-notes', JSON.stringify(updated));
    
    if (currentNoteId === id) {
      if (updated.length > 0) {
        setCurrentNoteId(updated[0].id);
        setContent(updated[0].content);
      } else {
        setCurrentNoteId(null);
        setContent('');
      }
    }
  };

  const switchNote = (id) => {
    const note = notes.find(n => n.id === id);
    if (note) {
      setCurrentNoteId(id);
      setContent(note.content);
    }
  };

  // Markdown to HTML renderer with GitHub-flavored markdown support
  const renderMarkdown = (text) => {
    let html = text;

    // Escape HTML
    html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // Code blocks with syntax highlighting class
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
      const language = lang || 'plain';
      return `<pre class="code-block"><code class="language-${language}">${code.trim()}</code></pre>`;
    });

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

    // Headings
    html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.*?)$/gm, '<h1>$1</h1>');

    // Bold and italic
    html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/_(.*?)_/g, '<em>$1</em>');

    // Links
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

    // Images
    html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" style="max-width: 100%; border-radius: 4px;" />');

    // Lists (unordered)
    html = html.replace(/^\* (.*?)$/gm, '<li>$1</li>');
    html = html.replace(/^\- (.*?)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*?<\/li>)/s, (match) => `<ul>${match}</ul>`);

    // Blockquotes
    html = html.replace(/^> (.*?)$/gm, '<blockquote>$1</blockquote>');

    // Horizontal rule
    html = html.replace(/^---$/gm, '<hr />');

    // Line breaks
    html = html.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br />');
    html = `<p>${html}</p>`;

    // Clean up empty paragraphs
    html = html.replace(/<p><\/p>/g, '');

    return html;
  };

  const currentNote = notes.find(n => n.id === currentNoteId);

  return (
    <div className="markdown-viewer">
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
          background: #fafafa;
          color: #1a1a1a;
        }

        .markdown-viewer {
          display: flex;
          height: 100vh;
          background: #fff;
        }

        .sidebar {
          width: 280px;
          border-right: 1px solid #e5e5e5;
          display: flex;
          flex-direction: column;
          background: #f9f9f9;
          transition: transform 0.3s ease;
        }

        .sidebar.hidden {
          transform: translateX(-100%);
          position: absolute;
          z-index: 10;
          height: 100vh;
        }

        .sidebar-header {
          padding: 20px;
          border-bottom: 1px solid #e5e5e5;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .sidebar-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          font-size: 14px;
          color: #666;
        }

        .new-note-btn {
          padding: 8px 12px;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: background 0.2s;
        }

        .new-note-btn:hover {
          background: #1d4ed8;
        }

        .notes-list {
          flex: 1;
          overflow-y: auto;
          padding: 8px;
        }

        .note-item {
          padding: 12px;
          margin-bottom: 6px;
          background: white;
          border: 1px solid #e5e5e5;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
        }

        .note-item:hover {
          background: #f3f4f6;
          border-color: #d1d5db;
        }

        .note-item.active {
          background: #dbeafe;
          border-color: #2563eb;
        }

        .note-item-content {
          flex: 1;
          min-width: 0;
        }

        .note-item-title {
          font-size: 13px;
          font-weight: 500;
          color: #1a1a1a;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .note-item-date {
          font-size: 11px;
          color: #999;
          margin-top: 4px;
        }

        .delete-btn {
          padding: 4px 6px;
          background: #fee2e2;
          color: #dc2626;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          transition: background 0.2s;
          flex-shrink: 0;
        }

        .delete-btn:hover {
          background: #fecaca;
        }

        .editor-controls {
          padding: 16px 20px;
          border-bottom: 1px solid #e5e5e5;
          background: #f7f7f7;
          display: flex;
          align-items: center;
        }

        .toggle-sidebar-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          border-radius: 8px;
          background: #fff;
          border: 1px solid #d1d5db;
          color: #111827;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
        }

        .toggle-sidebar-btn:hover {
          background: #f0f4f8;
          border-color: #b4bcc8;
        }

        .editor-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .panes-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          flex: 1;
          min-height: 0;
          border-top: 1px solid #e5e5e5;
        }

        .pane {
          display: flex;
          flex-direction: column;
          min-height: 0;
          border-right: 1px solid #e5e5e5;
        }

        .pane:last-child {
          border-right: none;
        }

        .pane-label {
          padding: 12px 20px;
          font-size: 12px;
          font-weight: 600;
          color: #666;
          background: #f9f9f9;
          border-bottom: 1px solid #e5e5e5;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .editor {
          flex: 1;
          padding: 20px;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 14px;
          line-height: 1.6;
          border: none;
          resize: none;
          background: white;
          color: #1a1a1a;
          outline: none;
        }

        .preview {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
          background: white;
          line-height: 1.7;
        }

        .preview p {
          margin-bottom: 12px;
        }

        .preview h1 {
          font-size: 28px;
          font-weight: 700;
          margin: 24px 0 12px;
          color: #000;
        }

        .preview h2 {
          font-size: 24px;
          font-weight: 600;
          margin: 20px 0 10px;
          color: #111;
        }

        .preview h3 {
          font-size: 20px;
          font-weight: 600;
          margin: 16px 0 8px;
          color: #222;
        }

        .preview strong {
          font-weight: 600;
          color: #000;
        }

        .preview em {
          font-style: italic;
          color: #333;
        }

        .preview a {
          color: #2563eb;
          text-decoration: none;
          border-bottom: 1px solid #2563eb;
          transition: color 0.2s;
        }

        .preview a:hover {
          color: #1d4ed8;
        }

        .preview ul {
          margin-left: 20px;
          margin-bottom: 12px;
        }

        .preview li {
          margin-bottom: 6px;
        }

        .preview blockquote {
          padding-left: 16px;
          border-left: 4px solid #d1d5db;
          margin: 12px 0;
          color: #666;
          font-style: italic;
        }

        .preview hr {
          margin: 20px 0;
          border: none;
          border-top: 1px solid #e5e5e5;
        }

        .code-block {
          background: #f5f5f5;
          padding: 12px;
          border-radius: 6px;
          overflow-x: auto;
          margin: 12px 0;
          border: 1px solid #e5e5e5;
        }

        .code-block code {
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 13px;
          color: #333;
          line-height: 1.5;
        }

        .inline-code {
          background: #f0f0f0;
          padding: 2px 6px;
          border-radius: 3px;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 13px;
          color: #d63384;
        }

        /* Tablet and below */
        @media (max-width: 768px) {
          .sidebar {
            position: absolute;
            height: 100vh;
            z-index: 10;
            width: 280px;
          }

          .sidebar.hidden {
            transform: translateX(-100%);
          }

          .panes-container {
            grid-template-columns: 1fr;
          }

          .pane {
            max-height: 50vh;
          }

          .pane:first-child {
            border-right: none;
            border-bottom: 1px solid #e5e5e5;
          }

          .editor {
            padding: 16px;
            font-size: 13px;
          }

          .preview {
            padding: 16px;
            font-size: 14px;
          }

          .pane-label {
            padding: 10px 16px;
            font-size: 11px;
          }
        }

        /* Small phones */
        @media (max-width: 480px) {
          .markdown-viewer {
            height: 100vh;
          }

          .sidebar {
            width: 100%;
          }

          .sidebar-header {
            padding: 16px;
          }

          .sidebar-title {
            font-size: 13px;
          }

          .new-note-btn {
            padding: 6px 10px;
            font-size: 12px;
          }

          .notes-list {
            padding: 6px;
          }

          .note-item {
            padding: 10px;
            margin-bottom: 4px;
          }

          .note-item-title {
            font-size: 12px;
          }

          .note-item-date {
            font-size: 10px;
          }

          .toggle-sidebar-btn {
            padding: 6px 10px;
          }

          .pane {
            max-height: 45vh;
          }

          .editor {
            padding: 12px;
            font-size: 12px;
          }

          .preview {
            padding: 12px;
            font-size: 13px;
          }

          .preview h1 {
            font-size: 22px;
            margin: 16px 0 8px;
          }

          .preview h2 {
            font-size: 18px;
            margin: 14px 0 8px;
          }

          .preview h3 {
            font-size: 16px;
            margin: 12px 0 6px;
          }

          .pane-label {
            padding: 8px 12px;
            font-size: 10px;
          }
        }

        /* Large tablets and desktop improvements */
        @media (min-width: 1024px) {
          .editor {
            font-size: 15px;
          }

          .preview {
            font-size: 15px;
          }
        }

        /* Very large screens */
        @media (min-width: 1440px) {
          .sidebar {
            width: 320px;
          }

          .editor {
            padding: 24px;
            font-size: 16px;
          }

          .preview {
            padding: 24px;
            font-size: 16px;
          }

          .preview p {
            margin-bottom: 16px;
          }
        }

        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: transparent;
        }

        ::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>

      <div className={`sidebar ${!showNotesList ? 'hidden' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-title">
            <FileText size={16} />
            Notes
          </div>
          <button className="new-note-btn" onClick={createNewNote}>
            <Plus size={16} />
            New
          </button>
        </div>
        <div className="notes-list">
          {notes.map(note => (
            <div
              key={note.id}
              className={`note-item ${currentNoteId === note.id ? 'active' : ''}`}
              onClick={() => switchNote(note.id)}
            >
              <div className="note-item-content">
                <div className="note-item-title">{note.title}</div>
                <div className="note-item-date">
                  {new Date(note.updatedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
              <button
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNote(note.id);
                }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="editor-section">
        <div className="editor-controls">
          <button
            className="toggle-sidebar-btn"
            onClick={() => setShowNotesList(!showNotesList)}
            aria-pressed={showNotesList}
          >
            <LayoutPanelLeft size={18} />
            <span>{showNotesList ? 'Hide notes' : 'Show notes'}</span>
          </button>
        </div>

        <div className="panes-container">
          <div className="pane">
            <div className="pane-label">Editor</div>
            <textarea
              className="editor"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start typing your markdown here..."
            />
          </div>

          <div className="pane">
            <div className="pane-label">Preview</div>
            <div
              className="preview"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarkdownViewer;
