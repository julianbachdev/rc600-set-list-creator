import React from 'react';

function KeyTrue({ keyPlayed, keyTrue, handleChange, tuning }) {
  return (
    <input
      placeholder="Relative major"
      className="header-input"
      value={keyTrue}
      onChange={e => handleChange(e.target.value)}
    />
  );
}

export default KeyTrue;
