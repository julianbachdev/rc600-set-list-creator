import React from 'react';

function Bpm() {
  return (
    <select className="header-input" defaultValue={120}>
      {Array.from({ length: 261 }, (_, i) => 40 + i).map(bpm => (
        <option key={bpm} value={bpm}>
          {bpm} BPM
        </option>
      ))}
    </select>
  );
}

export default Bpm;
