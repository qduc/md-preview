import { useEffect, useMemo, useRef, useState } from 'react';

const STORAGE_KEY = 'markdown-notes';

export function useNotesStorage() {
  const [notes, setNotes] = useState([]);
  const [currentNoteId, setCurrentNoteId] = useState(null);
  const [content, setContent] = useState('');

  // load notes on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setNotes(parsed);
        if (parsed.length > 0) {
          setCurrentNoteId(parsed[0].id);
          setContent(parsed[0].content);
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Failed to load notes:', e);
      }
    }
  }, []);

  // debounce autosave
  const saveTimer = useRef(null);
  useEffect(() => {
    if (currentNoteId === null) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      const updated = notes.map((n) =>
        n.id === currentNoteId ? { ...n, content, updatedAt: new Date().toISOString() } : n
      );
      setNotes(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }, 500);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const deleteNote = (id) => {
    const updated = notes.filter((n) => n.id !== id);
    setNotes(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
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
    const note = notes.find((n) => n.id === id);
    if (note) {
      setCurrentNoteId(id);
      setContent(note.content);
    }
  };

  const currentNote = useMemo(() => notes.find((n) => n.id === currentNoteId) || null, [notes, currentNoteId]);

  return {
    notes,
    currentNoteId,
    currentNote,
    content,
    setContent,
    createNewNote,
    deleteNote,
    switchNote,
  };
}
