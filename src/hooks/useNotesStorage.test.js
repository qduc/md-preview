import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useNotesStorage } from './useNotesStorage';

// Mock the storage configuration to use localStorage for tests
vi.mock('../config/storage', () => ({
  STORAGE_MODE: 'localStorage',
  getStorageMode: () => 'localStorage',
}));

// Mock IndexedDB functions to prevent errors
vi.mock('../utils/indexedDB', () => ({
  initDB: vi.fn().mockResolvedValue({}),
  getAllNotes: vi.fn().mockResolvedValue([]),
  saveNotes: vi.fn().mockResolvedValue(undefined),
}));


// Helper to setup localStorage mock data
const setupLocalStorage = (data) => {
  localStorage.getItem.mockReturnValue(JSON.stringify(data));
};

// Helper to clear localStorage mock
const clearLocalStorage = () => {
  localStorage.getItem.mockReturnValue(null);
  localStorage.setItem.mockClear();
  localStorage.removeItem.mockClear();
  localStorage.clear.mockClear();
};

describe('useNotesStorage', () => {
  beforeEach(() => {
    clearLocalStorage();
  });

  describe('Initial state', () => {
    it('should initialize with empty notes when localStorage is empty', () => {
      const { result } = renderHook(() => useNotesStorage());

      expect(result.current.notes).toEqual([]);
      expect(result.current.currentNoteId).toBeNull();
      expect(result.current.content).toBe('');
    });

    it('should load notes from localStorage on mount', () => {
      const mockNotes = [
        {
          id: '1',
          title: 'Test Note',
          content: 'Test content',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      setupLocalStorage(mockNotes);

      const { result } = renderHook(() => useNotesStorage());

      expect(result.current.notes).toEqual(mockNotes);
      expect(result.current.currentNoteId).toBe('1');
      expect(result.current.content).toBe('Test content');
    });

    it('should handle corrupted localStorage data gracefully', () => {
      localStorage.getItem.mockReturnValue('invalid json {');
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const { result } = renderHook(() => useNotesStorage());

      expect(result.current.notes).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it('should select the first note as current when loading from storage', () => {
      const mockNotes = [
        {
          id: '1',
          title: 'First',
          content: 'First content',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'Second',
          content: 'Second content',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      setupLocalStorage(mockNotes);

      const { result } = renderHook(() => useNotesStorage());

      expect(result.current.currentNoteId).toBe('1');
      expect(result.current.content).toBe('First content');
    });
  });

  describe('Creating notes', () => {
    it('should create a new note', () => {
      const { result } = renderHook(() => useNotesStorage());

      act(() => {
        result.current.createNewNote();
      });

      expect(result.current.notes).toHaveLength(1);
      expect(result.current.notes[0]).toMatchObject({
        content: '',
        title: expect.stringContaining('Note'),
      });
      expect(result.current.notes[0].id).toBeTruthy();
      expect(result.current.currentNoteId).toBe(result.current.notes[0].id);
      expect(result.current.content).toBe('');
    });

    it('should add new notes to the beginning of the list', () => {
      const mockNotes = [
        {
          id: '1',
          title: 'Existing',
          content: 'Existing content',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      setupLocalStorage(mockNotes);

      const { result } = renderHook(() => useNotesStorage());

      act(() => {
        result.current.createNewNote();
      });

      expect(result.current.notes).toHaveLength(2);
      expect(result.current.notes[0].content).toBe('');
      expect(result.current.notes[1].id).toBe('1');
    });

    it('should save new note to localStorage', () => {
      const { result } = renderHook(() => useNotesStorage());

      act(() => {
        result.current.createNewNote();
      });

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'markdown-notes',
        expect.stringContaining('"content":""')
      );
    });

    it('should generate unique IDs for new notes', async () => {
      const { result } = renderHook(() => useNotesStorage());

      act(() => {
        result.current.createNewNote();
      });

      // Small delay to ensure unique timestamp
      await new Promise(resolve => setTimeout(resolve, 5));

      act(() => {
        result.current.createNewNote();
      });

      const ids = result.current.notes.map((n) => n.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(2);
    });

    it('should create note with timestamp-based title', () => {
      const { result } = renderHook(() => useNotesStorage());

      act(() => {
        result.current.createNewNote();
      });

      expect(result.current.notes[0].title).toMatch(/^Note .+/);
    });
  });

  describe('Deleting notes', () => {
    it('should delete a note by id', () => {
      const mockNotes = [
        {
          id: '1',
          title: 'Note 1',
          content: 'Content 1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'Note 2',
          content: 'Content 2',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      setupLocalStorage(mockNotes);

      const { result } = renderHook(() => useNotesStorage());

      act(() => {
        result.current.deleteNote('1');
      });

      expect(result.current.notes).toHaveLength(1);
      expect(result.current.notes[0].id).toBe('2');
    });

    it('should save to localStorage after deletion', () => {
      const mockNotes = [
        {
          id: '1',
          title: 'Note 1',
          content: 'Content 1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      setupLocalStorage(mockNotes);

      const { result } = renderHook(() => useNotesStorage());

      act(() => {
        result.current.deleteNote('1');
      });

      expect(localStorage.setItem).toHaveBeenCalledWith('markdown-notes', JSON.stringify([]));
    });

    it('should switch to first remaining note when deleting current note', () => {
      const mockNotes = [
        {
          id: '1',
          title: 'Note 1',
          content: 'Content 1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'Note 2',
          content: 'Content 2',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      setupLocalStorage(mockNotes);

      const { result } = renderHook(() => useNotesStorage());

      act(() => {
        result.current.deleteNote('1');
      });

      expect(result.current.currentNoteId).toBe('2');
      expect(result.current.content).toBe('Content 2');
    });

    it('should clear state when deleting the last note', () => {
      const mockNotes = [
        {
          id: '1',
          title: 'Note 1',
          content: 'Content 1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      setupLocalStorage(mockNotes);

      const { result } = renderHook(() => useNotesStorage());

      act(() => {
        result.current.deleteNote('1');
      });

      expect(result.current.currentNoteId).toBeNull();
      expect(result.current.content).toBe('');
      expect(result.current.notes).toEqual([]);
    });

    it('should not affect state when deleting non-existent note', () => {
      const mockNotes = [
        {
          id: '1',
          title: 'Note 1',
          content: 'Content 1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      setupLocalStorage(mockNotes);

      const { result } = renderHook(() => useNotesStorage());

      act(() => {
        result.current.deleteNote('999');
      });

      expect(result.current.notes).toHaveLength(1);
      expect(result.current.currentNoteId).toBe('1');
    });
  });

  describe('Switching notes', () => {
    it('should switch to a different note', () => {
      const mockNotes = [
        {
          id: '1',
          title: 'Note 1',
          content: 'Content 1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'Note 2',
          content: 'Content 2',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      setupLocalStorage(mockNotes);

      const { result } = renderHook(() => useNotesStorage());

      act(() => {
        result.current.switchNote('2');
      });

      expect(result.current.currentNoteId).toBe('2');
      expect(result.current.content).toBe('Content 2');
    });

    it('should do nothing when switching to non-existent note', () => {
      const mockNotes = [
        {
          id: '1',
          title: 'Note 1',
          content: 'Content 1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      setupLocalStorage(mockNotes);

      const { result } = renderHook(() => useNotesStorage());
      const initialId = result.current.currentNoteId;
      const initialContent = result.current.content;

      act(() => {
        result.current.switchNote('999');
      });

      expect(result.current.currentNoteId).toBe(initialId);
      expect(result.current.content).toBe(initialContent);
    });
  });

  describe('Content editing and autosave', () => {

    it('should update content when setContent is called', () => {
      const mockNotes = [
        {
          id: '1',
          title: 'Note 1',
          content: 'Original content',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      setupLocalStorage(mockNotes);

      const { result } = renderHook(() => useNotesStorage());

      act(() => {
        result.current.setContent('New content');
      });

      expect(result.current.content).toBe('New content');
    });

    it('should debounce autosave (500ms)', () => {
      vi.useFakeTimers();
      const mockNotes = [
        {
          id: '1',
          title: 'Note 1',
          content: 'Original',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      setupLocalStorage(mockNotes);

      const { result } = renderHook(() => useNotesStorage());

      // Clear initial setItem call from loading
      localStorage.setItem.mockClear();

      act(() => {
        result.current.setContent('New content');
      });

      // Should not save immediately
      expect(localStorage.setItem).not.toHaveBeenCalled();

      // Advance time by 500ms
      act(() => {
        vi.advanceTimersByTime(500);
      });

      // Should save after debounce
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'markdown-notes',
        expect.stringContaining('New content')
      );
      vi.restoreAllMocks();
    });

    it('should cancel previous autosave timer on rapid changes', () => {
      vi.useFakeTimers();
      const mockNotes = [
        {
          id: '1',
          title: 'Note 1',
          content: 'Original',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      setupLocalStorage(mockNotes);

      const { result } = renderHook(() => useNotesStorage());
      localStorage.setItem.mockClear();

      act(() => {
        result.current.setContent('Change 1');
      });

      act(() => {
        vi.advanceTimersByTime(200);
      });

      act(() => {
        result.current.setContent('Change 2');
      });

      act(() => {
        vi.advanceTimersByTime(200);
      });

      // Should not have saved yet
      expect(localStorage.setItem).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(300);
      });

      // Should save only once with latest content
      expect(localStorage.setItem).toHaveBeenCalledTimes(1);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'markdown-notes',
        expect.stringContaining('Change 2')
      );
      vi.restoreAllMocks();
    });

    it('should update updatedAt timestamp on content change', () => {
      vi.useFakeTimers();
      const oldDate = new Date('2020-01-01').toISOString();
      const mockNotes = [
        {
          id: '1',
          title: 'Note 1',
          content: 'Original',
          createdAt: oldDate,
          updatedAt: oldDate,
        },
      ];
      setupLocalStorage(mockNotes);

      const { result } = renderHook(() => useNotesStorage());
      localStorage.setItem.mockClear();

      act(() => {
        result.current.setContent('Updated content');
      });

      act(() => {
        vi.advanceTimersByTime(500);
      });

      const savedData = JSON.parse(localStorage.setItem.mock.calls[0][1]);
      expect(new Date(savedData[0].updatedAt).getTime()).toBeGreaterThan(new Date(oldDate).getTime());
      vi.restoreAllMocks();
    });
    });

    it('should create a new note when typing in empty state', () => {
      const { result } = renderHook(() => useNotesStorage());

      act(() => {
        result.current.setContent('New content');
      });

      expect(result.current.notes).toHaveLength(1);
      expect(result.current.notes[0].content).toBe('New content');
      expect(result.current.currentNoteId).toBe(result.current.notes[0].id);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'markdown-notes',
        expect.stringContaining('New content')
      );
    });
  });

  describe('currentNote computed value', () => {
    it('should return the current note object', () => {
      const mockNotes = [
        {
          id: '1',
          title: 'Note 1',
          content: 'Content 1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'Note 2',
          content: 'Content 2',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      setupLocalStorage(mockNotes);

      const { result } = renderHook(() => useNotesStorage());

      expect(result.current.currentNote).toEqual(mockNotes[0]);
    });

    it('should return null when no note is selected', () => {
      localStorage.getItem.mockReturnValue(null);
      const { result } = renderHook(() => useNotesStorage());

      expect(result.current.currentNote).toBeNull();
    });

    it('should update when switching notes', () => {
      const mockNotes = [
        {
          id: '1',
          title: 'Note 1',
          content: 'Content 1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'Note 2',
          content: 'Content 2',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      setupLocalStorage(mockNotes);

      const { result } = renderHook(() => useNotesStorage());

      act(() => {
        result.current.switchNote('2');
      });

      expect(result.current.currentNote).toEqual(mockNotes[1]);
    });
  });
;
