import React, { createContext, useContext, useState } from 'react';

const ShowRepertoireDetailsContext = createContext();

export function ShowRepertoireDetailsProvider({ children }) {
  const [showRepertoireDetails, setShowRepertoireDetails] = useState(false);

  function handleSetShowRepertoireDetails() {
    setShowRepertoireDetails(prev => !prev);
  }

  return (
    <ShowRepertoireDetailsContext.Provider
      value={{
        showRepertoireDetails,
        setShowRepertoireDetails,
        handleSetShowRepertoireDetails,
      }}
    >
      {children}
    </ShowRepertoireDetailsContext.Provider>
  );
}

export function useShowRepertoireDetailsContext() {
  const context = useContext(ShowRepertoireDetailsContext);
  if (!context) {
    throw new Error(
      'useShowRepertoireDetailsContext must be used within a ShowRepertoireDetailsProvider'
    );
  }
  return context;
}
