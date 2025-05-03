import { useShowSongDetailsContext } from '../contexts/ShowSongDetailsContext.js';
import SearchInput from './SearchInput.jsx';
import React from 'react';

function RepertoireHeader() {
  const { showRepertoireDetails, handleSetShowRepertoireDetails } = useShowSongDetailsContext();

  return (
    <div className="header-container">
      <div className="header-container-label">
        <h2 className="header-container-text">REPERTOIRE</h2>
        <button className="btn-blue truncate px-3" onClick={handleSetShowRepertoireDetails}>
          {showRepertoireDetails ? 'Hide Details' : 'Show Details'}
        </button>
      </div>
      <SearchInput />
    </div>
  );
}

export default RepertoireHeader;
