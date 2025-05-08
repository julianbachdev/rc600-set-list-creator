import { getTimeSignatures } from '../../utils/settingsHelpers';
import React from 'react';

// Get timeSignatures and remove time signatures you want to include
const timeSignatures = getTimeSignatures().filter(
  signature => !['5/4', '6/4', '7/4', '6/8', '8/8'].includes(signature.name)
);

function TimeSignature({ value, handleChange }) {
  return (
    <select className="header-input" value={value} onChange={e => handleChange(e.target.value)}>
      {timeSignatures.map(signature => (
        <option key={signature.name} value={signature.name}>
          {signature.name}
        </option>
      ))}
    </select>
  );
}

export default TimeSignature;
