import React from 'react';
import { FileText, Plus, Trash2 } from 'lucide-react';

function Sidebar({ visible, notes, currentNoteId, onCreate, onDelete, onSelect, styles }) {
  return (
    <div className={`${styles.sidebar} ${!visible ? styles.hidden : ''}`}>
      <div className={styles.sidebarHeader}>
        <div className={styles.sidebarTitle}>
          <FileText size={16} />
          Notes
        </div>
        <button className={styles.newNoteBtn} onClick={onCreate}>
          <Plus size={16} />
          New
        </button>
      </div>
      <div className={styles.notesList}>
        {notes.map((note) => (
          <div
            key={note.id}
            className={`${styles.noteItem} ${currentNoteId === note.id ? styles.active : ''}`}
            onClick={() => onSelect(note.id)}
          >
            <div className={styles.noteItemContent}>
              <div className={styles.noteItemTitle}>{note.title}</div>
              <div className={styles.noteItemDate}>
                {new Date(note.updatedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
            <button
              className={styles.deleteBtn}
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
