import React, { createContext, useContext, useState } from 'react';

const SelectedSongContext = createContext();

export function SelectedSongProvider({ children }) {
  const [selectedSong, setSelectedSong] = useState('');

  return (
    <SelectedSongContext.Provider
      value={{
        selectedSong,
        setSelectedSong,
      }}
    >
      {children}
    </SelectedSongContext.Provider>
  );
}

export function useSelectedSongContext() {
  const context = useContext(SelectedSongContext);
  if (!context) {
    throw new Error('useSelectedSongContext must be used within a SelectedSongProvider');
  }
  return context;
}
