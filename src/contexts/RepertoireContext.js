import React, { createContext, useContext, useState } from 'react';

const RepertoireContext = createContext();

export function RepertoireProvider({ children }) {
  const [repertoire, setRepertoire] = useState([]);

  return (
    <RepertoireContext.Provider value={{ repertoire, setRepertoire }}>
      {children}
    </RepertoireContext.Provider>
  );
}

export function useRepertoireContext() {
  const context = useContext(RepertoireContext);
  if (!context) {
    throw new Error('useRepertoireContext must be used within a RepertoireProvider');
  }
  return context;
}
