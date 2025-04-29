import { useShowRepertoireDetailsContext } from '../contexts/ShowRepertoireDetailsContext.js';
import SearchInput from './SearchInput.jsx';
import React from 'react';

function RepertoireHeader() {
  const { showRepertoireDetails, handleSetShowRepertoireDetails } =
    useShowRepertoireDetailsContext();

  const buttonLabel = showRepertoireDetails ? 'Hide Details' : 'Show Details';

  return (
    <div className="header-container">
      <div className="header-container-label">
        <h2 className="header-container-text">REPERTOIRE</h2>
        <button className="btn-blue truncate px-3" onClick={handleSetShowRepertoireDetails}>
          {buttonLabel}
        </button>
      </div>
      <SearchInput />
    </div>
  );
}

export default RepertoireHeader;
