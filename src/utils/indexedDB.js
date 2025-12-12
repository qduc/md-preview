import { useEffect, useState } from 'react';

const DB_NAME = 'MarkdownNotesDB';
const STORE_NAME = 'notes';
const DB_VERSION = 1;

// Initialize IndexedDB database
export async function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error('IndexedDB error:', event.target.error);
      reject(event.target.error);
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('title', 'title', { unique: false });
        store.createIndex('createdAt', 'createdAt', { unique: false });
        store.createIndex('updatedAt', 'updatedAt', { unique: false });
      }
    };
  });
}

// Get all notes from IndexedDB
export async function getAllNotes(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onerror = (event) => {
      console.error('Error getting notes:', event.target.error);
      reject(event.target.error);
    };

    request.onsuccess = (event) => {
      resolve(event.target.result || []);
    };
  });
}

// Save notes to IndexedDB
export async function saveNotes(db, notes) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    transaction.onerror = (event) => {
      console.error('Error saving notes:', event.target.error);
      reject(event.target.error);
    };

    transaction.oncomplete = () => {
      resolve();
    };

    // Clear existing notes and add all current notes
    const clearRequest = store.clear();

    clearRequest.onsuccess = () => {
      notes.forEach((note) => {
        store.add(note);
      });
    };
  });
}

// Custom hook for IndexedDB operations
export function useIndexedDB() {
  const [db, setDb] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function initialize() {
      try {
        const database = await initDB();
        if (isMounted) {
          setDb(database);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Failed to initialize IndexedDB:', err);
          setError(err);
          setLoading(false);
        }
      }
    }

    initialize();

    return () => {
      isMounted = false;
      if (db) {
        db.close();
      }
    };
  }, []);

  return { db, loading, error };
}