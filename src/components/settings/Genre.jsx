import { getGenres } from '../../utils/settingsHelpers';
import React, { useEffect } from 'react';

function Genre({ genre, handleChange, timeSignature }) {
  const genres = getGenres(timeSignature);

  useEffect(() => {
    if (genres.some(item => item.name === genre?.toUpperCase())) {
      handleChange(genre.toUpperCase());
    } else {
      handleChange(genres[0]?.name.toUpperCase());
    }
  }, [timeSignature]);

  return (
    <select
      className="header-input"
      value={genre?.toUpperCase() || genres[0]}
      onChange={e => handleChange(e.target.value)}
    >
      {genres.map(genre => (
        <option key={genre.name} value={genre.name}>
          {genre.name}
        </option>
      ))}
    </select>
  );
}

export default Genre;
