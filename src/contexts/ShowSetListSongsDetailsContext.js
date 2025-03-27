import React, { createContext, useContext, useState } from "react";

const ShowSetListSongsDetailsContext = createContext();

export function ShowSetListSongsDetailsProvider({ children }) {
  const [showSetListSongsDetails, setShowSetListSongsDetails] = useState(false);

  function handleSetShowSetListSongsDetails() {
    setShowSetListSongsDetails((prev) => !prev);
  }

  return (
    <ShowSetListSongsDetailsContext.Provider
      value={{
        showSetListSongsDetails,
        setShowSetListSongsDetails,
        handleSetShowSetListSongsDetails,
      }}
    >
      {children}
    </ShowSetListSongsDetailsContext.Provider>
  );
}

export function useShowSetListSongsDetailsContext() {
  const context = useContext(ShowSetListSongsDetailsContext);
  if (!context) {
    throw new Error(
      "useShowSetListSongsDetailsContext must be used within a ShowSetListSongsDetailsProvider"
    );
  }
  return context;
}
