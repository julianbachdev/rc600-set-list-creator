import { getVariations } from '../../utils/settingsHelpers';
import React, { useEffect } from 'react';

const variations = getVariations();

function Variation({ variation, handleChange }) {
  useEffect(() => {
    handleChange(variation.toUpperCase());
  }, [variation]);

  return (
    <select className="header-input" value={variation} onChange={e => handleChange(e.target.value)}>
      {variations.map(variation => (
        <option key={variation.name} value={variation.name}>
          {variation.name}
        </option>
      ))}
    </select>
  );
}

export default Variation;
