import React, { useState } from 'react';

function Name() {
  const [name, setName] = useState('');

  function handleChange(e) {
    setName(e.target.value);
  }

  return (
    <input
      placeholder="Preset name"
      className="header-input"
      maxLength={12}
      value={name}
      onChange={handleChange}
    />
  );
}

export default Name;
