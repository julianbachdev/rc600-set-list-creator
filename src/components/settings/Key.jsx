import React from 'react';

function Key({ keyValue, handleChange }) {
  return (
    <input
      placeholder="Key"
      className="header-input"
      value={keyValue}
      onChange={e => handleChange(e.target.value)}
    />
  );
}

export default Key;
