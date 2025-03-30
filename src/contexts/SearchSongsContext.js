import React, { createContext, useContext, useState } from 'react';

const SearchSongsContext = createContext();

export function SearchSongsProvider({ children }) {
  const [searchSongs, setSearchSongs] = useState('');

  return (
    <SearchSongsContext.Provider value={{ searchSongs, setSearchSongs }}>
      {children}
    </SearchSongsContext.Provider>
  );
}

export function useSearchSongsContext() {
  const context = useContext(SearchSongsContext);
  if (!context) {
    throw new Error('useSearchSongsContext must be used within a SearchSongsProvider');
  }
  return context;
}
