import React, { createContext, useContext, useEffect, useState } from 'react';

const SetListsFinalContext = createContext();

export function SetListsFinalProvider({ children }) {
  const [setListsFinal, setSetListsFinal] = useState([]);

  useEffect(() => {
    if (window.electron) {
      window.electron.ipcRenderer.setDataSaved();
    }
  }, [setListsFinal]);

  return (
    <SetListsFinalContext.Provider value={{ setListsFinal, setSetListsFinal }}>
      {children}
    </SetListsFinalContext.Provider>
  );
}

export function useSetListsFinalContext() {
  const context = useContext(SetListsFinalContext);
  if (!context) {
    throw new Error('useSetListsFinalContext must be used within a SetListsFinalProvider');
  }
  return context;
}
