import React from 'react';
import { FileText, Plus, Trash2 } from 'lucide-react';

function Sidebar({ visible, notes, currentNoteId, onCreate, onDelete, onSelect }) {
  return (
    <div className={`sidebar ${!visible ? 'hidden' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-title">
          <FileText size={16} />
          Notes
        </div>
        <button className="new-note-btn" onClick={onCreate}>
          <Plus size={16} />
          New
        </button>
      </div>
      <div className="notes-list">
        {notes.map((note) => (
          <div
            key={note.id}
            className={`note-item ${currentNoteId === note.id ? 'active' : ''}`}
            onClick={() => onSelect(note.id)}
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
                onDelete(note.id);
              }}
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
