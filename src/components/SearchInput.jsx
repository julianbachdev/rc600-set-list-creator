import { useSearchSongsContext } from '../contexts/SearchSongsContext';
import React, { useState, useEffect } from 'react';

function SearchInput() {
  // console.log('SEARCH INPUT');
  const { setSearchSongs } = useSearchSongsContext();
  const [inputValue, setInputValue] = useState('');

  function handleClearInput() {
    setInputValue('');
  }

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
      <button onClick={handleClearInput} className="btn-blue">
        &#10006;
      </button>
    </div>
  );
}

export default SearchInput;
