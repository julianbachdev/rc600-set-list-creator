import React from 'react';

function KeyTrue({ keyTrue, handleChange }) {
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
