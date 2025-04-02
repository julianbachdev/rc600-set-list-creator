import { getTimeSignatures, getGenres, getPatterns } from '../../utils/settingTreeHelpers';
import React, { useState, useEffect, useMemo } from 'react';
import PatternVariation from './PatternVariation.jsx';
import TimeSignature from './TimeSignature.jsx';
import PatternGenre from './PatternGenre.jsx';
import FootSwitch from './FootSwitch.jsx';
import DrumKit from './DrumKit.jsx';
import Pattern from './Pattern.jsx';
import Assign from './Assign.jsx';
import Name from './Name.jsx';
import Bpm from './Bpm.jsx';

function PresetSettingsContainer() {
  const [timeSignature, setTimeSignature] = useState('2/4');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedPattern, setSelectedPattern] = useState('');
  const availableGenres = getGenres(timeSignature);
  const availablePatterns = useMemo(
    () => (selectedGenre ? getPatterns(timeSignature, selectedGenre) : []),
    [timeSignature, selectedGenre]
  );

  useEffect(() => {
    if (availableGenres.length > 0) {
      const userGenre = availableGenres.find(genre => genre.name === 'USER');
      setSelectedGenre(userGenre ? userGenre.name : availableGenres[0].name);
    }
  }, [timeSignature]);

  useEffect(() => {
    if (availablePatterns.length > 0) {
      setSelectedPattern(availablePatterns[0].name);
    }
  }, [selectedGenre]);

  return (
    <div className="flex flex-col gap-2">
      <Name />
      <div className="flex">
        <TimeSignature
          value={timeSignature}
          onChange={setTimeSignature}
          timeSignatures={getTimeSignatures()}
        />
        <Bpm />
      </div>
      <div className="flex">
        <PatternGenre value={selectedGenre} onChange={setSelectedGenre} genres={availableGenres} />
        <Pattern
          value={selectedPattern}
          onChange={setSelectedPattern}
          patterns={availablePatterns}
        />
      </div>
      <div className="flex">
        <PatternVariation />
        <DrumKit />
      </div>
      <FootSwitch />
      <Assign />
    </div>
  );
}

export default PresetSettingsContainer;
