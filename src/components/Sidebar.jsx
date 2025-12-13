import React, { useEffect, useRef } from 'react';
import { FileText, Trash2 } from 'lucide-react';

function Sidebar({ visible, notes, currentNoteId, onDelete, onSelect, onClose, styles }) {
  const sidebarRef = useRef(null);

  useEffect(() => {
    if (visible) {
      const handleClickOutside = (event) => {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
          onClose();
        }
      };

      document.addEventListener('click', handleClickOutside);
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [visible, onClose]);

  return (
    <div ref={sidebarRef} className={`${styles.sidebar} ${!visible ? styles.hidden : ''}`}>
      <div className={styles.sidebarHeader}>
        <div className={styles.sidebarTitle}>
          <FileText size={16} />
          Notes
        </div>
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
              <div className={styles.noteItemPreview}>
                {note.content ? note.content.split(' ').slice(0, 5).join(' ') + (note.content.split(' ').length > 5 ? '...' : '') : ''}
              </div>
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
