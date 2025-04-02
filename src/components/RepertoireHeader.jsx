import { useShowRepertoireDetailsContext } from '../contexts/ShowRepertoireDetailsContext.js';
import SearchInput from './SearchInput.jsx';
import React from 'react';

function RepertoireHeader() {
  // console.log('REPERTOIRE HEADER');

  const { showRepertoireDetails, handleSetShowRepertoireDetails } =
    useShowRepertoireDetailsContext();

  const buttonLabel = showRepertoireDetails ? 'Hide Details' : 'Show Details';

  return (
    <div className="header-container">
      <div className="header-container-label">
        <h2>REPERTOIRE</h2>
        <button className="btn-blue" onClick={handleSetShowRepertoireDetails}>
          {buttonLabel}
        </button>
      </div>
      <SearchInput />
    </div>
  );
}

export default RepertoireHeader;
