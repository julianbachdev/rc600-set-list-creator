import React from 'react';

function PatternGenre({ value, onChange, genres }) {
  return (
    <select className="header-input" value={value} onChange={e => onChange(e.target.value)}>
      {genres.map(genre => (
        <option key={genre.name} value={genre.name}>
          {genre.name}
        </option>
      ))}
    </select>
  );
}

export default PatternGenre;
