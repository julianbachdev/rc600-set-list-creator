import { useSearchSongsContext } from '../contexts/SearchSongsContext';
import React, { useState, useEffect } from 'react';

function SearchInput() {
  const { setSearchSongs } = useSearchSongsContext();
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchSongs(inputValue);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [inputValue, setSearchSongs]);

  return (
    <div className="header-container-input">
      <input
        type="text"
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        className="header-input"
        placeholder="Search song"
      />
      <button onClick={() => setInputValue('')} className="btn-blue px-3">
        Cancel
      </button>
    </div>
  );
}

export default SearchInput;
