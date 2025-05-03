import React from 'react';

function Rhythm({ rhythm, handleChange }) {
  const rhythmNotes = rhythm.toUpperCase();

  return (
    <select
      placeholder="Rhythm"
      className="header-input"
      value={rhythmNotes}
      onChange={e => handleChange(e.target.value)}
    >
      <option value="ON">ON</option>
      <option value="OFF">OFF</option>
    </select>
  );
}

export default Rhythm;
