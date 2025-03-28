import React from "react";
import Bpm from "./Bpm.jsx";
import DrumKit from "./DrumKit.jsx";
import Name from "./Name.jsx";
import TimeSignature from "./TimeSignature.jsx";
import FootSwitch from "./FootSwitch.jsx";
import Assign from "./Assign.jsx";
import PatternGenre from "./PatternGenre.jsx";
import PatternVariation from "./PatternVariation.jsx";
import Pattern from "./Pattern.jsx";

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
