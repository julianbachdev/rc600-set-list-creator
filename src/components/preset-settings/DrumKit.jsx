import React from 'react';

const drumKitTypes = [
  'Kit',
  'Studio',
  'Live',
  'Light',
  'Heavy',
  'Rock',
  'Metal',
  'Jazz',
  'Brush',
  'Cajon',
  'Drum & Bass',
  'R & B',
  'Dance',
  'Techno',
  'Dance Beats',
  'Hip Hop',
  '808 + 909',
];

function DrumKit() {
  return (
    <select className="header-input">
      {drumKitTypes.map(kit => (
        <option key={kit} value={kit}>
          {kit}
        </option>
      ))}
    </select>
  );
}

export default DrumKit;
