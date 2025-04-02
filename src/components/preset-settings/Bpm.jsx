import React, { useState } from 'react';

function Bpm() {
  const [bpm, setBpm] = useState(120);

  return (
    <select className="header-input" value={bpm} onChange={e => setBpm(Number(e.target.value))}>
      {Array.from({ length: 261 }, (_, i) => 40 + i).map(bpmValue => (
        <option key={bpmValue} value={bpmValue}>
          {bpmValue} BPM
        </option>
      ))}
    </select>
  );
}

export default Bpm;
