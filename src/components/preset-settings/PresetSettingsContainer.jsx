import PatternVariation from './PatternVariation.jsx';
import TimeSignature from './TimeSignature.jsx';
import PatternGenre from './PatternGenre.jsx';
import FootSwitch from './FootSwitch.jsx';
import DrumKit from './DrumKit.jsx';
import Pattern from './Pattern.jsx';
import Assign from './Assign.jsx';
import Name from './Name.jsx';
import Bpm from './Bpm.jsx';
import React from 'react';

function PresetSettingsContainer() {
  return (
    <div className="flex flex-col gap-2">
      <Name />
      <div className="flex">
        <TimeSignature />
        <Bpm />
      </div>
      <div className="flex">
        <PatternGenre />
        <Pattern />
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
