import React from 'react';

function Name({ songName, handleChange, placeholder }) {
  return (
    <input
      placeholder={placeholder}
      className="header-input"
      value={songName}
      maxLength={12}
      onChange={e => handleChange(e.target.value.slice(0, 12))}
    />
  );
}

export default Name;
