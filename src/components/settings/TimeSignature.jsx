import { getTimeSignatures } from '../../utils/settingsHelpers';
import React from 'react';

const timeSignatures = getTimeSignatures();

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
