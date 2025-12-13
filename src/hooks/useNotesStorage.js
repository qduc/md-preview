import { useEffect, useMemo, useRef, useState } from 'react';
import { StorageManager } from '../utils/storageManager';
import { getStorageMode } from '../config/storage';

const STORAGE_KEY = 'markdown-notes';

// Load initial state from localStorage (fallback for tests)
function loadInitialNotes() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to load notes:', e);
      return [];
    }
  }
  return [];
}

export function useNotesStorage() {
  const [notes, setNotes] = useState(() => {
    // Always start with localStorage data for immediate UI response
    return loadInitialNotes();
  });
  const notesRef = useRef(notes);
  useEffect(() => {
    notesRef.current = notes;
  }, [notes]);
  const [currentNoteId, setCurrentNoteId] = useState(() => {
    const initialNotes = loadInitialNotes();
    return initialNotes.length > 0 ? initialNotes[0].id : null;
  });
  const [content, setContent] = useState(() => {
    const initialNotes = loadInitialNotes();
    return initialNotes.length > 0 ? initialNotes[0].content : '';
  });
  const [loading, setLoading] = useState(false);

  // Get current storage mode
  const storageMode = getStorageMode();

  // Initialize storage manager
  const storageManager = useMemo(() => new StorageManager(storageMode), [storageMode]);

  // Load notes from the configured storage on mount
  useEffect(() => {
    let isMounted = true;

    async function loadNotes() {
      try {
        setLoading(true);
        const loadedNotes = await storageManager.loadNotes();
        if (isMounted) {
          if (loadedNotes.length > 0) {
            setNotes(loadedNotes);
            setCurrentNoteId(loadedNotes[0].id);
            setContent(loadedNotes[0].content);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error('Failed to load notes:', error);
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    // Only load if using IndexedDB, otherwise use the initial localStorage load
    if (storageMode === 'indexedDB') {
      loadNotes();
    }

    return () => {
      isMounted = false;
    };
  }, [storageManager, storageMode]);

  // debounce autosave
  const saveTimer = useRef(null);

  const createNewNote = (initialContent = '') => {
    // Ensure initialContent is a string to prevent circular reference errors
    const safeContent = typeof initialContent === 'string' ? initialContent : '';
    
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const title = `Note ${dateStr} ${timeStr}`;
    const newNote = {
      id: Date.now().toString(),
      title,
      content: safeContent,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };
    const updated = [newNote, ...notes];
    setNotes(updated);
    setCurrentNoteId(newNote.id);
    setContent(safeContent);
    storageManager.saveNotes(updated);
  };

  // autosave
  useEffect(() => {
    if (currentNoteId === null) {
      if (content.trim() !== '') {
        // Create a new note with the current content
        const now = new Date();
        const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const title = `Note ${dateStr} ${timeStr}`;
        const newNote = {
          id: Date.now().toString(),
          title,
          content,
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
        };
        const updated = [newNote, ...notesRef.current];
        setNotes(updated);
        setCurrentNoteId(newNote.id);
        storageManager.saveNotes(updated);
        // Note: setContent is not needed here since content is already set
      }
      return;
    }
    // debounce save for existing notes
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      const currentNote = notesRef.current.find((n) => n.id === currentNoteId);
      const hasContentChanged = !currentNote || currentNote.content !== content;
      if (hasContentChanged) {
        const updated = notesRef.current.map((n) =>
          n.id === currentNoteId ? { ...n, content, updatedAt: new Date().toISOString() } : n
        );
        setNotes(updated);
        storageManager.saveNotes(updated);
      }
    }, 500);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [content, currentNoteId]);

  const deleteNote = (id) => {
    const updated = notes.filter((n) => n.id !== id);
    setNotes(updated);
    storageManager.saveNotes(updated);
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
    loading,
  };
}
