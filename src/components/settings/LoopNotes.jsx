import React from 'react';

function LoopNotes({ loop, handleChange }) {
  const loopNotes = loop.toLowerCase();

  return (
    <input
      placeholder="Loop notes"
      className="header-input"
      value={loopNotes}
      onChange={e => handleChange(e.target.value)}
    />
  );
}

export default LoopNotes;
