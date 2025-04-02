import React from 'react';

function TimeSignature({ value, onChange, timeSignatures }) {
  return (
    <select className="header-input" value={value} onChange={e => onChange(e.target.value)}>
      {timeSignatures.map(signature => (
        <option key={signature.name} value={signature.name}>
          {signature.name}
        </option>
      ))}
    </select>
  );
}

export default TimeSignature;
