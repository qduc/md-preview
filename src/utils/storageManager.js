import { initDB, getAllNotes, saveNotes } from './indexedDB';

class StorageManager {
  constructor(mode = 'localStorage') {
    this.mode = mode;
    this.STORAGE_KEY = 'markdown-notes';
  }

  async loadNotes() {
    if (this.mode === 'localStorage') {
      return this._loadFromLocalStorage();
    } else if (this.mode === 'indexedDB') {
      return this._loadFromIndexedDB();
    }
    return [];
  }

  async saveNotes(notes) {
    if (this.mode === 'localStorage') {
      return this._saveToLocalStorage(notes);
    } else if (this.mode === 'indexedDB') {
      return this._saveToIndexedDB(notes);
    }
  }

  _loadFromLocalStorage() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to load notes from localStorage:', e);
        return [];
      }
    }
    return [];
  }

  async _loadFromIndexedDB() {
    try {
      const db = await initDB();
      const notes = await getAllNotes(db);
      db.close();
      return notes || [];
    } catch (error) {
      console.error('Failed to load notes from IndexedDB:', error);
      return [];
    }
  }

  _saveToLocalStorage(notes) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(notes));
    } catch (error) {
      console.error('Failed to save notes to localStorage:', error);
    }
  }

  async _saveToIndexedDB(notes) {
    try {
      const db = await initDB();
      await saveNotes(db, notes);
      db.close();
    } catch (error) {
      console.error('Failed to save notes to IndexedDB:', error);
    }
  }
}

export { StorageManager };