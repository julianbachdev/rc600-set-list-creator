import React from 'react';

const timeSignatures = [
  '2/4',
  '3/4',
  '4/4',
  '5/4',
  '6/4',
  '7/4',
  '5/8',
  '6/8',
  '7/8',
  '8/8',
  '9/8',
  '10/8',
  '11/8',
  '12/8',
  '13/8',
  '14/8',
  '15/8',
];

function TimeSignature() {
  return (
    <select className="header-input">
      {timeSignatures.map(signature => (
        <option key={signature} value={signature}>
          {signature}
        </option>
      ))}
    </select>
  );
}

export default TimeSignature;
