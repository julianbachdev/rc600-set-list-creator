import React, { createContext, useContext, useEffect, useState } from 'react';

const SetListsContext = createContext();

export function SetListsProvider({ children }) {
  const [setLists, setSetLists] = useState([]);

  useEffect(() => {
    if (window.electron) {
      window.electron.ipcRenderer.setDataSaved();
    }
  }, [setLists]);

  return (
    <SetListsContext.Provider value={{ setLists, setSetLists }}>
      {children}
    </SetListsContext.Provider>
  );
}

export function useSetListsContext() {
  const context = useContext(SetListsContext);
  if (!context) {
    throw new Error('useSetListsContext must be used within a SetListsProvider');
  }
  return context;
}
