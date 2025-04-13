import { getKits } from '../../utils/settingsHelpers';
import React, { useEffect } from 'react';

const kits = getKits();

function Kit({ kit, handleChange }) {
  useEffect(() => {
    if (kits.some(item => item.name === kit?.toUpperCase())) {
      handleChange(kit.toUpperCase());
    } else {
      handleChange(kits[7]?.name.toUpperCase());
    }
  }, [kit]);

  return (
    <select className="header-input" value={kit} onChange={e => handleChange(e.target.value)}>
      {kits.map(kit => (
        <option key={kit.name} value={kit.name}>
          {kit.name}
        </option>
      ))}
    </select>
  );
}

export default Kit;
