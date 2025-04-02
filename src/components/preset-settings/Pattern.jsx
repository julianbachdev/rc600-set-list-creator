import React from 'react';

function Pattern({ value, onChange, patterns }) {
  return (
    <select className="header-input" value={value} onChange={e => onChange(e.target.value)}>
      {patterns.map(pattern => (
        <option key={pattern.name} value={pattern.name}>
          {pattern.name}
        </option>
      ))}
    </select>
  );
}

export default Pattern;
