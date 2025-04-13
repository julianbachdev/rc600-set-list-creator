import { getPatterns } from '../../utils/settingsHelpers';
import React, { useEffect } from 'react';

function Pattern({ pattern, handleChange, timeSignature, genre }) {
  const patterns = getPatterns(timeSignature, genre.toUpperCase());

  useEffect(() => {
    if (patterns.some(item => item.name === pattern?.toUpperCase())) {
      handleChange(pattern.toUpperCase());
    } else {
      handleChange(patterns[0]?.name.toUpperCase());
    }
  }, [genre, timeSignature]);

  return (
    <select
      className="header-input"
      value={pattern.toUpperCase() || patterns[0]?.name}
      onChange={e => handleChange(e.target.value)}
    >
      {patterns.map(pattern => (
        <option key={pattern.name} value={pattern.name}>
          {pattern.name}
        </option>
      ))}
    </select>
  );
}

export default Pattern;
