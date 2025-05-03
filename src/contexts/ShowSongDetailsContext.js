import React, { createContext, useContext, useState } from 'react';

const ShowSongDetailsContext = createContext();

export function ShowSongDetailsProvider({ children }) {
  const [showRepertoireDetails, setShowRepertoireDetails] = useState(false);
  const [showSetListSongsDetails, setShowSetListSongsDetails] = useState(false);

  function handleSetShowRepertoireDetails() {
    setShowRepertoireDetails(prev => !prev);
  }

  function handleSetShowSetListSongsDetails() {
    setShowSetListSongsDetails(prev => !prev);
  }

  return (
    <ShowSongDetailsContext.Provider
      value={{
        showRepertoireDetails,
        setShowRepertoireDetails,
        handleSetShowRepertoireDetails,
        showSetListSongsDetails,
        setShowSetListSongsDetails,
        handleSetShowSetListSongsDetails,
      }}
    >
      {children}
    </ShowSongDetailsContext.Provider>
  );
}

export function useShowSongDetailsContext() {
  const context = useContext(ShowSongDetailsContext);
  if (!context) {
    throw new Error('useShowSongDetailsContext must be used within a ShowSongDetailsProvider');
  }
  return context;
}
