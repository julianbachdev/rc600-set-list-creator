import React, { createContext, useContext, useEffect, useState } from 'react';
import { loadSetListsData } from '../utils/dataHelpers';

const SetListsFinalContext = createContext();

export function SetListsFinalProvider({ children }) {
  const [setListsFinal, setSetListsFinal] = useState([]);

  useEffect(() => {
    loadSetListsData('setListsFinal', setSetListsFinal);
  }, []);

  useEffect(() => {
    if (window.electron) {
      window.electron.ipcRenderer.setDataSaved();
    }
  }, [setListsFinal]);

  function handleSetSetListsFinal(newSetListsFinal) {
    setSetListsFinal(newSetListsFinal);
    window.electron.setDataSaved();
  }

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
