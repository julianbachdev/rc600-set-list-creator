import { getKits } from '../../utils/settingsHelpers';
import React from 'react';

const kits = getKits();

function DrumKit() {
  return (
    <select className="header-input">
      {kits.map(kit => (
        <option key={kit.name} value={kit.name}>
          {kit.name}
        </option>
      ))}
    </select>
  );
}

export default DrumKit;
