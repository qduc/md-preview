import React, { useState } from 'react';
import { setStorageMode, getStorageMode } from '../config/storage';
import styles from '../styles/storage-settings.module.css';

const StorageSettings = () => {
  const [currentMode, setCurrentMode] = useState(getStorageMode());
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleStorageModeChange = (mode) => {
    if (mode === currentMode) return;
    
    setShowConfirmation(true);
    // The actual change will happen after confirmation
  };

  const confirmStorageChange = () => {
    const newMode = currentMode === 'localStorage' ? 'indexedDB' : 'localStorage';
    const success = setStorageMode(newMode);
    
    if (success) {
      setCurrentMode(newMode);
      // Reload the page to apply the new storage mode
      window.location.reload();
    }
    
    setShowConfirmation(false);
  };

  const cancelStorageChange = () => {
    setShowConfirmation(false);
  };

  return (
    <div className={styles.storageSettingsContainer}>
      <div className={styles.storageSetting}>
        <span className={styles.storageLabel}>Storage Mode:</span>
        <div className={styles.storageOptions}>
          <button
            className={`${styles.storageButton} ${currentMode === 'localStorage' ? styles.active : ''}`}
            onClick={() => handleStorageModeChange('localStorage')}
            disabled={currentMode === 'localStorage'}
          >
            localStorage
          </button>
          <button
            className={`${styles.storageButton} ${currentMode === 'indexedDB' ? styles.active : ''}`}
            onClick={() => handleStorageModeChange('indexedDB')}
            disabled={currentMode === 'indexedDB'}
          >
            IndexedDB
          </button>
        </div>
      </div>

      {showConfirmation && (
        <div className={styles.confirmationDialog}>
          <div className={styles.confirmationContent}>
            <p>Changing storage mode will reload the page and may affect your notes.</p>
            <p>Are you sure you want to switch to {currentMode === 'localStorage' ? 'IndexedDB' : 'localStorage'}?</p>
            <div className={styles.confirmationButtons}>
              <button className={styles.confirmButton} onClick={confirmStorageChange}>
                Confirm
              </button>
              <button className={styles.cancelButton} onClick={cancelStorageChange}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StorageSettings;