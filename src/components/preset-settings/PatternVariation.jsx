import { getVariations } from '../../utils/settingTreeHelpers';
import React from 'react';

const variations = getVariations();

function PatternVariation() {
  return (
    <select className="header-input">
      {variations.map(variation => (
        <option key={variation.name} value={variation.name}>
          {variation.name}
        </option>
      ))}
    </select>
  );
}

export default PatternVariation;
