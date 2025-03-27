import React, { createContext, useContext, useState } from "react";

const SelectedSetListContext = createContext();

export function SelectedSetListProvider({ children }) {
  const [selectedSetList, setSelectedSetList] = useState("");

  return (
    <SelectedSetListContext.Provider
      value={{ selectedSetList, setSelectedSetList }}
    >
      {children}
    </SelectedSetListContext.Provider>
  );
}

export function useSelectedSetListContext() {
  const context = useContext(SelectedSetListContext);
  if (!context) {
    throw new Error(
      "useSelectedSetListContext must be used within a SelectedSetListProvider"
    );
  }
  return context;
}
