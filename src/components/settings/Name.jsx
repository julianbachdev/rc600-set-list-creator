import React from 'react';

function Name({ songName, handleChange, placeholder }) {
  return (
    <input
      placeholder={placeholder}
      className="header-input"
      maxLength={12}
      value={songName}
      onChange={e => handleChange(e.target.value)}
    />
  );
}

export default Name;
