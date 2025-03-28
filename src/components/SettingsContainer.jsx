import React from "react";
import PresetSettingsContainer from "./preset-settings/PresetSettingsContainer.jsx";
import CreateRc600Files from "./preset-settings/CreateRc600Files.jsx";

function SettingsContainer() {
  return (
    <div className="container justify-between">
      <PresetSettingsContainer />
      <CreateRc600Files />
    </div>
  );
}

export default SettingsContainer;
