import React, { createContext, useContext, useState } from 'react';
import { useRepertoireContext } from './RepertoireContext';

const ToggleOpenLyricsModalContext = createContext();

export function ToggleOpenLyricsModalProvider({ children }) {
  const { repertoire } = useRepertoireContext();
  const [songFile, setSongFile] = useState('');
  const [repertoireOrSetList, setRepertoireOrSetList] = useState('');
  const [toggleOpenLyricsModal, setToggleOpenLyricsModal] = useState(false);

  function handleToggleOpenLyricsModal(songName, isOpen) {
    const result = repertoire.find(item => item.name === songName);
    setSongFile(result);
    setToggleOpenLyricsModal(isOpen);
  }

  return (
    <ToggleOpenLyricsModalContext.Provider
      value={{
        toggleOpenLyricsModal,
        setToggleOpenLyricsModal,
        songFile,
        setSongFile,
        handleToggleOpenLyricsModal,
        repertoireOrSetList,
        setRepertoireOrSetList,
      }}
    >
      {children}
    </ToggleOpenLyricsModalContext.Provider>
  );
}

export function useToggleOpenLyricsModalContext() {
  const context = useContext(ToggleOpenLyricsModalContext);
  if (!context) {
    throw new Error(
      'useToggleOpenLyricsModalContext must be used within a ToggleOpenLyricsModalProvider'
    );
  }
  return context;
}
