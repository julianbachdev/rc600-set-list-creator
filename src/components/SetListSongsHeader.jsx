import { useShowSetListSongsDetailsContext } from '../contexts/ShowSetListSongsDetailsContext.js';
import React from 'react';

function SetListSongsHeader() {
  const { showSetListSongsDetails, setShowSetListSongsDetails } =
    useShowSetListSongsDetailsContext();

  return (
    <div className="header-container">
      <div className="header-container-label">
        <div>SET LISTS SONGS</div>
        <button className="btn-blue px-3" onClick={() => setShowSetListSongsDetails(prev => !prev)}>
          {showSetListSongsDetails ? 'Hide Details' : 'Show Details'}
        </button>
      </div>
    </div>
  );
}

export default SetListSongsHeader;
