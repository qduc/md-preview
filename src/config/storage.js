// Storage configuration
// Set the storage mode: 'localStorage' or 'indexedDB'
// localStorage is simpler but has size limitations (~5MB)
// IndexedDB can store more data but is more complex

const STORAGE_MODE = 'localStorage'; // Default to localStorage for compatibility

// Function to get current storage mode
function getStorageMode() {
  // Check if user has a preference in localStorage
  const savedMode = localStorage.getItem('storageMode');
  return savedMode || STORAGE_MODE;
}

// Function to set storage mode
function setStorageMode(mode) {
  if (mode === 'localStorage' || mode === 'indexedDB') {
    localStorage.setItem('storageMode', mode);
    return true;
  }
  return false;
}

// Export configuration
export { STORAGE_MODE, getStorageMode, setStorageMode };