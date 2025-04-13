import { extractMetadataFromContent } from '../utils/utilityHelpers';
import React, { createContext, useContext, useState } from 'react';

const RepertoireContext = createContext();

export function RepertoireProvider({ children }) {
  const [repertoire, setRepertoire] = useState([]);

  function handleSetRepertoire(data) {
    const newRepertoire = data.map(song => {
      const settingsData = extractMetadataFromContent(song);
      return {
        ...song,
        settings: settingsData,
      };
    });
    setRepertoire(newRepertoire);
  }

  return (
    <RepertoireContext.Provider value={{ repertoire, handleSetRepertoire }}>
      {children}
    </RepertoireContext.Provider>
  );
}

export function useRepertoireContext() {
  return useContext(RepertoireContext);
}
