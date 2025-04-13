import React from 'react';

function Bpm({ bpmValue, handleChange }) {
  return (
    <select
      className="header-input"
      value={bpmValue}
      onChange={e => handleChange(Number(e.target.value))}
    >
      {Array.from({ length: 261 }, (_, i) => 40 + i).map(bpmValue => (
        <option key={bpmValue} value={bpmValue}>
          {bpmValue} BPM
        </option>
      ))}
    </select>
  );
}

export default Bpm;
